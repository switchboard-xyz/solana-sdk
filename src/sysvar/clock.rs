use solana_program::account_info::AccountInfo;

use crate::check_pubkey_eq;

/// Optimized function to extract the slot value from a Clock sysvar.
///
/// This function extracts just the slot value from any type that implements
/// `AsRef<AccountInfo>`, making it compatible with Anchor's `Sysvar<Clock>` wrapper.
/// This is more efficient than parsing the entire Clock struct when you only need the slot.
///
/// # Arguments
/// * `clock_sysvar` - Any type that implements `AsRef<AccountInfo>` (e.g., `Sysvar<Clock>`, direct `AccountInfo` reference)
///
/// # Returns
/// The current slot value as a `u64`.
///
/// # Example with Anchor
/// ```rust,ignore
/// use anchor_lang::prelude::*;
/// use switchboard_on_demand::clock::get_slot;
///
/// pub fn my_function(ctx: Context<MyCtx>) -> Result<()> {
///     let MyCtx { sysvars, .. } = ctx.accounts;
///     let clock_slot = get_slot(&sysvars.clock);  // Works with Sysvar<Clock>
///
///     // Use the slot value
///     msg!("Current slot: {}", clock_slot);
///     Ok(())
/// }
/// ```
///
/// # Safety
/// This function uses unsafe operations to directly read from the sysvar data.
/// It is safe because it validates the account key against the Clock sysvar ID first
/// and uses unaligned reads to safely extract the slot value.
#[inline(always)]
pub fn get_slot<'a, T>(clock_sysvar: T) -> u64
where
    T: AsRef<AccountInfo<'a>>,
{
    assert!(check_pubkey_eq(
        clock_sysvar.as_ref().key,
        &solana_program::sysvar::clock::ID
    ));
    unsafe {
        let clock_data = &*clock_sysvar.as_ref().data.as_ptr();
        core::ptr::read_unaligned(clock_data.as_ptr() as *const u64)
    }
}

crate::cfg_client! {
    use crate::OnDemandError;
    use futures::TryFutureExt;
    pub async fn fetch_async(
        client: &solana_client::nonblocking::rpc_client::RpcClient,
    ) -> std::result::Result<solana_sdk::sysvar::clock::Clock, crate::OnDemandError> {
        let pubkey = solana_sdk::sysvar::clock::id();
        let data = client
            .get_account_data(&pubkey)
            .map_err(|_| OnDemandError::AccountNotFound)
            .await?
            .to_vec();
        bincode::deserialize(&data).map_err(|_| OnDemandError::AccountNotFound)
    }
}
