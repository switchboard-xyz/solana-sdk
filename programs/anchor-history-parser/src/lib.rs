use anchor_lang::prelude::*;
pub use switchboard_v2::{
    AggregatorAccountData, AggregatorHistoryBuffer, SwitchboardDecimal, SWITCHBOARD_PROGRAM_ID,
};
use std::convert::TryInto;

declare_id!("C7rn1qJkq9FjTwV86RrY5Uih91NgymRVLdJ81rqLNXRS");

#[derive(Accounts)]
#[instruction(params: ReadHistoryParams)]
pub struct ReadHistory<'info> {
    #[account(
        has_one = history_buffer @ ErrorCode::InvalidHistoryBuffer,
        constraint = 
            *aggregator.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ ErrorCode::InvalidSwitchboardAccount
    )]
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
    /// CHECK: Verified by aggregator.history_buffer
    #[account(
        constraint = 
            *aggregator.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ ErrorCode::InvalidSwitchboardAccount
    )]
    pub history_buffer: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ReadHistoryParams {
    pub timestamp: Option<i64>,
}

#[program]
pub mod anchor_history_parser {
    use super::*;

    pub fn read_history(
        ctx: Context<ReadHistory>,
        params: ReadHistoryParams,
    ) -> anchor_lang::Result<()> {
        let aggregator = &ctx.accounts.aggregator.load()?;

        // we validate this in the context but adding here for demonstration purposes
        if aggregator.history_buffer != ctx.accounts.history_buffer.key() {
            return Err(error!(ErrorCode::InvalidHistoryBuffer));
        }

        // demonstration purposes
        if *ctx.accounts.history_buffer.owner != SWITCHBOARD_PROGRAM_ID {
            return Err(error!(ErrorCode::InvalidHistoryBuffer));
        }
        let history_buffer = AggregatorHistoryBuffer::new(&ctx.accounts.history_buffer)?;

        let timestamp: i64;
        if let Some(i) = params.timestamp {
            timestamp = i;
        } else {
            // one hour ago
            timestamp = Clock::get()?.unix_timestamp - 3600;
        }

        let value_at_timestamp: f64  = history_buffer.lower_bound(timestamp).unwrap().value.try_into()?;
        msg!("Result {:?}!", value_at_timestamp);
        Ok(())
    }
}

#[error_code]
#[derive(Eq, PartialEq)]
pub enum ErrorCode {
    #[msg("Not a valid Switchboard account")]
    InvalidSwitchboardAccount,
    #[msg("History buffer mismatch")]
    InvalidHistoryBuffer,
}
