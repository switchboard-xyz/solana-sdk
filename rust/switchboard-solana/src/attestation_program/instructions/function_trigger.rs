use crate::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::{Discriminator, InstructionData};

#[derive(Accounts)]
#[instruction(params: FunctionTriggerParams)] // rpc parameters hint
pub struct FunctionTrigger<'info> {
    #[account(mut)]
    pub function: AccountInfo<'info>,

    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionTriggerParams {}
impl InstructionData for FunctionTriggerParams {}
impl Discriminator for FunctionTriggerParams {
    const DISCRIMINATOR: [u8; 8] = [45, 224, 218, 184, 248, 83, 239, 200];
}
impl Discriminator for FunctionTrigger<'_> {
    const DISCRIMINATOR: [u8; 8] = [45, 224, 218, 184, 248, 83, 239, 200];
}

impl<'info> FunctionTrigger<'info> {
    pub fn get_instruction(&self, program_id: Pubkey) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionTrigger::discriminator().try_to_vec()?;
        let params = FunctionTriggerParams {};
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>) -> ProgramResult {
        let instruction = self.get_instruction(*program.key)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![self.function.clone(), self.authority.clone()]
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta {
                pubkey: *self.function.key,
                is_signer: self.function.is_signer,
                is_writable: self.function.is_writable,
            },
            AccountMeta {
                pubkey: *self.authority.key,
                is_signer: self.authority.is_signer,
                is_writable: self.authority.is_writable,
            },
        ]
    }
}
