use crate::cfg_client;
use crate::prelude::*;
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[derive(Copy, Clone, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum SwitchboardAttestationPermission {
    PermitNodeheartbeat = 1 << 0,
    PermitQueueUsage = 1 << 1,
}

#[zero_copy]
#[repr(packed)]
#[derive(Debug)]
pub struct AttestationPermissionAccountData {
    pub authority: Pubkey,
    pub permissions: u32,
    pub granter: Pubkey,
    pub grantee: Pubkey,
    pub expiration: i64,
    pub bump: u8,
    pub _ebuf: [u8; 256],
}

unsafe impl Pod for AttestationPermissionAccountData {}
unsafe impl Zeroable for AttestationPermissionAccountData {}

impl Discriminator for AttestationPermissionAccountData {
    const DISCRIMINATOR: [u8; 8] = [63, 83, 122, 184, 22, 35, 31, 70];
}

impl Owner for AttestationPermissionAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl ZeroCopy for AttestationPermissionAccountData {}

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
    /// use switchboard_solana::AttestationPermissionAccountData;
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
    /// use switchboard_solana::AttestationPermissionAccountData;
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

    pub fn has(&self, p: SwitchboardAttestationPermission) -> bool {
        self.permissions & p as u32 != 0
    }

    cfg_client! {
        pub async fn fetch(
            client: &solana_client::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::Error> {
            crate::client::load_account(client, pubkey).await
        }
    }

    pub fn get_pda(authority: &Pubkey, attestation_queue: &Pubkey, grantee: &Pubkey) -> Pubkey {
        let (permission_pubkey, _) = Pubkey::find_program_address(
            &[
                PERMISSION_SEED,
                &authority.to_bytes(),
                &attestation_queue.to_bytes(),
                &grantee.to_bytes(),
            ],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );
        permission_pubkey
    }

    pub fn verify_pda(
        expected: &Pubkey,
        authority: &Pubkey,
        attestation_queue: &Pubkey,
        grantee: &Pubkey,
    ) -> Result<()> {
        let key = Self::get_pda(authority, attestation_queue, grantee);
        if key != *expected {
            return Err(error!(SwitchboardError::PdaDerivationError));
        }
        Ok(())
    }
}
