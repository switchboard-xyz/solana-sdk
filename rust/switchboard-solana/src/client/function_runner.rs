use crate::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::message::Message;
use anchor_lang::solana_program::pubkey::Pubkey;
use sgx_quote::Quote;
use solana_client::rpc_client::RpcClient;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_sdk::signer::keypair::Keypair;
use std::result::Result;
use std::sync::Arc;

#[derive(Clone)]
pub struct FunctionRunner {
    pub client: Arc<RpcClient>,

    signer_keypair: Arc<Keypair>,
    pub signer: Pubkey,

    pub function: Pubkey,
    pub quote: Pubkey,
    pub payer: Pubkey,
    pub verifier: Pubkey,
    pub reward_receiver: Pubkey,
}

impl std::fmt::Display for FunctionRunner {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "SwitchboardFunctionRunner: url: {}, signer: {}, function: {}, verifier: {}",
            self.client.url(),
            self.signer,
            self.function.to_string(),
            self.verifier.to_string()
        )
    }
}

impl FunctionRunner {
    pub fn new_with_client(client: RpcClient) -> Result<Self, SwitchboardClientError> {
        let signer_keypair = generate_signer();
        let signer = signer_to_pubkey(signer_keypair.clone())?;

        let function = load_env_pubkey("FUNCTION_KEY")?;
        let payer = load_env_pubkey("PAYER")?;
        let verifier = load_env_pubkey("VERIFIER")?;
        let reward_receiver = load_env_pubkey("REWARD_RECEIVER")?;

        let (quote, _bump) = Pubkey::find_program_address(
            &[QUOTE_SEED, function.as_ref()],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );

        Ok(Self {
            client: Arc::new(client),
            signer_keypair,
            signer,
            function,
            quote,
            payer,
            verifier,
            reward_receiver,
        })
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

    async fn build_verify_ixn(
        &self,
        mr_enclave: MrEnclave,
    ) -> Result<Instruction, SwitchboardClientError> {
        let current_time = unix_timestamp();

        let fn_data: FunctionAccountData =
            FunctionAccountData::fetch(&self.client, self.function).await?;

        let verifier_quote: EnclaveAccountData =
            EnclaveAccountData::fetch(&self.client, self.verifier).await?;

        let queue_data: AttestationQueueAccountData =
            crate::client::load_account(&self.client, fn_data.attestation_queue).await?;

        let verifier_permission = AttestationPermissionAccountData::get_pda(
            &queue_data.authority,
            &fn_data.attestation_queue,
            &self.payer,
        );

        let fn_permission = AttestationPermissionAccountData::get_pda(
            &queue_data.authority,
            &fn_data.attestation_queue,
            &self.function,
        );

        let state = AttestationState::get_pda();

        let pubkeys = FunctionVerifyPubkeys {
            function: self.function,
            fn_signer: self.signer,
            fn_quote: self.quote,
            verifier_quote: self.verifier,
            secured_signer: verifier_quote.authority,
            attestation_queue: fn_data.attestation_queue,
            escrow: fn_data.escrow,
            receiver: self.reward_receiver,
            verifier_permission,
            fn_permission,
            state,
            token_program: anchor_spl::token::ID,
            payer: self.payer,
            system_program: anchor_lang::solana_program::system_program::ID,
        };

        let next_allowed_timestamp = fn_data
            .next_execution_timestamp()
            .map(|x| x.timestamp())
            .unwrap_or(i64::MAX);

        let ixn_params = FunctionVerifyParams {
            observed_time: current_time,
            next_allowed_timestamp,
            is_failure: false,
            mr_enclave,
        };
        let ixn = Instruction {
            program_id: SWITCHBOARD_ATTESTATION_PROGRAM_ID,
            accounts: pubkeys.to_account_metas(None),
            data: ixn_params.data(),
        };
        Ok(ixn)
    }

    async fn get_result(
        &self,
        mut ixs: Vec<Instruction>,
    ) -> Result<FunctionResult, SwitchboardClientError> {
        let quote_raw = Gramine::generate_quote(&self.signer.to_bytes()).unwrap();
        let quote = Quote::parse(&quote_raw).unwrap();
        let mr_enclave: MrEnclave = quote.isv_report.mrenclave.try_into().unwrap();

        let verify_ixn = self.build_verify_ixn(mr_enclave).await?;
        ixs.insert(0, verify_ixn);
        let message = Message::new(&ixs, Some(&self.payer));
        let blockhash = self.client.get_latest_blockhash().unwrap();
        let mut tx = solana_sdk::transaction::Transaction::new_unsigned(message);
        tx.partial_sign(&[self.signer_keypair.as_ref()], blockhash);

        Ok(FunctionResult {
            version: 1,
            chain: switchboard_common::Chain::Solana,
            key: self.function.to_bytes(),
            signer: self.signer.to_bytes(),
            serialized_tx: bincode::serialize(&tx).unwrap(),
            quote: quote_raw,
            ..Default::default()
        })
    }

    pub async fn emit(&self, ixs: Vec<Instruction>) -> Result<(), SwitchboardClientError> {
        self.get_result(ixs)
            .await
            .map_err(|e| SwitchboardClientError::CustomError {
                message: "failed to run function verify".to_string(),
                source: Box::new(e),
            })
            .unwrap()
            .emit();

        Ok(())
    }
}

pub struct FunctionVerifyPubkeys {
    pub function: Pubkey,
    pub fn_signer: Pubkey,
    pub fn_quote: Pubkey,
    pub verifier_quote: Pubkey,
    pub secured_signer: Pubkey,
    pub attestation_queue: Pubkey,
    pub escrow: Pubkey,
    pub receiver: Pubkey,
    pub verifier_permission: Pubkey,
    pub fn_permission: Pubkey,
    pub state: Pubkey,
    pub token_program: Pubkey,
    pub payer: Pubkey,
    pub system_program: Pubkey,
}

impl ToAccountMetas for FunctionVerifyPubkeys {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta {
                pubkey: self.function,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.fn_signer,
                is_signer: true,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.fn_quote,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.verifier_quote,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.secured_signer,
                is_signer: true,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.attestation_queue,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.escrow,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.receiver,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.verifier_permission,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.fn_permission,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.state,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.token_program,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.payer,
                is_signer: true,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.system_program,
                is_signer: false,
                is_writable: false,
            },
        ]
    }
}
