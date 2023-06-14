use crate::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::Discriminator;

#[derive(Accounts)]
#[instruction(params: VrfSetCallbackParams)] // rpc parameters hint
pub struct VrfSetCallback<'info> {
    #[account(mut)]
    pub vrf: AccountInfo<'info>,
    pub authority: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfSetCallbackParams {
    pub callback: Callback,
}

impl Discriminator for VrfSetCallback<'_> {
    const DISCRIMINATOR: [u8; 8] = [121, 167, 168, 191, 180, 247, 251, 78];
}

impl<'info> VrfSetCallback<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: VrfSetCallbackParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfSetCallback::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, callback: Callback) -> ProgramResult {
        let cpi_params = VrfSetCallbackParams { callback };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        callback: Callback,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = VrfSetCallbackParams { callback };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![self.vrf.clone(), self.authority.clone()]
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta {
                pubkey: *self.vrf.key,
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
