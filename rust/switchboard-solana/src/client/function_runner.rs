use crate::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::message::Message;
use anchor_lang::solana_program::pubkey::Pubkey;
use anchor_lang::AnchorDeserialize;
use hex;
use sgx_quote::Quote;
use solana_client::rpc_client::RpcClient;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_sdk::signer::keypair::Keypair;
use std::result::Result;
use std::str::FromStr;
use std::sync::Arc;
use switchboard_common::ChainResultInfo::Solana;
use switchboard_common::SOLFunctionResult;
use switchboard_common::SolanaFunctionEnvironment;

/// A management object for structured runtime for Switchboard Functions on
/// solana. Inititlizing this object will load all required variables
/// from the runtime to execute and sign an output transaction to be verified
/// and committed by the switchboard network.
#[derive(Clone)]
pub struct FunctionRunner {
    pub client: Arc<RpcClient>,

    signer_keypair: Arc<Keypair>,
    pub signer: Pubkey,

    // required to run
    pub function: Pubkey,
    pub payer: Pubkey,
    pub verifier: Pubkey,
    pub reward_receiver: Pubkey,

    // can be manually populated from client if missing
    pub function_data: Option<Box<FunctionAccountData>>,
    pub verifier_enclave_signer: Option<Pubkey>,
    pub queue_authority: Option<Pubkey>,

    // only used for requests
    pub function_request_key: Option<Pubkey>,
    pub function_request_data: Option<Box<FunctionRequestAccountData>>,

