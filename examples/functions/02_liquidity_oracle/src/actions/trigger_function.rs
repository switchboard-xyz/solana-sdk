use crate::*;
use switchboard_solana::attestation_program::instructions::function_trigger::FunctionTrigger;
use switchboard_solana::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

#[derive(Accounts)]
#[instruction(params: TriggerFunctionParams)] // rpc parameters hint
pub struct TriggerFunction<'info> {
    #[account(
        has_one = authority,
        has_one = attestation_queue,
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,

    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,

    pub authority: Signer<'info>,

    /// CHECK: address is explicit
    #[account(address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    pub attestation_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct TriggerFunctionParams { }

impl TriggerFunction<'_> {
    pub fn validate(
        &self,
        _ctx: &Context<Self>,
        _params: &TriggerFunctionParams,
    ) -> anchor_lang::Result<()> {
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, _params: &TriggerFunctionParams) -> anchor_lang::Result<()> {
        FunctionTrigger {
            function: ctx.accounts.function.clone(),
            authority: ctx.accounts.authority.clone(),
            attestation_queue: ctx.accounts.attestation_queue.clone(),
        }.invoke(ctx.accounts.attestation_program.clone())?;
        Ok(())
    }
}