use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:VerifierInitParams)]
pub struct VerifierInit<'info> {
    #[account(
        init,
        space = VerifierAccountData::size(),
        payer = payer
    )]
    pub verifier: AccountInfo<'info>,
    pub attestation_queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub authority: AccountInfo<'info>,
    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VerifierInitParams {}

impl InstructionData for VerifierInitParams {}

impl Discriminator for VerifierInitParams {
    const DISCRIMINATOR: [u8; 8] = [197, 138, 116, 14, 24, 81, 9, 245];
}

impl Discriminator for VerifierInit<'_> {
    const DISCRIMINATOR: [u8; 8] = [197, 138, 116, 14, 24, 81, 9, 245];
}

cfg_client! {
    pub struct VerifierInitArgs {
        pub verifier: Pubkey,
        pub attestation_queue: Pubkey,
        pub queue_authority: Pubkey,
        pub payer: Pubkey,
    }

    pub struct VerifierInitAccounts {
        pub verifier: Pubkey,
        pub attestation_queue: Pubkey,
        pub queue_authority: Pubkey,
        pub payer: Pubkey,
    }
    impl ToAccountMetas for VerifierInitAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![

                AccountMeta::new(self.verifier, true),
                AccountMeta::new(self.attestation_queue, false),
                AccountMeta::new_readonly(self.queue_authority, false), // MAYBE
                AccountMeta::new_readonly(self.payer, true),
                AccountMeta::new(self.payer, true),
                AccountMeta::new_readonly(solana_program::system_program::ID, false),
            ]
        }
    }
}

impl<'info> VerifierInit<'info> {
    pub fn get_instruction(&self, program_id: Pubkey) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let instruction =
            Instruction::new_with_bytes(program_id, &VerifierInit::discriminator(), accounts);
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
        account_infos.extend(self.verifier.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.queue_authority.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.verifier.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.queue_authority.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(Some(true)));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            args: &VerifierInitArgs,
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &VerifierInitAccounts {
                        verifier: args.verifier,
                        attestation_queue: args.attestation_queue,
                        queue_authority: args.queue_authority,
                        payer: args.payer,
                    },
                    &VerifierInitParams {},
                )
            )
        }
    }
}
