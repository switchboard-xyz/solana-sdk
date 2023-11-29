use crate::prelude::*;
use crate::*;
use bytemuck::{Pod, Zeroable};
use std::cell::Ref;

#[repr(u8)]
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum FunctionStatus {
    #[default]
    None = 0,
    Active = 1 << 0,
    NonExecutable = 1 << 1,
    Expired = 1 << 2,
    OutOfFunds = 1 << 3,
    InvalidPermissions = 1 << 4,
}
impl From<FunctionStatus> for u8 {
    fn from(value: FunctionStatus) -> Self {
        match value {
            FunctionStatus::Active => 1 << 0,
            FunctionStatus::NonExecutable => 1 << 1,
            FunctionStatus::Expired => 1 << 2,
            FunctionStatus::OutOfFunds => 1 << 3,
            FunctionStatus::InvalidPermissions => 1 << 4,
            _ => 0,
        }
    }
}
impl From<u8> for FunctionStatus {
    fn from(value: u8) -> Self {
        match value {
            1 => FunctionStatus::Active,
            2 => FunctionStatus::NonExecutable,
            4 => FunctionStatus::Expired,
            8 => FunctionStatus::OutOfFunds,
            16 => FunctionStatus::InvalidPermissions,
            _ => FunctionStatus::default(),
        }
    }
}
#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(PartialEq, Debug)]
pub struct FunctionAccountData {
    // Easy Filtering Config
    /// Whether the function is invoked on a schedule or by request
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub is_scheduled: u8,
    /// Whether the function has been manually triggered with the function_trigger instruction
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub is_triggered: u8,

    /// The function permissions granted by the attestation_queue.authority
    pub permissions: u32,
    pub status: FunctionStatus,

    // 15

    // Metadata
    /// PDA bump.
    pub bump: u8,
    /// The payer who originally created the function. Cannot change, used to derive PDA.
    pub creator_seed: [u8; 32],
    /// The name of the function for easier identification.
    pub name: [u8; 64],
    /// The metadata of the function for easier identification.
    pub metadata: [u8; 256],
    /// The Solana slot when the function was created. (PDA)
    pub created_at_slot: u64,
    /// The unix timestamp when the function was created.
    pub created_at: i64,
    /// The unix timestamp when the function config (container, registry, version, or schedule) was changed.
    pub updated_at: i64,

    // 392

    // Attestation Config
    /// The enclave quote
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub enclave: Quote,
    /// An array of permitted mr_enclave measurements for the function.
    pub mr_enclaves: [[u8; 32]; 32],

    // 1849

    // Container Settings
    /// The off-chain registry to fetch the function container from.
    pub container_registry: [u8; 64],
    /// The identifier of the container in the given container_registry.
    pub container: [u8; 64],
    /// The version tag of the container to pull.
    pub version: [u8; 32],
    /// The expected schema for the container params.
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub params_schema: [u8; 256],
    /// The default params passed to the container during scheduled execution.
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub default_container_params: [u8; 256],

    // 2521

    // Accounts Config
    /// The authority of the function which is authorized to make account changes.
    pub authority: Pubkey,
    /// The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements.
    pub attestation_queue: Pubkey,
    /// An incrementer used to rotate through an AttestationQueue's verifiers.
    pub queue_idx: u32,
    /// The address_lookup_table of the function used to increase the number of accounts we can fit into a function result.
    pub address_lookup_table: Pubkey,

    // 2621

