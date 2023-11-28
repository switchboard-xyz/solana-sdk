#![allow(clippy::too_many_arguments)]
use crate::*;

use anchor_client::solana_sdk::client::SyncClient;
use kv_log_macro::{info};
use solana_client::nonblocking::rpc_client::RpcClient as NonblockingRpcClient;
use solana_client::rpc_client::RpcClient;
use solana_program::hash::Hash;
use solana_sdk::message::Message;
use solana_sdk::signature::Signature;
use solana_sdk::signer::keypair::Keypair;
use solana_sdk::signer::Signer;
use solana_sdk::transaction::Transaction;
use std::result::Result;
use std::sync::Arc;
use switchboard_common::SbError;

/// Parameters used to initialize the bootstrapped attestation queue.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct BootstrapAttestationQueueParams {
    pub reward: Option<u32>,
    pub allow_authority_override_after: Option<u32>,
    pub max_quote_verification_age: Option<u32>,
    pub require_authority_heartbeat_permission: Option<bool>,
    pub require_usage_permissions: Option<bool>,
    pub node_timeout: Option<u32>,
    pub verifier_enclave: Option<Vec<u8>>,
    pub registry_key: Option<Vec<u8>>,
}
impl Default for BootstrapAttestationQueueParams {
    fn default() -> Self {
        Self {
            reward: Some(0),
            allow_authority_override_after: Some(180),
            max_quote_verification_age: Some(604800),
            require_authority_heartbeat_permission: Some(false),
            require_usage_permissions: Some(false),
            node_timeout: Some(900),
            verifier_enclave: None,
            registry_key: Some(vec![]),
        }
    }
}

/// Signers used to initialize the bootstrapped attestation queue.
#[derive(Default)]
pub struct BootstrapAttestationQueueSigners {
    pub queue_keypair: Option<Arc<Keypair>>,
    pub authority_keypair: Option<Arc<Keypair>>,

    pub verifier_keypair: Option<Arc<Keypair>>,
    pub verifier_enclave_signer: Option<Arc<Keypair>>,
}

/// Represents a bootstrapped attestation queue with a verifier.
// TODO: store the client so we can automatically relay transactions on-chain
pub struct BootstrappedAttestationQueue {
    /// The pubkey of the [`AttestationQueueAccount`]
    pub attestation_queue: Pubkey,
    /// The pubkey designated as the authority of the [`AttestationQueueAccount`]
    pub queue_authority: Pubkey,

    /// The pubkey of the [`VerifierAccountData`]
    pub verifier: Pubkey,
    /// The pubkey of the [`AttestationPermissionAccount`]
    pub verifier_permission: Pubkey,
    /// The keypair of the verifier's enclave generated signer.
    pub verifier_signer: Arc<Keypair>,
    // /// The token account that will receive rewards for verifying requests.
    // pub reward_receiver: Pubkey,
}

/// The default verifier enclave measurement. This is not a valid measurement and should be used for testing only.
pub const DEFAULT_VERIFIER_MR_ENCLAVE: [u8; 32] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32,
];

