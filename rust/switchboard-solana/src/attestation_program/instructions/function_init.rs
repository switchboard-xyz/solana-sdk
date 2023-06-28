use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionInitParams)]
pub struct FunctionInit<'info> {
    #[account(
        init,
        space = FunctionAccountData::size(), 
        payer = payer
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,

    /// CHECK: todo
    #[account(mut)]
    pub address_lookup_table: AccountInfo<'info>,

    /// CHECK: todo
    pub authority: AccountInfo<'info>,

    #[account(
        init,
        seeds = [QUOTE_SEED,
        function.key().as_ref()],
        space = EnclaveAccountData::size(),
        payer = payer,
        bump,
    )]
    pub quote: AccountLoader<'info, EnclaveAccountData>,

    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = function,
    )]
    pub escrow: Account<'info, TokenAccount>,

    #[account(seeds = [STATE_SEED], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, AttestationProgramState>,

    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,

    /// CHECK:
    #[account(
        constraint = address_lookup_program.executable && address_lookup_program.key().as_ref() == solana_address_lookup_table_program::id().as_ref()
    )]
    pub address_lookup_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionInitParams {
    pub name: Vec<u8>,
    pub metadata: Vec<u8>,
    pub container: Vec<u8>,
    pub container_registry: Vec<u8>,
    pub version: Vec<u8>,
    pub schedule: Vec<u8>,
    pub mr_enclave: [u8; 32],
    pub recent_slot: u64,
    pub requests_disabled: bool,
    pub requests_require_authorization: bool,
    pub requests_default_slots_until_expiration: u64,
    pub requests_fee: u64,
}

impl InstructionData for FunctionInitParams {}

impl Discriminator for FunctionInitParams {
    const DISCRIMINATOR: [u8; 8] = [0, 20, 30, 24, 100, 146, 13, 162];
}

impl Discriminator for FunctionInit<'_> {
    const DISCRIMINATOR: [u8; 8] = [0, 20, 30, 24, 100, 146, 13, 162];
}

impl<'info> FunctionInit<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &FunctionInitParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionInit::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionInitParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &FunctionInitParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.address_lookup_table.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.quote.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.escrow.to_account_infos());
        account_infos.extend(self.state.to_account_infos());
        account_infos.extend(self.mint.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos.extend(self.associated_token_program.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());
        account_infos.extend(self.address_lookup_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.function.to_account_metas(Some(true)));
        account_metas.extend(self.address_lookup_table.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.quote.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(None));
        account_metas.extend(self.escrow.to_account_metas(None));
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.mint.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas
            .extend(self.associated_token_program.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas.extend(self.address_lookup_program.to_account_metas(None));
        account_metas
    }
}
