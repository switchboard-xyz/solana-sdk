use borsh::BorshSerialize;
use solana_program::address_lookup_table::program::ID as address_lookup_table_program;
use solana_program::pubkey::Pubkey;
use solana_sdk_ids::system_program;

use crate::anchor_traits::*;
use crate::cfg_client;
use crate::prelude::*;

/// Oracle address lookup table reset instruction
pub struct OracleResetLut {}

/// Parameters for oracle address lookup table reset instruction
#[derive(Clone, BorshSerialize, Debug)]
pub struct OracleResetLutParams {
    /// Recent slot number for the reset
    pub recent_slot: u64,
}

impl InstructionData for OracleResetLutParams {}

impl Discriminator for OracleResetLut {
    const DISCRIMINATOR: &'static [u8] = &[147, 244, 108, 198, 152, 219, 0, 22];
}
impl Discriminator for OracleResetLutParams {
    const DISCRIMINATOR: &'static [u8] = OracleResetLut::DISCRIMINATOR;
}

/// Arguments for building an oracle address lookup table reset instruction
pub struct OracleResetLutArgs {
    /// Oracle account public key
    pub oracle: Pubkey,
    /// Payer account public key
    pub payer: Pubkey,
    /// Recent slot number for the reset
    pub recent_slot: u64,
}
/// Account metas for oracle address lookup table reset instruction
pub struct OracleResetLutAccounts {
    /// Oracle account public key
    pub oracle: Pubkey,
    /// Authority account public key
    pub authority: Pubkey,
    /// Payer account public key
    pub payer: Pubkey,
    /// System program public key
    pub system_program: Pubkey,
    /// Global state account public key
    pub state: Pubkey,
    /// Address lookup table signer account
    pub lut_signer: Pubkey,
    /// Address lookup table account
    pub lut: Pubkey,
    /// Address lookup table program public key
    pub address_lookup_table_program: Pubkey,
}
impl ToAccountMetas for OracleResetLutAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        let state_pubkey = State::get_pda();
        vec![
            AccountMeta::new(self.oracle, false),
            AccountMeta::new_readonly(self.authority, true),
            AccountMeta::new(self.payer, false),
            AccountMeta::new_readonly(system_program::ID.to_bytes().into(), false),
            AccountMeta::new_readonly(state_pubkey, false),
            AccountMeta::new_readonly(self.lut_signer, false),
            AccountMeta::new(self.lut, false),
            AccountMeta::new_readonly(address_lookup_table_program, false),
        ]
    }
}

cfg_client! {
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::address_lookup_table::instruction::derive_lookup_table_address;
use crate::get_sb_program_id;
use crate::find_lut_signer;

impl OracleResetLut {
    pub async fn build_ix(client: &RpcClient, args: OracleResetLutArgs) -> Result<Instruction, OnDemandError> {
        let oracle_data = OracleAccountData::fetch_async(client, args.oracle).await?;
        let authority = oracle_data.authority;
        let payer = oracle_data.authority;
        let lut_signer = find_lut_signer(&args.oracle);
        let lut = derive_lookup_table_address(&lut_signer, args.recent_slot).0;
        let pid = if crate::utils::is_devnet() {
            get_sb_program_id("devnet")
        } else {
            get_sb_program_id("mainnet")
        };
        let ix = crate::utils::build_ix(
            &pid,
            &OracleResetLutAccounts {
                oracle: args.oracle,
                state: State::get_pda(),
                authority,
                lut_signer,
                lut,
                address_lookup_table_program,
                payer,
                system_program: system_program::ID.to_bytes().into(),
            },
            &OracleResetLutParams {
                recent_slot: args.recent_slot,
            }
        );
        Ok(ix)
    }
}
}
