use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRequestInitParams)]
pub struct FunctionRequestInit<'info> {
    #[account(
        init,
        payer = payer,
        space = FunctionRequestAccountData::space(
            params.max_container_params_len
        )
    )]
    pub request: Box<Account<'info, FunctionRequestAccountData>>,
    /// CHECK: the authority of the request
    pub authority: AccountInfo<'info>,
    #[account(
        mut, 
        has_one = attestation_queue
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,
    /// CHECK: function authority required to permit new requests
    #[account(mut)]
    pub function_authority: Option<AccountInfo<'info>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = request,
    )]
    pub escrow: Box<Account<'info, TokenAccount>>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,
    #[account(
        seeds = [STATE_SEED], 
        bump = state.load()?.bump
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
        params: &FunctionRequestInitParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRequestInit::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRequestInitParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionRequestInitParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
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
            account_metas.extend(function_authority.to_account_metas(None));
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
