use crate::*;

#[derive(Accounts)]
pub struct RefreshPrices<'info> {
    #[account(
        seeds = [PROGRAM_SEED],
        bump = program_state.load()?.bump,
        has_one = function @ BasicOracleError::IncorrectSwitchboardFunction,
    )]
    pub program_state: AccountLoader<'info, MyProgramState>,

    #[account(
        mut,
        seeds = [ORACLE_SEED],
        bump = oracle.load()?.bump
    )]
    pub oracle: AccountLoader<'info, MyOracleState>,

    // We use this to derive and verify the functions enclave state
    #[account(
        constraint = 
            FunctionAccountData::validate_enclave(
                &function.to_account_info(), 
                &enclave.to_account_info(), 
                &enclave_signer.to_account_info()
            )?
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,
    pub enclave: AccountLoader<'info, EnclaveAccountData>,
    pub enclave_signer: Signer<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct RefreshPricesParams {
    pub rows: Vec<OracleDataWithTradingSymbol>,
}

impl RefreshPrices<'_> {
    pub fn validate(
        &self,
        _ctx: &Context<Self>,
        _params: &RefreshPricesParams,
    ) -> anchor_lang::Result<()> {
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &RefreshPricesParams) -> anchor_lang::Result<()> {
        let oracle = &mut ctx.accounts.oracle.load_mut()?;
        oracle.save_rows(&params.rows)?;

        Ok(())
    }
}
