use crate::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::message::Message;
use anchor_lang::solana_program::pubkey::Pubkey;
use anchor_lang::AnchorDeserialize;
use sgx_quote::Quote;
use solana_client::rpc_client::RpcClient;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_sdk::signer::keypair::Keypair;
use std::result::Result;
use std::str::FromStr;
use std::sync::Arc;

use switchboard_common::SolanaFunctionEnvironment;
use switchboard_common::{ChainResultInfo::Solana, SolanaFunctionResult};

/// An object containing the context to execute a Switchboard Function.
/// Inititlizing this object will load all required variables from the runtime
/// to execute and sign an output transaction to be verified and committed by
/// the switchboard network.
///
/// ```
/// use switchboard_solana::FunctionRunner;
///
/// let runner = FunctionRunner::from_env(None)?;
/// ```
#[derive(Clone)]
pub struct FunctionRunner {
    /// The type of Switchboard function being run.
    pub request_type: SolanaFunctionRequestType,
    /// The Solana RPC client to make rpc requests.
    pub client: Arc<RpcClient>,

    /// The enclave generated signer for this function run.
    signer_keypair: Arc<Keypair>,
    /// The pubkey of the enclave generated signer.
    pub signer: Pubkey,

    // required to run
    /// The FunctionAccount pubkey being run.
    pub function: Pubkey,
    /// The pubkey of the account that will pay for emitted transactions.
    pub payer: Pubkey,
    /// The VerifierAccount that will verify this function run.
    pub verifier: Pubkey,
    /// The VerifierAccount's specified reward receiver.
    pub reward_receiver: Pubkey,

    // can be manually populated from client if missing
    /// The hex encoded FunctionAccountData, used to speed up RPC calls.
    pub function_data: Option<Box<FunctionAccountData>>,
    /// The pubkey of the VerifierAccount's enclave signer.
    pub verifier_enclave_signer: Option<Pubkey>,
    pub queue_authority: Option<Pubkey>,

    // only used for routines
    pub function_routine_key: Option<Pubkey>,
    pub function_routine_data: Option<Box<FunctionRoutineAccountData>>,

    // only used for requests
    pub function_request_key: Option<Pubkey>,
    pub function_request_data: Option<Box<FunctionRequestAccountData>>,

    // convienence for building ixns
    /// The AttestationQueueAccount for this request.
    pub attestation_queue: Option<Pubkey>,
    /// The Switchboard State pubkey.
    pub switchboard_state: Pubkey,
    /// The Attestation program id.
    pub switchboard: Pubkey,
}

impl std::fmt::Display for FunctionRunner {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "SwitchboardFunctionRunner: url: {}, signer: {}, function: {}, verifier: {}",
            self.client.url(),
            self.signer,
            self.function,
            self.verifier,
        )
    }
}

