use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionTriggerParams)]
pub struct FunctionTrigger<'info> {
    #[account(mut, has_one = authority)]
    pub function: AccountLoader<'info, FunctionAccountData>,
    pub authority: Signer<'info>,
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
        let mut account_infos = Vec::new();
        account_infos.extend(anchor_lang::ToAccountInfos::to_account_infos(
            &self.function,
        ));
        account_infos.extend(anchor_lang::ToAccountInfos::to_account_infos(
            &self.authority,
        ));
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.push(anchor_lang::solana_program::instruction::AccountMeta::new(
            self.function.key(),
            false,
        ));
        account_metas.push(
            anchor_lang::solana_program::instruction::AccountMeta::new_readonly(
                self.authority.key(),
                true,
            ),
        );
        account_metas
    }
}
