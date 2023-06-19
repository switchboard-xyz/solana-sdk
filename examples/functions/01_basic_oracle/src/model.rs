use crate::*;

#[account(zero_copy)]
#[derive(Default, Debug, AnchorSerialize)]
pub struct MyProgramState {
    pub bump: u8,
    pub authority: Pubkey,
    /// List of valid measurements that are permitted to push data onto the oracle
    pub mr_enclaves: [[u8; 32]; 32],
}
impl MyProgramState {
    pub fn is_valid_enclave(&self, quote_enclave: &[u8; 32]) -> bool {
        if *quote_enclave == [0u8; 32] {
            return false;
        }

        if !self.mr_enclaves.contains(quote_enclave) {
            return false;
        }

        true
    }
}

#[zero_copy]
#[derive(Default, Debug, AnchorDeserialize, AnchorSerialize)]
pub struct OracleData {
    pub oracle_timestamp: i64,
    pub price: i128,
    pub volume: i128,
    pub twap_24hr: i128,
}

// impl OracleData {
//     pub fn get_fair_price(&self) -> anchor_lang::Result<f64> {
//         // Do some logic here based on the twap/vwap

//         let result: f64 = self.price.try_into()?;
//         Ok(result)
//     }
// }

#[repr(packed)]
#[account(zero_copy)]
#[derive(Default, Debug)]
pub struct MyOracleState {
    pub bump: u8,
    pub btc: OracleData,
    pub eth: OracleData,
    pub sol: OracleData,
    pub usdt: OracleData,
    pub usdc: OracleData,
    pub doge: OracleData,
    pub near: OracleData,
}
