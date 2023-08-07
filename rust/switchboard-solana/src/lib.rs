#![cfg_attr(doc_cfg, feature(doc_cfg))]
#![allow(clippy::result_large_err)]

//! Switchboard is a multi-chain, permissionless oracle protocol providing
//! verifiable off-chain compute for smart contracts.
//!
//! This library provides the Anchor account and instruction definitions for operating
//! Switchboard. The library makes use of the target_os to enable client side features
//! if the target_os is not 'solana'. This allows the library to be used in both
//! on-chain programs within the Solana runtime as well as client side applications.
//!
//! The Switchboard deployment consists of two programs:
//!
//! - The Oracle Program: The core Switchboard deployment consisting of Aggregators (data feeds),
//!   Oracles, and Oracle Queues. Program_ID=SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
//! - The Attestation Program (V3): Enables the use of Trusted Execution Environments (TEEs)
//!   providing verifiable off-chain compute allowing developers to write their own off-chain
//!   logic and "attest" on-chain whether it was executed within a secure enclave.
//!   Program_ID=sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx
//!
//! # Usage
//!
//! Within an Anchor program you can make use of the AccountLoader trait to deserialize
//! Switchboard accounts within your AccountsContext.
//!
//! ```
//! use anchor_lang::prelude::*;
//! use switchboard_solana::AggregatorAccountData;
//!
//! #[derive(Accounts)]
//! #[instruction(params: ReadFeedParams)]
//! pub struct ReadFeed<'info> {
//!  pub aggregator: AccountLoader<'info, AggregatorAccountData>,
//! }
//! ```
//!
//! For Solana programs using native rust you can use the `new` method to deserialize
//! Switchboard accounts.
//!
//! ```
//! use switchboard_solana::{AggregatorAccountData, SWITCHBOARD_PROGRAM_ID};
//!
//! use solana_program::{
//!     account_info::{next_account_info, AccountInfo},
//!     entrypoint,
//!     entrypoint::ProgramResult,
//!     msg,
//!     program_error::ProgramError,
//!     pubkey::Pubkey,
//! };
//!
//! entrypoint!(process_instruction);
//!
//! fn process_instruction<'a>(
//!     _program_id: &'a Pubkey,
//!     accounts: &'a [AccountInfo<'a>],
//!     _instruction_data: &'a [u8],
//! ) -> ProgramResult {
//!     let accounts_iter = &mut accounts.iter();
//!     let aggregator = next_account_info(accounts_iter)?;
//!
//!     // check feed owner
//!     let owner = *aggregator.owner;
//!     if owner != SWITCHBOARD_PROGRAM_ID {
//!         return Err(ProgramError::IncorrectProgramId);
//!     }
//!
//!     // load and deserialize feed
//!     let feed = AggregatorAccountData::new(aggregator)?;
//! }
//! ```
//!
//!
//! # Accounts
//!
//! This SDK provides the following account definitions for the Oracle Program:
//!
//! - [OracleQueue](OracleQueueAccountData)
//! - [Crank](CrankAccountData)
//! - [Oracle](OracleAccountData)
//! - [Permission](PermissionAccountData)
//! - [Aggregator](AggregatorAccountData)
//! - [Job](JobAccountData)
//! - [Lease](LeaseAccountData)
//! - [Vrf](VrfAccountData)
//! - [VrfLite](VrfLiteAccountData)
//! - [VrfPool](VrfPoolAccountData)
//!
//! This SDK provides the following account definitions for the Attestation Program:
//!
//! - [AttestationQueue](AttestationQueueAccountData)
//! - [Verifier](VerifierAccountData)
//! - [AttestationPermission](AttestationPermissionAccountData)
//! - [SwitchboardWallet](SwitchboardWallet)
//! - [Function](FunctionAccountData)
//! - [FunctionRequest](FunctionRequestAccountData)

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
