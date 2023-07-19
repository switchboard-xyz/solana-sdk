use crate::*;

pub use switchboard_utils::reqwest;
use serde::Deserialize;

#[derive(Deserialize, Default, Clone, Debug)]
pub struct BitfinexCandle(
    i64,      // open time
    String,   // Open price
    String,   // High price
    String,   // Low price
    String,   // Close price
    String,   // Volume
);

impl Into<NormalizedCandle> for BitfinexCandle {
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