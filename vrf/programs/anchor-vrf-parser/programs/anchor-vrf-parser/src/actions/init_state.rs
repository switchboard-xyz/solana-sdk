use crate::*;
use anchor_lang::prelude::*;
pub use switchboard_v2::VrfAccountData;

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
        space = 8 + 8,
        bump,
    )]
    pub state: AccountLoader<'info, VrfClient>,
    /// CHECK:
    pub authority: AccountInfo<'info>,
    /// CHECK:
    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,
    /// CHECK:
    pub vrf: AccountInfo<'info>,
    #[account(address = solana_program::system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct InitStateParams {
    pub max_result: u64,
}

impl InitState<'_> {
    pub fn validate(&self, ctx: &Context<Self>, params: &InitStateParams) -> Result<()> {
        msg!("Validate init");
        if params.max_result > MAX_RESULT {
            return Err(error!(VrfErrorCode::MaxResultExceedsMaximum));
        }

        msg!("Checking VRF Account");
        let vrf_account_info = &ctx.accounts.vrf;
        let _vrf = VrfAccountData::new(vrf_account_info)
            .map_err(|_| VrfErrorCode::InvalidSwitchboardVrfAccount)?;

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &InitStateParams) -> Result<()> {
        msg!("Actuate init");
        let state = &mut ctx.accounts.state.load_init()?;
        msg!("Setting max result");
        if params.max_result == 0 {
            state.max_result = MAX_RESULT;
        } else {
            state.max_result = params.max_result;
        }

        msg!("Setting VRF Account");
        state.vrf = ctx.accounts.vrf.key.clone();
        state.authority = ctx.accounts.authority.key.clone();
        state.bump = ctx.bumps.get("state").unwrap().clone();

        Ok(())
    }
}
