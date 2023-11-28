use crate::*;

use anchor_client::solana_sdk::commitment_config::CommitmentConfig;
use solana_client::rpc_config::RpcSimulateTransactionConfig;
use anchor_client::solana_sdk::transaction::{ Transaction, TransactionError };
use anchor_lang::Discriminator;
use dashmap::DashMap;
use sha2::{ Digest, Sha256 };
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::signature::Signature;
use solana_sdk::signer::keypair::Keypair;
use solana_sdk::signer::Signer;
use std::sync::Arc;
use tokio::sync::RwLock;

pub type AnchorClient = anchor_client::Client<Arc<Keypair>>;
pub type AnchorProgram = anchor_client::Program<Arc<Keypair>>;

pub type QuoteVerifyFn = dyn (Fn(&[u8], i64) -> bool) + Send + Sync;

#[derive(Default, Clone)]
pub struct CacheEntry {
    pub pubkey: Pubkey,
    pub timestamp: i64,
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub enum QvnReceipt {
    /// QVN completed successfully with a exit status of 0
    Success(String), // signature
    /// QVN completed successfully with an error code [200-255]
    SwitchboardError(String, u8), // signature, error code
    /// QVN failed to verify user transaction and fellback to a default transaction
    Fallback(String, u8), // signature, error code
}

#[derive(Clone)]
pub struct FunctionResultValidatorCache {
    pub timeout: Option<u32>,
    pub function_escrow_wallet: Arc<DashMap<Pubkey, CacheEntry>>,
    pub routine_escrow_wallet: Arc<DashMap<Pubkey, CacheEntry>>,
}
impl Default for FunctionResultValidatorCache {
    fn default() -> Self {
        Self {
            timeout: Some(300),
            function_escrow_wallet: Arc::new(DashMap::with_capacity(10_000)),
            routine_escrow_wallet: Arc::new(DashMap::with_capacity(10_000)),
        }
    }
}

/// The list of accounts used by this verifier to verify the function result
#[derive(Default, Debug, Clone)]
pub struct FunctionResultValidatorAccounts {
    pub payer: Pubkey,

    pub verifier: Pubkey,
    pub verifier_enclave_signer: Pubkey,
    pub reward_receiver: Pubkey,

    pub attestation_queue: Pubkey,
    pub queue_authority: Pubkey,
}

/// The cleaned up parameters used for a verify instruction
#[derive(Default, Debug, Clone)]
pub struct FunctionValidatorVerifyParams {
    pub mr_enclave: [u8; 32],
    pub error_code: u8,
    pub observed_time: i64,
    pub container_params_hash: [u8; 32],
    // optional
    pub request_slot: u64,
    pub next_allowed_timestamp: i64,
}

/// Represents a [`VerifierAccountData`] oracle and verifies an emitted FunctionResult
#[derive(Clone)]
pub struct FunctionResultValidator {
    pub client: Arc<RwLock<AnchorClient>>,
    pub rpc: Arc<RpcClient>,
    pub payer: Arc<Keypair>,

    // verifier fields
    pub verifier: Arc<Pubkey>,
    pub verifier_enclave_signer: FunctionResultValidatorSigner,
    pub reward_receiver: Arc<Pubkey>,

    // queue fields
    pub attestation_queue: Arc<Pubkey>,
    pub queue_authority: Arc<Pubkey>,

    pub quote_verify_fn: Arc<Box<QuoteVerifyFn>>,

    // cache some of the escrow pubkeys for faster execution
    pub cache: FunctionResultValidatorCache,
}

pub struct FunctionResultValidatorInitAccounts {
    pub verifier: Pubkey,
    pub attestation_queue: Pubkey,
    pub queue_authority: Pubkey,
    pub reward_receiver: Pubkey,
}

#[derive(Debug, Clone)]
pub enum FunctionResultValidatorSigner {
    Simulation(Arc<Pubkey>),
    Production(Arc<RwLock<Keypair>>),
}

impl FunctionResultValidator {
    /// Create a new instance of the [`FunctionResultValidator`]
    pub fn new(
        client: Arc<RwLock<AnchorClient>>,
        rpc: Arc<RpcClient>,
        payer: Arc<Keypair>,
        verifier_enclave_signer: FunctionResultValidatorSigner,
        accounts: &FunctionResultValidatorInitAccounts,
        quote_verify_fn: impl (Fn(&[u8], i64) -> bool) + 'static + Send + Sync,
        cache: Option<FunctionResultValidatorCache>
    ) -> Self {
        Self {
            client: client.clone(),
            rpc: rpc.clone(),
            payer: payer.clone(),

            verifier: Arc::new(accounts.verifier),
            // verifier_enclave_keypair,
            verifier_enclave_signer,
            reward_receiver: Arc::new(accounts.reward_receiver),

            attestation_queue: Arc::new(accounts.attestation_queue),
            queue_authority: Arc::new(accounts.queue_authority),

            quote_verify_fn: Arc::new(Box::new(quote_verify_fn)),

            cache: cache.unwrap_or_default(),
        }
    }

    pub async fn load(
        client: Arc<RwLock<AnchorClient>>,
        payer: Arc<Keypair>,
        verifier: Pubkey,
        verifier_enclave_signer: Option<FunctionResultValidatorSigner>,
        reward_receiver: Option<Pubkey>,
        quote_verify_fn: impl (Fn(&[u8], i64) -> bool) + 'static + Send + Sync,
        cache: Option<FunctionResultValidatorCache>
    ) -> Result<Self, SbError> {
        let rpc = get_async_rpc(&client).await?;

        let verifier_data = VerifierAccountData::fetch_async(rpc.as_ref(), verifier).await?;

        let verifier_enclave_signer = match verifier_enclave_signer {
            Some(verifier_enclave_signer) => {
                match &verifier_enclave_signer {
                    FunctionResultValidatorSigner::Simulation(pubkey) => {
                        if **pubkey != verifier_data.enclave.enclave_signer {
                            return Err(
                                SbError::Message(
                                    "The provided verifier signer does not match the expected signer's pubkey"
                                )
                            );
                        }
                    }
                    FunctionResultValidatorSigner::Production(keypair) => {
                        let signer_pubkey = get_enclave_signer_pubkey(keypair).await?;
                        if *signer_pubkey != verifier_data.enclave.enclave_signer {
                            return Err(
                                SbError::Message(
                                    "The provided verifier signer does not match the expected signer's pubkey"
                                )
                            );
                        }
                    }
                }
                verifier_enclave_signer
            }
            None =>
                FunctionResultValidatorSigner::Simulation(
                    Arc::new(verifier_data.enclave.enclave_signer)
                ),
        };

        let attestation_queue = AttestationQueueAccountData::fetch_async(
            &rpc,
            verifier_data.attestation_queue
        ).await?;

        Ok(
            FunctionResultValidator::new(
                client,
                rpc.clone(),
                payer,
                verifier_enclave_signer,
                &(FunctionResultValidatorInitAccounts {
                    verifier,
                    attestation_queue: verifier_data.attestation_queue,
                    queue_authority: attestation_queue.authority,
                    reward_receiver: reward_receiver.unwrap_or_default(),
                }),
                quote_verify_fn,
                cache
            )
        )
    }

