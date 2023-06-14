use crate::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::Discriminator;

#[derive(Accounts)]
#[instruction(params: PermissionSetParams)] // rpc parameters hint
pub struct PermissionSet<'info> {
    #[account(mut, has_one = authority @ SwitchboardError::InvalidAuthority )]
    pub permission: AccountLoader<'info, PermissionAccountData>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct PermissionSetParams {
    pub permission: SwitchboardPermission,
    pub enable: bool,
}

impl Discriminator for PermissionSet<'_> {
    const DISCRIMINATOR: [u8; 8] = [211, 122, 185, 120, 129, 182, 55, 103];
}

impl<'info> PermissionSet<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: PermissionSetParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = PermissionSet::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        permission: SwitchboardPermission,
        enable: bool,
    ) -> ProgramResult {
        let cpi_params = PermissionSetParams { permission, enable };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
        // .map_err(|_| error!(SwitchboardError::VrfCpiError))
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        permission: SwitchboardPermission,
        enable: bool,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = PermissionSetParams { permission, enable };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
        // .map_err(|_| error!(SwitchboardError::VrfCpiSignedError))
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![
            self.permission.to_account_info().clone(),
            self.authority.clone(),
        ]
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta {
                pubkey: self.permission.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: *self.authority.key,
                is_signer: true,
                is_writable: false,
            },
        ]
    }
}
