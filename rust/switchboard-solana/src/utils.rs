pub use crate::error::SwitchboardError;
pub use crate::prelude::*;

pub fn transfer<'a>(
    token_program: &AccountInfo<'a>,
    from: &Account<'a, TokenAccount>,
    to: &Account<'a, TokenAccount>,
    authority: &AccountInfo<'a>,
    auth_seed: &[&[&[u8]]],
    amount: u64,
) -> anchor_lang::Result<()> {
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
) -> anchor_lang::Result<()> {
    if amount == 0 {
        return Ok(());
    }

    if native_token_account.mint != anchor_spl::token::spl_token::native_mint::ID {
        return Err(error!(SwitchboardError::InvalidNativeMint));
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

pub fn find_associated_token_address(owner: &Pubkey, mint: &Pubkey) -> Pubkey {
    let (akey, _bump) = Pubkey::find_program_address(
        &[
            owner.as_ref(),
            anchor_spl::token::ID.as_ref(),
            mint.as_ref(),
        ],
        &anchor_spl::associated_token::ID,
    );
    akey
}

pub fn get_ixn_discriminator(ixn_name: &str) -> [u8; 8] {
    let preimage = format!("global:{}", ixn_name);
    let mut sighash = [0u8; 8];
    sighash.copy_from_slice(
        &anchor_lang::solana_program::hash::hash(preimage.as_bytes()).to_bytes()[..8],
    );
    sighash
}

pub fn build_ix<A: ToAccountMetas, I: InstructionData + Discriminator>(
    program_id: &Pubkey,
    accounts: &A,
    params: &I,
) -> Instruction {
    Instruction {
        program_id: *program_id,
        accounts: accounts.to_account_metas(None),
        data: params.data(),
    }
}
