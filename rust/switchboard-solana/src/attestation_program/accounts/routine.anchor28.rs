use crate::prelude::*;
use crate::*;
use solana_program::borsh0_10::get_instance_packed_len;

#[repr(u8)]
#[derive(
    Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize, InitSpace,
)]
pub enum RoutineStatus {
    #[default]
    None = 0, // 0
    Active,
    NonExecutable,
}
impl RoutineStatus {
    pub fn is_active(&self) -> bool {
        matches!(self, RoutineStatus::Active)
    }
}
impl From<RoutineStatus> for u8 {
    fn from(value: RoutineStatus) -> Self {
        match value {
            RoutineStatus::Active => 1,
            RoutineStatus::NonExecutable => 2,
            _ => 0,
        }
    }
}
impl From<u8> for RoutineStatus {
    fn from(value: u8) -> Self {
        match value {
            1 => RoutineStatus::Active,
            2 => RoutineStatus::NonExecutable,
            _ => RoutineStatus::default(),
        }
    }
}

// #[account]
#[derive(AnchorDeserialize, AnchorSerialize, Debug, Clone, PartialEq)]
pub struct FunctionRoutineAccountData {
    // Metadata (8)
    /// The name of the function routine for easier identification.
    pub name: [u8; 64],
    /// The metadata of the function routine for easier identification.
    pub metadata: [u8; 256],
    /// The unix timestamp when the function routine was created.
    pub created_at: i64,
    /// The unix timestamp when the function routine config was changed.
    pub updated_at: i64,

    // Disabled Config
    /// Flag to disable the function and prevent new verification requests.
    pub is_disabled: ResourceLevel,
    /// The type of resource that disabled the routine.
    // pub disabler: ResourceLevel,

    // Status
    pub status: RoutineStatus,
    /// The last reported error code if the most recent response was a failure
    pub error_status: u8,
    /// The enclave generated signer for this routine.
    pub enclave_signer: Pubkey,
    /// The verifier oracle who signed this verification.
    pub verifier: Pubkey,

    // Fees
    /// The SOL bounty in lamports used to incentivize a verifier to expedite the request. 0 = no bounty. Receiver = verifier oracle.
    pub bounty: u64,

    // Accounts
    /// Signer allowed to manage the routine.
    pub authority: Pubkey,
    /// The default destination for rent exemption when the account is closed.
    pub payer: Pubkey,
    /// The function that manages the mr_enclave set for this routine.
    pub function: Pubkey,
    /// The Attestation Queue for this request.
    pub attestation_queue: Pubkey,

    /// The tokenAccount escrow
    // The SwitchboardWallet that manages the escrow. A single SwitchboardWallet can support many routines.
    pub escrow_wallet: Pubkey,
    /// The TokenAccount with funds for the escrow.
    pub escrow_token_wallet: Pubkey,

    // Execution Config
    /// The index of the verifier on the queue that is assigned to process the next invocation.
    /// This is incremented after each invocation in a round-robin fashion.
    pub queue_idx: u32,
    /// The cron schedule to run the function on.
    pub schedule: [u8; 64],
    // Container Params
    /// The maximum number of bytes to pass to the container params.
    pub max_container_params_len: u32,
    /// Hash of the serialized container_params to prevent RPC tampering.
    /// Should be verified within your function to ensure you are using the correct parameters.
    pub container_params_hash: [u8; 32],
    /// The stringified container params to pass to the function.
    pub container_params: Vec<u8>,

    // Status / Tracking
    /// The unix timestamp when the function was last run.
    pub last_execution_timestamp: i64,
    /// The unix timestamp when the function was last run successfully.
    pub last_successful_execution_timestamp: i64,
    /// The unix timestamp when the function is allowed to run next.
    pub next_allowed_timestamp: i64,

    /// Reserved.
    pub _ebuf: [u8; 512],
}
impl Default for FunctionRoutineAccountData {
    fn default() -> Self {
        Self {
            // Metadata
            name: [0u8; 64],
            metadata: [0u8; 256],
            created_at: 0,
            updated_at: 0,

            // Disabled
            is_disabled: ResourceLevel::None,

            // Status
            status: RoutineStatus::None,
            error_status: 0,
            enclave_signer: Pubkey::default(),
            verifier: Pubkey::default(),

            // Fees
            bounty: 0,

            // Accounts
            authority: Pubkey::default(),
            payer: Pubkey::default(),
            function: Pubkey::default(),
            attestation_queue: Pubkey::default(),

            escrow_wallet: Pubkey::default(),
            escrow_token_wallet: Pubkey::default(),

            // Execution
            queue_idx: 0,
            schedule: [0u8; 64],
            max_container_params_len: 0,
            container_params_hash: [0u8; 32],
            container_params: vec![],

            // Status / Tracking
            last_execution_timestamp: 0,
            last_successful_execution_timestamp: 0,
            next_allowed_timestamp: 0,

            // Reserved
            _ebuf: [0u8; 512],
        }
    }
}

