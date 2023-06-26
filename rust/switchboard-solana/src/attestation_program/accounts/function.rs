use super::EnclaveAccountData;
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
#[derive(Debug, PartialEq)]
pub struct FunctionAccountData {
    /// Whether the function is invoked on a schedule or by request
    pub is_scheduled: u8, // keep this up-front for filtering
    /// Whether the function has been manually triggered with the function_trigger instruction
    pub is_triggered: u8, // keep this up-front for filtering
    /// The function permissions granted by the attestation_queue.authority
    pub permissions: u32, // keep this up-front for filtering
    pub status: FunctionStatus, // keep this up-front for filtering

    // Metadata
    /// The name of the function for easier identification.
    pub name: [u8; 64],
    /// The metadata of the function for easier identification.
    pub metadata: [u8; 256],
    /// The unix timestamp when the function was created.
    pub created_at: i64,
    /// The unix timestamp when the function config (container, registry, version, or schedule) was changed.
    pub updated_at: i64,

    // Container Settings
    /// The off-chain registry to fetch the function container from.
    pub container_registry: [u8; 64],
    /// The identifier of the container in the given container_registry.
    pub container: [u8; 64],
    /// The version tag of the container to pull.
    pub version: [u8; 32],

    // Accounts
    /// The authority of the function which is authorized to make account changes.
    pub authority: Pubkey,
    /// The wrapped SOL escrow of the function to pay for scheduled requests.
    pub escrow: Pubkey,
    /// The address_lookup_table of the function used to increase the number of accounts we can fit into a function result.
    pub address_lookup_table: Pubkey,
    /// The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements.
    pub attestation_queue: Pubkey,
    /// An incrementer used to rotate through an AttestationQueue's verifiers.
    pub queue_idx: u32,

    // Schedule
    /// The cron schedule to run the function on.
    pub schedule: [u8; 64],
    /// The unix timestamp when the function was last run.
    pub last_execution_timestamp: i64,
    /// The unix timestamp when the function is allowed to run next.
    pub next_allowed_timestamp: i64,
    /// The number of times to trigger the function upon the next invocation.
    pub trigger_count: u64,
    // pub schedule_container_params: Vec<u8>,

    // Permission Settings
    /// UNUSED. The unix timestamp when the current permissions expire.
    pub permission_expiration: i64,

    // Request Settings
    /// Number of requests created for this function. Used to prevent closing when there are live requests.
    pub num_requests: u64,
    /// Whether custom requests have been disabled for this function.
    pub requests_disabled: bool,
    /// Whether new requests need to be authorized by the FunctionAccount authority before being initialized.
    /// Useful if you want to use CPIs to control request account creation.
    pub requests_require_authorization: bool,
    /// The number of slots after a request has been verified before allowing a non-authority account to close the account.
    /// Useful if you want to submit multiple txns in your custom function and need the account to be kept alive for multiple slots.
    pub requests_default_slots_until_expiration: u64,
    /// The lamports paid to the FunctionAccount escrow on each successful update request.
    pub requests_fee: u64,

    /// An array of permitted mr_enclave measurements for the function.
    pub mr_enclaves: [[u8; 32]; 32],
    /// Reserved.
    pub _ebuf: [u8; 1024],
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

    pub fn get_quote_pda(fn_key: &Pubkey) -> Pubkey {
        let (pda_key, _) = Pubkey::find_program_address(
            &[QUOTE_SEED, &fn_key.to_bytes()],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );
        pda_key
    }

    pub fn get_escrow_key(fn_key: &Pubkey) -> Pubkey {
        let (ata_key, _) = Pubkey::find_program_address(
            &[
                &fn_key.to_bytes(),
                &anchor_spl::token::ID.to_bytes(),
                &anchor_spl::token::spl_token::native_mint::ID.to_bytes(),
            ],
            &anchor_spl::associated_token::AssociatedToken::id(),
        );
        ata_key
    }

    /// Validate that the provided accounts correspond to the expected function accounts
    ///
    /// # Arguments
    ///
    /// * `function_account_info` - Solana AccountInfo for a FunctionAccountData
    /// * `quote_account_info` - Solana AccountInfo for a EnclaveAccountData
    /// * `signer` - Solana AccountInfo for a signer
    pub fn validate_quote<'a>(
        function_account_info: &'a AccountInfo<'a>,
        quote_account_info: &'a AccountInfo<'a>,
        signer: &AccountInfo<'a>,
    ) -> anchor_lang::Result<bool> {
        // deserialize accounts and verify the owner
        FunctionAccountData::new(function_account_info)?;
        let quote = EnclaveAccountData::new(quote_account_info)?;

        // validate function PDA matches the expected derivation
        let expected_quote_key = EnclaveAccountData::get_pda_pubkey(&function_account_info.key())?;
        if quote_account_info.key() != expected_quote_key {
            return Ok(false);
        }

        // validate the quotes delegated signer matches
        if quote.enclave_signer != signer.key() {
            return Ok(false);
        }

        Ok(true)
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

    pub fn is_valid_enclave(&self, mr_enclave: &[u8; 32]) -> bool {
        if *mr_enclave == [0u8; 32] {
            return false;
        }

        self.mr_enclaves.contains(mr_enclave)
    }

    cfg_client! {
        pub fn get_schedule(&self) -> Option<cron::Schedule> {
            if self.schedule[0] == 0 {
                return None;
            }
            let every_second = cron::Schedule::try_from("* * * * * *").unwrap();
            let schedule = std::str::from_utf8(&self.schedule)
                .unwrap_or("* * * * * *")
                .trim_end_matches('\0');
            let schedule = cron::Schedule::try_from(schedule);
            Some(schedule.unwrap_or(every_second.clone()))
        }

        pub fn get_last_execution_datetime(&self) -> chrono::DateTime<chrono::Utc> {
            chrono::DateTime::from_utc(
                chrono::NaiveDateTime::from_timestamp_opt(self.last_execution_timestamp, 0).unwrap(),
                chrono::Utc,
            )
        }

        pub fn get_next_execution_datetime(&self) -> chrono::DateTime<chrono::Utc> {
            chrono::DateTime::from_utc(
                chrono::NaiveDateTime::from_timestamp_opt(self.next_allowed_timestamp, 0).unwrap(),
                chrono::Utc,
            )
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

        pub async fn fetch(
            client: &solana_client::rpc_client::RpcClient,
            pubkey: Pubkey,
        ) -> std::result::Result<Self, switchboard_common::Error> {
            crate::client::load_account(client, pubkey).await
        }
    }
}
