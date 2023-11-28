use crate::prelude::*;

use anchor_client::anchor_lang::Event;
use anchor_client::solana_sdk::commitment_config::CommitmentConfig;
use sha2::{ Digest, Sha256 };
use solana_client::nonblocking::rpc_client::RpcClient as NonblockingRpcClient;
use solana_sdk::client::SyncClient;
use solana_sdk::signer::keypair::{ keypair_from_seed, read_keypair_file, Keypair };
use solana_sdk::signer::Signer;
use std::env;
use std::result::Result;
use std::str::FromStr;
use std::sync::Arc;
use tokio::sync::RwLock;
use base64::{ engine::general_purpose, Engine as _ };
use solana_client::rpc_config::RpcTransactionLogsFilter;
use solana_client::nonblocking::pubsub_client::PubsubClient;
use solana_client::rpc_config::RpcTransactionLogsConfig;
use futures::{ Future, StreamExt };
use super::program::get_attestation_program;

pub fn build_tx<A: ToAccountMetas, I: InstructionData + Discriminator>(
    anchor_client: &anchor_client::Client<std::sync::Arc<Keypair>>,
    program_id: &Pubkey,
    accounts: A,
    params: I,
    signers: Vec<&Keypair>
) -> Result<Transaction, SbError> {
    let payer = signers[0];
    let ix = Instruction {
        program_id: *program_id,
        accounts: accounts.to_account_metas(None),
        data: params.data(),
    };
    let mut tx = Transaction::new_with_payer(&[ix], Some(&payer.pubkey()));
    let program = get_attestation_program(anchor_client)?;
    let blockhash = program.rpc().get_latest_blockhash().unwrap_or_default();
    tx.try_sign(&signers, blockhash).map_err(|e| SbError::CustomError {
        message: "Failed to sign txn".into(),
        source: std::sync::Arc::new(e),
    })?;
    Ok(tx)
}

pub async fn get_async_rpc(
    client: &Arc<RwLock<AnchorClient>>
) -> Result<Arc<NonblockingRpcClient>, SbError> {
    let client = client.clone();
    let ro_client = client.read().await;
    let program = get_attestation_program(&ro_client)?;
    let rpc = program.async_rpc();
    Ok(Arc::new(rpc))
}

pub fn ix_to_tx(
    ixs: &[Instruction],
    signers: &[&Keypair],
    blockhash: solana_program::hash::Hash
) -> Result<Transaction, SbError> {
    let msg = Message::new(ixs, Some(&signers[0].pubkey()));
    let mut tx = Transaction::new_unsigned(msg);
    // for (i,s) in signers.iter().enumerate() {
    //     tx.try_sign(&signers.to_vec(), blockhash)
    //     .map_err(|e| SbError::CustomError { message: format!("Failed to sign txn", {}), source: std::sync::Arc::new(e) })?;
    // }
    tx.try_sign(&signers.to_vec(), blockhash).map_err(|e| SbError::CustomError {
        message: "Failed to sign txn".into(),
        source: std::sync::Arc::new(e),
    })?;
    Ok(tx)
}

pub async fn get_enclave_signer_pubkey(
    enclave_signer: &Arc<RwLock<Keypair>>
) -> Result<Arc<Pubkey>, SbError> {
    let enclave_signer = enclave_signer.clone();
    let ro_enclave_signer = enclave_signer.read().await;
    let pubkey = Arc::new(ro_enclave_signer.pubkey());
    Ok(pubkey)
}

pub fn load_env_pubkey(key: &str) -> Result<Pubkey, SbError> {
    Pubkey::from_str(&env::var(key).unwrap_or_default()).map_err(|_|
        SbError::EnvVariableMissing(key.to_string())
    )
}

/// Parse a string into an optional Pubkey. If the string is empty, return None.
pub fn parse_optional_pubkey(var: &str) -> Option<Pubkey> {
    if var.is_empty() {
        None
    } else {
        match Pubkey::from_str(var) {
            Ok(pubkey) => {
                if pubkey != Pubkey::default() { Some(pubkey) } else { None }
            }
            Err(_) => None,
        }
    }
}

pub fn keypair_from_base_seed(
    base: &str,
    secret_key: Vec<u8>,
    more_bytes: Option<Vec<u8>>
) -> Result<Arc<Keypair>, SbError> {
    if secret_key.len() != 32 {
        return Err(SbError::Message("InvalidSecretKey"));
    }

    let mut seed = base.as_bytes().to_vec();
    seed.extend_from_slice(&secret_key);

    if let Some(bytes) = more_bytes.as_ref() {
        seed.extend_from_slice(bytes);
    }

    match keypair_from_seed(&Sha256::digest(&seed)) {
        Ok(keypair) => Ok(Arc::new(keypair)),
        Err(e) => {
            if let Some(err) = e.source() {
                println!("Failed to derive keypair -- {}", err);
            }

            Err(SbError::Message("Failed to derive keypair"))
        }
    }
}

/// Creates a signing keypair generated from randomness sourced from the enclave
/// runtime.
pub fn generate_signer() -> Arc<Keypair> {
    let mut randomness = [0; 32];
    switchboard_common::Gramine::read_rand(&mut randomness).unwrap();
    Arc::new(keypair_from_seed(&randomness).unwrap())
}

pub fn signer_to_pubkey(signer: Arc<Keypair>) -> std::result::Result<Pubkey, SbError> {
    Ok(signer.pubkey())
}

pub fn load_keypair_fs(fs_path: &str) -> Result<Arc<Keypair>, SbError> {
    match read_keypair_file(fs_path) {
        Ok(keypair) => Ok(Arc::new(keypair)),
        Err(e) => {
            if let Some(err) = e.source() {
                println!("Failed to read keypair file -- {}", err);
            }

            Err(SbError::Message("Failed to read keypair file"))
        }
    }
}

