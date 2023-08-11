use crate::*;

#[derive(Accounts)]
pub struct CloseRound<'info> {
    #[account(
        mut,
        seeds = [b"MY_RAFFLE", raffle.load()?.authority.as_ref()],
        bump = raffle.load()?.bump,
        has_one = function,
        constraint = raffle.load()?.current_round.request == request.key() @ MyError::InvalidRequest
    )]
    pub raffle: AccountLoader<'info, RaffleAccount>,

    // SWITCHBOARD ACCOUNTS
    pub function: AccountLoader<'info, FunctionAccountData>,
    #[account(
      constraint = request.validate_signer(
          &function.to_account_info(),
          &enclave_signer.to_account_info()
        )?
    )]
    pub request: Box<Account<'info, FunctionRequestAccountData>>,
    pub enclave_signer: Signer<'info>,
}

impl CloseRound<'_> {
    pub fn validate(&self, _ctx: &Context<Self>) -> Result<()> {
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>) -> Result<()> {
        let mut raffle = ctx.accounts.raffle.load_mut()?;

        if !raffle.ready_to_close() {
            return Err(error!(MyError::RoundCloseNotReady));
        }

        raffle.current_round.is_closed = true;

        // Implement your custom logic here

        Ok(())
    }
}