impl FunctionRunner {
    /// Create a new FunctionRunner instance with a provided RPC client.
    pub fn new_with_client(client: RpcClient) -> Result<Self, SbError> {
        let signer_keypair = generate_signer();
        let signer = signer_to_pubkey(signer_keypair.clone())?;

        let env = SolanaFunctionEnvironment::parse()?;

        // required to run
        let function = Pubkey::from_str(&env.function_key).unwrap();
        let payer = Pubkey::from_str(&env.payer).unwrap();
        let verifier = Pubkey::from_str(&env.verifier).unwrap();
        let reward_receiver = Pubkey::from_str(&env.reward_receiver).unwrap();

        let mut attestation_queue: Option<Pubkey> = None;

        // can be manually populated from client if missing
        // let function_data: Option<Box<FunctionAccountData>> = if env.function_data.is_empty() {
            // None
        // } else {
            // match bytemuck::try_from_bytes::<FunctionAccountData>(
                // &hex::decode(env.function_data).unwrap_or_default(),
            // ) {
                // Ok(function_data) => {
                    // if function_data != &FunctionAccountData::default() {
                        // Some(Box::new(*function_data))
                    // } else {
                        // None
                    // }
                // }
                // Err(_) => None,
            // }
        // };
        let fn_hex = env.function_data;
        let fn_raw = hex::decode(fn_hex).unwrap();
        let function_data = Some(Box::new(*bytemuck::try_from_bytes::<FunctionAccountData>(&fn_raw).unwrap()));
        attestation_queue = Some(function_data.as_ref().unwrap().attestation_queue);

        let verifier_enclave_signer: Option<Pubkey> =
            parse_optional_pubkey(&env.verifier_enclave_signer);
        let queue_authority: Option<Pubkey> = parse_optional_pubkey(&env.queue_authority);

        // only used for routines
        let function_routine_key: Option<Pubkey> = parse_optional_pubkey(&env.function_routine_key);
        let function_routine_data: Option<Box<FunctionRoutineAccountData>> =
            if env.function_routine_data.is_empty() {
                None
            } else {
                match FunctionRoutineAccountData::try_from_slice(
                    &hex::decode(&env.function_routine_data).unwrap_or_default(),
                ) {
                    Ok(function_routine_data) => {
                        if attestation_queue.is_none() {
                            attestation_queue = Some(function_routine_data.attestation_queue);
                        }

                        Some(Box::new(function_routine_data))
                    }
                    Err(_) => None,
                }
            };

        // only used for requests
        let function_request_key: Option<Pubkey> = parse_optional_pubkey(&env.function_request_key);
        let function_request_data: Option<Box<FunctionRequestAccountData>> =
            if env.function_request_data.is_empty() {
                None
            } else {
                match FunctionRequestAccountData::try_from_slice(
                    &hex::decode(&env.function_request_data).unwrap_or_default(),
                ) {
                    Ok(function_request_data) => {
                        if attestation_queue.is_none() {
                            attestation_queue = Some(function_request_data.attestation_queue);
                        }

                        Some(Box::new(function_request_data))
                    }
                    Err(_) => None,
                }
            };

        let switchboard: Pubkey =
            load_env_pubkey("SWITCHBOARD").unwrap_or(SWITCHBOARD_ATTESTATION_PROGRAM_ID);

        let switchboard_state = AttestationProgramState::get_program_pda(Some(switchboard));

        // The type of Switchboard request being executed.
        let request_type: SolanaFunctionRequestType =
            if let Some(function_routine_key) = function_routine_key {
                SolanaFunctionRequestType::Routine(function_routine_key.to_bytes().into())
            } else if let Some(function_request_key) = function_request_key {
                SolanaFunctionRequestType::Request(function_request_key.to_bytes().into())
            } else {
                SolanaFunctionRequestType::Function(function.to_bytes().into())
            };

        Ok(Self {
            request_type,
            client: Arc::new(client),
            signer_keypair,
            signer,
            function,
            function_data,
            function_routine_key,
            function_routine_data,
            function_request_key,
            function_request_data,
            payer,
            verifier,
            reward_receiver,
            verifier_enclave_signer,
            queue_authority,
            attestation_queue,
            switchboard,
            switchboard_state,
        })
    }

    /// Create a new FunctionRunner from an RPC endpoint and commitment level.
    pub fn new(url: &str, commitment: Option<CommitmentConfig>) -> Result<Self, SbError> {
        Self::new_with_client(RpcClient::new_with_commitment(
            url,
            commitment.unwrap_or_default(),
        ))
    }

    /// Create a new FunctionRunner for a given cluster.
    pub fn new_from_cluster(
        cluster: Cluster,
        commitment: Option<CommitmentConfig>,
    ) -> Result<Self, SbError> {
        Self::new(cluster.url(), commitment)
    }

    /// Loads the FunctionRunner from runtime settings.
    pub fn from_env(commitment: Option<CommitmentConfig>) -> Result<Self, SbError> {
        let cluster =
            Cluster::from_str(&std::env::var("CLUSTER").unwrap_or("mainnet".to_string())).unwrap();
        Self::new_from_cluster(cluster, commitment)
    }

    pub fn is_scheduled_function(&self) -> bool {
        matches!(self.request_type, SolanaFunctionRequestType::Function(_))
    }

