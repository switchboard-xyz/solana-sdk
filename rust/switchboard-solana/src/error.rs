use crate::prelude::*;

#[error_code]
#[derive(Eq, PartialEq)]
pub enum SwitchboardError {
    #[msg("Aggregator is not currently populated with a valid round")]
    InvalidAggregatorRound,
    #[msg("Failed to convert string to decimal format")]
    InvalidStrDecimalConversion,
    #[msg("Decimal conversion method failed")]
    DecimalConversionError,
    #[msg("An integer overflow occurred")]
    IntegerOverflowError,
    #[msg("Account discriminator did not match")]
    AccountDiscriminatorMismatch,
    #[msg("Vrf value is empty")]
    VrfEmptyError,
    #[msg("Failed to send requestRandomness instruction")]
    VrfCpiError,
    #[msg("Failed to send signed requestRandomness instruction")]
    VrfCpiSignedError,
    #[msg("Failed to deserialize account")]
    AccountDeserializationError,
    #[msg("Switchboard feed exceeded the staleness threshold")]
    StaleFeed,
    #[msg("Switchboard feed exceeded the confidence interval threshold")]
    ConfidenceIntervalExceeded,
    #[msg("Invalid authority provided to Switchboard account")]
    InvalidAuthority,
    #[msg("Switchboard value variance exceeded threshold")]
    AllowedVarianceExceeded,
    #[msg("Invalid function input")]
    InvalidFunctionInput,
    #[msg("Failed to compute the PDA")]
    PdaDerivationError,
    #[msg("Illegal Operation")]
    IllegalExecuteAttempt,
    #[msg("The provided enclave quote is invalid")]
    InvalidQuote,
    #[msg("The provided queue address did not match the expected address on-chain")]
    InvalidQueue,
    #[msg("The provided enclave_signer does not match the expected enclave_signer")]
    InvalidEnclaveSigner,
    #[msg("The provided mint did not match the wrapped SOL mint address")]
    InvalidNativeMint,
    #[msg("This account has zero mr_enclaves defined")]
    MrEnclavesEmpty,
    InvalidMrEnclave,
    #[msg("The FunctionAccount status is not active (1)")]
    FunctionNotReady,
    #[msg("The FunctionAccount has set requests_disabled to true and disabled this action")]
    UserRequestsDisabled,
    FunctionRoutinesDisabled,
    #[msg(
        "The PermissionAccount is missing the required flags for this action. Check the queues config to see which permissions are required"
    )]
    PermissionDenied,
    ConfigParameterLocked,
}

use crate::cfg_client;

cfg_client! {
    pub use switchboard_common::{ SbError, SbFunctionError };
}
