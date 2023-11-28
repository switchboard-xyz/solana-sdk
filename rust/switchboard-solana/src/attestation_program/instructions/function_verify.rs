use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params: FunctionVerifyParams)] // rpc parameters hint
pub struct FunctionVerify<'info> {
    /// #[account(
    ///     mut,
    ///     seeds = [
    ///         FUNCTION_SEED,
    ///         function.load()?.creator_seed.as_ref(),
    ///         &function.load()?.created_at_slot.to_le_bytes()
    ///     ],
    ///     bump = function.load()?.bump,
    ///     has_one = attestation_queue @ SwitchboardError::InvalidQueue,
    ///     has_one = escrow_token_wallet @ SwitchboardError::InvalidEscrow,
    ///     has_one = escrow_wallet,
    /// )]
    /// pub function: AccountLoader<'info, FunctionAccountData>,
    #[account(mut)]
    pub function: AccountInfo<'info>, // FunctionAccountData

    // #[account(signer)]
    pub function_enclave_signer: Signer<'info>, // SystemProgram keypair

    /// #[account(
    ///     has_one = attestation_queue @ SwitchboardError::InvalidQueue,
    ///     constraint = verifier.load()?.enclave.enclave_signer == verifier_signer.key() @ SwitchboardError::InvalidEnclaveSigner,
    /// )]
    /// pub verifier: AccountLoader<'info, VerifierAccountData>,
    pub verifier: AccountInfo<'info>, // VerifierAccountData

    // #[account(signer)]
    pub verifier_signer: Signer<'info>,

    /// #[account(
    ///     seeds = [
    ///         PERMISSION_SEED,
    ///         attestation_queue.load()?.authority.as_ref(),
    ///         attestation_queue.key().as_ref(),
    ///         verifier.key().as_ref()
    ///     ],
    ///     bump = verifier_permission.load()?.bump,
    /// )]
    /// pub verifier_permission: AccountLoader<'info, AttestationPermissionAccountData>,
    pub verifier_permission: AccountInfo<'info>, // AttestationPermissionAccountData

    /// pub escrow_wallet: Box<Account<'info, SwitchboardWallet>>,
    pub escrow_wallet: AccountInfo<'info>, // SwitchboardWallet

    /// #[account(
    ///     mut,
    ///     constraint = escrow_token_wallet.is_native()
    /// )]
    /// pub escrow_token_wallet: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub escrow_token_wallet: AccountInfo<'info>, // TokenAccount

    /// #[account(
    ///     mut,
    ///     constraint = receiver.is_native()
    /// )]
    /// pub receiver: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub receiver: AccountInfo<'info>, // TokenAccount

    /// pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    pub attestation_queue: AccountInfo<'info>, // AttestationQueueAccountData

    /// pub token_program: Program<'info, Token>,
    #[account(address = anchor_spl::token::ID)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionVerifyParams {
    pub observed_time: i64,
    pub next_allowed_timestamp: i64,
    pub error_code: u8,
    pub mr_enclave: [u8; 32],
}
impl InstructionData for FunctionVerifyParams {}
impl Discriminator for FunctionVerifyParams {
    const DISCRIMINATOR: [u8; 8] = [210, 108, 154, 138, 198, 14, 53, 191];
}
impl Discriminator for FunctionVerify<'_> {
    const DISCRIMINATOR: [u8; 8] = [210, 108, 154, 138, 198, 14, 53, 191];
}

cfg_client! {
    pub struct FunctionVerifyAccounts {
        /// The FunctionAccount pubkey to verify.
        pub function: Pubkey,
        /// The pubkey of the enclave generated keypair that will be set after verification.
        /// This keypair must sign any subsequent instructions to prove the instructions
        /// were generated within an enclave.
        pub function_enclave_signer: Pubkey,
        /// The Function's SwitchboardWallet pubkey used to reward verifiers.
        pub function_escrow: Pubkey,

        /// The VerifierAccount pubkey that is verifying the request.
        pub verifier: Pubkey,
        /// The VerifierAccount's enclave generated signer that must approve verifications.
        pub verifier_enclave_signer: Pubkey,
        /// The VerifierAccount's token wallet to receive a reward for verifying the request.
        pub reward_receiver: Pubkey,

        /// The AttestationQueueAccount that the request is being verified for.
        pub attestation_queue: Pubkey,
        /// The AttestationQueueAccount's authority. Used to derive the VerifierAccount's permission account.
        pub queue_authority: Pubkey,
    }
    impl ToAccountMetas for FunctionVerifyAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(self.function, false),
                AccountMeta::new_readonly(self.function_enclave_signer, true),
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
                AccountMeta::new_readonly(self.function_escrow, false),
                AccountMeta::new(crate::utils::find_associated_token_address(&self.function_escrow, &NativeMint::ID), false),
                AccountMeta::new(self.reward_receiver, false),
                AccountMeta::new_readonly(self.attestation_queue, false),
                AccountMeta::new_readonly(anchor_spl::token::ID, false),
            ]
        }
    }
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
        error_code: u8,
        mr_enclave: [u8; 32],
    ) -> ProgramResult {
        let cpi_params = FunctionVerifyParams {
            observed_time,
            next_allowed_timestamp,
            error_code,
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
        error_code: u8,
        mr_enclave: [u8; 32],
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = FunctionVerifyParams {
            observed_time,
            next_allowed_timestamp,
            error_code,
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
        account_metas.extend(self.function_enclave_signer.to_account_metas(Some(true)));
        account_metas.extend(self.verifier.to_account_metas(None));
        account_metas.extend(self.verifier_signer.to_account_metas(Some(true)));
        account_metas.extend(self.verifier_permission.to_account_metas(None));
        account_metas.extend(self.escrow_wallet.to_account_metas(None));
        account_metas.extend(self.escrow_token_wallet.to_account_metas(None));
        account_metas.extend(self.receiver.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            accounts: &FunctionVerifyAccounts,
            params: &FunctionVerifyParams,
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