    pub fn is_routine(&self) -> bool {
        matches!(self.request_type, SolanaFunctionRequestType::Routine(_))
    }

    pub fn is_request(&self) -> bool {
        matches!(self.request_type, SolanaFunctionRequestType::Request(_))
    }

    /// Load the function parameters for the given function run.
    pub async fn load_params(&mut self) -> Result<Vec<u8>, SbError> {
        match self.request_type {
            SolanaFunctionRequestType::Routine(_) => {
                let routine = self.load_routine_data().await?;
                let params = routine.container_params.clone();

                if self.function_routine_data.is_none() {
                    self.function_routine_data = Some(routine);
                }

                Ok(params)
            }
            SolanaFunctionRequestType::Request(_) => {
                let request = self.load_request_data().await?;
                let params = request.container_params.clone();

                if self.function_request_data.is_none() {
                    self.function_request_data = Some(request);
                }

                Ok(params)
            }
            // TODO: deprecate this path
            SolanaFunctionRequestType::Function(_) => {
                let function_data = self.load_function_data().await?;
                let params = function_data.default_container_params.to_vec();

                if self.function_data.is_none() {
                    self.function_data = Some(function_data);
                }

                Ok(params)
            }
        }
    }

    /// Loads the parameters from the client and deserializes them into a given type using serde.
    ///
    /// # Example
    ///
    /// ```
    /// use switchboard_solana::client::FunctionRunner;
    ///
    /// #[derive(serde::Deserialize)]
    /// struct MyParams {
    ///     name: String,
    ///     age: u8,
    /// }
    ///
    /// async fn my_function() -> Result<(), switchboard_solana::SbError> {
    ///     let mut runner = FunctionRunner::new();
    ///     let params: MyParams = runner.load_serde_params().await?;
    ///     println!("Name: {}, Age: {}", params.name, params.age);
    ///     Ok(())
    /// }
    /// ```
    pub async fn load_serde_params<T: serde::de::DeserializeOwned>(
        &mut self,
    ) -> Result<T, SbError> {
        let bytes: Vec<u8> = self.load_params().await?;
        let decoded: T = serde_json::from_slice(&bytes[..])?;
        Ok(decoded)
    }

    /// Assert that a [`FunctionAccountData`] contains the generated MrEnclave in its config
    pub fn assert_mr_enclave(&self) -> Result<(), SbError> {
        // pub fn assert_mr_enclave(&self, quote: Option<Vec<u8>>) -> Result<(), SbError> {
        // let function_data = self.load_function_data().await?;
        // let quote_raw =
        //     quote.unwrap_or(Gramine::generate_quote(&self.signer.to_bytes()).unwrap_or_default());

        if let Some(function_data) = self.function_data.clone() {
            let quote_raw = Gramine::generate_quote(&self.signer.to_bytes()).unwrap_or_default();
            if let Ok(quote) = Quote::parse(&quote_raw) {
                let mr_enclave: MrEnclave = quote.isv_report.mrenclave.try_into().unwrap();
                if !function_data.mr_enclaves.contains(&mr_enclave) {
                    return Err(SbError::MrEnclaveMismatch);
                }
            }
        }
        Ok(())
    }

    /// Loads the queue authority provided by the QUEUE_AUTHORITY environment
    /// variable
    async fn load_queue_authority(
        &self,
        attestation_queue_pubkey: Pubkey,
    ) -> Result<Pubkey, SbError> {
        let queue_authority = self.queue_authority.unwrap_or_default();
        if queue_authority != Pubkey::default() {
            return Ok(queue_authority);
        }

        msg!(
            "QUEUE_AUTHORITY is missing - Fetching attestation_queue account {}",
            attestation_queue_pubkey
        );

        match AttestationQueueAccountData::fetch(&self.client, attestation_queue_pubkey) {
            Err(error) => Err(SbError::CustomMessage(format!(
                "failed to fetch attestation_queue {}: {}",
                attestation_queue_pubkey, error
            ))),
            Ok(attestation_queue) => Ok(attestation_queue.authority),
        }
    }

