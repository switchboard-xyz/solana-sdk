use anchor_lang::prelude::*;

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct AttestationState {
    pub bump: u8,
    pub _ebuf: [u8; 2048],
}

impl AttestationState {}
