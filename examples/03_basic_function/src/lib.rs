pub mod actions;
pub use actions::*;

pub use anchor_lang::prelude::*;

pub use switchboard_solana::SWITCHBOARD_PROGRAM_ID;

declare_id!("5vaBW3RsJJ69b42iWXhUMiyRoTYVVoBcZTfaWNbGYi8q");

#[program]
pub mod switchboard_basic_function {
    use super::*;

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn save_value(ctx: Context<SaveValue>, params: SaveValueParams) -> Result<()> {
        SaveValue::actuate(&ctx, &params)
    }
}

#[error_code]
#[derive(Eq, PartialEq)]
pub enum SwitchboardClientError {
    #[msg("Not a valid Switchboard account")]
    InvalidSwitchboardAccount,
}
