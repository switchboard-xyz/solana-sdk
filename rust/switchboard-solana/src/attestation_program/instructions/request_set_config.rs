use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRequestSetConfigParams)]
pub struct FunctionRequestSetConfig<'info> {
    #[account(mut)]
    pub request: AccountInfo<'info>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRequestSetConfigParams {
    pub container_params: Vec<u8>,
    pub append_container_params: bool,
}

impl InstructionData for FunctionRequestSetConfigParams {}

impl Discriminator for FunctionRequestSetConfigParams {
    const DISCRIMINATOR: [u8; 8] = [16, 81, 197, 58, 129, 125, 91, 233];
}

impl Discriminator for FunctionRequestSetConfig<'_> {
    const DISCRIMINATOR: [u8; 8] = [16, 81, 197, 58, 129, 125, 91, 233];
}

impl<'info> FunctionRequestSetConfig<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        container_params: Vec<u8>,
        append_container_params: bool,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRequestSetConfig::discriminator().try_to_vec()?;
        let params = FunctionRequestSetConfigParams {
            container_params,
            append_container_params,
        };
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        container_params: Vec<u8>,
        append_container_params: bool,
    ) -> ProgramResult {
        let instruction =
            self.get_instruction(*program.key, container_params, append_container_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        container_params: Vec<u8>,
        append_container_params: bool,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction =
            self.get_instruction(*program.key, container_params, append_container_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.request.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.request.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(Some(true)));
        account_metas
    }
}