// TODO: store client and reward_receiver so we can easily send verify transactions
impl BootstrappedAttestationQueue {
    pub async fn get_or_create_from_seed(
        rpc: &solana_client::nonblocking::rpc_client::RpcClient,
        payer: std::sync::Arc<Keypair>,
        seed: Option<&str>,
        params: Option<BootstrapAttestationQueueParams>,
    ) -> Result<Self, SbError> {
        let params = params.unwrap_or_default();
        let queue_keypair = crate::keypair_from_base_seed(
            format!("attestation-queue-{}", seed.unwrap_or("default")).as_str(),
            payer.secret().to_bytes().to_vec(),
            Some(params.try_to_vec().unwrap()),
        )
        .unwrap();
        let queue_pubkey: Pubkey = queue_keypair.pubkey();

        let verifier_keypair = crate::keypair_from_base_seed(
            format!("verifier-{}-{}", 1, seed.unwrap_or("default")).as_str(),
            payer.secret().to_bytes().to_vec(),
            None,
        )
        .unwrap();

        let enclave_signer_keypair = crate::keypair_from_base_seed(
            format!(
                "verifier-{}-enclave-signer-{}",
                1,
                seed.unwrap_or("default")
            )
            .as_str(),
            payer.secret().to_bytes().to_vec(),
            None,
        )
        .unwrap();

        let result = if let Err(err) =
            AttestationQueueAccountData::fetch_async(rpc, queue_pubkey).await
        {
            if let SbError::AccountNotFound = &err {
                info!(
                    "[BootstrappedQueue] creating new bootstrapped attestation queue {} ...",
                    queue_pubkey
                );

                let (queue, signature) = Self::create_async(
                    rpc,
                    &payer,
                    Some(params),
                    Some(BootstrapAttestationQueueSigners {
                        queue_keypair: Some(queue_keypair.clone()),
                        authority_keypair: None,
                        verifier_keypair: Some(verifier_keypair.clone()),
                        verifier_enclave_signer: Some(enclave_signer_keypair.clone()),
                    }),
                )
                .await
                .map_err(|e| {
                    println!("Failed to build bootstrapped queue - {:?}", e);
                    e
                })
                .unwrap();

                info!(
                    "[BootstrappedQueue] bootstrapped attestation queue {} initialized. Tx Signature: {}",
                    queue_pubkey, signature
                );

                Ok(queue)
            } else {
                return Err(err.clone());
            }
        } else {
            Err(SbError::Generic)
        };

        if let Ok(queue) = result {
            return Ok(queue);
        }

        let (attestation_queue_result, verifier_data_result) = tokio::join!(
            AttestationQueueAccountData::fetch_async(rpc, queue_pubkey),
            VerifierAccountData::fetch_async(rpc, verifier_keypair.pubkey())
        );

        let attestation_queue = attestation_queue_result.unwrap();
        let _verifier_data = verifier_data_result.unwrap();

        // TODO: verify verifier enclave signer still matches

        info!(
            "[BootstrappedQueue] bootstrapped attestation queue loaded {}",
            queue_pubkey
        );

        Ok(Self {
            attestation_queue: queue_pubkey,
            queue_authority: attestation_queue.authority,
            verifier: verifier_keypair.pubkey(),
            verifier_permission: AttestationPermissionAccountData::get_pda(
                &attestation_queue.authority,
                &queue_pubkey,
                &verifier_keypair.pubkey(),
            ),
            verifier_signer: enclave_signer_keypair.clone(),
        })
    }

