use crate::*;

#[event]
pub struct FunctionFundEvent {
    pub function: Pubkey,
    pub amount: u64,
}

#[event]
pub struct FunctionRequestInitEvent {
    pub attestation_queue: Pubkey,
    pub function: Pubkey,
    pub request: Pubkey,
}

#[event]
#[derive(Default, Debug, Clone)]
pub struct FunctionRequestTriggerEvent {
    pub attestation_queue: Pubkey,
    pub request: Pubkey,
    pub function: Pubkey,
    pub container_registry: Vec<u8>,
    pub container: Vec<u8>,
    pub bounty: u64,
    pub request_slot: u64,
    pub expiration_slot: u64,
    pub container_params_hash: Vec<u8>,
}

#[event]
pub struct FunctionRequestVerifyEvent {
    pub request: Pubkey,
    pub function: Pubkey,
    pub verifier: Pubkey,
    pub container_registry: Vec<u8>,
    pub container: Vec<u8>,
    pub params: Vec<u8>,
}

#[event]
pub struct FunctionRequestVerifyErrorEvent {
    pub request: Pubkey,
    pub function: Pubkey,
    pub verifier: Pubkey,
    pub container_registry: Vec<u8>,
    pub container: Vec<u8>,
    pub params: Vec<u8>,
    pub error_code: u8,
}

#[event]
pub struct FunctionRequestCloseEvent {
    pub request: Pubkey,
    pub slot: u64,
}

#[event]
pub struct FunctionRoutineInitEvent {
    pub attestation_queue: Pubkey,
    pub function: Pubkey,
    pub routine: Pubkey,
    pub schedule: [u8; 64],
}

#[event]
pub struct FunctionRoutineVerifyEvent {
    pub routine: Pubkey,
    pub function: Pubkey,
    pub verifier: Pubkey,
    pub mr_enclave: Vec<u8>,
    pub container_registry: Vec<u8>,
    pub container: Vec<u8>,
    pub params: Vec<u8>,
}

#[event]
pub struct FunctionRoutineVerifyErrorEvent {
    pub routine: Pubkey,
    pub function: Pubkey,
    pub verifier: Pubkey,
    pub mr_enclave: Vec<u8>,
    pub container_registry: Vec<u8>,
    pub container: Vec<u8>,
    pub params: Vec<u8>,
    pub error_code: u8,
}

// TODO: deprecate
#[event]
pub struct FunctionTriggerEvent {
    pub function: Pubkey,
}

#[event]
pub struct FunctionInitEvent {
    pub function: Pubkey,
    pub container_registry: Vec<u8>,
    pub container: Vec<u8>,
    pub version: Vec<u8>,
    pub schedule: Vec<u8>,
    pub mr_enclave: Vec<u8>,
}

#[event]
#[derive(Default, Debug, Clone)]
pub struct FunctionSetConfigEvent {
    pub function: Pubkey,
    pub container_registry: Vec<u8>,
    pub container: Vec<u8>,
    pub version: Vec<u8>,
    pub schedule: Vec<u8>,
    pub mr_enclaves: Vec<Vec<u8>>,
}

#[event]
pub struct FunctionBootedEvent {
    pub function: Pubkey,
}

// TODO: deprecate
#[event]
pub struct FunctionVerifyEvent {
    pub function: Pubkey,
}

#[event]
pub struct FunctionWithdrawEvent {
    pub function: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PermissionInitEvent {
    pub permission: Pubkey,
}

#[event]
pub struct PermissionSetEvent {
    pub permission: Pubkey,
}

#[event]
pub struct QueueAddMrEnclaveEvent {
    pub queue: Pubkey,
    pub mr_enclave: [u8; 32],
}

#[event]
pub struct QueueInitEvent {
    pub queue: Pubkey,
}

#[event]
pub struct QueueRemoveMrEnclaveEvent {
    pub queue: Pubkey,
    pub mr_enclave: [u8; 32],
}

#[event]
pub struct VerifierHeartbeatEvent {
    pub verifier: Pubkey,
    pub queue: Pubkey,
}

#[event]
pub struct VerifierInitEvent {
    pub verifier: Pubkey,
}

#[event]
pub struct VerifierQuoteRotateEvent {
    pub verifier: Pubkey,
}

#[event]
pub struct VerifierQuoteOverrideEvent {
    pub verifier: Pubkey,
    pub queue: Pubkey,
}

#[event]
pub struct GarbageCollectionEvent {
    pub verifier: Pubkey,
    pub queue: Pubkey,
}

#[event]
pub struct VerifierQuoteVerifyEvent {
    pub quote: Pubkey,
    pub queue: Pubkey,
    pub verifier: Pubkey,
}

#[event]
pub struct VerifierQuoteVerifyRequestEvent {
    pub quote: Pubkey,
    pub verifier: Pubkey,
}
