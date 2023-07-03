use crate::*;

#[derive(Accounts)]
#[instruction(params: InitializeParams)] // rpc parameters hint
pub struct Initialize<'info> {
    #[account(
        init,
        space = 8 + std::mem::size_of::<MyProgramState>(),
        payer = payer,
        seeds = [PROGRAM_SEED],
        bump
    )]
    pub program: AccountLoader<'info, MyProgramState>,

    #[account(
        init,
        space = 8 + std::mem::size_of::<MyOracleState>(),
        payer = payer,
        seeds = [ORACLE_SEED],
        bump
    )]
    pub oracle: AccountLoader<'info, MyOracleState>,

    #[account(
        constraint = function.load()?.authority == program.key()
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,

    /// CHECK:
    pub authority: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    // SYSTEM ACCOUNTS
    pub system_program: Program<'info, System>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct InitializeParams {}

impl Initialize<'_> {
    pub fn validate(
        &self,
        _ctx: &Context<Self>,
        params: &InitializeParams,
    ) -> anchor_lang::Result<()> {
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &InitializeParams) -> anchor_lang::Result<()> {
        let program = &mut ctx.accounts.program.load_init()?;
        program.bump = *ctx.bumps.get("program").unwrap_or(&0);
        program.authority = ctx.accounts.authority.key();
        program.function = ctx.accounts.function.key();

        let oracle = &mut ctx.accounts.oracle.load_init()?;
        oracle.bump = *ctx.bumps.get("oracle").unwrap_or(&0);
        Ok(())
    }
}
