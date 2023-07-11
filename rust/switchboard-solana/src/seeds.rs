/// Seed used to derive the SbState PDA.
pub const STATE_SEED: &[u8] = b"STATE";

/// Seed used to derive the PermissionAccountData PDA.
pub const PERMISSION_SEED: &[u8] = b"PermissionAccountData";

/// Seed used to derive the LeaseAccountData PDA.
pub const LEASE_SEED: &[u8] = b"LeaseAccountData";

/// Seed used to derive the OracleAccountData PDA.
pub const ORACLE_SEED: &[u8] = b"OracleAccountData";

/// Seed used to derive the SlidingWindow PDA.
pub const SLIDING_RESULT_SEED: &[u8] = b"SlidingResultAccountData";

/// Discriminator used for Switchboard buffer accounts.
pub const BUFFER_DISCRIMINATOR: &[u8] = b"BUFFERxx";

/// Seed used to derive the FunctionAccountData PDA.
pub const FUNCTION_SEED: &[u8] = b"FunctionAccountData";
