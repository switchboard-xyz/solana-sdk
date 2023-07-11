use crate::prelude::*;

pub type MrEnclave = [u8; 32];

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(Debug, PartialEq)]
pub struct Quote {
    /// The address of the signer generated within an enclave.
    pub enclave_signer: Pubkey,
    /// The quotes MRENCLAVE measurement dictating the contents of the secure enclave.
    pub mr_enclave: [u8; 32],
    /// The VerificationStatus of the quote.
    pub verification_status: u8,
    /// The unix timestamp when the quote was last verified.
    pub verification_timestamp: i64,
    /// The unix timestamp when the quotes verification status expires.
    pub valid_until: i64,
    /// The off-chain registry where the verifiers quote can be located.
    pub quote_registry: [u8; 32],
    /// Key to lookup the buffer data on IPFS or an alternative decentralized storage solution.
    pub registry_key: [u8; 64],
    /// Reserved.
    pub _ebuf: [u8; 256],
}
impl Default for Quote {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
impl Quote {
    pub fn reset_verification(&mut self) -> Result<()> {
        if self.verification_status != VerificationStatus::VerificationOverride as u8 {
            self.verification_status = VerificationStatus::None.into();
        }
        self.enclave_signer = Pubkey::default();
        self.verification_timestamp = 0;
        self.valid_until = 0;

        Ok(())
    }

    pub fn is_verified(&self, clock: &Clock) -> bool {
        match self.verification_status.into() {
            VerificationStatus::VerificationOverride => true,
            VerificationStatus::VerificationSuccess => self.valid_until > clock.unix_timestamp,
            _ => false,
        }
    }
}
