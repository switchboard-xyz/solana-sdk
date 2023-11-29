use crate::prelude::*;
use solana_program::borsh::get_instance_packed_len;

#[repr(u8)]
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum RequestStatus {
    #[default]
    None = 0,
    RequestPending = 1,
    RequestCancelled = 2,
    RequestFailure = 3,
    RequestExpired = 4,
    RequestSuccess = 5,
}
impl RequestStatus {
    pub fn is_active(&self) -> bool {
        matches!(self, RequestStatus::RequestPending)
    }
}
impl From<RequestStatus> for u8 {
    fn from(value: RequestStatus) -> Self {
        match value {
            RequestStatus::RequestPending => 1,
            RequestStatus::RequestCancelled => 2,
            RequestStatus::RequestFailure => 3,
            RequestStatus::RequestExpired => 4,
            RequestStatus::RequestSuccess => 5,
            _ => 0,
        }
    }
}
impl From<u8> for RequestStatus {
    fn from(value: u8) -> Self {
        match value {
            1 => RequestStatus::RequestPending,
            2 => RequestStatus::RequestCancelled,
            3 => RequestStatus::RequestFailure,
            4 => RequestStatus::RequestExpired,
            5 => RequestStatus::RequestSuccess,
            _ => RequestStatus::default(),
        }
    }
}

fn serialize_slice<W: borsh::maybestd::io::Write, T: borsh::ser::BorshSerialize>(
    slice: &[T],
    writer: &mut W,
) -> std::result::Result<(), std::io::Error> {
    for item in slice {
        item.serialize(writer)?;
    }
    Ok(())
}

#[derive(Copy, Clone, PartialEq)]
pub struct FunctionRequestTriggerRound {
    /// The status of the request.
    pub status: RequestStatus,
    /// The SOL bounty in lamports used to incentivize a verifier to expedite the request.
    pub bounty: u64,
    /// The slot the request was published
    pub request_slot: u64,
    /// The slot when the request was fulfilled
    pub fulfilled_slot: u64,
    /// The slot when the request will expire and be able to be closed by the non-authority account
    pub expiration_slot: u64,
    /// The EnclaveAccount who verified the enclave for this request
    pub verifier: Pubkey,
    /// The keypair generated in the enclave and required to sign any
    /// valid transactions processed by the function.
    pub enclave_signer: Pubkey,

    /// The slot when the request can first be executed.
    pub valid_after_slot: u64,

    /// The index of the verifier assigned to this request.
    pub queue_idx: u32,

