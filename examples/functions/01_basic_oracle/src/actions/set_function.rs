use crate::*;

#[derive(Accounts)]
#[instruction(params: SetFunctionParams)] // rpc parameters hint
pub struct SetFunction<'info> {
    #[account(
        mut,
        // seeds = [PROGRAM_SEED],
        // bump = program.load()?.bump,
        has_one = authority
    )]
    pub program: AccountLoader<'info, MyProgramState>,

    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    pub switchboard_routine: Box<Account<'info, FunctionRoutineAccountData>>,

    pub authority: Signer<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct SetFunctionParams {}

impl SetFunction<'_> {
    pub fn validate(
        &self,
        _ctx: &Context<Self>,
        _params: &SetFunctionParams,
    ) -> anchor_lang::Result<()> {
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, _params: &SetFunctionParams) -> anchor_lang::Result<()> {
        let program = &mut ctx.accounts.program.load_mut()?;
        program.switchboard_function = ctx.accounts.switchboard_function.key();
        program.switchboard_routine = ctx.accounts.switchboard_routine.key();
        Ok(())
    }
}
