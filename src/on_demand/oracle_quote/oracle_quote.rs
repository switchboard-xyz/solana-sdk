//! Oracle quote verification and data extraction functionality
//!
//! This module provides the core `OracleQuote` struct for working with verified oracle data quotes.
//! A quote contains aggregated feed data from multiple oracles, cryptographically verified
//! through ED25519 signatures and Solana's instruction sysvar.

use core::ptr::read_unaligned;

use anyhow::{Context, Error as AnyError};
use solana_define_syscall::definitions::sol_memcpy_;
use solana_program::account_info::AccountInfo;
use solana_program::ed25519_program::ID as ED25519_PROGRAM_ID;
use solana_program::sysvar::clock::Clock;

use crate::{check_pubkey_eq, Instructions};

#[allow(unused)]
const SLOTS_PER_EPOCH: u64 = 432_000;

/// Default discriminator for Switchboard Oracle data
pub const QUOTE_DISCRIMINATOR: [u8; 8] = *b"SBOracle";
/// QUOTE_DISCRIMINATOR as little-endian u64 for efficient comparison
pub const QUOTE_DISCRIMINATOR_U64_LE: u64 = u64::from_le_bytes(QUOTE_DISCRIMINATOR);

/// A verified oracle quote containing feed data from multiple oracles.
///
/// This struct provides zero-copy access to aggregated oracle feed data that has been
/// cryptographically verified through ED25519 signatures. The quote contains:
/// - Feed data with values and metadata
/// - Oracle signature information and indices
/// - Slot and version information for freshness validation
/// - Raw instruction data for serialization (when available)
///
/// All data is stored as references to avoid unnecessary copying, making this struct
/// highly efficient for on-chain programs where compute units are precious.
#[derive(Clone, Copy)]
pub struct OracleQuote<'a> {
    /// Reference to the quote header containing signed slot hash
    quote_header_refs: &'a crate::on_demand::oracle_quote::feed_info::PackedQuoteHeader,
    /// Number of oracle signatures that verified this quote
    pub oracle_count: u8,
    /// Zero-copy reference to the packed feed data from the first signature
    pub packed_feed_infos: &'a [crate::on_demand::oracle_quote::feed_info::PackedFeedInfo],
    /// Number of valid feeds in the quote (private, calculated during verification)
    feed_count: u8,
    /// Oracle indices that correspond to the queue's oracle array
    pub oracle_idxs: &'a [u8],
    /// Recent slot from the ED25519 instruction data used for freshness validation
    pub recent_slot: u64,
    /// Version from the ED25519 instruction data
    pub version: u8,
    /// Reference to the raw ED25519 instruction data for serialization
    pub raw_buffer: Option<&'a [u8]>,
}

impl<'a> OracleQuote<'a> {
    /// Creates a new OracleQuote with header references and zero-copy feed data.
    ///
    /// This constructor is used internally after verification to create an OracleQuote
    /// instance with validated data. All parameters should be pre-verified.
    ///
    /// # Arguments
    /// * `quote_header_ref` - Reference to the verified quote header
    /// * `oracle_count` - Number of oracle signatures
    /// * `packed_feed_infos` - Slice of packed feed information
    /// * `feed_count` - Number of valid feeds
    /// * `oracle_idxs` - Oracle indices array
    /// * `recent_slot` - Recent slot from ED25519 instruction
    /// * `version` - Version from ED25519 instruction
    /// * `raw_buffer` - Reference to the raw ED25519 instruction data
    #[inline(always)]
    pub(crate) fn new(
        quote_header_ref: &'a crate::on_demand::oracle_quote::feed_info::PackedQuoteHeader,
        oracle_count: u8,
        packed_feed_infos: &'a [crate::on_demand::oracle_quote::feed_info::PackedFeedInfo],
        feed_count: u8,
        oracle_idxs: &'a [u8],
        recent_slot: u64,
        version: u8,
        raw_buffer: Option<&'a [u8]>,
    ) -> Self {
        Self {
            quote_header_refs: quote_header_ref,
            oracle_count,
            packed_feed_infos,
            feed_count,
            oracle_idxs,
            recent_slot,
            version,
            raw_buffer,
        }
    }

    /// Returns the recent slot from the ED25519 instruction data.
    ///
    /// This slot value represents when the quote was created and is used
    /// for freshness validation against the slot hash sysvar.
    #[inline(always)]
    pub fn slot(&self) -> u64 {
        self.recent_slot
    }

