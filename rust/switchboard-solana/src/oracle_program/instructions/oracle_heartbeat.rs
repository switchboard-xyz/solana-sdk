use crate::prelude::*;

pub struct OracleHeartbeat {
    pub oracle: Pubkey,
    pub oracle_authority: Pubkey,
    pub token_account: Pubkey,
    pub gc_oracle: Pubkey,
    pub oracle_queue: Pubkey,
    pub permission: Pubkey,
    pub data_buffer: Pubkey,
}
#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct OracleHeartbeatParams {
    pub permission_bump: u8,
}
impl Discriminator for OracleHeartbeat {
    const DISCRIMINATOR: [u8; 8] = [10, 175, 217, 130, 111, 35, 117, 54];
}

impl<'info> OracleHeartbeat {
    #[allow(unused_variables)]
    pub fn to_account_metas(&self, is_signer: Option<bool>) -> Vec<AccountMeta> {
        vec![
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
                pubkey: self.token_account.key(),
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.gc_oracle.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.oracle_queue.key(),
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: self.permission.key(),
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: self.data_buffer.key(),
                is_signer: false,
                is_writable: true,
            },
        ]
    }
}
