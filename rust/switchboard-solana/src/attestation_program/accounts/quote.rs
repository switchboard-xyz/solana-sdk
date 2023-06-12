use anchor_lang::prelude::*;
use anchor_lang::{Discriminator, Owner, ZeroCopy};
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

use crate::{SwitchboardError, QUOTE_SEED, SWITCHBOARD_ATTESTATION_PROGRAM_ID};

#[repr(u8)]
#[derive(Copy, Clone, Eq, PartialEq)]
pub enum VerificationStatus {
    None = 0,
    VerificationPending = 1 << 0,
    VerificationFailure = 1 << 1,
    VerificationSuccess = 1 << 2,
    VerificationOverride = 1 << 3,
}

#[zero_copy]
#[repr(packed)]
#[derive(Debug)]
pub struct QuoteAccountData {
    pub secured_signer: Pubkey,
    pub bump: u8,
    // Set except for function quotes
    /// TODO: Add description
    pub quote_registry: [u8; 32],
    /// Key to lookup the buffer data on IPFS or an alternative decentralized storage solution.
    pub registry_key: [u8; 64],

    // always set
    /// Queue used for attestation to verify a MRENCLAVE measurement.
    pub attestation_queue: Pubkey,
    /// The quotes MRENCLAVE measurement dictating the contents of the secure enclave.
    pub mr_enclave: [u8; 32],
    pub verification_status: u8,
    pub verification_timestamp: i64,
    pub valid_until: i64,
    // Set for verifiers
    pub is_on_queue: bool,
    /// The last time the quote heartbeated.
    pub last_heartbeat: i64,
    pub authority: Pubkey,
    //
    pub created_at: i64,
    pub _ebuf: [u8; 992],
}

unsafe impl Pod for QuoteAccountData {}
unsafe impl Zeroable for QuoteAccountData {}

impl Discriminator for QuoteAccountData {
    const DISCRIMINATOR: [u8; 8] = [205, 205, 167, 232, 0, 74, 44, 160];
}

impl Owner for QuoteAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}
impl ZeroCopy for QuoteAccountData {}

impl QuoteAccountData {
    /// Returns the deserialized Switchboard Quote account
    ///
    /// # Arguments
    ///
    /// * `quote_account_info` - A Solana AccountInfo referencing an existing Switchboard QuoteAccount
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::QuoteAccountData;
    ///
    /// let quote_account = QuoteAccountData::new(quote_account_info)?;
    /// ```
    pub fn new<'info>(
        quote_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, QuoteAccountData>> {
        let data = quote_account_info.try_borrow_data()?;
        if data.len() < QuoteAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != QuoteAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<QuoteAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard Quote account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::QuoteAccountData;
    ///
    /// let quote_account = QuoteAccountData::new(quote_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&QuoteAccountData> {
        if data.len() < QuoteAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != QuoteAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<QuoteAccountData>() + 8],
        ))
    }

    pub fn get_pda_pubkey(function_pubkey: &Pubkey) -> anchor_lang::Result<Pubkey> {
        let (pda_key, _bump) = Pubkey::find_program_address(
            &[QUOTE_SEED, function_pubkey.as_ref()],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );

        Ok(pda_key)
    }

    pub fn is_valid(&self, clock: &Clock) -> bool {
        if self.verification_status == VerificationStatus::VerificationOverride as u8 {
            return true;
        }
        if self.verification_status == VerificationStatus::VerificationPending as u8 {
            return false;
        }
        if self.verification_status == VerificationStatus::VerificationFailure as u8 {
            return false;
        }
        if self.valid_until < clock.unix_timestamp {
            return false;
        }
        true
    }

    #[cfg(feature = "client")]
    pub async fn fetch(
        client: &anchor_client::Client<
            std::sync::Arc<anchor_client::solana_sdk::signer::keypair::Keypair>,
        >,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::Error> {
        crate::client::load_account(client, pubkey).await
    }
}
