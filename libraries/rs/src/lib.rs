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

/// Mainnet program id for Switchboard v2. Prints out as "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f"
pub const SWITCHBOARD_V2_MAINNET: solana_program::pubkey::Pubkey =
    solana_program::pubkey::Pubkey::new_from_array([
        6, 136, 81, 198, 140, 104, 50, 240, 47, 165, 129, 177, 191, 73, 27, 119, 202, 65, 119, 107,
        162, 185, 136, 181, 166, 250, 186, 142, 227, 162, 236, 144,
    ]);

/// Devnet program id for Switchboard v2. Prints out as "2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG"
pub const SWITCHBOARD_V2_DEVNET: solana_program::pubkey::Pubkey =
    solana_program::pubkey::Pubkey::new_from_array([
        21, 175, 243, 73, 45, 68, 245, 12, 42, 213, 156, 141, 129, 194, 65, 181, 115, 202, 11, 225,
        119, 62, 247, 42, 73, 206, 175, 81, 212, 253, 178, 45,
    ]);
