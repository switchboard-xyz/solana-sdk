use crate::*;

#[error_code]
#[derive(Eq, PartialEq)]
pub enum MyError {
    #[msg("Invalid authority account")]
    InvalidAuthority,
    #[msg("Invalid round len")]
    InvalidRoundLen,
    #[msg("Invalid escrow account")]
    InvalidEscrow,
    #[msg("round_start not ready")]
    RoundStartNotReady,
    #[msg("round_close not ready")]
    RoundCloseNotReady,
    #[msg("Invalid request account")]
    InvalidRequest,
}