    /// Returns the version from the ED25519 instruction data.
    ///
    /// The version indicates the quote format version used by the oracles.
    #[inline(always)]
    pub fn version(&self) -> u8 {
        self.version
    }

    /// Returns a reference to the raw ED25519 instruction data used to create this quote.
    ///
    /// This method provides access to the original verified instruction data that can be
    /// used for serialization, storage, or further processing. The data includes all
    /// signatures and quote information in its original binary format.
    ///
    /// # Returns
    /// * `Some(&[u8])` - Reference to the raw instruction data if available
    /// * `None` - Raw data not available (e.g., quote created from account data)
    ///
    /// # Example
    /// ```rust,ignore
    /// let quote = verifier.load_and_verify(0)?;
    ///
    /// if let Some(raw_data) = quote.raw_data() {
    ///     // Store or transmit the raw oracle data
    ///     store_oracle_quote(raw_data)?;
    /// }
    /// ```
    #[inline(always)]
    pub fn raw_data(&self) -> Option<&[u8]> {
        self.raw_buffer
    }

    /// Returns a slice of the valid packed feeds.
    ///
    /// This provides access to all verified feed data in the quote.
    /// Each feed contains a feed ID, value, and minimum oracle samples requirement.
    #[inline(always)]
    pub fn feeds(&self) -> &[crate::on_demand::oracle_quote::feed_info::PackedFeedInfo] {
        &self.packed_feed_infos[..self.feed_count as usize]
    }

    /// Returns the number of valid feeds in this quote
    #[inline(always)]
    pub fn len(&self) -> usize {
        self.feed_count as usize
    }

    /// Returns true if this quote contains no feeds
    #[inline(always)]
    pub fn is_empty(&self) -> bool {
        self.feed_count == 0
    }

    /// Returns the oracle index for a specific signature position.
    ///
    /// # Arguments
    /// * `signature_index` - The position of the signature (0 to oracle_count-1)
    ///
    /// # Returns
    /// * `Ok(u8)` - The oracle index that corresponds to the queue's oracle array
    /// * `Err(AnyError)` - If signature_index is out of bounds
    ///
    /// # Example
    /// ```rust,ignore
    /// let oracle_idx = quote.oracle_index(0)?; // Get first oracle's index
    /// ```
    #[inline(always)]
    pub fn oracle_index(&self, signature_index: usize) -> Result<u8, AnyError> {
        if signature_index < self.oracle_count as usize {
            Ok(self.oracle_idxs[signature_index])
        } else {
            anyhow::bail!(
                "Invalid signature index {} for quote with {} oracles",
                signature_index,
                self.oracle_count
            )
        }
    }