    pub fn create_ixs(
        payer: Pubkey,
        attestation_queue: Pubkey,
        verifier: Pubkey,
        verifier_signer: Pubkey,
        params: Option<BootstrapAttestationQueueParams>,
    ) -> Result<Vec<Instruction>, SbError> {
        let params = params.unwrap_or_default();

        let queue_authority = payer;
        // if let Some(authority_pubkey) = authority.as_ref() {
        //     queue_authority = *authority_pubkey;
        // }

        // attestation_queue_init
        let attestation_queue_init_ixn =
            AttestationQueueInit::build_ix(&AttestationQueueInitArgs {
                attestation_queue,
                queue_authority: Some(queue_authority),
                payer,
                allow_authority_override_after: params
                    .allow_authority_override_after
                    .unwrap_or(180),
                require_authority_heartbeat_permission: params
                    .require_authority_heartbeat_permission
                    .unwrap_or_default(),
                require_usage_permissions: params.require_usage_permissions.unwrap_or_default(),
                max_quote_verification_age: params.max_quote_verification_age.unwrap_or(604800),
                reward: params.reward.unwrap_or_default(),
                node_timeout: params.node_timeout.unwrap_or(900),
            })?;

        // (??) attestation_queue_add_mr_enclave
        let mut verifier_enclave = DEFAULT_VERIFIER_MR_ENCLAVE;
        if let Some(verifier_enclave_measurement) = params.verifier_enclave {
            if verifier_enclave_measurement.len() != 32 {
                return Err(SbError::Message("InvalidVerifierEnclaveMeasurement"));
            }
            verifier_enclave = verifier_enclave_measurement.try_into().unwrap();
        }
        let attestation_queue_add_mr_enclave_ixn =
            AttestationQueueAddMrEnclave::build_ix(&AttestationQueueAddMrEnclaveArgs {
                attestation_queue,
                queue_authority,
                mr_enclave: verifier_enclave,
            })?;

        // verifier_init
        let verifier_init_ixn = VerifierInit::build_ix(&VerifierInitArgs {
            verifier,
            attestation_queue,
            queue_authority,
            payer,
        })?;

        // attestation_permission_init
        let verifier_permission_init_ixn = AttestationPermissionInit::build_ix(
            attestation_queue,
            queue_authority,
            verifier,
            payer,
        )?;

        // (??) attestation_permission_set
        let attestation_permission_set_ixn = AttestationPermissionSet::build_ix(
            attestation_queue,
            queue_authority,
            verifier,
            SwitchboardAttestationPermission::PermitNodeheartbeat,
            true,
        )?;

        // verifier_quote_rotate
        let mut registry_key = [0u8; 64];
        if let Some(registry_key_vec) = params.registry_key {
            if registry_key_vec.len() > 64 {
                return Err(SbError::Message("Registry key must be less than 64 bytes"));
            }
            registry_key[0..registry_key_vec.len()].copy_from_slice(&registry_key_vec[..]);
        }
        let verifier_quote_rotate_ixn = VerifierQuoteRotate::build_ix(
            &verifier,
            &queue_authority,
            &verifier_signer,
            &attestation_queue,
            registry_key,
        )?;

        // verifier_heartbeat
        let verifier_heartbeat_ixn = VerifierHeartbeat::build_ix(VerifierHeartbeatArgs {
            verifier,
            enclave_signer: verifier_signer,
            attestation_queue,
            queue_authority,
            gc_node: verifier,
        })?;

        let ixs = vec![
            attestation_queue_init_ixn,
            attestation_queue_add_mr_enclave_ixn,
            verifier_init_ixn,
            verifier_permission_init_ixn,
            attestation_permission_set_ixn,
            verifier_quote_rotate_ixn,
            verifier_heartbeat_ixn,
        ];

        Ok(ixs)
    }

    pub fn create_tx(
        payer: &Keypair,
        recent_blockhash: Hash,
        params: Option<BootstrapAttestationQueueParams>,
        signers: Option<BootstrapAttestationQueueSigners>,
    ) -> Result<(Self, Transaction), SbError> {
        let signers = signers.unwrap_or_default();

        // Setup signers and accounts
        let mut keypairs: Vec<&Keypair> = vec![payer];

        // let mut authority_pubkey = payer.pubkey();
        // if let Some(authority_keypair) = signers.authority_keypair.as_ref() {
        //     keypairs.push(authority_keypair);
        //     authority_pubkey = authority_keypair.pubkey();
        // }

        let queue_keypair = signers.queue_keypair.unwrap_or(Arc::new(Keypair::new()));
        keypairs.push(&queue_keypair);

        let verifier_keypair = signers.verifier_keypair.unwrap_or(Arc::new(Keypair::new()));
        keypairs.push(&verifier_keypair);

        let verifier_signer = signers
            .verifier_enclave_signer
            .unwrap_or(Arc::new(Keypair::new()));
        keypairs.push(&verifier_signer);

        // for kp in &keypairs {
        //     println!("keypair {}", kp.pubkey());
        // }

        // println!("payer {}", payer.pubkey());
        // println!("queue {}", queue_keypair.pubkey());
        // println!("verifier {}", verifier_keypair.pubkey());
        // println!("enclave {}", verifier_signer.pubkey());

        // println!(
        //     "permission: {}",
        //     AttestationPermissionAccountData::get_pda(
        //         &payer.pubkey(),
        //         &queue_keypair.pubkey(),
        //         &verifier_keypair.pubkey()
        //     )
        // );

        let ixs = Self::create_ixs(
            payer.pubkey(),
            queue_keypair.pubkey(),
            verifier_keypair.pubkey(),
            verifier_signer.pubkey(),
            params,
        )?;

        // let reward_receiver = find_associated_token_address(&payer.pubkey(), &NativeMint::ID);

        let tx = Transaction::new(
            &keypairs,
            Message::new(&ixs, Some(&payer.pubkey())),
            recent_blockhash,
        );

        let queue = BootstrappedAttestationQueue {
            attestation_queue: queue_keypair.pubkey(),
            queue_authority: payer.pubkey(),
            verifier: verifier_keypair.pubkey(),
            verifier_permission: AttestationPermissionAccountData::get_pda(
                &payer.pubkey(),
                &queue_keypair.pubkey(),
                &verifier_keypair.pubkey(),
            ),
            verifier_signer,
        };

        Ok((queue, tx))
    }