    /// Reserved.
    pub _ebuf: [u8; 52],
}
impl Default for FunctionRequestTriggerRound {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

fn deserialize_round_ebuf_slice<R: borsh::maybestd::io::Read>(
    reader: &mut R,
) -> std::result::Result<[u8; 52], std::io::Error> {
    let mut buffer = [0u8; 52];
    reader.read_exact(&mut buffer)?;
    Ok(buffer)
}

impl borsh::ser::BorshSerialize for FunctionRequestTriggerRound
where
    RequestStatus: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    Pubkey: borsh::ser::BorshSerialize,
    Pubkey: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
{
    fn serialize<W: borsh::maybestd::io::Write>(
        &self,
        writer: &mut W,
    ) -> ::core::result::Result<(), borsh::maybestd::io::Error> {
        borsh::BorshSerialize::serialize(&self.status, writer)?;
        borsh::BorshSerialize::serialize(&self.bounty, writer)?;
        borsh::BorshSerialize::serialize(&self.request_slot, writer)?;
        borsh::BorshSerialize::serialize(&self.fulfilled_slot, writer)?;
        borsh::BorshSerialize::serialize(&self.expiration_slot, writer)?;
        borsh::BorshSerialize::serialize(&self.verifier, writer)?;
        borsh::BorshSerialize::serialize(&self.enclave_signer, writer)?;
        borsh::BorshSerialize::serialize(&self.valid_after_slot, writer)?;
        borsh::BorshSerialize::serialize(&self.queue_idx, writer)?;
        serialize_slice(&self._ebuf, writer)?;
        Ok(())
    }
}
impl borsh::de::BorshDeserialize for FunctionRequestTriggerRound
where
    RequestStatus: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    Pubkey: borsh::BorshDeserialize,
    Pubkey: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
{
    // fn deserialize(buf: &mut &[u8]) -> ::core::result::Result<Self, borsh::maybestd::io::Error> {
    //     Ok(Self {
    //         status: borsh::BorshDeserialize::deserialize(buf)?,
    //         bounty: borsh::BorshDeserialize::deserialize(buf)?,
    //         request_slot: borsh::BorshDeserialize::deserialize(buf)?,
    //         fulfilled_slot: borsh::BorshDeserialize::deserialize(buf)?,
    //         expiration_slot: borsh::BorshDeserialize::deserialize(buf)?,
    //         verifier: borsh::BorshDeserialize::deserialize(buf)?,
    //         enclave_signer: borsh::BorshDeserialize::deserialize(buf)?,
    //         valid_after_slot: borsh::BorshDeserialize::deserialize(buf)?,
    //         queue_idx: borsh::BorshDeserialize::deserialize(buf)?,
    //         _ebuf: deserialize_round_ebuf_slice(buf)?,
    //     })
    // }

    fn deserialize_reader<R: borsh::maybestd::io::Read>(
        reader: &mut R,
    ) -> ::core::result::Result<Self, borsh::maybestd::io::Error> {
        Ok(Self {
            status: borsh::BorshDeserialize::deserialize_reader(reader)?,
            bounty: borsh::BorshDeserialize::deserialize_reader(reader)?,
            request_slot: borsh::BorshDeserialize::deserialize_reader(reader)?,
            fulfilled_slot: borsh::BorshDeserialize::deserialize_reader(reader)?,
            expiration_slot: borsh::BorshDeserialize::deserialize_reader(reader)?,
            verifier: borsh::BorshDeserialize::deserialize_reader(reader)?,
            enclave_signer: borsh::BorshDeserialize::deserialize_reader(reader)?,
            valid_after_slot: borsh::BorshDeserialize::deserialize_reader(reader)?,
            queue_idx: borsh::BorshDeserialize::deserialize_reader(reader)?,
            _ebuf: borsh::BorshDeserialize::deserialize_reader(reader)?,
        })
    }
}

// #[account]
#[derive(Clone, PartialEq)]
pub struct FunctionRequestAccountData {
    // Up-Front Params for RPC filtering
    /// Whether the request is ready to be processed.
    pub is_triggered: u8,
    /// The status of the current request.
    pub status: RequestStatus,

    // Accounts
    /// Signer allowed to cancel the request.
    pub authority: Pubkey,
    /// The default destination for rent exemption when the account is closed.
    pub payer: Pubkey,
    /// The function that can process this request
    pub function: Pubkey,
    /// The tokenAccount escrow
    pub escrow: Pubkey,
    /// The Attestation Queue for this request.
    pub attestation_queue: Pubkey,

    // Rounds
    /// The current active request.
    pub active_request: FunctionRequestTriggerRound,
    /// The previous request.
    pub previous_request: FunctionRequestTriggerRound,

    // Container Params
    /// The maximum number of bytes to pass to the container params.
    pub max_container_params_len: u32,
    /// Hash of the serialized container_params to prevent RPC tampering.
    /// Should be verified within your function to ensure you are using the correct parameters.
    pub container_params_hash: [u8; 32],
    /// The stringified container params to pass to the function.
    pub container_params: Vec<u8>,

    // Metadata
    /// The unix timestamp when the function was created.
    pub created_at: i64,
    /// The slot when the account can be garbage collected and closed by anyone for a portion of the rent.
    pub garbage_collection_slot: Option<u64>,

    /// The last recorded error code if most recent response was an error.
    pub error_status: u8,

