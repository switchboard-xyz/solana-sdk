#![allow(non_snake_case)]
use super::error::SwitchboardError;
use crate::*;
use anchor_lang::Discriminator;
use std::cell::Ref;

// VrfRequestRandomness
// VrfSetCallback
// VrfClose

#[account(zero_copy)]
#[repr(packed)]
pub struct VrfAccountData {
    /// The current status of the VRF account.
    pub status: VrfStatus,
    /// Incremental counter for tracking VRF rounds.
    pub counter: u128,
    /// On-chain account delegated for making account changes.
    pub authority: Pubkey,
    /// The OracleQueueAccountData that is assigned to fulfill VRF update request.
    pub oracle_queue: Pubkey,
    /// The token account used to hold funds for VRF update request.
    pub escrow: Pubkey,
    /// The callback that is invoked when an update request is successfully verified.
    pub callback: CallbackZC,
    /// The number of oracles assigned to a VRF update request.
    pub batch_size: u32,
    /// Struct containing the intermediate state between VRF crank actions.
    pub builders: [VrfBuilder; 8],
    /// The number of builders.
    pub builders_len: u32,
    pub test_mode: bool,
    /// Oracle results from the current round of update request that has not been accepted as valid yet
    pub current_round: VrfRound,
    /// Reserved for future info.
    pub _ebuf: [u8; 1024],
}
impl Default for VrfAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

impl VrfAccountData {
    /// Returns the deserialized Switchboard VRF account
    ///
    /// # Arguments
    ///
    /// * `switchboard_vrf` - A Solana AccountInfo referencing an existing Switchboard VRF account
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfAccountData;
    ///
    /// let vrf = VrfAccountData::new(vrf_account_info)?;
    /// ```
    pub fn new<'info>(
        switchboard_vrf: &'info AccountInfo,
    ) -> anchor_lang::Result<Ref<'info, VrfAccountData>> {
        let data = switchboard_vrf.try_borrow_data()?;
        if data.len() < VrfAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<VrfAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard VRF account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfAccountData;
    ///
    /// let vrf = VrfAccountData::new(vrf_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&VrfAccountData> {
        if data.len() < VrfAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<VrfAccountData>() + 8],
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
    /// use switchboard_v2::VrfAccountData;
    ///
    /// ```
    pub fn get_result(&self) -> anchor_lang::Result<[u8; 32]> {
        if self.current_round.result == [0u8; 32] {
            return Err(error!(SwitchboardError::VrfEmptyError));
        }
        Ok(self.current_round.result)
    }
}
