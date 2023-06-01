#![allow(non_snake_case)]
use super::error::SwitchboardError;
use crate::*;
use anchor_lang::Discriminator;
use anchor_spl::token::TokenAccount;
use solana_program::entrypoint::ProgramResult;
use solana_program::instruction::Instruction;
use solana_program::program::{invoke, invoke_signed};
use std::cell::Ref;

// VrfRequestRandomness
// VrfSetCallback
// VrfClose

#[account(zero_copy)]
#[repr(packed)]
pub struct VrfAccountData {
    /// The current status of the VRF account.
    pub status: VrfStatus,
    /// Incremental counter for tracking VRF rounds.
    pub counter: u128,
    /// On-chain account delegated for making account changes.
    pub authority: Pubkey,
    /// The OracleQueueAccountData that is assigned to fulfill VRF update request.
    pub oracle_queue: Pubkey,
    /// The token account used to hold funds for VRF update request.
    pub escrow: Pubkey,
    /// The callback that is invoked when an update request is successfully verified.
    pub callback: CallbackZC,
    /// The number of oracles assigned to a VRF update request.
    pub batch_size: u32,
    /// Struct containing the intermediate state between VRF crank actions.
    pub builders: [VrfBuilder; 8],
    /// The number of builders.
    pub builders_len: u32,
    pub test_mode: bool,
    /// Oracle results from the current round of update request that has not been accepted as valid yet
    pub current_round: VrfRound,
    /// Reserved for future info.
    pub _ebuf: [u8; 1024],
}
impl Default for VrfAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

impl VrfAccountData {
    /// Returns the deserialized Switchboard VRF account
    ///
    /// # Arguments
    ///
    /// * `switchboard_vrf` - A Solana AccountInfo referencing an existing Switchboard VRF account
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfAccountData;
    ///
    /// let vrf = VrfAccountData::new(vrf_account_info)?;
    /// ```
    pub fn new<'info>(
        switchboard_vrf: &'info AccountInfo,
    ) -> anchor_lang::Result<Ref<'info, VrfAccountData>> {
        let data = switchboard_vrf.try_borrow_data()?;
        if data.len() < VrfAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<VrfAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard VRF account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfAccountData;
    ///
    /// let vrf = VrfAccountData::new(vrf_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&VrfAccountData> {
        if data.len() < VrfAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<VrfAccountData>() + 8],
        ))
    }

    /// Returns the current VRF round ID
    pub fn get_current_randomness_round_id(&self) -> u128 {
        self.counter
    }

    /// If sufficient oracle responses, returns the latest on-chain result in SwitchboardDecimal format
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfAccountData;
    ///
    /// ```
    pub fn get_result(&self) -> anchor_lang::Result<[u8; 32]> {
        if self.current_round.result == [0u8; 32] {
            return Err(error!(SwitchboardError::VrfEmptyError));
        }
        Ok(self.current_round.result)
    }
}

#[derive(Accounts)]
#[instruction(params: VrfRequestRandomnessParams)] // rpc parameters hint
pub struct VrfRequestRandomness<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf: AccountInfo<'info>,
    #[account(mut)]
    pub oracle_queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub data_buffer: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [
            b"PermissionAccountData",
            queue_authority.key().as_ref(),
            oracle_queue.key().as_ref(),
            vrf.key().as_ref()
        ],
        bump = params.permission_bump
    )]
    pub permission: AccountInfo<'info>,
    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, constraint = payer_wallet.owner == payer_authority.key())]
    pub payer_wallet: Account<'info, TokenAccount>,
    #[account(signer)]
    pub payer_authority: AccountInfo<'info>,
    pub recent_blockhashes: AccountInfo<'info>,
    #[account(seeds = [b"STATE"], bump = params.state_bump)]
    pub program_state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfRequestRandomnessParams {
    pub permission_bump: u8,
    pub state_bump: u8,
}

