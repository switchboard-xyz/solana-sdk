use crate::prelude::*;

#[zero_copy(unsafe)]
#[derive(Default)]
#[repr(packed)]
pub struct SlidingWindowElement {
    pub oracle_key: Pubkey,
    pub value: SwitchboardDecimal,
    pub slot: u64,
    pub timestamp: i64,
}

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct SlidingResultAccountData {
    pub data: [SlidingWindowElement; 16],
    pub bump: u8,
    pub _ebuf: [u8; 512],
}

impl SlidingResultAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<SlidingResultAccountData>()
    }
}
