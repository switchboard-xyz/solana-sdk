use crate::cfg_client;
use crate::prelude::*;
use crate::*;

#[derive(Accounts)]
#[instruction(params:FunctionRequestInitAndTriggerParams)]
pub struct FunctionRequestInitAndTrigger<'info> {
    #[account(
      mut,
      signer,
      owner = system_program.key(),
      constraint = request.data_len() == 0 && request.lamports() == 0,
    )]
    pub request: AccountInfo<'info>,

    pub authority: AccountInfo<'info>,

    #[account(mut)]
    pub function: AccountInfo<'info>,

    /// CHECK: function authority required to permit new requests
    #[account(signer)]
    pub function_authority: Option<AccountInfo<'info>>,

    #[account(
      mut,
      owner = system_program.key(),
      constraint = request.data_len() == 0 && request.lamports() == 0,
    )]
    pub escrow: AccountInfo<'info>,

    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: AccountInfo<'info>,

    pub state: AccountInfo<'info>,

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

#[derive(Clone, AnchorSerialize, AnchorDeserialize, Default)]
pub struct FunctionRequestInitAndTriggerParams {
    pub bounty: Option<u64>,
    pub slots_until_expiration: Option<u64>,
    pub max_container_params_len: Option<u32>,
    pub container_params: Option<Vec<u8>>,
    pub garbage_collection_slot: Option<u64>,
    pub valid_after_slot: Option<u64>,
}

impl InstructionData for FunctionRequestInitAndTriggerParams {}

impl Discriminator for FunctionRequestInitAndTriggerParams {
    const DISCRIMINATOR: [u8; 8] = [86, 151, 134, 172, 35, 218, 207, 154];
}

impl Discriminator for FunctionRequestInitAndTrigger<'_> {
    const DISCRIMINATOR: [u8; 8] = [86, 151, 134, 172, 35, 218, 207, 154];
}

cfg_client! {

    pub struct FunctionRequestInitAndTriggerAccounts {
        pub request: Pubkey,
        pub authority: Pubkey,
        /// The FunctionAccount for the request
        pub function: Pubkey,
        pub function_authority: Option<Pubkey>,
        /// The AttestationQueueAccount that the request is being verified for.
        pub attestation_queue: Pubkey,
        pub payer: Pubkey,
    }
    impl ToAccountMetas for FunctionRequestInitAndTriggerAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            let func_authority = if let Some(function_authority) = &self.function_authority {
                AccountMeta::new_readonly(*function_authority, true)
            } else {
                AccountMeta::new_readonly(SWITCHBOARD_ATTESTATION_PROGRAM_ID, false)
            };

            vec![
                AccountMeta::new(self.request, true),
                AccountMeta::new_readonly(self.authority, true),
                AccountMeta::new(self.function, false),
                func_authority,
                AccountMeta::new(find_associated_token_address(&self.request, &NativeMint::id()), false),
                AccountMeta::new(NativeMint::id(), false),
                AccountMeta::new_readonly(AttestationProgramState::get_pda(), false),
                AccountMeta::new_readonly(self.attestation_queue, false),
                AccountMeta::new(self.payer, true),
                AccountMeta::new_readonly(anchor_lang::system_program::ID, false),
                AccountMeta::new_readonly(anchor_spl::token::ID, false),
                AccountMeta::new_readonly(anchor_spl::associated_token::ID, false),
            ]
        }
    }
}

