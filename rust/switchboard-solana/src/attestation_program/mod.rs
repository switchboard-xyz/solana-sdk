use crate::cfg_client;

mod error;
pub use error::SwitchboardError as SwitchboardAttestationError;

pub mod accounts;
pub use accounts::*;

pub mod instructions;
pub use instructions::*;

pub mod types;
pub use types::*;

pub mod events;
pub use events::*;

cfg_client! {
    mod client;
    pub use client::*;
}
