use crate::*;
use bytemuck::{Pod, Zeroable};

#[repr(u8)]
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum TradingSymbol {
    #[default]
    Unknown = 0,
    BTC = 1,
    USDC = 2,
    ETH = 3,
    SOL = 4,
    DOGE = 5,
}

unsafe impl Pod for TradingSymbol {}
unsafe impl Zeroable for TradingSymbol {}

impl From<TradingSymbol> for u8 {
    fn from(value: TradingSymbol) -> Self {
        match value {
            TradingSymbol::BTC => 1,
            TradingSymbol::USDC => 2,
            TradingSymbol::ETH => 3,
            TradingSymbol::SOL => 4,
            TradingSymbol::DOGE => 5,
            _ => 0,
        }
    }
}
impl From<u8> for TradingSymbol {
    fn from(value: u8) -> Self {
        match value {
            1 => TradingSymbol::BTC,
            2 => TradingSymbol::USDC,
            3 => TradingSymbol::ETH,
            4 => TradingSymbol::SOL,
            5 => TradingSymbol::DOGE,
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
    pub usdc: OracleData,
    pub eth: OracleData,
    pub sol: OracleData,
    pub doge: OracleData,
    // can always re-allocate to add more
    // pub reserved: [u8; 2400],
}
impl Default for MyOracleState {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
impl MyOracleState {
    pub fn save_rows(
        &mut self,
        rows: &Vec<OracleDataWithTradingSymbol>,
    ) -> anchor_lang::Result<()> {
        for row in rows.iter() {
            match row.symbol {
                TradingSymbol::BTC => {
                    self.btc = row.data;
                }
                TradingSymbol::USDC => {
                    self.usdc = row.data;
                }
                TradingSymbol::ETH => {
                    self.eth = row.data;
                }
                TradingSymbol::SOL => {
                    self.sol = row.data;
                }
                TradingSymbol::DOGE => {
                    self.doge = row.data;
                }
                _ => {
                    msg!("no trading symbol found for {:?}", row.symbol);
                    // TODO: emit an event so we can detect and fix
                }
            }
        }

        Ok(())
    }
}
