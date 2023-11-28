use anchor_client::solana_sdk::signature::Keypair;
use anchor_client::{ Program, Client };
use switchboard_common::SbError;
use std::sync::Arc;
use std::result::Result;
use crate::SWITCHBOARD_ATTESTATION_PROGRAM_ID;

pub fn get_attestation_program(
    client: &Client<Arc<Keypair>>
) -> Result<Program<Arc<Keypair>>, SbError> {
    client.program(SWITCHBOARD_ATTESTATION_PROGRAM_ID).map_err(|e| SbError::CustomError {
        message: "Failed to get Anchor program".to_string(),
        source: Arc::new(e),
    })
}
