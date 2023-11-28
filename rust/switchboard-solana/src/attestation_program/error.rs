use crate::*;

// #[repr(u8)]
// pub enum SwitchboardFunctionError {
//     /// The function account has invalid permissions for its queue
//     InvalidPermissions = 250,
//     /// Failed to find the function result in the emitted container logs
//     FunctionResultNotFound = 253,
//     /// Failed to execute the function's callback
//     FunctionCallbackError = 254,
//     /// Function failed to emit a result before the oracles timeout
//     FunctionTimeout = 255,
// }

#[error_code]
#[derive(Eq, PartialEq)]
pub enum SwitchboardError {
    GenericError,
    #[msg("The provided enclave quote is invalid")]
    InvalidQuote,
    #[msg("The EnclaveAccount has expired and needs to be reverified")]
    QuoteExpired,
    InvalidNode,
    #[msg("The provided queue is empty and has no verifier oracles heartbeating on-chain.")]
    InsufficientQueue,
    #[msg("The provided queue is full and cannot support new verifiers")]
    QueueFull,
    #[msg("The provided enclave_signer does not match the expected enclave_signer on the EnclaveAccount")]
    InvalidEnclaveSigner,
    InvalidSigner,
    #[msg("This account has zero mr_enclaves defined")]
    MrEnclavesEmpty,
    #[msg("The MrEnclave value already exists in the array")]
    MrEnclaveAlreadyExists,
    #[msg("The MrEnclave value was not found in the whitelist")]
    MrEnclaveDoesntExist,
    #[msg("This account has a full mr_enclaves array. Remove some measurements to make room for new ones")]
    MrEnclaveAtCapacity,
    #[msg("The PermissionAccount is missing the required flags for this action. Check the queues config to see which permissions are required")]
    PermissionDenied,
    InvalidConstraint,
    InvalidTimestamp,
    InvalidMrEnclave,
    InvalidReportData,
    InsufficientLoadAmount,
    #[msg("The provided timestamp is not within the expected range. This may be indicative of an unhealthy enclave.")]
    IncorrectObservedTime,
    InvalidQuoteMode,
    InvalidVerifierIdx,
    InvalidSelfVerifyRequest,
    #[msg("The provided mr_enclave measurement did not match a value in its enclave settings. If you recently modified your function container, you may need to update the measurement in your FunctionAccount config.")]
    IncorrectMrEnclave,
    InvalidResponder,
    #[msg("The provided address_lookup_address did not match the expected address on-chain")]
    InvalidAddressLookupAddress,
    #[msg("The provided attestation queue address did not match the expected address on-chain")]
    InvalidQueue,
    IllegalVerifier,
    InvalidEscrow,
    #[msg("The provided authority account does not match the expected value on-chain")]
    InvalidAuthority,
    IllegalExecuteAttempt,
    #[msg("The requests expiration_slot has expired")]
    RequestExpired,
    #[msg("The escrow has insufficient funds for this action")]
    InsufficientFunds,
    #[msg("The FunctionAccount escrow is required if function.requests_fee is greater than zero")]
    MissingFunctionEscrow,
    #[msg("The provided requestSlot did not match the expected requestSlot on-chain. The request may have already been processed")]
    InvalidRequest,
    #[msg("The FunctionAccount status is not active (1)")]
    FunctionNotReady,
    #[msg("The FunctionAccount has set requests_disabled to true and disabled this action")]
    UserRequestsDisabled,
    #[msg(
        "The FunctionAccount authority is required to sign if function.requests_require_authorization is enabled"
    )]
    MissingFunctionAuthority,
    #[msg("The FunctionAccount must have no requests before it can be closed")]
    FunctionCloseNotReady,
    #[msg("Attempting to initialize an already created FunctionRequestAccount")]
    RequestAlreadyInitialized,
    AccountCloseNotPermitted,
    AccountCloseNotReady,
    #[msg("The FunctionRequestAccount is not ready to be verified")]
    FunctionRequestNotReady,
    #[msg("The container params hash does not match the expected hash on-chain. The parameters may have been modified in-flight; the assigned oracle may need to pickup the account change before re-verifying the function.")]
    InvalidParamsHash,
    RequestInvalidStatus,
    #[msg("Please ensure your parameters length is <= your account max length")]
    ContainerParamsTooLong,
    #[msg("The routine has been disabled. Please check the routine's is_disabled status for more information.")]
    RoutineDisabled,
    #[msg("The function authority has disabled routine execution for this function")]
    FunctionRoutinesDisabled,
    #[msg("The configuration parameter has been locked and cannot be changed")]
    ConfigParameterLocked,
    RequestBufferFull,
    #[msg("The request does not have an active round to verify")]
    RequestRoundNotActive,
    #[msg("The resources escrow token account has a balance of 0 and the queue reward is greater than 0")]
    EmptyEscrow,
    #[msg(
        "The SwitchboardWallet authority must sign this request in order to use its escrow wallet"
    )]
    MissingSbWalletAuthoritySigner,
    #[msg(
        "The verifier is attempting to respond to an already closed request round with the same request_slot"
    )]
    RequestRoundAlreadyClosed,
}
