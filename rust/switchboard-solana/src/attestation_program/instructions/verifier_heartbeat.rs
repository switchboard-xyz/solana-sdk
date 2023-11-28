use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:VerifierHeartbeatParams)]
pub struct VerifierHeartbeat<'info> {
    #[account(mut)]
    pub verifier: AccountInfo<'info>,

    #[account(signer)]
    pub verifier_signer: AccountInfo<'info>,

    #[account(mut)]
    pub attestation_queue: AccountInfo<'info>,

    pub queue_authority: AccountInfo<'info>,

    #[account(mut)]
    pub gc_node: AccountInfo<'info>,

    pub permission: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VerifierHeartbeatParams {}

impl InstructionData for VerifierHeartbeatParams {}

impl Discriminator for VerifierHeartbeatParams {
    const DISCRIMINATOR: [u8; 8] = [25, 238, 221, 14, 250, 148, 0, 140];
}

impl Discriminator for VerifierHeartbeat<'_> {
    const DISCRIMINATOR: [u8; 8] = [25, 238, 221, 14, 250, 148, 0, 140];
}

cfg_client! {
    pub struct VerifierHeartbeatArgs {
        pub verifier: Pubkey,
        pub enclave_signer: Pubkey,
        pub attestation_queue: Pubkey,
        pub queue_authority: Pubkey,
        pub gc_node: Pubkey,
    }
    pub struct VerifierHeartbeatAccounts {
        pub verifier: Pubkey,
        pub enclave_signer: Pubkey,
        pub attestation_queue: Pubkey,
        pub queue_authority: Pubkey,
        pub gc_node: Pubkey,
        pub permission: Pubkey,
    }
    impl ToAccountMetas for VerifierHeartbeatAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(self.verifier, false),
                AccountMeta::new_readonly(self.enclave_signer, true),
                AccountMeta::new(self.attestation_queue, false),
                AccountMeta::new_readonly(self.queue_authority, false),
                AccountMeta::new(self.gc_node, false),
                AccountMeta::new_readonly(self.permission, false),
            ]
        }
    }
}

impl<'info> VerifierHeartbeat<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: VerifierHeartbeatParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VerifierHeartbeat::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: VerifierHeartbeatParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: VerifierHeartbeatParams,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.verifier.to_account_infos());
        account_infos.extend(self.verifier_signer.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.queue_authority.to_account_infos());
        account_infos.extend(self.gc_node.to_account_infos());
        account_infos.extend(self.permission.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.verifier.to_account_metas(None));
        account_metas.extend(self.verifier_signer.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.queue_authority.to_account_metas(None));
        account_metas.extend(self.gc_node.to_account_metas(None));
        account_metas.extend(self.permission.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            args: VerifierHeartbeatArgs
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &VerifierHeartbeatAccounts {
                        verifier: args.verifier,
                        enclave_signer: args.enclave_signer,
                        attestation_queue: args.attestation_queue,
                        queue_authority: args.queue_authority,
                        gc_node: args.gc_node,
                        permission: AttestationPermissionAccountData::get_pda(&args.queue_authority, &args.attestation_queue, &args.verifier),
                    },
                    &VerifierHeartbeatParams {},
                )
            )
        }
    }
}
