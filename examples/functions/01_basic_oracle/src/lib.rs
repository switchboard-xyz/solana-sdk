pub use switchboard_solana::prelude::*;

pub mod error;
pub use error::*;

pub mod model;
pub use model::*;

pub mod utils;
pub use utils::*;

pub mod actions;
pub use actions::*;

declare_id!("9PAxFbRDepv1ziPeUW5KHcpgpgPtxWV4ZzVwqDBqymok");

pub const PROGRAM_SEED: &[u8] = b"BASICORACLE";

pub const ORACLE_SEED: &[u8] = b"ORACLE_V1_SEED";

#[program]
pub mod basic_oracle {
    use super::*;

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn initialize(
        ctx: Context<Initialize>,
        params: InitializeParams,
    ) -> anchor_lang::Result<()> {
        Initialize::actuate(&ctx, &params)
    }

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn set_enclaves(
        ctx: Context<SetEnclaves>,
        params: SetEnclavesParams,
    ) -> anchor_lang::Result<()> {
        SetEnclaves::actuate(&ctx, &params)
    }

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn refresh_oracles(
        ctx: Context<RefreshPrices>,
        params: RefreshPricesParams,
    ) -> anchor_lang::Result<()> {
        RefreshPrices::actuate(&ctx, &params)
    }
}
