pub use crate::*;

// TODO: add test for this
pub fn parse_mr_enclaves(enclaves: &Vec<[u8; 32]>) -> Result<[[u8; 32]; 32]> {
    enclaves
        .clone()
        .try_into()
        .map_err(|_| error!(BasicOracleError::ArrayOverflow))
}
