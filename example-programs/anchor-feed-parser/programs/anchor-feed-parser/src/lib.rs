#[allow(unaligned_references)]
use anchor_lang::prelude::*;
use std::convert::TryInto;
pub use switchboard_aggregator::AggregatorAccountData;

declare_id!("3Y2v9gVaFAKTDqcxxs8oSRWV8K9ctkCB8yiC6KA4sFz5");

#[derive(Accounts)]
pub struct ReadResult<'info> {
    /// CHECK:
    pub aggregator: AccountInfo<'info>,
}

#[program]
pub mod anchor_feed_parser {
    use super::*;

    pub fn read_result(ctx: Context<ReadResult>) -> anchor_lang::Result<()> {
        let aggregator = &ctx.accounts.aggregator;
        let val: f64 = AggregatorAccountData::new(aggregator)?
            .get_result()?
            .try_into()?;

        msg!("Current feed result is {}!", val);
        Ok(())
    }
}
