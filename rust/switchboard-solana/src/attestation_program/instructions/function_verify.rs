use crate::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::{Discriminator, InstructionData};
use anchor_spl::token::TokenAccount;

#[derive(Accounts)]
#[instruction(params: FunctionVerifyParams)] // rpc parameters hint
pub struct FunctionVerify<'info> {
    #[account(mut)]
    pub function: AccountInfo<'info>,
    #[account(signer)]
    pub fn_signer: AccountInfo<'info>,
    /// CHECK:
    pub fn_quote: AccountInfo<'info>,
    pub verifier_quote: AccountInfo<'info>,
    #[account(signer)]
    pub secured_signer: AccountInfo<'info>,
    pub attestation_queue: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub escrow: Account<'info, TokenAccount>,
    /// CHECK:
    #[account(mut)]
    pub receiver: Account<'info, TokenAccount>,
    pub verifier_permission: AccountInfo<'info>,
    pub fn_permission: AccountInfo<'info>,
    #[account(mut)]
    pub state: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
    #[account(signer)]
    pub payer: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct FunctionVerifyParams {
    pub observed_time: i64,
    pub next_allowed_timestamp: i64,
    pub is_failure: bool,
    pub mr_enclave: [u8; 32],
}
impl InstructionData for FunctionVerifyParams {}
impl Discriminator for FunctionVerifyParams {
    const DISCRIMINATOR: [u8; 8] = [210, 108, 154, 138, 198, 14, 53, 191];
}
impl Discriminator for FunctionVerify<'_> {
    const DISCRIMINATOR: [u8; 8] = [210, 108, 154, 138, 198, 14, 53, 191];
}

