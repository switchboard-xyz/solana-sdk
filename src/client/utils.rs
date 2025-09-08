use crate::prelude::*;
use anyhow::anyhow;
use sha2::{Digest, Sha256};
use solana_client::nonblocking::rpc_client::RpcClient as NonblockingRpcClient;
use solana_sdk::client::SyncClient;
use solana_sdk::signer::keypair::{keypair_from_seed, read_keypair_file, Keypair};
use solana_sdk::signer::Signer;
use std::env;
use std::result::Result;
use std::str::FromStr;
use std::sync::Arc;
use tokio::sync::RwLock;
use solana_sdk::transaction::Transaction;
use solana_program::message::Message;
use crate::anchor_traits::*;
use solana_program::pubkey::Pubkey;
use anchor_client::anchor_lang::AccountDeserialize;
use anyhow::Error as AnyhowError;
use solana_sdk::message::v0::Message as V0Message;
use solana_sdk::transaction::VersionedTransaction;
use solana_sdk::compute_budget::ComputeBudgetInstruction;
use solana_program::hash::Hash;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::address_lookup_table::AddressLookupTableAccount;
use solana_program::message::VersionedMessage::V0;

pub async fn ix_to_tx_v0(
    rpc_client: &RpcClient,
    ixs: &[Instruction],
    signers: &[&Keypair],
    blockhash: Hash,
    luts: &[AddressLookupTableAccount],
) -> Result<VersionedTransaction, OnDemandError> {
    let payer = signers[0].pubkey();

    // Auto-detect Compute Unit Limit
    let compute_unit_limit = estimate_compute_units(rpc_client, ixs, luts, blockhash, signers).await.unwrap_or(1_400_000); // Default to 1.4M units if estimate fails

    // Add Compute Budget Instruction (Optional but improves execution)
    let cus = std::cmp::min((compute_unit_limit as f64 * 1.4) as u32, 1_400_000);
    let compute_budget_ix = ComputeBudgetInstruction::set_compute_unit_limit(cus);
    // TODO: make dynamic
    let priority_fee_ix = ComputeBudgetInstruction::set_compute_unit_price(10_000);
    let mut final_ixs = vec![
        compute_budget_ix,
        priority_fee_ix,
    ];
    final_ixs.extend_from_slice(ixs);

    // Create Message with Address Lookup Tables (ALTs)
    let message = V0Message::try_compile(&payer, &final_ixs, luts, blockhash)
        .map_err(|_| OnDemandError::SolanaSignError)?;

    let message = V0(message);
    // if message.header().num_required_signatures as usize != signers.len() {
        // // Skips all signature validation
        // return Ok(VersionedTransaction {
            // message: message,
            // signatures: vec![],
        // })
    // }
    // Create Versioned Transaction
    let tx = VersionedTransaction::try_new(message, signers)
        .map_err(|_| OnDemandError::SolanaSignError)?;

    Ok(tx)
}

/// Estimates Compute Unit Limit for Instructions
async fn estimate_compute_units(rpc_client: &RpcClient, ixs: &[Instruction], luts: &[AddressLookupTableAccount], blockhash: Hash, signers: &[&Keypair]) -> Result<u32, AnyhowError> {
    let payer = signers[0].pubkey();
    let mut ixs = ixs.to_vec();
    ixs.insert(0, ComputeBudgetInstruction::set_compute_unit_limit(1_400_000).into());
    let message = V0Message::try_compile(&payer, &ixs, luts, blockhash)
        .map_err(|_| OnDemandError::SolanaSignError)?;

    // Create Versioned Transaction
    let tx = VersionedTransaction::try_new(V0(message), signers)
        .map_err(|_| OnDemandError::SolanaSignError)?;
    // Simulate Transaction to Estimate Compute Usage
    let sim_result = rpc_client.simulate_transaction(&tx)
        .await
        .map_err(|_| anyhow!("Failed to simulate transaction"))?;

    if let Some(units) = sim_result.value.units_consumed {
        Ok(units as u32)
    } else {
        Err(anyhow!("Failed to estimate compute units"))
    }
}

