use crate::*;
use anchor_lang::prelude::*;
pub use switchboard_solana::AggregatorAccountData;

#[derive(Accounts)]
#[instruction(params: ReadFeedParams)]
pub struct ReadFeed<'info> {
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ReadFeedParams {
    pub max_confidence_interval: Option<f64>,
}

impl ReadFeed<'_> {
    pub fn validate(&self, _ctx: &Context<Self>, params: &ReadFeedParams) -> Result<()> {
        msg!("Validate init");

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &ReadFeedParams) -> Result<()> {
        msg!("Actuate init");

        Ok(())
    }
}
