pub use crate::*;

use anchor_spl::token::TokenAccount;

pub fn transfer<'a>(
    token_program: &AccountInfo<'a>,
    from: &Account<'a, TokenAccount>,
    to: &Account<'a, TokenAccount>,
    authority: &AccountInfo<'a>,
    auth_seed: &[&[&[u8]]],
    amount: u64,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    let cpi_program = token_program.clone();
    let cpi_accounts = anchor_spl::token::Transfer {
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: authority.clone(),
    };
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, auth_seed);
    anchor_spl::token::transfer(cpi_ctx, amount)?;
    Ok(())
}

pub fn wrap_native<'a>(
    system_program: &AccountInfo<'a>,
    token_program: &AccountInfo<'a>,
    native_token_account: &Account<'a, TokenAccount>,
    payer: &AccountInfo<'a>,
    auth_seed: &[&[&[u8]]],
    amount: u64,
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }

    if native_token_account.mint != anchor_spl::token::spl_token::native_mint::ID {
        return Err(error!(RandomnessRequestError::InvalidEscrow));
    }

    // first transfer the SOL to the token account
    let transfer_accounts = anchor_lang::system_program::Transfer {
        from: payer.to_account_info(),
        to: native_token_account.to_account_info(),
    };
    let transfer_ctx = CpiContext::new(system_program.clone(), transfer_accounts);
    anchor_lang::system_program::transfer(transfer_ctx, amount)?;

    // then call sync native which
    let sync_accounts = anchor_spl::token::SyncNative {
        account: native_token_account.to_account_info(),
    };
    let sync_ctx = CpiContext::new_with_signer(token_program.clone(), sync_accounts, auth_seed);
    anchor_spl::token::sync_native(sync_ctx)?;

    Ok(())
}
