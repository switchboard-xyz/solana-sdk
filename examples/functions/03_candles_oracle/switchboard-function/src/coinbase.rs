use crate::*;

pub use switchboard_utils::reqwest;
use serde::Deserialize;

#[derive(Deserialize, Default, Clone, Debug)]
pub struct CoinbaseCandle(
    i64,   // open time
    f64,   // Low price
    f64,   // High price
    f64,   // Open price
    f64,   // Close price
    f64,   // Volume
);

impl Into<NormalizedCandle> for CoinbaseCandle {
    fn into(self) -> NormalizedCandle {
        NormalizedCandle {
            open_time: self.0,
            low_price: Decimal::try_from(self.1).unwrap(),
            high_price: Decimal::try_from(self.2).unwrap(),
            open_price: Decimal::try_from(self.3).unwrap(),
            close_price: Decimal::try_from(self.4).unwrap(),
            volume: Decimal::try_from(self.5).unwrap(),
        }
    }
}