    pub async fn load_from_cluster(
        cluster: Cluster,
        payer: Arc<Keypair>,
        verifier: Pubkey,
        verifier_enclave_signer: Option<FunctionResultValidatorSigner>,
        reward_receiver: Option<Pubkey>,
        quote_verify_fn: impl (Fn(&[u8], i64) -> bool) + 'static + Send + Sync,
        cache: Option<FunctionResultValidatorCache>
    ) -> Result<Self, SbError> {
        let client = AnchorClient::new_with_options(
            cluster,
            payer.clone(),
            CommitmentConfig::processed()
        );

        Self::load(
            Arc::new(RwLock::new(client)),
            payer,
            verifier,
            verifier_enclave_signer,
            reward_receiver,
            quote_verify_fn,
            cache
        ).await
    }

    /// Whether the validator is in production mode and is ready to sign and send transactions.
    pub fn is_production(&self) -> bool {
        matches!(&self.verifier_enclave_signer, FunctionResultValidatorSigner::Production(_))
    }

    /// Whether the validator is in simulation mode and is ready to validate function requests.
    pub fn is_simulation(&self) -> bool {
        matches!(&self.verifier_enclave_signer, FunctionResultValidatorSigner::Simulation(_))
    }

    /// Check if the verifier_enclave_keypair is present so we can sign and send transactions.
    async fn get_verifier_enclave_signer(&self) -> Result<Arc<Keypair>, SbError> {
        match &self.verifier_enclave_signer {
            FunctionResultValidatorSigner::Production(keypair) => {
                // Kind of ugly but we re-create the keypair so we dont need to always await the lock
                let kp = keypair.read().await;
                let kp2 = Keypair::from_bytes(&kp.to_bytes()).unwrap();
                Ok(Arc::new(kp2))
            }
            _ =>
                Err(
                    SbError::Message(
                        "FunctionResultValidator is in simulation mode - please provide the verifier_enclave_keypair in order to process and send any transactions on behalf of the verifier oracle"
                    )
                ),
        }
    }

    async fn get_verifier_enclave_pubkey(&self) -> Arc<Pubkey> {
        match &self.verifier_enclave_signer {
            FunctionResultValidatorSigner::Simulation(pubkey) => pubkey.clone(),
            FunctionResultValidatorSigner::Production(keypair) => {
                Arc::new(keypair.read().await.pubkey())
            }
        }
    }

    /// The entrypoint for the QVN. Verifies a FunctionResult and returns a transaction signature if successful.
    pub async fn process(&self, function_result: &FunctionResult) -> Result<Signature, SbError> {
        let (signature, _error_code) = match self.validate(function_result).await {
            Ok(mut tx) => {
                // Send transaction
                // By this point it should have passed simulation and signature verification
                (self.send_txn(&mut tx).await.unwrap(), None)
            }
            Err(err) => {
                let function_pubkey = Pubkey::try_from_slice(
                    function_result.fn_key().unwrap_or_default().as_slice()
                ).unwrap_or_default();
                // Try to catch error and send transaction

                let error_code = match err {
                    SbError::FunctionResultFailoverError(error_code, e) => {
                        println!(
                            "[QVN]({}) Failed to send transaction, sending fallback txn with error code ({}).\n{:?}",
                            function_pubkey,
                            error_code,
                            e
                        );
                        Some(error_code)
                    }
                    SbError::FunctionResultNonRetryableError(e) => {
                        println!("[QVN]({}) Failed with non-retryable error.\n{:?}", function_pubkey, e);
                        None
                    }
                    _ => {
                        println!("[QVN]({}) No error handler found for error {:?}", function_pubkey, err);
                        Some(211) // improve this
                    }
                };

                if let Some(error_code) = error_code {
                    let mut tx = self
                        .produce_failover_tx(function_result, Some(error_code)).await
                        .unwrap();
                    (self.send_txn(&mut tx).await.unwrap(), Some(error_code))
                } else {
                    (Signature::default(), None)
                }
            }
        };

        Ok(signature)
    }

