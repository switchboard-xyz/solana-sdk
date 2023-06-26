use crate::*;

#[derive(Accounts)]
#[instruction(params: SetEnclavesParams)] // rpc parameters hint
pub struct SetEnclaves<'info> {
    #[account(
        mut,
        seeds = [PROGRAM_SEED],
        bump = program.load()?.bump,
        has_one = authority
    )]
    pub program: AccountLoader<'info, MyProgramState>,
    pub authority: Signer<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct SetEnclavesParams {
    pub mr_enclaves: Option<Vec<[u8; 32]>>,
}

impl SetEnclaves<'_> {
    pub fn validate(
        &self,
        _ctx: &Context<Self>,
        params: &SetEnclavesParams,
    ) -> anchor_lang::Result<()> {
        if let Some(enclaves) = params.mr_enclaves.clone() {
            if enclaves.len() > 32 {
                return Err(error!(BasicOracleError::ArrayOverflow));
            }
        }

        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, params: &SetEnclavesParams) -> anchor_lang::Result<()> {
        let program = &mut ctx.accounts.program.load_mut()?;

        if let Some(enclaves) = params.mr_enclaves.clone() {
            if !enclaves.is_empty() {
                // program.mr_enclaves = parse_mr_enclaves(&enclaves)?;
            }
        }

        Ok(())
    }
}
