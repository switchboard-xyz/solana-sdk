use anchor_lang::prelude::*;
use solana_sdk::signer::keypair::Keypair;
use std::result::Result;
use std::str::FromStr;
use std::sync::Arc;

pub fn to_pubkey(signer: Arc<Keypair>) -> std::result::Result<Pubkey, switchboard_common::Error> {
    let pubkey = Pubkey::from_str(signer.to_base58_string().as_str()).map_err(|_| {
        switchboard_common::Error::CustomMessage("failed to parse pubkey string".to_string())
    })?;
    Ok(pubkey)
}

pub async fn load_account<T: bytemuck::Pod>(
    client: &solana_client::rpc_client::RpcClient,
    pubkey: Pubkey,
) -> Result<T, switchboard_common::Error> {
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| switchboard_common::Error::CustomMessage("AnchorParseError".to_string()))?;
    Ok(*bytemuck::try_from_bytes::<T>(&data[8..])
        .map_err(|_| switchboard_common::Error::CustomMessage("AnchorParseError".to_string()))?)
}
