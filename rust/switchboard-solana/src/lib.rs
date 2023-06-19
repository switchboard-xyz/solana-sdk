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
/// SBAPyGPyvYEXTiTEfVrktmpvm3Bae3VoZmjYZ6694Ha
pub const SWITCHBOARD_ATTESTATION_PROGRAM_ID: Pubkey =
    pubkey!("SBAPyGPyvYEXTiTEfVrktmpvm3Bae3VoZmjYZ6694Ha");

declare_id!(SWITCHBOARD_PROGRAM_ID);
