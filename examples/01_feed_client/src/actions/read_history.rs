use crate::*;
use anchor_lang::prelude::*;
pub use switchboard_solana::AggregatorAccountData;

#[derive(Accounts)]
#[instruction(params: ReadHistoryParams)]
pub struct ReadHistory<'info> {
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ReadHistoryParams {
    pub max_confidence_interval: Option<f64>,
}

impl ReadHistory<'_> {
    pub fn validate(&self, _ctx: &Context<Self>, params: &ReadHistoryParams) -> Result<()> {
        msg!("Validate init");

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &ReadHistoryParams) -> Result<()> {
        msg!("Actuate init");

        Ok(())
    }
}
