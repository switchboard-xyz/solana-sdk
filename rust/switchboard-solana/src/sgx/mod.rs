use crate::prelude::*;

use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::message::Message;
use anchor_lang::solana_program::pubkey::Pubkey;
use sgx_quote::Quote;
use solana_sdk::signer::keypair::{keypair_from_seed, Keypair};

use std::env;
use std::result::Result;
use std::str::FromStr;
use std::sync::Arc;

use crate::attestation_program::FunctionVerify;
use crate::{QUOTE_SEED, SWITCHBOARD_ATTESTATION_PROGRAM_ID};

pub fn generate_signer() -> Arc<Keypair> {
    let mut randomness = [0; 32];
    switchboard_common::Gramine::read_rand(&mut randomness).unwrap();
    Arc::new(keypair_from_seed(&randomness).unwrap())
}

pub async fn function_verify(
    url: String,
    fn_signer: Arc<Keypair>,
    mut ixs: Vec<Instruction>,
) -> Result<switchboard_common::FunctionResult, switchboard_common::Error> {
    let fn_signer_pubkey = crate::client::to_pubkey(fn_signer.clone())?;

    let client = solana_client::rpc_client::RpcClient::new_with_commitment(
        url,
        solana_sdk::commitment_config::CommitmentConfig::processed(),
    );

    let quote_raw =
        switchboard_common::Gramine::generate_quote(&fn_signer_pubkey.to_bytes()).unwrap();
    let quote = Quote::parse(&quote_raw).unwrap();

    let pubkeys = FunctionVerifyPubkeys::load_from_env()?;

    let ix = FunctionVerify::build(
        &client,
        fn_signer.clone(),
        &pubkeys,
        quote.isv_report.mrenclave.try_into().unwrap(),
    )
    .await?;

    ixs.insert(0, ix);

    let message = Message::new(&ixs, Some(&pubkeys.payer));

    let blockhash = client.get_latest_blockhash().unwrap();

    let mut tx = solana_sdk::transaction::Transaction::new_unsigned(message);
    tx.partial_sign(&[fn_signer.as_ref()], blockhash);

    Ok(switchboard_common::FunctionResult {
        version: 1,
        chain: switchboard_common::Chain::Solana,
        key: pubkeys.function.to_bytes(),
        signer: fn_signer_pubkey.to_bytes(),
        serialized_tx: bincode::serialize(&tx).unwrap(),
        quote: quote_raw,
        ..Default::default()
    })
}

pub struct FunctionVerifyPubkeys {
    pub function: Pubkey,
    pub quote: Pubkey,
    pub payer: Pubkey,
    pub verifier: Pubkey,
    pub reward_receiver: Pubkey,
}

impl FunctionVerifyPubkeys {
    pub fn load_from_env() -> std::result::Result<Self, switchboard_common::Error> {
        let function = Pubkey::from_str(&env::var("FUNCTION_KEY").unwrap()).unwrap();
        let payer = Pubkey::from_str(&env::var("PAYER").unwrap()).unwrap();

        let verifier = &env::var("VERIFIER").unwrap_or(String::new());
        if verifier.is_empty() {
            return Err(switchboard_common::Error::CustomMessage(
                "verifier missing".to_string(),
            ));
        }

        let (quote, _bump) = Pubkey::find_program_address(
            &[QUOTE_SEED, function.as_ref()],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );

        Ok(Self {
            function,
            quote,
            payer,
            verifier: Pubkey::from_str(verifier).map_err(|_| {
                switchboard_common::Error::CustomMessage(
                    "failed to parse pubkey string".to_string(),
                )
            })?,
            reward_receiver: Pubkey::from_str(&env::var("REWARD_RECEIVER").unwrap()).unwrap(),
        })
    }
}
