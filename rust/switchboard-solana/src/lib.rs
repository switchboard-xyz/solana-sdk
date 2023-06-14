#![cfg_attr(doc_cfg, feature(doc_cfg))]
#![allow(clippy::result_large_err)]
mod macros;

use anchor_lang::prelude::*;
use solana_program::pubkey;

pub mod oracle_program;
pub use oracle_program::*;

pub mod attestation_program;
pub use attestation_program::*;

pub use switchboard_common::{Chain, Error as SwitchboardClientError, FunctionResult};

pub mod seeds;
pub use seeds::*;

pub mod accounts;
pub mod instructions;
pub mod types;

pub mod prelude;

cfg_client! {
    pub mod client;
    pub use client::*;

    pub mod sgx;
    pub use sgx::*;
}

/// Program id for the Switchboard oracle program
/// SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
pub const SWITCHBOARD_PROGRAM_ID: anchor_lang::solana_program::pubkey::Pubkey =
    pubkey!("SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f");

/// Program id for the Switchboard oracle program
/// 2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7
pub const SWITCHBOARD_ATTESTATION_PROGRAM_ID: Pubkey =
    pubkey!("2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7");

declare_id!(SWITCHBOARD_PROGRAM_ID);