    /// Returns the associated token address for a given owner and mint.
    /// If the mint is not provided, the native SOL mint is used.
    pub fn get_associated_token_address(owner: Pubkey, mint: Option<Pubkey>) -> Pubkey {
        anchor_spl::associated_token::get_associated_token_address(
            &owner,
            &mint.unwrap_or(anchor_spl::token::spl_token::native_mint::ID),
        )
    }

    /// Loads the oracle signing key provided by the VERIFIER_ENCLAVE_SIGNER
    /// environment variable
    async fn load_verifier_signer(&self, verifier_pubkey: Pubkey) -> Result<Pubkey, SbError> {
        let verifier_enclave_signer = self.verifier_enclave_signer.unwrap_or_default();
        if verifier_enclave_signer != Pubkey::default() {
            return Ok(verifier_enclave_signer);
        }

        msg!(
            "VERIFIER_ENCLAVE_SIGNER is missing - Fetching verifier account {}",
            verifier_pubkey
        );

        match VerifierAccountData::fetch(&self.client, verifier_pubkey) {
            Err(error) => Err(SbError::CustomMessage(format!(
                "failed to fetch verifier {}: {}",
                verifier_pubkey, error
            ))),
            Ok(verifier_data) => Ok(verifier_data.enclave.enclave_signer),
        }
    }

    async fn build_verify_ixn(
        &self,
        mr_enclave: [u8; 32],
        error_code: u8,
    ) -> Result<Instruction, SbError> {
        match self.request_type {
            SolanaFunctionRequestType::Routine(_) => {
                self.build_fn_routine_verify_ixn(mr_enclave, error_code)
                    .await
            }
            SolanaFunctionRequestType::Request(_) => {
                self.build_fn_request_verify_ixn(mr_enclave, error_code)
                    .await
            }
            // TODO: deprecate this path
            SolanaFunctionRequestType::Function(_) => {
                self.build_fn_verify_ixn(mr_enclave, error_code).await
            }
        }
    }

    /// Generates a FunctionResult object to be emitted at the end of this
    /// function run. This function result will be used be the quote verification
    /// sidecar to verify the output was run inside the function's enclave
    /// and sign the transaction to send back on chain.
    pub async fn get_function_result(
        &self,
        mut ixs: Vec<Instruction>,
        error_code: u8,
    ) -> Result<FunctionResult, SbError> {
        // Generate the SGX quote from the enclave
        // TODO: should we set a flag if this is a simulation?
        let quote_raw = Gramine::generate_quote(&self.signer.to_bytes()).unwrap_or_default();
        let mut mr_enclave: MrEnclave = Default::default();
        if quote_raw.is_empty() {
            println!("WARNING!: Reading from enclave failed! If you are testing, this is expected behavior.");
        } else {
            let quote = Quote::parse(&quote_raw).unwrap();
            mr_enclave = quote.isv_report.mrenclave.try_into().unwrap();
        }

        // Build serialized transaction
        let verify_ixn: Instruction = self.build_verify_ixn(mr_enclave, error_code).await?;
        ixs.insert(0, verify_ixn);
        let message = Message::new(&ixs, Some(&self.payer));
        let blockhash = self.client.get_latest_blockhash().unwrap_or_default();
        let mut tx = solana_sdk::transaction::Transaction::new_unsigned(message);
        tx.partial_sign(&[self.signer_keypair.as_ref()], blockhash);
        let serialized_tx = bincode::serialize(&tx).unwrap();

        let request_hash = if self.is_request() {
            solana_program::hash::hash(
                &self
                    .function_request_data
                    .as_ref()
                    .unwrap()
                    .container_params,
            )
            .to_bytes()
            .to_vec()
        } else if self.is_routine() {
            solana_program::hash::hash(
                &self
                    .function_routine_data
                    .as_ref()
                    .unwrap()
                    .container_params,
            )
            .to_bytes()
            .to_vec()
        } else {
            let function_data = self.load_function_data().await?;
            solana_program::hash::hash(&function_data.as_ref().default_container_params)
                .to_bytes()
                .to_vec()
        };

        Ok(FunctionResult::V1(FunctionResultV1 {
            quote: quote_raw,
            signer: self.signer.to_bytes().into(),
            signature: vec![],
            chain_result_info: Solana(SolanaFunctionResult::V1(SolanaFunctionResultV1 {
                fn_key: self.function.to_bytes().into(),
                serialized_tx,
                request_hash,
                request_type: self.request_type.clone(),
            })),
            error_code,
        }))
    }

