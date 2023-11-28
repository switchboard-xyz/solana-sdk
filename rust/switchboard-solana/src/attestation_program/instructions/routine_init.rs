use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRoutineInitParams)]
pub struct FunctionRoutineInit<'info> {
    #[account(
        mut,
        signer,
        owner = system_program.key(),
        constraint = function.data_len() == 0 && function.lamports() == 0,
    )]
    pub routine: AccountInfo<'info>,

    /// CHECK:
    pub authority: AccountInfo<'info>,

    #[account(mut)]
    pub function: AccountInfo<'info>,

    #[account(signer)]
    pub function_authority: Option<AccountInfo<'info>>,

    /// CHECK: handle this manually because the PDA seed can vary
    #[account(mut)]
    pub escrow_wallet: AccountInfo<'info>,

    #[account(signer)]
    pub escrow_wallet_authority: Option<AccountInfo<'info>>,

    /// CHECK: handle this manually because the PDA seed can vary
    #[account(mut)]
    pub escrow_token_wallet: AccountInfo<'info>,

    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: AccountInfo<'info>,

    pub attestation_queue: AccountInfo<'info>,

    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,

    #[account(address = solana_program::system_program::ID)]
    pub system_program: AccountInfo<'info>,
    #[account(address = anchor_spl::token::ID)]
    pub token_program: AccountInfo<'info>,
    #[account(address = anchor_spl::associated_token::ID)]
    pub associated_token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRoutineInitParams {
    // Metadata
    pub name: Option<Vec<u8>>,
    pub metadata: Option<Vec<u8>>,

    // Fees
    pub bounty: Option<u64>,

    // Execution
    pub schedule: Vec<u8>,
    pub max_container_params_len: Option<u32>,
    pub container_params: Vec<u8>,
}

impl InstructionData for FunctionRoutineInitParams {}

impl Discriminator for FunctionRoutineInitParams {
    const DISCRIMINATOR: [u8; 8] = [70, 25, 243, 23, 253, 78, 27, 169];
}

impl Discriminator for FunctionRoutineInit<'_> {
    const DISCRIMINATOR: [u8; 8] = [70, 25, 243, 23, 253, 78, 27, 169];
}

impl<'info> FunctionRoutineInit<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &FunctionRoutineInitParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRoutineInit::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRoutineInitParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRoutineInitParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.routine.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.function_authority.to_account_infos());
        account_infos.extend(self.escrow_wallet.to_account_infos());
        account_infos.extend(self.escrow_wallet_authority.to_account_infos());
        account_infos.extend(self.escrow_token_wallet.to_account_infos());
        account_infos.extend(self.mint.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos.extend(self.associated_token_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.routine.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.function.to_account_metas(None));
        if let Some(function_authority) = &self.function_authority {
            account_metas.extend(function_authority.to_account_metas(None));
        } else {
            account_metas.push(AccountMeta::new_readonly(
                SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                false,
            ));
        }
        account_metas.extend(self.escrow_wallet.to_account_metas(None));
        if let Some(escrow_wallet_authority) = &self.escrow_wallet_authority {
            account_metas.extend(escrow_wallet_authority.to_account_metas(None));
        } else {
            account_metas.push(AccountMeta::new_readonly(
                SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                false,
            ));
        }
        account_metas.extend(self.escrow_token_wallet.to_account_metas(None));
        account_metas.extend(self.mint.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas.extend(self.associated_token_program.to_account_metas(None));

        account_metas
    }
}
