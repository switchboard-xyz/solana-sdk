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
    /// CHECK:
    pub authority: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    // SYSTEM ACCOUNTS
    pub system_program: Program<'info, System>,
    /// CHECK:
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct InitializeParams {
    pub mr_enclaves: Vec<[u8; 32]>,
}

impl Initialize<'_> {
    pub fn validate(
        &self,
        _ctx: &Context<Self>,
        params: &InitializeParams,
    ) -> anchor_lang::Result<()> {
        if params.mr_enclaves.len() > 32 {
            return Err(error!(BasicOracleError::ArrayOverflow));
        }
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &InitializeParams) -> anchor_lang::Result<()> {
        let program = &mut ctx.accounts.program.load_init()?;
        program.bump = *ctx.bumps.get("program").unwrap_or(&0);
        program.authority = ctx.accounts.authority.key();
        if !params.mr_enclaves.is_empty() {
            program.mr_enclaves = parse_mr_enclaves(&params.mr_enclaves)?;
        }

        let oracle = &mut ctx.accounts.oracle.load_init()?;
        oracle.bump = *ctx.bumps.get("oracle").unwrap_or(&0);
        Ok(())
    }
}
