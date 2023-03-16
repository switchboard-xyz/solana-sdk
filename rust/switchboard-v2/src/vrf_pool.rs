#![allow(non_snake_case)]
use crate::*;
use anchor_lang::Discriminator;
use anchor_spl::token::{Mint, TokenAccount};
use solana_program::entrypoint::ProgramResult;
use solana_program::instruction::Instruction;
use solana_program::program::{invoke, invoke_signed};
use std::cell::Ref;

// VrfPoolRequestRandomness
// VrfPoolRemove
// TODO: VrfPoolAdd (Can be done off-chain)

#[derive(Default, Debug, Copy, Clone, AnchorDeserialize, AnchorSerialize)]
pub struct VrfPoolRow {
    pub timestamp: i64,
    pub pubkey: Pubkey,
}

#[repr(packed)]
#[account(zero_copy(unsafe))]
pub struct VrfPoolAccountData {
    /// ACCOUNTS
    pub authority: Pubkey, // authority can never be changed or else vrf accounts are useless
    pub queue: Pubkey,
    pub escrow: Pubkey, // escrow used to fund requests to reduce management

    // CONFIG
    pub min_interval: u32,
    pub max_rows: u32,

    // ITER
    pub size: u32,
    pub idx: u32,
    // Needs to be 4byte aligned up until here
    pub state_bump: u8,
    pub _ebuf: [u8; 135], // 256 bytes for pool config
}
//

