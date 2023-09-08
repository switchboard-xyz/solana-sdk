use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionSetConfigParams)]
pub struct FunctionSetConfig<'info> {
    #[account(mut)]
    pub function: AccountInfo<'info>,

    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionSetConfigParams {
    pub name: Option<Vec<u8>>,
    pub metadata: Option<Vec<u8>>,
    pub container: Option<Vec<u8>>,
    pub container_registry: Option<Vec<u8>>,
    pub version: Option<Vec<u8>>,
    pub schedule: Option<Vec<u8>>,
    pub mr_enclaves: Option<Vec<[u8; 32]>>,
    pub requests_disabled: Option<bool>,
    pub requests_require_authorization: Option<bool>,
    pub requests_fee: Option<u64>,
}

impl InstructionData for FunctionSetConfigParams {}

impl Discriminator for FunctionSetConfigParams {
    const DISCRIMINATOR: [u8; 8] = [232, 132, 21, 251, 253, 189, 96, 94];
}

impl Discriminator for FunctionSetConfig<'_> {
    const DISCRIMINATOR: [u8; 8] = [232, 132, 21, 251, 253, 189, 96, 94];
}

impl<'info> FunctionSetConfig<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &FunctionSetConfigParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionSetConfig::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionSetConfigParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionSetConfigParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.function.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas
    }
}