impl anchor_lang::AccountSerialize for FunctionRoutineAccountData {
    fn try_serialize<W: std::io::Write>(&self, writer: &mut W) -> anchor_lang::Result<()> {
        if writer
            .write_all(&FunctionRoutineAccountData::discriminator())
            .is_err()
        {
            return Err(anchor_lang::error::ErrorCode::AccountDidNotSerialize.into());
        }
        if AnchorSerialize::serialize(self, writer).is_err() {
            return Err(anchor_lang::error::ErrorCode::AccountDidNotSerialize.into());
        }
        Ok(())
    }
}

impl anchor_lang::AccountDeserialize for FunctionRoutineAccountData {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < FunctionRoutineAccountData::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if FunctionRoutineAccountData::discriminator() != given_disc {
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
                .with_account_name("FunctionRoutineAccountData"),
            );
        }
        Self::try_deserialize_unchecked(buf)
    }
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let mut data: &[u8] = &buf[8..];
        AnchorDeserialize::deserialize(&mut data)
            .map_err(|_| anchor_lang::error::ErrorCode::AccountDidNotDeserialize.into())
    }
}

impl Discriminator for FunctionRoutineAccountData {
    const DISCRIMINATOR: [u8; 8] = [93, 99, 13, 119, 129, 127, 168, 18];
}

impl Owner for FunctionRoutineAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl FunctionRoutineAccountData {
    /// Returns the amount of memory space required for a FunctionRoutine account.
    ///
    /// # Arguments
    ///
    /// * `len` - An optional `u32` value representing the length of the container parameters vector.
    ///
    /// # Returns
    ///
    /// * `usize` - The total amount of memory space required for a FunctionRoutine account.
    pub fn space(len: Option<u32>) -> usize {
        // size of struct if vec is empty
        let base: usize = get_instance_packed_len(&FunctionRoutineAccountData::default()).unwrap();
        msg!("FunctionRoutine base usize: {:?}", base);
        // let base: usize = 1216;

        // the number of bytes needed for the container params
        let vec_elements: usize = len.unwrap_or(DEFAULT_MAX_CONTAINER_PARAMS_LEN) as usize;

        // total bytes
        8 + base + vec_elements
    }

    /// Asserts that the length of the account data matches the expected length.
    ///
    /// # Arguments
    ///
    /// * `account_info` - The account info to check the data length of.
    /// * `len` - The expected length of the account data.
    ///
    /// # Errors
    ///
    /// Returns an error if the length of the account data does not match the expected length.
    pub fn assert_data_len(account_info: &AccountInfo<'_>, len: Option<u32>) -> bool {
        let data_len = account_info.data_len();
        // msg!("data_len: {:?}", data_len);
        let expected_data_len = Self::space(len);
        // msg!("expected_data_len: {:?}", expected_data_len);

        data_len == expected_data_len

        // if data_len != expected_data_len {
        //     return Err(error!(SwitchboardError::IllegalExecuteAttempt));
        // }

        // Ok(())
    }

    /// Checks if the schedule is empty by reading the first byte.
    ///
    /// # Returns
    ///
    /// A boolean indicating whether the schedule is empty or not.
    pub fn is_empty_schedule(&self) -> bool {
        self.schedule
            .first()
            .map(|&byte| byte == 0)
            .unwrap_or(false)
    }

    /// Returns a bool representing whether the routine is disabled for use.
    pub fn is_disabled(&self) -> bool {
        self.is_disabled.into()
    }

    /// Validates the given `signer` account against the `function_loader` and the enclave_signer
    /// stored in this `FunctionRoutineAccountData`.
    ///
    /// # Arguments
    ///
    /// * `function_loader` - The `AccountLoader` of the function account to validate.
    /// * `enclave_signer` - The `AccountInfo` of the enclave signer to validate.
    ///
    /// # Errors
    ///
    /// Returns an error if:
    /// * the function cannot be deserialized
    /// * the routine is not assigned to the function
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
    ///             &switchboard_function,
    ///             &enclave_signer.to_account_info()
    ///         )?
    ///     )]
    ///     pub switchboard_routine: Box<Account<'info, FunctionRoutineAccountData>>,
    ///     pub enclave_signer: Signer<'info>,
    /// }
    /// ```
    pub fn validate_signer<'a>(
        &self,
        function_loader: &AccountLoader<'a, FunctionAccountData>,
        enclave_signer: &AccountInfo<'a>,
    ) -> anchor_lang::Result<bool> {
        if self.function != function_loader.key() {
            msg!(
                "FunctionMismatch: expected {}, received {}",
                self.function,
                function_loader.key()
            );
            return Ok(false);
        }

        let func = function_loader.load()?; // check owner/discriminator

        func.validate_routine(self, enclave_signer)
    }

    pub fn get_name(&self) -> String {
        std::str::from_utf8(&self.name)
            .unwrap_or("")
            .trim()
            .to_string()
    }

    pub fn get_metadata(&self) -> String {
        std::str::from_utf8(&self.metadata)
            .unwrap_or("")
            .trim()
            .to_string()
    }
}
