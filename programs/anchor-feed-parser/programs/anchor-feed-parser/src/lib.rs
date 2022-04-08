#[allow(unaligned_references)]
use anchor_lang::prelude::*;
use std::convert::TryInto;
pub use switchboard_aggregator::AggregatorAccountData;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[derive(Accounts)]
#[instruction(params: ReadResultParams)]
pub struct ReadResult<'info> {
    /// CHECK:
    pub aggregator: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ReadResultParams {}

#[program]
pub mod anchor_feed_parser {
    use super::*;

    pub fn read_result(
        ctx: Context<ReadResult>,
        _params: ReadResultParams,
    ) -> anchor_lang::Result<()> {
        let aggregator = &ctx.accounts.aggregator;
        let val: f64 = AggregatorAccountData::new(aggregator)?
            .get_result()?
            .try_into()?;

        msg!("Current feed result is {}!", val);
        Ok(())
    }
}
