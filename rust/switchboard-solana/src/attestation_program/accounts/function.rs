use crate::cfg_client;
use crate::prelude::*;
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
#[derive(PartialEq)]
pub struct FunctionAccountData {
    // Easy Filtering Config
    /// Whether the function is invoked on a schedule or by request
    pub is_scheduled: u8,
    /// Whether the function has been manually triggered with the function_trigger instruction
    pub is_triggered: u8,
    /// The function permissions granted by the attestation_queue.authority
    pub permissions: u32,
    pub status: FunctionStatus,

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

    // Attestation Config
    /// The enclave quote
    pub enclave: Quote,
    /// An array of permitted mr_enclave measurements for the function.
    pub mr_enclaves: [[u8; 32]; 32],

    // Container Settings
    /// The off-chain registry to fetch the function container from.
    pub container_registry: [u8; 64],
    /// The identifier of the container in the given container_registry.
    pub container: [u8; 64],
    /// The version tag of the container to pull.
    pub version: [u8; 32],
    /// The expected schema for the container params.
    pub params_schema: [u8; 256],
    /// The default params passed to the container during scheduled execution.
    pub default_container_params: [u8; 256],

    // Accounts Config
    /// The authority of the function which is authorized to make account changes.
    pub authority: Pubkey,
    /// The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements.
    pub attestation_queue: Pubkey,
    /// An incrementer used to rotate through an AttestationQueue's verifiers.
    pub queue_idx: u32,
    /// The address_lookup_table of the function used to increase the number of accounts we can fit into a function result.
    pub address_lookup_table: Pubkey,

    // Schedule Config
    /// The cron schedule to run the function on.
    pub schedule: [u8; 64],
    /// The unix timestamp when the function was last run.
    pub last_execution_timestamp: i64,
    /// The unix timestamp when the function is allowed to run next.
    pub next_allowed_timestamp: i64,
    /// The number of times to trigger the function upon the next invocation.
    pub trigger_count: u64,
    /// Time this function has been sitting in an explicitly triggered state
    pub triggered_since: i64,

    // Permission Settings
    /// UNUSED. The unix timestamp when the current permissions expire.
    pub permission_expiration: i64,

    // Requests Config
    /// Number of requests created for this function. Used to prevent closing when there are live requests.
    pub num_requests: u64,
    /// Whether custom requests have been disabled for this function.
    pub requests_disabled: bool,
    /// Whether new requests need to be authorized by the FunctionAccount authority before being initialized.
    /// Useful if you want to use CPIs to control request account creation.
    pub requests_require_authorization: bool,
    /// DEPRECATED.
    pub reserved1: [u8; 8],
    /// The lamports paid to the FunctionAccount escrow on each successful update request.
    pub requests_fee: u64,

    // Token Config
    /// The SwitchboardWallet that will handle pre-funding rewards paid out to function runners.
    pub escrow_wallet: Pubkey,
    /// The escrow_wallet TokenAccount that handles pre-funding rewards paid out to function runners.
    pub escrow_token_wallet: Pubkey,
    /// The SwitchboardWallet that will handle acruing rewards from requests.
    /// Defaults to the escrow_wallet.
    pub reward_escrow_wallet: Pubkey,
    /// The reward_escrow_wallet TokenAccount used to acrue rewards from requests made with custom parameters.
    pub reward_escrow_token_wallet: Pubkey,

    /// The last reported error code if the most recent response was a failure
    pub error_status: u8,

    /// Reserved.
    pub _ebuf: [u8; 1023],
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

    // /// Validate that the provided accounts correspond to the expected function accounts
    // ///
    // /// # Arguments
    // ///
    // /// * `function_account_info` - Solana AccountInfo for a FunctionAccountData
    // /// * `signer` - Solana AccountInfo for a signer
    // pub fn validate_signer2<'a>(
    //     function_account_info: &AccountInfo<'a>,
    //     signer: &AccountInfo<'a>,
    // ) -> bool {
    //     let function_loader_result =
    //         AccountLoader::<'_, FunctionAccountData>::try_from(&function_account_info.clone());
    //     if function_loader_result.is_err() {
    //         return false;
    //     }
    //     let func_loader = function_loader_result.unwrap();
    //     let func_result = func_loader.load();
    //     if func_result.is_err() {
    //         return false;
    //     }
    //     let func = func_result.unwrap();

    //     // TODO: validate the seeds and bump

    //     // validate the enclaves enclave is not empty
    //     if func.enclave.mr_enclave == [0u8; 32] {
    //         return false;
    //     }

    //     // validate the enclaves delegated signer matches
    //     if func.enclave.enclave_signer != signer.key() {
    //         return false;
    //     }

    //     // validate the function was verified and it is not expired
    //     if let Ok(clock) = Clock::get() {
    //         return func.enclave.is_verified(&clock);
    //     }
    //     if func.enclave.verification_status != VerificationStatus::VerificationSuccess as u8 {
    //         return false;
    //     }

