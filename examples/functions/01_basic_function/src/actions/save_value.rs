use crate::*;
use anchor_lang::prelude::*;
pub use switchboard_solana::AggregatorAccountData;

#[derive(Accounts)]
#[instruction(params: SaveValueParams)]
pub struct SaveValue<'info> {
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct SaveValueParams {
    pub max_confidence_interval: Option<f64>,
}

impl SaveValue<'_> {
    pub fn validate(&self, _ctx: &Context<Self>, params: &SaveValueParams) -> Result<()> {
        msg!("Validate init");

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &SaveValueParams) -> Result<()> {
        msg!("Actuate init");

        Ok(())
    }
}
