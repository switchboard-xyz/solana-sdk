use solana_program::account_info::AccountInfo;
use solana_program::clock::Clock;

use crate::check_pubkey_eq;

/// Optimized function to parse the Clock sysvar from an AccountInfo.
///
/// This function extracts a `Clock` reference from any type that implements
/// `AsRef<AccountInfo>`, making it compatible with Anchor's `Sysvar<Clock>` wrapper.
///
/// # Arguments
/// * `clock_sysvar` - Any type that implements `AsRef<AccountInfo>` (e.g., `Sysvar<Clock>`, direct `AccountInfo` reference)
///
/// # Returns
/// A reference to the parsed `Clock` with the same lifetime as the input AccountInfo.
///
/// # Example with Anchor
/// ```rust,ignore
/// use anchor_lang::prelude::*;
/// use switchboard_on_demand::clock::parse_clock;
///
/// pub fn my_function(ctx: Context<MyCtx>) -> Result<()> {
///     let MyCtx { sysvars, .. } = ctx.accounts;
///     let clock = parse_clock(&sysvars.clock);  // Works with Sysvar<Clock>
///
///     // Use the parsed clock
///     msg!("Current slot: {}", clock.slot);
///     Ok(())
/// }
/// ```
///
/// # Safety
/// This function uses unsafe operations to directly cast the sysvar data to a `Clock`.
/// It is safe because it validates the account key against the Clock sysvar ID first.
#[inline(always)]
pub fn parse_clock<'a, T>(clock_sysvar: T) -> &'a Clock
where
    T: AsRef<AccountInfo<'a>>,
{
    assert!(check_pubkey_eq(
        clock_sysvar.as_ref().key,
        &solana_program::sysvar::clock::ID
    ));
    unsafe {
        let clock_data = *(&clock_sysvar.as_ref().data.as_ptr());
        &*(clock_data as *const _ as *const Clock)
    }
}

crate::cfg_client! {
    use crate::OnDemandError;
    use futures::TryFutureExt;
    pub async fn fetch_async(
        client: &solana_client::nonblocking::rpc_client::RpcClient,
    ) -> std::result::Result<Clock, crate::OnDemandError> {
        let pubkey = solana_sdk::sysvar::clock::id();
        let data = client
            .get_account_data(&pubkey)
            .map_err(|_| OnDemandError::AccountNotFound)
            .await?
            .to_vec();
        bincode::deserialize(&data).map_err(|_| OnDemandError::AccountNotFound)
    }
}
