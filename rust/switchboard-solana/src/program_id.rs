use crate::*;
pub use anchor_lang::prelude::*;
pub use anchor_lang::solana_program;
pub use anchor_lang::solana_program::*;
pub use anchor_lang::solana_program::{pubkey, pubkey::Pubkey};
use lazy_static::lazy_static;
#[allow(unused_imports)]
use std::str::FromStr;

/// Program id for the Switchboard oracle program
/// SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
lazy_static! {
    pub static ref SWITCHBOARD_PROGRAM_ID: Pubkey =
        Pubkey::from_str("SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f").unwrap();
}

// Program id for the Switchboard oracle program
// sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx
#[cfg(not(feature = "pid_override"))]
lazy_static! {
    pub static ref SWITCHBOARD_ATTESTATION_PROGRAM_ID: Pubkey =
        Pubkey::from_str("sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx").unwrap();
}
#[cfg(feature = "pid_override")]
lazy_static! {
    pub static ref SWITCHBOARD_ATTESTATION_PROGRAM_ID: Pubkey =
        Pubkey::from_str(&std::env::var("SWITCHBOARD_ATTESTATION_PROGRAM_ID").unwrap()).unwrap();
}
