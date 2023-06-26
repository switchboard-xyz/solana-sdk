use crate::*;
use bytemuck::{Pod, Zeroable};

#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum TradingSymbol {
    #[default]
    Unknown = 0,
    BTC = 1,
    USDT,
    USDC,
    ETH,
    SOL,
    DOGE,
}

unsafe impl Pod for TradingSymbol {}
unsafe impl Zeroable for TradingSymbol {}

impl From<TradingSymbol> for u32 {
    fn from(value: TradingSymbol) -> Self {
        match value {
            TradingSymbol::BTC => 1,
            TradingSymbol::USDT => 2,
            TradingSymbol::USDC => 3,
            TradingSymbol::ETH => 4,
            TradingSymbol::SOL => 5,
            TradingSymbol::DOGE => 6,
            _ => 0,
        }
    }
}
impl From<u32> for TradingSymbol {
    fn from(value: u32) -> Self {
        match value {
            1 => TradingSymbol::BTC,
            2 => TradingSymbol::USDT,
            3 => TradingSymbol::USDC,
            4 => TradingSymbol::ETH,
            5 => TradingSymbol::SOL,
            6 => TradingSymbol::DOGE,
            _ => TradingSymbol::default(),
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

#[derive(Copy, Clone, Default, AnchorSerialize, AnchorDeserialize)]
pub struct OracleData {
    pub oracle_timestamp: i64,
    pub price: i128,
    pub volume_1hr: i128,
    pub volume_24hr: i128,
    pub twap_1hr: i128,
    pub twap_24hr: i128,
    // pub reserved: [u8; 12], // makes 100 bytes exactly
}

#[derive(Copy, Clone, Default, AnchorSerialize, AnchorDeserialize)]
pub struct OracleDataWithTradingSymbol {
    pub symbol: TradingSymbol,
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
    // can always re-allocate to add more
    // pub reserved: [u8; 2400],
}
impl Default for MyOracleState {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
