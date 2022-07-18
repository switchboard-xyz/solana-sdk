use anchor_lang::prelude::*;
use solana_program::pubkey;

pub mod aggregator;
pub mod buffer_relayer;
pub mod decimal;
pub mod error;
pub mod history_buffer;
pub mod vrf;

pub use aggregator::{AggregatorAccountData, AggregatorRound};
pub use buffer_relayer::{BufferRelayerAccountData, BufferRelayerRound};
pub use decimal::SwitchboardDecimal;
pub use error::SwitchboardError;
pub use history_buffer::{AggregatorHistoryBuffer, AggregatorHistoryRow};
pub use vrf::{VrfAccountData, VrfRequestRandomness, VrfRound, VrfStatus};

/// Mainnet program id for Switchboard v2
pub const SWITCHBOARD_V2_MAINNET: Pubkey = pubkey!("SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f");

/// Devnet program id for Switchboard v2
pub const SWITCHBOARD_V2_DEVNET: Pubkey = pubkey!("2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG");
