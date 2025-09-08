use borsh::BorshSerialize;
use solana_program::pubkey::Pubkey;
use solana_sdk_ids::system_program;
use switchboard_common::cfg_client;

use crate::anchor_traits::*;
use crate::find_lut_signer;
use crate::prelude::*;

/// Queue address lookup table reset instruction
pub struct QueueResetLut {}

/// Parameters for queue address lookup table reset instruction
#[derive(Clone, BorshSerialize, Debug)]
pub struct QueueResetLutParams {
    /// Recent slot number for the reset
    pub recent_slot: u64,
}

impl InstructionData for QueueResetLutParams {}
const DISCRIMINATOR: &[u8] = &[126, 234, 176, 75, 38, 211, 204, 53];
impl Discriminator for QueueResetLut {
    const DISCRIMINATOR: &[u8] = DISCRIMINATOR;
}
impl Discriminator for QueueResetLutParams {
    const DISCRIMINATOR: &[u8] = DISCRIMINATOR;
}

/// Arguments for building a queue address lookup table reset instruction
#[derive(Clone, BorshSerialize, Debug)]
pub struct QueueResetLutArgs {
    /// Queue account public key
    pub queue: Pubkey,
    /// Authority account public key
    pub authority: Pubkey,
    /// Payer account public key
    pub payer: Pubkey,
    /// Recent slot number for the reset
    pub recent_slot: u64,
}

/// Account metas for queue address lookup table reset instruction
pub struct QueueResetLutAccounts {
    /// Queue account public key
    pub queue: Pubkey,
    /// Authority account public key
    pub authority: Pubkey,
    /// Payer account public key
    pub payer: Pubkey,
    /// Recent slot number for the reset
    pub recent_slot: u64,
}

impl ToAccountMetas for QueueResetLutAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        let program_state = State::get_pda();
        let system_program = system_program::id();
        let address_lookup_table_program = solana_program::address_lookup_table::program::id();
        let lut_signer = find_lut_signer(&self.queue);

        fn derive_lookup_table_address(
            authority_address: &Pubkey,
            recent_block_slot: u64,
        ) -> (Pubkey, u8) {
            Pubkey::find_program_address(
                &[authority_address.as_ref(), &recent_block_slot.to_le_bytes()],
                &solana_program::address_lookup_table::program::id(),
            )
        }

        vec![
            AccountMeta::new(self.queue, false),
            AccountMeta::new_readonly(self.authority, true),
            AccountMeta::new(self.payer, true),
            AccountMeta::new_readonly(system_program.to_bytes().into(), false),
            AccountMeta::new_readonly(program_state, false),
            AccountMeta::new_readonly(lut_signer, false),
            AccountMeta::new(
                derive_lookup_table_address(&lut_signer, self.recent_slot).0,
                false,
            ),
            AccountMeta::new_readonly(address_lookup_table_program.to_bytes().into(), false),
        ]
    }
}

cfg_client! {
use solana_client::nonblocking::rpc_client::RpcClient;
// use crate::get_sb_program_id; // Commented out due to unused import
use solana_program::address_lookup_table::AddressLookupTableAccount;

// fn derive_lookup_table_address(authority_address: &Pubkey, recent_block_slot: u64) -> (Pubkey, u8) {
//     Pubkey::find_program_address(
//         &[authority_address.as_ref(), &recent_block_slot.to_le_bytes()],
//         &solana_program::address_lookup_table::program::id(),
//     )
// }

impl QueueResetLut {
    // TODO: Fix serialization errors - commented out due to missing trait implementations
    /*
    pub async fn build_ix(client: &RpcClient, args: QueueResetLutArgs) -> Result<Instruction, OnDemandError> {
        let pid = if crate::utils::is_devnet() {
            get_sb_program_id("devnet")
        } else {
            get_sb_program_id("mainnet")
        };

        let lut_signer = find_lut_signer(&args.queue);
        let (lut_address, _) = derive_lookup_table_address(&lut_signer, args.recent_slot);

        let program_state = State::get_pda();
        let system_program = system_program::id();
        let address_lookup_table_program = solana_program::address_lookup_table::program::id();

        let accounts = vec![
            AccountMeta::new(args.queue, false),
            AccountMeta::new_readonly(args.authority, true),
            AccountMeta::new(args.payer, true),
            AccountMeta::new_readonly(system_program.to_bytes().into(), false),
            AccountMeta::new_readonly(program_state, false),
            AccountMeta::new_readonly(lut_signer, false),
            AccountMeta::new(lut_address, false),
            AccountMeta::new_readonly(address_lookup_table_program.to_bytes().into(), false),
        ];

        Ok(Instruction {
            program_id: pid,
            accounts,
            data: [
                QueueResetLut::DISCRIMINATOR,
                &QueueResetLutParams {
                    recent_slot: args.recent_slot,
                }.try_to_vec().map_err(|_| OnDemandError::SerializationError)?
            ].concat(),
        })
    }
    */

    pub async fn fetch_luts(client: &RpcClient, args: QueueResetLutArgs) -> Result<Vec<AddressLookupTableAccount>, OnDemandError> {
        let queue_data = QueueAccountData::fetch_async(client, args.queue).await?;
        let queue_lut = queue_data.fetch_lut(&args.queue, client).await?;

        Ok(vec![queue_lut])
    }
}
}
