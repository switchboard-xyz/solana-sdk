use crate::prelude::*;

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize, Eq, PartialEq)]
pub enum SwitchboardPermission {
    /// queue authority has permitted an Oracle Account to heartbeat on it's queue and receive update requests. Oracles always need permissions to join a queue.
    PermitOracleHeartbeat = 1 << 0,
    /// queue authority has permitted an Aggregator Account to request updates from it's oracles or join an existing crank. Note: Not required if a queue has unpermissionedFeedsEnabled.
    PermitOracleQueueUsage = 1 << 1, // TODO: rename
    /// queue authority has permitted a VRF Account to request randomness from it's oracles. Note: Not required if a queue has unpermissionedVrfEnabled.
    PermitVrfRequests = 1 << 2,
}

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct PermissionAccountData {
    /// The authority that is allowed to set permissions for this account.
    pub authority: Pubkey,
    /// The SwitchboardPermission enumeration assigned by the granter to the grantee.
    pub permissions: u32,
    /// Public key of account that is granting permissions to use its resources.
    pub granter: Pubkey,
    /// Public key of account that is being assigned permissions to use a granters resources.
    pub grantee: Pubkey,
    /// unused currently. may want permission PDA per permission for
    /// unique expiration periods, BUT currently only one permission
    /// per account makes sense for the infra. Dont over engineer.
    pub expiration: i64,
    /// The PDA bump to derive the pubkey.
    pub bump: u8,
    /// Reserved for future info.
    pub _ebuf: [u8; 255],
}

impl PermissionAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<PermissionAccountData>()
    }
}
