use crate::*;

#[derive(Accounts)]
pub struct RefreshPrices<'info> {
    #[account(
        mut,
        seeds = [ORACLE_SEED],
        bump = oracle.load()?.bump
    )]
    pub oracle: AccountLoader<'info, MyOracleState>,

    // We use this to verify the functions enclave state
    #[account(
        constraint =
            function.load()?.validate(
              &enclave_signer.to_account_info()
            )? @ BasicOracleError::FunctionValidationFailed
          //   FunctionAccountData::validate(
          //     &function.to_account_info(),
          //     &enclave_signer.to_account_info()
          // )? @ BasicOracleError::FunctionValidationFailed
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,
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
        msg!("saving oracle data");
        oracle.save_rows(&params.rows)?;

        Ok(())
    }
}