    /// Returns a reference to the quote header.
    ///
    /// The header contains the signed slot hash that was verified against
    /// the slot hash sysvar during quote verification.
    #[inline(always)]
    pub fn header(&self) -> &'a crate::on_demand::oracle_quote::feed_info::PackedQuoteHeader {
        self.quote_header_refs
    }

    /// Finds a packed feed with a specific feed ID.
    ///
    /// # Arguments
    /// * `feed_id` - A 32-byte array representing the feed ID to look for
    ///
    /// # Returns
    /// * `Ok(&PackedFeedInfo)` - Reference to the feed info if found
    /// * `Err(AnyError)` - Error if the feed ID is not found in the quote
    ///
    /// # Example
    /// ```rust,ignore
    /// let feed_id = [0u8; 32]; // Your feed ID
    /// match quote.feed(&feed_id) {
    ///     Ok(feed_info) => println!("Feed value: {}", feed_info.value()),
    ///     Err(_) => println!("Feed not found in quote"),
    /// }
    /// ```
    #[inline(always)]
    pub fn feed(
        &self,
        feed_id: &[u8; 32],
    ) -> std::result::Result<&crate::on_demand::oracle_quote::feed_info::PackedFeedInfo, AnyError>
    {
        let info = self.packed_feed_infos[..self.feed_count as usize]
            .iter()
            .find(|info| info.feed_id() == feed_id)
            .context("Switchboard On-Demand FeedNotFound")?;
        Ok(info)
    }

    /// High-performance ED25519 instruction data copy with slot validation.
    ///
    /// This function performs an optimized copy of oracle quote data from ED25519 instruction data
    /// to a destination buffer with a length prefix. It implements slot-based ordering validation
    /// to prevent oracle quote replay attacks and ensures data freshness.
    ///
    /// # Data Format
    ///
    /// **Source format** (ED25519 instruction data):
    /// ```
    /// [message_data][oracle_signatures][recent_slot(8)][version(1)][SBOD(4)]
    /// ```
    /// - Slot is located at offset `data_len - 13` (13 = 8 + 1 + 4)
    ///
    /// **Destination format** (after this function):
    /// ```
    /// [length(2)][message_data][oracle_signatures][recent_slot(8)][version(1)][SBOD(4)]
    /// ```
    /// - Adds 2-byte length prefix to the instruction data
    ///
    /// # Arguments
    ///
    /// * `clock` - Solana clock for slot validation
    /// * `source` - ED25519 instruction data slice containing oracle quote
    /// * `dst` - Mutable destination buffer (will be prefixed with 2-byte length)
    ///
    /// # Safety
    ///
    /// This function performs unsafe memory operations for performance:
    /// - **ASSUMES** `source` contains valid ED25519 instruction data with slot at correct offset
    /// - **ASSUMES** `dst` buffer has sufficient capacity (source.len() + 2 bytes)
    /// - **REQUIRES** instruction data format: [...data][slot(8)][version(1)][SBOD(4)]
    ///
    /// # Validation
    ///
    /// Performs critical slot-based validations:
    /// - **Freshness**: new slot < clock.slot (prevents stale data)
    /// - **Progression**: new slot ≥ existing slot in destination (anti-replay protection)
    /// - **Capacity**: destination buffer can hold length prefix + data
    ///
    /// # Performance
    ///
    /// Optimized for maximum performance at approximately 79 compute units with validations.
    ///
    /// # Panics
    ///
    /// Panics if critical validations fail:
    /// - New slot >= clock slot (stale oracle data)
    /// - Slot regression detected (replay attack prevention)
    /// - Destination buffer too small for prefixed data
    #[inline(always)]
    pub fn store_delimited(clock: &Clock, source: &[u8], dst: &mut [u8]) {
        // Validate slot progression before writing
        Self::validate_slot_progression(clock, source, dst);

        // 79 Compute units with safety checks and sequencing
        unsafe {
            let dst_ptr = dst.as_mut_ptr();
            let data_len = source.len();

            // Write the new data
            assert!(data_len + 2 <= dst.len()); // ensure dst buffer is large enough
            *(dst_ptr as *mut u16) = data_len as u16;
            sol_memcpy_(dst_ptr.add(2), source.as_ptr(), data_len as u64);
        }
    }

    /// Validates slot progression before writing oracle data.
    ///
    /// Ensures that:
    /// - New slot >= existing slot in account (no regression)
    /// - New slot < current clock slot (no stale data)
    ///
    /// # Arguments
    /// * `clock` - Current Solana clock
    /// * `source` - New oracle data to write
    /// * `existing_data` - Current account data (may be empty)
    ///
    /// # Panics
    /// Panics if slot validation fails
    #[inline(always)]
    fn validate_slot_progression(clock: &Clock, source: &[u8], existing_data: &[u8]) {
        let source_len = source.len();
        if source_len < 13 {
            panic!("Invalid source data length: {}", source_len);
        }

        unsafe {
            // Extract slot from new data (13 bytes from end: 8 slot + 1 version + 4 SBOD)
            let slot_offset = source_len - 13;
            let new_slot = read_unaligned(source.as_ptr().add(slot_offset) as *const u64);

            // Validate new slot is not stale
            assert!(
                new_slot < clock.slot,
                "SB oracle slot is stale new_slot: {}, clock.slot: {}",
                new_slot,
                clock.slot
            );

            // Check existing data for slot regression - always calculate from the back
            if existing_data.len() >= 13 {
                // Minimum data with slot
                let existing_slot_offset = existing_data.len() - 13;
                let existing_slot =
                    read_unaligned(existing_data.as_ptr().add(existing_slot_offset) as *const u64);
                assert!(
                    new_slot >= existing_slot,
                    "SB oracle slot regression new_slot: {}, existing_slot: {}",
                    new_slot,
                    existing_slot
                );
            }
        }
    }

    /// Writes ED25519 instruction data directly to an oracle account with discriminator.
    ///
    /// This convenience method writes oracle quote data to a target account with the
    /// Switchboard Oracle discriminator prefix. The account data format becomes:
    ///
    /// ```
    /// [discriminator(8)][length(2)][message_data][oracle_signatures][recent_slot(8)][version(1)][SBOD(4)]
    /// ```
    ///
    /// # Arguments
    ///
    /// * `clock` - Solana Clock for slot validation and freshness checks
    /// * `source` - ED25519 instruction data containing oracle quote
    /// * `oracle_account` - Target oracle account to write the data to
    ///
    /// # Safety
    ///
    /// This function assumes:
    /// - Oracle account has sufficient space (at least discriminator + length + source data)
    /// - Minimum 23 bytes (8 discriminator + 2 length + 13 minimum data with slot)
    /// - Performs unsafe memory operations for maximum efficiency
    ///
    /// # Validation
    ///
    /// Performs comprehensive slot validation before writing:
    /// - **Freshness**: new slot < clock.slot (prevents stale data)
    /// - **Progression**: new slot ≥ existing slot in account (prevents replay attacks)
    ///
    /// # Panics
    ///
    /// Panics if the oracle account buffer is too small or slot validation fails.
    #[inline(always)]
    pub fn write(clock: &Clock, source: &[u8], oracle_account: &AccountInfo) {
        unsafe {
            let dst: &mut [u8] = *oracle_account.data.as_ptr();
            assert!(dst.len() >= 23); // discriminator + u16 + minimum data (13 bytes)
            let dst_ptr = dst.as_mut_ptr();
            *(dst_ptr as *mut u64) = QUOTE_DISCRIMINATOR_U64_LE;
            Self::store_delimited(clock, source, &mut dst[8..]);
        }
    }

    /// Writes oracle quote data from an ED25519 instruction to an oracle account.
    ///
    /// This convenience method extracts ED25519 instruction data from the instructions sysvar
    /// and writes it to the target oracle account with proper validation and discriminator.
    ///
    /// # Arguments
    /// * `ix_sysvar` - Any type that implements `AsRef<AccountInfo>` (e.g., `Sysvar<Instructions>`, direct `AccountInfo` reference)
    /// * `oracle_account` - Any type that implements `AsRef<AccountInfo>` (e.g., `AccountLoader<SwitchboardQuote>`, direct `AccountInfo` reference)
    /// * `clock` - Reference to a Clock (use `&clock` where `clock` is `Sysvar<Clock>` or direct `Clock`)
    /// * `instruction_index` - Index of the ED25519 instruction to extract (typically 0)
    ///
    /// # Example with Anchor
    /// ```rust,ignore
    /// use anchor_lang::prelude::*;
    /// use switchboard_on_demand::OracleQuote;
    ///
    /// pub fn update_oracle(ctx: Context<UpdateCtx>) -> Result<()> {
    ///     let UpdateCtx { oracle, sysvars, .. } = ctx.accounts;
    ///     let clock = switchboard_on_demand::clock::parse_clock(&sysvars.clock);
    ///
    ///     // Works directly with Anchor wrapper types and parsed clock
    ///     OracleQuote::write_from_ix(&sysvars.instructions, &oracle, clock, 0);
    ///     Ok(())
    /// }
    /// ```
    ///
    /// # Validation
    /// Performs comprehensive validation:
    /// - **Program ID**: Ensures instruction is from ED25519 program
    /// - **Sysvar ID**: Validates instructions sysvar account
    /// - **Slot progression**: Prevents stale data and replay attacks
    ///
    /// # Panics
    /// Panics if instruction extraction fails, program ID validation fails, or slot validation fails.
    #[inline(always)]
    pub fn write_from_ix<I, O>(
        ix_sysvar: I,
        oracle_account: O,
        clock: &Clock,
        instruction_index: usize,
    ) where
        I: AsRef<AccountInfo<'a>>,
        O: AsRef<AccountInfo<'a>>,
    {
        let ix_sysvar = ix_sysvar.as_ref();
        let oracle_account = oracle_account.as_ref();

        let (program_id, data) = Instructions::extract_ix_data(ix_sysvar, instruction_index);
        assert!(check_pubkey_eq(program_id, &ED25519_PROGRAM_ID));
        Self::write(clock, data, oracle_account);
    }
}
