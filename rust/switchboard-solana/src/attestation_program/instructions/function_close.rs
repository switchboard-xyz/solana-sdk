use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionCloseParams)]
pub struct FunctionClose<'info> {
    #[account(
        mut,
        close = sol_dest,
        has_one = authority,
        has_one = escrow,
        has_one = address_lookup_table,
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,

    pub authority: Signer<'info>,

    #[account(
        mut,
        constraint = escrow.is_native() && escrow.owner == state.key()
    )]
    pub escrow: Box<Account<'info, TokenAccount>>,

    /// CHECK: handled in function has_one
    #[account(
        mut,
        constraint = *address_lookup_table.owner == address_lookup_program.key()
    )]
    pub address_lookup_table: AccountInfo<'info>,

    /// CHECK:
    pub sol_dest: AccountInfo<'info>,

    #[account(mut, constraint = escrow.is_native())]
    pub escrow_dest: Box<Account<'info, TokenAccount>>,

    #[account(seeds = [STATE_SEED], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, AttestationProgramState>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,

    /// CHECK:
    #[account(
        constraint = address_lookup_program.executable && address_lookup_program.key().as_ref() == solana_address_lookup_table_program::id().as_ref()
    )]
    pub address_lookup_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionCloseParams {}

impl InstructionData for FunctionCloseParams {}

impl Discriminator for FunctionCloseParams {
    const DISCRIMINATOR: [u8; 8] = [94, 164, 174, 42, 156, 29, 244, 236];
}

impl Discriminator for FunctionClose<'_> {
    const DISCRIMINATOR: [u8; 8] = [94, 164, 174, 42, 156, 29, 244, 236];
}

impl<'info> FunctionClose<'info> {
    pub fn get_instruction(&self, program_id: Pubkey) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionClose::discriminator().try_to_vec()?;
        let params = FunctionCloseParams {};
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>) -> ProgramResult {
        let instruction = self.get_instruction(*program.key)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.escrow.to_account_infos());
        account_infos.extend(self.address_lookup_table.to_account_infos());
        account_infos.extend(self.sol_dest.to_account_infos());
        account_infos.extend(self.escrow_dest.to_account_infos());
        account_infos.extend(self.state.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());
        account_infos.extend(self.address_lookup_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.function.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.escrow.to_account_metas(None));
        account_metas.extend(self.address_lookup_table.to_account_metas(None));
        account_metas.extend(self.sol_dest.to_account_metas(None));
        account_metas.extend(self.escrow_dest.to_account_metas(None));
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas.extend(self.address_lookup_program.to_account_metas(None));
        account_metas
    }
}
