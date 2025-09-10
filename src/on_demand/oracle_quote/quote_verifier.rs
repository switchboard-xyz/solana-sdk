//! Oracle quote verification for creating and verifying oracle data quotes
//!
//! This module provides the `QuoteVerifier` which allows you to construct
//! a verifier with specific accounts and parameters, then use it to verify ED25519
//! instruction data and create validated `OracleQuote` instances.
//!
//! The verification process checks:
//! - ED25519 signature validity
//! - Oracle signing key authorization
//! - Slot hash verification against the sysvar
//! - Quote age validation against max_age parameter (requires clock sysvar)
//! - Oracle quote data integrity

use core::ptr::read_unaligned;

#[cfg(feature = "anchor")]
use anchor_lang::solana_program;
use anyhow::{bail, Error as AnyError};
use solana_program::account_info::AccountInfo;
use solana_program::sysvar::instructions::get_instruction_relative;

use crate::prelude::*;
use crate::{check_p64_eq, check_pubkey_eq};
#[allow(unused_imports)]
use crate::{ON_DEMAND_DEVNET_PID, ON_DEMAND_MAINNET_PID};

/// Maximum number of slots stored in the slot hash sysvar
const SYSVAR_SLOT_LEN: u64 = 512;

/// Oracle quote verifier with builder pattern for configuring and performing verification.
///
/// This verifier allows you to configure the required accounts step by step before
/// using it to verify oracle quotes. All required accounts must be set before
/// verification can be performed.
///
/// The verifier accepts any type that implements `AsRef<AccountInfo>`, making it compatible
/// with Anchor wrapper types like `AccountLoader`, `Sysvar`, etc.
///
/// # Example with Anchor Context
/// ```rust,ignore
/// use anchor_lang::prelude::*;
/// use switchboard_on_demand::QuoteVerifier;
///
/// pub fn verify(ctx: Context<VerifyCtx>) -> Result<()> {
///     let VerifyCtx { queue, oracle, sysvars, .. } = ctx.accounts;
///     let clock_slot = switchboard_on_demand::clock::get_slot(&sysvars.clock);
///
///     let quote = QuoteVerifier::new()
///         .queue(&queue)
///         .slothash_sysvar(&sysvars.slothashes)
///         .ix_sysvar(&sysvars.instructions)
///         .clock_slot(clock_slot)
///         .verify_account(&oracle)
///         .unwrap();
///
///     // Use the verified quote data
///     for feed in quote.feeds() {
///         msg!("Feed {}: {}", feed.hex_id(), feed.value());
///     }
///     Ok(())
/// }
/// ```
#[derive(Clone)]
pub struct QuoteVerifier<'a> {
    queue: Option<AccountInfo<'a>>,
    slothash_sysvar: Option<AccountInfo<'a>>,
    ix_sysvar: Option<AccountInfo<'a>>,
    clock_slot: Option<u64>,
    max_age: u64,
}

impl<'a> Default for QuoteVerifier<'a> {
    fn default() -> Self {
        Self::new()
    }
}

impl<'a> QuoteVerifier<'a> {
    /// Creates a new `QuoteVerifier` with default values.
    #[inline(always)]
    pub fn new() -> Self {
        Self {
            queue: None,
            slothash_sysvar: None,
            ix_sysvar: None,
            clock_slot: None,
            max_age: 0,
        }
    }

    /// Sets the oracle queue account for verification.
    ///
    /// The queue account contains the authorized oracle signing keys that will
    /// be used to validate the signatures in the oracle quote.
    ///
    /// # Arguments
    /// * `account` - Any type that implements `AsRef<AccountInfo>` (e.g., `AccountLoader`, direct `AccountInfo` reference)
    ///
    /// # Example
    /// ```rust,ignore
    /// verifier.queue(&ctx.accounts.queue);  // Works with Anchor AccountLoader
    /// verifier.queue(&account_info);        // Works with AccountInfo reference
    /// ```
    #[inline(always)]
    pub fn queue<T>(&mut self, account: T) -> &mut Self
    where
        T: AsRef<AccountInfo<'a>>,
    {
        self.queue = Some(account.as_ref().clone());
        self
    }

