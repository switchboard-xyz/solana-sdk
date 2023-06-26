use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:ActionTemplateParams)]
pub struct ActionTemplate<'info> {
    // accounts here
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ActionTemplateParams {
    // params here
}

impl InstructionData for ActionTemplateParams {}

impl Discriminator for ActionTemplateParams {
    const DISCRIMINATOR: [u8; 8] = [
        // discriminator here
    ];
}

impl Discriminator for ActionTemplate<'_> {
    const DISCRIMINATOR: [u8; 8] = [
         // discriminator here
    ];
}

impl<'info> ActionTemplate<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &ActionTemplateParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = ActionTemplate::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &ActionTemplateParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &ActionTemplateParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        // to account infos here
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        // to account metas here
    }
}
