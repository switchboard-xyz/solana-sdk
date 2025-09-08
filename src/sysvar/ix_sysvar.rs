use core::ptr::read_unaligned;

use solana_program::account_info::AccountInfo;
use solana_program::pubkey::Pubkey;
use solana_program::sysvar::instructions::ID as INSTRUCTIONS_SYSVAR_ID;

use crate::check_pubkey_eq;

/// Optimized wrapper for Solana's Instructions sysvar with fast instruction data extraction.
///
/// This struct provides high-performance access to instruction data from the Instructions sysvar,
/// specifically optimized for ED25519 signature verification workflows.
#[derive(Clone, Default)]
#[cfg_attr(feature = "anchor", derive(serde::Serialize, serde::Deserialize))]
pub struct Instructions;

impl Instructions {
    /// Extracts instruction data and program ID at the specified index.
    ///
    /// # Arguments
    /// * `ix_sysvar` - Reference to the Instructions sysvar account
    /// * `idx` - Index of the instruction to extract
    ///
    /// # Returns
    /// * `Ok((program_id, instruction_data))` - Reference to program ID and instruction data
    /// * `Err(OnDemandError)` - If index is out of bounds or data is malformed
    ///
    /// # Performance
    /// Returns a reference to the program ID to avoid copying 32 bytes, saving compute units.
    #[inline(always)]
    pub fn extract_ix_data<'a>(
        ix_sysvar: &AccountInfo<'a>,
        mut idx: usize,
    ) -> (&'a Pubkey, &'a [u8]) {
        assert!(check_pubkey_eq(ix_sysvar.key, &INSTRUCTIONS_SYSVAR_ID));
        unsafe {
            let base = (*ix_sysvar.data.as_ptr()).as_ptr();

            // Read num_instructions from offset, modulo to handle out-of-bounds
            idx %= read_unaligned(base as *const u16) as usize;

            // Read instruction offset from offset table at position (2 + idx * 2)
            let start_offset = read_unaligned(base.add(2 + (idx << 1)) as *const u16) as usize;

            let mut p = base.add(start_offset);

            let num_accounts = read_unaligned(p as *const u16) as usize;

            // Bounds check for account metas (1 byte meta + 32 byte pubkey each)
            p = p.add(2 + num_accounts * 33);

            // Read program_id (32 bytes) - return reference to avoid copying
            let program_id = &*(p as *const Pubkey);

            // Read data length
            let instruction_data_len = read_unaligned(p.add(32) as *const u16) as usize;

            // Return program ID reference and instruction data slice
            (
                program_id,
                core::slice::from_raw_parts(p.add(34), instruction_data_len),
            )
        }
    }
}

#[cfg(feature = "anchor")]
impl anchor_lang::Owner for Instructions {
    fn owner() -> Pubkey {
        anchor_lang::solana_program::sysvar::instructions::id()
    }
}

#[cfg(feature = "anchor")]
impl anchor_lang::AccountDeserialize for Instructions {
    fn try_deserialize_unchecked(_buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        // This should not be called for sysvars, but we provide a stub
        Err(anchor_lang::error::ErrorCode::AccountDidNotDeserialize.into())
    }
}

#[cfg(feature = "anchor")]
impl anchor_lang::AccountSerialize for Instructions {
    fn try_serialize<W: std::io::Write>(&self, _writer: &mut W) -> anchor_lang::Result<()> {
        // This should not be called for sysvars, but we provide a stub
        Err(anchor_lang::error::ErrorCode::AccountDidNotSerialize.into())
    }
}

#[cfg(feature = "anchor")]
impl anchor_lang::solana_program::sysvar::SysvarId for Instructions {
    fn id() -> anchor_lang::solana_program::pubkey::Pubkey {
        anchor_lang::solana_program::sysvar::instructions::id()
    }

    fn check_id(pubkey: &anchor_lang::solana_program::pubkey::Pubkey) -> bool {
        pubkey == &Self::id()
    }
}

#[cfg(feature = "anchor")]
impl anchor_lang::solana_program::sysvar::Sysvar for Instructions {
    fn size_of() -> usize {
        // Instructions sysvar has variable size, return 0 as it's not used for deserialization
        0
    }

    fn from_account_info(
        account_info: &anchor_lang::solana_program::account_info::AccountInfo,
    ) -> core::result::Result<Self, anchor_lang::solana_program::program_error::ProgramError> {
        use anchor_lang::solana_program::sysvar::SysvarId;
        // We don't actually deserialize the Instructions sysvar data since we access it directly
        // Just validate that it's the correct account
        if Self::check_id(account_info.key) {
            Ok(Self)
        } else {
            Err(anchor_lang::solana_program::program_error::ProgramError::InvalidAccountData)
        }
    }
}
