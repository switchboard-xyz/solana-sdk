pub use switchboard_solana::prelude::*;

pub mod utils;
pub use utils::*;

pub mod error;
pub use error::*;

pub use switchboard_solana::prelude::anchor_lang;
pub use switchboard_solana::prelude::anchor_spl;

pub use anchor_lang::*;

declare_id!("Csx5AU83fPiaSChJUBZg2cW9GcCVVwZ4rwFqDA2pomX2");

pub const PROGRAM_SEED: &[u8] = b"CUSTOMRANDOMNESS";

pub mod state;
pub use state::*;

pub const GUESS_COST: u64 = 100_000;

#[program]
pub mod custom_randomness_request {
    use super::*;

    pub fn house_init(ctx: Context<HouseInit>, max_guess: u8) -> Result<()> {
        let mut house = ctx.accounts.house.load_init()?;
        house.bump = *ctx.bumps.get("house").unwrap();
        house.authority = ctx.accounts.authority.key();
        house.function = ctx.accounts.function.key();
        house.token_wallet = ctx.accounts.house_token_wallet.key();
        house.max_guess = max_guess;

        Ok(())
    }

    pub fn house_set_function(ctx: Context<HouseSetFunction>) -> Result<()> {
        let mut house = ctx.accounts.house.load_mut()?;
        house.function = ctx.accounts.function.key();

        Ok(())
    }

    pub fn user_init(ctx: Context<UserInit>) -> Result<()> {
        let mut user = ctx.accounts.user.load_init()?;
        user.bump = *ctx.bumps.get("user").unwrap();
        user.authority = ctx.accounts.payer.key();
        user.token_wallet = ctx.accounts.user_token_wallet.key();

        Ok(())
    }

    pub fn user_guess(ctx: Context<UserGuess>, guess: u8, wager: u64) -> Result<()> {
        if ctx.accounts.house_token_wallet.amount < GUESS_COST {
            return Err(error!(RandomnessRequestError::HouseInsufficientFunds));
        }

        if ctx.accounts.user_token_wallet.amount < GUESS_COST {
            wrap_native(
                &ctx.accounts.system_program,
                &ctx.accounts.token_program,
                &ctx.accounts.user_token_wallet,
                &ctx.accounts.payer,
                &[&[
                    PROGRAM_SEED,
                    ctx.accounts.user.load()?.authority.key().as_ref(),
                    &[ctx.accounts.user.load()?.bump],
                ]],
                GUESS_COST
                    .checked_sub(ctx.accounts.user_token_wallet.amount)
                    .unwrap(),
            )?;
        }

        ctx.accounts.user_token_wallet.reload()?;

        assert!(
            ctx.accounts.user_token_wallet.amount >= GUESS_COST,
            "User escrow is missing funds"
        );

        let request_params = format!(
            "PID={},MAX_GUESS={},USER={}",
            crate::id(),
            ctx.accounts.house.load()?.max_guess,
            ctx.accounts.user.key()
        );

        let request_init_ctx = FunctionRequestInitAndTrigger {
            request: ctx.accounts.request.clone(),
            function: ctx.accounts.function.clone(),
            escrow: ctx.accounts.request_escrow.clone(),
            mint: ctx.accounts.mint.clone(),
            state: ctx.accounts.state.clone(),
            attestation_queue: ctx.accounts.attestation_queue.clone(),
            payer: ctx.accounts.payer.clone(),
            system_program: ctx.accounts.system_program.clone(),
            token_program: ctx.accounts.token_program.clone(),
            associated_token_program: ctx.accounts.associated_token_program.clone(),
        };
        request_init_ctx.invoke(
            ctx.accounts.switchboard.clone(),
            None,
            Some(1000),
            Some(512),
            Some(request_params.into_bytes()),
            None,
        )?;

        let mut user = ctx.accounts.user.load_mut()?;
        user.last_round = user.current_round;
        user.current_round = UserRound {
            guess,
            wager,
            request: ctx.accounts.request.key(),
            status: RoundStatus::Pending,
            result: 0,
            slot: Clock::get()?.slot,
            timestamp: Clock::get()?.unix_timestamp,
        };

        Ok(())
    }

    pub fn user_settle(ctx: Context<UserSettle>, result: u8) -> Result<()> {
        // verify we havent responded already
        if ctx.accounts.user.load()?.current_round.status != RoundStatus::Pending {
            return Err(error!(RandomnessRequestError::RoundInactive));
        }

        if ctx.accounts.request.active_request.status != RequestStatus::RequestSuccess {
            return Err(error!(
                RandomnessRequestError::SwitchboardRequestNotSuccessful
            ));
        }

        let mut user = ctx.accounts.user.load_mut()?;
        user.current_round.result = result;
        user.current_round.status = RoundStatus::Settled;

        // TODO: payout

        Ok(())
    }
}

