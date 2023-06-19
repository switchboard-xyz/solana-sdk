use crate::*;

#[error_code]
#[derive(Eq, PartialEq)]
pub enum BasicOracleError {
    #[msg("Invalid authority account")]
    InvalidAuthority,
    #[msg("Array overflow")]
    ArrayOverflow,
    #[msg("Stale data")]
    StaleData,
    #[msg("Invalid trusted signer")]
    InvalidTrustedSigner,
    #[msg("Invalid MRENCLAVE")]
    InvalidMrEnclave,
    #[msg("Switchboard QuoteAccount has an empty MrEnclave (invalid)")]
    EmptySwitchboardQuote,
}
