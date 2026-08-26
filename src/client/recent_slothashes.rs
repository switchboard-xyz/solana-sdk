use anyhow::Context;
use anyhow::Error as AnyhowError;
use arrayref::array_ref;
use bytemuck;
use crate::solana_compat::solana_client::nonblocking::rpc_client::RpcClient;
use crate::solana_compat::solana_sdk::commitment_config::CommitmentConfig;
use std::result::Result;

#[repr(C)]
#[derive(bytemuck::Pod, bytemuck::Zeroable, Debug, Clone, Copy)]
pub struct SlotHash {
    pub slot: u64,
    pub hash: [u8; 32],
}

impl SlotHash {
    /// Returns the base58-encoded hash as a `String`.
    pub fn to_base58_hash(&self) -> String {
        bs58::encode(self.hash).into_string()
    }
}

pub struct SlotHashSysvar;
impl SlotHashSysvar {
    pub async fn get_latest_slothash(client: &RpcClient) -> Result<SlotHash, AnyhowError> {
        let slot_hashes_id = crate::solana_sdk::sysvar::slot_hashes::ID;
        // `get_account_with_config` is deprecated on solana-rpc-client v3. Its suggested
        // replacement, `get_ui_account_with_config`, returns a `UiAccount` (needing an extra
        // `.decode()`) rather than raw bytes. `get_account_with_commitment` is the stable
        // equivalent: same `Account` (raw `Vec<u8>` data), and the old config only set
        // `commitment: confirmed` anyway.
        let slots_data = client
            .get_account_with_commitment(
                &slot_hashes_id.to_bytes().into(),
                CommitmentConfig::confirmed(),
            )
            .await
            .context("Failed to fetch slot hashes")?
            .value
            .context("Failed to fetch slot hashes")?
            .data;
        let slots: &[u8] = array_ref![slots_data, 8, 20_480];
        // 20_480 / 40 = 512
        let slots: &[SlotHash] = bytemuck::cast_slice::<u8, SlotHash>(slots);
        Ok(slots[0])
    }
}
