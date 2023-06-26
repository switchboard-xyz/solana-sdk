use crate::prelude::*;
use anchor_lang::{Discriminator, Owner, ZeroCopy};
use bytemuck::{Pod, Zeroable};

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(Debug)]
pub struct AttestationProgramState {
    pub bump: u8,
    pub _ebuf: [u8; 2048],
}

unsafe impl Pod for AttestationProgramState {}
unsafe impl Zeroable for AttestationProgramState {}

impl Discriminator for AttestationProgramState {
    const DISCRIMINATOR: [u8; 8] = [42, 145, 190, 11, 203, 77, 146, 231];
}

impl Owner for AttestationProgramState {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl ZeroCopy for AttestationProgramState {}

impl AttestationProgramState {
    pub fn get_pda() -> Pubkey {
        let (pda_key, _) =
            Pubkey::find_program_address(&[STATE_SEED], &SWITCHBOARD_ATTESTATION_PROGRAM_ID);
        pda_key
    }

    pub fn verify_pda(expected: &Pubkey) -> Result<()> {
        let key = Self::get_pda();
        if key != *expected {
            return Err(error!(SwitchboardError::PdaDerivationError));
        }
        Ok(())
    }
}
