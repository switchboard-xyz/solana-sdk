use crate::*;

use kv_log_macro::{debug, info};
use sha2::{Digest, Sha256};
use solana_client::rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig};
use solana_sdk::commitment_config::{CommitmentConfig, CommitmentLevel};
use solana_sdk::signer::Signer;

use std::sync::Arc;

pub const DEFAULT_FUNCTION_MR_ENCLAVE: [u8; 32] = [
    23, 255, 152, 240, 7, 140, 229, 105, 131, 187, 62, 160, 17, 200, 177, 156, 238, 213, 242, 156,
    153, 94, 5, 77, 91, 218, 183, 146, 181, 206, 173, 108,
];

#[derive(Default, Debug, Clone)]
pub struct FunctionFilters {
    pub attestation_queue: Option<Pubkey>,
    pub authority: Option<Pubkey>,
    pub metadata: Option<Vec<u8>>,
    pub permissions: Option<u32>,
    // Note: This will not catch functions for which the verifier fetching
    // is the secondary oracle. This is because the verifier is not stored
    // on the function account but on the queue account.
    pub queue_idx: Option<u32>,
}
impl FunctionFilters {
    pub fn to_vec(&self) -> Vec<solana_client::rpc_filter::RpcFilterType> {
        let mut filters = vec![FunctionAccountData::get_discriminator_filter()];

        // AttestationQueue & Authority Filters
        // Combine these two filters for efficiency
        if let Some(attestation_queue) = &self.attestation_queue {
            if let Some(authority) = &self.authority {
                filters.push(FunctionAccountData::get_queue_and_authority_filter(
                    attestation_queue,
                    authority,
                ));
            } else {
                filters.push(FunctionAccountData::get_queue_filter(attestation_queue));
            }
        } else if let Some(authority) = &self.authority {
            filters.push(FunctionAccountData::get_authority_filter(authority));
        }

        // Metadata Filter
        if let Some(metadata) = &self.metadata {
            filters.push(FunctionAccountData::get_metadata_filter(metadata.clone()));
        }

        // Permissions Filter
        if let Some(permissions) = &self.permissions {
            filters.push(FunctionAccountData::get_permissions_filter(permissions));
        }

        // Queue Idx Filter
        if let Some(queue_idx) = &self.queue_idx {
            filters.push(FunctionAccountData::get_queue_idx_filter(queue_idx));
        }

        filters
    }
}

impl FunctionAccountData {
    pub async fn get_program_accounts(
        rpc: &solana_client::nonblocking::rpc_client::RpcClient,
        filters: FunctionFilters,
        commitment: Option<CommitmentLevel>,
    ) -> Result<Vec<(Pubkey, FunctionAccountData)>, SbError> {
        let mut functions = vec![];

        let accounts = rpc
            .get_program_accounts_with_config(
                &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                RpcProgramAccountsConfig {
                    filters: Some(filters.to_vec()),
                    account_config: RpcAccountInfoConfig {
                        encoding: Some(solana_account_decoder::UiAccountEncoding::Base64Zstd),
                        commitment: Some(CommitmentConfig {
                            commitment: commitment.unwrap_or(CommitmentLevel::Processed),
                        }),
                        ..Default::default()
                    },
                    ..Default::default()
                },
            )
            .await
            .map_err(|e| SbError::CustomError {
                message: "Failed to get program accounts".to_string(),
                source: Arc::new(e),
            })?;

        for (pubkey, account) in accounts {
            if let Ok(function_data) = FunctionAccountData::try_deserialize(&mut &account.data[..])
            {
                functions.push((pubkey, function_data));
            }
        }

        Ok(functions)
    }

