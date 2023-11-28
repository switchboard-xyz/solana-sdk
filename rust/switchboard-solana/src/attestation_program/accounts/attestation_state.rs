use crate::prelude::*;
use anchor_lang::{Discriminator, Owner, ZeroCopy};
use bytemuck::{Pod, Zeroable};

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(Debug, AnchorDeserialize)]
pub struct AttestationProgramState {
    pub bump: u8,
    pub _ebuf: [u8; 2048],
}

impl anchor_lang::AccountDeserialize for AttestationProgramState {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < AttestationProgramState::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if AttestationProgramState::discriminator() != given_disc {
            return Err(
                anchor_lang::error::Error::from(anchor_lang::error::AnchorError {
                    error_name: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch.name(),
                    error_code_number: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch
                        .into(),
                    error_msg: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch
                        .to_string(),
                    error_origin: Some(anchor_lang::error::ErrorOrigin::Source(
                        anchor_lang::error::Source {
                            filename: "programs/attestation_program/src/lib.rs",
                            line: 1u32,
                        },
                    )),
                    compared_values: None,
                })
                .with_account_name("AttestationProgramState"),
            );
        }
        Self::try_deserialize_unchecked(buf)
    }
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let mut data: &[u8] = &buf[8..];
        AnchorDeserialize::deserialize(&mut data)
            .map_err(|_| anchor_lang::error::ErrorCode::AccountDidNotDeserialize.into())
    }
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
    pub fn size() -> usize {
        8 + std::mem::size_of::<AttestationProgramState>()
    }

    pub fn get_pda() -> Pubkey {
        let (pda_key, _) =
            Pubkey::find_program_address(&[STATE_SEED], &SWITCHBOARD_ATTESTATION_PROGRAM_ID);
        pda_key
    }

    pub fn get_program_pda(program_id: Option<Pubkey>) -> Pubkey {
        let (pda_key, _) = Pubkey::find_program_address(
            &[STATE_SEED],
            &program_id.unwrap_or(SWITCHBOARD_ATTESTATION_PROGRAM_ID),
        );
        pda_key
    }

    pub fn verify_pda(expected: &Pubkey) -> anchor_lang::Result<()> {
        let key = Self::get_pda();
        if key != *expected {
            return Err(error!(SwitchboardError::PdaDerivationError));
        }
        Ok(())
    }
}
