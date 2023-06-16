use crate::prelude::*;
use solana_sdk::signer::keypair::{keypair_from_seed, Keypair};
use std::env;
use std::result::Result;
use std::str::FromStr;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

pub fn load_env_pubkey(key: &str) -> Result<Pubkey, SwitchboardClientError> {
    Pubkey::from_str(&env::var(key).unwrap())
        .map_err(|_| SwitchboardClientError::EnvVariableMissing(key.to_string()))
}

pub fn generate_signer() -> Arc<Keypair> {
    let mut randomness = [0; 32];
    switchboard_common::Gramine::read_rand(&mut randomness).unwrap();
    Arc::new(keypair_from_seed(&randomness).unwrap())
}

pub fn signer_to_pubkey(
    signer: Arc<Keypair>,
) -> std::result::Result<Pubkey, SwitchboardClientError> {
    let pubkey = Pubkey::from_str(signer.to_base58_string().as_str()).map_err(|_| {
        SwitchboardClientError::CustomMessage("failed to parse pubkey string".to_string())
    })?;
    Ok(pubkey)
}

pub async fn load_account<T: bytemuck::Pod + Discriminator + Owner>(
    client: &solana_client::rpc_client::RpcClient,
    pubkey: Pubkey,
) -> Result<T, SwitchboardClientError> {
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| SwitchboardClientError::CustomMessage("AnchorParseError".to_string()))?;

    if data.len() < T::discriminator().len() {
        return Err(SwitchboardClientError::CustomMessage(
            "no discriminator found".to_string(),
        ));
    }

    let mut disc_bytes = [0u8; 8];
    disc_bytes.copy_from_slice(&data[..8]);
    if disc_bytes != AggregatorAccountData::discriminator() {
        return Err(SwitchboardClientError::CustomMessage(
            "Discriminator error, check the account type".to_string(),
        ));
    }

    Ok(*bytemuck::try_from_bytes::<T>(&data[8..])
        .map_err(|_| SwitchboardClientError::CustomMessage("AnchorParseError".to_string()))?)
}

pub fn unix_timestamp() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
        .try_into()
        .unwrap_or(0)
}
