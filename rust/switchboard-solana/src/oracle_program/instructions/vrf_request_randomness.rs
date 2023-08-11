use crate::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::Discriminator;
use anchor_spl::token::TokenAccount;

#[derive(Accounts)]
#[instruction(params: VrfRequestRandomnessParams)] // rpc parameters hint
pub struct VrfRequestRandomness<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf: AccountInfo<'info>,
    #[account(mut)]
    pub oracle_queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub data_buffer: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [
            b"PermissionAccountData",
            queue_authority.key().as_ref(),
            oracle_queue.key().as_ref(),
            vrf.key().as_ref()
        ],
        bump = params.permission_bump
    )]
    pub permission: AccountInfo<'info>,
    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, constraint = payer_wallet.owner == payer_authority.key())]
    pub payer_wallet: Account<'info, TokenAccount>,
    #[account(signer)]
    pub payer_authority: AccountInfo<'info>,
    pub recent_blockhashes: AccountInfo<'info>,
    #[account(seeds = [b"STATE"], bump = params.state_bump)]
    pub program_state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfRequestRandomnessParams {
    pub permission_bump: u8,
    pub state_bump: u8,
}

impl Discriminator for VrfRequestRandomness<'_> {
    const DISCRIMINATOR: [u8; 8] = [230, 121, 14, 164, 28, 222, 117, 118];
}

impl<'info> VrfRequestRandomness<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: VrfRequestRandomnessParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfRequestRandomness::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        state_bump: u8,
        permission_bump: u8,
    ) -> ProgramResult {
        let cpi_params = VrfRequestRandomnessParams {
            permission_bump,
            state_bump,
        };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        state_bump: u8,
        permission_bump: u8,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = VrfRequestRandomnessParams {
            permission_bump,
            state_bump,
        };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![
            self.authority.clone(),
            self.vrf.clone(),
            self.oracle_queue.clone(),
            self.queue_authority.clone(),
            self.data_buffer.clone(),
            self.permission.clone(),
            self.escrow.to_account_info().clone(),
            self.payer_wallet.to_account_info().clone(),
            self.payer_authority.clone(),
            self.recent_blockhashes.clone(),
            self.program_state.clone(),
            self.token_program.clone(),
        ]
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta {
                pubkey: *self.authority.key,
                is_signer: true, // overwrite, authority has to sign
                is_writable: self.authority.is_writable,
            },
            AccountMeta {
                pubkey: *self.vrf.key,
                is_signer: self.vrf.is_signer,
                is_writable: self.vrf.is_writable,
            },
            AccountMeta {
                pubkey: *self.oracle_queue.key,
                is_signer: self.oracle_queue.is_signer,
                is_writable: self.oracle_queue.is_writable,
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
                pubkey: *self.permission.key,
                is_signer: self.permission.is_signer,
                is_writable: self.permission.is_writable,
            },
            AccountMeta {
                pubkey: *self.escrow.to_account_info().key,
                is_signer: self.escrow.to_account_info().is_signer,
                is_writable: self.escrow.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: *self.payer_wallet.to_account_info().key,
                is_signer: self.payer_wallet.to_account_info().is_signer,
                is_writable: self.payer_wallet.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: *self.payer_authority.key,
                is_signer: self.payer_authority.is_signer,
                is_writable: self.payer_authority.is_writable,
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
        ]
    }
}
