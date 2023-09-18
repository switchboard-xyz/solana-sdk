use crate::*;

#[derive(Accounts)]
pub struct StartRound<'info> {
    #[account(
        mut,
        seeds = [b"MY_RAFFLE", raffle.load()?.authority.as_ref()],
        bump = raffle.load()?.bump,
        has_one = function,
    )]
    pub raffle: AccountLoader<'info, RaffleAccount>,
    #[account(mut)]
    pub function: AccountLoader<'info, FunctionAccountData>,

    /// CHECK:
    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    pub switchboard: AccountInfo<'info>,
    /// CHECK:
    #[account(
        seeds = [STATE_SEED],
        seeds::program = switchboard.key(),
        bump = state.load()?.bump,
      )]
    pub state: AccountLoader<'info, AttestationProgramState>,
    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    /// CHECK:
    #[account(
        mut,
        signer,
        owner = system_program.key(),
        constraint = request.data_len() == 0 && request.lamports() == 0
      )]
    pub request: AccountInfo<'info>,
    /// CHECK:
    #[account(
        mut,
        owner = system_program.key(),
        constraint = request.data_len() == 0 && request.lamports() == 0
      )]
    pub request_escrow: AccountInfo<'info>,
    // TOKEN ACCOUNTS
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl StartRound<'_> {
    pub fn validate(&self, ctx: &Context<Self>) -> Result<()> {
        // Validate the current round is empty or previously closed
        if !ctx.accounts.raffle.load()?.ready_to_start() {
            return Err(error!(MyError::RoundStartNotReady));
        }

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>) -> Result<()> {
        let timestamp = Clock::get()?.unix_timestamp;
        let mut raffle = ctx.accounts.raffle.load_mut()?;

        raffle.previous_round = raffle.current_round;
        raffle.current_round = RaffleRound {
            id: raffle.previous_round.id.checked_add(1).unwrap(),
            is_closed: false,
            request: ctx.accounts.request.key(),
            open_slot: Clock::get()?.slot,
            open_timestamp: timestamp,
            close_slot: Clock::get()?.slot + raffle.slots_per_round as u64,
        };

        let request_params = format!(
            "PID={},RAFFLE={},ROUND_CLOSE_SLOT={}",
            crate::id(),
            ctx.accounts.raffle.key(),
            { raffle.current_round.close_slot }
        );

        let request_init_ctx = FunctionRequestInitAndTrigger {
            request: ctx.accounts.request.to_account_info(),
            function: ctx.accounts.function.to_account_info(),
            escrow: ctx.accounts.request_escrow.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            state: ctx.accounts.state.to_account_info(),
            attestation_queue: ctx.accounts.attestation_queue.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
            associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        };
        request_init_ctx.invoke(
            ctx.accounts.switchboard.clone(),
            None,                              // bounty
            None,                              // expiration
            Some(512),                         // max params len
            Some(request_params.into_bytes()), // params
            None,                              // garbage collection slot
            None,                              // valid after slot
        )?;

        // TODO: We may need to fund the token account after it gets initialized in the CPI

        Ok(())
    }
}
