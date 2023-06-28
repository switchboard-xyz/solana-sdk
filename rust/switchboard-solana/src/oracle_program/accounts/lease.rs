use crate::prelude::*;

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct LeaseAccountData {
    /// Public key of the token account holding the lease contract funds until rewarded to oracles for successfully processing updates
    pub escrow: Pubkey, // Needed, maybe derived, key + "update_escrow"?
    /// Public key of the oracle queue that the lease contract is applicable for.
    pub queue: Pubkey,
    /// Public key of the aggregator that the lease contract is applicable for
    pub aggregator: Pubkey,
    /// Public key of the Solana token program ID.
    pub token_program: Pubkey,
    /// Whether the lease contract is still active.
    pub is_active: bool,
    /// Index of an aggregators position on a crank.
    pub crank_row_count: u32,
    /// 	Timestamp when the lease contract was created.
    pub created_at: i64,
    /// Counter keeping track of the number of updates for the given aggregator.
    pub update_count: u128,
    /// Public key of keypair that may withdraw funds from the lease at any time
    pub withdraw_authority: Pubkey,
    /// The PDA bump to derive the pubkey.
    pub bump: u8,
    // Reserved for future info.
    pub _ebuf: [u8; 255],
}

impl LeaseAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<LeaseAccountData>()
    }
}
