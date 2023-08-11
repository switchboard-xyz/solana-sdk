#![allow(clippy::result_large_err)]
pub use switchboard_solana::prelude::*;

declare_id!("3uMC4KCYHsY1WopPoGpTWqZdqoNxm6f8EVA4XLZpKYzw");

pub mod error;
pub use error::*;

pub mod actions;
pub use actions::*;

pub const MAX_SLOTS_PER_ROUND: u32 = u32::MAX / 2; // demo purposes

/**
 * RAFFLE PROGRAM
 *
 * # ACCOUNTS
 * - Raffle: Authority controlled raffle with revolving rounds until a winner is selected and claims the rewards
 * - Ticket: PDA of raffle, authority, and guess. Updates vec with entries for easy indexing/checking guesses off-chain
 *
 * # INSTRUCTIONS
 * - Raffle Init: Create the raffle account, function account, request account, and setup the jackpot escrow. Then initiate
 *   the starting round and trigger the request account
 * - User Guess: User submits a guess and pays the raffle entry fee
 * - Raffle Draw: SGX Function invokes this instruction to close the round and attempt to select a winner. If the winner account
 *   doesnt exist then the next round starts. Tickets roll-over to the next round.
 * - Raffle Claim: User withdraws funds from the Pot they won.
 * - User Guess Close: After a raffle has been settled, users can close their account and re-claim their rent.
 *
 * # THOUGHTS
 * - It would be cool to support some kind of NFT giveaway. We can make the pot PDA controlled and transfer the authority to winner
 * - Each raffle should be flexible and easy to integrate with a re-usable function.
 * - Requiring users to create accounts and close seems ugly. Instead we should have the entries stored in the raffle account and
 *   let the raffle authority worry about recouping rent costs.
 */

#[zero_copy(unsafe)]
pub struct RaffleRound {
    pub id: u64,
    pub request: Pubkey,
    pub is_closed: bool,
    pub open_slot: u64,
    pub open_timestamp: i64,
    pub close_slot: u64,
}

#[account(zero_copy(unsafe))]
pub struct RaffleAccount {
    pub bump: u8,
    pub difficulty: u8, // 0 = easy (100% winner), 255 = hard (~1% winner)
    pub creation_slot: u64,

    pub authority: Pubkey,
    pub function: Pubkey,
    pub request: Pubkey,
    pub mint: Pubkey,
    pub escrow: Pubkey,

    /// The number of slots each round is open for
    pub slots_per_round: u32,
    /// The maximum number of entries until a winner is
    pub max_entries: u32,
    pub num_entries: u32,
    pub max_rounds: u32,
    pub round_num: u32,
    pub current_round: RaffleRound,
    pub previous_round: RaffleRound,
}

#[program]
pub mod raffle_program {
    use super::*;

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn initialize(ctx: Context<Initialize>, params: InitializeParams) -> Result<()> {
        Initialize::actuate(&ctx, &params)
    }

    #[access_control(ctx.accounts.validate(&ctx))]
    pub fn start_round(ctx: Context<StartRound>) -> Result<()> {
        StartRound::actuate(&ctx)
    }

    // This is the instruction our function will call after a small delay
    #[access_control(ctx.accounts.validate(&ctx))]
    pub fn close_round(ctx: Context<CloseRound>) -> Result<()> {
        CloseRound::actuate(&ctx)
    }
}
