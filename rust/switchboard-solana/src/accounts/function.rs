use crate::{QuoteAccountData, SWITCHBOARD_ATTESTATION_PROGRAM_ID};
use anchor_lang::prelude::*;
use anchor_lang::{Discriminator, Owner};
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

#[repr(u8)]
#[derive(Copy, Clone, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum FunctionStatus {
    None = 0,
    Active = 1 << 0,
    NonExecutable = 1 << 1,
    Expired = 1 << 2,
    OutOfFunds = 1 << 3,
    InvalidPermissions = 1 << 4,
}

#[zero_copy]
#[repr(packed)]
pub struct FunctionAccountData {
    pub name: [u8; 64],
    pub metadata: [u8; 256],
    pub authority: Pubkey,
    ///
    pub container_registry: [u8; 64],
    pub container: [u8; 64],
    pub version: [u8; 32],
    ///
    pub attestation_queue: Pubkey,
    pub queue_idx: u32,
    pub last_execution_timestamp: i64,
    pub next_allowed_timestamp: i64,
    pub schedule: [u8; 64],
    pub escrow: Pubkey,
    pub status: FunctionStatus,
    pub created_at: i64,
    pub _ebuf: [u8; 1024],
}

impl Discriminator for FunctionAccountData {
    const DISCRIMINATOR: [u8; 8] = [76, 139, 47, 44, 240, 182, 148, 200];
}
impl Owner for FunctionAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

unsafe impl Pod for FunctionAccountData {}
unsafe impl Zeroable for FunctionAccountData {}

impl FunctionAccountData {
    /// Returns the deserialized Switchboard Function account
    ///
    /// # Arguments
    ///
    /// * `function_account_info` - A Solana AccountInfo referencing an existing Switchboard FunctionAccount
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::FunctionAccountData;
    ///
    /// let function_account = FunctionAccountData::new(function_account_info)?;
    /// ```
    pub fn new<'info>(
        function_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, FunctionAccountData>> {
        let data = function_account_info.try_borrow_data()?;
        if data.len() < FunctionAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != FunctionAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<FunctionAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard Function account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::FunctionAccountData;
    ///
    /// let function_account = FunctionAccountData::new(function_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&FunctionAccountData> {
        if data.len() < FunctionAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != FunctionAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<FunctionAccountData>() + 8],
        ))
    }

    /// Validate that the provided accounts correspond to the expected function accounts
    ///
    /// # Arguments
    ///
    /// * `function_account_info` - Solana AccountInfo for a FunctionAccountData
    /// * `quote_account_info` - Solana AccountInfo for a QuoteAccountData
    /// * `signer` - Solana AccountInfo for a signer
    pub fn validate_quote<'a>(
        function_account_info: &'a AccountInfo<'a>,
        quote_account_info: &'a AccountInfo<'a>,
        signer: &AccountInfo<'a>,
    ) -> anchor_lang::Result<bool> {
        let function = FunctionAccountData::new(function_account_info)?;
        let quote = QuoteAccountData::new(quote_account_info)?;

        // validate function PDA matches the expected derivation
        let expected_quote_key = quote.get_pda_pubkey(&function_account_info.key())?;
        if quote_account_info.key() != expected_quote_key {
            return Ok(false);
        }

        // validate the quotes delegated signer matches
        if quote.delegated_secured_signer != signer.key() {
            return Ok(false);
        }

        Ok(true)
    }
}
