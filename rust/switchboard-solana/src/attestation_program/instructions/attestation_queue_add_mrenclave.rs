use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:AttestationQueueAddMrEnclaveParams)]
pub struct AttestationQueueAddMrEnclave<'info> {
    #[account(mut)]
    pub queue: AccountInfo<'info>,

    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct AttestationQueueAddMrEnclaveParams {
    pub mr_enclave: [u8; 32],
}

impl InstructionData for AttestationQueueAddMrEnclaveParams {}

impl Discriminator for AttestationQueueAddMrEnclaveParams {
    const DISCRIMINATOR: [u8; 8] = [62, 27, 24, 221, 30, 240, 63, 167];
}

impl Discriminator for AttestationQueueAddMrEnclave<'_> {
    const DISCRIMINATOR: [u8; 8] = [62, 27, 24, 221, 30, 240, 63, 167];
}

cfg_client! {
    pub struct AttestationQueueAddMrEnclaveArgs {
        pub attestation_queue: Pubkey,
        pub queue_authority: Pubkey,
        pub mr_enclave: [u8; 32],
    }

    pub struct AttestationQueueAddMrEnclaveAccounts {
        pub attestation_queue: Pubkey,
        pub queue_authority: Pubkey,
    }
    impl ToAccountMetas for AttestationQueueAddMrEnclaveAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![

                AccountMeta::new(self.attestation_queue, false),
                AccountMeta::new_readonly(self.queue_authority, false),
            ]
        }
    }
}

impl<'info> AttestationQueueAddMrEnclave<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &AttestationQueueAddMrEnclaveParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = AttestationQueueAddMrEnclave::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &AttestationQueueAddMrEnclaveParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &AttestationQueueAddMrEnclaveParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.queue.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.queue.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            args: &AttestationQueueAddMrEnclaveArgs,
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &AttestationQueueAddMrEnclaveAccounts {
                        attestation_queue: args.attestation_queue,
                        queue_authority: args.queue_authority,
                    },
                    &AttestationQueueAddMrEnclaveParams {
                        mr_enclave: args.mr_enclave
                    },
                )
            )
        }
    }
}
