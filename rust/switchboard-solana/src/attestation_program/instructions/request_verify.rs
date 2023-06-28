use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRequestVerifyParams)]
pub struct FunctionRequestVerify<'info> {
    #[account(
        mut,
        has_one = function,
        has_one = escrow,
    )]
    pub request: Box<Account<'info, FunctionRequestAccountData>>,
    pub function_enclave_signer: Signer<'info>,
    #[account(
        mut,
        constraint = escrow.is_native() && escrow.owner == state.key()
    )]
    pub escrow: Box<Account<'info, TokenAccount>>,
    #[account(mut, has_one = attestation_queue)]
    pub function: AccountLoader<'info, FunctionAccountData>,
    #[account(
        mut,
        constraint = escrow.is_native() && escrow.owner == state.key()
    )]
    pub function_escrow: Option<Box<Account<'info, TokenAccount>>>,
    #[account(
        has_one = attestation_queue,
        constraint = verifier_quote.load()?.enclave_signer == verifier_enclave_signer.key(),
    )]
    pub verifier_quote: AccountLoader<'info, EnclaveAccountData>,
    pub verifier_enclave_signer: Signer<'info>,
    #[account(
        seeds = [PERMISSION_SEED,
        attestation_queue.load()?.authority.as_ref(),
        attestation_queue.key().as_ref(),
        verifier_quote.key().as_ref()],
        bump = verifier_permission.load()?.bump,
    )]
    pub verifier_permission: AccountLoader<'info, AttestationPermissionAccountData>,
    #[account(mut, seeds = [STATE_SEED], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, AttestationProgramState>,
    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    #[account(mut, constraint = receiver.is_native())]
    pub receiver: Box<Account<'info, TokenAccount>>,
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRequestVerifyParams {
    pub observed_time: i64,
    pub is_failure: bool,
    pub mr_enclave: [u8; 32],
    pub request_slot: u64,
    pub container_params_hash: [u8; 32],
}

impl InstructionData for FunctionRequestVerifyParams {}

impl Discriminator for FunctionRequestVerifyParams {
    const DISCRIMINATOR: [u8; 8] = [179, 6, 88, 97, 232, 112, 143, 253];
}

impl Discriminator for FunctionRequestVerify<'_> {
    const DISCRIMINATOR: [u8; 8] = [179, 6, 88, 97, 232, 112, 143, 253];
}

impl<'info> FunctionRequestVerify<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &FunctionRequestVerifyParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRequestVerify::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRequestVerifyParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRequestVerifyParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.request.to_account_infos());
        account_infos.extend(self.function_enclave_signer.to_account_infos());
        account_infos.extend(self.escrow.to_account_infos());
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.function_escrow.to_account_infos());
        account_infos.extend(self.verifier_quote.to_account_infos());
        account_infos.extend(self.verifier_enclave_signer.to_account_infos());
        account_infos.extend(self.verifier_permission.to_account_infos());
        account_infos.extend(self.state.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.receiver.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.request.to_account_metas(None));
        account_metas.extend(self.function_enclave_signer.to_account_metas(None));
        account_metas.extend(self.escrow.to_account_metas(None));
        account_metas.extend(self.function.to_account_metas(None));
        if let Some(function_escrow) = &self.function_escrow {
            account_metas.extend(function_escrow.to_account_metas(None));
        } else {
            account_metas.push(AccountMeta::new_readonly(
                SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                false,
            ));
        }
        account_metas.extend(self.verifier_quote.to_account_metas(None));
        account_metas.extend(self.verifier_enclave_signer.to_account_metas(None));
        account_metas.extend(self.verifier_permission.to_account_metas(None));
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.receiver.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas
    }
}
