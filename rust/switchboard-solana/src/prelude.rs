use crate::{cfg_client, cfg_program};

pub use crate::accounts::*;
pub use crate::decimal::*;
pub use crate::error::*;
pub use crate::instructions::*;
pub use crate::seeds::*;
pub use crate::types::*;

pub use crate::{SWITCHBOARD_ATTESTATION_PROGRAM_ID, SWITCHBOARD_PROGRAM_ID};

pub use switchboard_common::FunctionResult;

pub use anchor_spl;

pub use rust_decimal;

cfg_client! {
    pub use crate::client::*;

    pub use switchboard_common::Gramine;

    pub use anchor_client;
    pub use anchor_client::anchor_lang;
    pub use anchor_client::solana_client;
    pub use anchor_client::solana_sdk;
    pub use anchor_client::anchor_lang::solana_program;
    pub use anchor_client::Cluster;

    pub use solana_sdk::signer::keypair::{keypair_from_seed, Keypair};

    pub use anchor_lang::prelude::*;
}

cfg_program! {
    pub use anchor_lang;
    pub use anchor_lang::solana_program;

    pub use anchor_lang::prelude::*;
}

pub use anchor_lang::prelude::*;
pub use anchor_lang::{
    AnchorDeserialize, AnchorSerialize, Discriminator, InstructionData, Owner, ZeroCopy,
};
pub use anchor_spl::associated_token::AssociatedToken;
pub use anchor_spl::token::{Mint, Token, TokenAccount};
pub use solana_program::entrypoint::ProgramResult;
pub use solana_program::instruction::Instruction;
pub use solana_program::program::{invoke, invoke_signed};
