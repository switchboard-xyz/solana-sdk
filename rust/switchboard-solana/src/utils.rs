pub use crate::error::SwitchboardError;
pub use crate::prelude::*;
use lazy_static::lazy_static;
use std::str::FromStr;

lazy_static! {
    pub static ref ATOKEN_PID: Pubkey =
        Pubkey::from_str("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL").unwrap();
    pub static ref TOKEN_PID: Pubkey =
        Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();
}

pub fn find_associated_token_address(owner: &Pubkey, mint: &Pubkey) -> Pubkey {
    let (akey, _bump) = Pubkey::find_program_address(
        &[owner.as_ref(), TOKEN_PID.as_ref(), mint.as_ref()],
        &ATOKEN_PID,
    );
    akey
}

pub fn get_ixn_discriminator(ixn_name: &str) -> [u8; 8] {
    let preimage = format!("global:{}", ixn_name);
    let mut sighash = [0u8; 8];
    sighash.copy_from_slice(
        &anchor_lang::solana_program::hash::hash(preimage.as_bytes()).to_bytes()[..8],
    );
    sighash
}

pub fn build_ix<A: ToAccountMetas, I: InstructionData + Discriminator + std::fmt::Debug>(
    program_id: &Pubkey,
    accounts: &A,
    params: &I,
) -> Instruction {
    Instruction {
        program_id: *program_id,
        accounts: accounts.to_account_metas(None),
        data: params.data(),
    }
}
