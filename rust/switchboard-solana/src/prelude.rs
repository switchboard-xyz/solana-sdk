use crate::{cfg_client, cfg_not_client};

pub use crate::accounts::*;
pub use crate::instructions::*;
pub use crate::types::*;

pub use crate::{SWITCHBOARD_ATTESTATION_PROGRAM_ID, SWITCHBOARD_PROGRAM_ID};
pub use switchboard_common::{Chain, Error as SwitchboardClientError, FunctionResult};

pub use anchor_spl;

cfg_client! {
    pub use crate::client::*;
    pub use crate::sgx::*;

    pub use anchor_client;
    pub use anchor_client::anchor_lang;
    pub use anchor_client::solana_client;
    pub use anchor_client::solana_sdk;
    pub use anchor_client::anchor_lang::solana_program;
    pub use anchor_client::Cluster;

    pub use anchor_lang::prelude::*;
}

cfg_not_client! {
    pub use anchor_lang;
    pub use anchor_lang::solana_program;

    pub use anchor_lang::prelude::*;
}
