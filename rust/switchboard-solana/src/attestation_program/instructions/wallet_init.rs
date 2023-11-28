use crate::{cfg_client, prelude::*};

#[derive(Accounts)]
#[instruction(params:WalletInitParams)]
pub struct WalletInit<'info> {
    #[account(mut)]
    pub wallet: AccountInfo<'info>, // SwitchboardWallet
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: AccountInfo<'info>, // Mint
    /// CHECK:
    pub authority: AccountInfo<'info>,
    // allows us to pull mint from the queue if we ever need to
    pub attestation_queue: AccountInfo<'info>, // AttestationQueueAccountData
    #[account(mut)]
    pub token_wallet: AccountInfo<'info>, // TokenAccount
    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,
    pub state: AccountInfo<'info>, // TODO: remove AttestationProgramState
    #[account(address = anchor_spl::token::ID)]
    pub token_program: AccountInfo<'info>,
    #[account(address = anchor_spl::associated_token::ID)]
    pub associated_token_program: AccountInfo<'info>,
    #[account(address = solana_program::system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[derive(Clone, Default, AnchorSerialize, AnchorDeserialize)]
pub struct WalletInitParams {
    pub name: Vec<u8>,
    // TODO: remove
    pub max_len: [u8; 4],
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
        name: &[u8],
        // params: &WalletInitParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = WalletInit::discriminator().try_to_vec()?;
        let params = WalletInitParams {
            name: name.to_vec(),
            max_len: [0, 0, 0, 0],
        };
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, name: &[u8]) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, name)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        name: &[u8],
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, name)?;
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

    cfg_client! {
        pub fn build_ix(
            accounts: &SwitchboardWalletInitAccounts,
            params: &WalletInitParams,
        ) -> Result<Instruction, SbError> {
            Ok(crate::utils::build_ix(
                &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                accounts,
                params,
            ))
        }
    }
}
