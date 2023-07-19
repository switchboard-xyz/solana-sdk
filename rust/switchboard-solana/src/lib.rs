#![cfg_attr(doc_cfg, feature(doc_cfg))]
#![allow(clippy::result_large_err)]

mod macros;

use solana_program::{declare_id, pubkey, pubkey::Pubkey};

pub mod decimal;
pub use decimal::*;

pub mod oracle_program;
pub use oracle_program::*;

pub mod attestation_program;
pub use attestation_program::*;

pub mod error;

pub mod seeds;
pub use seeds::*;

pub mod utils;
pub use utils::*;

pub mod accounts;
pub mod instructions;
pub mod types;

pub mod prelude;

cfg_client! {
    pub mod client;
    pub use client::*;
}

/// Program id for the Switchboard oracle program
/// SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
pub const SWITCHBOARD_PROGRAM_ID: Pubkey = pubkey!("SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f");

/// Program id for the Switchboard oracle program
/// sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx
pub const SWITCHBOARD_ATTESTATION_PROGRAM_ID: Pubkey =
    pubkey!("sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx");

/// The minimum number of slots before a request is considered expired.
pub const MINIMUM_USERS_NUM_SLOTS_UNTIL_EXPIRATION: u64 = 150; // 1 min at 400ms/slot

/// The default number of slots before a request expires.
pub const DEFAULT_USERS_NUM_SLOTS_UNTIL_EXPIRATION: u64 = 2250; // 15 min at 400ms/slot

pub const DEFAULT_USERS_CONTAINER_PARAMS_LEN: u32 = 256;

declare_id!(SWITCHBOARD_PROGRAM_ID);
