use crate::prelude::*;

#[derive(Accounts)]
#[instruction(params:FunctionRequestTriggerParams)]
pub struct FunctionRequestTrigger<'info> {
    #[account(
      mut,
      has_one = function,
      has_one = escrow,
      has_one = authority,
    )]
    pub request: Box<Account<'info, FunctionRequestAccountData>>,

    /// CHECK: the request authority must authorize new requests
    pub authority: Signer<'info>,

    #[account(
      mut,
      constraint = escrow.is_native() && escrow.owner == state.key()
    )]
    pub escrow: Box<Account<'info, TokenAccount>>,

    #[account(
      mut,
      has_one = attestation_queue @ SwitchboardError::InvalidQueue,
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,

    #[account(
      seeds = [STATE_SEED],
      bump = state.load()?.bump,
    )]
    pub state: AccountLoader<'info, AttestationProgramState>,

    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionRequestTriggerParams {
    pub bounty: Option<u64>,
    pub slots_until_expiration: Option<u64>,
    // TODO: maybe add param to force transfer from function escrow if authority signs
    pub valid_after_slot: Option<u64>,
}

impl InstructionData for FunctionRequestTriggerParams {}

impl Discriminator for FunctionRequestTriggerParams {
    const DISCRIMINATOR: [u8; 8] = [74, 35, 78, 67, 196, 102, 78, 153];
}

impl Discriminator for FunctionRequestTrigger<'_> {
    const DISCRIMINATOR: [u8; 8] = [74, 35, 78, 67, 196, 102, 78, 153];
}

impl<'info> FunctionRequestTrigger<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: FunctionRequestTriggerParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionRequestTrigger::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        bounty: Option<u64>,
        slots_until_expiration: Option<u64>,
        valid_after_slot: Option<u64>,
    ) -> ProgramResult {
        let instruction = self.get_instruction(
            *program.key,
            FunctionRequestTriggerParams {
                bounty,
                slots_until_expiration,
                valid_after_slot,
            },
        )?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        bounty: Option<u64>,
        slots_until_expiration: Option<u64>,
        valid_after_slot: Option<u64>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(
            *program.key,
            FunctionRequestTriggerParams {
                bounty,
                slots_until_expiration,
                valid_after_slot,
            },
        )?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        let mut account_infos = Vec::new();
        account_infos.extend(self.request.to_account_infos());
        account_infos.extend(self.authority.to_account_infos());
        account_infos.extend(self.escrow.to_account_infos());
        account_infos.extend(self.function.to_account_infos());
        account_infos.extend(self.state.to_account_infos());
        account_infos.extend(self.attestation_queue.to_account_infos());
        account_infos.extend(self.payer.to_account_infos());
        account_infos.extend(self.token_program.to_account_infos());
        account_infos.extend(self.system_program.to_account_infos());
        account_infos
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let mut account_metas = Vec::new();
        account_metas.extend(self.request.to_account_metas(None));
        account_metas.extend(self.authority.to_account_metas(Some(true)));
        account_metas.extend(self.escrow.to_account_metas(None));
        account_metas.extend(self.function.to_account_metas(None));
        account_metas.extend(self.state.to_account_metas(None));
        account_metas.extend(self.attestation_queue.to_account_metas(None));
        account_metas.extend(self.payer.to_account_metas(Some(true)));
        account_metas.extend(self.token_program.to_account_metas(None));
        account_metas.extend(self.system_program.to_account_metas(None));
        account_metas
    }
}