    /// Emits a serialized FunctionResult object to send to the quote verification
    /// sidecar.
    pub async fn emit(&self, ixs: Vec<Instruction>) -> Result<(), SbError> {
        self.get_function_result(ixs, 0)
            .await
            .map_err(|e| SbError::CustomMessage(format!("failed to get verify ixn: {}", e)))
            .unwrap()
            .emit();

        Ok(())
    }

    /// Emit an error and relay the error code on-chain for your downstream program to handle.
    pub async fn emit_error(&self, error_code: u8) -> Result<(), SbError> {
        self.get_function_result(vec![], error_code)
            .await
            .unwrap()
            .emit();
        Ok(())
    }

    //////////////////////////////////////////////////////////////////////////////
    /// Function Methods
    //////////////////////////////////////////////////////////////////////////////

    /// Loads the data of the function account provided by the FUNCTION_DATA
    /// environment variable.
    pub async fn load_function_data(&self) -> Result<Box<FunctionAccountData>, SbError> {
        if let Some(function_data) = self.function_data.as_ref() {
            if **function_data != FunctionAccountData::default() {
                return Ok(function_data.clone());
            }
        }

        msg!(
            "FUNCTION_DATA is missing - Fetching function account {}",
            self.function
        );

        FunctionAccountData::fetch(&self.client, self.function)
            .map_err(|error| {
                SbError::CustomMessage(format!(
                    "failed to fetch function {}: {}",
                    self.function, error
                ))
            })
            .and_then(|function_data| {
                if function_data != FunctionAccountData::default() {
                    Ok(Box::new(function_data))
                } else {
                    Err(SbError::CustomMessage(format!(
                        "function account {} is empty",
                        self.function
                    )))
                }
            })
    }

    /// Load all of the accounts

    pub async fn load_accounts(&mut self) -> Result<(), SbError> {
        if self.is_scheduled_function() {
            self.load_function().await?;
        }

        // TODO: make this concurrent with a single getMultipleAccounts call
        if self.is_routine() {
            self.load_routine().await?;
        }

        // TODO: make this concurrent with a single getMultipleAccounts call
        if self.is_request() {
            self.load_request().await?;
        }

        Ok(())
    }

    pub async fn load_function(&mut self) -> Result<(Pubkey, Box<FunctionAccountData>), SbError> {
        if self.function == Pubkey::default() {
            return Err(SbError::Message("Failed to load the function pubkey"));
        }

        let function_data = self.load_function_data().await?;
        self.function_data = Some(function_data.clone());

        Ok((self.function, function_data))
    }

    /// Builds the callback instruction to send to the Switchboard oracle network.
    /// This will execute the instruction to validate the output transaction
    /// was produced in your switchboard enclave.
    async fn build_fn_verify_ixn(
        &self,
        mr_enclave: MrEnclave,
        error_code: u8,
    ) -> Result<Instruction, SbError> {
        if self.function == Pubkey::default() {
            return Err(SbError::CustomMessage(
                "funciton pubkey is missing but required to build function_verify ixn".to_string(),
            ));
        }

        let function_data = self.load_function_data().await?;

        let queue_authority = self
            .load_queue_authority(function_data.attestation_queue)
            .await?;

        let verifier_enclave_signer = self.load_verifier_signer(self.verifier).await?;

        let next_allowed_timestamp = match function_data.get_next_execution_datetime() {
            Some(next_allowed_timestamp) => next_allowed_timestamp.timestamp(),
            None => i64::MAX,
        };

        let ixn = FunctionVerify::build_ix(
            &FunctionVerifyAccounts {
                function: self.function,
                function_enclave_signer: self.signer,
                function_escrow: function_data.escrow_wallet,

                verifier: self.verifier,
                verifier_enclave_signer,
                reward_receiver: self.reward_receiver,

                attestation_queue: function_data.attestation_queue,
                queue_authority,
            },
            &FunctionVerifyParams {
                observed_time: unix_timestamp(),
                next_allowed_timestamp,
                error_code,
                mr_enclave,
            },
        )?;

        Ok(ixn)
    }