    // convienence for building ixns
    pub attestation_queue: Option<Pubkey>,
    pub switchboard_state: Pubkey,
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
    pub fn new_with_client(client: RpcClient) -> Result<Self, SwitchboardClientError> {
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
        let function_data: Option<Box<FunctionAccountData>> =
            if let Some(function_data_encoded) = env.function_data.as_ref() {
                // match bytemuck::try_from_bytes<FunctionAccountData>(&)
                match bytemuck::try_from_bytes::<FunctionAccountData>(
                    &hex::decode(function_data_encoded).unwrap_or_default(),
                ) {
                    Ok(function_data) => {
                        attestation_queue = Some(function_data.attestation_queue);
                        if function_data != &FunctionAccountData::default() {
                            Some(Box::new(*function_data))
                        } else {
                            None
                        }
                    }
                    Err(_) => None,
                }
            } else {
                None
            };
        let verifier_enclave_signer: Option<Pubkey> =
            if let Some(verifier_enclave_signer) = env.verifier_enclave_signer {
                match Pubkey::from_str(&verifier_enclave_signer) {
                    Ok(verifier_enclave_signer) => {
                        if verifier_enclave_signer != Pubkey::default() {
                            Some(verifier_enclave_signer)
                        } else {
                            None
                        }
                    }
                    Err(_) => None,
                }
            } else {
                None
            };
        let queue_authority: Option<Pubkey> = if let Some(queue_authority) = env.queue_authority {
            match Pubkey::from_str(&queue_authority) {
                Ok(queue_authority) => {
                    if queue_authority != Pubkey::default() {
                        Some(queue_authority)
                    } else {
                        None
                    }
                }
                Err(_) => None,
            }
        } else {
            None
        };

        // only used for requests
        let function_request_key: Option<Pubkey> =
            if let Some(function_request_key) = env.function_request_key {
                match Pubkey::from_str(&function_request_key) {
                    Ok(function_request_key) => {
                        if function_request_key != Pubkey::default() {
                            Some(function_request_key)
                        } else {
                            None
                        }
                    }
                    Err(_) => None,
                }
            } else {
                None
            };
        let function_request_data: Option<Box<FunctionRequestAccountData>> =
            if let Some(function_request_data_encoded) = env.function_request_data.as_ref() {
                match FunctionRequestAccountData::try_from_slice(
                    &hex::decode(function_request_data_encoded).unwrap_or_default(),
                ) {
                    Ok(function_request_data) => {
                        if attestation_queue.is_none() {
                            attestation_queue = Some(function_request_data.attestation_queue);
                        }

                        Some(Box::new(function_request_data))
                    }
                    Err(_) => None,
                }
            } else {
                None
            };

        let switchboard: Pubkey =
            load_env_pubkey("SWITCHBOARD").unwrap_or(SWITCHBOARD_ATTESTATION_PROGRAM_ID);
        let switchboard_state = AttestationProgramState::get_program_pda(Some(switchboard));

        Ok(Self {
            client: Arc::new(client),
            signer_keypair,
            signer,
            function,
            function_data,
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

    pub fn assert_mr_enclave(&self) -> Result<(), SwitchboardClientError> {
        if let Some(function_data) = self.function_data.clone() {
            let quote_raw = Gramine::generate_quote(&self.signer.to_bytes()).unwrap_or_default();
            if let Ok(quote) = Quote::parse(&quote_raw) {
                let mr_enclave: MrEnclave = quote.isv_report.mrenclave.try_into().unwrap();
                if !function_data.mr_enclaves.contains(&mr_enclave) {
                    return Err(SwitchboardClientError::MrEnclaveMismatch);
                }
            }
        }
        Ok(())
    }

    pub fn new(
        url: &str,
        commitment: Option<CommitmentConfig>,
    ) -> Result<Self, SwitchboardClientError> {
        Self::new_with_client(RpcClient::new_with_commitment(
            url,
            commitment.unwrap_or_default(),
        ))
    }

    pub fn new_from_cluster(
        cluster: Cluster,
        commitment: Option<CommitmentConfig>,
    ) -> Result<Self, SwitchboardClientError> {
        Self::new(cluster.url(), commitment)
    }

    /// Loads the FunctionRunner from runtime settings
    pub fn from_env(commitment: Option<CommitmentConfig>) -> Result<Self, SwitchboardClientError> {
        let cluster = Cluster::from_str(&std::env::var("CLUSTER").unwrap()).unwrap();
        Self::new_from_cluster(cluster, commitment)
    }

    /// Loads the queue authority provided by the QUEUE_AUTHORITY environment
    /// variable
    async fn load_queue_authority(
        &self,
        attestation_queue_pubkey: Pubkey,
    ) -> Result<Pubkey, SwitchboardClientError> {
        let queue_authority = self.queue_authority.unwrap_or_default();
        if queue_authority != Pubkey::default() {
            return Ok(queue_authority);
        }

        msg!(
            "queue_authority missing! {}",
            std::env::var("QUEUE_AUTHORITY").unwrap_or("N/A".to_string())
        );

        msg!(
            "fetching attestation_queue account {}",
            attestation_queue_pubkey
        );

        match AttestationQueueAccountData::fetch(&self.client, attestation_queue_pubkey).await {
            Err(error) => Err(SwitchboardClientError::CustomMessage(format!(
                "failed to fetch attestation_queue {}: {}",
                attestation_queue_pubkey, error
            ))),
            Ok(attestation_queue) => Ok(attestation_queue.authority),
        }
    }

    pub fn get_associated_token_address(owner: Pubkey, mint: Option<Pubkey>) -> Pubkey {
        anchor_spl::associated_token::get_associated_token_address(
            &owner,
            &mint.unwrap_or(anchor_spl::token::spl_token::native_mint::ID),
        )
    }

    /// Loads the oracle signing key provided by the VERIFIER_ENCLAVE_SIGNER
    /// environment variable
    async fn load_verifier_signer(
        &self,
        verifier_pubkey: Pubkey,
    ) -> Result<Pubkey, SwitchboardClientError> {
        let verifier_enclave_signer = self.verifier_enclave_signer.unwrap_or_default();
        if verifier_enclave_signer != Pubkey::default() {
            return Ok(verifier_enclave_signer);
        }

        msg!(
            "verifier_enclave_signer missing! {}",
            std::env::var("VERIFIER_ENCLAVE_SIGNER").unwrap_or("N/A".to_string())
        );

        msg!("fetching verifier account {}", verifier_pubkey);

        match VerifierAccountData::fetch(&self.client, verifier_pubkey).await {
            Err(error) => Err(SwitchboardClientError::CustomMessage(format!(
                "failed to fetch verifier {}: {}",
                verifier_pubkey, error
            ))),
            Ok(verifier_data) => Ok(verifier_data.enclave.enclave_signer),
        }
    }

    /// Loads the data of the function account provided by the FUNCTION_DATA
    /// environment variable.
    pub async fn load_function_data(
        &self,
    ) -> Result<Box<FunctionAccountData>, SwitchboardClientError> {
        if let Some(function_data) = self.function_data.as_ref() {
            if **function_data != FunctionAccountData::default() {
                return Ok(function_data.clone());
            }
        }

        msg!("fetching function account {}", self.function);

        match FunctionAccountData::fetch(&self.client, self.function).await {
            Ok(function_data) => Ok(Box::new(function_data)),
            Err(error) => Err(SwitchboardClientError::CustomMessage(format!(
                "failed to fetch function {}: {}",
                self.function, error
            ))),
        }
    }

    /// If this execution is tied to a function request, load the data of the
    /// execution function request account.
    pub async fn load_request_data(
        &self,
    ) -> Result<Box<FunctionRequestAccountData>, SwitchboardClientError> {
        let function_request_key = self.function_request_key.unwrap_or_default();
        if function_request_key == Pubkey::default() {
            return Err(SwitchboardClientError::CustomMessage(
                "function_request_key is missing but required to fetch function request account"
                    .to_string(),
            ));
        }

        if let Some(function_request_data) = self.function_request_data.as_ref() {
            if **function_request_data != FunctionRequestAccountData::default() {
                return Ok(function_request_data.clone());
            }
        }

        msg!("fetching request account {}", function_request_key);

        match FunctionRequestAccountData::fetch(&self.client, function_request_key).await {
            Ok(function_request_data) => Ok(Box::new(function_request_data)),
            Err(error) => Err(SwitchboardClientError::CustomMessage(format!(
                "failed to fetch function request {}: {}",
                function_request_key, error
            ))),
        }
    }

    /// Builds the callback instruction to send to the Switchboard oracle network.
    /// This will execute the instruction to validate the output transaction
    /// was produced in your switchboard enclave.
    async fn build_fn_verify_ixn(
        &self,
        mr_enclave: MrEnclave,
        error_code: u8,
    ) -> Result<Instruction, SwitchboardClientError> {
        if self.function == Pubkey::default() {
            return Err(SwitchboardClientError::CustomMessage(
                "funciton pubkey is missing but required to build function_verify ixn".to_string(),
            ));
        }

        let function_data: FunctionAccountData = *bytemuck::try_from_bytes(
            &hex::decode(std::env::var("FUNCTION_DATA").unwrap()).unwrap(),
        )
        .unwrap();

        let queue_authority = Pubkey::from_str(&std::env::var("QUEUE_AUTHORITY").unwrap()).unwrap();
        let verifier_enclave_signer =
            Pubkey::from_str(&std::env::var("VERIFIER_ENCLAVE_SIGNER").unwrap()).unwrap();

        let verifier_permission = AttestationPermissionAccountData::get_pda(
            &queue_authority,
            &function_data.attestation_queue,
            &self.verifier,
        );

        let maybe_next_allowed_timestamp = function_data.get_next_execution_datetime();
        let next_allowed_timestamp: i64 = if maybe_next_allowed_timestamp.is_some() {
            maybe_next_allowed_timestamp.unwrap().timestamp()
        } else {
            i64::MAX
        };

        let ixn_params = FunctionVerifyParams {
            observed_time: unix_timestamp(),
            next_allowed_timestamp,
            error_code,
            mr_enclave,
        };

        let accounts = FunctionVerifyAccounts {
            function: self.function,
            function_enclave_signer: self.signer,
            verifier_quote: self.verifier,
            verifier_enclave_signer,
            verifier_permission,
            escrow_wallet: function_data.escrow_wallet,
            escrow_token_wallet: function_data.escrow_token_wallet,
            attestation_queue: function_data.attestation_queue,
            receiver: self.reward_receiver,
        };
        let ixn: Instruction = accounts.get_instruction(ixn_params)?;
        Ok(ixn)
    }

    /// Builds the callback instruction to send to the Switchboard oracle network.
    /// This will execute the instruction to validate the output transaction
    /// as well as validate the request parameters used in this run.
    async fn build_fn_request_verify_ixn(
        &self,
        mr_enclave: MrEnclave,
        error_code: u8,
    ) -> Result<Instruction, SwitchboardClientError> {
        if self.function_request_data.is_none() || self.function_request_key.is_none() {
            return Err(SwitchboardClientError::CustomMessage(
                "function_request_verify instruction needs request environment present."
                    .to_string(),
            ));
        }
        let function_request_data = self.function_request_data.clone().unwrap_or_default();
        let function_request_key = self.function_request_key.unwrap_or_default();

        if function_request_data.function != self.function {
            return Err(SwitchboardClientError::CustomMessage(format!(
                "function_key mismatch: expected {}, received {}",
                function_request_data.function, self.function
            )));
        }

        let function_data = self.load_function_data().await?;

        let queue_authority = self
            .load_queue_authority(function_data.attestation_queue)
            .await?;
        let verifier_enclave_signer = self.load_verifier_signer(self.verifier).await?;

        let verifier_permission = AttestationPermissionAccountData::get_pda(
            &queue_authority,
            &function_data.attestation_queue,
            &self.verifier,
        );

        let container_params_hash =
            solana_program::hash::hash(&function_request_data.container_params).to_bytes();
        let ixn_params = FunctionRequestVerifyParams {
            observed_time: unix_timestamp(),
            error_code,
            mr_enclave,
            request_slot: function_request_data.active_request.request_slot,
            container_params_hash,
        };

        let (state_pubkey, _state_bump) =
            Pubkey::find_program_address(&[STATE_SEED], &SWITCHBOARD_ATTESTATION_PROGRAM_ID);

        let accounts = FunctionRequestVerifyAccounts {
            request: function_request_key,
            function_enclave_signer: self.signer,
            token_wallet: function_request_data.escrow,
            function: self.function,
            function_escrow: function_data.escrow_token_wallet,
            verifier_quote: self.verifier,
            verifier_enclave_signer,
            verifier_permission,
            state: state_pubkey,
            attestation_queue: function_data.attestation_queue,
            receiver: self.reward_receiver,
        };
        let ixn: Instruction = accounts.get_instruction(ixn_params)?;
        Ok(ixn)
    }

    /// Generates a FunctionResult object to be emitted at the end of this
    /// function run. This function result will be used be the quote verification
    /// sidecar to verify the output was run inside the function's enclave
    /// and sign the transaction to send back on chain.
    async fn get_result(
        &self,
        mut ixs: Vec<Instruction>,
        error_code: u8,
    ) -> Result<FunctionResult, SwitchboardClientError> {
        let quote_raw = Gramine::generate_quote(&self.signer.to_bytes()).unwrap();
        let quote = Quote::parse(&quote_raw).unwrap();
        let mr_enclave: MrEnclave = quote.isv_report.mrenclave.try_into().unwrap();

        let function_request_key = self.function_request_key.unwrap_or_default();
        let verify_ixn = if function_request_key == Pubkey::default() {
            self.build_fn_verify_ixn(mr_enclave, error_code).await?
        } else {
            self.build_fn_request_verify_ixn(mr_enclave, error_code)
                .await?
        };
        ixs.insert(0, verify_ixn);
        let message = Message::new(&ixs, Some(&self.payer));
        let blockhash = self.client.get_latest_blockhash().unwrap();
        let mut tx = solana_sdk::transaction::Transaction::new_unsigned(message);
        tx.partial_sign(&[self.signer_keypair.as_ref()], blockhash);

        let fn_request_key: Vec<u8> = if function_request_key != Pubkey::default() {
            function_request_key.to_bytes().to_vec()
        } else {
            vec![]
        };

        Ok(FunctionResult {
            version: 1,
            quote: quote_raw,
            fn_key: self.function.to_bytes().into(),
            signer: self.signer.to_bytes().into(),
            fn_request_key,
            // TODO: hash should be checked against
            fn_request_hash: Vec::new(),
            chain_result_info: Solana(SOLFunctionResult {
                serialized_tx: bincode::serialize(&tx).unwrap(),
            }),
            error_code,
        })
    }

    /// Emits a serialized FunctionResult object to send to the quote verification
    /// sidecar.
    pub async fn emit(&self, ixs: Vec<Instruction>) -> Result<(), SwitchboardClientError> {
        self.get_result(ixs, 0)
            .await
            .map_err(|e| {
                SwitchboardClientError::CustomMessage(format!("failed to get verify ixn: {}", e))
            })
            .unwrap()
            .emit();

        Ok(())
    }

    pub async fn emit_error(&self, error_code: u8) -> Result<(), SwitchboardClientError> {
        self.get_result(vec![], error_code).await.unwrap().emit();
        Ok(())
    }
}

// Useful for building ixns on the client side
/// Implements the instruction schema for serialization the
/// function_verify instruction
pub struct FunctionVerifyAccounts {
    pub function: Pubkey,
    pub function_enclave_signer: Pubkey,
    pub verifier_quote: Pubkey,
    pub verifier_enclave_signer: Pubkey,
    pub verifier_permission: Pubkey,
    pub escrow_wallet: Pubkey,
    pub escrow_token_wallet: Pubkey,
    pub receiver: Pubkey,
    pub attestation_queue: Pubkey,
}
impl FunctionVerifyAccounts {
    /// Generates an instruction to verify the provided function call
    pub fn get_instruction(
        &self,
        params: FunctionVerifyParams,
    ) -> std::result::Result<Instruction, SwitchboardClientError> {
        let accounts = self.to_account_metas(None);
        let mut data: Vec<u8> = FunctionVerify::discriminator().try_to_vec().map_err(|_| {
            SwitchboardClientError::CustomMessage(
                "failed to get function_verify discriminator".to_string(),
            )
        })?;
        let mut param_vec: Vec<u8> = params.try_to_vec().map_err(|_| {
            SwitchboardClientError::CustomMessage(
                "failed to serialize function_verify ixn data".to_string(),
            )
        })?;
        data.append(&mut param_vec);

        let instruction =
            Instruction::new_with_bytes(SWITCHBOARD_ATTESTATION_PROGRAM_ID, &data, accounts);
        Ok(instruction)
    }
}

impl ToAccountMetas for FunctionVerifyAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta::new(self.function, false),
            AccountMeta::new_readonly(self.function_enclave_signer, true),
            AccountMeta::new_readonly(self.verifier_quote, false),
            AccountMeta::new_readonly(self.verifier_enclave_signer, true),
            AccountMeta::new_readonly(self.verifier_permission, false),
            AccountMeta::new_readonly(self.escrow_wallet, false),
            AccountMeta::new(self.escrow_token_wallet, false),
            AccountMeta::new(self.receiver, false),
            AccountMeta::new_readonly(self.attestation_queue, false),
            AccountMeta::new_readonly(anchor_spl::token::ID, false),
        ]
    }
}
/// Implements the instruction schema for serialization the
/// function_request_verify instruction
pub struct FunctionRequestVerifyAccounts {
    pub request: Pubkey,
    pub function_enclave_signer: Pubkey,
    pub token_wallet: Pubkey,
    pub function: Pubkey,
    pub function_escrow: Pubkey,
    pub verifier_quote: Pubkey,
    pub verifier_enclave_signer: Pubkey,
    pub verifier_permission: Pubkey,
    pub receiver: Pubkey,
    pub state: Pubkey,
    pub attestation_queue: Pubkey,
}
impl FunctionRequestVerifyAccounts {
    /// Generates an instruction to verify the provided request call
    pub fn get_instruction(
        &self,
        params: FunctionRequestVerifyParams,
    ) -> std::result::Result<Instruction, SwitchboardClientError> {
        let accounts = self.to_account_metas(None);
        let mut data: Vec<u8> = FunctionRequestVerify::discriminator()
            .try_to_vec()
            .map_err(|_| {
                SwitchboardClientError::CustomMessage(
                    "failed to get function_request_verify discriminator".to_string(),
                )
            })?;
        let mut param_vec: Vec<u8> = params.try_to_vec().map_err(|_| {
            SwitchboardClientError::CustomMessage(
                "failed to serialize function_request_verify ixn data".to_string(),
            )
        })?;
        data.append(&mut param_vec);

        let instruction =
            Instruction::new_with_bytes(SWITCHBOARD_ATTESTATION_PROGRAM_ID, &data, accounts);
        Ok(instruction)
    }
}

impl ToAccountMetas for FunctionRequestVerifyAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta::new(self.request, false),
            AccountMeta::new_readonly(self.function_enclave_signer, true),
            AccountMeta::new(self.token_wallet, false),
            AccountMeta::new(self.function, false),
            AccountMeta::new(self.function_escrow, false),
            AccountMeta::new_readonly(self.verifier_quote, false),
            AccountMeta::new_readonly(self.verifier_enclave_signer, true),
            AccountMeta::new_readonly(self.verifier_permission, false),
            AccountMeta::new_readonly(self.state, false),
            AccountMeta::new_readonly(self.attestation_queue, false),
            AccountMeta::new(self.receiver, false),
            AccountMeta::new_readonly(anchor_spl::token::ID, false),
        ]
    }
}
