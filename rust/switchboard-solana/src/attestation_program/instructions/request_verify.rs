use crate::cfg_client;
use crate::find_associated_token_address;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRequestVerifyParams)]
pub struct FunctionRequestVerify<'info> {
    /// #[account(
    ///     mut,
    ///     has_one = function,
    ///     has_one = escrow @ SwitchboardError::InvalidEscrow,
    /// )]
    /// pub request: Box<Account<'info, FunctionRequestAccountData>>,
    #[account(mut)]
    pub request: AccountInfo<'info>, // FunctionRequestAccount

    #[account(signer)]
    pub function_enclave_signer: AccountInfo<'info>, // SystemProgram keypair

    /// #[account(
    ///     mut,
    ///     constraint = escrow.is_native() && escrow.owner == state.key()
    /// )]
    /// pub escrow: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub escrow: AccountInfo<'info>, // TokenAccount

    /// #[account(
    ///     mut,
    ///     has_one = attestation_queue @ SwitchboardError::InvalidQueue,
    /// )]
    /// pub function: AccountLoader<'info, FunctionAccountData>,
    #[account(mut)]
    pub function: AccountInfo<'info>, // FunctionAccount

    /// #[account(
    ///     mut,
    ///     constraint = escrow.is_native() && escrow.owner == state.key()
    /// )]
    /// pub function_escrow: Option<Box<Account<'info, TokenAccount>>>,
    #[account(mut)]
    pub function_escrow: Option<AccountInfo<'info>>, // TokenAccount

    /// #[account(
    ///     has_one = attestation_queue @ SwitchboardError::InvalidQueue,
    ///     constraint =
    ///         verifier_quote.load()?.enclave.enclave_signer == verifier_enclave_signer.key()
    ///             @ SwitchboardError::InvalidEnclaveSigner,
    /// )]
    /// pub verifier_quote: AccountLoader<'info, VerifierAccountData>,
    pub verifier_quote: AccountInfo<'info>, // VerifierAccountData

    #[account(signer)]
    pub verifier_enclave_signer: AccountInfo<'info>, // SystemProgram keypair

    /// #[account(
    ///     seeds = [
    ///         PERMISSION_SEED,
    ///         attestation_queue.load()?.authority.as_ref(),
    ///         attestation_queue.key().as_ref(),
    ///         verifier_quote.key().as_ref()
    ///     ],
    ///     bump = verifier_permission.load()?.bump,
    /// )]
    /// pub verifier_permission: AccountLoader<'info, AttestationPermissionAccountData>,
    pub verifier_permission: AccountInfo<'info>, // AttestationPermissionAccount

    /// #[account(
    ///     seeds = [STATE_SEED],
    ///     bump = state.load()?.bump,
    /// )]
    /// pub state: AccountLoader<'info, AttestationProgramState>,
    pub state: AccountInfo<'info>, // AttestationProgramState

    /// pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    pub attestation_queue: AccountInfo<'info>, // AttestationQueueAccount

    /// #[account(
    ///     mut,
    ///     constraint = receiver.is_native()
    /// )]
    /// pub receiver: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub receiver: AccountInfo<'info>, // TokenAccount

    /// pub token_program: Program<'info, Token>,
    #[account(address = anchor_spl::token::ID)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRequestVerifyParams {
    pub observed_time: i64,
    pub error_code: u8,
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

cfg_client! {

    pub struct FunctionRequestVerifyAccounts {
        /// The FunctionRequestAccount pubkey to verify.
        pub request: Pubkey,
        /// The pubkey of the enclave generated keypair that will be set after verification.
        /// This keypair must sign any subsequent instructions to prove the instructions
        /// were generated within an enclave.
        pub function_enclave_signer: Pubkey,

        /// The FunctionAccount for the request being verified.
        pub function: Pubkey,
        /// The FunctionAccount escrow token wallet. Only used if the FunctionAccount has a request_fee set.
        pub function_escrow_token_wallet: Option<Pubkey>,

        /// The VerifierAccount pubkey that is verifying the request.
        pub verifier: Pubkey,
        /// The VerifierAccount's enclave generated signer that must approve verifications.
        pub verifier_enclave_signer: Pubkey,
        /// THe VerifierAccount's token wallet to receive a reward for verifying the request.
        pub reward_receiver: Pubkey,

        /// The AttestationQueueAccount that the request is being verified for.
        pub attestation_queue: Pubkey,
        /// The AttestationQueueAccount's authority. Used to derive the VerifierAccount's permission account.
        pub queue_authority: Pubkey,
    }
    impl ToAccountMetas for FunctionRequestVerifyAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(self.request, false),
                AccountMeta::new_readonly(self.function_enclave_signer, true),
                AccountMeta::new(find_associated_token_address(&self.request, &NativeMint::id()), false),
                AccountMeta::new(self.function, false),
                AccountMeta::new(self.function_escrow_token_wallet.unwrap_or(SWITCHBOARD_ATTESTATION_PROGRAM_ID), false),
                AccountMeta::new_readonly(self.verifier, false),
                AccountMeta::new_readonly(self.verifier_enclave_signer, true),
                AccountMeta::new_readonly(
                    AttestationPermissionAccountData::get_pda(
                        &self.queue_authority,
                        &self.attestation_queue,
                        &self.verifier
                    ),
                    false
                ),
                AccountMeta::new_readonly(AttestationProgramState::get_pda(), false),
                AccountMeta::new_readonly(self.attestation_queue, false),
                AccountMeta::new(self.reward_receiver, false),
                AccountMeta::new_readonly(anchor_spl::token::ID, false),
            ]
        }
    }
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

    cfg_client! {
        pub fn build_ix(
            accounts: &FunctionRequestVerifyAccounts,
            params: &FunctionRequestVerifyParams,
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    accounts,
                    params,
                )
            )
        }
    }
}
