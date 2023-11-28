use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:VerifierQuoteVerifyParams)]
pub struct VerifierQuoteVerify<'info> {
    #[account(mut)]
    pub quote: AccountInfo<'info>,

    pub verifier: AccountInfo<'info>,

    /// CHECK:
    #[account(signer)]
    pub enclave_signer: AccountInfo<'info>,

    #[account(mut)]
    pub attestation_queue: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VerifierQuoteVerifyParams {
    pub timestamp: i64,
    pub mr_enclave: [u8; 32],
    pub idx: u32,
}

impl InstructionData for VerifierQuoteVerifyParams {}

impl Discriminator for VerifierQuoteVerifyParams {
    const DISCRIMINATOR: [u8; 8] = [73, 38, 235, 197, 78, 209, 141, 253];
}

impl Discriminator for VerifierQuoteVerify<'_> {
    const DISCRIMINATOR: [u8; 8] = [73, 38, 235, 197, 78, 209, 141, 253];
}

cfg_client! {
    pub struct VerifierQuoteVerifyArgs {
        pub quote: Pubkey,
        pub verifier: Pubkey,
        pub enclave_signer: Pubkey,
        pub attestation_queue: Pubkey,
        pub timestamp: i64,
        pub mr_enclave: [u8; 32],
        pub idx: u32,
    }
    pub struct VerifierQuoteVerifyAccounts {
        pub quote: Pubkey,
        pub verifier: Pubkey,
        pub enclave_signer: Pubkey,
        pub attestation_queue: Pubkey,
    }
    impl ToAccountMetas for VerifierQuoteVerifyAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(self.quote, false),
                AccountMeta::new_readonly(self.verifier, false),
                AccountMeta::new_readonly(self.enclave_signer, true),
                AccountMeta::new(self.attestation_queue, false)
            ]
        }
    }
}

impl<'info> VerifierQuoteVerify<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: VerifierQuoteVerifyParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VerifierQuoteVerify::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: VerifierQuoteVerifyParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: VerifierQuoteVerifyParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.quote.to_account_infos());
        account_infos.extend(self.verifier.to_account_infos());
        account_infos.extend(self.enclave_signer.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.quote.to_account_metas(None));
        account_metas.extend(self.verifier.to_account_metas(None));
        account_metas.extend(self.enclave_signer.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            args: VerifierQuoteVerifyArgs
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &VerifierQuoteVerifyAccounts {
                        quote: args.quote,
                        verifier: args.verifier,
                        enclave_signer: args.enclave_signer,
                        attestation_queue: args.attestation_queue,
                    },
                    &VerifierQuoteVerifyParams {timestamp: args.timestamp, mr_enclave: args.mr_enclave, idx: args.idx},
                )
            )
        }
    }
}