    //     true
    // }

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
    /// * `function_account_info` - Solana AccountInfo for a FunctionAccountData
    /// * `signer` - Solana AccountInfo for a signer
    pub fn validate_signer<'a>(
        function_account_info: &AccountInfo<'a>,
        signer: &AccountInfo<'a>,
    ) -> anchor_lang::Result<bool> {
        // deserialize accounts and verify the owner

        let function_loader =
            AccountLoader::<'_, FunctionAccountData>::try_from(&function_account_info.clone())?;
        let func = function_loader.load()?;

        // TODO: validate the seeds and bump

        // validate the enclaves enclave is not empty
        if func.enclave.mr_enclave == [0u8; 32] {
            return Ok(false);
        }

        // validate the enclaves delegated signer matches
        if func.enclave.enclave_signer != signer.key() {
            return Ok(false);
        }

        // validate the function was verified and it is not expired
        Ok(func.enclave.is_verified(&Clock::get()?))
    }

    pub fn is_empty_schedule(&self) -> bool {
        if self.schedule == [0u8; 64] {
            return true;
        }
        let first_byte_null = self
            .schedule
            .first()
            .map(|&byte| byte == 0)
            .unwrap_or(false);
        if first_byte_null {
            return true;
        }

        false
    }

    pub fn get_container(&self) -> String {
        std::str::from_utf8(&self.container)
            .unwrap_or("")
            .to_string()
    }

    pub fn get_version(&self) -> String {
        std::str::from_utf8(&self.version)
            .unwrap_or("latest")
            .to_string()
    }

    pub fn get_name(&self) -> String {
        format!("{}:{}", self.get_container(), self.get_version())
    }

    cfg_client! {
        pub fn get_discriminator_filter() -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new_raw_bytes(
                0,
                FunctionAccountData::discriminator().to_vec(),
            ))
        }

        pub fn get_is_triggered_filter() -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new_raw_bytes(
                9,
                vec![1u8],
            ))
        }

        pub fn get_is_scheduled_filter() -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new_raw_bytes(
                8,
                vec![1u8],
            ))
        }

        pub fn get_is_active_filter() -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new_raw_bytes(
                14,
                vec![FunctionStatus::Active as u8],
            ))
        }

        pub fn get_queue_filter(queue_pubkey: &Pubkey) -> solana_client::rpc_filter::RpcFilterType {
            solana_client::rpc_filter::RpcFilterType::Memcmp(solana_client::rpc_filter::Memcmp::new_raw_bytes(
                2553,
                queue_pubkey.to_bytes().into(),
            ))
        }

        pub fn get_is_ready_filters(queue_pubkey: &Pubkey) -> Vec<solana_client::rpc_filter::RpcFilterType> {
            vec![
                FunctionAccountData::get_discriminator_filter(),
                FunctionAccountData::get_is_triggered_filter(),
                FunctionAccountData::get_is_scheduled_filter(),
                FunctionAccountData::get_is_active_filter(),
                FunctionAccountData::get_queue_filter(queue_pubkey),
            ]
        }

        pub fn get_schedule(&self) -> Option<cron::Schedule> {
            if self.schedule[0] == 0 {
                return None;
            }
            let every_second = cron::Schedule::try_from("* * * * * *").unwrap();
            let schedule = std::str::from_utf8(&self.schedule)
                .unwrap_or("* * * * * *")
                .trim_end_matches('\0');
            let schedule = cron::Schedule::try_from(schedule);
            Some(schedule.unwrap_or(every_second))
        }

        pub fn get_last_execution_datetime(&self) -> chrono::DateTime<chrono::Utc> {
            chrono::DateTime::from_utc(
                chrono::NaiveDateTime::from_timestamp_opt(self.last_execution_timestamp, 0).unwrap(),
                chrono::Utc,
            )
        }

        pub fn get_next_execution_datetime(&self) -> Option<chrono::DateTime<chrono::Utc>> {
            let schedule = self.get_schedule()?;
            schedule.after(&self.get_last_execution_datetime()).next()
        }

        pub fn should_execute(&self, now: chrono::DateTime<chrono::Utc>) -> bool {
            if self.is_triggered > 0 {
                return true;
            }
            let schedule = self.get_schedule();
            if schedule.is_none() {
                return false;
            }
            let dt = self.get_last_execution_datetime();
            let next_trigger_time = schedule.unwrap().after(&dt).next();
            if next_trigger_time.is_none() {
                return false;
            }
            let next_trigger_time = next_trigger_time.unwrap();
            if next_trigger_time > now {
                return false;
            }
            true
        }

        pub fn is_scheduled(&self) -> bool {
            self.schedule[0] == 0
        }

        pub async fn fetch(
            client: &solana_client::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::Error> {
            crate::client::load_account(client, pubkey).await
        }

        // pub async fn get_program_accounts(
        //     client: &solana_client::rpc_client::RpcClient
        // ) -> std::result::Result<Vec<FunctionAccountData>, switchboard_common::Error> {
        //     let accounts = client.get_program_accounts(&SWITCHBOARD_ATTESTATION_PROGRAM_ID)?;
        // }
    }
}
