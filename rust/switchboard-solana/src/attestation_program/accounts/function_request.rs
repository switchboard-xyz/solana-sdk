use crate::{cfg_client, prelude::*};
use solana_program::borsh::get_instance_packed_len;

#[repr(u8)]
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum RequestStatus {
    #[default]
    None = 0,
    RequestPending = 1,
    RequestCancelled = 2,
    RequestFailure = 3,
    RequestExpired = 4,
    RequestSuccess = 5,
}
impl From<RequestStatus> for u8 {
    fn from(value: RequestStatus) -> Self {
        match value {
            RequestStatus::RequestPending => 1,
            RequestStatus::RequestCancelled => 2,
            RequestStatus::RequestFailure => 3,
            RequestStatus::RequestExpired => 4,
            RequestStatus::RequestSuccess => 5,
            _ => 0,
        }
    }
}
impl From<u8> for RequestStatus {
    fn from(value: u8) -> Self {
        match value {
            1 => RequestStatus::RequestPending,
            2 => RequestStatus::RequestCancelled,
            3 => RequestStatus::RequestFailure,
            4 => RequestStatus::RequestExpired,
            5 => RequestStatus::RequestSuccess,
            _ => RequestStatus::default(),
        }
    }
}

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRequestTriggerRound {
    /// The status of the request.
    pub status: RequestStatus,
    /// The SOL bounty in lamports used to incentivize a verifier to expedite the request.
    pub bounty: u64,
    /// The slot the request was published
    pub request_slot: u64,
    /// The slot when the request was fulfilled
    pub fulfilled_slot: u64,
    /// The slot when the request will expire and be able to be closed by the non-authority account
    pub expiration_slot: u64,
    /// The EnclaveAccount who verified the enclave for this request
    pub verifier: Pubkey,
    /// The keypair generated in the enclave and required to sign any
    /// valid transactions processed by the function.
    pub enclave_signer: Pubkey,
    /// Reserved.
    pub _ebuf: [u8; 64],
}
impl Default for FunctionRequestTriggerRound {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

// #[account]
#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct FunctionRequestAccountData {
    // Up-Front Params for RPC filtering
    /// Whether the request is ready to be processed.
    pub is_triggered: u8,
    /// The status of the current request.
    pub status: RequestStatus,

    // Accounts
    /// Signer allowed to cancel the request.
    pub authority: Pubkey,
    /// The default destination for rent exemption when the account is closed.
    pub payer: Pubkey,
    /// The function that can process this request
    pub function: Pubkey,
    /// The tokenAccount escrow
    pub escrow: Pubkey,
    /// The Attestation Queue for this request.
    pub attestation_queue: Pubkey,

    // Rounds
    /// The current active request.
    pub active_request: FunctionRequestTriggerRound,
    /// The previous request.
    pub previous_request: FunctionRequestTriggerRound,

    // Container Params
    /// The maximum number of bytes to pass to the container params.
    pub max_container_params_len: u32,
    /// Hash of the serialized container_params to prevent RPC tampering.
    /// Should be verified within your function to ensure you are using the correct parameters.
    pub container_params_hash: [u8; 32],
    /// The stringified container params to pass to the function.
    pub container_params: Vec<u8>,

    // Metadata
    /// The unix timestamp when the function was created.
    pub created_at: i64,
    /// The slot when the account can be garbage collected and closed by anyone for a portion of the rent.
    pub garbage_collection_slot: Option<u64>,

    /// Reserved.
    pub _ebuf: [u8; 256],
}
impl Default for FunctionRequestAccountData {
    fn default() -> Self {
        Self {
            is_triggered: 0,
            status: RequestStatus::None,
            authority: Pubkey::default(),
            payer: Pubkey::default(),
            function: Pubkey::default(),
            escrow: Pubkey::default(),
            attestation_queue: Pubkey::default(),
            active_request: FunctionRequestTriggerRound::default(),
            previous_request: FunctionRequestTriggerRound::default(),
            max_container_params_len: 0,
            container_params_hash: [0u8; 32],
            container_params: Vec::new(),
            created_at: 0,
            garbage_collection_slot: None,
            _ebuf: [0u8; 256],
        }
    }
}

impl anchor_lang::AccountSerialize for FunctionRequestAccountData {
    fn try_serialize<W: std::io::Write>(&self, writer: &mut W) -> anchor_lang::Result<()> {
        if writer
            .write_all(&FunctionRequestAccountData::discriminator())
            .is_err()
        {
            return Err(anchor_lang::error::ErrorCode::AccountDidNotSerialize.into());
        }
        if AnchorSerialize::serialize(self, writer).is_err() {
            return Err(anchor_lang::error::ErrorCode::AccountDidNotSerialize.into());
        }
        Ok(())
    }
}

impl anchor_lang::AccountDeserialize for FunctionRequestAccountData {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < FunctionRequestAccountData::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if FunctionRequestAccountData::discriminator() != given_disc {
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
                .with_account_name("FunctionRequestAccountData"),
            );
        }
        Self::try_deserialize_unchecked(buf)
    }
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let mut data: &[u8] = &buf[8..];
        AnchorDeserialize::deserialize(&mut data)
            .map_err(|_| anchor_lang::error::ErrorCode::AccountDidNotDeserialize.into())
    }
}

impl Discriminator for FunctionRequestAccountData {
    const DISCRIMINATOR: [u8; 8] = [8, 14, 177, 85, 144, 65, 148, 246];
}

impl Owner for FunctionRequestAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl FunctionRequestAccountData {
    pub fn space(len: Option<u32>) -> usize {
        let base: usize = 8  // discriminator
            + get_instance_packed_len(&FunctionRequestAccountData::default()).unwrap();
        let vec_elements: usize = len.unwrap_or(crate::DEFAULT_USERS_CONTAINER_PARAMS_LEN) as usize;
        base + vec_elements
    }

    // verify if their is a non-expired pending request
    pub fn is_round_active(&self, clock: &Clock) -> bool {
        if self.status == RequestStatus::RequestPending {
            if self.active_request.expiration_slot < clock.slot {
                return false;
            }

            return true;
        }

        false
    }

    cfg_client! {
        pub fn get_is_triggered_filter() -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new(
                8,
                solana_client::rpc_filter::MemcmpEncodedBytes::Bytes(vec![1u8]),
            ))
        }

        pub fn get_is_active_filter() -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new(
                9,
                solana_client::rpc_filter::MemcmpEncodedBytes::Bytes(vec![RequestStatus::RequestPending as u8]),
            ))
        }

        pub fn get_queue_filter(queue_pubkey: &Pubkey) -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new(
                138,
                solana_client::rpc_filter::MemcmpEncodedBytes::Bytes(queue_pubkey.to_bytes().into()),
            ))
        }

        pub fn get_is_ready_filters(queue_pubkey: &Pubkey) -> Vec<solana_client::rpc_filter::RpcFilterType> {
            vec![
                FunctionRequestAccountData::get_is_triggered_filter(),
                FunctionRequestAccountData::get_is_active_filter(),
                FunctionRequestAccountData::get_queue_filter(queue_pubkey),
            ]
        }

        pub async fn fetch(
            client: &solana_client::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::Error> {
            crate::client::fetch_anchor_account(client, pubkey).await
        }
    }
}
