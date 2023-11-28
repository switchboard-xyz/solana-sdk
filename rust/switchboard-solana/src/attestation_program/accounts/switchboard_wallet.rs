use crate::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct SwitchboardWallet {
    pub bump: u8,
    pub initialized: u8,
    pub mint: Pubkey,               // PDA
    pub attestation_queue: Pubkey,  // PDA
    pub authority: Pubkey,          // PDA
    pub name: [u8; 32],             // PDA. derive by wallet name
    pub resource_count: u32,        // we should set some maximum
    pub withdraw_authority: Pubkey, // allow deposited assets to be frozen
    pub token_wallet: Pubkey,       // associated token wallet

    pub resources: Vec<Pubkey>,
    pub resources_max_len: u32,

    /// Reserved.
    pub _ebuf: [u8; 64],
}
impl Default for SwitchboardWallet {
    fn default() -> Self {
        Self {
            bump: 0,
            initialized: 0,
            mint: Pubkey::default(),
            attestation_queue: Pubkey::default(),
            authority: Pubkey::default(),
            name: [0u8; 32],
            resource_count: 0,
            withdraw_authority: Pubkey::default(),
            token_wallet: Pubkey::default(),
            resources: Vec::new(),
            resources_max_len: 0,
            _ebuf: [0u8; 64],
        }
    }
}

impl anchor_lang::AccountSerialize for SwitchboardWallet {
    fn try_serialize<W: std::io::Write>(&self, writer: &mut W) -> anchor_lang::Result<()> {
        if writer
            .write_all(&SwitchboardWallet::discriminator())
            .is_err()
        {
            return Err(anchor_lang::error::ErrorCode::AccountDidNotSerialize.into());
        }
        if AnchorSerialize::serialize(self, writer).is_err() {
            return Err(anchor_lang::error::ErrorCode::AccountDidNotSerialize.into());
        }
        Ok(())
    }
}

impl anchor_lang::AccountDeserialize for SwitchboardWallet {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < SwitchboardWallet::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if SwitchboardWallet::discriminator() != given_disc {
            return Err(
                anchor_lang::error::Error::from(anchor_lang::error::AnchorError {
                    error_name: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch.name(),
                    error_code_number: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch
                        .into(),
                    error_msg: anchor_lang::error::ErrorCode::AccountDiscriminatorMismatch
                        .to_string(),
                    error_origin: Some(anchor_lang::error::ErrorOrigin::Source(
                        anchor_lang::error::Source {
                            filename: "programs/attestation_program/src/lib.rs",
                            line: 357u32,
                        },
                    )),
                    compared_values: None,
                })
                .with_account_name("SwitchboardWallet"),
            );
        }
        Self::try_deserialize_unchecked(buf)
    }
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let mut data: &[u8] = &buf[8..];
        AnchorDeserialize::deserialize(&mut data)
            .map_err(|_| anchor_lang::error::ErrorCode::AccountDidNotDeserialize.into())
    }
}

impl Discriminator for SwitchboardWallet {
    const DISCRIMINATOR: [u8; 8] = [210, 5, 94, 50, 69, 33, 74, 13];
}

impl Owner for SwitchboardWallet {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl SwitchboardWallet {
    pub fn space(len: Option<u32>) -> usize {
        let base: usize = 8  // discriminator
            + solana_program::borsh::get_instance_packed_len(&SwitchboardWallet::default()).unwrap();
        let vec_elements: usize = len.unwrap_or(crate::DEFAULT_MAX_CONTAINER_PARAMS_LEN) as usize;
        base + vec_elements
    }

    pub fn should_init(info: &AccountInfo) -> bool {
        info.owner == &anchor_lang::system_program::ID && info.lamports() == 0
    }

    /// Returns the deserialized Switchboard wallet account
    ///
    /// # Arguments
    ///
    /// * `wallet_account_info` - A Solana AccountInfo referencing an existing SwitchboardWallet
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::SwitchboardWallet;
    ///
    /// let wallet_account = SwitchboardWallet::new(wallet_account_info)?;
    /// ```
    pub fn new<'info>(
        wallet_account_info: &'info AccountInfo<'info>,
    ) -> anchor_lang::Result<Box<Account<'info, SwitchboardWallet>>> {
        Ok(Box::new(Account::<SwitchboardWallet>::try_from(
            wallet_account_info,
        )?))
    }

    pub fn add_resource(&mut self, resource: Pubkey) -> anchor_lang::Result<()> {
        self.resource_count += 1;
        self.resources.push(resource);

        if self.resources.len() > 16 {
            return Err(error!(SwitchboardError::IllegalExecuteAttempt));
        }

        Ok(())
    }

    pub fn remove_resource(
        &mut self,
        resource: Pubkey,
        idx: Option<u32>,
    ) -> anchor_lang::Result<()> {
        self.resource_count -= 1;

        if let Some(index) = idx {
            self.resources.remove(index as usize);
        } else {
            let index = self.resources.iter().position(|x| *x == resource).unwrap();
            self.resources.remove(index);
        };

        Ok(())
    }

    pub fn parse_name(name: &[u8]) -> [u8; 32] {
        let mut name = name.to_vec();
        name.resize(32, 0);
        name.try_into().unwrap()
    }

    pub fn derive_key(
        mint: Pubkey,
        attestation_queue: Pubkey,
        authority: Pubkey,
        name: Vec<u8>,
    ) -> Pubkey {
        let (pda_key, _bump) = Pubkey::find_program_address(
            &[
                mint.as_ref(),
                attestation_queue.as_ref(),
                authority.as_ref(),
                &SwitchboardWallet::parse_name(&name),
            ],
            &SWITCHBOARD_ATTESTATION_PROGRAM_ID,
        );
        pda_key
    }
}