    /// Reserved.
    pub _ebuf: [u8; 255],
}
impl Default for FunctionRequestAccountData {
    fn default() -> Self {
        Self {
            is_triggered: 0,
            status: RequestStatus::None,
            authority: Pubkey::default(),
            payer: Pubkey::default(),
            function: Pubkey::default(),
            escrow: Pubkey::default(),
            attestation_queue: Pubkey::default(),
            active_request: FunctionRequestTriggerRound::default(),
            previous_request: FunctionRequestTriggerRound::default(),
            max_container_params_len: 0,
            container_params_hash: [0u8; 32],
            container_params: Vec::new(),
            created_at: 0,
            garbage_collection_slot: None,
            error_status: 0,
            _ebuf: [0u8; 255],
        }
    }
}

fn deserialize_ebuf_slice<R: borsh::maybestd::io::Read>(
    reader: &mut R,
) -> std::result::Result<[u8; 255], std::io::Error> {
    let mut buffer = [0u8; 255];
    reader.read_exact(&mut buffer)?;
    Ok(buffer)
}

impl borsh::ser::BorshSerialize for FunctionRequestAccountData
where
    RequestStatus: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    Pubkey: borsh::ser::BorshSerialize,
    Pubkey: borsh::ser::BorshSerialize,
    u64: borsh::ser::BorshSerialize,
    FunctionRequestTriggerRound: borsh::ser::BorshSerialize,
    Vec<u8>: borsh::ser::BorshSerialize,
{
    fn serialize<W: borsh::maybestd::io::Write>(
        &self,
        writer: &mut W,
    ) -> ::core::result::Result<(), borsh::maybestd::io::Error> {
        borsh::BorshSerialize::serialize(&self.is_triggered, writer)?;
        borsh::BorshSerialize::serialize(&self.status, writer)?;
        borsh::BorshSerialize::serialize(&self.authority, writer)?;
        borsh::BorshSerialize::serialize(&self.payer, writer)?;
        borsh::BorshSerialize::serialize(&self.function, writer)?;
        borsh::BorshSerialize::serialize(&self.escrow, writer)?;
        borsh::BorshSerialize::serialize(&self.attestation_queue, writer)?;
        borsh::BorshSerialize::serialize(&self.active_request, writer)?;
        borsh::BorshSerialize::serialize(&self.previous_request, writer)?;
        borsh::BorshSerialize::serialize(&self.max_container_params_len, writer)?;
        borsh::BorshSerialize::serialize(&self.container_params_hash, writer)?;
        borsh::BorshSerialize::serialize(&self.container_params, writer)?;
        borsh::BorshSerialize::serialize(&self.created_at, writer)?;
        borsh::BorshSerialize::serialize(&self.garbage_collection_slot, writer)?;
        borsh::BorshSerialize::serialize(&self.error_status, writer)?;
        serialize_slice(&self._ebuf, writer)?;
        Ok(())
    }
}
impl borsh::de::BorshDeserialize for FunctionRequestAccountData
where
    RequestStatus: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    Pubkey: borsh::BorshDeserialize,
    Pubkey: borsh::BorshDeserialize,
    u64: borsh::BorshDeserialize,
    FunctionRequestTriggerRound: borsh::BorshDeserialize,
{
    // fn deserialize(buf: &mut &[u8]) -> ::core::result::Result<Self, borsh::maybestd::io::Error> {
    //     Ok(Self {
    //         is_triggered: borsh::BorshDeserialize::deserialize(buf)?,
    //         status: borsh::BorshDeserialize::deserialize(buf)?,
    //         authority: borsh::BorshDeserialize::deserialize(buf)?,
    //         payer: borsh::BorshDeserialize::deserialize(buf)?,
    //         function: borsh::BorshDeserialize::deserialize(buf)?,
    //         escrow: borsh::BorshDeserialize::deserialize(buf)?,
    //         attestation_queue: borsh::BorshDeserialize::deserialize(buf)?,
    //         active_request: borsh::BorshDeserialize::deserialize(buf)?,
    //         previous_request: borsh::BorshDeserialize::deserialize(buf)?,
    //         max_container_params_len: borsh::BorshDeserialize::deserialize(buf)?,
    //         container_params_hash: borsh::BorshDeserialize::deserialize(buf)?,
    //         container_params: borsh::BorshDeserialize::deserialize(buf)?,
    //         created_at: borsh::BorshDeserialize::deserialize(buf)?,
    //         garbage_collection_slot: borsh::BorshDeserialize::deserialize(buf)?,
    //         error_status: borsh::BorshDeserialize::deserialize(buf)?,
    //         _ebuf: deserialize_ebuf_slice(buf)?,
    //     })
    // }

    fn deserialize_reader<R: borsh::maybestd::io::Read>(
        reader: &mut R,
    ) -> ::core::result::Result<Self, borsh::maybestd::io::Error> {
        Ok(Self {
            is_triggered: borsh::BorshDeserialize::deserialize_reader(reader)?,
            status: borsh::BorshDeserialize::deserialize_reader(reader)?,
            authority: borsh::BorshDeserialize::deserialize_reader(reader)?,
            payer: borsh::BorshDeserialize::deserialize_reader(reader)?,
            function: borsh::BorshDeserialize::deserialize_reader(reader)?,
            escrow: borsh::BorshDeserialize::deserialize_reader(reader)?,
            attestation_queue: borsh::BorshDeserialize::deserialize_reader(reader)?,
            active_request: borsh::BorshDeserialize::deserialize_reader(reader)?,
            previous_request: borsh::BorshDeserialize::deserialize_reader(reader)?,
            max_container_params_len: borsh::BorshDeserialize::deserialize_reader(reader)?,
            container_params_hash: borsh::BorshDeserialize::deserialize_reader(reader)?,
            container_params: borsh::BorshDeserialize::deserialize_reader(reader)?,
            created_at: borsh::BorshDeserialize::deserialize_reader(reader)?,
            garbage_collection_slot: borsh::BorshDeserialize::deserialize_reader(reader)?,
            error_status: borsh::BorshDeserialize::deserialize_reader(reader)?,
            _ebuf: borsh::BorshDeserialize::deserialize_reader(reader)?,
        })
    }
}

impl anchor_lang::AccountSerialize for FunctionRequestAccountData {
    fn try_serialize<W: std::io::Write>(&self, writer: &mut W) -> anchor_lang::Result<()> {
        if writer
            .write_all(&FunctionRequestAccountData::discriminator())
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

impl anchor_lang::AccountDeserialize for FunctionRequestAccountData {
    fn try_deserialize(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        if buf.len() < FunctionRequestAccountData::discriminator().len() {
            return Err(anchor_lang::error::ErrorCode::AccountDiscriminatorNotFound.into());
        }
        let given_disc = &buf[..8];
        if FunctionRequestAccountData::discriminator() != given_disc {
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
                            line: 1u32,
                        },
                    )),
                    compared_values: None,
                })
                .with_account_name("FunctionRequestAccountData"),
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

impl Discriminator for FunctionRequestAccountData {
    const DISCRIMINATOR: [u8; 8] = [8, 14, 177, 85, 144, 65, 148, 246];
}

impl Owner for FunctionRequestAccountData {
    fn owner() -> Pubkey {
        SWITCHBOARD_ATTESTATION_PROGRAM_ID
    }
}

impl FunctionRequestAccountData {
    pub fn space(len: Option<u32>) -> usize {
        let base: usize = 8  // discriminator
            + get_instance_packed_len(&FunctionRequestAccountData::default()).unwrap();
        let vec_elements: usize = len.unwrap_or(crate::DEFAULT_MAX_CONTAINER_PARAMS_LEN) as usize;
        base + vec_elements
    }

