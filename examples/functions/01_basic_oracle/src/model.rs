use crate::*;
use bytemuck::{Pod, Zeroable};

#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum Symbols {
    #[default]
    Unknown = 0,
    BTC = 1,
    USDT,
    USDC,
    ETH,
    SOL,
    DOGE,
}

unsafe impl Pod for Symbols {}
unsafe impl Zeroable for Symbols {}

impl From<Symbols> for u32 {
    fn from(value: Symbols) -> Self {
        match value {
            Symbols::BTC => 1,
            Symbols::USDT => 2,
            Symbols::USDC => 3,
            Symbols::ETH => 4,
            Symbols::SOL => 5,
            Symbols::DOGE => 6,
            _ => 0,
        }
    }
}
impl From<u32> for Symbols {
    fn from(value: u32) -> Self {
        match value {
            1 => Symbols::BTC,
            2 => Symbols::USDT,
            3 => Symbols::USDC,
            4 => Symbols::ETH,
            5 => Symbols::SOL,
            6 => Symbols::DOGE,
            _ => Symbols::default(),
        }
    }
}

#[account(zero_copy(unsafe))]
#[derive(Default, Debug, AnchorSerialize)]
pub struct MyProgramState {
    pub bump: u8,
    pub authority: Pubkey,
    pub function: Pubkey,
}

// #[repr(packed)]
#[zero_copy(unsafe)]
#[derive(Default, Debug, AnchorDeserialize, AnchorSerialize)]
pub struct OracleData {
    pub oracle_timestamp: i64,
    pub price: i128,
    pub volume_1hr: i128,
    pub volume_24hr: i128,
    pub twap_1hr: i128,
    pub twap_24hr: i128,
    // pub reserved: [u8; 12], // makes 100 bytes exactly
}

// #[repr(packed)]
#[zero_copy(unsafe)]
#[derive(Default, Debug, AnchorDeserialize, AnchorSerialize)]
pub struct OracleDataWithSymbol {
    pub symbol: Symbols,
    pub data: OracleData,
}

impl OracleData {
    pub fn get_fair_price(&self) -> anchor_lang::Result<f64> {
        // Check the price was updated in the last 10 seconds

        // Do some logic here based on the twap

        let price: f64 = SwitchboardDecimal {
            mantissa: self.price,
            scale: 9,
        }
        .try_into()?;

        Ok(price)
    }
}

// #[repr(packed)]
#[account(zero_copy(unsafe))]
pub struct MyOracleState {
    pub bump: u8,
    pub btc: OracleData,
    pub eth: OracleData,
    pub sol: OracleData,
    pub usdt: OracleData,
    pub usdc: OracleData,
    pub doge: OracleData,
    // space for 24 more slots
    // can always re-allocate to add more
    // pub reserved: [u8; 2400],
}
impl Default for MyOracleState {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