    /// Validate the function result and return any errors
    pub async fn validate(&self, function_result: &FunctionResult) -> Result<Transaction, SbError> {
        let error_code = function_result.error_code();
        // if error_code < 200 {
        //     println!("[QVN] Function Result\n{:?}", function_result);
        // }

        // 1. Validate the [`FunctionResult`] is for the Solana chain
        let solana_function_result = if
            let Ok(switchboard_common::ChainResultInfo::Solana(chain_result_info)) =
                function_result.chain_result_info()
        {
            chain_result_info
        } else {
            return Err(SbError::InvalidChain);
        };

        let function_pubkey = Pubkey::try_from_slice(
            function_result.fn_key().unwrap().as_slice()
        ).unwrap();
        let function_enclave_signer = Pubkey::try_from_slice(function_result.signer()).unwrap();

        // If the error_code is 200 or greater, we can skip the quote verification and just rebuild the tx ourselves
        if error_code >= 200 {
            return Ok(self.produce_failover_tx(function_result, Some(error_code)).await.unwrap());
        }

        // 2. Build and verify the transaction
        let (tx, request_type, untrusted_verify_idx) = self.build_and_verify_txn(
            &solana_function_result
        ).await?;
        let untrusted_verify_ix = &tx.message.instructions[untrusted_verify_idx as usize];
        let verify_param_bytes = untrusted_verify_ix.data[8..].to_vec();
        let untrusted_params = FunctionResultValidator::get_params(
            &request_type,
            verify_param_bytes.clone()
        )?;

        // 3. Parse the quote
        let quote_bytes = function_result.quote_bytes();
        let quote = sgx_quote::Quote::parse(&quote_bytes).map_err(|_| SbError::QuoteParseError)?;

        // 4. Verify the MrEnclave matches the quote
        if untrusted_params.mr_enclave != quote.isv_report.mrenclave {
            println!("[QVN] {:?}: mr_enclave mismatch", function_pubkey);
            // Should we exit here or let it continue and handle the error on-chain?
            return Err(SbError::MrEnclaveMismatch);
        }

        // 6. Verify the SGX quote
        // 6a. Verify the report keyhash matches the enclave generated signer
        let report_keyhash = &quote.isv_report.report_data[..32];
        if report_keyhash != Sha256::digest(function_enclave_signer.to_bytes()).as_slice() {
            println!(
                "[QVN] [{:?}]: keyhash mismatch: {:?} vs {:?}",
                function_pubkey,
                report_keyhash,
                Sha256::digest(function_enclave_signer.to_bytes()).as_slice()
            );

            return Err(
                SbError::FunctionResultFailoverError(
                    200,
                    Arc::new(SbError::FunctionResultIxError("IllegalEnclaveSigner"))
                )
            );
        }

        // 6b. Verify the SGX quote cryptography
        if !(self.quote_verify_fn)(quote_bytes, untrusted_params.observed_time) {
            return Err(
                SbError::FunctionResultFailoverError(
                    201,
                    Arc::new(SbError::FunctionResultError("InvalidQuote"))
                )
            );
        }

        // early exit if the error code is greater than 0, quote is empty, and enclave_signer is null

        // 5. Build trusted verify ixn and compare with untrusted_verify_ixn
        let trusted_ix = self.build_trusted_verify_ixn(
            &function_pubkey,
            &function_enclave_signer,
            &request_type,
            &untrusted_params
        ).await?;
        if trusted_ix.data != untrusted_verify_ix.data {
            println!("[QVN] Left-data: {:?}", trusted_ix.data);
            println!("[QVN] Right-data: {:?}", untrusted_verify_ix.data);
            return Err(
                SbError::FunctionResultFailoverError(
                    200,
                    Arc::new(SbError::FunctionResultIxError("IllegalVerifyInstructionData"))
                )
            );
        }
        let mut untrusted_accounts = vec![];
        for account_idx in &untrusted_verify_ix.accounts {
            if (*account_idx as usize) >= tx.message.account_keys.len() {
                return Err(SbError::FunctionResultIxError("AccountsMismatch"));
            }
            untrusted_accounts.push(tx.message.account_keys[*account_idx as usize]);
        }
        let trusted_accounts: Vec<Pubkey> = trusted_ix.accounts
            .iter()
            .map(|x| x.pubkey)
            .collect();

        // Some verify accounts can be optional where the pubkey is set to the attestation program ID. So we
        // need to account for that.
        // TODO: add test case for this
        if trusted_accounts.len() != untrusted_accounts.len() {
            println!("[QVN] {}: LEFT: {:#?}", function_pubkey, trusted_accounts);
            println!("[QVN] {}: RIGHT: {:#?}", function_pubkey, untrusted_accounts);
            return Err(
                SbError::FunctionResultFailoverError(
                    200,
                    Arc::new(SbError::FunctionResultIxError("IllegalVerifyAccounts"))
                )
            );
        }
        for (i, trusted_account) in trusted_accounts.iter().enumerate() {
            let untrusted_account = untrusted_accounts.get(i).unwrap();
            if
                untrusted_account != trusted_account &&
                untrusted_account != &SWITCHBOARD_ATTESTATION_PROGRAM_ID
            {
                println!("[QVN] {}: LEFT: {:#?}", function_pubkey, trusted_accounts);
                println!("[QVN] {}: RIGHT: {:#?}", function_pubkey, untrusted_accounts);
                return Err(
                    SbError::FunctionResultFailoverError(
                        200,
                        Arc::new(SbError::FunctionResultIxError("IllegalVerifyAccounts"))
                    )
                );
            }
        }

        // 7. Simulate the transaction and build any fail over logic
        // TODO: should we do this in production? Probably not
        let replace_blockhash = tx.message.recent_blockhash == Default::default();
        match
            self.rpc.simulate_transaction_with_config(&tx, RpcSimulateTransactionConfig {
                sig_verify: false,
                replace_recent_blockhash: replace_blockhash,
                commitment: Some(CommitmentConfig::processed()),
                encoding: None,
                accounts: None,
                min_context_slot: None,
            }).await
        {
            Ok(resp) => {
                // println!("[QVN] SimulationResponse: {:?}", resp);

                // TODO: catch common simulation errors and figure out how to convert to our Anchor error
                if resp.value.err.is_some() {
                    println!("[QVN] SimulationErrors: {:?}", resp.value.err.unwrap());

                    return Err(
                        SbError::FunctionResultFailoverError(
                            210, // improve the handling here
                            Arc::new(SbError::Message("UnknownSimulationError"))
                        )
                    );
                }
            }
            Err(e) => {
                println!("[QVN] SimulationError: {:?}", e);

                if let Some(TransactionError::InstructionError(idx, e)) = e.get_transaction_error() {
                    if idx > 0 {
                        return Err(
                            SbError::FunctionResultFailoverError(
                                SbFunctionError::CallbackError.as_u8(),
                                Arc::new(e)
                            )
                        );
                    }
                }

                return Err(
                    SbError::FunctionResultFailoverError(
                        210, // improve the handling here
                        Arc::new(e)
                    )
                );
            }
        }

        // 8. Return the partially signed txn that is ready to send
        // If we avoid signing inside this function, then we do NOT need the verifier keypairs to
        // validate the function result

        Ok(tx)
    }

    /// Retrieve the function's SwitchboardWallet from the cache if updated within the timeout, or fetch from on-chain RPC.
    ///
    /// # Arguments
    ///
    /// * `function_pubkey` - A `Pubkey` for the given function account.
    ///
    /// # Returns
    ///
    /// Returns a `Result` containing the `Pubkey` of the function's SwitchboardWallet if successful, or an `SbError` if an error occurred.
    async fn get_function_escrow_wallet(&self, function_pubkey: Pubkey) -> Result<Pubkey, SbError> {
        if let Some(timeout) = self.cache.timeout {
            let timeout: i64 = timeout.try_into().unwrap_or_default();
            self.cache.function_escrow_wallet.remove_if(&function_pubkey, |_k, entry| {
                unix_timestamp() - entry.timestamp > timeout
            });
        }

        if
            let Some(function_escrow_cache_entry) = self.cache.function_escrow_wallet.get(
                &function_pubkey
            )
        {
            return Ok(function_escrow_cache_entry.pubkey);
        }

        let function_data = FunctionAccountData::fetch_async(
            &self.rpc,
            function_pubkey
        ).await.unwrap();

        self.cache.function_escrow_wallet.insert(function_pubkey, CacheEntry {
            pubkey: function_data.escrow_wallet,
            timestamp: unix_timestamp(),
        });

        Ok(function_data.escrow_wallet)
    }

