use super::error::SwitchboardError;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, Default, Debug)]
pub struct BufferRelayerAccountData {
    pub name: [u8; 32],
    pub queue_pubkey: Pubkey,
    pub escrow: Pubkey,
    pub authority: Pubkey,
    pub job_pubkey: Pubkey,
    pub job_hash: [u8; 32],
    pub min_update_delay_seconds: u32,
    pub is_locked: bool,
    pub current_round: BufferRelayerRound,
    pub latest_confirmed_round: BufferRelayerRound,
    pub result: Vec<u8>,
}

#[derive(Default, Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct BufferRelayerRound {
    pub num_success: u32,
    pub num_error: u32,
    pub round_open_slot: u64,
    pub round_open_timestamp: i64,
    pub oracle_pubkey: Pubkey,
}

impl BufferRelayerAccountData {
    /// Returns the deserialized Switchboard Buffer Relayer account
    ///
    /// # Arguments
    ///
    /// * `switchboard_buffer` - A Solana AccountInfo referencing an existing Switchboard BufferRelayer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::BufferRelayerAccountData;
    ///
    /// let buffer_account = BufferRelayerAccountData::new(buffer_account_info)?;
    /// ```
    pub fn new<'a>(
        switchboard_buffer: &'a AccountInfo,
    ) -> anchor_lang::Result<Box<BufferRelayerAccountData>> {
        let data = switchboard_buffer.try_borrow_data()?;

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != BufferRelayerAccountData::discriminator() {
            return Err(SwitchboardError::AccountDiscriminatorMismatch.into());
        }

        let mut v_mut = &data[8..];
        Ok(Box::new(BufferRelayerAccountData::deserialize(&mut v_mut)?))
    }

    pub fn get_result(&self) -> &Vec<u8> {
        return &self.result;
    }

    /// Check whether the buffer relayer has been updated in the last max_staleness seconds
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::BufferRelayerAccountData;
    ///
    /// let buffer = BufferRelayerAccountData::new(buffer_account_info)?;
    /// buffer.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)?;
    /// ```
    pub fn check_staleness(
        &self,
        unix_timestamp: i64,
        max_staleness: i64,
    ) -> anchor_lang::Result<()> {
        let staleness = unix_timestamp - self.latest_confirmed_round.round_open_timestamp;
        if staleness > max_staleness {
            msg!("Feed has not been updated in {} seconds!", staleness);
            return Err(SwitchboardError::StaleFeed.into());
        }
        Ok(())
    }

    fn discriminator() -> [u8; 8] {
        return [50, 35, 51, 115, 169, 219, 158, 52];
    }
}
