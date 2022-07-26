#[allow(unaligned_references)]
use super::decimal::SwitchboardDecimal;
use anchor_lang::prelude::*;

#[account(zero_copy)]
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

impl OracleQueueAccountData {}