    /// Retrieve the function routine's SwitchboardWallet from the cache if updated within the timeout, or fetch from on-chain RPC.
    ///
    /// # Arguments
    ///
    /// * `routine_pubkey` - A `Pubkey` for the given function routine account.
    ///
    /// # Returns
    ///
    /// Returns a `Result` containing the `Pubkey` of the function routine's SwitchboardWallet if successful, or an `SbError` if an error occurred.
    async fn get_routine_escrow_wallet(&self, routine_pubkey: Pubkey) -> Result<Pubkey, SbError> {
        if let Some(timeout) = self.cache.timeout {
            let timeout: i64 = timeout.try_into().unwrap_or_default();
            self.cache.routine_escrow_wallet.remove_if(&routine_pubkey, |_k, entry| {
                unix_timestamp() - entry.timestamp > timeout
            });
        }

        if
            let Some(routine_escrow_cache_entry) = self.cache.routine_escrow_wallet.get(
                &routine_pubkey
            )
        {
            return Ok(routine_escrow_cache_entry.pubkey);
        }

        let routine_data = FunctionRoutineAccountData::fetch_async(
            &self.rpc,
            routine_pubkey
        ).await.unwrap();

        self.cache.routine_escrow_wallet.insert(routine_pubkey, CacheEntry {
            pubkey: routine_data.escrow_wallet,
            timestamp: unix_timestamp(),
        });

        Ok(routine_data.escrow_wallet)
    }

    /// Sign the transaction with the payer and verifier_enclave_signer keypair and send to the network
    async fn send_txn(&self, tx: &mut Transaction) -> Result<Signature, SbError> {
        let verifier_enclave_keypair = self.get_verifier_enclave_signer().await?;

        let recent_blockhash = tx.message.recent_blockhash;
        let keypairs = &[&*self.payer, &*verifier_enclave_keypair];

        tx.try_partial_sign(keypairs, recent_blockhash).map_err(|e| SbError::CustomError {
            message: "Failed to sign the Solana transaction with the payer and verifier_enclave_signer keypair".to_string(),
            source: Arc::new(e),
        })?;

        match self.rpc.send_transaction(tx).await {
            Ok(signature) => {
                println!("[QVN] Sent transaction with signature {:?}", signature);
                Ok(signature)
            }
            Err(e) => {
                println!("[QVN] Failed to send transaction: {:?}", e);
                Err(SbError::CustomError {
                    message: "Failed to send transaction".to_string(),
                    source: Arc::new(e),
                })
            }
        }
    }

    async fn build_function_verify_ix(
        &self,
        function: Pubkey,
        enclave_signer: Option<Pubkey>,
        params: FunctionVerifyParams
    ) -> Result<Instruction, SbError> {
        let verifier_accounts = self.get_verify_accounts().await;

        let function_escrow = self.get_function_escrow_wallet(function).await?;

        let ix = FunctionVerify::build_ix(
            &(FunctionVerifyAccounts {
                function,
                function_enclave_signer: enclave_signer.unwrap_or(
                    verifier_accounts.verifier_enclave_signer
                ),
                function_escrow,
                verifier: verifier_accounts.verifier,
                verifier_enclave_signer: verifier_accounts.verifier_enclave_signer,
                reward_receiver: verifier_accounts.reward_receiver,
                attestation_queue: verifier_accounts.attestation_queue,
                queue_authority: verifier_accounts.queue_authority,
            }),
            &params
        )?;

        Ok(ix)
    }

    async fn build_request_verify_ix(
        &self,
        function: Pubkey,
        request: Pubkey,
        enclave_signer: Option<Pubkey>,
        params: FunctionRequestVerifyParams
    ) -> Result<Instruction, SbError> {
        let verifier_accounts = self.get_verify_accounts().await;

        let function_escrow = self.get_function_escrow_wallet(function).await?;
        let function_escrow_token_wallet = find_associated_token_address(
            &function_escrow,
            &NativeMint::ID
        );

        let ix = FunctionRequestVerify::build_ix(
            &(FunctionRequestVerifyAccounts {
                request,
                function_enclave_signer: enclave_signer.unwrap_or(
                    verifier_accounts.verifier_enclave_signer
                ),
                function,
                function_escrow_token_wallet: Some(function_escrow_token_wallet), // optional
                verifier: verifier_accounts.verifier,
                verifier_enclave_signer: verifier_accounts.verifier_enclave_signer,
                reward_receiver: verifier_accounts.reward_receiver,
                attestation_queue: verifier_accounts.attestation_queue,
                queue_authority: verifier_accounts.queue_authority,
            }),
            &params
        )?;

        Ok(ix)
    }

    async fn build_routine_verify_ix(
        &self,
        function: Pubkey,
        routine: Pubkey,
        enclave_signer: Option<Pubkey>,
        params: FunctionRoutineVerifyParams
    ) -> Result<Instruction, SbError> {
        let verifier_accounts = self.get_verify_accounts().await;

        let function_escrow = self.get_function_escrow_wallet(function).await?;
        let function_escrow_token_wallet = find_associated_token_address(
            &function_escrow,
            &NativeMint::ID
        );

        let routine_escrow = self.get_routine_escrow_wallet(routine).await?;

        let ix = FunctionRoutineVerify::build_ix(
            &(FunctionRoutineVerifyAccounts {
                routine,
                escrow_wallet: routine_escrow,
                function_enclave_signer: enclave_signer.unwrap_or(
                    verifier_accounts.verifier_enclave_signer
                ),
                function,
                function_escrow_token_wallet: Some(function_escrow_token_wallet), // optional
                verifier: verifier_accounts.verifier,
                verifier_enclave_signer: verifier_accounts.verifier_enclave_signer,
                reward_receiver: verifier_accounts.reward_receiver,
                attestation_queue: verifier_accounts.attestation_queue,
                queue_authority: verifier_accounts.queue_authority,
            }),
            &params
        )?;

        Ok(ix)
    }

