use crate::prelude::*;

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

    #[account(
        mut,
        has_one = attestation_queue,
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,

    #[account(
      mut,
      owner = system_program.key(),
      constraint = request.data_len() == 0 && request.lamports() == 0,
    )]
    pub escrow: AccountInfo<'info>,

    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,

    #[account(
        seeds = [STATE_SEED],
        bump = state.load()?.bump,
    )]
    pub state: AccountLoader<'info, AttestationProgramState>,

    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRequestInitAndTriggerParams {
    pub bounty: Option<u64>,
    pub slots_until_expiration: Option<u64>,
    pub max_container_params_len: Option<u32>,
    pub container_params: Option<Vec<u8>>,
    pub garbage_collection_slot: Option<u64>,
}

impl InstructionData for FunctionRequestInitAndTriggerParams {}

impl Discriminator for FunctionRequestInitAndTriggerParams {
    const DISCRIMINATOR: [u8; 8] = [86, 151, 134, 172, 35, 218, 207, 154];
}

impl Discriminator for FunctionRequestInitAndTrigger<'_> {
    const DISCRIMINATOR: [u8; 8] = [86, 151, 134, 172, 35, 218, 207, 154];
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

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        bounty: Option<u64>,
        slots_until_expiration: Option<u64>,
        max_container_params_len: Option<u32>,
        container_params: Option<Vec<u8>>,
        garbage_collection_slot: Option<u64>,
    ) -> ProgramResult {
        let instruction = self.get_instruction(
            *program.key,
            FunctionRequestInitAndTriggerParams {
                bounty,
                slots_until_expiration,
                max_container_params_len,
                container_params,
                garbage_collection_slot,
            },
        )?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        bounty: Option<u64>,
        slots_until_expiration: Option<u64>,
        max_container_params_len: Option<u32>,
        container_params: Option<Vec<u8>>,
        garbage_collection_slot: Option<u64>,
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
            },
        )?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.request.to_account_infos());
        account_infos.extend(self.function.to_account_infos());
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
        account_metas.extend(self.function.to_account_metas(None));
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