    /// Create a new bootstrapped attestation queue using an [`RpcClient']
    pub fn create(
        client: &RpcClient,
        payer: &Keypair,
        params: Option<BootstrapAttestationQueueParams>,
        signers: Option<BootstrapAttestationQueueSigners>,
    ) -> Result<(Self, Signature), SbError> {
        let recent_blockhash = client.get_latest_blockhash().unwrap_or_default();
        // .map_err(|e| SbError::CustomError {
        //     message: "failed to fetch recent blockhash".to_string(),
        //     source: std::sync::Arc::new(e),
        // })?;

        let (queue, tx) = Self::create_tx(payer, recent_blockhash, params, signers)?;

        let sig = client
            .send_and_confirm_transaction(&tx)
            .map_err(|e| SbError::CustomError {
                message: "failed to send transaction".to_string(),
                source: std::sync::Arc::new(e),
            })?;

        Ok((queue, sig))
    }

    /// Create a new bootstrapped attestation queue using a [`SyncClient`]
    pub fn create_sync<C: SyncClient>(
        client: &C,
        payer: &Keypair,
        params: Option<BootstrapAttestationQueueParams>,
        signers: Option<BootstrapAttestationQueueSigners>,
    ) -> Result<(Self, Signature), SbError> {
        let signers = signers.unwrap_or_default();

        // Setup signers and accounts
        let mut keypairs: Vec<&Keypair> = vec![payer];

        let authority_pubkey = payer.pubkey();
        // if let Some(authority_keypair) = signers.authority_keypair.as_ref() {
        //     keypairs.push(authority_keypair);
        //     authority_pubkey = authority_keypair.pubkey();
        // }

        let queue_keypair = signers.queue_keypair.unwrap_or(Arc::new(Keypair::new()));
        keypairs.push(&queue_keypair);

        let verifier_keypair = signers.verifier_keypair.unwrap_or(Arc::new(Keypair::new()));
        keypairs.push(&verifier_keypair);

        let verifier_signer = signers
            .verifier_enclave_signer
            .unwrap_or(Arc::new(Keypair::new()));
        keypairs.push(&verifier_signer);

        let ixs = Self::create_ixs(
            payer.pubkey(),
            queue_keypair.pubkey(),
            verifier_keypair.pubkey(),
            verifier_signer.pubkey(),
            params,
        )?;

        let message = Message::new(&ixs, Some(&payer.pubkey()));

        let sig = client
            .send_and_confirm_message(&keypairs, message)
            .map_err(|e| SbError::CustomError {
                message: "failed to send transaction".to_string(),
                source: std::sync::Arc::new(e),
            })?;

        let queue = BootstrappedAttestationQueue {
            attestation_queue: queue_keypair.pubkey(),
            queue_authority: authority_pubkey,
            verifier: verifier_keypair.pubkey(),
            verifier_permission: AttestationPermissionAccountData::get_pda(
                &authority_pubkey,
                &queue_keypair.pubkey(),
                &verifier_keypair.pubkey(),
            ),
            verifier_signer,
        };

        Ok((queue, sig))
    }

