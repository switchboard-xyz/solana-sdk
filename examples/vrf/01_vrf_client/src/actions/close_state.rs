use crate::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
use anchor_spl::token::Token;
pub use switchboard_solana::{VrfAccountData, VrfClose, VrfCloseParams, PERMISSION_SEED};

#[derive(Accounts)]
#[instruction(params: CloseStateParams)]
pub struct CloseState<'info> {
    #[account(
        mut,
        close = sol_dest,
        seeds = [
            STATE_SEED, 
            vrf.key().as_ref(),
            authority.key().as_ref(),
        ],
        bump = state.load()?.bump,
        has_one = vrf
    )]
    pub state: AccountLoader<'info, VrfClient>,
    /// CHECK:
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    /// CHECK:
    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,
    #[account(mut)]
    pub vrf: AccountLoader<'info, VrfAccountData>,
    #[account(
        mut, 
        constraint = escrow.mint == escrow_dest.mint && escrow.owner == program_state.key()
    )]
    pub escrow: Account<'info, TokenAccount>,

    /// SWITCHBOARD ACCOUNTS
    #[account(
        mut,
        seeds = [
            PERMISSION_SEED,
            queue_authority.key().as_ref(),
            oracle_queue.key().as_ref(),
            vrf.key().as_ref()
        ],
        bump = state.load()?.permission_bump,
        seeds::program = switchboard_program.key()
    )]
    pub permission: AccountLoader<'info, PermissionAccountData>,
    #[account(
        constraint = oracle_queue.load()?.authority == queue_authority.key()
    )]
    pub oracle_queue: AccountLoader<'info, OracleQueueAccountData>,
    /// CHECK:
    pub queue_authority: AccountInfo<'info>,
    #[account(
        seeds = [STATE_SEED], 
        bump = state.load()?.switchboard_state_bump,
        seeds::program = switchboard_program.key()
    )]
    pub program_state: AccountLoader<'info, SbState>,

    /// CHECK:
    pub sol_dest: SystemAccount<'info>,
    /// CHECK:
    #[account(mut)]
    pub escrow_dest: Account<'info, TokenAccount>,

    /// CHECK:
    #[account(
        constraint = 
            switchboard_program.executable == true 
            && *switchboard_program.key == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub switchboard_program: AccountInfo<'info>,

    /// SYSTEM ACCOUNTS
    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, Token>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct CloseStateParams {}

impl CloseState<'_> {
    pub fn validate(&self, ctx: &Context<Self>, params: &CloseStateParams) -> Result<()> {
        msg!("Validate init");

        // TODO: Validate the current user doesnt have an open request

        // 1500 slots, 400ms/slot = about 10min
        if ctx.accounts.vrf.load()?.current_round.request_slot != 0 && ctx.accounts.vrf.load()?.current_round.request_slot + 1500 > clock::Clock::get()?.slot {
            return Err(error!(VrfErrorCode::VrfCloseNotReady));
        }

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &CloseStateParams) -> Result<()> {
        msg!("Actuate init");
        let client_state = ctx.accounts.state.load()?;
        let bump = client_state.bump.clone();
        let max_result = client_state.max_result;

        let permission_bump = client_state.permission_bump.clone();
        let switchboard_state_bump = client_state.switchboard_state_bump.clone();
        drop(client_state);

        // get pda seeds
        let vrf_key = ctx.accounts.vrf.key();
        let authority_key = ctx.accounts.authority.key.clone();
        msg!("bump: {}", bump);
        msg!("authority: {}", authority_key);
        msg!("vrf: {}", vrf_key);
        let state_seeds: &[&[&[u8]]] = &[&[
            &STATE_SEED,
            vrf_key.as_ref(),
            authority_key.as_ref(),
            &[bump],
        ]];

        let vrf_close = VrfClose {
            authority: ctx.accounts.state.to_account_info(),
            vrf: ctx.accounts.vrf.to_account_info(),
            permission: ctx.accounts.permission.to_account_info(),
            queue: ctx.accounts.oracle_queue.to_account_info(),
            queue_authority: ctx.accounts.queue_authority.to_account_info(),
            program_state: ctx.accounts.program_state.to_account_info(),
            escrow: ctx.accounts.escrow.clone(),
            sol_dest: ctx.accounts.sol_dest.to_account_info(),
            escrow_dest: ctx.accounts.escrow_dest.clone(),
            token_program: ctx.accounts.token_program.to_account_info(),
        };

        msg!("closing VRF account");
        vrf_close.invoke_signed(
            ctx.accounts.switchboard_program.to_account_info(),
            switchboard_state_bump,
            permission_bump,
            state_seeds,
        )?;
        msg!("VRF account closed!");

        Ok(())
    }
}
