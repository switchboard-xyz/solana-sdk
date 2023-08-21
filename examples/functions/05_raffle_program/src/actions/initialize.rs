use crate::*;

#[derive(Accounts)]
#[instruction(params: InitializeParams)] // rpc parameters hint
pub struct Initialize<'info> {
    #[account(
        init,
        space = 8 + std::mem::size_of::<RaffleAccount>(),
        payer = payer,
        seeds = [
          b"MY_RAFFLE",
          authority.key().as_ref(),
          params.recent_slot.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub raffle: AccountLoader<'info, RaffleAccount>,

    pub function: AccountLoader<'info, FunctionAccountData>,

    pub authority: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct InitializeParams {
    pub recent_slot: u64,
    pub slots_per_round: u32,
    pub difficulty: u8,
    pub max_entries: u32,
    pub max_rounds: u32,
}

impl Initialize<'_> {
    pub fn validate(&self, _ctx: &Context<Self>, params: &InitializeParams) -> Result<()> {
        if params.slots_per_round >= MAX_SLOTS_PER_ROUND {
            return Err(error!(MyError::InvalidRoundLen));
        }
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &InitializeParams) -> Result<()> {
        let mut raffle = ctx.accounts.raffle.load_init()?;
        raffle.bump = *ctx.bumps.get("raffle").unwrap();

        // accounts
        raffle.authority = ctx.accounts.authority.key();
        raffle.function = ctx.accounts.function.key();

        // config
        raffle.difficulty = params.difficulty;
        raffle.creation_slot = params.recent_slot;
        raffle.slots_per_round = params.slots_per_round;
        raffle.max_entries = params.max_entries;
        raffle.max_rounds = params.max_rounds;
        Ok(())
    }
}
