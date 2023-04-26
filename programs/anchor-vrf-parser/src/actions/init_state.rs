use crate::*;
use anchor_lang::prelude::*;
pub use switchboard_v2::VrfAccountData;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{spl_token::instruction::AuthorityType, Mint, MintTo, Token, TokenAccount},
};

#[derive(Accounts)]
#[instruction(params: InitStateParams)]
pub struct InitState<'info> {
    #[account(
        init,
        seeds = [
            STATE_SEED, 
            vrf.key().as_ref(),
            authority.key().as_ref(),
        ],
        payer = payer,
        space = 8 + std::mem::size_of::<VrfClient>(),
        bump,
    )]
    pub state: AccountLoader<'info, VrfClient>,
    /// CHECK:
    pub authority: AccountInfo<'info>,

    #[account(
        constraint = 
            *vrf.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub vrf: AccountLoader<'info, VrfAccountData>,

    // Escrow allows to sign for the request_randomness payer_authority
    // Authority has to be the state so the signer can act on behalf of VRF authority and payer_authority
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = state,
    )]
    pub state_escrow: Account<'info, TokenAccount>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    /// CHECK:
    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(address = solana_program::system_program::ID)]
    pub system_program: Program<'info, System>,
    /// CHECK:
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct InitStateParams {
    pub max_result: u64,
    pub permission_bump: u8,
    pub switchboard_state_bump: u8,
}

impl InitState<'_> {
    pub fn validate(&self, _ctx: &Context<Self>, params: &InitStateParams) -> Result<()> {
        msg!("Validate init");
        if params.max_result > MAX_RESULT {
            return Err(error!(VrfErrorCode::MaxResultExceedsMaximum));
        }

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &InitStateParams) -> Result<()> {
        msg!("Actuate init");

        msg!("Checking VRF Account");
        let vrf = ctx.accounts.vrf.load()?;
        // client state needs to be authority in order to sign request randomness instruction
        if vrf.authority != ctx.accounts.state.key() {
            return Err(error!(VrfErrorCode::InvalidAuthorityError));
        }
        drop(vrf);

        msg!("Setting VrfClient state");
        let mut state = ctx.accounts.state.load_init()?;
        *state = VrfClient::default();
        state.bump = ctx.bumps.get("state").unwrap().clone();
        state.authority = ctx.accounts.authority.key.clone();
        state.vrf = ctx.accounts.vrf.key();
        state.permission_bump = params.permission_bump;
        state.switchboard_state_bump = params.switchboard_state_bump;

        msg!("Setting VrfClient max_result");
        if params.max_result == 0 {
            state.max_result = MAX_RESULT;
        } else {
            state.max_result = params.max_result;
        }

        Ok(())
    }
}
