use solana_program::instruction::Instruction;
use solana_program::pubkey::Pubkey;
use solana_program::{hash, pubkey};

use crate::anchor_traits::*;

/// Check if devnet environment is enabled via feature flag OR SB_ENV environment variable
pub fn is_devnet() -> bool {
    cfg!(feature = "devnet") || std::env::var("SB_ENV").unwrap_or_default() == "devnet"
}

/// Default devnet queue address
pub const DEFAULT_DEVNET_QUEUE: Pubkey = pubkey!("EYiAmGSdsQTuCw413V5BzaruWuCCSDgTPtBGvLkXHbe7");
/// Default mainnet queue address
pub const DEFAULT_MAINNET_QUEUE: Pubkey = pubkey!("A43DyUGA7s8eXPxqEjJY6EBu1KKbNgfxF8h17VAHn13w");

/// Returns the default queue address based on the environment (devnet or mainnet)
pub fn default_queue() -> Pubkey {
    if is_devnet() {
        DEFAULT_DEVNET_QUEUE
    } else {
        DEFAULT_MAINNET_QUEUE
    }
}

/// SPL Associated Token Account program ID
pub const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: Pubkey =
    pubkey!("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

/// SPL Token program ID
pub const SPL_TOKEN_PROGRAM_ID: Pubkey = pubkey!("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

/// Finds the associated token account address for a given owner and mint
pub fn find_associated_token_address(owner: &Pubkey, mint: &Pubkey) -> Pubkey {
    let (akey, _bump) = Pubkey::find_program_address(
        &[owner.as_ref(), SPL_TOKEN_PROGRAM_ID.as_ref(), mint.as_ref()],
        &SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    );
    akey
}

/// Gets the instruction discriminator for a given instruction name
pub fn get_ixn_discriminator(ixn_name: &str) -> [u8; 8] {
    let preimage = format!("global:{}", ixn_name);
    let mut sighash = [0u8; 8];
    sighash.copy_from_slice(&solana_program::hash::hash(preimage.as_bytes()).to_bytes()[..8]);
    sighash
}

/// Gets the account discriminator for a given account name
pub fn get_account_discriminator(account_name: &str) -> [u8; 8] {
    let id = format!("account:{}", account_name);
    hash::hash(id.as_bytes()).to_bytes()[..8]
        .try_into()
        .unwrap()
}

/// Reads a u64 value from a pointer at a given offset (unsafe)
#[inline(always)]
pub unsafe fn read_u64_at(ptr: *const u64, offset: usize) -> u64 {
    core::ptr::read_unaligned(ptr.add(offset))
}

/// Reads a u64 value from a pointer (unsafe)
#[inline(always)]
pub unsafe fn read(ptr: *const u64, offset: usize) -> u64 {
    *(ptr.add(offset) as *const u64)
}

/// Efficiently compares two Pubkeys for equality
#[inline(always)]
pub fn check_pubkey_eq(lhs: &Pubkey, rhs: &Pubkey) -> bool {
    unsafe {
        let lhs_ptr = lhs.as_ref().as_ptr() as *const u64;
        let rhs_ptr = rhs.as_ref().as_ptr() as *const u64;
        core::ptr::read_unaligned(lhs_ptr) == core::ptr::read_unaligned(rhs_ptr)
            && core::ptr::read_unaligned(lhs_ptr.add(1))
                == core::ptr::read_unaligned(rhs_ptr.add(1))
            && core::ptr::read_unaligned(lhs_ptr.add(2))
                == core::ptr::read_unaligned(rhs_ptr.add(2))
            && core::ptr::read_unaligned(lhs_ptr.add(3))
                == core::ptr::read_unaligned(rhs_ptr.add(3))
    }
}

/// Efficiently compares two 32-byte arrays via u64 pointers (unsafe)
#[inline(always)]
pub unsafe fn check_p64_eq(lhs_ptr: *const u64, rhs_ptr: *const u64) -> bool {
    core::ptr::read_unaligned(lhs_ptr) == core::ptr::read_unaligned(rhs_ptr)
        && core::ptr::read_unaligned(lhs_ptr.add(1)) == core::ptr::read_unaligned(rhs_ptr.add(1))
        && core::ptr::read_unaligned(lhs_ptr.add(2)) == core::ptr::read_unaligned(rhs_ptr.add(2))
        && core::ptr::read_unaligned(lhs_ptr.add(3)) == core::ptr::read_unaligned(rhs_ptr.add(3))
}

/// Builds a Solana instruction from account metas and instruction data
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