    /// Produce the oracle failover transaction if the FunctionResult validation returned any errors
    async fn produce_failover_tx(
        &self,
        function_result: &FunctionResult,
        error_code: Option<u8>
    ) -> Result<Transaction, SbError> {
        let mut function_result = function_result.clone();
        if let Some(error_code) = error_code {
            function_result.set_error_code(error_code);
        }

        let solana_function_result = if
            let Ok(switchboard_common::ChainResultInfo::Solana(chain_result_info)) =
                function_result.chain_result_info()
        {
            chain_result_info
        } else {
            SolanaFunctionResult::default()
        };

        let function = Pubkey::try_from_slice(
            function_result.fn_key().unwrap().as_slice()
        ).unwrap();

        let timestamp = unix_timestamp();
        let next_allowed_timestamp = timestamp + 30;

        let verify_ixn: Instruction = match solana_function_result {
            // TODO: implement V0 correctly so it can handle function_verify and function_request_verify
            SolanaFunctionResult::V0(_) => {
                self.build_function_verify_ix(function, None, FunctionVerifyParams {
                    observed_time: timestamp,
                    next_allowed_timestamp,
                    error_code: function_result.error_code(),
                    mr_enclave: [0; 32],
                }).await?
            }
            SolanaFunctionResult::V1(v) =>
                match v.request_type {
                    SolanaFunctionRequestType::Routine(routine_pubkey_bytes) => {
                        let routine_pubkey = Pubkey::try_from_slice(
                            &routine_pubkey_bytes[..]
                        ).unwrap();

                        self.build_routine_verify_ix(
                            function,
                            routine_pubkey,
                            None,
                            FunctionRoutineVerifyParams {
                                mr_enclave: [0; 32],
                                error_code: function_result.error_code(),
                                observed_time: timestamp,
                                next_allowed_timestamp: 0,
                                container_params_hash: [0u8; 32],
                            }
                        ).await?
                    }
                    SolanaFunctionRequestType::Request(request_pubkey_bytes) => {
                        let request_pubkey = Pubkey::try_from_slice(
                            &request_pubkey_bytes[..]
                        ).unwrap();

                        self.build_request_verify_ix(
                            function,
                            request_pubkey,
                            None,
                            FunctionRequestVerifyParams {
                                mr_enclave: [0; 32],
                                error_code: function_result.error_code(),
                                observed_time: timestamp,
                                request_slot: 0,
                                container_params_hash: [0u8; 32],
                            }
                        ).await?
                    }
                    SolanaFunctionRequestType::Function(_) => {
                        self.build_function_verify_ix(function, None, FunctionVerifyParams {
                            observed_time: timestamp,
                            next_allowed_timestamp,
                            error_code: function_result.error_code(),
                            mr_enclave: [0; 32],
                        }).await?
                    }
                }
        };

        let recent_blockhash = self.rpc.get_latest_blockhash().await.unwrap_or_default();
        // .map_err(|_| SbError::Message("NetworkErr"))?;

        let payer: Pubkey = signer_to_pubkey(self.payer.clone()).unwrap();

        let mut message = Message::new(&[verify_ixn], Some(&payer));
        message.recent_blockhash = recent_blockhash;

        Ok(Transaction::new_unsigned(message))
    }

    /// Build the transaction from the emitted serialized_tx Vec<u8> and perform the following validation:
    /// * Contains at least one instruction
    /// * First instruction has at least 8 bytes of data
    /// * First instruction is pointed at the Switchboard Attestation PID
    /// * First instruction is one of FunctionVerify, FunctionRoutineVerify, or FunctionRequestVerify
    /// * The verifier's payer and enclave_signer is not used in any other instructions
    async fn build_and_verify_txn(
        &self,
        solana_function_result: &SolanaFunctionResult
    ) -> Result<(Transaction, SolanaFunctionRequestType, u8), SbError> {
        let tx: Transaction = bincode
            ::deserialize(&solana_function_result.serialized_tx())
            .map_err(|_| {
                SbError::FunctionResultFailoverError(
                    200,
                    Arc::new(SbError::FunctionResultError("TransactionDeserializationError"))
                )
            })?;

        // Verify there is at least one instruction
        if tx.message.instructions.is_empty() {
            return Err(
                SbError::FunctionResultFailoverError(
                    200,
                    Arc::new(SbError::FunctionResultIxError("EmptyInstructions"))
                )
            );
        }

        let untrusted_verify_idx: u8 = 0;
        let untrusted_verify_ixn = &tx.message.instructions[untrusted_verify_idx as usize];

        if untrusted_verify_ixn.data.len() < 8 {
            return Err(
                SbError::FunctionResultFailoverError(
                    200,
                    Arc::new(SbError::FunctionResultIxError("MissingDiscriminator"))
                )
            );
        }

        // Verify the first ixn is pointed at the Switchboard Attestation PID
        let untrusted_verify_pid_idx = tx.message.account_keys
            .iter()
            .position(|&x| x == SWITCHBOARD_ATTESTATION_PROGRAM_ID);
        if
            untrusted_verify_pid_idx.is_none() ||
            (untrusted_verify_ixn.program_id_index as usize) != untrusted_verify_pid_idx.unwrap()
        {
            return Err(
                SbError::FunctionResultFailoverError(
                    200,
                    Arc::new(SbError::FunctionResultIxError("InvalidPid"))
                )
            );
        }

        let mut ixn_discriminator = [0u8; 8];
        ixn_discriminator.copy_from_slice(&untrusted_verify_ixn.data[0..8]);

        let request_type = match solana_function_result {
            // Derive the request type from the first ixns discriminator if missing
            SolanaFunctionResult::V0(_) =>
                (match ixn_discriminator {
                    FunctionVerify::DISCRIMINATOR =>
                        Ok(
                            SolanaFunctionRequestType::Function(
                                tx.message.account_keys[untrusted_verify_ixn.accounts[0] as usize]
                                    .to_bytes()
                                    .to_vec()
                            )
                        ),
                    FunctionRequestVerify::DISCRIMINATOR =>
                        Ok(
                            SolanaFunctionRequestType::Request(
                                tx.message.account_keys[untrusted_verify_ixn.accounts[0] as usize]
                                    .to_bytes()
                                    .to_vec()
                            )
                        ),
                    FunctionRoutineVerify::DISCRIMINATOR =>
                        Ok(
                            SolanaFunctionRequestType::Routine(
                                tx.message.account_keys[untrusted_verify_ixn.accounts[0] as usize]
                                    .to_bytes()
                                    .to_vec()
                            )
                        ),
                    _ =>
                        Err(
                            SbError::FunctionResultFailoverError(
                                200,
                                Arc::new(SbError::FunctionResultIxError("InvalidInstructionData"))
                            )
                        ),
                })?,
            // 1. Verify the ixn discriminator
            // 2. Verify the inner pubkey is correctly set
            SolanaFunctionResult::V1(v1) =>
                match &v1.request_type {
                    SolanaFunctionRequestType::Routine(routine_pubkey_bytes) => {
                        if ixn_discriminator != FunctionRoutineVerify::DISCRIMINATOR {
                            return Err(SbError::FunctionResultInvalidData);
                        }
                        if
                            routine_pubkey_bytes !=
                            &tx.message.account_keys[untrusted_verify_ixn.accounts[0] as usize]
                                .to_bytes()
                                .to_vec()
                        {
                            return Err(SbError::FunctionResultInvalidData);
                        }
                        v1.request_type.clone()
                    }
                    SolanaFunctionRequestType::Request(request_pubkey_bytes) => {
                        if ixn_discriminator != FunctionRequestVerify::DISCRIMINATOR {
                            return Err(SbError::FunctionResultInvalidData);
                        }
                        if
                            request_pubkey_bytes !=
                            &tx.message.account_keys[untrusted_verify_ixn.accounts[0] as usize]
                                .to_bytes()
                                .to_vec()
                        {
                            return Err(SbError::FunctionResultInvalidData);
                        }
                        v1.request_type.clone()
                    }
                    SolanaFunctionRequestType::Function(function_pubkey_bytes) => {
                        if ixn_discriminator != FunctionVerify::DISCRIMINATOR {
                            return Err(SbError::FunctionResultInvalidData);
                        }
                        if
                            function_pubkey_bytes !=
                            &tx.message.account_keys[untrusted_verify_ixn.accounts[0] as usize]
                                .to_bytes()
                                .to_vec()
                        {
                            return Err(SbError::FunctionResultInvalidData);
                        }
                        v1.request_type.clone()
                    }
                }
        };

        // validate the verifier_enclave_signer and payer are not used in any downstream ixns
        if tx.message.instructions.len() > 1 {
            let verifier_enclave_signer = *self.get_verifier_enclave_pubkey().await;
            let enclave_signer_idx = tx.message.account_keys
                .iter()
                .position(|&x| x == verifier_enclave_signer);
            let payer_idx = tx.message.account_keys.iter().position(|&x| x == self.payer.pubkey());
            for ix in &tx.message.instructions[1..] {
                for account_idx in &ix.accounts {
                    if Some(*account_idx as usize) == enclave_signer_idx {
                        return Err(SbError::FunctionResultIllegalAccount);
                    }
                    if Some(*account_idx as usize) == payer_idx {
                        return Err(SbError::FunctionResultIllegalAccount);
                    }
                }
            }
        }

        Ok((tx, request_type, untrusted_verify_idx))
    }

