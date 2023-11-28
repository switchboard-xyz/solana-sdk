use crate::cfg_client;
use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:AttestationQueueInitParams)]
pub struct AttestationQueueInit<'info> {
    #[account(mut, signer)]
    pub queue: AccountInfo<'info>,

    /// CHECK:
    pub authority: AccountInfo<'info>,

    #[account(mut, signer)]
    pub payer: AccountInfo<'info>,

    pub system_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct AttestationQueueInitParams {
    pub allow_authority_override_after: u32,
    pub require_authority_heartbeat_permission: bool,
    pub require_usage_permissions: bool,
    pub max_quote_verification_age: u32,
    pub reward: u32,
    pub node_timeout: u32,
}

impl InstructionData for AttestationQueueInitParams {}

impl Discriminator for AttestationQueueInitParams {
    const DISCRIMINATOR: [u8; 8] = [82, 211, 133, 63, 177, 112, 210, 216];
}

impl Discriminator for AttestationQueueInit<'_> {
    const DISCRIMINATOR: [u8; 8] = [82, 211, 133, 63, 177, 112, 210, 216];
}

cfg_client! {
    pub struct AttestationQueueInitArgs {
        pub attestation_queue: Pubkey,
        pub queue_authority: Option<Pubkey>,
        pub payer: Pubkey,
        pub allow_authority_override_after: u32,
        pub require_authority_heartbeat_permission: bool,
        pub require_usage_permissions: bool,
        pub max_quote_verification_age: u32,
        pub reward: u32,
        pub node_timeout: u32,
    }

    pub struct AttestationQueueInitAccounts {
        pub attestation_queue: Pubkey,
        pub queue_authority: Option<Pubkey>,
        pub payer: Pubkey,
    }
    impl ToAccountMetas for AttestationQueueInitAccounts {
        fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
            vec![
                AccountMeta::new(self.attestation_queue, true),
                AccountMeta::new_readonly(self.queue_authority.unwrap_or(self.payer), false),
                AccountMeta::new(self.payer, true),
                AccountMeta::new_readonly(solana_program::system_program::ID, false),
            ]
        }
    }
}

impl<'info> AttestationQueueInit<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: &AttestationQueueInitParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = AttestationQueueInit::discriminator().try_to_vec()?;
        data.append(&mut params.try_to_vec()?);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        params: &AttestationQueueInitParams,
    ) -> ProgramResult {
        let instruction = self.get_instruction(*program.key, params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        params: &AttestationQueueInitParams,
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
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.queue.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas
    }

    cfg_client! {
        pub fn build_ix(
            args: &AttestationQueueInitArgs,
        ) -> Result<Instruction, SbError> {
            Ok(
                crate::utils::build_ix(
                    &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
                    &AttestationQueueInitAccounts {
                        attestation_queue: args.attestation_queue,
                        queue_authority: args.queue_authority,
                        payer: args.payer,
                    },
                    &AttestationQueueInitParams {
                        allow_authority_override_after: args.allow_authority_override_after,
                        require_authority_heartbeat_permission: args.require_authority_heartbeat_permission,
                        require_usage_permissions: args.require_usage_permissions,
                        max_quote_verification_age: args.max_quote_verification_age,
                        reward: args.reward,
                        node_timeout: args.node_timeout,
                    },
                )
            )
        }
    }
}
