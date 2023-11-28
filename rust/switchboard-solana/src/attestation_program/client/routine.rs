use crate::*;

use solana_client::rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig};
use solana_sdk::commitment_config::{CommitmentConfig, CommitmentLevel};
use solana_sdk::signer::Signer;

use std::sync::Arc;

#[derive(Default, Debug, Clone)]
pub struct FunctionRoutineFilters {
    pub attestation_queue: Option<Pubkey>,
    pub authority: Option<Pubkey>,
    pub metadata: Option<Vec<u8>>,
    pub is_enabled: Option<bool>,
    // Note: This will not catch functions for which the verifier fetching
    // is the secondary oracle. This is because the verifier is not stored
    // on the function account but on the queue account.
    pub queue_idx: Option<u32>,
}

impl FunctionRoutineFilters {
    pub fn to_vec(&self) -> Vec<solana_client::rpc_filter::RpcFilterType> {
        let mut filters = vec![FunctionRoutineAccountData::get_discriminator_filter()];

        // AttestationQueue Filter
        if let Some(attestation_queue) = &self.attestation_queue {
            filters.push(FunctionRoutineAccountData::get_queue_filter(
                attestation_queue,
            ));
        }

        // Authority Filter
        if let Some(authority) = &self.authority {
            filters.push(FunctionRoutineAccountData::get_authority_filter(authority));
        }

        // Metadata Filter
        if let Some(metadata) = &self.metadata {
            filters.push(FunctionRoutineAccountData::get_metadata_filter(
                metadata.clone(),
            ));
        }

        // Is Enabled Filter
        if let Some(is_enabled) = &self.is_enabled {
            if *is_enabled {
                filters.push(FunctionRoutineAccountData::get_is_enabled_filter());
            }
        }

        // Queue Idx Filter
        if let Some(queue_idx) = &self.queue_idx {
            filters.push(FunctionRoutineAccountData::get_queue_idx_filter(queue_idx));
        }

        filters
    }
}

impl FunctionRoutineAccountData {
    /////////////////////////////////////////////////////////////
    /// Client Methods
    /////////////////////////////////////////////////////////////

    pub async fn get_program_accounts(
        rpc: &solana_client::nonblocking::rpc_client::RpcClient,
        filters: FunctionRoutineFilters,
        commitment: Option<CommitmentLevel>,
    ) -> Result<Vec<(Pubkey, FunctionRoutineAccountData)>, SbError> {
        let mut routines = vec![];

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
            if let Ok(routine_data) =
                FunctionRoutineAccountData::try_deserialize(&mut &account.data[..])
            {
                routines.push((pubkey, routine_data));
            }
        }

        Ok(routines)
    }

    /////////////////////////////////////////////////////////////
    /// Fetch Methods
    /////////////////////////////////////////////////////////////

    pub fn fetch(
        client: &solana_client::rpc_client::RpcClient,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::SbError> {
        crate::client::fetch_borsh_account(client, pubkey)
    }

    pub async fn fetch_async(
        client: &solana_client::nonblocking::rpc_client::RpcClient,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::SbError> {
        crate::client::fetch_borsh_account_async(client, pubkey).await
    }

    pub fn fetch_sync<T: solana_sdk::client::SyncClient>(
        client: &T,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::SbError> {
        crate::client::fetch_borsh_account_sync(client, pubkey)
    }

    //

    pub fn get_discriminator_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                0,
                FunctionRoutineAccountData::discriminator().to_vec(),
            ),
        )
    }

    pub fn get_authority_filter(
        authority_pubkey: &Pubkey,
    ) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                419,
                authority_pubkey.to_bytes().into(),
            ),
        )
    }

    pub fn get_queue_filter(queue_pubkey: &Pubkey) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(515, queue_pubkey.to_bytes().into()),
        )
    }

    pub fn get_queue_idx_filter(queue_idx: &u32) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(611, queue_idx.to_le_bytes().to_vec()),
        )
    }

    pub fn get_is_enabled_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(344, 0u8.to_le_bytes().to_vec()),
        )
    }

    pub fn get_metadata_filter(metadata: Vec<u8>) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(72, metadata),
        )
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

    pub fn calc_container_params_hash(container_params: &Vec<u8>) -> [u8; 32] {
        solana_program::hash::hash(container_params).to_bytes()
    }

    pub fn get_container_params_hash(&self) -> [u8; 32] {
        solana_program::hash::hash(&self.container_params).to_bytes()
    }
}