pub fn ix_to_tx(
    ixs: &[Instruction],
    signers: &[&Keypair],
    blockhash: solana_program::hash::Hash,
) -> Result<Transaction, OnDemandError> {
    let msg = Message::new(ixs, Some(&signers[0].pubkey()));
    let mut tx = Transaction::new_unsigned(msg);
    tx.try_sign(&signers.to_vec(), blockhash)
        .map_err(|_e| OnDemandError::SolanaSignError)?;
    Ok(tx)
}

pub async fn get_enclave_signer_pubkey(
    enclave_signer: &Arc<RwLock<Keypair>>,
) -> Result<Arc<Pubkey>, OnDemandError> {
    let enclave_signer = enclave_signer.clone();
    let ro_enclave_signer = enclave_signer.read().await;
    let pubkey = Arc::new(ro_enclave_signer.pubkey());
    Ok(pubkey)
}

pub fn load_env_pubkey(key: &str) -> Result<Pubkey, OnDemandError> {
    Pubkey::from_str(&env::var(key).unwrap_or_default())
        .map_err(|_| OnDemandError::EnvVariableMissing)
}

/// Parse a string into an optional Pubkey. If the string is empty, return None.
pub fn parse_optional_pubkey(var: &str) -> Option<Pubkey> {
    if var.is_empty() {
        None
    } else {
        match Pubkey::from_str(var) {
            Ok(pubkey) => {
                if pubkey != Pubkey::default() {
                    Some(pubkey)
                } else {
                    None
                }
            }
            Err(_) => None,
        }
    }
}

/// Generates a keypair from a base seed, secret key, optional additional bytes, and an optional program ID.
///
/// # Arguments
///
/// * `base` - The base seed as a string.
/// * `secret_key` - The secret key as a vector of bytes.
/// * `more_bytes` - Optional additional bytes to include in the seed.
/// * `program_id` - Optional program ID to include in the seed.
///
/// # Returns
///
/// Returns a `Result` containing an `Arc<Keypair>` if the keypair is successfully derived, or an `OnDemandError` if there is an error.
///
/// # Errors
///
/// Returns an `OnDemandError` with the message "InvalidSecretKey" if the length of the secret key is not 32 bytes.
/// Returns an `OnDemandError` with the message "Failed to derive keypair" if there is an error deriving the keypair.
///
/// # Example
///
/// ```rust
/// use solana_sdk::pubkey::Pubkey;
/// use solana_sdk::signature::{Keypair, keypair_from_seed};
/// use solana_sdk::hash::Hash;
/// use sha2::{Digest, Sha256};
/// use std::sync::Arc;
/// use switchboard_solana::OnDemandError;
///
/// let base = "base_seed";
/// let secret_key = vec![0; 32];
/// let more_bytes = Some(vec![1, 2, 3]);
/// let program_id = Some(Pubkey::new_unique());
///
/// let result = switchboard_solana::client::utils::keypair_from_base_seed(base, secret_key, more_bytes, program_id);
/// match result {
///     Ok(keypair) => {
///         // Key pair successfully derived
///         println!("Derived keypair: {:?}", keypair);
///     }
///     Err(error) => {
///         // Error deriving key pair
///         println!("Failed to derive keypair: {:?}", error);
///     }
/// }
/// ```
pub fn keypair_from_base_seed(
    base: &str,
    secret_key: Vec<u8>,
    more_bytes: Option<Vec<u8>>,
    program_id: Option<Pubkey>,
) -> Result<Arc<Keypair>, OnDemandError> {
    if secret_key.len() != 32 {
        return Err(OnDemandError::InvalidSecretKey);
    }

    let mut seed = base.as_bytes().to_vec();
    seed.extend_from_slice(&secret_key);

    if let Some(bytes) = more_bytes.as_ref() {
        seed.extend_from_slice(bytes);
    }

    // Optionally, allow the progam ID to be included in the bytes so we
    // can create new environments on different program IDs without collisions.
    if let Some(program_id) = program_id.as_ref() {
        seed.extend_from_slice(&borsh::to_vec(&program_id).unwrap_or_default());
    } else {
        seed.extend_from_slice(
            &borsh::to_vec(&crate::get_switchboard_on_demand_program_id())
                .unwrap_or_default(),
        );
    }

    match keypair_from_seed(&Sha256::digest(&seed)) {
        Ok(keypair) => Ok(Arc::new(keypair)),
        Err(e) => {
            if let Some(err) = e.source() {
                println!("Failed to derive keypair -- {}", err);
            }

            Err(OnDemandError::KeyDerivationFailed)
        }
    }
}