impl VrfPoolAccountData {
    /// Returns the deserialized Switchboard VRF Lite account
    ///
    /// # Arguments
    ///
    /// * `switchboard_vrf` - A Solana AccountInfo referencing an existing Switchboard VRF Lite account
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_v2::VrfPoolAccountData;
    ///
    /// let vrf = VrfPoolAccountData::new(vrf_pool_account_info)?;
    /// ```
    pub fn new<'info>(
        vrf_pool_account_info: &'info AccountInfo,
    ) -> anchor_lang::Result<Ref<'info, VrfPoolAccountData>> {
        let data = vrf_pool_account_info.try_borrow_data()?;
        if data.len() < VrfPoolAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfPoolAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(Ref::map(data, |data| {
            bytemuck::from_bytes(&data[8..std::mem::size_of::<VrfPoolAccountData>() + 8])
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
    /// use switchboard_v2::VrfPoolAccountData;
    ///
    /// let vrf = VrfPoolAccountData::new(vrf_pool_account_info.try_borrow_data()?)?;
    /// ```
    pub fn new_from_bytes(data: &[u8]) -> anchor_lang::Result<&VrfPoolAccountData> {
        if data.len() < VrfPoolAccountData::discriminator().len() {
            return Err(ErrorCode::AccountDiscriminatorNotFound.into());
        }

        let mut disc_bytes = [0u8; 8];
        disc_bytes.copy_from_slice(&data[..8]);
        if disc_bytes != VrfPoolAccountData::discriminator() {
            return Err(ErrorCode::AccountDiscriminatorMismatch.into());
        }

        Ok(bytemuck::from_bytes(
            &data[8..std::mem::size_of::<VrfPoolAccountData>() + 8],
        ))
    }
}

// impl Discriminator for VrfPoolAccountData {
//     const DISCRIMINATOR: [u8; 8] = [86, 67, 58, 9, 46, 21, 101, 248];
// }
// impl Owner for VrfPoolAccountData {
//     fn owner() -> solana_program::pubkey::Pubkey {
//         SWITCHBOARD_PROGRAM_ID
//     }
// }

impl Default for VrfPoolAccountData {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

// VRF POOL REQUEST
#[derive(Accounts)]
#[instruction(params: VrfPoolRequestRandomnessParams)] // rpc parameters hint
pub struct VrfPoolRequestRandomness<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf_pool: AccountInfo<'info>,
    #[account(mut, constraint = escrow.owner == program_state.key())]
    pub escrow: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub queue: AccountInfo<'info>,
    pub queue_authority: AccountInfo<'info>,
    pub data_buffer: AccountInfo<'info>,
    pub recent_blockhashes: AccountInfo<'info>,
    pub program_state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfPoolRequestRandomnessParams {
    pub callback: Option<Callback>,
}

impl Discriminator for VrfPoolRequestRandomness<'_> {
    const DISCRIMINATOR: [u8; 8] = [67, 49, 182, 255, 222, 161, 116, 238];
}

impl<'info> VrfPoolRequestRandomness<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        remaining_accounts: &'info [AccountInfo<'info>],
        callback: Option<Callback>,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None, remaining_accounts);

        let mut data: Vec<u8> = VrfPoolRequestRandomness::discriminator().try_to_vec()?;
        let params = VrfPoolRequestRandomnessParams { callback };
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
        callback: Option<Callback>,
    ) -> ProgramResult {
        let instruction =
            self.get_instruction(program.key.clone(), remaining_accounts, callback)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
        callback: Option<Callback>,
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction =
            self.get_instruction(program.key.clone(), remaining_accounts, callback)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        return vec![
            self.authority.clone(),
            self.vrf_pool.clone(),
            self.escrow.to_account_info().clone(),
            self.mint.to_account_info().clone(),
            self.queue.clone(),
            self.queue_authority.clone(),
            self.data_buffer.clone(),
            self.recent_blockhashes.clone(),
            self.program_state.clone(),
            self.token_program.clone(),
        ];
    }

    #[allow(unused_variables)]
    fn to_account_metas(
        &self,
        is_signer: Option<bool>,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Vec<AccountMeta> {
        let mut account_metas = vec![
            AccountMeta {
                pubkey: self.authority.key.clone(),
                is_signer: true, // overwrite, authority has to sign
                is_writable: self.authority.is_writable,
            },
            AccountMeta {
                pubkey: self.vrf_pool.key.clone(),
                is_signer: self.vrf_pool.is_signer,
                is_writable: self.vrf_pool.is_writable,
            },
            AccountMeta {
                pubkey: self.escrow.to_account_info().key.clone(),
                is_signer: self.escrow.to_account_info().is_signer,
                is_writable: self.escrow.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: self.mint.to_account_info().key.clone(),
                is_signer: self.mint.to_account_info().is_signer,
                is_writable: self.mint.to_account_info().is_writable,
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
        let rem_account_metas: Vec<AccountMeta> = remaining_accounts
            .into_iter()
            .flat_map(|acc| acc.to_account_metas(None))
            .collect();
        account_metas.extend(rem_account_metas);

        return account_metas;
    }
}

#[derive(Accounts)]
#[instruction(params: VrfPoolRemoveParams)] // rpc parameters hint
pub struct VrfPoolRemove<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub vrf_pool: AccountInfo<'info>,
    pub queue: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct VrfPoolRemoveParams {}

impl Discriminator for VrfPoolRemove<'_> {
    const DISCRIMINATOR: [u8; 8] = [15, 73, 86, 124, 75, 183, 20, 199];
}

impl<'info> VrfPoolRemove<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None, remaining_accounts);

        let mut data: Vec<u8> = VrfPoolRemove::discriminator().try_to_vec()?;
        let params = VrfPoolRemoveParams {};
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone(), remaining_accounts)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        remaining_accounts: &'info [AccountInfo<'info>],
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let instruction = self.get_instruction(program.key.clone(), remaining_accounts)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        return vec![
            self.authority.clone(),
            self.vrf_pool.clone(),
            self.queue.clone(),
        ];
    }

    #[allow(unused_variables)]
    fn to_account_metas(
        &self,
        is_signer: Option<bool>,
        remaining_accounts: &'info [AccountInfo<'info>],
    ) -> Vec<AccountMeta> {
        let mut account_metas = vec![
            AccountMeta {
                pubkey: self.authority.key.clone(),
                is_signer: true, // overwrite, authority has to sign
                is_writable: self.authority.is_writable,
            },
            AccountMeta {
                pubkey: self.vrf_pool.key.clone(),
                is_signer: self.vrf_pool.is_signer,
                is_writable: self.vrf_pool.is_writable,
            },
            AccountMeta {
                pubkey: self.queue.key.clone(),
                is_signer: self.queue.is_signer,
                is_writable: self.queue.is_writable,
            },
        ];

        let rem_account_metas: Vec<AccountMeta> = remaining_accounts
            .into_iter()
            .flat_map(|acc| acc.to_account_metas(None))
            .collect();
        account_metas.extend(rem_account_metas);

        return account_metas;
    }
}
