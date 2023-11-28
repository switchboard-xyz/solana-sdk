use crate::cfg_client;
use crate::find_associated_token_address;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRoutineVerifyParams)]
pub struct FunctionRoutineVerify<'info> {
    /// #[account(
    ///     mut,
    ///     has_one = function,
    ///     has_one = escrow_wallet @ SwitchboardError::InvalidEscrow,
    ///     has_one = escrow_token_wallet @ SwitchboardError::InvalidEscrow,
    /// )]
    /// pub routine: Box<Account<'info, FunctionRoutineAccountData>>,
    #[account(mut)]
    pub routine: AccountInfo<'info>, // FunctionRequestAccount

    #[account(signer)]
    pub function_enclave_signer: AccountInfo<'info>, // SystemProgram keypair

    /// #[account(mut)]
    /// pub escrow_wallet: Box<Account<'info, SwitchboardWallet>>,
    #[account(mut)]
    pub escrow_wallet: AccountInfo<'info>, // SwitchboardWallet

    // #[account(
    //     mut,
    //     constraint = escrow_token_wallet.is_native()
    // )]
    // pub escrow_token_wallet: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub escrow_token_wallet: AccountInfo<'info>, // TokenAccount

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
    /// pub function_escrow_token_wallet: Option<Box<Account<'info, TokenAccount>>>,
    #[account(mut)]
    pub function_escrow_token_wallet: Option<AccountInfo<'info>>, // TokenAccount

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
pub struct FunctionRoutineVerifyParams {
    pub observed_time: i64,
    // TODO: should we verify this?
    pub next_allowed_timestamp: i64,
    pub error_code: u8,
    pub mr_enclave: [u8; 32],
    pub container_params_hash: [u8; 32],
}

impl InstructionData for FunctionRoutineVerifyParams {}

impl Discriminator for FunctionRoutineVerifyParams {
    const DISCRIMINATOR: [u8; 8] = [138, 151, 43, 227, 196, 155, 245, 105];
}

impl Discriminator for FunctionRoutineVerify<'_> {
    const DISCRIMINATOR: [u8; 8] = [138, 151, 43, 227, 196, 155, 245, 105];
}

cfg_client! {

    pub struct FunctionRoutineVerifyAccounts {
        /// The FunctionRoutineAccount pubkey to verify.
        pub routine: Pubkey,
        /// The pubkey of the enclave generated keypair that will be set after verification.
        /// This keypair must sign any subsequent instructions to prove the instructions
        /// were generated within an enclave.
        pub function_enclave_signer: Pubkey,

        pub escrow_wallet: Pubkey,

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
    impl ToAccountMetas for FunctionRoutineVerifyAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(self.routine, false),
                AccountMeta::new_readonly(self.function_enclave_signer, true),
                AccountMeta::new(self.escrow_wallet, false),
                AccountMeta::new(find_associated_token_address(&self.escrow_wallet, &NativeMint::id()), false),
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
                AccountMeta::new_readonly(self.attestation_queue, false),
                AccountMeta::new(self.reward_receiver, false),
                AccountMeta::new_readonly(anchor_spl::token::ID, false),
            ]
        }
    }
}

impl<'info> FunctionRoutineVerify<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &FunctionRoutineVerifyParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRoutineVerify::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRoutineVerifyParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRoutineVerifyParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.routine.to_account_infos());
        account_infos.extend(self.function_enclave_signer.to_account_infos());
        account_infos.extend(self.escrow_wallet.to_account_infos());
        account_infos.extend(self.escrow_token_wallet.to_account_infos());
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.function_escrow_token_wallet.to_account_infos());
        account_infos.extend(self.verifier_quote.to_account_infos());
        account_infos.extend(self.verifier_enclave_signer.to_account_infos());
        account_infos.extend(self.verifier_permission.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.receiver.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.routine.to_account_metas(None));
        account_metas.extend(self.function_enclave_signer.to_account_metas(None));
        account_metas.extend(self.escrow_wallet.to_account_metas(None));
        account_metas.extend(self.escrow_token_wallet.to_account_metas(None));
        account_metas.extend(self.function.to_account_metas(None));
        if let Some(function_escrow_token_wallet) = &self.function_escrow_token_wallet {
            account_metas.extend(function_escrow_token_wallet.to_account_metas(None));
        } else {
            account_metas.push(AccountMeta::new_readonly(
                SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                false,
            ));
        }
        account_metas.extend(self.verifier_quote.to_account_metas(None));
        account_metas.extend(self.verifier_enclave_signer.to_account_metas(None));
        account_metas.extend(self.verifier_permission.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.receiver.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            accounts: &FunctionRoutineVerifyAccounts,
            params: &FunctionRoutineVerifyParams,
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
