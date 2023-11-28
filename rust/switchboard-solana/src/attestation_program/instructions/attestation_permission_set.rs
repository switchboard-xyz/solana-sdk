use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:AttestationPermissionSetParams)]
pub struct AttestationPermissionSet<'info> {
    #[account(mut)]
    pub permission: AccountInfo<'info>,

    /// CHECK:
    #[account(signer)]
    pub authority: AccountInfo<'info>,

    pub attestation_queue: AccountInfo<'info>,

    /// CHECK:
    pub grantee: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct AttestationPermissionSetParams {
    pub permission: u32,
    pub enable: bool,
}

impl InstructionData for AttestationPermissionSetParams {}

impl Discriminator for AttestationPermissionSetParams {
    const DISCRIMINATOR: [u8; 8] = [56, 253, 255, 201, 100, 153, 10, 76];
}

impl Discriminator for AttestationPermissionSet<'_> {
    const DISCRIMINATOR: [u8; 8] = [56, 253, 255, 201, 100, 153, 10, 76];
}

cfg_client! {
    pub struct AttestationPermissionSetAccounts {
        pub queue_authority: Pubkey,
        pub attestation_queue: Pubkey,
        pub grantee: Pubkey,
    }
    impl ToAccountMetas for AttestationPermissionSetAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(AttestationPermissionAccountData::get_pda(&self.queue_authority, &self.attestation_queue, &self.grantee), false),
                AccountMeta::new_readonly(self.queue_authority, true),
                AccountMeta::new_readonly(self.attestation_queue, false),
                AccountMeta::new_readonly(self.grantee, true),
            ]
        }
    }
}

impl<'info> AttestationPermissionSet<'info> {
    pub fn get_instruction(&self, program_id: Pubkey) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let instruction = Instruction::new_with_bytes(
            program_id,
            &AttestationPermissionSet::discriminator().try_to_vec()?,
            accounts,
        );
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
        account_infos.extend(self.permission.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.grantee.to_account_infos());

        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.permission.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.grantee.to_account_metas(None));

        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            attestation_queue: Pubkey,
            queue_authority: Pubkey,
            grantee: Pubkey,
            permission: SwitchboardAttestationPermission,
            enable: bool,
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &AttestationPermissionSetAccounts {
                        queue_authority, attestation_queue, grantee
                    },
                    &AttestationPermissionSetParams {
                        permission: permission.into(),
                        enable
                    },
                )
            )
        }
    }
}