pub fn signer_to_pubkey(signer: Arc<Keypair>) -> std::result::Result<Pubkey, OnDemandError> {
    Ok(signer.pubkey())
}

pub fn load_keypair_fs(fs_path: &str) -> Result<Arc<Keypair>, OnDemandError> {
    match read_keypair_file(fs_path) {
        Ok(keypair) => Ok(Arc::new(keypair)),
        Err(e) => {
            if let Some(err) = e.source() {
                println!("Failed to read keypair file -- {}", err);
            }

            Err(OnDemandError::IoError)
        }
    }
}

/// Fetches a zero-copy account from the Solana blockchain.
///
/// # Arguments
///
/// * `client` - The Solana RPC client used to interact with the blockchain.
/// * `pubkey` - The public key of the account to fetch.
///
/// # Returns
///
/// Returns a result containing the fetched account data as the specified type `T`, or an `OnDemandError` if an error occurs.
///
/// # Errors
///
/// This function can return the following errors:
///
/// * `OnDemandError::AccountNotFound` - If the account with the specified public key is not found.
/// * `OnDemandError::Message("no discriminator found")` - If no discriminator is found in the account data.
/// * `OnDemandError::Message("Discriminator error, check the account type")` - If the discriminator in the account data does not match the expected discriminator for type `T`.
/// * `OnDemandError::Message("AnchorParseError")` - If an error occurs while parsing the account data into type `T`.
pub fn fetch_zerocopy_account<T: bytemuck::Pod + Discriminator + Owner>(
    client: &solana_client::rpc_client::RpcClient,
    pubkey: Pubkey,
) -> Result<T, OnDemandError> {
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| OnDemandError::AccountNotFound)?;

    if data.len() < T::discriminator().len() {
        return Err(OnDemandError::InvalidDiscriminator);
    }

    let mut disc_bytes = [0u8; 8];
    disc_bytes.copy_from_slice(&data[..8]);
    if disc_bytes != T::discriminator() {
        return Err(OnDemandError::InvalidDiscriminator);
    }

    Ok(*bytemuck::try_from_bytes::<T>(&data[8..])
        .map_err(|_| OnDemandError::AnchorParseError)?)
}

/// Fetches the account data synchronously from the Solana blockchain using the provided client.
///
/// # Arguments
///
/// * `client` - The client used to interact with the Solana blockchain.
/// * `pubkey` - The public key of the account to fetch.
///
/// # Generic Parameters
///
/// * `C` - The type of the client, which must implement the `SyncClient` trait.
/// * `T` - The type of the account data, which must implement the `bytemuck::Pod`, `Discriminator`, and `Owner` traits.
///
/// # Returns
///
/// Returns a `Result` containing the fetched account data of type `T` if successful, or an `OnDemandError` if an error occurs.
pub fn fetch_zerocopy_account_sync<C: SyncClient, T: bytemuck::Pod + Discriminator + Owner>(
    client: &C,
    pubkey: Pubkey,
) -> Result<T, OnDemandError> {
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| OnDemandError::AccountNotFound)?
        .ok_or(OnDemandError::AccountNotFound)?;

    if data.len() < T::discriminator().len() {
        return Err(OnDemandError::InvalidDiscriminator);
    }

    let mut disc_bytes = [0u8; 8];
    disc_bytes.copy_from_slice(&data[..8]);
    if disc_bytes != T::discriminator() {
        return Err(OnDemandError::InvalidDiscriminator);
    }

    Ok(*bytemuck::try_from_bytes::<T>(&data[8..])
        .map_err(|_| OnDemandError::AnchorParseError)?)
}

