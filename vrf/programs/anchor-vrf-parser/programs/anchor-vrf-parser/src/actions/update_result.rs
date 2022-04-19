use crate::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
pub use switchboard_v2::VrfAccountData;

#[derive(Accounts)]
pub struct UpdateResult<'info> {
    #[account(mut)]
    pub state: AccountLoader<'info, VrfClient>,
    /// CHECK:
    pub vrf: AccountInfo<'info>,
}

impl UpdateResult<'_> {
    pub fn validate(&self, _ctx: &Context<Self>) -> Result<()> {
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>) -> Result<()> {
        let clock = clock::Clock::get().unwrap();

        emit!(VrfClientInvoked {
            vrf_client: ctx.accounts.state.key(),
            timestamp: clock.unix_timestamp,
        });

        let vrf_account_info = &ctx.accounts.vrf;
        let vrf = VrfAccountData::new(vrf_account_info)?;
        let result_buffer = vrf.get_result()?;
        if result_buffer == [0u8; 32] {
            msg!("vrf buffer empty");
            return Ok(());
        }

        let state = &mut ctx.accounts.state.load_mut()?;
        let max_result = state.max_result;
        if result_buffer == state.result_buffer {
            msg!("existing result_buffer");
            return Ok(());
        }

        msg!("Result buffer is {:?}", result_buffer);
        let value: &[u128] = bytemuck::cast_slice(&result_buffer[..]);
        msg!("u128 buffer {:?}", value);
        let result = value[0] % max_result as u128 + 1;
        msg!("Current VRF Value [1 - {}) = {}!", max_result, result);

        if state.result != result {
            state.result_buffer = result_buffer;
            state.result = result;
            state.last_timestamp = clock.unix_timestamp;

            emit!(VrfClientResultUpdated {
                vrf_client: ctx.accounts.state.key(),
                result: state.result,
                result_buffer: result_buffer,
                timestamp: clock.unix_timestamp,
            });
        }

        Ok(())
    }
}
