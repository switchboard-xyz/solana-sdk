use crate::*;

#[derive(Accounts)]
pub struct RefreshPrices<'info> {
    #[account(
        seeds = [PROGRAM_SEED],
        bump = program.load()?.bump,
        // constraint = program.load()?.is_valid_enclave(&quote.load()?.mr_enclave) @ BasicOracleError::InvalidMrEnclave
    )]
    pub program: AccountLoader<'info, MyProgramState>,

    #[account(
        mut,
        seeds = [ORACLE_SEED],
        bump = oracle.load()?.bump
    )]
    pub oracle: AccountLoader<'info, MyOracleState>,

    pub function: AccountLoader<'info, FunctionAccountData>,

    #[account(
        seeds = [QUOTE_SEED, function.key().as_ref()],
        bump = quote.load()?.bump,
        seeds::program = SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        has_one = enclave_signer @ BasicOracleError::InvalidTrustedSigner,
        constraint = 
            quote.load()?.mr_enclave != [0u8; 32] @ BasicOracleError::EmptySwitchboardQuote
    )]
    pub quote: AccountLoader<'info, EnclaveAccountData>,

    pub enclave_signer: Signer<'info>,
}


#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct RefreshPricesParams {
    pub symbols: Vec<OracleDataWithTradingSymbol>,
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

        // for data in params.data

        // if let Some(btc) = params.btc { 
        //     oracle.btc = btc;
        // }

        // if let Some(eth) = params.eth { 
        //     oracle.eth = eth;
        // }

        // if let Some(sol) = params.sol { 
        //     oracle.sol = sol;
        // }

        // if let Some(usdt) = params.usdt { 
        //     oracle.usdt = usdt;
        // }

        // if let Some(usdc) = params.usdc { 
        //     oracle.usdc = usdc;
        // }

        Ok(())
    }
}
