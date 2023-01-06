use crate::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
use anchor_lang::{Discriminator};

#[derive(Accounts)]
#[instruction(params: UpdateResultParams)] // rpc parameters hint
pub struct UpdateResult<'info> {
    #[account(mut, 
        has_one = vrf @ VrfErrorCode::InvalidVrfAccount
    )]
    pub state: AccountLoader<'info, VrfClient>,
    #[account(
        constraint = 
            *vrf.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ VrfErrorCode::InvalidSwitchboardAccount
    )]
    pub vrf: AccountLoader<'info, VrfAccountData>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct UpdateResultParams {}

impl Discriminator for UpdateResult<'_> {
    const DISCRIMINATOR: [u8; 8] = [145, 72, 9, 94, 61, 97, 126, 106];
}

impl UpdateResult<'_> {
    pub fn try_to_vec(params: &UpdateResultParams) -> Result<Vec<u8>> {
        let ix_data = params.try_to_vec()?;
        let data: Vec<u8> = UpdateResult::discriminator().into_iter().chain(ix_data.into_iter()).collect();
        assert_eq!(data.len(), 8 + std::mem::size_of::<UpdateResultParams>());
        Ok(data)
    }

    pub fn to_callback(
        client_state: &AccountInfo,
        vrf: &Pubkey,
        params: &UpdateResultParams,
    ) -> Result<Callback> {
        let program_id = client_state.owner.clone();
        let accounts: Vec<switchboard_v2::AccountMetaBorsh> = vec![
            switchboard_v2::AccountMetaBorsh {
                pubkey: client_state.key.clone(),
                is_signer: false,
                is_writable: true,
            },
            switchboard_v2::AccountMetaBorsh {
                pubkey: vrf.clone(),
                is_signer: false,
                is_writable: false,
            },
        ];
        let ix_data = UpdateResult::try_to_vec(params)?;
        let callback = Callback {
            program_id,
            accounts,
            ix_data
        };
        Ok(callback)
    }

    pub fn validate(&self, _ctx: &Context<Self>, _params: &UpdateResultParams) -> Result<()> {
        // We should check VRF account passed is equal to the pubkey stored in our client state
        // But skipping so we can re-use this program instruction for CI testing
        Ok(())
    }

    pub fn actuate(ctx: &Context<Self>, _params: &UpdateResultParams) -> Result<()> {
        let clock = clock::Clock::get().unwrap();

        emit!(VrfClientInvoked {
            vrf_client: ctx.accounts.state.key(),
            timestamp: clock.unix_timestamp,
        });

        let vrf = ctx.accounts.vrf.load()?;
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
