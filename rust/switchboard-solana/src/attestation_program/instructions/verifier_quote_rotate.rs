use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:VerifierQuoteRotateParams)]
pub struct VerifierQuoteRotate<'info> {
    #[account(mut)]
    pub verifier: AccountInfo<'info>,

    #[account(signer)]
    pub authority: AccountInfo<'info>,

    /// CHECK:
    pub enclave_signer: AccountInfo<'info>,

    #[account(mut)]
    pub attestation_queue: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VerifierQuoteRotateParams {
    pub registry_key: [u8; 64],
}

impl InstructionData for VerifierQuoteRotateParams {}

impl Discriminator for VerifierQuoteRotateParams {
    const DISCRIMINATOR: [u8; 8] = [52, 93, 191, 90, 182, 82, 65, 197];
}

impl Discriminator for VerifierQuoteRotate<'_> {
    const DISCRIMINATOR: [u8; 8] = [52, 93, 191, 90, 182, 82, 65, 197];
}

cfg_client! {
    pub struct VerifierQuoteRotateAccounts {
        pub verifier: Pubkey,
        pub authority: Pubkey,
        pub enclave_signer: Pubkey,
        pub attestation_queue: Pubkey,
    }
    impl ToAccountMetas for VerifierQuoteRotateAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(self.verifier, false),
                AccountMeta::new_readonly(self.authority, true),
                AccountMeta::new_readonly(self.enclave_signer, false),
                AccountMeta::new(self.attestation_queue, false)
            ]
        }
    }
}

impl<'info> VerifierQuoteRotate<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        registry_key: [u8; 64],
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VerifierQuoteRotate::discriminator().try_to_vec()?;
        data.append(&mut registry_key.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, registry_key: [u8; 64]) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, registry_key)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        registry_key: [u8; 64],
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, registry_key)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.verifier.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.enclave_signer.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.verifier.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.enclave_signer.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            verifier: &Pubkey,
            verifier_authority: &Pubkey,
            enclave_signer: &Pubkey,
            attestation_queue: &Pubkey,
            registry_key: [u8; 64],
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &VerifierQuoteRotateAccounts {
                        verifier: *verifier,
                        authority: *verifier_authority,
                        enclave_signer: *enclave_signer,
                        attestation_queue: *attestation_queue,
                    },
                    &VerifierQuoteRotateParams {registry_key},
                )
            )
        }
    }
}