    // verify if their is a non-expired pending request
    pub fn is_round_active(&self, clock: &Clock) -> bool {
        // 1. check status enum
        if !self.active_request.status.is_active() {
            return false;
        }

        // 2. check valid after slot
        // TODO: we should throw a more descriptive error for this
        if clock.slot < self.active_request.valid_after_slot {
            return false;
        }

        // 3. check expiration
        if self.active_request.expiration_slot > 0
            && clock.slot >= self.active_request.expiration_slot
        {
            return false;
        }

        true
    }

    /// Validates that the provided request is assigned to the same `AttestationQueueAccountData` as the function and the
    /// provided `enclave_signer` matches the `enclave_signer` stored in the request's `active_request` field.
    ///
    /// # Arguments
    ///
    /// * `request` - The `FunctionRequestAccountData` being validated.
    /// * `enclave_signer` - The `AccountInfo` of the enclave signer to validate.
    ///
    /// # Errors
    ///
    /// Returns an error if:
    /// * the function cannot be deserialized
    /// * the function is not assigned to the request
    /// * the function and request have different attestation queues
    /// * the request's verified signer does not match the provided `enclave_signer`
    /// * the `enclave_signer` did not sign the transaction
    ///
    /// # Returns
    ///
    /// Returns `Ok(true)` if the validation succeeds, `Ok(false)` otherwise.
    ///
    /// # Examples
    ///
    /// ```ignore
    /// use switchboard_solana::FunctionRequestAccountData;
    ///
    /// #[derive(Accounts)]
    /// pub struct Settle<'info> {
    ///     // YOUR PROGRAM ACCOUNTS
    ///     #[account(
    ///         mut,
    ///         has_one = switchboard_request,
    ///     )]
    ///     pub user: AccountLoader<'info, UserState>,
    ///
    ///     // SWITCHBOARD ACCOUNTS
    ///     pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    ///     #[account(
    ///         constraint = switchboard_request.validate_signer(
    ///             &switchboard_function,
    ///             &enclave_signer.to_account_info()
    ///         )?
    ///     )]
    ///     pub switchboard_request: Box<Account<'info, FunctionRequestAccountData>>,
    ///     pub enclave_signer: Signer<'info>,
    /// }
    /// ```
    pub fn validate_signer<'a>(
        &self,
        function_loader: &AccountLoader<'a, FunctionAccountData>,
        enclave_signer: &AccountInfo<'a>,
    ) -> anchor_lang::Result<bool> {
        if self.function != function_loader.key() {
            msg!(
                "FunctionMismatch: expected {}, received {}",
                self.function,
                function_loader.key()
            );
            return Ok(false);
        }

        let func = function_loader.load()?; // check owner/discriminator

        func.validate_request(self, enclave_signer)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    use std::str::FromStr;

    const REQUEST_DATA: [u8; 1309] = [
        8, 14, 177, 85, 144, 65, 148, 246, 0, 4, 191, 163, 95, 149, 251, 196, 61, 38, 170, 30, 192,
        210, 238, 210, 121, 251, 115, 80, 136, 183, 116, 88, 7, 195, 127, 225, 4, 177, 167, 250,
        214, 98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 200, 91, 33, 133, 251, 77, 4, 45, 33, 88, 160, 219, 74, 253, 191, 56, 191,
        52, 130, 87, 44, 197, 78, 47, 64, 1, 9, 49, 23, 46, 248, 118, 67, 254, 215, 187, 179, 81,
        198, 84, 39, 244, 16, 113, 89, 56, 41, 133, 66, 71, 68, 238, 198, 34, 226, 219, 65, 150,
        252, 243, 229, 140, 153, 112, 174, 177, 70, 231, 73, 196, 214, 194, 190, 219, 159, 24, 162,
        119, 159, 16, 120, 53, 239, 102, 225, 241, 66, 97, 108, 144, 152, 47, 53, 76, 242, 215, 4,
        0, 0, 0, 0, 0, 0, 0, 0, 212, 153, 154, 14, 0, 0, 0, 0, 225, 153, 154, 14, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 214, 176, 30, 24, 236, 238, 245, 97, 218, 201, 34, 20, 25, 94, 235, 88,
        235, 48, 114, 193, 144, 126, 220, 233, 142, 238, 32, 191, 233, 220, 175, 23, 80, 233, 228,
        192, 87, 36, 180, 107, 5, 182, 70, 125, 89, 139, 68, 5, 118, 218, 209, 167, 207, 52, 20,
        76, 217, 241, 92, 50, 106, 53, 253, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
        0, 0, 159, 54, 102, 77, 67, 235, 26, 94, 144, 172, 18, 65, 45, 54, 127, 59, 100, 213, 206,
        91, 40, 101, 248, 189, 195, 19, 165, 190, 123, 227, 54, 103, 125, 0, 0, 0, 80, 73, 68, 61,
        69, 53, 77, 65, 115, 122, 106, 122, 56, 113, 90, 90, 68, 72, 75, 113, 81, 50, 49, 103, 53,
        119, 89, 117, 104, 77, 84, 106, 77, 98, 107, 49, 76, 52, 76, 52, 106, 66, 70, 88, 77, 103,
        113, 71, 44, 77, 73, 78, 95, 82, 69, 83, 85, 76, 84, 61, 49, 44, 77, 65, 88, 95, 82, 69,
        83, 85, 76, 84, 61, 49, 48, 44, 85, 83, 69, 82, 61, 68, 117, 53, 77, 111, 52, 89, 70, 70,
        70, 76, 113, 84, 57, 75, 90, 81, 75, 80, 77, 119, 52, 67, 109, 101, 111, 53, 86, 102, 71,
        76, 117, 114, 106, 99, 82, 104, 120, 104, 98, 51, 112, 106, 75, 130, 192, 8, 101, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    const REQUEST_DATA_HEX: &str = "080eb155904194f60004bfa35f95fbc43d26aa1ec0d2eed279fb735088b7745807c37fe104b1a7fad6620000000000000000000000000000000000000000000000000000000000000000c85b2185fb4d042d2158a0db4afdbf38bf3482572cc54e2f40010931172ef87643fed7bbb351c65427f4107159382985424744eec622e2db4196fcf3e58c9970aeb146e749c4d6c2bedb9f18a2779f107835ef66e1f142616c90982f354cf2d7040000000000000000d4999a0e00000000e1999a0e000000000000000000000000d6b01e18eceef561dac92214195eeb58eb3072c1907edce98eee20bfe9dcaf1750e9e4c05724b46b05b6467d598b440576dad1a7cf34144cd9f15c326a35fd3c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200009f36664d43eb1a5e90ac12412d367f3b64d5ce5b2865f8bdc313a5be7be336677d0000005049443d45354d41737a6a7a38715a5a44484b715132316735775975684d546a4d626b314c344c346a4246584d6771472c4d494e5f524553554c543d312c4d41585f524553554c543d31302c555345523d4475354d6f34594646464c7154394b5a514b504d7734436d656f355666474c75726a63526878686233706a4b82c00865000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

    const EXPECTED_CONTAINER_PARAMS: &str = "PID=E5MAszjz8qZZDHKqQ21g5wYuhMTjMbk1L4L4jBFXMgqG,MIN_RESULT=1,MAX_RESULT=10,USER=Du5Mo4YFFFLqT9KZQKPMw4Cmeo5VfGLurjcRhxhb3pjK";

    #[test]
    fn test_request_deserialization() {
        let request =
            FunctionRequestAccountData::try_deserialize_unchecked(&mut REQUEST_DATA.as_slice())
                .unwrap();

        let container_params = std::str::from_utf8(&request.container_params)
            .unwrap()
            .to_string();

        assert_eq!(container_params, EXPECTED_CONTAINER_PARAMS.to_string());
        assert_eq!(
            request.function,
            Pubkey::from_str("EV78uGX5CKioM7MyY8tY1nQFJtNXnjVGTCV2tamWdXGh").unwrap()
        );
        assert_eq!(
            request.escrow,
            Pubkey::from_str("5aRhbaGeoe7HTwoMwGgeENGXuVCLcRBNxFrmFnWGG1bM").unwrap()
        );
    }

    #[test]
    fn test_hex_decode() {
        let account_bytes = hex::decode(REQUEST_DATA_HEX).unwrap();
        let request =
            FunctionRequestAccountData::try_deserialize(&mut account_bytes.as_slice()).unwrap();

        let container_params = std::str::from_utf8(&request.container_params)
            .unwrap()
            .to_string();

        assert_eq!(container_params, EXPECTED_CONTAINER_PARAMS.to_string());

        assert_eq!(
            request.function,
            Pubkey::from_str("EV78uGX5CKioM7MyY8tY1nQFJtNXnjVGTCV2tamWdXGh").unwrap()
        );
        assert_eq!(
            request.escrow,
            Pubkey::from_str("5aRhbaGeoe7HTwoMwGgeENGXuVCLcRBNxFrmFnWGG1bM").unwrap()
        );
    }

    #[test]
    fn test_hex_encode() {
        // Encode the bytes a hex value
        let request =
            FunctionRequestAccountData::try_deserialize(&mut REQUEST_DATA.as_slice()).unwrap();
        let request_data = [
            &FunctionRequestAccountData::DISCRIMINATOR[..],
            &request.try_to_vec().unwrap()[..],
        ]
        .concat();

        // Decode the serialized bytes
        let decoded_request =
            FunctionRequestAccountData::try_deserialize(&mut request_data.as_slice()).unwrap();

        assert_eq!(request.created_at, decoded_request.created_at);
        assert_eq!(
            request.container_params.len(),
            decoded_request.container_params.len()
        );
    }
}
