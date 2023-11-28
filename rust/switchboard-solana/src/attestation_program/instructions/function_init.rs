use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionInitParams)]
pub struct FunctionInit<'info> {
    #[account(
        mut,
        signer,
        owner = system_program.key(),
        constraint = function.data_len() == 0 && function.lamports() == 0,
    )]
    pub function: AccountInfo<'info>,

    /// CHECK: todo
    #[account(mut)]
    pub address_lookup_table: AccountInfo<'info>,

    /// CHECK:
    pub authority: AccountInfo<'info>,

    pub attestation_queue: AccountInfo<'info>,

    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,

    /// CHECK: handle this manually because the PDA seed can vary
    #[account(mut)]
    pub escrow_wallet: AccountInfo<'info>,

    #[account(signer)]
    pub escrow_wallet_authority: Option<AccountInfo<'info>>,

    /// CHECK: handle this manually because the PDA seed can vary
    #[account(mut)]
    pub escrow_token_wallet: AccountInfo<'info>,

    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: AccountInfo<'info>,
    #[account(address = anchor_spl::token::ID)]
    pub token_program: AccountInfo<'info>,
    #[account(address = anchor_spl::associated_token::ID)]
    pub associated_token_program: AccountInfo<'info>,
    #[account(address = solana_program::system_program::ID)]
    pub system_program: AccountInfo<'info>,

    /// CHECK:
    #[account(
      constraint = address_lookup_program.executable,
      address = solana_address_lookup_table_program::id(),
    )]
    pub address_lookup_program: AccountInfo<'info>,
}

#[derive(Clone, Default, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionInitParams {
    // PDA fields
    pub recent_slot: u64,
    pub creator_seed: Option<[u8; 32]>,

    // Metadata
    pub name: Vec<u8>,
    pub metadata: Vec<u8>,

    // Container Config
    pub container: Vec<u8>,
    pub container_registry: Vec<u8>,
    pub version: Vec<u8>,
    pub mr_enclave: Option<[u8; 32]>,

    // pub schedule: Vec<u8>,

    // Request Config
    pub requests_disabled: bool,
    pub requests_require_authorization: bool,
    pub requests_dev_fee: u64,

    // Routines Config
    pub routines_disabled: bool,
    pub routines_require_authorization: bool,
    pub routines_dev_fee: u64,
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
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.escrow_wallet.to_account_infos());
        account_infos.extend(self.escrow_wallet_authority.to_account_infos());
        account_infos.extend(self.escrow_token_wallet.to_account_infos());
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
        account_metas.extend(self.function.to_account_metas(None));
        account_metas.extend(self.address_lookup_table.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(Some(true)));
        account_metas.extend(self.escrow_wallet.to_account_metas(None));
        if let Some(escrow_wallet_authority) = &self.escrow_wallet_authority {
            account_metas.extend(escrow_wallet_authority.to_account_metas(Some(true)));
        } else {
            account_metas.push(AccountMeta::new_readonly(
                SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                false,
            ));
        }
        account_metas.extend(self.escrow_token_wallet.to_account_metas(None));
        account_metas.extend(self.mint.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas.extend(self.associated_token_program.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas.extend(self.address_lookup_program.to_account_metas(None));
        account_metas
    }
}
