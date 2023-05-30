use anchor_lang::solana_program::clock;
use std::convert::TryInto;
use switchboard_v2::{BufferRelayerAccountData, SWITCHBOARD_PROGRAM_ID};

// check feed owner
let owner = *aggregator.owner;
if owner != SWITCHBOARD_PROGRAM_ID {
    return Err(error!(ErrorCode::InvalidSwitchboardAccount));
}

// deserialize account info
let buffer = BufferRelayerAccountData::new(feed_account_info)?;

// get result
let buffer_result = buffer.get_result();

// check if feed has been updated in the last 5 minutes
buffer.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)?;

// convert buffer to a string
let result_string = String::from_utf8(buffer.result)
    .map_err(|_| error!(ErrorCode::StringConversionFailed))?;
msg!("Buffer string {:?}!", result_string);