impl<'info> FunctionRequestInitAndTrigger<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: FunctionRequestInitAndTriggerParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRequestInitAndTrigger::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    /// Invokes the instruction.
    ///
    /// # Arguments
    ///
    /// * `program`: The Switchboard Attestation program AccountInfo.
    ///
    /// * `max_container_params_len`: The maximum length of the vector containing the container parameters.
    ///   - Default: 256 bytes.
    ///   - Example: `Some(512)`.
    ///
    /// * `container_params`: The parameters for the container.
    ///   - Default: Empty vector.
    ///   - Example: `Some(request_params.into_bytes())`.
    ///
    /// * `garbage_collection_slot`: The slot when the request can be closed by anyone and is considered expired.
    ///   - Default: None, meaning only the authority can close the request.
    ///
    /// * `bounty`: An optional fee to reward oracles for priority processing.
    ///   - Default: 0 lamports.
    ///
    /// * `slots_until_expiration`: An optional specification for the max number of slots the request can be processed in.
    ///   - Default: 2250 slots (roughly 15 minutes at 400 ms/slot).
    ///   - Minimum: 150 slots (approximately 1 minute at 400 ms/slot).
    ///
    /// * `valid_after_slot`: Schedule when the request should be valid for processing.
    ///   - Default: 0 slots, meaning the request is valid immediately for oracles to process.
    ///
    /// # Returns
    ///
    /// * `ProgramResult`: Indicates the result of the instruction execution.
    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        bounty: Option<u64>,
        slots_until_expiration: Option<u64>,
        max_container_params_len: Option<u32>,
        container_params: Option<Vec<u8>>,
        garbage_collection_slot: Option<u64>,
        valid_after_slot: Option<u64>,
    ) -> ProgramResult {
        let instruction = self.get_instruction(
            *program.key,
            FunctionRequestInitAndTriggerParams {
                bounty,
                slots_until_expiration,
                max_container_params_len,
                container_params,
                garbage_collection_slot,
                valid_after_slot,
            },
        )?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    /// Invokes the instruction using a signed authority.
    ///
    /// # Arguments
    ///
    /// * `program`: The Switchboard Attestation program AccountInfo.
    ///
    /// * `max_container_params_len`: The maximum length of the vector containing the container parameters.
    ///   - Default: 256 bytes.
    ///   - Example: `Some(512)`.
    ///
    /// * `container_params`: The parameters for the container.
    ///   - Default: Empty vector.
    ///   - Example: `Some(request_params.into_bytes())`.
    ///
    /// * `garbage_collection_slot`: The slot when the request can be closed by anyone and is considered expired.
    ///   - Default: None, meaning only the authority can close the request.
    ///
    /// * `bounty`: An optional fee to reward oracles for priority processing.
    ///   - Default: 0 lamports.
    ///
    /// * `slots_until_expiration`: An optional specification for the max number of slots the request can be processed in.
    ///   - Default: 2250 slots (roughly 15 minutes at 400 ms/slot).
    ///   - Minimum: 150 slots (approximately 1 minute at 400 ms/slot).
    ///
    /// * `valid_after_slot`: Schedule when the request should be valid for processing.
    ///   - Default: 0 slots, meaning the request is valid immediately for oracles to process.
    ///
    /// * `signer_seeds`: Seeds used for signing.
    ///
    /// # Returns
    ///
    /// * `ProgramResult`: Indicates the result of the instruction execution.
    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        bounty: Option<u64>,
        slots_until_expiration: Option<u64>,
        max_container_params_len: Option<u32>,
        container_params: Option<Vec<u8>>,
        garbage_collection_slot: Option<u64>,
        valid_after_slot: Option<u64>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(
            *program.key,
            FunctionRequestInitAndTriggerParams {
                bounty,
                slots_until_expiration,
                max_container_params_len,
                container_params,
                garbage_collection_slot,
                valid_after_slot,
            },
        )?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.request.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.function_authority.to_account_infos());
        account_infos.extend(self.escrow.to_account_infos());
        account_infos.extend(self.mint.to_account_infos());
        account_infos.extend(self.state.to_account_infos());
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
        account_metas.extend(self.request.to_account_metas(Some(true)));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.function.to_account_metas(None));
        if let Some(function_authority) = &self.function_authority {
            account_metas.extend(function_authority.to_account_metas(Some(true)));
        } else {
            account_metas.push(AccountMeta::new_readonly(
                SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                false,
            ));
        }
        account_metas.extend(self.escrow.to_account_metas(None));
        account_metas.extend(self.mint.to_account_metas(None));
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas.extend(self.associated_token_program.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            accounts: &FunctionRequestInitAndTriggerAccounts,
            params: &FunctionRequestInitAndTriggerParams,
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