    //////////////////////////////////////////////////////////////////////////////
    /// Routine Methods
    //////////////////////////////////////////////////////////////////////////////

    /// If this execution is tied to a function routine, load the data of the
    /// execution function routine account.
    pub async fn load_routine_data(&self) -> Result<Box<FunctionRoutineAccountData>, SbError> {
        let function_routine_key = self.function_routine_key.unwrap_or_default();
        if function_routine_key == Pubkey::default() {
            return Err(SbError::CustomMessage(
                "function_routine_key is missing but required to fetch function routine account"
                    .to_string(),
            ));
        }

        if let Some(function_routine_data) = self.function_routine_data.as_ref() {
            if **function_routine_data != FunctionRoutineAccountData::default() {
                return Ok(function_routine_data.clone());
            }
        }

        msg!(
            "FUNCTION_ROUTINE_DATA is missing - Fetching function_routine account {}",
            function_routine_key
        );

        match FunctionRoutineAccountData::fetch(&self.client, function_routine_key) {
            Ok(function_routine_data) => Ok(Box::new(function_routine_data)),
            Err(error) => Err(SbError::CustomMessage(format!(
                "failed to fetch function routine {}: {}",
                function_routine_key, error
            ))),
        }
    }

    pub async fn load_routine(
        &mut self,
    ) -> Result<(Pubkey, Box<FunctionRoutineAccountData>), SbError> {
        let routine_pubkey = self.function_routine_key.unwrap_or_default();
        if routine_pubkey == Pubkey::default() {
            return Err(SbError::Message("Failed to load the routine pubkey"));
        }

        let routine_data = self.load_routine_data().await?;
        self.function_routine_data = Some(routine_data.clone());

        Ok((routine_pubkey, routine_data))
    }

    async fn build_fn_routine_verify_ixn(
        &self,
        mr_enclave: MrEnclave,
        error_code: u8,
    ) -> Result<Instruction, SbError> {
        if self.function_routine_data.is_none() || self.function_routine_key.is_none() {
            return Err(SbError::CustomMessage(
                "function_routine_verify instruction needs routine environment present."
                    .to_string(),
            ));
        }
        let function_routine_data = self.function_routine_data.clone().unwrap_or_default();
        let function_routine_key = self.function_routine_key.unwrap_or_default();

        if function_routine_data.function != self.function {
            return Err(SbError::CustomMessage(format!(
                "function_key mismatch: expected {}, received {}",
                function_routine_data.function, self.function
            )));
        }

        let function_data = self.load_function_data().await?;

        let queue_authority = self
            .load_queue_authority(function_data.attestation_queue)
            .await?;
        let verifier_enclave_signer = self.load_verifier_signer(self.verifier).await?;

        let next_allowed_timestamp = match function_data.get_next_execution_datetime() {
            Some(next_allowed_timestamp) => next_allowed_timestamp.timestamp(),
            None => i64::MAX,
        };

        let container_params_hash =
            solana_program::hash::hash(&function_routine_data.container_params).to_bytes();

        // We only need this pubkey if the function is expected to be rewarded
        let function_escrow_token_wallet = if function_data.routines_dev_fee > 0 {
            Some(function_data.escrow_token_wallet)
        } else {
            None
        };

        let ixn = FunctionRoutineVerify::build_ix(
            &FunctionRoutineVerifyAccounts {
                routine: function_routine_key,
                function_enclave_signer: self.signer,

                escrow_wallet: function_data.escrow_wallet,

                function: self.function,
                function_escrow_token_wallet,

                verifier: self.verifier,
                verifier_enclave_signer,
                reward_receiver: self.reward_receiver,

                attestation_queue: function_data.attestation_queue,
                queue_authority,
            },
            &FunctionRoutineVerifyParams {
                observed_time: unix_timestamp(),
                next_allowed_timestamp,
                error_code,
                mr_enclave,
                container_params_hash,
            },
        )?;
        Ok(ixn)
    }

