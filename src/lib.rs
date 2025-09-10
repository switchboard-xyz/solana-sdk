//! # Switchboard On-Demand Oracle SDK
//!
//! Official Rust SDK for Switchboard On-Demand Oracles on Solana.
//!
//! This SDK provides secure, efficient access to real-time oracle data with
//! comprehensive validation and zero-copy performance optimizations.
//!
//! ## Quick Start
//!
//! ```rust,no_run
//! use switchboard_on_demand::prelude::*;
//!
//! // Configure the verifier with required accounts
//! let mut verifier = QuoteVerifier::new();
//! verifier
//!     .queue(&queue_account)
//!     .slothash_sysvar(&slothash_sysvar)
//!     .ix_sysvar(&instructions_sysvar)
//!     .clock(&clock_sysvar)
//!     .max_age(150);
//!
//! // Load and verify the oracle quote
//! let quote = verifier.load_and_verify(0)?;
//!
//! // Access feed data
//! for feed in quote.feeds() {
//!     println!("Feed {}: {}", feed.hex_id(), feed.value());
//! }
//! ```
//!
//! ## Security Considerations
//!
//! - Always validate oracle data freshness with appropriate `max_age` values
//! - Use minimum sample counts for critical operations
//! - Verify feed signatures in production environments
//! - Monitor for stale data and implement appropriate fallback mechanisms
//!
//! ## Feature Flags
//!
//! - `client` - Enable RPC client functionality
//! - `anchor` - Enable Anchor framework integration

#![doc(html_logo_url = "https://i.imgur.com/2cZloJp.png")]
#![allow(unexpected_cfgs)]
#![allow(unused_attributes)]
#![allow(clippy::result_large_err)]

mod macros;
#[allow(unused_imports)]
use std::sync::Arc;

use solana_program::pubkey;

/// Current SDK version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// SDK name for identification
pub const SDK_NAME: &str = "switchboard-on-demand";

/// Supported Switchboard On-Demand program versions on Solana
pub const SUPPORTED_PROGRAM_VERSIONS: &[&str] = &["0.7.0"];

/// Minimum supported Solana version for compatibility
pub const MIN_SOLANA_VERSION: &str = "1.18.0";

/// Decimal number utilities for handling Switchboard oracle data
pub mod decimal;
pub use decimal::*;

/// Core oracle functionality for on-demand data feeds
pub mod on_demand;
pub use on_demand::*;

/// Utility functions and helpers
pub mod utils;
pub use utils::*;

/// Traits extracted from anchor-lang to avoid dependency conflicts
pub mod anchor_traits;
pub use anchor_traits::*;

/// Solana program ID constants
pub mod program_id;
pub use program_id::*;

/// Solana account definitions and parsers
pub mod accounts;
/// Solana instruction builders and processors
pub mod instructions;
/// Common type definitions
pub mod types;

/// Re-exports of commonly used types and traits for convenience
pub mod prelude;

/// Solana sysvar utilities
pub mod sysvar;
pub use sysvar::*;

cfg_client! {
    use solana_sdk::signer::keypair::Keypair;
    pub type AnchorClient = anchor_client::Client<Arc<Keypair>>;
    mod client;
}
