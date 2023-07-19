use crate::*;

#[account(zero_copy(unsafe))]
pub struct HouseState {
    pub bump: u8,
    pub max_guess: u8,
    pub authority: Pubkey,
    pub function: Pubkey,
    pub token_wallet: Pubkey,
}

#[repr(u8)]
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum RoundStatus {
    #[default]
    None = 0,
    Pending,
    Settled,
}
impl From<RoundStatus> for u8 {
    fn from(value: RoundStatus) -> Self {
        match value {
            RoundStatus::Pending => 1,
            RoundStatus::Settled => 2,
            _ => 0,
        }
    }
}
impl From<u8> for RoundStatus {
    fn from(value: u8) -> Self {
        match value {
            1 => RoundStatus::Pending,
            2 => RoundStatus::Settled,
            _ => RoundStatus::default(),
        }
    }
}

#[zero_copy(unsafe)]
pub struct UserRound {
    pub request: Pubkey,
    pub guess: u8,
    pub status: RoundStatus,
    pub result: u8,
    pub wager: u64,
    pub slot: u64,
    pub timestamp: i64,
}

#[account(zero_copy(unsafe))]
pub struct UserState {
    pub bump: u8,
    pub authority: Pubkey,
    pub token_wallet: Pubkey,
    pub current_round: UserRound,
    pub last_round: UserRound,
}