impl<'info> FunctionVerify<'info> {
    pub fn get_instruction(
        &self,
        program_id: Pubkey,
        params: FunctionVerifyParams,
    ) -> anchor_lang::Result<Instruction> {
        let accounts = self.to_account_metas(None);

        let mut data: Vec<u8> = FunctionVerify::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    pub fn invoke(
        &self,
        program: AccountInfo<'info>,
        observed_time: i64,
        next_allowed_timestamp: i64,
        is_failure: bool,
        mr_enclave: [u8; 32],
    ) -> ProgramResult {
        let cpi_params = FunctionVerifyParams {
            observed_time,
            next_allowed_timestamp,
            is_failure,
            mr_enclave,
        };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke(&instruction, &account_infos[..])
    }

    pub fn invoke_signed(
        &self,
        program: AccountInfo<'info>,
        observed_time: i64,
        next_allowed_timestamp: i64,
        is_failure: bool,
        mr_enclave: [u8; 32],
        signer_seeds: &[&[&[u8]]],
    ) -> ProgramResult {
        let cpi_params = FunctionVerifyParams {
            observed_time,
            next_allowed_timestamp,
            is_failure,
            mr_enclave,
        };
        let instruction = self.get_instruction(*program.key, cpi_params)?;
        let account_infos = self.to_account_infos();

        invoke_signed(&instruction, &account_infos[..], signer_seeds)
    }

    fn to_account_infos(&self) -> Vec<AccountInfo<'info>> {
        vec![
            self.function.clone(),
            self.fn_signer.clone(),
            self.fn_quote.clone(),
            self.verifier_quote.clone(),
            self.secured_signer.clone(),
            self.attestation_queue.clone(),
            self.escrow.to_account_info().clone(),
            self.receiver.to_account_info().clone(),
            self.verifier_permission.clone(),
            self.fn_permission.clone(),
            self.state.clone(),
            self.token_program.clone(),
            self.payer.clone(),
            self.system_program.clone(),
        ]
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta {
                pubkey: *self.function.key,
                is_signer: self.function.is_signer,
                is_writable: self.function.is_writable,
            },
            AccountMeta {
                pubkey: *self.fn_signer.key,
                is_signer: self.fn_signer.is_signer,
                is_writable: self.fn_signer.is_writable,
            },
            AccountMeta {
                pubkey: *self.fn_quote.key,
                is_signer: self.fn_quote.is_signer,
                is_writable: self.fn_quote.is_writable,
            },
            AccountMeta {
                pubkey: *self.verifier_quote.key,
                is_signer: self.verifier_quote.is_signer,
                is_writable: self.verifier_quote.is_writable,
            },
            AccountMeta {
                pubkey: *self.secured_signer.key,
                is_signer: self.verifier_quote.is_signer,
                is_writable: self.verifier_quote.is_writable,
            },
            AccountMeta {
                pubkey: *self.attestation_queue.key,
                is_signer: self.attestation_queue.is_signer,
                is_writable: self.attestation_queue.is_writable,
            },
            AccountMeta {
                pubkey: self.escrow.key(),
                is_signer: self.escrow.to_account_info().is_signer,
                is_writable: self.escrow.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: self.receiver.key(),
                is_signer: self.receiver.to_account_info().is_signer,
                is_writable: self.receiver.to_account_info().is_writable,
            },
            AccountMeta {
                pubkey: *self.verifier_permission.key,
                is_signer: self.verifier_permission.is_signer,
                is_writable: self.verifier_permission.is_writable,
            },
            AccountMeta {
                pubkey: *self.fn_permission.key,
                is_signer: self.fn_permission.is_signer,
                is_writable: self.fn_permission.is_writable,
            },
            AccountMeta {
                pubkey: *self.state.key,
                is_signer: self.state.is_signer,
                is_writable: self.state.is_writable,
            },
            AccountMeta {
                pubkey: *self.token_program.key,
                is_signer: self.token_program.is_signer,
                is_writable: self.token_program.is_writable,
            },
            AccountMeta {
                pubkey: *self.payer.key,
                is_signer: self.payer.is_signer,
                is_writable: self.payer.is_writable,
            },
            AccountMeta {
                pubkey: *self.system_program.key,
                is_signer: self.system_program.is_signer,
                is_writable: self.system_program.is_writable,
            },
        ]
    }

    #[cfg(feature = "client")]
    pub async fn build(
        client: &anchor_client::Client<
            std::sync::Arc<anchor_client::solana_sdk::signer::keypair::Keypair>,
        >,
        fn_signer: std::sync::Arc<anchor_client::solana_sdk::signer::keypair::Keypair>,
        pubkeys: &FunctionVerifyPubkeys,
        mr_enclave: [u8; 32],
    ) -> std::result::Result<Instruction, switchboard_common::error::Error> {
        let fn_signer_pubkey = crate::client::to_pubkey(fn_signer)?;

        let current_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;

        let fn_data: FunctionAccountData = load_account(&client, pubkeys.function).await?;

        let verifier_quote: QuoteAccountData = load_account(&client, pubkeys.verifier).await?;

        let queue_data: AttestationQueueAccountData =
            crate::client::load_account(&client, fn_data.attestation_queue).await?;

        // let escrow = fn_data.escrow;
        let (fn_quote, _) = Pubkey::find_program_address(
            &[b"QuoteAccountData", &pubkeys.function.to_bytes()],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );

        let (verifier_permission, _) = Pubkey::find_program_address(
            &[
                b"PermissionAccountData",
                &queue_data.authority.to_bytes(),
                &fn_data.attestation_queue.to_bytes(),
                &pubkeys.payer.to_bytes(),
            ],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );

        let (fn_permission, _) = Pubkey::find_program_address(
            &[
                b"PermissionAccountData",
                &queue_data.authority.to_bytes(),
                &fn_data.attestation_queue.to_bytes(),
                &pubkeys.function.to_bytes(),
            ],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );

        let (state, _) =
            Pubkey::find_program_address(&[b"STATE"], &SWITCHBOARD_ATTESTATION_PROGRAM_ID);

        let accounts = FunctionVerifyAccounts {
            function: pubkeys.function,
            fn_signer: fn_signer_pubkey,
            fn_quote,
            verifier_quote: pubkeys.verifier,
            secured_signer: verifier_quote.authority,
            attestation_queue: fn_data.attestation_queue,
            escrow: fn_data.escrow,
            receiver: pubkeys.reward_receiver,
            verifier_permission,
            fn_permission,
            state,
            token_program: anchor_spl::token::ID,
            payer: pubkeys.payer,
            system_program: anchor_lang::solana_program::system_program::ID,
        };

        let next_allowed_timestamp = fn_data
            .next_execution_timestamp()
            .map(|x| x.timestamp())
            .unwrap_or(i64::MAX);

        Ok(Self::build_ix(
            accounts,
            current_time,
            next_allowed_timestamp,
            false,
            mr_enclave,
        ))
    }

    #[cfg(feature = "client")]
    fn build_ix(
        accounts: FunctionVerifyAccounts,
        observed_time: i64,
        next_allowed_timestamp: i64,
        is_failure: bool,
        mr_enclave: [u8; 32],
    ) -> Instruction {
        Instruction {
            program_id: SWITCHBOARD_ATTESTATION_PROGRAM_ID,
            accounts: accounts.to_account_metas(None),
            data: FunctionVerifyParams {
                observed_time,
                next_allowed_timestamp,
                is_failure,
                mr_enclave,
            }
            .data(),
        }
    }
}

#[cfg(feature = "client")]
pub struct FunctionVerifyAccounts {
    pub function: Pubkey,
    pub fn_signer: Pubkey,
    pub fn_quote: Pubkey,
    pub verifier_quote: Pubkey,
    pub secured_signer: Pubkey,
    pub attestation_queue: Pubkey,
    pub escrow: Pubkey,
    pub receiver: Pubkey,
    pub verifier_permission: Pubkey,
    pub fn_permission: Pubkey,
    pub state: Pubkey,
    pub token_program: Pubkey,
    pub payer: Pubkey,
    pub system_program: Pubkey,
}
#[cfg(feature = "client")]
impl ToAccountMetas for FunctionVerifyAccounts {
    fn to_account_metas(&self, _: Option<bool>) -> Vec<AccountMeta> {
        vec![
            AccountMeta {
                pubkey: self.function,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.fn_signer,
                is_signer: true,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.fn_quote,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.verifier_quote,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.secured_signer,
                is_signer: true,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.attestation_queue,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.escrow,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.receiver,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.verifier_permission,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.fn_permission,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.state,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.token_program,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.payer,
                is_signer: true,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.system_program,
                is_signer: false,
                is_writable: false,
            },
        ]
    }
}
