use anchor_lang::prelude::*;

#[error_code]
#[derive(Eq, PartialEq)]
pub enum SwitchboardError {
    #[msg("Aggregator is not currently populated with a valid round.")]
    InvalidAggregatorRound,
    #[msg("Failed to convert string to decimal format.")]
    InvalidStrDecimalConversion,
    #[msg("Decimal conversion method failed.")]
    DecimalConversionError,
    #[msg("An integer overflow occurred.")]
    IntegerOverflowError,
    #[msg("Account discriminator did not match.")]
    AccountDiscriminatorMismatch,
    #[msg("Vrf value is empty.")]
    VrfEmptyError,
    #[msg("Failed to send requestRandomness instruction")]
    VrfCpiError,
    #[msg("Failed to send signed requestRandomness instruction")]
    VrfCpiSignedError,
}
