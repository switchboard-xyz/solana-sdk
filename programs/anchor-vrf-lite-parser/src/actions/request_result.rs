use crate::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
use anchor_spl::token::Token;
pub use switchboard_v2::{
    OracleQueueAccountData, PermissionAccountData, SbState, VrfLiteAccountData, VrfLiteRequestRandomness,
    VrfSetCallback,
};

#[derive(Accounts)]
#[instruction(params: RequestResultParams)] // rpc parameters hint
pub struct RequestResult<'info> {
    #[account(
        mut,
        seeds = [
            STATE_SEED, 
            vrf.key().as_ref(),
            authority.key().as_ref(),
        ],
        bump = state.load()?.bump,
        has_one = vrf @ VrfErrorCode::InvalidVrfAccount,
        has_one = authority @ VrfErrorCode::InvalidAuthorityError
    )]
    pub state: AccountLoader<'info, VrfClient>,
    /// CHECK:
    #[account(signer)]
    pub authority: AccountInfo<'info>,

    // SWITCHBOARD ACCOUNTS
    #[account(mut,
        has_one = escrow,
        constraint = 
            *vrf.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub vrf: AccountLoader<'info, VrfLiteAccountData>,
    /// CHECK
    #[account(mut, 
        has_one = data_buffer,
        constraint = 
            oracle_queue.load()?.authority == queue_authority.key()
            && *oracle_queue.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub oracle_queue: AccountLoader<'info, OracleQueueAccountData>,
    /// CHECK: Will be checked in the CPI instruction
    pub queue_authority: UncheckedAccount<'info>,
    /// CHECK
    #[account(mut, 
        constraint = 
            *data_buffer.owner == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub data_buffer: AccountInfo<'info>,
    /// CHECK
    #[account(mut, 
        constraint = 
            *permission.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub permission: AccountLoader<'info, PermissionAccountData>,
    #[account(mut, 
        constraint = 
            escrow.owner == program_state.key() 
            && escrow.mint == program_state.load()?.token_mint
    )]
    pub escrow: Account<'info, TokenAccount>,
    /// CHECK: Will be checked in the CPI instruction
    #[account(mut, 
        constraint = 
            *program_state.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub program_state: AccountLoader<'info, SbState>,
    /// CHECK:
    #[account(
        constraint = 
            switchboard_program.executable == true 
            && *switchboard_program.key == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub switchboard_program: AccountInfo<'info>,

    // SYSTEM ACCOUNTS
    /// CHECK:
    #[account(address = solana_program::sysvar::recent_blockhashes::ID)]
    pub recent_blockhashes: AccountInfo<'info>,
    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, Token>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct RequestResultParams {
}

impl RequestResult<'_> {
    pub fn validate(&self, _ctx: &Context<Self>, _params: &RequestResultParams) -> Result<()> {
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, _params: &RequestResultParams) -> Result<()> {
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

        // first set callback
        let vrf_set_callback = VrfSetCallback {
            authority: ctx.accounts.state.to_account_info(),
            vrf: ctx.accounts.vrf.to_account_info(),
        };
        let callback = UpdateResult::to_callback(
            &vrf_set_callback.authority,
            &vrf_set_callback.vrf.key(),
            &UpdateResultParams {},
        )?;

        // then request randomness
        let vrf_request_randomness = VrfLiteRequestRandomness {
            authority: ctx.accounts.state.to_account_info(),
            vrf_lite: ctx.accounts.vrf.to_account_info(),
            queue: ctx.accounts.oracle_queue.to_account_info(),
            queue_authority: ctx.accounts.queue_authority.to_account_info(),
            data_buffer: ctx.accounts.data_buffer.to_account_info(),
            permission: ctx.accounts.permission.to_account_info(),
            escrow: ctx.accounts.escrow.clone(),
            recent_blockhashes: ctx.accounts.recent_blockhashes.to_account_info(),
            program_state: ctx.accounts.program_state.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        };

        msg!("requesting randomness");
        vrf_request_randomness.invoke_signed(
            ctx.accounts.switchboard_program.to_account_info(),
            Some(callback),
            state_seeds,
        )?;

        let mut client_state = ctx.accounts.state.load_mut()?;
        client_state.result = 0;

        emit!(RequestingRandomness {
            vrf_client: ctx.accounts.state.key(),
            max_result: max_result,
            timestamp: clock::Clock::get().unwrap().unix_timestamp
        });

        msg!("randomness requested successfully");
        Ok(())
    }
}
