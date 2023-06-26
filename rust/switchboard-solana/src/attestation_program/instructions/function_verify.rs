use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params: FunctionVerifyParams)] // rpc parameters hint
pub struct FunctionVerify<'info> {
    #[account(
        mut,
        has_one = attestation_queue,
        has_one = escrow,
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,

    pub function_enclave_signer: Signer<'info>,

    #[account(
        mut,
        seeds = [QUOTE_SEED, function.key().as_ref()],
        bump = fn_quote.load()?.bump,
        has_one = attestation_queue
    )]
    pub fn_quote: AccountLoader<'info, EnclaveAccountData>,

    #[account(
        has_one = attestation_queue,
        constraint = 
            verifier_quote.load()?.enclave_signer == verifier_enclave_signer.key(),
    )]
    pub verifier_quote: AccountLoader<'info, EnclaveAccountData>,

    pub verifier_enclave_signer: Signer<'info>,

    #[account(
        seeds = [
            PERMISSION_SEED,
            attestation_queue.load()?.authority.as_ref(),
            attestation_queue.key().as_ref(),
            verifier_quote.key().as_ref()
        ],
        bump = verifier_permission.load()?.bump,
    )]
    pub verifier_permission: AccountLoader<'info, AttestationPermissionAccountData>,

    #[account(
        mut,
        constraint = escrow.is_native() && escrow.owner == state.key()
    )]
    pub escrow: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = receiver.is_native()
    )]
    pub receiver: Account<'info, TokenAccount>,

    #[account(
        seeds = [STATE_SEED],
        bump = state.load()?.bump
    )]
    pub state: AccountLoader<'info, AttestationProgramState>,

    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,

    pub token_program: Program<'info, Token>,
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
        account_infos.extend(self.state.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.function_enclave_signer.to_account_infos());
        account_infos.extend(self.fn_quote.to_account_infos());
        account_infos.extend(self.verifier_quote.to_account_infos());
        account_infos.extend(self.verifier_enclave_signer.to_account_infos());
        account_infos.extend(self.verifier_permission.to_account_infos());
        account_infos.extend(self.escrow.to_account_infos());
        account_infos.extend(self.receiver.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.function.to_account_metas(None));
        account_metas
            .extend(self.function_enclave_signer.to_account_metas(None));
        account_metas.extend(self.fn_quote.to_account_metas(None));
        account_metas.extend(self.verifier_quote.to_account_metas(None));
        account_metas
            .extend(self.verifier_enclave_signer.to_account_metas(None));
        account_metas.extend(self.verifier_permission.to_account_metas(None));
        account_metas.extend(self.escrow.to_account_metas(None));
        account_metas.extend(self.receiver.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas
    }
}

