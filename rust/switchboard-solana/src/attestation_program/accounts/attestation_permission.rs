use crate::cfg_client;
use crate::*;

use crate::prelude::*;

use bytemuck::{Pod, Zeroable};

use std::cell::Ref;

use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum SwitchboardAttestationPermission {
    #[default]
    None = 0,
    PermitNodeheartbeat = 1 << 0,
    PermitQueueUsage = 1 << 1,
}
impl From<SwitchboardAttestationPermission> for u32 {
    fn from(value: SwitchboardAttestationPermission) -> Self {
        match value {
            SwitchboardAttestationPermission::PermitNodeheartbeat => 1 << 0,
            SwitchboardAttestationPermission::PermitQueueUsage => 1 << 1,
            _ => 0,
        }
    }
}
impl From<u32> for SwitchboardAttestationPermission {
    fn from(value: u32) -> Self {
        match value {
            1 => SwitchboardAttestationPermission::PermitNodeheartbeat,
            2 => SwitchboardAttestationPermission::PermitQueueUsage,
            _ => SwitchboardAttestationPermission::default(),
        }
    }
}

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(Debug, AnchorDeserialize)]
pub struct AttestationPermissionAccountData {
    pub authority: Pubkey,
    pub permissions: u32,
    pub granter: Pubkey,
    pub grantee: Pubkey,
    pub expiration: i64,
    pub bump: u8,
    pub _ebuf: [u8; 256],
}

impl anchor_lang::AccountDeserialize for AttestationPermissionAccountData {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < AttestationPermissionAccountData::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if AttestationPermissionAccountData::discriminator() != given_disc {
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
                .with_account_name("AttestationPermissionAccountData"),
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
    pub fn size() -> usize {
        8 + std::mem::size_of::<AttestationPermissionAccountData>()
    }

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
        pub fn fetch(
            client: &solana_client::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::SbError> {
            crate::client::fetch_zerocopy_account(client, pubkey)
        }

        pub async fn fetch_async(
            client: &solana_client::nonblocking::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::SbError> {
            crate::client::fetch_zerocopy_account_async(client, pubkey).await
        }

        pub fn fetch_sync<T: solana_sdk::client::SyncClient>(
            client: &T,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::SbError> {
            crate::client::fetch_zerocopy_account_sync(client, pubkey)
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
    ) -> anchor_lang::Result<()> {
        let key = Self::get_pda(authority, attestation_queue, grantee);
        if key != *expected {
            return Err(error!(SwitchboardError::PdaDerivationError));
        }
        Ok(())
    }
}
