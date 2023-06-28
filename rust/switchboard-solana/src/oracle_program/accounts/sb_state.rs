use crate::prelude::*;

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct SbState {
    /// The account authority permitted to make account changes.
    pub authority: Pubkey,
    /// The token mint used for oracle rewards, aggregator leases, and other reward incentives.
    pub token_mint: Pubkey,
    /// Token vault used by the program to receive kickbacks.
    pub token_vault: Pubkey,
    /// The token mint used by the DAO.
    pub dao_mint: Pubkey,
    /// The PDA bump to derive the pubkey.
    pub bump: u8,
    /// Reserved for future info.
    pub _ebuf: [u8; 991],
}

impl SbState {
    pub fn size() -> usize {
        8 + std::mem::size_of::<SbState>()
    }
}
