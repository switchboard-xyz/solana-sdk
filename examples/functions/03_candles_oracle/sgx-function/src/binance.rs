// Note: Binance API requires a non-US IP address

use crate::*;

pub use switchboard_utils::reqwest;
use serde::Deserialize;

#[derive(Deserialize, Default, Clone, Debug)]
pub struct BinanceCandle(
    i64,      // Kline open time
    String,   // Open price
    String,   // High price
    String,   // Low price
    String,   // Close price
    String,   // Volume
    i64,      // Kline Close time
    String,   // Quote asset volume
    i64,      // Number of trades
    String,   // Taker buy base asset volume
    String,   // Taker buy quote asset volume
    String,   // - Unused -
);

impl Into<NormalizedCandle> for BinanceCandle {
    fn into(self) -> NormalizedCandle {
        NormalizedCandle {
            open_time: self.0,
            open_price: Decimal::try_from(self.1.as_str()).unwrap(),
            high_price: Decimal::try_from(self.2.as_str()).unwrap(),
            low_price: Decimal::try_from(self.3.as_str()).unwrap(),
            close_price: Decimal::try_from(self.4.as_str()).unwrap(),
            volume: Decimal::try_from(self.5.as_str()).unwrap(),
        }
    }
}