use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionTriggerParams)]
pub struct FunctionTrigger<'info> {
    #[account(mut)]
    pub function: AccountInfo<'info>,

    #[account(signer)]
    pub authority: AccountInfo<'info>,

    pub attestation_queue: AccountInfo<'info>,
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
        Ok(Instruction::new_with_bytes(
            program_id,
            &FunctionTrigger::discriminator().try_to_vec()?,
            self.to_account_metas(None),
        ))
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
        let mut account_infos = Vec::new();
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.function.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas
    }
}
