use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:WalletWithdrawParams)]
pub struct WalletWithdraw<'info> {
    #[account(mut)]
    pub wallet: AccountInfo<'info>, // SwitchboardWallet
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: AccountInfo<'info>, // TokenMint
    /// CHECK:
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    pub attestation_queue: AccountInfo<'info>, // AttestationQueueAccountData
    #[account(mut)]
    pub token_wallet: AccountInfo<'info>, // TokenAccount
    #[account(mut)]
    pub destination_wallet: AccountInfo<'info>, // TokenAccount
    pub state: AccountInfo<'info>,             // AttestationProgramState
    #[account(address = anchor_spl::token::ID)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct WalletWithdrawParams {
    pub amount: u64,
}

impl InstructionData for WalletWithdrawParams {}

impl Discriminator for WalletWithdrawParams {
    const DISCRIMINATOR: [u8; 8] = [157, 251, 53, 205, 191, 139, 118, 213];
}

impl Discriminator for WalletWithdraw<'_> {
    const DISCRIMINATOR: [u8; 8] = [157, 251, 53, 205, 191, 139, 118, 213];
}

impl<'info> WalletWithdraw<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        amount: u64,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let params = WalletWithdrawParams { amount };
        let mut data: Vec<u8> = WalletWithdraw::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, amount: u64) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, amount)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        amount: u64,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, amount)?;
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
        account_infos.extend(self.destination_wallet.to_account_infos());
        account_infos.extend(self.state.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
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
        account_metas.extend(self.destination_wallet.to_account_metas(None));
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas
    }
}
