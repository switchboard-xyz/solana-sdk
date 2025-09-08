use borsh::BorshSerialize;
use solana_program::pubkey::Pubkey;
use solana_sdk_ids::system_program;
use switchboard_common::cfg_client;

use crate::anchor_traits::*;
use crate::prelude::*;

/// Queue reward payment instruction
pub struct QueuePayReward {}

/// Parameters for queue reward payment instruction
#[derive(Clone, BorshSerialize, Debug)]
pub struct QueuePayRewardParams {}

impl InstructionData for QueuePayRewardParams {}
const DISCRIMINATOR: &[u8] = &[42, 168, 3, 251, 144, 57, 105, 201];
impl Discriminator for QueuePayReward {
    const DISCRIMINATOR: &[u8] = DISCRIMINATOR;
}
impl Discriminator for QueuePayRewardParams {
    const DISCRIMINATOR: &[u8] = DISCRIMINATOR;
}

/// Arguments for building a queue reward payment instruction
#[derive(Clone, BorshSerialize, Debug)]
pub struct QueuePayRewardArgs {
    /// Queue account public key
    pub queue: Pubkey,
    /// Oracle account public key
    pub oracle: Pubkey,
    /// Payer account public key
    pub payer: Pubkey,
}

/// Account metas for queue reward payment instruction
pub struct QueuePayRewardAccounts {
    /// Queue account public key
    pub queue: Pubkey,
    /// Oracle account public key
    pub oracle: Pubkey,
    /// SWITCH mint public key
    pub switch_mint: Pubkey,
    /// Payer account public key
    pub payer: Pubkey,
    /// Additional account metas required for the instruction
    pub remaining_accounts: Vec<AccountMeta>,
}

impl ToAccountMetas for QueuePayRewardAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        let program_state = State::get_pda();
        let token_program = spl_token::id();
        let associated_token_program = spl_associated_token_account::id();
        let system_program = system_program::id();
        let wsol_mint = spl_token::native_mint::id();
        let oracle_stats = OracleAccountData::stats_key(&self.oracle);

        let mut accounts = vec![
            AccountMeta::new(self.queue, false),
            AccountMeta::new_readonly(program_state, false),
            AccountMeta::new_readonly(system_program.to_bytes().into(), false),
            AccountMeta::new_readonly(self.oracle, false),
            AccountMeta::new(oracle_stats, false),
            AccountMeta::new_readonly(token_program, false),
            AccountMeta::new_readonly(associated_token_program.to_bytes().into(), false),
            AccountMeta::new_readonly(wsol_mint, false),
            AccountMeta::new_readonly(self.switch_mint, false),
            AccountMeta::new(self.payer, true),
        ];
        accounts.extend(self.remaining_accounts.clone());
        accounts
    }
}

cfg_client! {
use solana_client::nonblocking::rpc_client::RpcClient;
use crate::get_sb_program_id;
use solana_program::address_lookup_table::AddressLookupTableAccount;

impl QueuePayReward {
    pub async fn build_ix(client: &RpcClient, args: QueuePayRewardArgs) -> Result<Instruction, OnDemandError> {
        let state = State::fetch_async(client).await?;
        let switch_mint = state.switch_mint;
        let pid = if crate::utils::is_devnet() {
            get_sb_program_id("devnet")
        } else {
            get_sb_program_id("mainnet")
        };

        let oracle_data = OracleAccountData::fetch_async(client, args.oracle).await?;
        let operator = oracle_data.operator;
        let mut remaining_accounts = vec![];

        if operator != Pubkey::default() {
            let operator_reward_wallet = get_associated_token_address(&operator, &switch_mint);
            remaining_accounts.push(AccountMeta::new_readonly(operator, false));
            remaining_accounts.push(AccountMeta::new(operator_reward_wallet, false));
        }

        Ok(crate::utils::build_ix(
            &pid,
            &QueuePayRewardAccounts {
                queue: args.queue,
                oracle: args.oracle,
                switch_mint: state.switch_mint,
                remaining_accounts,
                payer: args.payer,
            },
            &QueuePayRewardParams { },
        ))
    }

    pub async fn fetch_luts(client: &RpcClient, args: QueuePayRewardArgs) -> Result<Vec<AddressLookupTableAccount>, OnDemandError> {
        let queue_data = QueueAccountData::fetch_async(client, args.queue).await?;
        let queue_lut = queue_data.fetch_lut(&args.queue, client).await?;

        let oracle_data = OracleAccountData::fetch_async(client, args.oracle).await?;
        let mut luts = vec![queue_lut];

        if let Ok(oracle_lut) = oracle_data.fetch_lut(&args.oracle, client).await {
            luts.push(oracle_lut);
        }

        Ok(luts)
    }
}
}
