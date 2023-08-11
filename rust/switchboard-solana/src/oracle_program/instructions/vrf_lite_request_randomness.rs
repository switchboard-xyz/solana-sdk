use crate::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::Discriminator;
use anchor_spl::token::TokenAccount;

#[derive(Accounts)]
#[instruction(params: VrfLiteRequestRandomnessParams)] // rpc parameters hint
pub struct VrfLiteRequestRandomness<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf_lite: AccountInfo<'info>,
    #[account(mut)]
    pub queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub data_buffer: AccountInfo<'info>,
    // #[account(
    //     mut,
    //     seeds = [
    //         b"PermissionAccountData",
    //         queue_authority.key().as_ref(),
    //         queue.key().as_ref(),
    //         vrf_lite.key().as_ref()
    //     ],
    //     bump = vrf_lite.load()?.permission_bump
    // )]
    /// CHECK:
    pub permission: AccountInfo<'info>,
    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    pub recent_blockhashes: AccountInfo<'info>,
    // #[account(seeds = [b"STATE"], bump = params.state_bump)]
    /// CHECK:
    pub program_state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfLiteRequestRandomnessParams {
    pub callback: Option<Callback>,
}

impl Discriminator for VrfLiteRequestRandomness<'_> {
    const DISCRIMINATOR: [u8; 8] = [221, 11, 167, 47, 80, 107, 18, 71];
}

impl<'info> VrfLiteRequestRandomness<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        callback: Option<Callback>,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfLiteRequestRandomness::discriminator().try_to_vec()?;
        let params = VrfLiteRequestRandomnessParams { callback };
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, callback: Option<Callback>) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, callback)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        callback: Option<Callback>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, callback)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![
            self.authority.clone(),
            self.vrf_lite.clone(),
            self.queue.clone(),
            self.queue_authority.clone(),
            self.data_buffer.clone(),
            self.permission.clone(),
            self.escrow.to_account_info().clone(),
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
                pubkey: *self.vrf_lite.key,
                is_signer: self.vrf_lite.is_signer,
                is_writable: self.vrf_lite.is_writable,
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
