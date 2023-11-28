use crate::*;

use kv_log_macro::info;
use solana_client::rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig};
use solana_sdk::commitment_config::{CommitmentConfig, CommitmentLevel};
use solana_sdk::signer::Signer;
use std::sync::Arc;

#[derive(Default, Debug, Clone)]
pub struct FunctionRequestFilters {
    pub attestation_queue: Option<Pubkey>,
    pub authority: Option<Pubkey>,
    pub is_triggered: Option<bool>,
    pub is_active: Option<bool>,
    // Note: This will not catch functions for which the verifier fetching
    // is the secondary oracle. This is because the verifier is not stored
    // on the function account but on the queue account.
    pub queue_idx: Option<u32>,
}

impl FunctionRequestFilters {
    pub fn to_vec(&self) -> Vec<solana_client::rpc_filter::RpcFilterType> {
        let mut filters = vec![FunctionRequestAccountData::get_discriminator_filter()];

        // AttestationQueue Filter
        if let Some(attestation_queue) = &self.attestation_queue {
            filters.push(FunctionRequestAccountData::get_queue_filter(
                attestation_queue,
            ));
        }

        // Authority Filter
        if let Some(authority) = &self.authority {
            filters.push(FunctionRequestAccountData::get_authority_filter(authority));
        }

        // Combine filters for efficiency
        if self.is_triggered.is_some() && self.is_active.is_some() {
            filters.push(FunctionRequestAccountData::get_is_triggered_and_active_filter());
        } else {
            // Is Triggered Filter
            if let Some(is_triggered) = &self.is_triggered {
                if *is_triggered {
                    filters.push(FunctionRequestAccountData::get_is_triggered_filter());
                }
            }

            // Is Active Filter
            if let Some(is_active) = &self.is_active {
                if *is_active {
                    filters.push(FunctionRequestAccountData::get_is_active_filter());
                }
            }
        }

        // Queue Idx Filter
        if let Some(queue_idx) = &self.queue_idx {
            filters.push(FunctionRequestAccountData::get_queue_idx_filter(queue_idx));
        }

        filters
    }
}

impl FunctionRequestAccountData {
    /////////////////////////////////////////////////////////////
    /// Client Methods
    /////////////////////////////////////////////////////////////
    ///

    pub async fn get_program_accounts(
        rpc: &solana_client::nonblocking::rpc_client::RpcClient,
        filters: FunctionRequestFilters,
        commitment: Option<CommitmentLevel>,
    ) -> Result<Vec<(Pubkey, FunctionRequestAccountData)>, SbError> {
        let mut requests = vec![];

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
            if let Ok(request_data) =
                FunctionRequestAccountData::try_deserialize(&mut &account.data[..])
            {
                requests.push((pubkey, request_data));
            }
        }

        Ok(requests)
    }

    pub async fn get_or_create_from_seed(
        rpc: &solana_client::nonblocking::rpc_client::RpcClient,
        payer: std::sync::Arc<Keypair>,
        function: Pubkey,
        seed: Option<&str>,
        params: Option<FunctionRequestInitAndTriggerParams>,
    ) -> Result<Pubkey, SbError> {
        let params = params.unwrap_or_default();
        let request_keypair = crate::keypair_from_base_seed(
            format!("request-{}-{}", function, seed.unwrap_or("default")).as_str(),
            payer.secret().to_bytes().to_vec(),
            Some(params.try_to_vec().unwrap()),
        )
        .unwrap();
        let request_pubkey = request_keypair.pubkey();

        if let Err(SbError::AccountNotFound) =
            FunctionRequestAccountData::fetch_async(rpc, request_pubkey).await
        {
            info!(
                "[Request] creating new request account {} ...",
                request_pubkey
            );

            // Fetch function_data and determine if we need authority signer
            let function_data = FunctionAccountData::fetch_async(rpc, function)
                .await
                .unwrap();
            if function_data.requests_require_authorization != 0
                && payer.pubkey() != function_data.authority
            {
                return Err(SbError::Message("MissingAuthoritySigner"));
            }

            // Build the request account and trigger it
            let req_init_ixn = FunctionRequestInitAndTrigger::build_ix(
                &FunctionRequestInitAndTriggerAccounts {
                    request: request_pubkey,
                    authority: payer.pubkey(),
                    function,
                    function_authority: None,
                    attestation_queue: function_data.attestation_queue,
                    payer: payer.pubkey(),
                },
                &params,
            )
            .unwrap();

            let tx = crate::ix_to_tx(
                &[req_init_ixn],
                &[&*payer, &request_keypair],
                rpc.get_latest_blockhash().await.unwrap_or_default(),
            )
            .unwrap();

            let signature = rpc.send_and_confirm_transaction(&tx).await.unwrap();

            info!(
                "[Request] request {} initialized. Tx Signature: {}",
                request_pubkey, signature
            );
        };

        Ok(request_pubkey)
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
                FunctionRequestAccountData::discriminator().to_vec(),
            ),
        )
    }

    pub fn get_is_triggered_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(8, vec![1u8]),
        )
    }

    pub fn get_is_active_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                9,
                vec![RequestStatus::RequestPending as u8],
            ),
        )
    }

    pub fn get_is_triggered_and_active_filter() -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                8,
                vec![1u8, RequestStatus::RequestPending as u8],
            ),
        )
    }

    pub fn get_queue_filter(queue_pubkey: &Pubkey) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(138, queue_pubkey.to_bytes().into()),
        )
    }

    pub fn get_queue_idx_filter(queue_idx: &u32) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(275, queue_idx.to_le_bytes().to_vec()),
        )
    }

    pub fn get_authority_filter(
        authority_pubkey: &Pubkey,
    ) -> solana_client::rpc_filter::RpcFilterType {
        solana_client::rpc_filter::RpcFilterType::Memcmp(
            solana_client::rpc_filter::Memcmp::new_raw_bytes(
                10,
                authority_pubkey.to_bytes().into(),
            ),
        )
    }

    pub fn get_is_ready_filters(
        queue_pubkey: &Pubkey,
    ) -> Vec<solana_client::rpc_filter::RpcFilterType> {
        vec![
            FunctionRequestAccountData::get_discriminator_filter(),
            FunctionRequestAccountData::get_is_triggered_filter(),
            FunctionRequestAccountData::get_is_active_filter(),
            FunctionRequestAccountData::get_queue_filter(queue_pubkey),
        ]
    }

    pub fn calc_container_params_hash(&self) -> [u8; 32] {
        solana_program::hash::hash(&self.container_params).to_bytes()
    }
}
