use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:WalletInitParams)]
pub struct WalletInit<'info> {
    #[account(
        init,
        space = SwitchboardWallet::space(params.max_len),
        payer = payer,
        seeds = [
            mint.key().as_ref(),
            attestation_queue.key().as_ref(),
            authority.key().as_ref(),
            &SwitchboardWallet::parse_name(&params.name),
        ],
        bump,
    )]
    pub wallet: Box<Account<'info, SwitchboardWallet>>,

    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,

    /// CHECK:
    pub authority: AccountInfo<'info>,

    // allows us to pull mint from the queue if we ever need to
    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,

    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = wallet,
    )]
    pub token_wallet: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [STATE_SEED],
        bump = state.load()?.bump
    )]
    pub state: AccountLoader<'info, AttestationProgramState>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct WalletInitParams {
    pub name: Vec<u8>,
    pub max_len: Option<u32>,
}

impl InstructionData for WalletInitParams {}

impl Discriminator for WalletInitParams {
    const DISCRIMINATOR: [u8; 8] = [196, 234, 169, 159, 123, 161, 11, 108];
}

impl Discriminator for WalletInit<'_> {
    const DISCRIMINATOR: [u8; 8] = [196, 234, 169, 159, 123, 161, 11, 108];
}

impl<'info> WalletInit<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &WalletInitParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = WalletInit::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, params: &WalletInitParams) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &WalletInitParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.wallet.to_account_infos());
        account_infos.extend(self.mint.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.token_wallet.to_account_infos());
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.state.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos.extend(self.associated_token_program.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.wallet.to_account_metas(None));
        account_metas.extend(self.mint.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.token_wallet.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(None));
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas.extend(self.associated_token_program.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas
    }
}
