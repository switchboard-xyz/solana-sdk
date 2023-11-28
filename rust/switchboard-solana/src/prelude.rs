use crate::{cfg_client, cfg_macros, cfg_program};

pub use crate::accounts::*;
pub use crate::decimal::*;
pub use crate::error::*;
pub use crate::events::*;
pub use crate::instructions::*;
pub use crate::seeds::*;
pub use crate::types::*;

pub use crate::{SWITCHBOARD_ATTESTATION_PROGRAM_ID, SWITCHBOARD_PROGRAM_ID};

pub use switchboard_common::{
    unix_timestamp, ChainResultInfo, FunctionResult, FunctionResultV0, FunctionResultV1,
    LegacyChainResultInfo, LegacySolanaFunctionResult, SolanaFunctionRequestType,
    SolanaFunctionResult, SolanaFunctionResultV0, SolanaFunctionResultV1, FUNCTION_RESULT_PREFIX,
};

pub use anchor_spl;

pub use rust_decimal;

cfg_client! {
    pub use crate::client::*;

    pub use switchboard_common::{ Gramine, SbFunctionError, SbError };

    pub use anchor_client;
    pub use anchor_client::anchor_lang;
    pub use anchor_client::solana_client;
    pub use anchor_client::solana_sdk;
    pub use anchor_client::anchor_lang::solana_program;
    pub use anchor_client::Cluster;

    pub use solana_sdk::signer::keypair::{ keypair_from_seed, Keypair };
    pub use solana_sdk::transaction::Transaction;
    pub use solana_sdk::message::Message;

    pub use solana_account_decoder;

    pub use anchor_lang::prelude::*;

    // Override anchor error
    pub use std::result::Result;
}

cfg_program! {
    pub use anchor_lang;
    pub use anchor_lang::solana_program;

    pub use anchor_lang::prelude::*;

    pub use anchor_lang::prelude::Result;
}

cfg_macros! {
    // Futures crate is needed by the proc_macro
    pub use futures;
    pub use futures::Future;
    pub use switchboard_solana_macros::switchboard_function;
    pub use switchboard_solana_macros::sb_error;
}

pub use anchor_lang::{
    AccountDeserialize, AccountSerialize, AnchorDeserialize, AnchorSerialize, Discriminator,
    InstructionData, Owner, ZeroCopy,
};

pub use anchor_spl::associated_token::AssociatedToken;
pub use anchor_spl::token::spl_token::native_mint as NativeMint;
pub use anchor_spl::token::{Mint, Token, TokenAccount};
pub use solana_program::entrypoint::ProgramResult;
pub use solana_program::instruction::{AccountMeta, Instruction};
pub use solana_program::program::{invoke, invoke_signed};
