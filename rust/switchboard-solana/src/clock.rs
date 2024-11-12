use switchboard_common::SbError;
use futures::TryFutureExt;
use crate::solana_sdk::clock::Clock;

pub async fn fetch_async(
    client: &solana_client::nonblocking::rpc_client::RpcClient,
) -> std::result::Result<Clock, switchboard_common::SbError> {
    let pubkey = crate::solana_sdk::sysvar::clock::id();
    let data = client
        .get_account_data(&pubkey)
        .map_err(|_| SbError::AccountNotFound)
        .await?
        .to_vec();
    bincode::deserialize(&data).map_err(|_| SbError::AccountNotFound)
}