    /// Sets the slot hash sysvar account for verification.
    ///
    /// The slot hash sysvar is used to validate that the signed slot hash
    /// in the oracle quote corresponds to a valid historical slot.
    ///
    /// # Arguments
    /// * `sysvar` - Any type that implements `AsRef<AccountInfo>` (e.g., `Sysvar<SlotHashes>`, direct `AccountInfo` reference)
    ///
    /// # Example
    /// ```rust,ignore
    /// verifier.slothash_sysvar(&ctx.accounts.slothashes);  // Works with Anchor Sysvar
    /// verifier.slothash_sysvar(&slothash_account);         // Works with AccountInfo reference
    /// ```
    #[inline(always)]
    pub fn slothash_sysvar<T>(&mut self, sysvar: T) -> &mut Self
    where
        T: AsRef<AccountInfo<'a>>,
    {
        self.slothash_sysvar = Some(sysvar.as_ref().clone());
        self
    }

    /// Sets the instructions sysvar account for verification.
    ///
    /// The instructions sysvar contains the ED25519 instruction data that
    /// will be parsed to extract the oracle signatures and quote data.
    ///
    /// # Arguments
    /// * `sysvar` - Any type that implements `AsRef<AccountInfo>` (e.g., `Sysvar<Instructions>`, direct `AccountInfo` reference)
    ///
    /// # Example
    /// ```rust,ignore
    /// verifier.ix_sysvar(&ctx.accounts.instructions);  // Works with Anchor Sysvar
    /// verifier.ix_sysvar(&ix_account);                 // Works with AccountInfo reference
    /// ```
    #[inline(always)]
    pub fn ix_sysvar<T>(&mut self, sysvar: T) -> &mut Self
    where
        T: AsRef<AccountInfo<'a>>,
    {
        self.ix_sysvar = Some(sysvar.as_ref().clone());
        self
    }

    /// Sets the clock slot for freshness validation.
    #[inline(always)]
    pub fn clock_slot(&mut self, clock_slot: u64) -> &mut Self {
        self.clock_slot = Some(clock_slot);
        self
    }

    /// Sets the maximum age in slots for oracle quote freshness validation.
    ///
    /// Oracle quotes older than this many slots will be rejected during verification.
    /// This helps prevent replay attacks and ensures data freshness.
    ///
    /// # Arguments
    /// * `max_age` - Maximum age in slots (typically 100-500 slots)
    #[inline(always)]
    pub fn max_age(&mut self, max_age: u64) -> &mut Self {
        self.max_age = max_age;
        self
    }

    /// Verifies an oracle account containing oracle quote data.
    ///
    /// This method extracts the oracle quote data from an oracle account (skipping the
    /// 8-byte discriminator) and verifies it using the configured accounts.
    ///
    /// # Arguments
    /// * `oracle_account` - Any type that implements `AsRef<AccountInfo>` containing the oracle quote data
    ///   (e.g., `AccountLoader<SwitchboardQuote>`, direct `AccountInfo` reference)
    ///
    /// # Returns
    /// * `Ok(OracleQuote)` - Successfully verified oracle quote with feed data
    /// * `Err(AnyError)` - Verification failed (invalid signatures, expired data, etc.)
    ///
    /// # Example
    /// ```rust,ignore
    /// let quote = verifier.verify_account(&ctx.accounts.oracle)?;
    /// for feed in quote.feeds() {
    ///     println!("Feed {}: ${}", feed.hex_id(), feed.value());
    /// }
    /// ```
    #[inline(always)]
    pub fn verify_account<T>(&self, oracle_account: T) -> Result<OracleQuote<'a>, AnyError>
    where
        T: AsRef<AccountInfo<'a>>,
    {
        let oracle_account = oracle_account.as_ref();
        // # Safety
        //
        // This unsafe block is safe because:
        // - `oracle_account.data` is a valid `Rc<RefCell<&mut [u8]>>` provided by Solana runtime
        // - We verify the account has at least 8 bytes before reading the discriminator
        // - `read_unaligned` safely reads u64 from potentially unaligned memory
        // - Account data lifetime is guaranteed to outlive this function call
        unsafe {
            // Oracle account format: [discriminator(8)][length(2)][ed25519_data...]
            // Assert discriminator and read length, then pass the ed25519 data
            let data = &(*oracle_account.data.as_ptr());
            if data.len() < 8 {
                bail!(
                    "Oracle account too small: {} bytes, expected at least 8",
                    data.len()
                );
            }
            if read_unaligned(data.as_ptr() as *const u64) != QUOTE_DISCRIMINATOR_U64_LE {
                bail!("Invalid oracle account discriminator");
            }
            self.verify_delimited(&data[8..])
        }
    }

