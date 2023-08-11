use crate::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::Discriminator;
use anchor_spl::token::{Mint, TokenAccount};

#[derive(Accounts)]
#[instruction(params: VrfPoolRequestRandomnessParams)] // rpc parameters hint
pub struct VrfPoolRequestRandomness<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf_pool: AccountInfo<'info>,
    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub data_buffer: AccountInfo<'info>,
    pub recent_blockhashes: AccountInfo<'info>,
    pub program_state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfPoolRequestRandomnessParams {
    pub callback: Option<Callback>,
}

impl Discriminator for VrfPoolRequestRandomness<'_> {
    const DISCRIMINATOR: [u8; 8] = [67, 49, 182, 255, 222, 161, 116, 238];
}

impl<'info> VrfPoolRequestRandomness<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        remaining_accounts: &'info [AccountInfo<'info>],
        callback: Option<Callback>,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None, remaining_accounts);

        let mut data: Vec<u8> = VrfPoolRequestRandomness::discriminator().try_to_vec()?;
        let params = VrfPoolRequestRandomnessParams { callback };
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
        callback: Option<Callback>,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, remaining_accounts, callback)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
        callback: Option<Callback>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, remaining_accounts, callback)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![
            self.authority.clone(),
            self.vrf_pool.clone(),
            self.escrow.to_account_info().clone(),
            self.mint.to_account_info().clone(),
            self.queue.clone(),
            self.queue_authority.clone(),
            self.data_buffer.clone(),
            self.recent_blockhashes.clone(),
            self.program_state.clone(),
            self.token_program.clone(),
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
                pubkey: *self.escrow.to_account_info().key,
                is_signer: self.escrow.to_account_info().is_signer,
                is_writable: self.escrow.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: *self.mint.to_account_info().key,
                is_signer: self.mint.to_account_info().is_signer,
                is_writable: self.mint.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: *self.queue.key,
                is_signer: self.queue.is_signer,
                is_writable: self.queue.is_writable,
            },
            AccountMeta {
                pubkey: *self.queue_authority.key,
                is_signer: self.queue_authority.is_signer,
                is_writable: self.queue_authority.is_writable,
            },
            AccountMeta {
                pubkey: *self.data_buffer.key,
                is_signer: self.data_buffer.is_signer,
                is_writable: self.data_buffer.is_writable,
            },
            AccountMeta {
                pubkey: *self.recent_blockhashes.key,
                is_signer: self.recent_blockhashes.is_signer,
                is_writable: self.recent_blockhashes.is_writable,
            },
            AccountMeta {
                pubkey: *self.program_state.key,
                is_signer: self.program_state.is_signer,
                is_writable: self.program_state.is_writable,
            },
            AccountMeta {
                pubkey: *self.token_program.key,
                is_signer: self.token_program.is_signer,
                is_writable: self.token_program.is_writable,
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
