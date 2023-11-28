use crate::prelude::*;

pub type MrEnclave = [u8; 32];

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(Debug, PartialEq)]
pub struct Quote {
    /// The address of the signer generated within an enclave.
    pub enclave_signer: Pubkey,
    /// The quotes MRENCLAVE measurement dictating the contents of the secure enclave.
    pub mr_enclave: [u8; 32],
    /// The VerificationStatus of the quote.
    pub verification_status: u8,
    /// The unix timestamp when the quote was last verified.
    pub verification_timestamp: i64,
    /// The unix timestamp when the quotes verification status expires.
    pub valid_until: i64,
    /// The off-chain registry where the verifiers quote can be located.
    pub quote_registry: [u8; 32],
    /// Key to lookup the buffer data on IPFS or an alternative decentralized storage solution.
    pub registry_key: [u8; 64],
    /// Reserved.
    pub _ebuf: [u8; 256],
}
impl Default for Quote {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
impl Quote {
    pub fn reset_verification(&mut self) -> anchor_lang::Result<()> {
        if self.verification_status != VerificationStatus::VerificationOverride as u8 {
            self.verification_status = VerificationStatus::None.into();
        }
        self.enclave_signer = Pubkey::default();
        self.verification_timestamp = 0;
        self.valid_until = 0;

        Ok(())
    }

    pub fn is_verified(&self, clock: &Clock) -> bool {
        match self.verification_status.into() {
            VerificationStatus::VerificationOverride => true,
            VerificationStatus::VerificationSuccess => self.valid_until > clock.unix_timestamp,
            _ => false,
        }
    }
}

pub trait ToU8 {
    fn to_u8(&self) -> u8;
}
impl ToU8 for bool {
    fn to_u8(&self) -> u8 {
        if *self {
            1
        } else {
            0
        }
    }
}
impl ToU8 for &bool {
    fn to_u8(&self) -> u8 {
        if **self {
            1
        } else {
            0
        }
    }
}
pub trait ToBool {
    fn to_bool(&self) -> bool;
}

impl ToBool for u8 {
    fn to_bool(&self) -> bool {
        !matches!(*self, 0)
    }
}
impl ToBool for &u8 {
    fn to_bool(&self) -> bool {
        !matches!(**self, 0)
    }
}
/// An enum representing a boolean flag which can be locked.
/// Byte #0: 0 = Disabled, 1 = Enabled
/// Byte #1: 0 = Unlocked, 1 = Locked
#[repr(u8)]
#[derive(
    Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize, InitSpace,
)]
pub enum BoolWithLock {
    #[default]
    Disabled, // 0 : 00000000
    Enabled,        // 1 : 00000001 : 1 << 0
    DisabledLocked, // 2 : 00000010 : 1 << 1
    EnabledLocked,  // 3 : 00000011
}
impl BoolWithLock {
    pub fn is_enabled(&self) -> bool {
        let byte: u8 = (*self).into();
        byte & (1 << 0) != 0
    }

    pub fn is_disabled(&self) -> bool {
        !self.is_enabled()
    }

    pub fn is_locked(&self) -> bool {
        let byte: u8 = (*self).into();
        byte & (1 << 1) != 0
    }

    /// Converts boolean flags into a bitfield enum value.
    ///
    /// # Arguments
    ///
    /// * `is_enabled` - A boolean flag indicating if the feature is enabled.
    /// * `is_locked` - A boolean flag indicating if the feature is locked.
    ///
    /// # Returns
    ///
    /// A bitfield enum value representing the input flags.
    fn from_flags(is_enabled: bool, is_locked: Option<bool>) -> Self {
        let mut value: u8 = 0;

        if is_enabled {
            value |= 1 << 0; // Set the 0th bit if enabled
        }

        if is_locked.unwrap_or_default() {
            value |= 1 << 1; // Set the 1st bit if locked
        }

        value.into()
    }

    /// Asserts that the configuration parameter is unlocked.
    pub fn assert_unlocked(&self) -> anchor_lang::Result<()> {
        if self.is_locked() {
            return Err(error!(SwitchboardError::ConfigParameterLocked));
        }

        Ok(())
    }

    /// Updates the value of the enum with a new value.
    ///
    /// # Arguments
    ///
    /// * `new_value` - A reference to a `BoolWithLock` struct containing the new value.
    ///
    /// # Errors
    ///
    /// Returns an error if the enum is locked and an update attempt is made.
    ///
    /// # Returns
    ///
    /// Returns `Ok(())` if the update is successful.
    pub fn update(&mut self, is_enabled: bool, is_locked: Option<bool>) -> anchor_lang::Result<()> {
        self.assert_unlocked()?;

        let new_value = Self::from_flags(is_enabled, is_locked);

        *self = new_value;

        Ok(())
    }

    /// Locks the enum value for further updates. No action taken if the enum is already locked.
    pub fn lock(&mut self) -> anchor_lang::Result<()> {
        if self.is_locked() {
            return Ok(());
        }

        let mut val: u8 = (*self).into();
        val |= 1 << 1;

        *self = val.into();

        Ok(())
    }
}
impl From<BoolWithLock> for u8 {
    fn from(value: BoolWithLock) -> Self {
        match value {
            BoolWithLock::Disabled => 0,
            BoolWithLock::Enabled => 1,
            BoolWithLock::DisabledLocked => 2,
            BoolWithLock::EnabledLocked => 3,
        }
    }
}
impl From<u8> for BoolWithLock {
    fn from(value: u8) -> Self {
        match value {
            1 => BoolWithLock::Enabled,
            2 => BoolWithLock::DisabledLocked,
            3 => BoolWithLock::EnabledLocked,
            _ => BoolWithLock::default(),
        }
    }
}

/// An enum representing a heirarchy of resources that can modify a field.
#[repr(u8)]
#[derive(
    Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize, InitSpace,
)]
pub enum ResourceLevel {
    #[default]
    None = 0, // 0
    /// The resource's authority has set this value.
    Authority,
    /// The resource function's authority has set this value.
    Function,
    /// The resource queue's authority has set this value.
    Queue,
}
impl PartialOrd for ResourceLevel {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}
impl Ord for ResourceLevel {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        (*self as u8).cmp(&(*other as u8))
    }
}
impl From<ResourceLevel> for u8 {
    fn from(value: ResourceLevel) -> Self {
        match value {
            ResourceLevel::Authority => 1,
            ResourceLevel::Function => 2,
            ResourceLevel::Queue => 3,
            _ => 0,
        }
    }
}
impl From<u8> for ResourceLevel {
    fn from(value: u8) -> Self {
        match value {
            1 => ResourceLevel::Authority,
            2 => ResourceLevel::Function,
            3 => ResourceLevel::Queue,
            _ => ResourceLevel::default(),
        }
    }
}
impl From<ResourceLevel> for bool {
    fn from(value: ResourceLevel) -> Self {
        !matches!(value, ResourceLevel::None)
    }
}
impl ResourceLevel {
    pub fn update(
        &mut self,
        access_level: &ResourceLevel,
        reset: Option<bool>,
    ) -> anchor_lang::Result<()> {
        let target_value = if reset.unwrap_or_default() {
            ResourceLevel::None
        } else {
            *access_level
        };

        // No action needed
        if self == &target_value {
            return Ok(());
        }

        // If insufficient access to change the value
        if self > &mut access_level.clone() {
            msg!(
                "ResourceLevel: curr ({:?}), target ({:?}), access_level ({:?})",
                self,
                target_value,
                access_level
            );
            return Err(error!(SwitchboardError::IllegalExecuteAttempt));
        }

        *self = target_value;

        Ok(())
    }
}
