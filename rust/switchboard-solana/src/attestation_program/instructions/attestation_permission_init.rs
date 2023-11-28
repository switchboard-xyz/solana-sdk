use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:AttestationPermissionInitParams)]
pub struct AttestationPermissionInit<'info> {
    #[account(mut)]
    pub permission: AccountInfo<'info>,

    /// CHECK:
    pub authority: AccountInfo<'info>,

    pub attestation_queue: AccountInfo<'info>,

    /// CHECK:
    pub node: AccountInfo<'info>,

    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,

    pub system_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct AttestationPermissionInitParams {}

impl InstructionData for AttestationPermissionInitParams {}

impl Discriminator for AttestationPermissionInitParams {
    const DISCRIMINATOR: [u8; 8] = [219, 80, 131, 73, 164, 190, 142, 215];
}

impl Discriminator for AttestationPermissionInit<'_> {
    const DISCRIMINATOR: [u8; 8] = [219, 80, 131, 73, 164, 190, 142, 215];
}

cfg_client! {
    pub struct AttestationPermissionInitAccounts {
        pub queue_authority: Pubkey,
        pub attestation_queue: Pubkey,
        pub node: Pubkey,
        pub payer: Pubkey,
    }
    impl ToAccountMetas for AttestationPermissionInitAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(AttestationPermissionAccountData::get_pda(&self.queue_authority, &self.attestation_queue, &self.node), false),
                AccountMeta::new_readonly(self.queue_authority, true),
                AccountMeta::new_readonly(self.attestation_queue, false),
                AccountMeta::new_readonly(self.node, true),
                AccountMeta::new(self.payer, true),
                AccountMeta::new_readonly(solana_program::system_program::ID, false),
            ]
        }
    }
}

impl<'info> AttestationPermissionInit<'info> {
    pub fn get_instruction(&self, program_id: Pubkey) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let instruction = Instruction::new_with_bytes(
            program_id,
            &AttestationPermissionInit::discriminator().try_to_vec()?,
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
        account_infos.extend(self.node.to_account_infos());
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());

        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.permission.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.node.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(Some(true)));
        account_metas.extend(self.system_program.to_account_metas(None));

        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            attestation_queue: Pubkey, queue_authority: Pubkey, node: Pubkey, payer: Pubkey,
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &AttestationPermissionInitAccounts {
                    queue_authority, attestation_queue, node, payer,
                    },
                &AttestationPermissionInitParams{},
                )
            )
        }
    }
}
