use switchboard_solana::prelude::*;

declare_id!("4hfkS97f5P6zauWeJF5dcZDFaJwYwbMPvKrANVAuKN4p");

#[program]
pub mod switchboard_feed_client {
    use super::*;

    pub fn read_feed(ctx: Context<ReadFeed>, params: ReadFeedParams) -> Result<()> {
        let feed = &ctx.accounts.aggregator.load()?;

        // get result
        let val: f64 = feed.get_result()?.try_into()?;

        // check whether the feed has been updated in the last 300 seconds
        feed.check_staleness(
            solana_program::clock::Clock::get().unwrap().unix_timestamp,
            300,
        )
        .map_err(|_| error!(SwitchboardClientError::StaleFeed))?;

        // check feed does not exceed max_confidence_interval
        if let Some(max_confidence_interval) = params.max_confidence_interval {
            feed.check_confidence_interval(SwitchboardDecimal::from_f64(max_confidence_interval))
                .map_err(|_| error!(SwitchboardClientError::ConfidenceIntervalExceeded))?;
        }

        msg!("Current feed result is {}!", val);

        Ok(())
    }

    pub fn read_history(ctx: Context<ReadHistory>, params: ReadHistoryParams) -> Result<()> {
        let history_buffer = AggregatorHistoryBuffer::new(&ctx.accounts.history_buffer)?;

        let timestamp: i64;
        if let Some(i) = params.timestamp {
            timestamp = i;
        } else {
            // one hour ago
            timestamp = Clock::get()?.unix_timestamp - 3600;
        }

        let value_at_timestamp: f64 = history_buffer
            .lower_bound(timestamp)
            .unwrap()
            .value
            .try_into()?;
        msg!("Result {:?}!", value_at_timestamp);

        Ok(())
    }
}

#[error_code]
#[derive(Eq, PartialEq)]
pub enum SwitchboardClientError {
    #[msg("Not a valid Switchboard account")]
    InvalidSwitchboardAccount,
    #[msg("Switchboard feed has not been updated in 5 minutes")]
    StaleFeed,
    #[msg("Switchboard feed exceeded provided confidence interval")]
    ConfidenceIntervalExceeded,
    #[msg("History buffer mismatch")]
    InvalidHistoryBuffer,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ReadFeedParams {
    pub max_confidence_interval: Option<f64>,
}

#[derive(Accounts)]
#[instruction(params: ReadFeedParams)]
pub struct ReadFeed<'info> {
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
}

#[derive(Accounts)]
#[instruction(params: ReadHistoryParams)]
pub struct ReadHistory<'info> {
    #[account(
        has_one = history_buffer @ SwitchboardClientError::InvalidHistoryBuffer
    )]
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
    /// CHECK: verified in the aggregator has_one check
    pub history_buffer: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ReadHistoryParams {
    pub timestamp: Option<i64>,
}
