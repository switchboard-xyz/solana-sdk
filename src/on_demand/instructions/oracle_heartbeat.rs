use borsh::BorshSerialize;
use solana_program::pubkey::Pubkey;
use solana_sdk_ids::system_program;
use spl_token;

use crate::anchor_traits::*;
use crate::cfg_client;
use crate::prelude::*;

/// Oracle heartbeat instruction
pub struct OracleHeartbeat {}

/// Parameters for oracle heartbeat instruction
#[derive(Clone, BorshSerialize, Debug)]
pub struct OracleHeartbeatParams {
    /// Optional URI for the oracle endpoint (64 bytes)
    pub uri: Option<[u8; 64]>,
}

impl InstructionData for OracleHeartbeatParams {}

impl Discriminator for OracleHeartbeat {
    const DISCRIMINATOR: &'static [u8] = &[10, 175, 217, 130, 111, 35, 117, 54];
}
impl Discriminator for OracleHeartbeatParams {
    const DISCRIMINATOR: &'static [u8] = OracleHeartbeat::DISCRIMINATOR;
}

/// Arguments for building an oracle heartbeat instruction
pub struct OracleHeartbeatArgs {
    /// Oracle account public key
    pub oracle: Pubkey,
    /// Oracle signer public key
    pub oracle_signer: Pubkey,
    /// Queue account public key
    pub queue: Pubkey,
    /// Queue authority public key
    pub queue_authority: Pubkey,
    /// Garbage collection node public key
    pub gc_node: Pubkey,
    /// Optional URI for the oracle endpoint (64 bytes)
    pub uri: Option<[u8; 64]>,
    /// Feeds or randomness accounts awaiting payment
    pub pending_paid_accounts: Vec<Pubkey>,
    /// Escrow accounts for the pending paid accounts
    pub escrows: Vec<Pubkey>,
    /// Payer account public key
    pub payer: Pubkey,
}
/// Account metas for oracle heartbeat instruction
pub struct OracleHeartbeatAccounts {
    /// Oracle account public key
    pub oracle: Pubkey,
    /// Oracle signer public key
    pub oracle_signer: Pubkey,
    /// Queue account public key
    pub queue: Pubkey,
    /// Queue authority public key
    pub queue_authority: Pubkey,
    /// Garbage collection node public key
    pub gc_node: Pubkey,
    /// Payer account public key
    pub payer: Pubkey,
    /// Stake program public key
    pub stake_program: Pubkey,
    /// Delegation pool public key
    pub delegation_pool: Pubkey,
    /// Delegation group public key
    pub delegation_group: Pubkey,
    /// SWITCH mint public key
    pub switch_mint: Pubkey,
}
impl ToAccountMetas for OracleHeartbeatAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        let state_pubkey = State::get_pda();
        // global subsidy vault
        let subsidy_vault = get_associated_token_address(&state_pubkey, &self.switch_mint);
        let queue_escrow = get_associated_token_address(&self.queue, &spl_token::native_mint::ID);
        let (oracle_wsol_reward_pool_escrow, _) = Pubkey::find_program_address(
            &[
                b"RewardPool",
                &self.delegation_pool.to_bytes(),
                &spl_token::native_mint::ID.to_bytes(),
            ],
            &self.stake_program,
        );
        let (oracle_switch_reward_pool_escrow, _) = Pubkey::find_program_address(
            &[
                b"RewardPool",
                &self.delegation_pool.to_bytes(),
                &self.switch_mint.to_bytes(),
            ],
            &self.stake_program,
        );
        vec![
            AccountMeta::new(self.oracle, false),
            AccountMeta::new(OracleAccountData::stats_key(&self.oracle), false),
            AccountMeta::new_readonly(self.oracle_signer, true),
            AccountMeta::new(self.queue, false),
            AccountMeta::new(self.gc_node, false),
            AccountMeta::new(state_pubkey, false),
            AccountMeta::new(self.payer, true),
            AccountMeta::new_readonly(system_program::id().to_bytes().into(), false),
            AccountMeta::new_readonly(spl_token::ID, false),
            AccountMeta::new_readonly(spl_token::native_mint::ID, false),
            AccountMeta::new(queue_escrow, false),
            AccountMeta::new_readonly(self.stake_program, false),
            AccountMeta::new(self.delegation_pool, false),
            AccountMeta::new(self.delegation_group, false),
            // ========================================
            // Too many for anchor ctx, rest must be passed as remaining accounts
            AccountMeta::new(subsidy_vault, false),
            AccountMeta::new(oracle_wsol_reward_pool_escrow, false),
            AccountMeta::new(oracle_switch_reward_pool_escrow, false),
        ]
    }
}

cfg_client! {
use solana_client::nonblocking::rpc_client::RpcClient;
use crate::get_sb_program_id;

impl OracleHeartbeat {
    /// Builds an oracle heartbeat instruction asynchronously
    pub async fn build_ix(client: &RpcClient, args: OracleHeartbeatArgs) -> Result<Instruction, OnDemandError> {
        let state_key = State::get_pda();
        let state = State::fetch_async(client).await?;
        let (delegation_pool, _) = Pubkey::find_program_address(
            &[
                b"Delegation",
                &state_key.to_bytes(),
                &OracleAccountData::stats_key(&args.oracle).to_bytes(),
                &state.stake_pool.to_bytes(),
            ],
            &state.stake_program,
        );
        let (delegation_group, _) = Pubkey::find_program_address(
            &[
                b"Group",
                &state_key.to_bytes(),
                &state.stake_pool.to_bytes(),
                &args.queue.to_bytes(),
            ],
            &state.stake_program,
        );
        let pid = if crate::utils::is_devnet() {
            get_sb_program_id("devnet")
        } else {
            get_sb_program_id("mainnet")
        };
        let mut ix = crate::utils::build_ix(
            &pid,
            &OracleHeartbeatAccounts {
                oracle: args.oracle,
                oracle_signer: args.oracle_signer,
                queue: args.queue,
                queue_authority: args.queue_authority,
                gc_node: args.gc_node,
                payer: args.payer,
                stake_program: state.stake_program,
                delegation_pool,
                delegation_group,
                switch_mint: state.switch_mint,
            },
            &OracleHeartbeatParams { uri: args.uri },
        );
        for ppa in args.pending_paid_accounts {
            ix.accounts.push(AccountMeta::new_readonly(ppa, false));
        }
        for escrow in args.escrows {
            ix.accounts.push(AccountMeta::new(escrow, false));
        }
        Ok(ix)
    }
}
}
