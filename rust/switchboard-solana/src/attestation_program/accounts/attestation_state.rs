use anchor_lang::prelude::*;
use anchor_lang::{Discriminator, Owner, ZeroCopy};
use bytemuck::{Pod, Zeroable};

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(Debug)]
pub struct AttestationState {
    pub bump: u8,
    pub _ebuf: [u8; 2048],
}

unsafe impl Pod for AttestationState {}
unsafe impl Zeroable for AttestationState {}

impl Discriminator for AttestationState {
    const DISCRIMINATOR: [u8; 8] = [216, 146, 107, 94, 104, 75, 182, 177];
}

impl Owner for AttestationState {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl ZeroCopy for AttestationState {}

impl AttestationState {}
