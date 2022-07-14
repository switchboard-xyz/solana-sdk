#[allow(unaligned_references)]
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
use std::convert::TryInto;
pub use switchboard_v2::{AggregatorAccountData, SWITCHBOARD_V2_DEVNET, SWITCHBOARD_V2_MAINNET};

declare_id!("FnsPs665aBSwJRu2A8wGv6ZT76ipR41kHm4hoA3B1QGh");

#[account(zero_copy)]
#[derive(AnchorDeserialize, Debug)]
pub struct FeedClient {}

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

        // check feed owner
        let owner = *aggregator.owner;
        if owner != SWITCHBOARD_V2_DEVNET && owner != SWITCHBOARD_V2_MAINNET {
            return Err(error!(FeedErrorCode::InvalidSwitchboardVrfAccount));
        }

        // load and deserialize feed
        let feed = AggregatorAccountData::new(aggregator)?;

        // check if feed has updated in the last 5 minutes
        let staleness = clock::Clock::get().unwrap().unix_timestamp
            - feed.latest_confirmed_round.round_open_timestamp;
        if staleness > 300 {
            msg!("Feed has not been updated in {} seconds!", staleness);
            return Err(error!(FeedErrorCode::StaleFeed));
        }

        // get result
        let val: f64 = feed.get_result()?.try_into()?;
        msg!("Current feed result is {}!", val);

        Ok(())
    }
}

#[error_code]
#[derive(Eq, PartialEq)]
pub enum FeedErrorCode {
    #[msg("Not a valid Switchboard VRF account")]
    InvalidSwitchboardVrfAccount,
    #[msg("Switchboard feed has not been updated in 5 minutes")]
    StaleFeed,
}
