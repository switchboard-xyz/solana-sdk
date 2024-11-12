use crate::cfg_client;

use crate::prelude::*;

pub struct AggregatorSaveResult {
    pub aggregator: Pubkey,
    pub oracle: Pubkey,
    pub oracle_authority: Pubkey,
    pub oracle_queue: Pubkey,
    pub queue_authority: Pubkey,
    pub feed_permission: Pubkey,
    pub oracle_permission: Pubkey,
    pub lease: Pubkey,
    pub escrow: Pubkey,
    pub token_program: Pubkey,
    pub program_state: Pubkey,
    pub history_buffer: Pubkey,
    pub mint: Pubkey,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct AggregatorSaveResultParams {
    pub oracle_idx: u32,
    pub error: bool,
    pub value: BorshDecimal,
    pub jobs_checksum: [u8; 32],
    pub min_response: BorshDecimal,
    pub max_response: BorshDecimal,
    pub feed_permission_bump: u8,
    pub oracle_permission_bump: u8,
    pub lease_bump: u8,
    pub state_bump: u8,
}
impl Discriminator for AggregatorSaveResult {
    const DISCRIMINATOR: [u8; 8] = [21, 67, 5, 0, 74, 168, 51, 192];
}

cfg_client! {
impl<'info> AggregatorSaveResult {
    pub async fn get_instruction(
        &self,
        client: Arc<AnchorClient>,
        program_id: Pubkey,
        params: AggregatorSaveResultParams,
        oracles: Vec<Pubkey>,
    ) -> Result<Instruction, SbError> {
        let mut accounts = self.to_account_metas(None);
        let client = client.program(SWITCHBOARD_PROGRAM_ID).unwrap().async_rpc();

        let mut data: Vec<u8> = AggregatorSaveResult::discriminator().try_to_vec()?;
        let mut param_vec: Vec<u8> = params.try_to_vec()?;
        data.append(&mut param_vec);

        let mut remaining_accounts = vec![];
        for oracle in &oracles {
            remaining_accounts.push(AccountMeta {
                pubkey: oracle.clone(),
                is_signer: false,
                is_writable: true,
            });
        }
        let oracle_accounts = client
            .get_multiple_accounts(&oracles)
            .await
            .map_err(|e| SbError::CustomMessage(e.to_string()))?;
        for oracle_account in oracle_accounts {
            let oracle_account = oracle_account.ok_or("Oracle account not found")?;
            let oracle_state: &OracleAccountData =
                OracleAccountData::new_from_bytes(&oracle_account.data).map_err(|e| {
                    SbError::CustomMessage(format!(
                        "Error deserializing oracle account data: {}",
                        e
                    ))
                })?;
            remaining_accounts.push(AccountMeta {
                pubkey: oracle_state.token_account,
                is_signer: false,
                is_writable: true,
            });
        }
        let seeds = &[b"SlidingResultAccountData", self.aggregator.as_ref()];
        let (sliding_window_key, _) = Pubkey::find_program_address(seeds, &SWITCHBOARD_PROGRAM_ID);
        remaining_accounts.push(AccountMeta {
            pubkey: sliding_window_key,
            is_signer: false,
            is_writable: true,
        });
        accounts.append(&mut remaining_accounts);
        let instruction = Instruction::new_with_bytes(program_id, &data, accounts);
        Ok(instruction)
    }

    #[allow(unused_variables)]
    fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        let history_buffer = if self.history_buffer == Pubkey::default() {
            self.aggregator
        } else {
            self.history_buffer
        };
        let metas = vec![
            AccountMeta {
                pubkey: self.aggregator.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.oracle.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.oracle_authority.key(),
                is_signer: true,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.oracle_queue.key(),
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.queue_authority.key(),
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.feed_permission.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.oracle_permission.key(),
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.lease.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.escrow.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.token_program.key(),
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.program_state.key(),
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: history_buffer.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.mint.key(),
                is_signer: false,
                is_writable: false,
            },
        ];
        metas
    }
}
}