    /// Deserialize the verify instructions parameters and return a cleaned up version of the params based on the request type
    fn get_params(
        request_type: &SolanaFunctionRequestType,
        verify_param_bytes: Vec<u8>
    ) -> Result<FunctionValidatorVerifyParams, SbError> {
        match request_type {
            SolanaFunctionRequestType::Routine(_) => {
                let params = FunctionRoutineVerifyParams::deserialize(
                    &mut verify_param_bytes.as_slice()
                ).map_err(|_e| {
                    SbError::FunctionResultFailoverError(
                        200,
                        Arc::new(SbError::FunctionResultIxError("InvalidInstructionData"))
                    )
                })?;

                Ok(FunctionValidatorVerifyParams {
                    mr_enclave: params.mr_enclave,
                    error_code: params.error_code,
                    observed_time: params.observed_time,
                    container_params_hash: params.container_params_hash,
                    next_allowed_timestamp: params.next_allowed_timestamp,
                    ..Default::default()
                })
            }
            SolanaFunctionRequestType::Request(_) => {
                let params = FunctionRequestVerifyParams::deserialize(
                    &mut verify_param_bytes.as_slice()
                ).map_err(|_e| {
                    SbError::FunctionResultFailoverError(
                        200,
                        Arc::new(SbError::FunctionResultIxError("InvalidInstructionData"))
                    )
                })?;

                Ok(FunctionValidatorVerifyParams {
                    mr_enclave: params.mr_enclave,
                    error_code: params.error_code,
                    observed_time: params.observed_time,
                    container_params_hash: params.container_params_hash,
                    request_slot: params.request_slot,
                    ..Default::default()
                })
            }
            SolanaFunctionRequestType::Function(_) => {
                let params = FunctionVerifyParams::deserialize(
                    &mut verify_param_bytes.as_slice()
                ).map_err(|_e| {
                    SbError::FunctionResultFailoverError(
                        200,
                        Arc::new(SbError::FunctionResultIxError("InvalidInstructionData"))
                    )
                })?;

                Ok(FunctionValidatorVerifyParams {
                    mr_enclave: params.mr_enclave,
                    error_code: params.error_code,
                    observed_time: params.observed_time,
                    next_allowed_timestamp: params.next_allowed_timestamp,
                    ..Default::default()
                })
            }
        }
    }

    /// Return the accounts used by this verifier to verify the function result
    async fn get_verify_accounts(&self) -> FunctionResultValidatorAccounts {
        FunctionResultValidatorAccounts {
            verifier: *self.verifier,
            verifier_enclave_signer: *self.get_verifier_enclave_pubkey().await,
            payer: self.payer.pubkey(),
            reward_receiver: *self.reward_receiver,
            attestation_queue: *self.attestation_queue,
            queue_authority: *self.queue_authority,
        }
    }

