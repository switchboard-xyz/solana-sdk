use crate::cfg_client;
use crate::prelude::*;
use bytemuck::try_cast_slice_mut;
use std::cell::Ref;

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct OracleQueueAccountData {
    /// Name of the queue to store on-chain.
    pub name: [u8; 32],
    /// Metadata of the queue to store on-chain.
    pub metadata: [u8; 64],
    /// The account delegated as the authority for making account changes or assigning permissions targeted at the queue.
    pub authority: Pubkey,
    /// Interval when stale oracles will be removed if they fail to heartbeat.
    pub oracle_timeout: u32,
    /// Rewards to provide oracles and round openers on this queue.
    pub reward: u64,
    /// The minimum amount of stake oracles must present to remain on the queue.
    pub min_stake: u64,
    /// Whether slashing is enabled on this queue.
    pub slashing_enabled: bool,
    /// The tolerated variance amount oracle results can have from the accepted round result before being slashed.
    /// slashBound = varianceToleranceMultiplier * stdDeviation Default: 2
    pub variance_tolerance_multiplier: SwitchboardDecimal,
    /// Number of update rounds new feeds are on probation for.
    /// If a feed returns 429s within probation period, auto disable permissions.
    pub feed_probation_period: u32,
    //
    /// Current index of the oracle rotation.
    pub curr_idx: u32,
    /// Current number of oracles on a queue.
    pub size: u32,
    /// Garbage collection index.
    pub gc_idx: u32,
    /// Consecutive failure limit for a feed before feed permission is revoked.
    pub consecutive_feed_failure_limit: u64,
    /// Consecutive failure limit for an oracle before oracle permission is revoked.
    pub consecutive_oracle_failure_limit: u64,
    /// Enabling this setting means data feeds do not need explicit permission to join the queue and request new values from its oracles.
    pub unpermissioned_feeds_enabled: bool,
    /// Enabling this setting means VRF accounts do not need explicit permission to join the queue and request new values from its oracles.
    pub unpermissioned_vrf_enabled: bool,
    /// TODO: Revenue percentage rewarded to job curators overall.
    pub curator_reward_cut: SwitchboardDecimal,
    /// Prevent new leases from being funded n this queue.
    /// Useful to turn down a queue for migrations, since authority is always immutable.
    pub lock_lease_funding: bool,
    /// Token mint used for the oracle queue rewards and slashing.
    pub mint: Pubkey,
    /// Whether oracles are permitted to fulfill buffer relayer update request.
    pub enable_buffer_relayers: bool,
    /// Reserved for future info.
    pub _ebuf: [u8; 968],
    /// Maximum number of oracles a queue can support.
    pub max_size: u32,
    /// The public key of the OracleQueueBuffer account holding a collection of Oracle pubkeys that haver successfully heartbeated before the queues `oracleTimeout`.
    pub data_buffer: Pubkey,
}

impl Default for OracleQueueAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

impl OracleQueueAccountData {
    pub fn size() -> usize {
        std::mem::size_of::<OracleQueueAccountData>() + 8
    }

    pub fn convert_buffer(buf: &mut [u8]) -> &mut [Pubkey] {
        try_cast_slice_mut(&mut buf[8..]).unwrap()
    }

    pub fn len(&self) -> u32 {
        self.size
    }

    pub fn is_empty(&self) -> bool {
        self.size == 0
    }

    pub fn get_mint(&self) -> Pubkey {
        if self.mint == Pubkey::default() {
            return anchor_spl::token::spl_token::ID;
        }
        self.mint
    }

    pub fn max_round_rewards(&self, batch_size: u32) -> u64 {
        self.reward
            .checked_mul(batch_size.checked_add(1).unwrap().into())
            .unwrap()
    }

    /// Returns the deserialized Switchboard OracleQueue account
    ///
    /// # Arguments
    ///
    /// * `account_info` - A Solana AccountInfo referencing an existing Switchboard OracleQueue
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::OracleQueueAccountData;
    ///
    /// let oracle_queue = OracleQueueAccountData::new(queue_account_info)?;
    /// ```
    pub fn new<'info>(
        account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, Self>> {
        let data = account_info.try_borrow_data()?;
        if data.len() < OracleQueueAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != OracleQueueAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<OracleQueueAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard OracleQueue account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::OracleQueueAccountData;
    ///
    /// let oracle_queue = OracleQueueAccountData::new(oracle_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&OracleQueueAccountData> {
        if data.len() < OracleQueueAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != OracleQueueAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<OracleQueueAccountData>() + 8],
        ))
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