    // meh this is a PDA so we can deterministically derive this
    // we could set the name to some sha256 hash of the params
    // then do a gPA call to filter by name
    pub async fn get_or_create_from_seed(
        rpc: &solana_client::nonblocking::rpc_client::RpcClient,
        payer: std::sync::Arc<Keypair>,
        attestation_queue: Pubkey,
        seed: Option<&str>,
        params: Option<FunctionInitParams>,
    ) -> Result<Pubkey, SbError> {
        let mut params = params.unwrap_or_default();

        let mut seed = format!(
            "function-{}-{}",
            attestation_queue,
            seed.unwrap_or("default")
        )
        .as_str()
        .as_bytes()
        .to_vec();
        seed.extend_from_slice(&payer.secret().to_bytes());

        // were injecting the mrenclave and metadata into the params so cant use params in keypair schema

        // Sha256 hash of the seeds = the metadata of the function
        let mut hash = [0u8; 32];
        hash.copy_from_slice(&Sha256::digest(&seed).as_slice()[..32]);
        params.metadata = hash.to_vec();

        // default to some mrenclave value for testing purposes
        if let Some(mrenclave) = &params.mr_enclave {
            if mrenclave == &[0u8; 32] {
                params.mr_enclave = Some(DEFAULT_FUNCTION_MR_ENCLAVE);
            }
        } else {
            params.mr_enclave = Some(DEFAULT_FUNCTION_MR_ENCLAVE);
        }

        let functions = FunctionAccountData::get_program_accounts(
            rpc,
            FunctionFilters {
                attestation_queue: Some(attestation_queue),
                authority: Some(payer.pubkey()),
                metadata: Some(hash.to_vec()),
                ..Default::default()
            },
            None,
        )
        .await?;

        if functions.is_empty() {
            // Create a new function

            let slot = rpc.get_slot().await.unwrap();
            let creator_seed = payer.pubkey().to_bytes().to_vec();

            let (function_pubkey, _bump) = Pubkey::find_program_address(
                &[b"FunctionAccountData", &creator_seed, &slot.to_le_bytes()],
                &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
            );

            info!(
                "[Function] creating new function account {} ...",
                function_pubkey
            );

            let (address_lookup_table, _) = Pubkey::find_program_address(
                &[&function_pubkey.to_bytes(), &slot.to_le_bytes()],
                &solana_address_lookup_table_program::ID,
            );

            let name_seed = SwitchboardWallet::parse_name(b"default");

            // get or create the default switchboard wallet
            let switchboard_wallet = SwitchboardWallet::get_or_create_from_seed(
                rpc,
                payer.clone(),
                attestation_queue,
                Some(name_seed.to_vec()),
            )
            .await
            .unwrap();

            let function_init_ixn = Self::build_ix(
                &FunctionInitAccounts {
                    function: function_pubkey,
                    address_lookup_table,
                    authority: payer.pubkey(),
                    attestation_queue,
                    payer: payer.pubkey(),
                    escrow_wallet: switchboard_wallet,
                    escrow_wallet_authority: None,
                },
                &FunctionInitParams {
                    recent_slot: slot,
                    creator_seed: None,
                    metadata: hash.to_vec(),
                    ..params
                },
            )
            .unwrap();

            let tx = crate::ix_to_tx(
                &[function_init_ixn],
                &[&*payer],
                rpc.get_latest_blockhash().await.unwrap_or_default(),
            )
            .unwrap();

            let signature = rpc.send_and_confirm_transaction(&tx).await.unwrap();

            info!(
                "[Function] switchboard function {} initialized. Tx Signature: {}",
                function_pubkey, signature
            );

            Ok(function_pubkey)
        } else if functions.len() == 1 {
            let function_pubkey = functions[0].0;

            println!("[Function] Found function {}", function_pubkey);

            Ok(function_pubkey)
        } else {
            let function_pubkey = functions[0].0;

            println!(
                "[Function] Found {} functions - {}",
                functions.len(),
                function_pubkey
            );
            debug!("Warning: Too many functions yielded from the getProgramAccounts filter");

            Ok(function_pubkey)
        }
    }