pub fn fetch_zerocopy_account<T: bytemuck::Pod + Discriminator + Owner>(
    client: &solana_client::rpc_client::RpcClient,
    pubkey: Pubkey
) -> Result<T, SbError> {
    let data = client.get_account_data(&pubkey).map_err(|_| SbError::AccountNotFound)?;

    if data.len() < T::discriminator().len() {
        return Err(SbError::Message("no discriminator found"));
    }

    let mut disc_bytes = [0u8; 8];
    disc_bytes.copy_from_slice(&data[..8]);
    if disc_bytes != T::discriminator() {
        return Err(SbError::Message("Discriminator error, check the account type"));
    }

    Ok(
        *bytemuck
            ::try_from_bytes::<T>(&data[8..])
            .map_err(|_| SbError::Message("AnchorParseError"))?
    )
}

pub fn fetch_zerocopy_account_sync<C: SyncClient, T: bytemuck::Pod + Discriminator + Owner>(
    client: &C,
    pubkey: Pubkey
) -> Result<T, SbError> {
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| SbError::AccountNotFound)?
        .ok_or(SbError::AccountNotFound)?;

    if data.len() < T::discriminator().len() {
        return Err(SbError::Message("no discriminator found"));
    }

    let mut disc_bytes = [0u8; 8];
    disc_bytes.copy_from_slice(&data[..8]);
    if disc_bytes != T::discriminator() {
        return Err(SbError::Message("Discriminator error, check the account type"));
    }

    Ok(
        *bytemuck
            ::try_from_bytes::<T>(&data[8..])
            .map_err(|_| SbError::Message("AnchorParseError"))?
    )
}

pub async fn fetch_zerocopy_account_async<T: bytemuck::Pod + Discriminator + Owner>(
    client: &NonblockingRpcClient,
    pubkey: Pubkey
) -> Result<T, SbError> {
    let data = client.get_account_data(&pubkey).await.map_err(|e| SbError::CustomError {
        message: "Failed to get account data".to_string(),
        source: Arc::new(e),
    })?;

    if data.len() < T::discriminator().len() {
        return Err(SbError::Message("no discriminator found"));
    }

    let mut disc_bytes = [0u8; 8];
    disc_bytes.copy_from_slice(&data[..8]);
    if disc_bytes != T::discriminator() {
        return Err(SbError::Message("Discriminator error, check the account type"));
    }

    Ok(
        *bytemuck
            ::try_from_bytes::<T>(&data[8..])
            .map_err(|_| SbError::Message("AnchorParseError"))?
    )
}

pub fn fetch_borsh_account<T: Discriminator + Owner + AccountDeserialize>(
    client: &solana_client::rpc_client::RpcClient,
    pubkey: Pubkey
) -> Result<T, SbError> {
    let account_data = client.get_account_data(&pubkey).map_err(|_| SbError::AccountNotFound)?;

    T::try_deserialize(&mut account_data.as_slice()).map_err(|_|
        SbError::Message("AnchorParseError")
    )
}

pub async fn fetch_borsh_account_async<T: Discriminator + Owner + AccountDeserialize>(
    client: &NonblockingRpcClient,
    pubkey: Pubkey
) -> Result<T, SbError> {
    let account_data = client
        .get_account_data(&pubkey).await
        .map_err(|_| SbError::AccountNotFound)?;

    T::try_deserialize(&mut account_data.as_slice()).map_err(|_|
        SbError::Message("AnchorParseError")
    )
}

pub fn fetch_borsh_account_sync<C: SyncClient, T: Discriminator + Owner + AccountDeserialize>(
    client: &C,
    pubkey: Pubkey
) -> Result<T, SbError> {
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| SbError::AccountNotFound)?
        .ok_or(SbError::AccountNotFound)?;

    T::try_deserialize(&mut data.as_slice()).map_err(|_| SbError::Message("AnchorParseError"))
}

pub async fn subscribe<E, F, T>(
    program_id: Pubkey,
    url: &str,
    client: Arc<RwLock<AnchorClient>>,
    quote_key: Arc<Pubkey>,
    enclave_key: Arc<RwLock<Keypair>>,
    payer: Arc<Keypair>,
    async_fn: F
)
    where
        F: Fn(Arc<RwLock<AnchorClient>>, Arc<Pubkey>, Arc<RwLock<Keypair>>, Arc<Keypair>, E) -> T +
            Send +
            Sync +
            'static,
        T: Future<Output = ()> + Send + 'static,
        E: Event
{
    // TODO: This may pull events from other programs if targeted but the
    // request still goes through verification so not a fatal issue.
    let pubsub_client = PubsubClient::new(url).await.unwrap();
    loop {
        let (mut r, _handler) = pubsub_client
            .logs_subscribe(
                RpcTransactionLogsFilter::Mentions(vec![program_id.to_string()]),
                RpcTransactionLogsConfig {
                    commitment: Some(CommitmentConfig::processed()),
                }
            ).await
            .unwrap();
        while let Some(event) = r.next().await {
            let log: String = event.value.logs.join(" ");
            for w in log.split(' ') {
                let decoded = general_purpose::STANDARD.decode(w);
                if decoded.is_err() {
                    continue;
                }
                let decoded = decoded.unwrap();
                if decoded.len() < 8 {
                    continue;
                }
                if decoded[..8] != E::DISCRIMINATOR {
                    continue;
                }

                if let Ok(event) = E::try_from_slice(&decoded[8..]) {
                    async_fn(
                        client.clone(),
                        quote_key.clone(),
                        enclave_key.clone(),
                        payer.clone(),
                        event
                    ).await;
                }
            }
        }
    }
}