/// Fetches an account asynchronously using the provided client and public key.
///
/// # Arguments
///
/// * `client` - The non-blocking RPC client used to fetch the account.
/// * `pubkey` - The public key of the account to fetch.
///
/// # Generic Parameters
///
/// * `T` - The type of the account data. Must implement `bytemuck::Pod`, `Discriminator`, and `Owner`.
///
/// # Returns
///
/// Returns a `Result` containing the fetched account data of type `T` if successful, or an `OnDemandError` if an error occurs.
///
/// # Errors
///
/// This function can return the following errors:
///
/// * `OnDemandError::AccountNotFound` - If the account is not found.
/// * `OnDemandError::Message("no discriminator found")` - If no discriminator is found in the account data.
/// * `OnDemandError::Message("Discriminator error, check the account type")` - If the discriminator does not match the expected value.
/// * `OnDemandError::Message("AnchorParseError")` - If there is an error parsing the account data into type `T`.
///
/// # Example
///
/// ```rust
/// use switchboard_solana::client::NonblockingRpcClient;
/// use switchboard_solana::error::OnDemandError;
/// use switchboard_solana::types::{Discriminator, Owner};
/// use bytemuck::Pod;
/// use solana_sdk::pubkey::Pubkey;
///
/// async fn example(client: &NonblockingRpcClient, pubkey: Pubkey) -> Result<(), OnDemandError> {
///     let account_data: MyAccountType = fetch_zerocopy_account_async(client, pubkey).await?;
///     // Do something with the fetched account data...
///     Ok(())
/// }
/// ```
pub async fn fetch_zerocopy_account_async<T: bytemuck::Pod + Discriminator + Owner>(
    client: &NonblockingRpcClient,
    pubkey: Pubkey,
) -> Result<T, OnDemandError> {
    let data = client
        .get_account_data(&pubkey)
        .await
        .map_err(|_| OnDemandError::AccountNotFound)?;

    if data.len() < T::discriminator().len() {
        return Err(OnDemandError::InvalidDiscriminator);
    }

    let mut disc_bytes = [0u8; 8];
    disc_bytes.copy_from_slice(&data[..8]);
    if disc_bytes != T::discriminator() {
        return Err(OnDemandError::InvalidDiscriminator);
    }

    Ok(*bytemuck::try_from_bytes::<T>(&data[8..])
        .map_err(|_| OnDemandError::AnchorParseError)?)
}

pub fn fetch_borsh_account<T: Discriminator + Owner + AccountDeserialize>(
    client: &solana_client::rpc_client::RpcClient,
    pubkey: Pubkey,
) -> Result<T, OnDemandError> {
    let account_data = client
        .get_account_data(&pubkey)
        .map_err(|_| OnDemandError::AccountNotFound)?;

    T::try_deserialize(&mut account_data.as_slice())
        .map_err(|_| OnDemandError::AnchorParseError)
}

pub async fn fetch_borsh_account_async<T: Discriminator + Owner + AccountDeserialize>(
    client: &NonblockingRpcClient,
    pubkey: Pubkey,
) -> Result<T, OnDemandError> {
    let account_data = client
        .get_account_data(&pubkey)
        .await
        .map_err(|_| OnDemandError::AccountNotFound)?;

    T::try_deserialize(&mut account_data.as_slice())
        .map_err(|_| OnDemandError::AnchorParseError)
}

pub fn fetch_borsh_account_sync<C: SyncClient, T: Discriminator + Owner + AccountDeserialize>(
    client: &C,
    pubkey: Pubkey,
) -> Result<T, OnDemandError> {
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| OnDemandError::AccountNotFound)?
        .ok_or(OnDemandError::AccountNotFound)?;

    T::try_deserialize(&mut data.as_slice()).map_err(|_| OnDemandError::AnchorParseError)
}


// type GenericError = Box<dyn std::error::Error + Send + Sync>;