    /// Verifies raw ED25519 instruction data and creates a validated OracleQuote.
    ///
    /// This is the core verification method that performs all security checks:
    /// - Parses ED25519 signatures and extracts oracle indices
    /// - Validates oracle signing keys against the queue
    /// - Verifies slot hash against the sysvar
    /// - Validates quote age against max_age (requires clock sysvar)
    /// - Ensures oracle quote data integrity
    ///
    /// # Arguments
    /// * `data` - Raw ED25519 instruction data containing signatures and quote
    ///
    /// # Returns
    /// * `Ok(OracleQuote)` - Successfully verified and parsed oracle quote
    /// * `Err(AnyError)` - Verification failed with detailed error message
    ///
    /// # Errors
    /// - Clock slot not set
    /// - No signatures provided
    /// - Invalid oracle signing keys
    /// - Slot hash mismatch
    /// - Quote is too old (exceeds max_age slots)
    /// - Malformed instruction data
    #[inline(always)]
    pub fn verify_delimited<'data>(&self, data: &'data [u8]) -> Result<OracleQuote<'data>, AnyError>
    where
        'data: 'a,
    {
        // # Safety
        //
        // This unsafe block is safe because:
        // - We verify `data` has at least 2 bytes before reading the length
        // - `read_unaligned` safely reads u16 from potentially unaligned memory
        // - The bounds check ensures we don't read beyond the data buffer
        // - Data slice is guaranteed valid for the function duration
        unsafe {
            let len = read_unaligned(data.as_ptr() as *const u16) as usize;
            self.verify(&data[2..len + 2])
        }
    }

    /// Verifies oracle quote data and returns a validated OracleQuote
    pub fn verify<'data>(&self, data: &'data [u8]) -> Result<OracleQuote<'data>, AnyError>
    where
        'data: 'a,
    {
        let (parsed_sigs, sig_count, oracle_idxs, recent_slot, version) =
            Ed25519Sysvar::parse_instruction(data)?;
        let queue = self
            .queue
            .as_ref()
            .ok_or_else(|| anyhow::anyhow!("Queue account not set"))?;
        let slothash_sysvar = self
            .slothash_sysvar
            .as_ref()
            .ok_or_else(|| anyhow::anyhow!("Slothash sysvar not set"))?;

        // Validate quote freshness - clock slot is required for all verifications
        let clock_slot = self
            .clock_slot
            .ok_or_else(|| anyhow::anyhow!("Clock slot not set"))?;
        if clock_slot < recent_slot || clock_slot - recent_slot > self.max_age {
            bail!(
                "Quote is too old: recent_slot={}, current_slot={}, max_age={}",
                recent_slot,
                clock_slot,
                self.max_age
            );
        }

        if sig_count == 0 {
            bail!("No signatures provided");
        }

        // Get queue data for oracle signing keys
        // Safely access queue data using RefCell borrow and try_from_bytes
        let queue_buf = queue.data.borrow();
        if queue_buf.len() < 6280 {
            bail!("Queue account too small: {} bytes", queue_buf.len());
        }
        let queue_data: &QueueAccountData = bytemuck::try_from_bytes(&queue_buf[8..])
            .map_err(|e| anyhow::anyhow!("Failed to deserialize queue data: {}", e))?;

        // Find the target slothash from the oracle quote
        let reference_sig = &parsed_sigs[0];
        let header = unsafe { reference_sig.quote_header() };

        // Find the target slothash from oracle quote and get corresponding hash from sysvar
        let target_slothash = &header.signed_slothash as *const _ as *const u64;
        let found_slothash = &Self::find_slothash_in_sysvar(recent_slot, &slothash_sysvar)?
            as *const _ as *const u64;

        assert!(unsafe { check_p64_eq(found_slothash, target_slothash) });

        // Oracle signing key validation (32 bytes per oracle: actual should match expected)
        for i in 0..sig_count {
            // Branchless bounds check,  30 is max oracles in queue
            let oracle_idx = (oracle_idxs[i as usize] as usize) % 30;
            let expected_oracle_key = queue_data.ed25519_oracle_signing_keys[oracle_idx];
            let actual_oracle_key = unsafe { parsed_sigs[i as usize].pubkey() };
            assert!(unsafe {
                check_p64_eq(
                    actual_oracle_key as *const _ as *const u64,
                    &expected_oracle_key as *const _ as *const u64,
                )
            });
        }

        // Continue with remaining processing...
        let reference_feed_infos = unsafe { reference_sig.feed_infos() };
        let feed_count = reference_feed_infos.len();

        Ok(OracleQuote::new(
            unsafe { reference_sig.quote_header() },
            sig_count,
            reference_feed_infos,
            feed_count as u8,
            oracle_idxs,
            recent_slot,
            version,
            Some(data),
        ))
    }

    /// Loads and verifies an ED25519 instruction from the instructions sysvar with age validation.
    ///
    /// This method extracts instruction data from the instructions sysvar at the specified
    /// index, validates that it comes from the ED25519 program, checks the quote age against
    /// the current slot using the configured max_age, and then verifies the oracle quote data.
    ///
    /// # Arguments
    /// * `instruction_idx` - Index of the instruction to load from the sysvar (typically 0 for first instruction)
    ///
    /// # Returns
    /// * `Ok(OracleQuote)` - Successfully loaded and verified oracle quote
    /// * `Err(AnyError)` - Failed to load or verify the instruction
    ///
    /// # Errors
    /// - Instruction not found at the specified index
    /// - Instruction is not from the ED25519 program
    /// - Quote is too old (exceeds max_age slots)
    /// - Verification of the quote data fails
    #[inline(always)]
    pub fn verify_instruction_at(&self, instruction_idx: i64) -> Result<OracleQuote<'a>, AnyError> {

        use crate::Instructions;

        let ix_sysvar = self
            .ix_sysvar
            .as_ref()
            .ok_or_else(|| anyhow::anyhow!("Instructions sysvar not set"))?;

        // Extract instruction data and validate program ID using the existing helper
        let data =
            Instructions::extract_ix_data(&ix_sysvar, instruction_idx as usize);

        // Verify the instruction data
        self.verify(data)
    }

    /// Finds and returns a specific slot hash from the slot hash sysvar.
    ///
    /// This function searches through the slot hash sysvar to find the hash
    /// corresponding to the target slot. It uses an optimized search starting
    /// from an estimated position and working backwards.
    ///
    /// # Arguments
    /// * `target_slot` - The slot number to find the hash for
    /// * `slothash_sysvar` - Reference to the slot hash sysvar account
    ///
    /// # Returns
    /// * `Ok([u8; 32])` - The 32-byte hash for the target slot
    /// * `Err(AnyError)` - Slot not found in the sysvar
    ///
    /// # Performance
    /// Uses an estimated starting position based on slot ordering to minimize
    /// the number of entries that need to be checked.
    fn find_slothash_in_sysvar(
        target_slot: u64,
        slothash_sysvar: &AccountInfo,
    ) -> Result<[u8; 32], AnyError> {

        assert!(check_pubkey_eq(
            slothash_sysvar.key,
            &solana_program::sysvar::slot_hashes::ID
        ));
        let slothash_data = slothash_sysvar.data.borrow();

        // # Safety
        //
        // This transmute is safe because:
        // - SlotHash is a POD type with known layout (u64 + [u8; 32])
        // - We skip the 8-byte sysvar header before transmuting
        // - The Solana runtime guarantees proper alignment and initialization of sysvar data
        // - The slice length is determined by the actual data size
        let slot_data: &[SlotHash] = unsafe { std::mem::transmute(&slothash_data[8..]) };

        let mut estimated_idx = ((slot_data[0].slot - target_slot) % SYSVAR_SLOT_LEN) as usize;

        // Optimized search with early termination
        loop {
            let slot_entry = &slot_data[estimated_idx];
            if slot_entry.slot == target_slot {
                return Ok(slot_entry.hash);
            }
            if estimated_idx == 0 {
                break;
            }
            estimated_idx -= 1;
        }
        bail!("Slot not found in slothash sysvar");
    }
}

/// Convenience function for extracting the most recent ED25519 instruction from the instructions sysvar.
///
/// This function retrieves the instruction immediately preceding the current one,
/// which should contain the ED25519 signature data. It handles the type coercion
/// from Anchor's Sysvar wrapper to AccountInfo for easier usage in programs.
///
/// # Arguments
/// * `ix_sysvar` - Reference to the instructions sysvar (can be wrapped in various types)
///
/// # Returns
/// * `Ok(Instruction)` - The ED25519 instruction with signature data
/// * `Err(ProgramError)` - Failed to retrieve the instruction
///
/// # Example
/// ```rust,ignore
/// let ed25519_ix = get_ed25519_instruction(&ctx.accounts.instructions)?;
/// // Process the instruction data...
/// ```
#[inline(always)]
pub fn get_ed25519_instruction<'a, T>(
    ix_sysvar: &T,
) -> Result<solana_program::instruction::Instruction, solana_program::program_error::ProgramError>
where
    T: AsRef<AccountInfo<'a>>,
{
    get_instruction_relative(-1, ix_sysvar.as_ref())
}
