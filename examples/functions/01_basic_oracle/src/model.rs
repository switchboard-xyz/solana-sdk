use crate::*;
use bytemuck::{Pod, Zeroable};

#[account(zero_copy(unsafe))]
pub struct MyProgramState {
    pub bump: u8,
    pub authority: Pubkey,
    pub switchboard_function: Pubkey,
    pub switchboard_routine: Pubkey,
}

#[repr(packed)]
#[zero_copy(unsafe)]
pub struct OracleData {
    pub oracle_timestamp: i64,
    pub price: i128,
    pub volume_1hr: i128,
    pub volume_24hr: i128,
    pub twap_1hr: i128,
    pub twap_24hr: i128,
}

#[derive(Copy, Clone, Default, AnchorSerialize, AnchorDeserialize)]
pub struct OracleDataBorsh {
    pub oracle_timestamp: i64,
    pub price: i128,
    pub volume_1hr: i128,
    pub volume_24hr: i128,
    pub twap_1hr: i128,
    pub twap_24hr: i128,
}
impl From<OracleDataBorsh> for OracleData {
    fn from(value: OracleDataBorsh) -> Self {
        Self {
            oracle_timestamp: value.oracle_timestamp,
            price: value.price.clone(),
            volume_1hr: value.volume_1hr.clone(),
            volume_24hr: value.volume_24hr.clone(),
            twap_1hr: value.twap_1hr.clone(),
            twap_24hr: value.twap_24hr.clone(),
        }
    }
}

#[derive(Copy, Clone, Default, AnchorSerialize, AnchorDeserialize)]
pub struct OracleDataWithTradingSymbol {
    pub symbol: TradingSymbol,
    pub data: OracleDataBorsh,
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

#[repr(packed)]
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

impl MyOracleState {
    pub fn save_rows(
        &mut self,
        rows: &Vec<OracleDataWithTradingSymbol>,
    ) -> anchor_lang::Result<()> {
        for row in rows.iter() {
            match row.symbol {
                TradingSymbol::Btc => {
                    msg!("saving BTC price, {}", { row.data.price });
                    self.btc = row.data.into();
                }
                TradingSymbol::Usdc => {
                    msg!("saving USDC price, {}", { row.data.price });
                    self.usdc = row.data.into();
                }
                TradingSymbol::Eth => {
                    msg!("saving ETH price, {}", { row.data.price });
                    self.eth = row.data.into();
                }
                TradingSymbol::Sol => {
                    msg!("saving SOL price, {}", { row.data.price });
                    self.sol = row.data.into();
                }
                TradingSymbol::Doge => {
                    msg!("saving DOGE price, {}", { row.data.price });
                    self.doge = row.data.into();
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

#[repr(u8)]
#[derive(Copy, Clone, Default, Debug, Eq, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum TradingSymbol {
    #[default]
    Unknown = 0,
    Btc = 1,
    Usdc = 2,
    Eth = 3,
    Sol = 4,
    Doge = 5,
}

unsafe impl Pod for TradingSymbol {}
unsafe impl Zeroable for TradingSymbol {}

impl From<TradingSymbol> for u8 {
    fn from(value: TradingSymbol) -> Self {
        match value {
            TradingSymbol::Btc => 1,
            TradingSymbol::Usdc => 2,
            TradingSymbol::Eth => 3,
            TradingSymbol::Sol => 4,
            TradingSymbol::Doge => 5,
            _ => 0,
        }
    }
}
impl From<u8> for TradingSymbol {
    fn from(value: u8) -> Self {
        match value {
            1 => TradingSymbol::Btc,
            2 => TradingSymbol::Usdc,
            3 => TradingSymbol::Eth,
            4 => TradingSymbol::Sol,
            5 => TradingSymbol::Doge,
            _ => TradingSymbol::default(),
        }
    }
}
