#![allow(non_snake_case)]
use crate::*;
use anchor_lang::Discriminator;
use std::cell::Ref;

// VrfPoolRequestRandomness
// VrfPoolRemove
// TODO: VrfPoolAdd (Can be done off-chain)

#[derive(Default, Debug, Copy, Clone, AnchorDeserialize, AnchorSerialize)]
pub struct VrfPoolRow {
    pub timestamp: i64,
    pub pubkey: Pubkey,
}

#[repr(packed)]
#[account(zero_copy)]
pub struct VrfPoolAccountData {
    /// ACCOUNTS
    pub authority: Pubkey, // authority can never be changed or else vrf accounts are useless
    pub queue: Pubkey,
    pub escrow: Pubkey, // escrow used to fund requests to reduce management

    // CONFIG
    pub min_interval: u32,
    pub max_rows: u32,

    // ITER
    pub size: u32,
    pub idx: u32,
    // Needs to be 4byte aligned up until here
    pub state_bump: u8,
    pub _ebuf: [u8; 135], // 256 bytes for pool config
}
//

impl VrfPoolAccountData {
    /// Returns the deserialized Switchboard VRF Lite account
    ///
    /// # Arguments
    ///
    /// * `switchboard_vrf` - A Solana AccountInfo referencing an existing Switchboard VRF Lite account
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::VrfPoolAccountData;
    ///
    /// let vrf = VrfPoolAccountData::new(vrf_pool_account_info)?;
    /// ```
    pub fn new<'info>(
        vrf_pool_account_info: &'info AccountInfo,
    ) -> anchor_lang::Result<Ref<'info, VrfPoolAccountData>> {
        let data = vrf_pool_account_info.try_borrow_data()?;
        if data.len() < VrfPoolAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfPoolAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<VrfPoolAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard VRF Lite account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::VrfPoolAccountData;
    ///
    /// let vrf = VrfPoolAccountData::new(vrf_pool_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&VrfPoolAccountData> {
        if data.len() < VrfPoolAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfPoolAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<VrfPoolAccountData>() + 8],
        ))
    }
}

// impl Discriminator for VrfPoolAccountData {
//     const DISCRIMINATOR: [u8; 8] = [86, 67, 58, 9, 46, 21, 101, 248];
// }
// impl Owner for VrfPoolAccountData {
//     fn owner() -> solana_program::pubkey::Pubkey {
//         SWITCHBOARD_PROGRAM_ID
//     }
// }

impl Default for VrfPoolAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
