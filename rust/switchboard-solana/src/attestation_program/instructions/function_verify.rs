use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params: FunctionVerifyParams)] // rpc parameters hint
pub struct FunctionVerify<'info> {
    #[account(mut)]
    pub function: AccountInfo<'info>, // FunctionAccountData
    #[account(signer)]
    pub function_enclave_signer: AccountInfo<'info>, // SystemProgram keypair
    pub verifier: AccountInfo<'info>, // VerifierAccountData
    #[account(signer)]
    pub verifier_signer: AccountInfo<'info>,
    pub verifier_permission: AccountInfo<'info>, // AttestationPermissionAccountData
    pub escrow_wallet: AccountInfo<'info>,       // SwitchboardWallet
    #[account(mut)]
    pub escrow_token_wallet: AccountInfo<'info>, // TokenAccount
    #[account(mut)]
    pub receiver: AccountInfo<'info>, // TokenAccount
    pub attestation_queue: AccountInfo<'info>,   // AttestationQueueAccountData
    #[account(address = anchor_spl::token::ID)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionVerifyParams {
    pub observed_time: i64,
    pub next_allowed_timestamp: i64,
    pub is_failure: bool,
    pub mr_enclave: [u8; 32],
}
impl InstructionData for FunctionVerifyParams {}
impl Discriminator for FunctionVerifyParams {
    const DISCRIMINATOR: [u8; 8] = [210, 108, 154, 138, 198, 14, 53, 191];
}
impl Discriminator for FunctionVerify<'_> {
    const DISCRIMINATOR: [u8; 8] = [210, 108, 154, 138, 198, 14, 53, 191];
}

impl<'info> FunctionVerify<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: FunctionVerifyParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionVerify::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        observed_time: i64,
        next_allowed_timestamp: i64,
        is_failure: bool,
        mr_enclave: [u8; 32],
    ) -> ProgramResult {
        let cpi_params = FunctionVerifyParams {
            observed_time,
            next_allowed_timestamp,
            is_failure,
            mr_enclave,
        };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        observed_time: i64,
        next_allowed_timestamp: i64,
        is_failure: bool,
        mr_enclave: [u8; 32],
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = FunctionVerifyParams {
            observed_time,
            next_allowed_timestamp,
            is_failure,
            mr_enclave,
        };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.function_enclave_signer.to_account_infos());
        account_infos.extend(self.verifier.to_account_infos());
        account_infos.extend(self.verifier_signer.to_account_infos());
        account_infos.extend(self.verifier_permission.to_account_infos());
        account_infos.extend(self.escrow_wallet.to_account_infos());
        account_infos.extend(self.escrow_token_wallet.to_account_infos());
        account_infos.extend(self.receiver.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.function.to_account_metas(None));
        account_metas.extend(self.function_enclave_signer.to_account_metas(None));
        account_metas.extend(self.verifier.to_account_metas(None));
        account_metas.extend(self.verifier_signer.to_account_metas(None));
        account_metas.extend(self.verifier_permission.to_account_metas(None));
        account_metas.extend(self.escrow_wallet.to_account_metas(None));
        account_metas.extend(self.escrow_token_wallet.to_account_metas(None));
        account_metas.extend(self.receiver.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas
    }
}
