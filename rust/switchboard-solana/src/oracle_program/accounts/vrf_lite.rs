#![allow(non_snake_case)]
use crate::cfg_client;
use crate::prelude::*;
use std::cell::Ref;

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct VrfLiteAccountData {
    /// The bump used to derive the SbState account.
    pub state_bump: u8,
    /// The bump used to derive the permission account.
    pub permission_bump: u8,
    /// The VrfPool the account belongs to.
    pub vrf_pool: Pubkey,
    /// The current status of the VRF account.
    pub status: VrfStatus,
    /// The VRF round result. Will be zeroized if still awaiting fulfillment.
    pub result: [u8; 32],
    /// Incremental counter for tracking VRF rounds.
    pub counter: u128,
    /// The alpha bytes used to calculate the VRF proof.
    // TODO: can this be smaller?
    pub alpha: [u8; 256],
    /// The number of bytes in the alpha buffer.
    pub alpha_len: u32,
    /// The Slot when the VRF round was opened.
    pub request_slot: u64,
    /// The unix timestamp when the VRF round was opened.
    pub request_timestamp: i64,
    /// On-chain account delegated for making account changes.
    pub authority: Pubkey,
    /// The OracleQueueAccountData that is assigned to fulfill VRF update request.
    pub queue: Pubkey,
    /// The token account used to hold funds for VRF update request.
    pub escrow: Pubkey,
    /// The callback that is invoked when an update request is successfully verified.
    pub callback: CallbackZC,
    /// The incremental VRF proof calculation.
    pub builder: VrfBuilder,
    // unused currently. may want permission PDA per permission for
    // unique expiration periods, BUT currently only one permission
    // per account makes sense for the infra. Dont over engineer.
    // TODO: should this be epoch or slot ??
    pub expiration: i64,
    // TODO: Add _ebuf ??
}

impl Default for VrfLiteAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

impl VrfLiteAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<VrfLiteAccountData>()
    }

    /// Returns the deserialized Switchboard VRF Lite account
    ///
    /// # Arguments
    ///
    /// * `switchboard_vrf` - A Solana AccountInfo referencing an existing Switchboard VRF Lite account
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::VrfLiteAccountData;
    ///
    /// let vrf_lite = VrfLiteAccountData::new(vrf_account_info)?;
    /// ```
    pub fn new<'info>(
        vrf_lite_account_info: &'info AccountInfo,
    ) -> anchor_lang::Result<Ref<'info, VrfLiteAccountData>> {
        let data = vrf_lite_account_info.try_borrow_data()?;
        if data.len() < VrfLiteAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfLiteAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<VrfLiteAccountData>() + 8])
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
    /// use switchboard_solana::VrfLiteAccountData;
    ///
    /// let vrf_lite = VrfLiteAccountData::new(vrf_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&VrfLiteAccountData> {
        if data.len() < VrfLiteAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfLiteAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<VrfLiteAccountData>() + 8],
        ))
    }

    /// Returns the current VRF round ID
    pub fn get_current_randomness_round_id(&self) -> u128 {
        self.counter
    }

    /// If sufficient oracle responses, returns the latest on-chain result in SwitchboardDecimal format
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::VrfLiteAccountData;
    ///
    /// ```
    pub fn get_result(&self) -> anchor_lang::Result<[u8; 32]> {
        if self.result == [0u8; 32] {
            return Err(error!(SwitchboardError::VrfEmptyError));
        }
        Ok(self.result)
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
}
