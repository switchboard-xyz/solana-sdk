use crate::*;

#[error_code]
#[derive(Eq, PartialEq)]
pub enum RandomnessRequestError {
    #[msg("Invalid authority account")]
    InvalidAuthority,
    #[msg("Invalid escrow account")]
    InvalidEscrow,
    #[msg("Array overflow")]
    ArrayOverflow,
    #[msg("Stale data")]
    StaleData,
    #[msg("Invalid trusted signer")]
    InvalidTrustedSigner,
    #[msg("Invalid MRENCLAVE")]
    InvalidMrEnclave,
    #[msg("Failed to find a valid trading symbol for this price")]
    InvalidSymbol,
    #[msg("FunctionAccount pubkey did not match program_state.function")]
    IncorrectSwitchboardFunction,
    #[msg("FunctionAccount pubkey did not match program_state.function")]
    InvalidSwitchboardFunction,
    #[msg("FunctionAccount was not validated successfully")]
    FunctionValidationFailed,
    #[msg("FunctionRequestAccount status should be 'RequestSuccess'")]
    SwitchboardRequestNotSuccessful,
    #[msg("Round is inactive")]
    RoundInactive,
    #[msg("House has insufficient funds to payout winners")]
    HouseInsufficientFunds,
}