    /// Build a new version of the verify ixn for basic sanity checking
    async fn build_trusted_verify_ixn(
        &self,
        function_pubkey: &Pubkey,
        function_enclave_signer: &Pubkey,
        request_type: &SolanaFunctionRequestType,
        untrusted_params: &FunctionValidatorVerifyParams
    ) -> Result<Instruction, SbError> {
        let trusted_verify_ixn: Instruction = match &request_type {
            SolanaFunctionRequestType::Routine(routine_pubkey_bytes) => {
                self.build_routine_verify_ix(
                    *function_pubkey,
                    Pubkey::try_from_slice(&routine_pubkey_bytes[..]).unwrap(),
                    Some(*function_enclave_signer),
                    FunctionRoutineVerifyParams {
                        observed_time: untrusted_params.observed_time,
                        next_allowed_timestamp: untrusted_params.next_allowed_timestamp,
                        error_code: untrusted_params.error_code,
                        mr_enclave: untrusted_params.mr_enclave,
                        container_params_hash: untrusted_params.container_params_hash,
                    }
                ).await?
            }
            SolanaFunctionRequestType::Request(request_pubkey_bytes) => {
                self.build_request_verify_ix(
                    *function_pubkey,
                    Pubkey::try_from_slice(&request_pubkey_bytes[..]).unwrap(),
                    Some(*function_enclave_signer),
                    FunctionRequestVerifyParams {
                        mr_enclave: untrusted_params.mr_enclave,
                        error_code: untrusted_params.error_code,
                        observed_time: untrusted_params.observed_time,
                        container_params_hash: untrusted_params.container_params_hash,

                        request_slot: untrusted_params.request_slot,
                    }
                ).await?
            }
            SolanaFunctionRequestType::Function(_) => {
                self.build_function_verify_ix(
                    *function_pubkey,
                    Some(*function_enclave_signer),
                    FunctionVerifyParams {
                        mr_enclave: untrusted_params.mr_enclave,
                        error_code: untrusted_params.error_code,
                        observed_time: untrusted_params.observed_time,
                        next_allowed_timestamp: untrusted_params.next_allowed_timestamp,
                    }
                ).await?
            }
        };

        Ok(trusted_verify_ixn)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::str::FromStr;
    use tokio::sync::OnceCell;

    // lazy loaded validator, having trouble using this with anchor28 - runtime crashing after async closure exits
    static VALIDATOR: OnceCell<FunctionResultValidator> = OnceCell::const_new();
    static FUNCTION: OnceCell<Pubkey> = OnceCell::const_new();

    // 6vLX2GC3FQ6HtXe5K2b3CYePToB7bdCHQs6nPEFwg6bH
    const DEMO_FUNCTION_PUBKEY_BYTES: [u8; 32] = [
        87, 244, 73, 65, 67, 23, 129, 192, 3, 231, 155, 123, 4, 35, 131, 151, 109, 104, 41, 161,
        81, 238, 54, 71, 208, 241, 158, 58, 108, 158, 156, 240,
    ];

    /// Build a buffer from a valid quote and replace the mrenclave and report data with the provided params
    fn build_quote_buffer(enclave_signer: &Keypair, mrenclave: [u8; 32]) -> Vec<u8> {
        let mut quote_buffer = [0u8; 1456];

        // First we copy from a valid quote so we start with some good data
        let raw_sgx_quote_bytes = include_bytes!("../../fixtures/v2_quote.bin");
        quote_buffer[0..1456].copy_from_slice(&raw_sgx_quote_bytes[0..1456]);

        // Set the mrenclave
        quote_buffer[112..144].copy_from_slice(&mrenclave);

        // Set the report data
        quote_buffer[368..400].copy_from_slice(
            Sha256::digest(enclave_signer.pubkey().to_bytes()).as_slice()
        );

        // TODO: sign the report and add the signature so we can fully verify the quote if we need to

        quote_buffer.to_vec()
    }

    // Async getter for our OnceLocked validator
    async fn get_devnet_function_result_validator() -> &'static FunctionResultValidator {
        VALIDATOR.get_or_init(|| async {
            // We dont do any signature verification inside the validate function so these can be dummy keypairs
            let payer = load_keypair_fs("/Users/gally/.config/solana/id.json").unwrap();

            // Devnet verifier oracle
            // let accounts = FunctionResultValidatorInitAccounts {
            //     verifier_pubkey: Pubkey::from_str("FT41PAvhJj7YqQwuALeSr2PDh7kEub2wb9Ve64jPjDXk")
            //         .unwrap(),
            //     attestation_queue: Pubkey::from_str("CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE")
            //         .unwrap(),
            //     queue_authority: Pubkey::from_str("2KgowxogBrGqRcgXQEmqFvC3PGtCu66qERNJevYW8Ajh")
            //         .unwrap(),
            //     reward_receiver: Pubkey::from_str("CRXGEGMz4RoRyjXhktMp7SzkcFLV3uevZcr2yCnnWpBt")
            //         .unwrap(),
            // };

            // TODO: load this using the env variable RPC_URL
            let cluster = Cluster::from_str(
                "https://api.devnet.solana.com"
            ).unwrap_or(Cluster::Devnet);

            let client = AnchorClient::new_with_options(
                cluster,
                payer.clone(),
                CommitmentConfig::processed()
            );
            let program = get_attestation_program(&client).unwrap();

            let rpc = Arc::new(program.async_rpc());

            let bootstrapped_queue = BootstrappedAttestationQueue::get_or_create_from_seed(
                &rpc,
                payer.clone(),
                None,
                None
            ).await.unwrap();
            let accounts = FunctionResultValidatorInitAccounts {
                verifier: bootstrapped_queue.verifier,
                attestation_queue: bootstrapped_queue.attestation_queue,
                queue_authority: bootstrapped_queue.queue_authority,
                reward_receiver: Pubkey::from_str(
                    "CRXGEGMz4RoRyjXhktMp7SzkcFLV3uevZcr2yCnnWpBt"
                ).unwrap(),
            };

            let function_pubkey = Pubkey::from(DEMO_FUNCTION_PUBKEY_BYTES);

            // let verifier_data = VerifierAccountData::fetch(&program.rpc(), accounts.verifier_pubkey).unwrap();
            // let function_data = FunctionAccountData::fetch(&program.rpc(), function_pubkey).unwrap();

            // let (verifier_data_result, function_data_result) = tokio::join!(
            //     VerifierAccountData::fetch_async(&rpc, accounts.verifier_pubkey),
            //     FunctionAccountData::fetch_async(&rpc, function_pubkey)
            // );

            // let verifier_data = verifier_data_result.unwrap();
            // let function_data = function_data_result.unwrap();

            let verifier_data = VerifierAccountData::fetch_async(
                &rpc,
                accounts.verifier
            ).await.unwrap();
            let function_data = FunctionAccountData::fetch_async(
                &rpc,
                function_pubkey
            ).await.unwrap();

            let cache = FunctionResultValidatorCache {
                timeout: None,
                function_escrow_wallet: Arc::new(DashMap::with_capacity(10_000)),
                routine_escrow_wallet: Arc::new(DashMap::with_capacity(10_000)),
            };

            cache.function_escrow_wallet.insert(function_pubkey, CacheEntry {
                pubkey: function_data.escrow_wallet,
                timestamp: unix_timestamp(),
            });

            FunctionResultValidator::new(
                Arc::new(RwLock::new(client)),
                rpc,
                payer.clone(),
                FunctionResultValidatorSigner::Simulation(
                    Arc::new(verifier_data.enclave.enclave_signer)
                ),
                &accounts,
                |_quote_bytes, _observed_time| true,
                Some(cache)
            )
        }).await
    }

    /// Async getter for our dedicated function pubkey
    async fn get_function_pubkey() -> &'static Pubkey {
        FUNCTION.get_or_init(|| async {
            let validator = get_devnet_function_result_validator().await;

            let function_pubkey = FunctionAccountData::get_or_create_from_seed(
                &validator.rpc,
                validator.payer.clone(),
                *validator.attestation_queue,
                None,
                None
            ).await.unwrap();

            // let function_pubkey = Pubkey::from(DEMO_FUNCTION_PUBKEY_BYTES);
            function_pubkey
        }).await
    }

    /// Initialize the logger, the validator, and request an airdrop if the payer is out of funds
    async fn setup_test_validator() -> &'static FunctionResultValidator {
        let validator = get_devnet_function_result_validator().await;

        let payer_balance = validator.rpc.get_balance(&validator.payer.pubkey()).await.unwrap();

        if payer_balance == 0 {
            let sig = validator.rpc
                .request_airdrop(&validator.payer.pubkey(), 1_000_000_000).await
                .unwrap();
            println!("[Payer] Airdrop requested. Txn Signature: {}", sig);
        }

