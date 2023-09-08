use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionSetEscrowParams)]
pub struct FunctionSetEscrow<'info> {
    #[account(mut)]
    pub function: AccountInfo<'info>,

    #[account(signer)]
    pub authority: AccountInfo<'info>,

    pub attestation_queue: AccountInfo<'info>,

    #[account(mut)]
    pub escrow_wallet: AccountInfo<'info>,

    /// CHECK:
    pub escrow_authority: AccountInfo<'info>,

    #[account(mut)]
    pub new_escrow: AccountInfo<'info>,

    /// CHECK:
    #[account(signer)]
    pub new_escrow_authority: AccountInfo<'info>,

    /// CHECK:
    pub new_escrow_token_wallet: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionSetEscrowParams {}

impl InstructionData for FunctionSetEscrowParams {}

impl Discriminator for FunctionSetEscrowParams {
    const DISCRIMINATOR: [u8; 8] = [63, 223, 123, 191, 23, 84, 113, 198];
}

impl Discriminator for FunctionSetEscrow<'_> {
    const DISCRIMINATOR: [u8; 8] = [63, 223, 123, 191, 23, 84, 113, 198];
}

impl<'info> FunctionSetEscrow<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &FunctionSetEscrowParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionSetEscrow::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionSetEscrowParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionSetEscrowParams,
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
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.escrow_wallet.to_account_infos());
        account_infos.extend(self.escrow_authority.to_account_infos());
        account_infos.extend(self.new_escrow.to_account_infos());
        account_infos.extend(self.new_escrow_authority.to_account_infos());
        account_infos.extend(self.new_escrow_token_wallet.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.function.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.escrow_wallet.to_account_metas(None));
        account_metas.extend(self.escrow_authority.to_account_metas(None));
        account_metas.extend(self.new_escrow.to_account_metas(None));
        account_metas.extend(self.new_escrow_authority.to_account_metas(None));
        account_metas.extend(self.new_escrow_token_wallet.to_account_metas(None));
        account_metas
    }
}
