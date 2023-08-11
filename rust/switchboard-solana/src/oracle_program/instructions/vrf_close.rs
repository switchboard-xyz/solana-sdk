use crate::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::Discriminator;
use anchor_spl::token::TokenAccount;

#[derive(Accounts)]
#[instruction(params: VrfCloseParams)] // rpc parameters hint
pub struct VrfClose<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf: AccountInfo<'info>,
    /// CHECK:
    pub permission: AccountInfo<'info>,
    #[account(mut)]
    pub queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    /// CHECK:
    pub program_state: AccountInfo<'info>,

    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    /// CHECK:
    pub sol_dest: AccountInfo<'info>,
    #[account(mut, constraint = escrow.mint == escrow_dest.mint )]
    pub escrow_dest: Account<'info, TokenAccount>,

    // #[account(seeds = [b"STATE"], bump = params.state_bump)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfCloseParams {
    pub state_bump: u8,
    pub permission_bump: u8,
}

impl Discriminator for VrfClose<'_> {
    const DISCRIMINATOR: [u8; 8] = [97, 172, 124, 16, 175, 10, 246, 147];
}

impl<'info> VrfClose<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        state_bump: u8,
        permission_bump: u8,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfClose::discriminator().try_to_vec()?;
        let params = VrfCloseParams {
            state_bump,
            permission_bump,
        };
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
        let instruction = self.get_instruction(*program.key, state_bump, permission_bump)?;
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
        let instruction = self.get_instruction(*program.key, state_bump, permission_bump)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![
            self.authority.clone(),
            self.vrf.clone(),
            self.permission.clone(),
            self.queue.clone(),
            self.queue_authority.clone(),
            self.program_state.clone(),
            self.escrow.to_account_info().clone(),
            self.sol_dest.clone(),
            self.escrow_dest.to_account_info().clone(),
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
                pubkey: *self.permission.key,
                is_signer: self.permission.is_signer,
                is_writable: self.permission.is_writable,
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
                pubkey: *self.program_state.key,
                is_signer: self.program_state.is_signer,
                is_writable: self.program_state.is_writable,
            },
            AccountMeta {
                pubkey: *self.escrow.to_account_info().key,
                is_signer: self.escrow.to_account_info().is_signer,
                is_writable: self.escrow.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: *self.sol_dest.key,
                is_signer: self.sol_dest.is_signer,
                is_writable: self.sol_dest.is_writable,
            },
            AccountMeta {
                pubkey: *self.escrow_dest.to_account_info().key,
                is_signer: self.escrow_dest.to_account_info().is_signer,
                is_writable: self.escrow_dest.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: *self.token_program.key,
                is_signer: self.token_program.is_signer,
                is_writable: self.token_program.is_writable,
            },
        ]
    }
}