    pub fn get_discriminator_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                0,
                FunctionAccountData::discriminator().to_vec(),
            ),
        )
    }

    pub fn get_permissions_filter(permissions: &u32) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                10,
                permissions.to_le_bytes().to_vec(),
            ),
        )
    }

    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRequestAccountData` for all on-demand executions"
    )]
    pub fn get_is_triggered_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(9, vec![1u8]),
        )
    }

    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub fn get_is_scheduled_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(8, vec![1u8]),
        )
    }

    pub fn get_is_active_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                14,
                vec![FunctionStatus::Active as u8],
            ),
        )
    }

    pub fn get_queue_filter(queue_pubkey: &Pubkey) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(2553, queue_pubkey.to_bytes().into()),
        )
    }

    pub fn get_authority_filter(
        authority_pubkey: &Pubkey,
    ) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                2521,
                authority_pubkey.to_bytes().into(),
            ),
        )
    }

    pub fn get_queue_and_authority_filter(
        queue_pubkey: &Pubkey,
        authority_pubkey: &Pubkey,
    ) -> solana_client::rpc_filter::RpcFilterType {
        let bytes = vec![authority_pubkey.to_bytes(), queue_pubkey.to_bytes()].concat();
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(2521, bytes),
        )
    }

    pub fn get_queue_idx_filter(queue_idx: &u32) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(10, queue_idx.to_le_bytes().to_vec()),
        )
    }

    pub fn get_metadata_filter(metadata: Vec<u8>) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(112, metadata),
        )
    }

    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` or `FunctionRequestAccountData` for all function executions."
    )]
    pub fn get_is_ready_filters(
        queue_pubkey: &Pubkey,
    ) -> Vec<solana_client::rpc_filter::RpcFilterType> {
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
        chrono::NaiveDateTime::from_timestamp_opt(self.last_execution_timestamp, 0)
            .unwrap()
            .and_utc()
    }

    pub fn get_next_execution_datetime(&self) -> Option<chrono::DateTime<chrono::Utc>> {
        let schedule = self.get_schedule()?;

        // If we havent ever executed, use the current timestamp
        let last_execution_timestamp = if self.last_execution_timestamp > 0 {
            self.last_execution_timestamp
        } else {
            unix_timestamp()
        };
        let last_execution_datetime =
            chrono::NaiveDateTime::from_timestamp_opt(last_execution_timestamp, 0)
                .unwrap()
                .and_utc();

        schedule.after(&last_execution_datetime).next()
    }

    pub fn should_execute(&self, now: chrono::DateTime<chrono::Utc>) -> bool {
        if self.is_triggered > 0 {
            return true;
        }
        let schedule = self.get_schedule();
        if schedule.is_none() {
            return false;
        }
        if self.last_execution_timestamp == 0 {
            return true;
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

    #[deprecated(
        since = "0.28.35",
        note = "please use a `FunctionRoutineAccountData` for all scheduled executions"
    )]
    pub fn is_scheduled(&self) -> bool {
        self.schedule[0] == 0
    }

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

    pub fn build_ix(
        accounts: &FunctionInitAccounts,
        params: &FunctionInitParams,
    ) -> Result<Instruction, SbError> {
        Ok(crate::utils::build_ix(
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
            accounts,
            params,
        ))
    }
}

pub struct FunctionInitAccounts {
    pub function: Pubkey,
    pub address_lookup_table: Pubkey,
    pub authority: Pubkey,
    pub attestation_queue: Pubkey,
    pub payer: Pubkey,
    pub escrow_wallet: Pubkey,
    pub escrow_wallet_authority: Option<Pubkey>,
}
impl ToAccountMetas for FunctionInitAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();

        account_metas.push(AccountMeta::new(self.function, false));
        account_metas.push(AccountMeta::new(self.address_lookup_table, false));
        account_metas.push(AccountMeta::new_readonly(self.authority, false));
        account_metas.push(AccountMeta::new_readonly(self.attestation_queue, false));
        account_metas.push(AccountMeta::new(self.payer, true));
        account_metas.push(AccountMeta::new(self.escrow_wallet, false));

        if let Some(escrow_wallet_authority) = &self.escrow_wallet_authority {
            account_metas.push(AccountMeta::new_readonly(*escrow_wallet_authority, true));
        } else {
            account_metas.push(AccountMeta::new_readonly(
                SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                false,
            ));
        }

        account_metas.push(AccountMeta::new(
            find_associated_token_address(&self.escrow_wallet, &NativeMint::id()),
            false,
        ));
        account_metas.push(AccountMeta::new_readonly(NativeMint::ID, false));
        account_metas.push(AccountMeta::new_readonly(anchor_spl::token::ID, false));
        account_metas.push(AccountMeta::new_readonly(
            anchor_spl::associated_token::ID,
            false,
        ));
        account_metas.push(AccountMeta::new_readonly(
            anchor_lang::system_program::ID,
            false,
        ));
        account_metas.push(AccountMeta::new_readonly(
            solana_address_lookup_table_program::ID,
            false,
        ));
        account_metas
    }
}