#[derive(Accounts)]
pub struct HouseInit<'info> {
    // PROGRAM ACCOUNTS
    #[account(
        init,
        space = 8 + std::mem::size_of::<HouseState>(),
        payer = payer,
        seeds = [PROGRAM_SEED],
        bump
    )]
    pub house: AccountLoader<'info, HouseState>,

    /// CHECK: make sure this matches function
    pub authority: AccountInfo<'info>,

    // SWITCHBOARD ACCOUNTS
    #[account(
      has_one = escrow_wallet,
      // TODO: verify authority
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,
    #[account(has_one = token_wallet, has_one = mint)]
    pub escrow_wallet: Box<Account<'info, SwitchboardWallet>>,
    #[account(constraint = token_wallet.mint == mint.key())]
    pub token_wallet: Box<Account<'info, TokenAccount>>,

    // TOKEN ACCOUNTS
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,
    #[account(
      init,
      payer = payer,
      associated_token::mint = mint,
      associated_token::authority = house,
  )]
    pub house_token_wallet: Box<Account<'info, TokenAccount>>,

    // SYSTEM ACCOUNTS
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct HouseSetFunction<'info> {
    // PROGRAM ACCOUNTS
    #[account(
        mut,
        seeds = [PROGRAM_SEED],
        bump = house.load()?.bump,
        has_one = authority,
    )]
    pub house: AccountLoader<'info, HouseState>,

    /// CHECK:
    pub authority: Signer<'info>,

    // SWITCHBOARD ACCOUNTS
    pub function: AccountLoader<'info, FunctionAccountData>,
}

#[derive(Accounts)]
pub struct UserInit<'info> {
    // PROGRAM ACCOUNTS
    #[account(
      seeds = [PROGRAM_SEED],
      bump = house.load()?.bump,
      constraint = house.load()?.token_wallet == house_token_wallet.key(),
    )]
    pub house: AccountLoader<'info, HouseState>,

    #[account(
        init,
        space = 8 + std::mem::size_of::<UserState>(),
        payer = payer,
        seeds = [PROGRAM_SEED, payer.key().as_ref()],
        bump
    )]
    pub user: AccountLoader<'info, UserState>,

    // TOKEN ACCOUNTS
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,
    #[account(
      associated_token::mint = mint,
      associated_token::authority = house,
    )]
    pub house_token_wallet: Box<Account<'info, TokenAccount>>,
    #[account(
      init,
      payer = payer,
      associated_token::mint = mint,
      associated_token::authority = user,
    )]
    pub user_token_wallet: Box<Account<'info, TokenAccount>>,

    // SYSTEM ACCOUNTS
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct UserGuess<'info> {
    // PROGRAM ACCOUNTS
    #[account(
      seeds = [PROGRAM_SEED],
      bump = house.load()?.bump,
      has_one = function,
      constraint = house.load()?.token_wallet == house_token_wallet.key(),
    )]
    pub house: AccountLoader<'info, HouseState>,

    #[account(
        mut,
        seeds = [PROGRAM_SEED, payer.key().as_ref()], // user should be paying for this each time
        bump = user.load()?.bump,
        constraint = user.load()?.authority == payer.key() && user.load()?.token_wallet == user_token_wallet.key(),
    )]
    pub user: AccountLoader<'info, UserState>,

    // SWITCHBOARD ACCOUNTS
    /// CHECK:
    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    pub switchboard: AccountInfo<'info>,
    #[account(
      seeds = [STATE_SEED],
      seeds::program = switchboard.key(),
      bump = state.load()?.bump,
    )]
    pub state: AccountLoader<'info, AttestationProgramState>,
    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    #[account(
      mut,
      has_one = attestation_queue,
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,
    /// CHECK:
    #[account(
      mut,
      signer,
      owner = system_program.key(),
      constraint = request.data_len() == 0 && request.lamports() == 0
    )]
    pub request: AccountInfo<'info>,
    /// CHECK:
    #[account(
      mut,
      owner = system_program.key(),
      constraint = request.data_len() == 0 && request.lamports() == 0
    )]
    pub request_escrow: AccountInfo<'info>,

    // TOKEN ACCOUNTS
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,
    pub house_token_wallet: Box<Account<'info, TokenAccount>>,
    #[account(mut)] // we might wrap funds to this wallet
    pub user_token_wallet: Box<Account<'info, TokenAccount>>,

    // SYSTEM ACCOUNTS
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct UserSettle<'info> {
    // CLIENT ACCOUNTS
    #[account(
      seeds = [PROGRAM_SEED],
      bump = house.load()?.bump,
      has_one = function,
    )]
    pub house: AccountLoader<'info, HouseState>,

    #[account(
        mut,
        seeds = [PROGRAM_SEED, user.load()?.authority.as_ref()],
        bump = user.load()?.bump,
        constraint = user.load()?.token_wallet == user_token_wallet.key(),
    )]
    pub user: AccountLoader<'info, UserState>,

    // SWITCHBOARD ACCOUNTS
    pub function: AccountLoader<'info, FunctionAccountData>,
    #[account(
      constraint = request.validate_signer(
          &function.to_account_info(),
          &enclave_signer.to_account_info()
        )? @ RandomnessRequestError::FunctionValidationFailed,
    )]
    pub request: Box<Account<'info, FunctionRequestAccountData>>,
    pub enclave_signer: Signer<'info>,

    // TOKEN ACCOUNTS
    pub token_program: Program<'info, Token>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub house_token_wallet: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_token_wallet: Box<Account<'info, TokenAccount>>,
}
