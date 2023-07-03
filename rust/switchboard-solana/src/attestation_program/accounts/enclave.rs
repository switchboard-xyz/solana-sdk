use crate::cfg_client;
use crate::prelude::*;
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

use crate::{QUOTE_SEED, SWITCHBOARD_ATTESTATION_PROGRAM_ID};

pub type MrEnclave = [u8; 32];

#[repr(u8)]
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum VerificationStatus {
    #[default]
    None = 0,
    VerificationPending = 1 << 0,
    VerificationFailure = 1 << 1,
    VerificationSuccess = 1 << 2,
    VerificationOverride = 1 << 3,
}
impl From<VerificationStatus> for u8 {
    fn from(value: VerificationStatus) -> Self {
        match value {
            VerificationStatus::VerificationPending => 1 << 0,
            VerificationStatus::VerificationFailure => 1 << 1,
            VerificationStatus::VerificationSuccess => 1 << 2,
            VerificationStatus::VerificationOverride => 1 << 3,
            _ => 0,
        }
    }
}
impl From<u8> for VerificationStatus {
    fn from(value: u8) -> Self {
        match value {
            1 => VerificationStatus::VerificationPending,
            2 => VerificationStatus::VerificationFailure,
            4 => VerificationStatus::VerificationSuccess,
            8 => VerificationStatus::VerificationOverride,
            _ => VerificationStatus::default(),
        }
    }
}

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(Debug)]
pub struct EnclaveAccountData {
    /// The address of the signer generated within an enclave.
    pub enclave_signer: Pubkey,
    /// The authority of the EnclaveAccount which is permitted to make account changes.
    pub authority: Pubkey,
    /// Queue used for attestation to verify a MRENCLAVE measurement.
    pub attestation_queue: Pubkey,
    /// The quotes MRENCLAVE measurement dictating the contents of the secure enclave.
    pub mr_enclave: [u8; 32],
    /// The VerificationStatus of the quote.
    pub verification_status: u8,
    /// The unix timestamp when the quote was last verified.
    pub verification_timestamp: i64,
    /// The unix timestamp when the quotes verification status expires.
    pub valid_until: i64,

    /// The unix timestamp when the quote was created.
    pub created_at: i64,

    // Quote Verifier ONLY fields
    /// The off-chain registry where the verifiers quote can be located.
    pub quote_registry: [u8; 32],
    /// Key to lookup the buffer data on IPFS or an alternative decentralized storage solution.
    pub registry_key: [u8; 64],
    /// Whether the quote is located on the AttestationQueues buffer.
    pub is_on_queue: bool,
    /// The last time the quote heartbeated on-chain.
    pub last_heartbeat: i64,

    // FunctionAccount only fields
    /// The PDA bump. Only set for FunctionAccount quotes.
    pub bump: u8,

    /// The SwitchboardWallet account containing the reward escrow for verifying quotes on-chain.
    /// We should set this whenever the operator changes so we dont need to pass another account and can verify with has_one.
    pub reward_escrow: Pubkey,
    /// The SwitchboardWallet account containing the queues required min_stake.
    /// Needs to be separate from the reward_escrow. Allows easier 3rd party management of stake from rewards.
    pub stake_wallet: Pubkey,

    /// Reserved.
    pub _ebuf: [u8; 928],
}

unsafe impl Pod for EnclaveAccountData {}
unsafe impl Zeroable for EnclaveAccountData {}

impl Discriminator for EnclaveAccountData {
    const DISCRIMINATOR: [u8; 8] = [90, 162, 39, 88, 77, 157, 156, 165];
}

impl Owner for EnclaveAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}
impl ZeroCopy for EnclaveAccountData {}

impl EnclaveAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<EnclaveAccountData>()
    }

    /// Returns the deserialized Switchboard Quote account
    ///
    /// # Arguments
    ///
    /// * `quote_account_info` - A Solana AccountInfo referencing an existing Switchboard QuoteAccount
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::EnclaveAccountData;
    ///
    /// let quote_account = EnclaveAccountData::new(quote_account_info)?;
    /// ```
    pub fn new<'info>(
        quote_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, EnclaveAccountData>> {
        let data = quote_account_info.try_borrow_data()?;
        if data.len() < EnclaveAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != EnclaveAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<EnclaveAccountData>() + 8])
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
    /// use switchboard_solana::EnclaveAccountData;
    ///
    /// let quote_account = EnclaveAccountData::new(quote_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&EnclaveAccountData> {
        if data.len() < EnclaveAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != EnclaveAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<EnclaveAccountData>() + 8],
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

    cfg_client! {
        pub async fn fetch(
            client: &solana_client::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::Error> {
            crate::client::load_account(client, pubkey).await
        }
    }
}