impl Discriminator for VrfRequestRandomness<'_> {
    const DISCRIMINATOR: [u8; 8] = [230, 121, 14, 164, 28, 222, 117, 118];
}

impl<'info> VrfRequestRandomness<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: VrfRequestRandomnessParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfRequestRandomness::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        state_bump: u8,
        permission_bump: u8,
    ) -> ProgramResult {
        let cpi_params = VrfRequestRandomnessParams {
            permission_bump: permission_bump,
            state_bump: state_bump,
        };
        let instruction = self.get_instruction(program.key.clone(), cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        state_bump: u8,
        permission_bump: u8,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = VrfRequestRandomnessParams {
            permission_bump: permission_bump,
            state_bump: state_bump,
        };
        let instruction = self.get_instruction(program.key.clone(), cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        return vec![
            self.authority.clone(),
            self.vrf.clone(),
            self.oracle_queue.clone(),
            self.queue_authority.clone(),
            self.data_buffer.clone(),
            self.permission.clone(),
            self.escrow.to_account_info().clone(),
            self.payer_wallet.to_account_info().clone(),
            self.payer_authority.clone(),
            self.recent_blockhashes.clone(),
            self.program_state.clone(),
            self.token_program.clone(),
        ];
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        return vec![
            AccountMeta {
                pubkey: self.authority.key.clone(),
                is_signer: true, // overwrite, authority has to sign
                is_writable: self.authority.is_writable,
            },
            AccountMeta {
                pubkey: self.vrf.key.clone(),
                is_signer: self.vrf.is_signer,
                is_writable: self.vrf.is_writable,
            },
            AccountMeta {
                pubkey: self.oracle_queue.key.clone(),
                is_signer: self.oracle_queue.is_signer,
                is_writable: self.oracle_queue.is_writable,
            },
            AccountMeta {
                pubkey: self.queue_authority.key.clone(),
                is_signer: self.queue_authority.is_signer,
                is_writable: self.queue_authority.is_writable,
            },
            AccountMeta {
                pubkey: self.data_buffer.key.clone(),
                is_signer: self.data_buffer.is_signer,
                is_writable: self.data_buffer.is_writable,
            },
            AccountMeta {
                pubkey: self.permission.key.clone(),
                is_signer: self.permission.is_signer,
                is_writable: self.permission.is_writable,
            },
            AccountMeta {
                pubkey: self.escrow.to_account_info().key.clone(),
                is_signer: self.escrow.to_account_info().is_signer,
                is_writable: self.escrow.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: self.payer_wallet.to_account_info().key.clone(),
                is_signer: self.payer_wallet.to_account_info().is_signer,
                is_writable: self.payer_wallet.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: self.payer_authority.key.clone(),
                is_signer: self.payer_authority.is_signer,
                is_writable: self.payer_authority.is_writable,
            },
            AccountMeta {
                pubkey: self.recent_blockhashes.key.clone(),
                is_signer: self.recent_blockhashes.is_signer,
                is_writable: self.recent_blockhashes.is_writable,
            },
            AccountMeta {
                pubkey: self.program_state.key.clone(),
                is_signer: self.program_state.is_signer,
                is_writable: self.program_state.is_writable,
            },
            AccountMeta {
                pubkey: self.token_program.key.clone(),
                is_signer: self.token_program.is_signer,
                is_writable: self.token_program.is_writable,
            },
        ];
    }
}

#[derive(Accounts)]
#[instruction(params: VrfSetCallbackParams)] // rpc parameters hint
pub struct VrfSetCallback<'info> {
    #[account(mut)]
    pub vrf: AccountInfo<'info>,
    pub authority: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfSetCallbackParams {
    pub callback: Callback,
}

impl Discriminator for VrfSetCallback<'_> {
    const DISCRIMINATOR: [u8; 8] = [121, 167, 168, 191, 180, 247, 251, 78];
}