    //////////////////////////////////////////////////////////////////////////////
    /// Request Methods
    //////////////////////////////////////////////////////////////////////////////

    /// If this execution is tied to a function request, load the data of the
    /// execution function request account.
    pub async fn load_request_data(&self) -> Result<Box<FunctionRequestAccountData>, SbError> {
        let function_request_key = self.function_request_key.unwrap_or_default();
        if function_request_key == Pubkey::default() {
            return Err(SbError::CustomMessage(
                "function_request_key is missing but required to fetch function request account"
                    .to_string(),
            ));
        }

        if let Some(function_request_data) = self.function_request_data.as_ref() {
            if **function_request_data != FunctionRequestAccountData::default() {
                return Ok(function_request_data.clone());
            }
        }

        msg!(
            "FUNCTION_REQUEST_DATA is missing - Fetching function_request account {}",
            function_request_key
        );

        match FunctionRequestAccountData::fetch(&self.client, function_request_key) {
            Ok(function_request_data) => Ok(Box::new(function_request_data)),
            Err(error) => Err(SbError::CustomMessage(format!(
                "failed to fetch function request {}: {}",
                function_request_key, error
            ))),
        }
    }

    pub async fn load_request(
        &mut self,
    ) -> Result<(Pubkey, Box<FunctionRequestAccountData>), SbError> {
        let request_pubkey = self.function_request_key.unwrap_or_default();
        if request_pubkey == Pubkey::default() {
            return Err(SbError::Message("Failed to load the request pubkey"));
        }

        let request_data = self.load_request_data().await?;
        self.function_request_data = Some(request_data.clone());

        Ok((request_pubkey, request_data))
    }

    /// Builds the callback instruction to send to the Switchboard oracle network.
    /// This will execute the instruction to validate the output transaction
    /// as well as validate the request parameters used in this run.
    async fn build_fn_request_verify_ixn(
        &self,
        mr_enclave: MrEnclave,
        error_code: u8,
    ) -> Result<Instruction, SbError> {
        if self.function_request_data.is_none() || self.function_request_key.is_none() {
            return Err(SbError::CustomMessage(
                "function_request_verify instruction needs request environment present."
                    .to_string(),
            ));
        }
        let function_request_data = self.function_request_data.clone().unwrap_or_default();
        let function_request_key = self.function_request_key.unwrap_or_default();

        if function_request_data.function != self.function {
            return Err(SbError::CustomMessage(format!(
                "function_key mismatch: expected {}, received {}",
                function_request_data.function, self.function
            )));
        }

        let function_data = self.load_function_data().await?;

        let queue_authority = self
            .load_queue_authority(function_data.attestation_queue)
            .await?;
        let verifier_enclave_signer = self.load_verifier_signer(self.verifier).await?;

        let container_params_hash =
            solana_program::hash::hash(&function_request_data.container_params).to_bytes();

        // We only need this pubkey if the function is expected to be rewarded
        let function_escrow_token_wallet = if function_data.routines_dev_fee > 0 {
            Some(function_data.escrow_token_wallet)
        } else {
            None
        };

        let ixn = FunctionRequestVerify::build_ix(
            &FunctionRequestVerifyAccounts {
                request: function_request_key,
                function_enclave_signer: self.signer,

                function: self.function,
                function_escrow_token_wallet,

                verifier: self.verifier,
                verifier_enclave_signer,
                reward_receiver: self.reward_receiver,

                attestation_queue: function_data.attestation_queue,
                queue_authority,
            },
            &FunctionRequestVerifyParams {
                observed_time: unix_timestamp(),
                error_code,
                mr_enclave,
                request_slot: function_request_data.active_request.request_slot,
                container_params_hash,
            },
        )?;
        Ok(ixn)
    }
}
