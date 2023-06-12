pub mod actions;
pub use actions::*;

pub use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

pub use switchboard_solana::SWITCHBOARD_PROGRAM_ID;

pub use switchboard_solana::Callback;

declare_id!("4hfkS97f5P6zauWeJF5dcZDFaJwYwbMPvKrANVAuKN4p");

#[program]
pub mod switchboard_feed_client {
    use super::*;

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn read_feed(ctx: Context<ReadFeed>, params: ReadFeedParams) -> Result<()> {
        ReadFeed::actuate(&ctx, &params)
    }

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn read_history(ctx: Context<ReadHistory>, params: ReadHistoryParams) -> Result<()> {
        ReadHistory::actuate(&ctx, &params)
    }
}

#[error_code]
#[derive(Eq, PartialEq)]
pub enum SwitchboardClientError {
    #[msg("Not a valid Switchboard account")]
    InvalidSwitchboardAccount,
}