    /// Create a new bootstrapped attestation queue using the nonblocking async rpc client
    pub async fn create_async(
        client: &NonblockingRpcClient,
        payer: &Keypair,
        params: Option<BootstrapAttestationQueueParams>,
        signers: Option<BootstrapAttestationQueueSigners>,
    ) -> Result<(Self, Signature), SbError> {
        let recent_blockhash =
            client
                .get_latest_blockhash()
                .await.unwrap_or_default();
                // .map_err(|e| SbError::CustomError {
                //     message: "failed to fetch recent blockhash".to_string(),
                //     source: std::sync::Arc::new(e),
                // })?;

        let (queue, tx) = Self::create_tx(payer, recent_blockhash, params, signers)?;

        let sig = client
            .send_and_confirm_transaction(&tx)
            .await
            .map_err(|e| SbError::CustomError {
                message: "failed to send transaction".to_string(),
                source: std::sync::Arc::new(e),
            })?;

        Ok((queue, sig))
    }

    pub fn build_function_verify_ix(
        &self,
        function: Pubkey,
        enclave_signer: Pubkey,
        function_escrow: Pubkey,
        params: FunctionVerifyParams,
        reward_receiver: Pubkey,
    ) -> Result<Instruction, SbError> {
        let ix = FunctionVerify::build_ix(
            &FunctionVerifyAccounts {
                function,
                function_enclave_signer: enclave_signer,
                function_escrow,
                verifier: self.verifier,
                verifier_enclave_signer: self.verifier_signer.pubkey(),
                reward_receiver,
                attestation_queue: self.attestation_queue,
                queue_authority: self.queue_authority,
            },
            &params,
        )?;

        Ok(ix)
    }

    pub fn build_request_verify_ix(
        &self,
        function: Pubkey,
        request: Pubkey,
        enclave_signer: Pubkey,
        params: FunctionRequestVerifyParams,
        reward_receiver: Pubkey,
        function_escrow_token_wallet: Option<Pubkey>,
    ) -> Result<Instruction, SbError> {
        let ix = FunctionRequestVerify::build_ix(
            &FunctionRequestVerifyAccounts {
                request,
                function_enclave_signer: enclave_signer,
                function,
                function_escrow_token_wallet,
                verifier: self.verifier,
                verifier_enclave_signer: self.verifier_signer.pubkey(),
                reward_receiver,
                attestation_queue: self.attestation_queue,
                queue_authority: self.queue_authority,
            },
            &params,
        )?;

        Ok(ix)
    }

    pub fn build_routine_verify_ix(
        &self,
        function: Pubkey,
        routine: Pubkey,
        enclave_signer: Pubkey,
        routine_escrow_wallet: Pubkey,
        params: FunctionRoutineVerifyParams,
        reward_receiver: Pubkey,
        function_escrow_token_wallet: Option<Pubkey>,
    ) -> Result<Instruction, SbError> {
        let ix = FunctionRoutineVerify::build_ix(
            &FunctionRoutineVerifyAccounts {
                routine,
                function_enclave_signer: enclave_signer,
                function,
                escrow_wallet: routine_escrow_wallet,
                function_escrow_token_wallet,
                verifier: self.verifier,
                verifier_enclave_signer: self.verifier_signer.pubkey(),
                reward_receiver,
                attestation_queue: self.attestation_queue,
                queue_authority: self.queue_authority,
            },
            &params,
        )?;

        Ok(ix)
    }
}