    // Schedule Config
    /// The cron schedule to run the function on.
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub schedule: [u8; 64],
    /// The unix timestamp when the function was last run.
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub last_execution_timestamp: i64,
    /// The unix timestamp when the function is allowed to run next.
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub next_allowed_timestamp: i64,
    /// The number of times to trigger the function upon the next invocation.
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRequestAccountData` for all on-demand executions"
    )]
    pub trigger_count: u64,
    /// Time this function has been sitting in an explicitly triggered state
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRequestAccountData` for all on-demand executions"
    )]
    pub triggered_since: i64,

    // Permission Settings
    /// UNUSED. The unix timestamp when the current permissions expire.
    pub permission_expiration: i64,

    // Requests Config
    /// Number of requests created for this function. Used to prevent closing when there are live requests.
    pub num_requests: u64,
    /// Whether custom requests have been disabled for this function.
    pub requests_disabled: u8,
    /// Whether new requests need to be authorized by the FunctionAccount authority before being initialized.
    /// Useful if you want to use CPIs to control request account creation.
    pub requests_require_authorization: u8,
    /// DEPRECATED.
    pub reserved1: [u8; 8],
    /// The dev fee that is paid out from the request's escrow to the function's escrow on each successful invocation.
    /// This is used to reward the function maintainer for providing the function.
    /// 0 = No Fee. Sender = requests's escrow_token_wallet. Receiver = function's reward_token_wallet.
    pub requests_fee: u64,

    // Token Config
    /// The SwitchboardWallet that will handle pre-funding rewards paid out to function verifiers.
    pub escrow_wallet: Pubkey,
    /// The escrow_wallet TokenAccount that handles pre-funding rewards paid out to function runners.
    pub escrow_token_wallet: Pubkey,
    /// The SwitchboardWallet that will handle acruing rewards from requests.
    /// Defaults to the escrow_wallet.
    pub reward_escrow_wallet: Pubkey,
    /// The reward_escrow_wallet TokenAccount used to acrue rewards from requests made with custom parameters.
    pub reward_escrow_token_wallet: Pubkey,

    /// The last reported error code if the most recent response was a failure
    #[deprecated(
        since = "0.28.35",
        note = "please use the error_status field on your function consumer (request or routine)"
    )]
    pub error_status: u8,

    // Routines Config
    /// Number of routines created for this function. Used to prevent closing when there are live routines.
    pub num_routines: u64,
    /// Whether custom routines have been disabled for this function.
    pub routines_disabled: BoolWithLock,
    /// Whether new routines need to be authorized by the FunctionAccount authority before being initialized.
    /// Useful if you want to provide AccessControl and only allow certain parties to run routines.
    pub routines_require_authorization: u8,
    /// The fee that is paid out from the routine's escrow to the function's escrow on each successful invocation.
    /// This is used to reward the function maintainer for providing the function.
    /// 0 = No Fee. Sender = routine's escrow_token_wallet. Receiver = function's reward_token_wallet.
    pub routines_dev_fee: u64,

    /// The functions MRENCLAVE measurement dictating the contents of the secure enclave.
    // This represents the last successful execution of a function.
    pub mr_enclave: [u8; 32],
    /// The VerificationStatus of the quote.
    pub verification_status: u8,
    /// The unix timestamp when the quote was last verified.
    pub verification_timestamp: i64,
    /// The unix timestamp when the quotes verification status expires.
    pub valid_until: i64,

    /// Reserved.
    pub _ebuf: [u8; 956],
}

impl Default for FunctionAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

impl anchor_lang::AccountDeserialize for FunctionAccountData {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < FunctionAccountData::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if FunctionAccountData::discriminator() != given_disc {
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
                .with_account_name("FunctionAccountData"),
            );
        }
        Self::try_deserialize_unchecked(buf)
    }

    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let data: &[u8] = &buf[8..];
        bytemuck::try_from_bytes(data)
            .map(|r: &Self| *r)
            .map_err(|_| anchor_lang::error::ErrorCode::AccountDidNotDeserialize.into())
    }
}

unsafe impl Pod for FunctionAccountData {}
unsafe impl Zeroable for FunctionAccountData {}

impl Discriminator for FunctionAccountData {
    const DISCRIMINATOR: [u8; 8] = [76, 139, 47, 44, 240, 182, 148, 200];
}

impl Owner for FunctionAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl ZeroCopy for FunctionAccountData {}

impl FunctionAccountData {
    pub fn size() -> usize {
        8 + std::mem::size_of::<FunctionAccountData>()
    }

