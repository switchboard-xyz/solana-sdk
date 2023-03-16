#![allow(non_snake_case)]
use crate::*;
use anchor_lang::Discriminator;
use anchor_spl::token::TokenAccount;
use solana_program::entrypoint::ProgramResult;
use solana_program::instruction::Instruction;
use solana_program::program::{invoke, invoke_signed};
use std::cell::Ref;

// VrfLiteRequestRandomnessParams
// VrfLiteCloseParams

#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct VrfLiteAccountData {
    /// The bump used to derive the SbState account.
    pub state_bump: u8,
    /// The bump used to derive the permission account.
    pub permission_bump: u8,
    /// The VrfPool the account belongs to.
    pub vrf_pool: Pubkey,
    /// The current status of the VRF account.
    pub status: VrfStatus,
    /// The VRF round result. Will be zeroized if still awaiting fulfillment.
    pub result: [u8; 32],
    /// Incremental counter for tracking VRF rounds.
    pub counter: u128,
    /// The alpha bytes used to calculate the VRF proof.
    // TODO: can this be smaller?
    pub alpha: [u8; 256],
    /// The number of bytes in the alpha buffer.
    pub alpha_len: u32,
    /// The Slot when the VRF round was opened.
    pub request_slot: u64,
    /// The unix timestamp when the VRF round was opened.
    pub request_timestamp: i64,
    /// On-chain account delegated for making account changes.
    pub authority: Pubkey,
    /// The OracleQueueAccountData that is assigned to fulfill VRF update request.
    pub queue: Pubkey,
    /// The token account used to hold funds for VRF update request.
    pub escrow: Pubkey,
    /// The callback that is invoked when an update request is successfully verified.
    pub callback: CallbackZC,
    /// The incremental VRF proof calculation.
    pub builder: VrfBuilder,
    // unused currently. may want permission PDA per permission for
    // unique expiration periods, BUT currently only one permission
    // per account makes sense for the infra. Dont over engineer.
    // TODO: should this be epoch or slot ??
    pub expiration: i64,
    // TODO: Add _ebuf ??
}

impl Default for VrfLiteAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

impl VrfLiteAccountData {
    /// Returns the deserialized Switchboard VRF Lite account
    ///
    /// # Arguments
    ///
    /// * `switchboard_vrf` - A Solana AccountInfo referencing an existing Switchboard VRF Lite account
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfLiteAccountData;
    ///
    /// let vrf_lite = VrfLiteAccountData::new(vrf_account_info)?;
    /// ```
    pub fn new<'info>(
        vrf_lite_account_info: &'info AccountInfo,
    ) -> anchor_lang::Result<Ref<'info, VrfLiteAccountData>> {
        let data = vrf_lite_account_info.try_borrow_data()?;
        if data.len() < VrfLiteAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfLiteAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<VrfLiteAccountData>() + 8])
        }))
    }

    /// Returns the deserialized Switchboard VRF Lite account
    ///
    /// # Arguments
    ///
    /// * `data` - A Solana AccountInfo's data buffer
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfLiteAccountData;
    ///
    /// let vrf_lite = VrfLiteAccountData::new(vrf_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&VrfLiteAccountData> {
        if data.len() < VrfLiteAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfLiteAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<VrfLiteAccountData>() + 8],
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
    /// use switchboard_v2::VrfLiteAccountData;
    ///
    /// ```
    pub fn get_result(&self) -> anchor_lang::Result<[u8; 32]> {
        if self.result == [0u8; 32] {
            return Err(error!(SwitchboardError::VrfEmptyError));
        }
        Ok(self.result)
    }
}

#[derive(Accounts)]
#[instruction(params: VrfLiteRequestRandomnessParams)] // rpc parameters hint
pub struct VrfLiteRequestRandomness<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf_lite: AccountInfo<'info>,
    #[account(mut)]
    pub queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub data_buffer: AccountInfo<'info>,
    // #[account(
    //     mut,
    //     seeds = [
    //         b"PermissionAccountData",
    //         queue_authority.key().as_ref(),
    //         queue.key().as_ref(),
    //         vrf_lite.key().as_ref()
    //     ],
    //     bump = vrf_lite.load()?.permission_bump
    // )]
    /// CHECK:
    pub permission: AccountInfo<'info>,
    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    pub recent_blockhashes: AccountInfo<'info>,
    // #[account(seeds = [b"STATE"], bump = params.state_bump)]
    /// CHECK:
    pub program_state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfLiteRequestRandomnessParams {
    pub callback: Option<Callback>,
}

impl Discriminator for VrfLiteRequestRandomness<'_> {
    const DISCRIMINATOR: [u8; 8] = [221, 11, 167, 47, 80, 107, 18, 71];
}

impl<'info> VrfLiteRequestRandomness<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        callback: Option<Callback>,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfLiteRequestRandomness::discriminator().try_to_vec()?;
        let params = VrfLiteRequestRandomnessParams { callback };
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>, callback: Option<Callback>) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone(), callback)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        callback: Option<Callback>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone(), callback)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        return vec![
            self.authority.clone(),
            self.vrf_lite.clone(),
            self.queue.clone(),
            self.queue_authority.clone(),
            self.data_buffer.clone(),
            self.permission.clone(),
            self.escrow.to_account_info().clone(),
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
                pubkey: self.vrf_lite.key.clone(),
                is_signer: self.vrf_lite.is_signer,
                is_writable: self.vrf_lite.is_writable,
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

// VRF CLOSE

#[derive(Accounts)]
#[instruction(params: VrfLiteCloseParams)] // rpc parameters hint
pub struct VrfLiteClose<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf_lite: AccountInfo<'info>,
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

    pub recent_blockhashes: AccountInfo<'info>,
    // #[account(seeds = [b"STATE"], bump = params.state_bump)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfLiteCloseParams {}

impl Discriminator for VrfLiteClose<'_> {
    const DISCRIMINATOR: [u8; 8] = [200, 82, 160, 32, 59, 80, 50, 137];
}

impl<'info> VrfLiteClose<'info> {
    pub fn get_instruction(&self, program_id: Pubkey) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = VrfLiteClose::discriminator().try_to_vec()?;
        let params = VrfLiteCloseParams {};
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(&self, program: AccountInfo<'info>) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone())?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone())?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        return vec![
            self.authority.clone(),
            self.vrf_lite.clone(),
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
                pubkey: self.vrf_lite.key.clone(),
                is_signer: self.vrf_lite.is_signer,
                is_writable: self.vrf_lite.is_writable,
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
