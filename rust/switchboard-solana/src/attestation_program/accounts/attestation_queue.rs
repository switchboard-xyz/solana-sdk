use crate::cfg_client;
use crate::prelude::*;
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct AttestationQueueAccountData {
    /// The address of the authority which is permitted to add/remove allowed enclave measurements.
    pub authority: Pubkey,
    /// Allowed enclave measurements.
    pub mr_enclaves: [[u8; 32]; 32],
    /// The number of allowed enclave measurements.
    pub mr_enclaves_len: u32,
    /// The addresses of the quote verifiers who have a valid
    /// verification status and have heartbeated on-chain recently.
    pub data: [Pubkey; 128],
    /// The length of valid quote verifiers for the given attestation queue.
    pub data_len: u32,
    /// Allow authority to force add a node after X seconds with no heartbeat.
    pub allow_authority_override_after: i64,
    /// Even if a heartbeating machine quote verifies with proper measurement,
    /// require authority signoff.
    pub require_authority_heartbeat_permission: bool,
    /// Require FunctionAccounts to have PermitQueueUsage before they are executed.
    pub require_usage_permissions: bool,
    /// The maximum allowable time until a EnclaveAccount needs to be re-verified on-chain.
    pub max_quote_verification_age: i64,
    /// The reward paid to quote verifiers for attesting on-chain.
    pub reward: u32, //TODO
    /// The unix timestamp when the last quote verifier heartbeated on-chain.
    pub last_heartbeat: i64,
    pub node_timeout: i64, // TODO ??
    /// Incrementer used to track the current quote verifier permitted to run any available functions.
    pub curr_idx: u32,
    /// Incrementer used to garbage collect and remove stale quote verifiers.
    pub gc_idx: u32,

    /// The minimum number of lamports a quote verifier needs to lock-up in order to heartbeat and verify other quotes.
    pub verifier_min_stake: u64,
    /// The minimum number of lamports a function needs to lock-up in order to use a queues resources.
    pub function_min_stake: u64,

    /// Reserved.
    pub _ebuf: [u8; 1008],
}

impl anchor_lang::AccountDeserialize for AttestationQueueAccountData {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < AttestationQueueAccountData::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if AttestationQueueAccountData::discriminator() != given_disc {
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
                .with_account_name("AttestationQueueAccountData"),
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

unsafe impl Pod for AttestationQueueAccountData {}
unsafe impl Zeroable for AttestationQueueAccountData {}

impl Discriminator for AttestationQueueAccountData {
    const DISCRIMINATOR: [u8; 8] = [192, 53, 130, 67, 234, 207, 39, 171];
}

impl Owner for AttestationQueueAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl ZeroCopy for AttestationQueueAccountData {}

impl AttestationQueueAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<AttestationQueueAccountData>()
    }

    /// Returns the deserialized Switchboard AttestationQueue account
    ///
    /// # Arguments
    ///
    /// * `attestation_queue_account_info` - A Solana AccountInfo referencing an existing Switchboard AttestationQueue
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::AttestationQueueAccountData;
    ///
    /// let attestation_queue = AttestationQueueAccountData::new(attestation_queue_account_info)?;
    /// ```
    pub fn new<'info>(
        attestation_queue_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, AttestationQueueAccountData>> {
        let data = attestation_queue_account_info.try_borrow_data()?;
        if data.len() < AttestationQueueAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != AttestationQueueAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<AttestationQueueAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard AttestationQueue account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::AttestationQueueAccountData;
    ///
    /// let attestation_queue = AttestationQueueAccountData::new(attestation_queue_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&AttestationQueueAccountData> {
        if data.len() < AttestationQueueAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != AttestationQueueAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<AttestationQueueAccountData>() + 8],
        ))
    }

    pub fn has_mr_enclave(&self, mr_enclave: &[u8]) -> bool {
        self.mr_enclaves[..self.mr_enclaves_len as usize]
            .iter()
            .any(|x| x.to_vec() == mr_enclave.to_vec())
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
