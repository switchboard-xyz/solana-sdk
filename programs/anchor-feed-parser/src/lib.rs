#[allow(unaligned_references)]
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
use std::convert::TryInto;
pub use switchboard_v2::{
    AggregatorAccountData, SwitchboardDecimal, SWITCHBOARD_V2_DEVNET, SWITCHBOARD_V2_MAINNET,
};

declare_id!("FnsPs665aBSwJRu2A8wGv6ZT76ipR41kHm4hoA3B1QGh");

#[account(zero_copy)]
#[derive(AnchorDeserialize, Debug)]
pub struct FeedClient {}

#[derive(Accounts)]
#[instruction(params: ReadResultParams)]
pub struct ReadResult<'info> {
    /// CHECK:
    pub aggregator: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ReadResultParams {
    pub max_confidence_interval: Option<f64>,
}

#[program]
pub mod anchor_feed_parser {
    use super::*;

    pub fn read_result(
        ctx: Context<ReadResult>,
        params: ReadResultParams,
    ) -> anchor_lang::Result<()> {
        let aggregator = &ctx.accounts.aggregator;

        // check feed owner
        let owner = *aggregator.owner;
        if owner != SWITCHBOARD_V2_DEVNET && owner != SWITCHBOARD_V2_MAINNET {
            return Err(error!(FeedErrorCode::InvalidSwitchboardAccount));
        }

        // load and deserialize feed
        let feed = AggregatorAccountData::new(aggregator)?;

        // get result
        let val: f64 = feed.get_result()?.try_into()?;

        // check whether the feed has been updated in the last 300 seconds
        feed.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)
            .map_err(|_| error!(FeedErrorCode::StaleFeed))?;

        // check feed does not exceed max_confidence_interval
        if let Some(max_confidence_interval) = params.max_confidence_interval {
            feed.check_confidence_interval(SwitchboardDecimal::from_f64(max_confidence_interval))
                .map_err(|_| error!(FeedErrorCode::ConfidenceIntervalExceeded))?;
        }

        msg!("Current feed result is {}!", val);

        Ok(())
    }
}

#[error_code]
#[derive(Eq, PartialEq)]
pub enum FeedErrorCode {
    #[msg("Not a valid Switchboard account")]
    InvalidSwitchboardAccount,
    #[msg("Switchboard feed has not been updated in 5 minutes")]
    StaleFeed,
    #[msg("Switchboard feed exceeded provided confidence interval")]
    ConfidenceIntervalExceeded,
}
