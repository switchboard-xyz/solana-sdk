#[allow(unaligned_references)]
use anchor_lang::prelude::*;
use std::convert::TryInto;
pub use switchboard_v2::AggregatorAccountData;

declare_id!("H7frfaL4ZjRW6NAyBvuGgsi9P2G1CgVgqFqzFSDS521f");

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
