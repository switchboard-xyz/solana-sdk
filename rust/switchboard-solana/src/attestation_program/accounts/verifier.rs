use crate::cfg_client;
use crate::prelude::*;
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

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
pub struct VerifierAccountData {
    /// Represents the state of the quote verifiers enclave.
    pub enclave: Quote,

    // Accounts Config
    /// The authority of the EnclaveAccount which is permitted to make account changes.
    pub authority: Pubkey,
    /// Queue used for attestation to verify a MRENCLAVE measurement.
    pub attestation_queue: Pubkey,

    // Metadata Config
    /// The unix timestamp when the quote was created.
    pub created_at: i64,

    // Queue Config
    /// Whether the quote is located on the AttestationQueues buffer.
    pub is_on_queue: bool,
    /// The last time the quote heartbeated on-chain.
    pub last_heartbeat: i64,

    // Token Config
    /// The SwitchboardWallet account containing the reward escrow for verifying quotes on-chain.
    /// We should set this whenever the operator changes so we dont need to pass another account and can verify with has_one.
    pub reward_escrow: Pubkey,
    /// The SwitchboardWallet account containing the queues required min_stake.
    /// Needs to be separate from the reward_escrow. Allows easier 3rd party management of stake from rewards.
    pub stake_wallet: Pubkey,

    /// Reserved.
    pub _ebuf: [u8; 1024],
}

impl anchor_lang::AccountDeserialize for VerifierAccountData {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < VerifierAccountData::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if VerifierAccountData::discriminator() != given_disc {
            return Err(
                anchor_lang::error::Error::from(anchor_lang::error::AnchorError {
                    error_name: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch.name(),
                    error_code_number: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch
                        .into(),
                    error_msg: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch
                        .to_string(),
                    error_origin: Some(anchor_lang::error::ErrorOrigin::Source(
                        anchor_lang::error::Source {
                            filename: "programs/attestation_program/src/lib.rs",
                            line: 1u32,
                        },
                    )),
                    compared_values: None,
                })
                .with_account_name("VerifierAccountData"),
            );
        }
        Self::try_deserialize_unchecked(buf)
    }
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let data: &[u8] = &buf[8..];
        bytemuck::try_from_bytes(data)
            .map(|r: &Self| *r)
            .map_err(|_| anchor_lang::error::ErrorCode::AccountDidNotDeserialize.into())
    }
}

unsafe impl Pod for VerifierAccountData {}
unsafe impl Zeroable for VerifierAccountData {}

impl Discriminator for VerifierAccountData {
    const DISCRIMINATOR: [u8; 8] = [106, 146, 60, 232, 231, 52, 189, 253];
}

impl Owner for VerifierAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}
impl ZeroCopy for VerifierAccountData {}

impl VerifierAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<VerifierAccountData>()
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
    /// use switchboard_solana::VerifierAccountData;
    ///
    /// let quote_account = VerifierAccountData::new(quote_account_info)?;
    /// ```
    pub fn new<'info>(
        quote_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, VerifierAccountData>> {
        let data = quote_account_info.try_borrow_data()?;
        if data.len() < VerifierAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VerifierAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<VerifierAccountData>() + 8])
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
    /// use switchboard_solana::VerifierAccountData;
    ///
    /// let quote_account = VerifierAccountData::new(quote_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&VerifierAccountData> {
        if data.len() < VerifierAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VerifierAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<VerifierAccountData>() + 8],
        ))
    }

    pub fn signer(&self) -> Pubkey {
        self.enclave.enclave_signer
    }

    pub fn assert_signer(&self, signer: &AccountInfo) -> anchor_lang::Result<()> {
        if self.enclave.enclave_signer != signer.key() {
            return Err(error!(SwitchboardError::InvalidEnclaveSigner));
        }

        Ok(())
    }

    pub fn is_verified(&self, clock: &Clock) -> bool {
        match self.enclave.verification_status.into() {
            VerificationStatus::VerificationOverride => true,
            VerificationStatus::VerificationSuccess => {
                self.enclave.valid_until > clock.unix_timestamp
            }
            _ => false,
        }
    }

    pub fn verify(&self, clock: &Clock) -> anchor_lang::Result<()> {
        if !self.is_verified(clock) {
            return Err(error!(SwitchboardError::InvalidQuote));
        }

        Ok(())
    }

    cfg_client! {
        pub fn fetch(
            client: &solana_client::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::SbError> {
            crate::client::fetch_zerocopy_account(client, pubkey)
        }

        pub async fn fetch_async(
            client: &solana_client::nonblocking::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::SbError> {
            crate::client::fetch_zerocopy_account_async(client, pubkey).await
        }

        pub fn fetch_sync<T: solana_sdk::client::SyncClient>(
            client: &T,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::SbError> {
            crate::client::fetch_zerocopy_account_sync(client, pubkey)
        }
    }
}
