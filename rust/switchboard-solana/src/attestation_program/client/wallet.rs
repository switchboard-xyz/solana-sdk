use crate::*;

use kv_log_macro::{info};
use solana_sdk::signer::Signer;


impl SwitchboardWallet {
    pub fn from_seed(attestation_queue: Pubkey, authority: Pubkey, name: Vec<u8>) -> Pubkey {
        Self::derive_key(NativeMint::ID, attestation_queue, authority, name)
    }

    pub fn fetch(
        client: &solana_client::rpc_client::RpcClient,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::SbError> {
        crate::client::fetch_borsh_account(client, pubkey)
    }

    pub async fn fetch_async(
        client: &solana_client::nonblocking::rpc_client::RpcClient,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::SbError> {
        crate::client::fetch_borsh_account_async(client, pubkey).await
    }

    pub fn fetch_sync<T: solana_sdk::client::SyncClient>(
        client: &T,
        pubkey: Pubkey,
    ) -> std::result::Result<Self, switchboard_common::SbError> {
        crate::client::fetch_borsh_account_sync(client, pubkey)
    }

    pub async fn get_or_create_from_seed(
        rpc: &solana_client::nonblocking::rpc_client::RpcClient,
        payer: std::sync::Arc<Keypair>,
        attestation_queue: Pubkey,
        seed: Option<Vec<u8>>,
    ) -> Result<Pubkey, SbError> {
        let name_seed = seed.unwrap_or(b"default".to_vec());
        if name_seed.len() != 32 {
            return Err(SbError::Message("InvalidSeed"));
        }
        let wallet_pubkey = Self::from_seed(attestation_queue, payer.pubkey(), name_seed.clone());

        if let Err(SbError::AccountNotFound) =
            SwitchboardWallet::fetch_async(rpc, wallet_pubkey).await
        {
            info!(
                "[Wallet] creating new switchboard wallet account {} ...",
                wallet_pubkey
            );

            let wallet_init_ixn = WalletInit::build_ix(
                &SwitchboardWalletInitAccounts {
                    wallet: wallet_pubkey,
                    attestation_queue,
                    authority: payer.pubkey(),
                    payer: payer.pubkey(),
                },
                &WalletInitParams {
                    name: name_seed,
                    max_len: [0u8; 4],
                },
            )
            .unwrap();

            println!(
                "[Wallet] ({}) {:?}",
                wallet_init_ixn.data.len(),
                wallet_init_ixn.data
            );

            let tx = crate::ix_to_tx(
                &[wallet_init_ixn],
                &[&*payer],
                rpc.get_latest_blockhash().await.unwrap_or_default(),
            )
            .unwrap();

            let signature = rpc.send_and_confirm_transaction(&tx).await.unwrap();

            info!(
                "[Wallet] switchboard wallet {} initialized. Tx Signature: {}",
                wallet_pubkey, signature
            );
        };

        // TODO: fetch wallet state and balance and send a fund ixn if below a given threshold

        Ok(wallet_pubkey)
    }
}

pub struct SwitchboardWalletInitAccounts {
    pub wallet: Pubkey,
    pub payer: Pubkey,
    pub attestation_queue: Pubkey,
    pub authority: Pubkey,
}
impl ToAccountMetas for SwitchboardWalletInitAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta::new(self.wallet, false),
            AccountMeta::new_readonly(NativeMint::ID, false),
            AccountMeta::new_readonly(self.authority, false),
            AccountMeta::new_readonly(self.attestation_queue, false),
            AccountMeta::new(
                find_associated_token_address(&self.wallet, &NativeMint::id()),
                false,
            ),
            AccountMeta::new(self.payer, true),
            AccountMeta::new_readonly(AttestationProgramState::get_pda(), false), // TODO: remove
            AccountMeta::new_readonly(anchor_spl::token::ID, false),
            AccountMeta::new_readonly(anchor_spl::associated_token::ID, false),
            AccountMeta::new_readonly(anchor_lang::system_program::ID, false),
        ]
    }
}