impl<'info> VrfSetCallback<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: VrfSetCallbackParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfSetCallback::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, callback: Callback) -> ProgramResult {
        let cpi_params = VrfSetCallbackParams { callback: callback };
        let instruction = self.get_instruction(program.key.clone(), cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        callback: Callback,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = VrfSetCallbackParams { callback: callback };
        let instruction = self.get_instruction(program.key.clone(), cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        return vec![self.vrf.clone(), self.authority.clone()];
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        return vec![
            AccountMeta {
                pubkey: self.vrf.key.clone(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.authority.key.clone(),
                is_signer: true,
                is_writable: false,
            },
        ];
    }
}

// VRF CLOSE

#[derive(Accounts)]
#[instruction(params: VrfCloseParams)] // rpc parameters hint
pub struct VrfClose<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf: AccountInfo<'info>,
    /// CHECK:
    pub permission: AccountInfo<'info>,
    #[account(mut)]
    pub queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    /// CHECK:
    pub program_state: AccountInfo<'info>,

    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    /// CHECK:
    pub sol_dest: AccountInfo<'info>,
    #[account(mut, constraint = escrow.mint == escrow_dest.mint )]
    pub escrow_dest: Account<'info, TokenAccount>,

    // #[account(seeds = [b"STATE"], bump = params.state_bump)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfCloseParams {
    pub state_bump: u8,
    pub permission_bump: u8,
}

impl Discriminator for VrfClose<'_> {
    const DISCRIMINATOR: [u8; 8] = [97, 172, 124, 16, 175, 10, 246, 147];
}

impl<'info> VrfClose<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        state_bump: u8,
        permission_bump: u8,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfClose::discriminator().try_to_vec()?;
        let params = VrfCloseParams {
            state_bump,
            permission_bump,
        };
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        state_bump: u8,
        permission_bump: u8,
    ) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone(), state_bump, permission_bump)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        state_bump: u8,
        permission_bump: u8,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone(), state_bump, permission_bump)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        return vec![
            self.authority.clone(),
            self.vrf.clone(),
            self.permission.clone(),
            self.queue.clone(),
            self.queue_authority.clone(),
            self.program_state.clone(),
            self.escrow.to_account_info().clone(),
            self.sol_dest.clone(),
            self.escrow_dest.to_account_info().clone(),
            self.token_program.clone(),
        ];
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        return vec![
            AccountMeta {
                pubkey: self.authority.key.clone(),
                is_signer: true, // overwrite, authority has to sign
                is_writable: self.authority.is_writable,
            },
            AccountMeta {
                pubkey: self.vrf.key.clone(),
                is_signer: self.vrf.is_signer,
                is_writable: self.vrf.is_writable,
            },
            AccountMeta {
                pubkey: self.permission.key.clone(),
                is_signer: self.permission.is_signer,
                is_writable: self.permission.is_writable,
            },
            AccountMeta {
                pubkey: self.queue.key.clone(),
                is_signer: self.queue.is_signer,
                is_writable: self.queue.is_writable,
            },
            AccountMeta {
                pubkey: self.queue_authority.key.clone(),
                is_signer: self.queue_authority.is_signer,
                is_writable: self.queue_authority.is_writable,
            },
            AccountMeta {
                pubkey: self.program_state.key.clone(),
                is_signer: self.program_state.is_signer,
                is_writable: self.program_state.is_writable,
            },
            AccountMeta {
                pubkey: self.escrow.to_account_info().key.clone(),
                is_signer: self.escrow.to_account_info().is_signer,
                is_writable: self.escrow.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: self.sol_dest.key.clone(),
                is_signer: self.sol_dest.is_signer,
                is_writable: self.sol_dest.is_writable,
            },
            AccountMeta {
                pubkey: self.escrow_dest.to_account_info().key.clone(),
                is_signer: self.escrow_dest.to_account_info().is_signer,
                is_writable: self.escrow_dest.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: self.token_program.key.clone(),
                is_signer: self.token_program.is_signer,
                is_writable: self.token_program.is_writable,
            },
        ];
    }
}
