use borsh::BorshSerialize;
use solana_program::account_info::AccountInfo;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use solana_program::sysvar::slot_hashes;

use crate::anchor_traits::*;
use crate::get_sb_program_id;
use crate::prelude::*;

/// Randomness commitment instruction
pub struct RandomnessCommit {}

/// Parameters for randomness commitment instruction
#[derive(Clone, BorshSerialize, Debug)]
pub struct RandomnessCommitParams {}

impl InstructionData for RandomnessCommitParams {}

const DISCRIMINATOR: &[u8] = &[52, 170, 152, 201, 179, 133, 242, 141];
impl Discriminator for RandomnessCommitParams {
    const DISCRIMINATOR: &[u8] = DISCRIMINATOR;
}

impl Discriminator for RandomnessCommit {
    const DISCRIMINATOR: &[u8] = DISCRIMINATOR;
}

/// Account metas for randomness commitment instruction
pub struct RandomnessCommitAccounts {
    /// Randomness account public key
    pub randomness: Pubkey,
    /// Queue account public key
    pub queue: Pubkey,
    /// Oracle account public key
    pub oracle: Pubkey,
    /// Recent slot hashes sysvar account
    pub recent_slothashes: Pubkey,
    /// Authority account public key
    pub authority: Pubkey,
}
impl ToAccountMetas for RandomnessCommitAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta::new(self.randomness, false),
            AccountMeta::new_readonly(self.queue, false),
            AccountMeta::new(self.oracle, false),
            AccountMeta::new_readonly(slot_hashes::ID, false),
            AccountMeta::new_readonly(self.authority, true),
        ]
    }
}

impl RandomnessCommit {
    /// Builds a randomness commitment instruction
    pub fn build_ix(
        randomness: Pubkey,
        queue: Pubkey,
        oracle: Pubkey,
        authority: Pubkey,
    ) -> Result<Instruction, OnDemandError> {
        let pid = if crate::utils::is_devnet() {
            get_sb_program_id("devnet")
        } else {
            get_sb_program_id("mainnet")
        };
        Ok(crate::utils::build_ix(
            &pid,
            &RandomnessCommitAccounts {
                randomness,
                queue,
                oracle,
                authority,
                recent_slothashes: slot_hashes::ID,
            },
            &RandomnessCommitParams {},
        ))
    }

    /// Invokes the `randomness_commit` Switchboard CPI call.
    ///
    /// This call commits a new randomness value to the randomness account.
    ///
    /// # Requirements
    ///
    /// - The `authority` must be a signer.
    ///
    /// # Parameters
    ///
    /// - **switchboard**: Switchboard program account.
    /// - **randomness**: Randomness account.
    /// - **queue**: Queue account associated with the randomness account.
    /// - **oracle**: Oracle account assigned for the randomness request.
    /// - **authority**: Authority of the randomness account.
    /// - **recent_slothashes**: Sysvar account to fetch recent slot hashes.
    /// - **seeds**: Seeds for the CPI call.
    ///
    pub fn invoke<'a>(
        switchboard: AccountInfo<'a>,
        randomness: AccountInfo<'a>,
        queue: AccountInfo<'a>,
        oracle: AccountInfo<'a>,
        authority: AccountInfo<'a>,
        recent_slothashes: AccountInfo<'a>,
        seeds: &[&[&[u8]]],
    ) -> Result<(), ProgramError> {
        let accounts = [
            randomness.clone(),
            queue.clone(),
            oracle.clone(),
            recent_slothashes.clone(),
            authority.clone(),
        ];
        let account_metas = RandomnessCommitAccounts {
            randomness: *randomness.key,
            queue: *queue.key,
            oracle: *oracle.key,
            recent_slothashes: *recent_slothashes.key,
            authority: *authority.key,
        }
        .to_account_metas(None);
        let ix = Instruction {
            program_id: *switchboard.key,
            accounts: account_metas,
            data: ix_discriminator("randomness_commit").to_vec(),
        };
        invoke_signed(&ix, &accounts, seeds)
    }
}

fn ix_discriminator(name: &str) -> [u8; 8] {
    let preimage = format!("global:{}", name);
    let mut sighash = [0u8; 8];
    sighash.copy_from_slice(&solana_program::hash::hash(preimage.as_bytes()).to_bytes()[..8]);
    sighash
}
