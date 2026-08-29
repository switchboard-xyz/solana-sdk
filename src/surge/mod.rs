//! Surge WebSocket client for real-time price streaming
//!
//! Provides ultra-low latency price feeds via WebSocket with auto-reconnection.

pub mod backoff;
pub mod client;
pub mod config;
pub mod connection;
pub mod error;
pub mod gateway;
pub mod protocol;

pub use client::{SurgeClient, SurgeClientBuilder, SurgeClientHandle};
pub use config::ConnectionConfig;
pub use error::{Result, SurgeError};
pub use protocol::{FeedValue, OracleResponse, SubscribedFeed, SurgeMessage};
