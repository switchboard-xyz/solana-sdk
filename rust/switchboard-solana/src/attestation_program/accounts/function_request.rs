use crate::cfg_client;
use crate::prelude::*;
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

#[repr(u8)]
#[derive(Copy, Clone, Default, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
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
    pub _ebuf: [u8; 128],
}
impl Default for FunctionRequestTriggerRound {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

// #[account]
#[derive(AnchorDeserialize, AnchorSerialize)]
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
    // TODO: add address_lookup_table? make it set to functionAccount if not provided on init?

    // Rounds
    /// The current active request.
    pub active_request: FunctionRequestTriggerRound,
    /// The previous request.
    pub previous_request: FunctionRequestTriggerRound,

    // Container Params
    /// The maximum number of bytes to pass to the container params.
    pub max_container_params_len: u32,
    /// Hash of the serialized container_params to prevent RPC tampering.
    pub hash: [u8; 32],
    /// The stringified container params to pass\
    pub container_params: Vec<u8>,

    /// Reserved.
    pub _ebuf: [u8; 256],
}

impl Discriminator for FunctionRequestAccountData {
    const DISCRIMINATOR: [u8; 8] = [8, 14, 177, 85, 144, 65, 148, 246];
}

impl Owner for FunctionRequestAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl FunctionRequestAccountData {}