    /// Returns the deserialized Switchboard Function account
    ///
    /// # Arguments
    ///
    /// * `function_account_info` - A Solana AccountInfo referencing an existing Switchboard FunctionAccount
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::FunctionAccountData;
    ///
    /// let function_account = FunctionAccountData::new(function_account_info)?;
    /// ```
    pub fn new<'info>(
        function_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Ref<'info, FunctionAccountData>> {
        let data = function_account_info.try_borrow_data()?;
        if data.len() < FunctionAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != FunctionAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<FunctionAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard Function account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::FunctionAccountData;
    ///
    /// let function_account = FunctionAccountData::new(function_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&FunctionAccountData> {
        if data.len() < FunctionAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != FunctionAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<FunctionAccountData>() + 8],
        ))
    }

    /// Validate that the provided accounts correspond to the expected function accounts
    ///
    /// # Arguments
    ///
    /// * `signer` - Solana AccountInfo for a signer
    pub fn validate(&self, signer: &AccountInfo) -> anchor_lang::Result<bool> {
        // TODO: validate the seeds and bump

        // validate the enclaves enclave is not empty
        if self.enclave.mr_enclave == [0u8; 32] {
            return Ok(false);
        }

        // validate the enclaves delegated signer matches
        if self.enclave.enclave_signer != signer.key() {
            return Ok(false);
        }

        // validate the function was verified and it is not expired
        Ok(self.enclave.is_verified(&Clock::get()?))
    }

    /// Validate that the provided accounts correspond to the expected function accounts
    ///
    /// # Arguments
    ///
    /// * `signer` - Solana AccountInfo for a signer\
    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub fn validate_signer<'a>(&self, signer: &AccountInfo<'a>) -> anchor_lang::Result<bool> {
        // deserialize accounts and verify the owner

        // TODO: validate the seeds and bump

        // validate the enclaves enclave is not empty
        if self.enclave.mr_enclave == [0u8; 32] {
            return Ok(false);
        }

        // validate the enclaves delegated signer matches
        if self.enclave.enclave_signer != signer.key() {
            return Ok(false);
        }

        // validate the function was verified and it is not expired
        Ok(self.enclave.is_verified(&Clock::get()?))
    }

    /// Validates that the provided request is assigned to the same `AttestationQueueAccountData` as the function and the
    /// provided `enclave_signer` matches the `enclave_signer` stored in the request's `active_request` field.
    ///
    /// # Arguments
    ///
    /// * `request` - The `FunctionRequestAccountData` being validated.
    /// * `enclave_signer` - The `AccountInfo` of the enclave signer to validate.
    ///
    /// # Errors
    ///
    /// Returns an error if:
    /// * the function and request have different attestation queues
    /// * the request's verified signer does not match the provided `enclave_signer`
    /// * the `enclave_signer` did not sign the transaction
    ///
    /// # Returns
    ///
    /// Returns `Ok(true)` if the validation succeeds, `Ok(false)` otherwise.
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::FunctionRequestAccountData;
    ///
    /// #[derive(Accounts)]
    /// pub struct Settle<'info> {
    ///     // YOUR PROGRAM ACCOUNTS
    ///     #[account(
    ///         mut,
    ///         has_one = switchboard_request,
    ///     )]
    ///     pub user: AccountLoader<'info, UserState>,
    ///
    ///     // SWITCHBOARD ACCOUNTS
    ///     #[account(
    ///         constraint = function.load()?.validate_request(
    ///             &request,
    ///             &enclave_signer.to_account_info()
    ///         )?
    ///     )]
    ///     pub function: AccountLoader<'info, FunctionAccountData>,
    ///     #[account(
    ///         has_one = function,
    ///     )]
    ///     pub request: Box<Account<'info, FunctionRequestAccountData>>,
    ///     pub enclave_signer: Signer<'info>,
    /// }
    /// ```
    pub fn validate_request(
        &self,
        request: &FunctionRequestAccountData,
        enclave_signer: &AccountInfo,
    ) -> anchor_lang::Result<bool> {
        if request.attestation_queue != self.attestation_queue {
            msg!(
                "AttestationQueueMismatch: fn: {}, request: {}",
                self.attestation_queue,
                request.attestation_queue
            );
            return Ok(false);
        }

        if request.active_request.enclave_signer != enclave_signer.key() {
            msg!(
                "SignerMismatch: expected {}, received {}",
                request.active_request.enclave_signer,
                enclave_signer.key()
            );
            return Ok(false);
        }

        // Verify the enclave signer signed the transaction
        if enclave_signer.signer_key().is_none() {
            msg!(
                "enclave_signer ({}) did not sign the transaction",
                enclave_signer.key()
            );
            return Ok(false);
        }

        Ok(true)
    }

    /// Validates that the provided routine is assigned to the same `AttestationQueueAccountData` as the function and the
    /// provided `enclave_signer` matches the `enclave_signer` stored in the routine's `enclave_signer` field.
    ///
    /// # Arguments
    ///
    /// * `routine` - The `FunctionRoutineAccountData` being validated.
    /// * `enclave_signer` - The `AccountInfo` of the enclave signer to validate.
    ///
    /// # Errors
    ///
    /// Returns an error if:
    /// * the function and routine have different attestation queues
    /// * the routine's verified signer does not match the provided `enclave_signer`
    /// * the `enclave_signer` did not sign the transaction
    ///
    /// # Returns
    ///
    /// Returns `Ok(true)` if the validation succeeds, `Ok(false)` otherwise.
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::FunctionRoutineAccountData;
    ///
    /// #[derive(Accounts)]
    /// pub struct Settle<'info> {
    ///     // YOUR PROGRAM ACCOUNTS
    ///     #[account(
    ///         mut,
    ///         has_one = switchboard_routine,
    ///     )]
    ///     pub user: AccountLoader<'info, UserState>,
    ///
    ///     // SWITCHBOARD ACCOUNTS
    ///     pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    ///     #[account(
    ///         constraint = switchboard_routine.validate_signer(
    ///             &switchboard_function.to_account_info(),
    ///             &enclave_signer.to_account_info()
    ///         )?
    ///     )]
    ///     pub switchboard_routine: Box<Account<'info, FunctionRoutineAccountData>>,
    ///     pub enclave_signer: Signer<'info>,
    /// }
    /// ```
    pub fn validate_routine(
        &self,
        routine: &FunctionRoutineAccountData,
        enclave_signer: &AccountInfo,
    ) -> anchor_lang::Result<bool> {
        if routine.attestation_queue != self.attestation_queue {
            msg!(
                "AttestationQueueMismatch: fn: {}, routine: {}",
                self.attestation_queue,
                routine.attestation_queue
            );
            return Ok(false);
        }

        // validate the enclaves delegated signer matches
        if routine.enclave_signer != enclave_signer.key() {
            msg!(
                "EnclaveSignerMismatch: expected {}, received {}",
                routine.enclave_signer,
                enclave_signer.key()
            );
            return Ok(false);
        }

        // Verify the enclave signer signed the transaction
        if enclave_signer.signer_key().is_none() {
            msg!(
                "enclave_signer ({}) did not sign the transaction",
                enclave_signer.key()
            );
            return Ok(false);
        }

        Ok(true)
    }

    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub fn is_empty_schedule(&self) -> bool {
        self.schedule
            .first()
            .map(|&byte| byte == 0)
            .unwrap_or(false)
    }

    pub fn get_container(&self) -> String {
        std::str::from_utf8(&self.container)
            .unwrap_or("")
            .trim()
            .to_string()
    }

    pub fn get_container_registry(&self) -> String {
        std::str::from_utf8(&self.container_registry)
            .unwrap_or("")
            .trim()
            .to_string()
    }

    pub fn get_version(&self) -> String {
        let version = std::str::from_utf8(&self.version)
            .unwrap_or("latest")
            .trim()
            .to_string();

        if version.is_empty() {
            String::from("latest")
        } else {
            version
        }
    }

    pub fn get_name(&self) -> String {
        format!("{}:{}", self.get_container(), self.get_version()).replace('\u{0}', "")
    }

    pub fn get_function_name(&self) -> String {
        std::str::from_utf8(&self.name)
            .unwrap_or("")
            .trim()
            .to_string()
    }

    /// Asserts that the permissions are valid for the given queue's access control level.
    ///
    /// # Arguments
    ///
    /// * `queue_require_usage_permissions` - A boolean indicating whether queue usage permissions are required.
    ///
    /// # Errors
    ///
    /// Returns an error if the queue usage permissions are required but not present.
    pub fn assert_permissions(
        &self,
        queue_require_usage_permissions: bool,
    ) -> anchor_lang::Result<()> {
        if queue_require_usage_permissions
            && self.permissions != SwitchboardAttestationPermission::PermitQueueUsage as u32
        {
            return Err(error!(SwitchboardError::PermissionDenied));
        }

        Ok(())
    }

    /// Asserts that the given `mr_enclave` is valid by checking it against the enclave set.
    /// If the `mr_enclave` is invalid, returns an `InvalidMrEnclave` error.
    pub fn assert_mr_enclave(&self, mr_enclave: &[u8; 32]) -> anchor_lang::Result<()> {
        if !self.is_valid_enclave(mr_enclave) {
            return Err(error!(SwitchboardError::InvalidMrEnclave));
        }

        Ok(())
    }

    /// Checks if the given `mr_enclave` is valid by verifying if it exists in the list of valid
    /// `mr_enclaves` stored in the current instance of `FunctionImpl`.
    ///
    /// # Arguments
    ///
    /// * `mr_enclave` - A reference to a 32-byte array representing the `mr_enclave` value of the
    ///                  enclave to be validated.
    ///
    /// # Returns
    ///
    /// A boolean value indicating whether the given `mr_enclave` is valid or not.
    pub fn is_valid_enclave(&self, mr_enclave: &[u8; 32]) -> bool {
        if *mr_enclave == [0u8; 32] {
            return false;
        }

        self.mr_enclaves.contains(mr_enclave)
    }

    /// Parses the enclave measurements and returns a vector of 32-byte arrays representing the non-empty mr_enclaves.
    ///
    /// # Example
    ///
    /// ```
    /// use crate::FunctionAccountData;
    ///
    /// let function = FunctionAccountData::default();
    /// let parsed_enclaves = function.parse_enclaves();
    /// assert_eq(0, parsed_enclaves.len());
    /// ```
    pub fn parse_enclaves(&self) -> Vec<[u8; 32]> {
        let mut parsed_enclaves: Vec<[u8; 32]> = vec![];
        for mr_enclave in self.mr_enclaves.iter() {
            if *mr_enclave != [0u8; 32] {
                parsed_enclaves.push(*mr_enclave)
            }
        }
        parsed_enclaves
    }

    /// Asserts that the current instance has enclaves.
    ///
    /// # Errors
    ///
    /// Returns an error of type `SwitchboardError::MrEnclavesEmpty` if the enclaves are empty.
    pub fn assert_has_enclaves(&self) -> anchor_lang::Result<()> {
        if self.parse_enclaves().is_empty() {
            return Err(error!(SwitchboardError::MrEnclavesEmpty));
        }

        Ok(())
    }

    /// Asserts that requests are enabled for the given function.
    ///
    /// # Errors
    ///
    /// Returns an error of type `SwitchboardError::UserRequestsDisabled` if the function has requests_disabled configured.
    fn assert_requests_enabled(&self) -> anchor_lang::Result<()> {
        if self.requests_disabled.to_bool() {
            return Err(error!(SwitchboardError::UserRequestsDisabled));
        }

        Ok(())
    }

    /// Asserts that routines are enabled for the given function.
    ///
    /// # Errors
    ///
    /// Returns an error of type `SwitchboardError::FunctionRoutinesDisabled` if the function has routines_disabled configured.
    fn assert_routines_enabled(&self) -> anchor_lang::Result<()> {
        if self.routines_disabled.is_disabled() {
            return Err(error!(SwitchboardError::FunctionRoutinesDisabled));
        }

        Ok(())
    }

    /// Checks if the function is ready to execute routines.
    ///
    /// # Errors
    ///
    /// Returns an error if:
    ///
    /// - Routines are disabled.
    /// - The function has 0 valid mr_enclaves.
    /// - The function status is not `Active`.
    ///
    /// # Returns
    ///
    /// Returns `Ok(())` if the function is ready to execute routines.
    pub fn ready_for_routines(&self) -> anchor_lang::Result<()> {
        self.assert_routines_enabled()?;
        self.assert_has_enclaves()?;

        if self.status != FunctionStatus::Active {
            return Err(error!(SwitchboardError::FunctionNotReady));
        }

        Ok(())
    }

    /// Checks if the function is ready to execute requests.
    ///
    /// # Errors
    ///
    /// Returns an error if:
    ///
    /// - Requests are disabled.
    /// - The function has 0 valid mr_enclaves.
    /// - The function status is not `Active`.
    ///
    /// # Returns
    ///
    /// Returns `Ok(())` if the function is ready to execute requests.
    pub fn ready_for_requests(&self) -> anchor_lang::Result<()> {
        self.assert_requests_enabled()?;
        self.assert_has_enclaves()?;

        if self.status != FunctionStatus::Active && self.status != FunctionStatus::OutOfFunds {
            return Err(error!(SwitchboardError::FunctionNotReady));
        }

        Ok(())
    }

    /// Returns the public key of the reward token wallet. If the reward escrow token wallet is set,
    /// it returns the reward escrow token wallet. Otherwise, it returns the escrow token wallet.
    pub fn get_reward_token_wallet(&self) -> Pubkey {
        if self.reward_escrow_token_wallet != Pubkey::default() {
            self.reward_escrow_token_wallet
        } else {
            self.escrow_token_wallet
        }
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    use std::str::FromStr;

    const FUNCTION_DATA: [u8; 3903] = [
        76, 139, 47, 44, 240, 182, 148, 200, 1, 0, 0, 0, 0, 0, 1, 254, 218, 146, 221, 148, 1, 120,
        215, 193, 125, 114, 207, 207, 22, 231, 179, 145, 88, 164, 177, 30, 89, 129, 230, 41, 12,
        196, 209, 106, 74, 219, 84, 225, 83, 111, 108, 97, 110, 97, 32, 84, 97, 115, 107, 32, 82,
        117, 110, 110, 101, 114, 32, 70, 117, 110, 99, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 18, 218, 14, 0, 0, 0, 0, 227, 58, 32,
        101, 0, 0, 0, 0, 236, 84, 32, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35,
        225, 147, 52, 198, 184, 237, 187, 106, 131, 221, 177, 176, 80, 145, 117, 118, 50, 205, 62,
        19, 161, 35, 83, 210, 209, 6, 138, 101, 21, 112, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 111, 99, 107, 101, 114,
        104, 117, 98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115,
        119, 105, 116, 99, 104, 98, 111, 97, 114, 100, 108, 97, 98, 115, 47, 115, 111, 108, 97,
        110, 97, 45, 116, 97, 115, 107, 45, 114, 117, 110, 110, 101, 114, 45, 102, 117, 110, 99,
        116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 97,
        116, 101, 115, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 218, 146, 221, 148, 1, 120, 215, 193, 125, 114, 207, 207, 22, 231, 179, 145,
        88, 164, 177, 30, 89, 129, 230, 41, 12, 196, 209, 106, 74, 219, 84, 225, 174, 177, 70, 231,
        73, 196, 214, 194, 190, 219, 159, 24, 162, 119, 159, 16, 120, 53, 239, 102, 225, 241, 66,
        97, 108, 144, 152, 47, 53, 76, 242, 215, 0, 0, 0, 0, 70, 65, 33, 246, 149, 218, 240, 26,
        241, 158, 100, 187, 243, 161, 203, 30, 151, 239, 214, 115, 213, 239, 24, 92, 137, 228, 4,
        197, 143, 13, 48, 131, 42, 32, 42, 47, 53, 32, 42, 32, 42, 32, 42, 32, 42, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 118, 120, 45, 101, 0, 0, 0, 0, 149, 120,
        45, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 249,
        132, 49, 100, 114, 123, 49, 150, 198, 234, 193, 130, 176, 237, 177, 72, 2, 22, 174, 106,
        202, 197, 89, 28, 119, 35, 166, 73, 57, 38, 23, 116, 180, 233, 161, 252, 164, 99, 206, 179,
        104, 122, 218, 86, 162, 24, 43, 248, 82, 63, 111, 64, 70, 179, 213, 70, 253, 4, 4, 203, 25,
        32, 254, 160, 249, 132, 49, 100, 114, 123, 49, 150, 198, 234, 193, 130, 176, 237, 177, 72,
        2, 22, 174, 106, 202, 197, 89, 28, 119, 35, 166, 73, 57, 38, 23, 116, 180, 233, 161, 252,
        164, 99, 206, 179, 104, 122, 218, 86, 162, 24, 43, 248, 82, 63, 111, 64, 70, 179, 213, 70,
        253, 4, 4, 203, 25, 32, 254, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    const FUNCTION_DATA_HEX: &str = "4c8b2f2cf0b694c801000000000001feda92dd940178d7c17d72cfcf16e7b39158a4b11e5981e6290cc4d16a4adb54e1536f6c616e61205461736b2052756e6e65722046756e6374696f6e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c712da0e00000000e33a206500000000ec542065000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000023e19334c6b8edbb6a83ddb1b05091757632cd3e13a12353d2d1068a6515707d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000646f636b657268756200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000737769746368626f6172646c6162732f736f6c616e612d7461736b2d72756e6e65722d66756e6374696f6e0000000000000000000000000000000000000000006c617465737400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000da92dd940178d7c17d72cfcf16e7b39158a4b11e5981e6290cc4d16a4adb54e1aeb146e749c4d6c2bedb9f18a2779f107835ef66e1f142616c90982f354cf2d700000000464121f695daf01af19e64bbf3a1cb1e97efd673d5ef185c89e404c58f0d30832a202a2f35202a202a202a202a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000076782d650000000095782d65000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0f9843164727b3196c6eac182b0edb1480216ae6acac5591c7723a64939261774b4e9a1fca463ceb3687ada56a2182bf8523f6f4046b3d546fd0404cb1920fea0f9843164727b3196c6eac182b0edb1480216ae6acac5591c7723a64939261774b4e9a1fca463ceb3687ada56a2182bf8523f6f4046b3d546fd0404cb1920feff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

    #[test]
    fn test_function_deserialization() {
        let function =
            FunctionAccountData::try_deserialize_unchecked(&mut FUNCTION_DATA.as_slice()).unwrap();

        assert_eq!(
            std::str::from_utf8(&function.container)
                .unwrap()
                .to_string()
                .trim_matches(char::from(0)),
            "switchboardlabs/solana-task-runner-function"
        );

        assert_eq!(
            std::str::from_utf8(&function.container_registry)
                .unwrap()
                .to_string()
                .trim_matches(char::from(0)),
            "dockerhub"
        );

        assert_eq!(
            std::str::from_utf8(&function.version)
                .unwrap()
                .to_string()
                .trim_matches(char::from(0)),
            "latest"
        );

        assert_eq!(
            function.attestation_queue,
            Pubkey::from_str("CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE").unwrap()
        );

        assert_eq!(
            function.authority,
            Pubkey::from_str("FiDmUK83DTc1ijEyVnwMoQwJ6W4gC2S8JhncKsheDQTJ").unwrap()
        );
    }

    #[test]
    fn test_hex_decode() {
        let account_bytes = hex::decode(FUNCTION_DATA_HEX).unwrap();
        let function = FunctionAccountData::try_deserialize(&mut account_bytes.as_slice()).unwrap();

        assert_eq!(
            std::str::from_utf8(&function.container)
                .unwrap()
                .to_string()
                .trim_matches(char::from(0)),
            "switchboardlabs/solana-task-runner-function"
        );

        assert_eq!(
            std::str::from_utf8(&function.container_registry)
                .unwrap()
                .to_string()
                .trim_matches(char::from(0)),
            "dockerhub"
        );

        assert_eq!(
            std::str::from_utf8(&function.version)
                .unwrap()
                .to_string()
                .trim_matches(char::from(0)),
            "latest"
        );

        assert_eq!(
            function.attestation_queue,
            Pubkey::from_str("CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE").unwrap()
        );

        assert_eq!(
            function.authority,
            Pubkey::from_str("FiDmUK83DTc1ijEyVnwMoQwJ6W4gC2S8JhncKsheDQTJ").unwrap()
        );
    }
}