        validator
    }

    #[tokio::test]
    async fn test_function_validation() {
        // Setup logging
        if let Err(_e) = std::env::var("RUST_LOG") {
            std::env::set_var("RUST_LOG", "debug");
        }

        json_env_logger::try_init().unwrap();

        let validator = setup_test_validator().await;

        let function_enclave_signer = Keypair::new();

        let sgx_quote_bytes = build_quote_buffer(
            &function_enclave_signer,
            DEFAULT_FUNCTION_MR_ENCLAVE
        );
        let _sgx_quote = sgx_quote::Quote::parse(&sgx_quote_bytes[..]).unwrap();

        // let mut mr_enclave = [0u8; 32];
        // mr_enclave.copy_from_slice(sgx_quote.isv_report.mrenclave);

        // Function
        let function_pubkey = *get_function_pubkey().await;

        let timestamp = unix_timestamp();
        let next_allowed_timestamp = timestamp + 30;

        let function_verify_ix = validator
            .build_function_verify_ix(
                function_pubkey,
                Some(function_enclave_signer.pubkey()),
                FunctionVerifyParams {
                    mr_enclave: DEFAULT_FUNCTION_MR_ENCLAVE,
                    error_code: 0,
                    observed_time: timestamp,
                    next_allowed_timestamp,
                }
            ).await
            .unwrap();

        let ixs = vec![function_verify_ix];
        let message = Message::new(&ixs, Some(&validator.payer.pubkey()));
        let blockhash = validator.rpc.get_latest_blockhash().await.unwrap_or_default();
        let mut tx = solana_sdk::transaction::Transaction::new_unsigned(message);
        tx.partial_sign(&[&function_enclave_signer], blockhash);
        let serialized_tx = bincode::serialize(&tx).unwrap();

        let function_result = FunctionResult::V1(FunctionResultV1 {
            quote: sgx_quote_bytes.to_vec(),
            signer: function_enclave_signer.pubkey().to_bytes().to_vec(),
            signature: vec![],
            chain_result_info: ChainResultInfo::Solana(
                SolanaFunctionResult::V1(SolanaFunctionResultV1 {
                    serialized_tx,
                    fn_key: function_pubkey.to_bytes().to_vec(),
                    request_type: SolanaFunctionRequestType::Function(
                        function_pubkey.to_bytes().to_vec()
                    ),
                    request_hash: [0u8; 32].to_vec(),
                })
            ),
            error_code: 0,
        });

        let result = validator.validate(&function_result).await;
        // println!("[Function] Result: {:?}", result);
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_request_validation() {
        // Setup logging
        if let Err(_e) = std::env::var("RUST_LOG") {
            std::env::set_var("RUST_LOG", "debug");
        }

        json_env_logger::try_init().unwrap();

        let validator = setup_test_validator().await;

        let function_enclave_signer = Keypair::new();

        let sgx_quote_bytes = build_quote_buffer(
            &function_enclave_signer,
            DEFAULT_FUNCTION_MR_ENCLAVE
        );
        let _sgx_quote = sgx_quote::Quote::parse(&sgx_quote_bytes[..]).unwrap();

        // let mut mr_enclave = [0u8; 32];
        // mr_enclave.copy_from_slice(sgx_quote.isv_report.mrenclave);

        // Function
        let function_pubkey = *get_function_pubkey().await;

        let request_pubkey = FunctionRequestAccountData::get_or_create_from_seed(
            &validator.rpc,
            validator.payer.clone(),
            function_pubkey,
            None,
            None
        ).await.unwrap();

        // Meh, using devnet causes the oracles to respond which breaks the tests.
        // Need a dedicated queue for this.
        let request_data = FunctionRequestAccountData::fetch_async(
            &validator.rpc,
            request_pubkey
        ).await.unwrap();

        let verify_ix = validator
            .build_request_verify_ix(
                function_pubkey,
                request_pubkey,
                Some(function_enclave_signer.pubkey()),
                FunctionRequestVerifyParams {
                    mr_enclave: DEFAULT_FUNCTION_MR_ENCLAVE,
                    error_code: 0,
                    observed_time: unix_timestamp(),
                    request_slot: request_data.active_request.request_slot,
                    container_params_hash: request_data.container_params_hash,
                }
            ).await
            .unwrap();

        let ixs = vec![verify_ix];
        let message = Message::new(&ixs, Some(&validator.payer.pubkey()));
        let blockhash = validator.rpc.get_latest_blockhash().await.unwrap_or_default();
        let mut tx = solana_sdk::transaction::Transaction::new_unsigned(message);
        tx.partial_sign(&[&function_enclave_signer], blockhash);
        let serialized_tx = bincode::serialize(&tx).unwrap();

        let function_result = FunctionResult::V1(FunctionResultV1 {
            quote: sgx_quote_bytes.to_vec(),
            signer: function_enclave_signer.pubkey().to_bytes().to_vec(),
            signature: vec![],
            chain_result_info: ChainResultInfo::Solana(
                SolanaFunctionResult::V1(SolanaFunctionResultV1 {
                    serialized_tx,
                    fn_key: function_pubkey.to_bytes().to_vec(),
                    request_type: SolanaFunctionRequestType::Request(
                        request_pubkey.to_bytes().to_vec()
                    ),
                    request_hash: [0u8; 32].to_vec(),
                })
            ),
            error_code: 0,
        });

        let result = validator.validate(&function_result).await;
        // println!("[Request] Result: {:?}", result);
        assert!(result.is_ok());
    }
}

fn parse_mrenclave_hex(hex_str: &str) -> Result<[u8; 32], SbError> {
    let mut mrenclave = [0u8; 32];

    let hex_bytes = hex::decode(hex_str).map_err(|_e| SbError::Message("InvalidHex"))?;
    if hex_bytes.len() != 32 {
        return Err(SbError::Message("InvalidHex"));
    }

    mrenclave.copy_from_slice(&hex_bytes);
    Ok(mrenclave)
}

async fn print_function_verify_accounts(function_verify_ix: Instruction, rpc: Arc<RpcClient>) {
    let verify_ix_accounts: Vec<Pubkey> = function_verify_ix.accounts
        .clone()
        .iter()
        .map(|a| a.pubkey)
        .collect();

    println!("#1 {:<24}: {:?}", "Function", verify_ix_accounts.get(0).unwrap());
    println!("#2 {:<24}: {:?}", "FunctionEnclaveSigner", verify_ix_accounts.get(1).unwrap());
    println!("#3 {:<24}: {:?}", "Verifier", verify_ix_accounts.get(2).unwrap());
    println!("#4 {:<24}: {:?}", "VerifierEnclaveSigner", verify_ix_accounts.get(3).unwrap());
    println!("#5 {:<24}: {:?}", "VerifierPermission", verify_ix_accounts.get(4).unwrap());
    println!("#6 {:<24}: {:?}", "EscrowWallet", verify_ix_accounts.get(5).unwrap());
    println!("#7 {:<24}: {:?}", "EscrowTokenWallet", verify_ix_accounts.get(6).unwrap());
    println!("#8 {:<24}: {:?}", "Receiver", verify_ix_accounts.get(7).unwrap());
    println!("#9 {:<24}: {:?}", "Attestation Queue", verify_ix_accounts.get(8).unwrap());

    let account_infos = rpc.get_multiple_accounts(&verify_ix_accounts).await.unwrap();

    for (i, account) in account_infos.iter().enumerate() {
        // #2 and #4 are enclave generated keypairs and can be skipped
        if account.is_none() && i != 1 && i != 3 {
            println!("Account #{} is missing", i + 1);
        }
    }
}

// TODO: Create a way to initialize a BoostrappedAttestationQueue using the payer's secret key,
// some base seed, and a hash of the parameters. This will allow us to create a new queue for each
// config and easily build getter methods to retrieve them.
