use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRequestInitParams)]
pub struct FunctionRequestInit<'info> {
    #[account(
        mut,
        signer,
        owner = system_program.key(),
        constraint = request.data_len() == 0 && request.lamports() == 0,
    )]
    pub request: AccountInfo<'info>,

    /// CHECK: the authority of the request
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

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRequestInitParams {
    pub max_container_params_len: Option<u32>,
    pub container_params: Vec<u8>,
    pub garbage_collection_slot: Option<u64>,
}

impl InstructionData for FunctionRequestInitParams {}

impl Discriminator for FunctionRequestInitParams {
    const DISCRIMINATOR: [u8; 8] = [118, 8, 251, 119, 88, 174, 81, 239];
}

impl Discriminator for FunctionRequestInit<'_> {
    const DISCRIMINATOR: [u8; 8] = [118, 8, 251, 119, 88, 174, 81, 239];
}

impl<'info> FunctionRequestInit<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: FunctionRequestInitParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRequestInit::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
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
    /// # Returns
    ///
    /// * `ProgramResult`: Indicates the result of the instruction execution.
    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        max_container_params_len: Option<u32>,
        container_params: Option<Vec<u8>>,
        garbage_collection_slot: Option<u64>,
    ) -> ProgramResult {
        let instruction = self.get_instruction(
            *program.key,
            FunctionRequestInitParams {
                max_container_params_len,
                container_params: container_params.unwrap_or_default(),
                garbage_collection_slot,
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
    /// * `signer_seeds`: Seeds used for signing.
    ///
    /// # Returns
    ///
    /// * `ProgramResult`: Indicates the result of the instruction execution.
    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        max_container_params_len: Option<u32>,
        container_params: Option<Vec<u8>>,
        garbage_collection_slot: Option<u64>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(
            *program.key,
            FunctionRequestInitParams {
                max_container_params_len,
                container_params: container_params.unwrap_or_default(),
                garbage_collection_slot,
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
}
