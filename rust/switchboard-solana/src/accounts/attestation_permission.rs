use anchor_lang::prelude::*;
use anchor_lang::{Discriminator, Owner};
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct AttestationPermissionAccountData {
    pub authority: Pubkey,
    pub permissions: u32,
    pub granter: Pubkey,
    pub grantee: Pubkey,
    pub expiration: i64,
    pub bump: u8,
    pub _ebuf: [u8; 256],
}

impl Discriminator for AttestationPermissionAccountData {
    const DISCRIMINATOR: [u8; 8] = [63, 83, 122, 184, 22, 35, 31, 70];
}
impl Owner for AttestationPermissionAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}
unsafe impl Pod for AttestationPermissionAccountData {}
unsafe impl Zeroable for AttestationPermissionAccountData {}

impl AttestationPermissionAccountData {
    /// Returns the deserialized Switchboard AttestationPermission account
    ///
    /// # Arguments
    ///
    /// * `permission_account_info` - A Solana AccountInfo referencing an existing Switchboard AttestationPermissionAccount
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::AttestationPermissionAccountData;
    ///
    /// let permissions = AttestationPermissionAccountData::new(permission_account_info)?;
    /// ```
    pub fn new<'info>(
        permission_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, AttestationPermissionAccountData>> {
        let data = permission_account_info.try_borrow_data()?;
        if data.len() < AttestationPermissionAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != AttestationPermissionAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(
                &data[8..std::mem::size_of::<AttestationPermissionAccountData>() + 8],
            )
        }))
    }

    /// Returns the deserialized Switchboard AttestationPermission account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::AttestationPermissionAccountData;
    ///
    /// let permissions = AttestationPermissionAccountData::new(permission_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&AttestationPermissionAccountData> {
        if data.len() < AttestationPermissionAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != AttestationPermissionAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<AttestationPermissionAccountData>() + 8],
        ))
    }
}
