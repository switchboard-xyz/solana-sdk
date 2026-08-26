//! Solana version compatibility layer
//!
//! This module provides compatibility between different Solana versions,
//! ensuring the correct types and modules are available regardless of which
//! version of the Solana SDK is being used.

// ===== Compile-time feature compatibility checks =====

// Ensure only one Solana version is enabled
#[cfg(all(feature = "solana-v2", feature = "solana-v3"))]
compile_error!("Cannot enable both 'solana-v2' and 'solana-v3' features at the same time. Choose one.");

// Ensure only one client version is enabled
#[cfg(all(feature = "client", feature = "client-v3"))]
compile_error!("Cannot enable both 'client' and 'client-v3' features at the same time. Use 'client' for Solana v2 or 'client-v3' for Solana v3.");

#[cfg(all(feature = "client-v2", feature = "client-v3"))]
compile_error!("Cannot enable both 'client-v2' and 'client-v3' features at the same time. Use 'client-v2' for Solana v2 or 'client-v3' for Solana v3.");

// When anchor is enabled, use anchor's solana_program (v2.x)
#[cfg(feature = "anchor")]
pub use anchor_lang::solana_program;

// When anchor is NOT enabled, use version-specific solana_program
// v3 takes precedence when both v2 and v3 are enabled
#[cfg(all(not(feature = "anchor"), feature = "solana-v3"))]
pub extern crate solana_program_v3;
#[cfg(all(not(feature = "anchor"), feature = "solana-v3"))]
pub use solana_program_v3 as solana_program;

#[cfg(all(
    not(feature = "anchor"),
    not(feature = "solana-v3"),
    feature = "solana-v2"
))]
pub use solana_program_v2 as solana_program;

// Default to v2 when neither anchor, v2, nor v3 is enabled
#[cfg(all(
    not(feature = "anchor"),
    not(feature = "solana-v2"),
    not(feature = "solana-v3")
))]
pub use solana_program_v2 as solana_program;

// ===== solana_sdk (only when client is enabled) =====
// The client feature requires anchor-client, which provides solana_sdk

// When client is enabled, use anchor_client's solana_sdk (which is v2)
#[cfg(feature = "client")]
pub use anchor_client::solana_sdk;

// When client-v3 is enabled (and not the v2 client), build a `solana_sdk` compat shim.
// Solana v3 split several client modules out of the `solana-sdk` umbrella crate into
// standalone crates, so we re-export them here at their original `solana_sdk::*` paths
// to keep the client code version-agnostic.
#[cfg(all(feature = "client-v3", not(feature = "client")))]
pub mod solana_sdk {
    // Everything solana-sdk 3.x still provides (signer, keypair, transaction, message,
    // hash, pubkey, instruction, sysvar, ...).
    pub use solana_sdk_v3::*;

    // Modules that moved to standalone crates in v3, re-exported at their v2 paths:
    pub use solana_commitment_config as commitment_config;
    pub use solana_compute_budget_interface as compute_budget;

    /// `ClusterType` moved from `solana_sdk::genesis_config` to its own crate in v3.
    pub mod genesis_config {
        pub use solana_cluster_type::ClusterType;
    }

    /// The address-lookup-table client surface is split in v3: the on-chain
    /// interface (instruction/state/program/error) lives in its own crate, while the
    /// off-chain `AddressLookupTableAccount` type lives in `solana-message`.
    ///
    /// NOTE — byte-bridge invariant: these interface crates carry their own `solana-pubkey`
    /// major (currently the 4.x line / `solana-address` 2.x), which is a DISTINCT type identity
    /// from `crate::Pubkey` (solana-program v3 / `solana-address` 1.x). The client code never
    /// assigns one `Pubkey` to the other directly — every crossing goes through
    /// `.to_bytes().into()`. That is deliberate; keep it. The `client-v3` version pins exist to
    /// stop these crates' transitive pubkey/address majors from drifting apart independently.
    pub mod address_lookup_table {
        pub use solana_address_lookup_table_interface::{error, instruction, program, state};
        pub use solana_sdk_v3::message::AddressLookupTableAccount;
    }
}

// ===== solana_client (when client or client-v3 is enabled) =====
// Version-specific solana-client selection based on features

// When client-v3 is enabled, use solana-client v3
#[cfg(feature = "client-v3")]
pub use solana_client_v3 as solana_client;

// When client is enabled (default v2), use solana-client v2
#[cfg(feature = "client")]
pub use solana_client_v2 as solana_client;

// Re-export common types for easier access
pub use solana_program::{
    account_info::AccountInfo,
    instruction::{AccountMeta, Instruction},
    msg,
    pubkey::{pubkey, Pubkey},
    sysvar,
};

// When anchor is enabled, anchor_lang::solana_program doesn't re-export hash and ed25519_program
// So we need to import them directly from solana_program_v2
#[cfg(feature = "anchor")]
pub use solana_program_v2::{ed25519_program, hash};

// When anchor is NOT enabled, solana_program already has these modules
#[cfg(not(feature = "anchor"))]
pub use solana_program::{ed25519_program, hash};

// Export syscalls module for on-chain use
#[cfg(all(target_os = "solana", not(feature = "anchor")))]
pub use solana_program::syscalls;

#[cfg(all(target_os = "solana", feature = "anchor"))]
pub use solana_program_v2::syscalls;

// System program ID constant (same across all versions)
pub const SYSTEM_PROGRAM_ID: Pubkey = pubkey!("11111111111111111111111111111111");

// Address lookup table program ID constant
pub const ADDRESS_LOOKUP_TABLE_PROGRAM_ID: Pubkey =
    pubkey!("AddressLookupTab1e1111111111111111111111111");

// Re-export sol_memcpy_ based on version
// In v2, it's a direct import from the definitions module
#[cfg(any(feature = "anchor", feature = "solana-v2"))]
extern "C" {
    pub fn sol_memcpy_(dst: *mut u8, src: *const u8, n: u64);
}

// In v3+, declare it as extern (syscalls module doesn't re-export it)
#[cfg(all(not(feature = "anchor"), not(feature = "solana-v2")))]
extern "C" {
    pub fn sol_memcpy_(dst: *mut u8, src: *const u8, n: u64);
}
