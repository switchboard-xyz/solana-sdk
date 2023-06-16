use crate::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::Discriminator;

#[derive(Accounts)]
#[instruction(params: VrfPoolRemoveParams)] // rpc parameters hint
pub struct VrfPoolRemove<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf_pool: AccountInfo<'info>,
    pub queue: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfPoolRemoveParams {}

impl Discriminator for VrfPoolRemove<'_> {
    const DISCRIMINATOR: [u8; 8] = [15, 73, 86, 124, 75, 183, 20, 199];
}

impl<'info> VrfPoolRemove<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None, remaining_accounts);

        let mut data: Vec<u8> = VrfPoolRemove::discriminator().try_to_vec()?;
        let params = VrfPoolRemoveParams {};
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, remaining_accounts)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, remaining_accounts)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![
            self.authority.clone(),
            self.vrf_pool.clone(),
            self.queue.clone(),
        ]
    }

    #[allow(unused_variables)]
    fn to_account_metas(
        &self,
        is_signer: Option<bool>,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Vec<AccountMeta> {
        let mut account_metas = vec![
            AccountMeta {
                pubkey: *self.authority.key,
                is_signer: true, // overwrite, authority has to sign
                is_writable: self.authority.is_writable,
            },
            AccountMeta {
                pubkey: *self.vrf_pool.key,
                is_signer: self.vrf_pool.is_signer,
                is_writable: self.vrf_pool.is_writable,
            },
            AccountMeta {
                pubkey: *self.queue.key,
                is_signer: self.queue.is_signer,
                is_writable: self.queue.is_writable,
            },
        ];

        let rem_account_metas: Vec<AccountMeta> = remaining_accounts
            .iter()
            .flat_map(|acc| acc.to_account_metas(None))
            .collect();
        account_metas.extend(rem_account_metas);

        account_metas
    }
}
