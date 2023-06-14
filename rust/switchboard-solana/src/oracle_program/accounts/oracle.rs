use crate::prelude::*;
use crate::*;
use anchor_lang::Discriminator;
use std::cell::Ref;

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize)]
pub enum OracleResponseType {
    TypeSuccess,
    TypeError,
    TypeDisagreement,
    TypeNoResponse,
}

#[zero_copy]
#[derive(Default)]
#[repr(packed)]
pub struct OracleMetrics {
    /// Number of consecutive successful update request.
    pub consecutive_success: u64,
    /// Number of consecutive update request that resulted in an error.
    pub consecutive_error: u64,
    /// Number of consecutive update request that resulted in a disagreement with the accepted median result.
    pub consecutive_disagreement: u64,
    /// Number of consecutive update request that were posted on-chain late and not included in an accepted result.
    pub consecutive_late_response: u64,
    /// Number of consecutive update request that resulted in a failure.
    pub consecutive_failure: u64,
    /// Total number of successful update request.
    pub total_success: u128,
    /// Total number of update request that resulted in an error.
    pub total_error: u128,
    /// Total number of update request that resulted in a disagreement with the accepted median result.
    pub total_disagreement: u128,
    /// Total number of update request that were posted on-chain late and not included in an accepted result.
    pub total_late_response: u128,
}

#[account(zero_copy)]
#[repr(packed)]
pub struct OracleAccountData {
    /// Name of the oracle to store on-chain.
    pub name: [u8; 32],
    /// Metadata of the oracle to store on-chain.
    pub metadata: [u8; 128],
    /// The account delegated as the authority for making account changes or withdrawing funds from a staking wallet.
    pub oracle_authority: Pubkey,
    /// Unix timestamp when the oracle last heartbeated
    pub last_heartbeat: i64,
    /// Flag dictating if an oracle is active and has heartbeated before the queue's oracle timeout parameter.
    pub num_in_use: u32,
    // Must be unique per oracle account and authority should be a pda
    /// Stake account and reward/slashing wallet.
    pub token_account: Pubkey,
    /// Public key of the oracle queue who has granted it permission to use its resources.
    pub queue_pubkey: Pubkey,
    /// Oracle track record.
    pub metrics: OracleMetrics,
    /// The PDA bump to derive the pubkey.
    pub bump: u8,
    /// Reserved for future info.
    pub _ebuf: [u8; 255],
}

impl OracleAccountData {
    /// Returns the deserialized Switchboard Oracle account
    ///
    /// # Arguments
    ///
    /// * `account_info` - A Solana AccountInfo referencing an existing Switchboard Oracle
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::OracleAccountData;
    ///
    /// let oracle = OracleAccountData::new(oracle_account_info)?;
    /// ```
    pub fn new<'info>(
        account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, Self>> {
        let data = account_info.try_borrow_data()?;
        if data.len() < OracleAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != OracleAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<OracleAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard Oracle account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::OracleAccountData;
    ///
    /// let oracle = OracleAccountData::new(oracle_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&OracleAccountData> {
        if data.len() < OracleAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != OracleAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<OracleAccountData>() + 8],
        ))
    }

    #[cfg(feature = "client")]
    #[cfg_attr(doc_cfg, doc(cfg(feature = "client")))]
    pub async fn fetch(
        client: &solana_client::rpc_client::RpcClient,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::Error> {
        crate::client::load_account(client, pubkey).await
    }
}
