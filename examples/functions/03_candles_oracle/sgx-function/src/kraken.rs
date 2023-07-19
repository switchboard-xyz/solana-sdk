use crate::*;

pub use switchboard_utils::reqwest;
use serde::Deserialize;

#[derive(Deserialize, Default, Clone, Debug)]
pub struct KrakenCandle(
    String,   // Open time
    String,   // Low price
    String,   // High price
    String,   // Open price
    String,   // Close price
    String,   // VWAP // TODO: surface this
    String,   // Volume
    String,   // Count
);

#[derive(Deserialize, Default, Clone, Debug)]
pub struct KrakenCandleResponse {
    pub result: HashMap<String, Vec<KrakenCandle>>,
}

impl Into<Vec<NormalizedCandle>> for KrakenCandleResponse {
    fn into(self) -> Vec<NormalizedCandle> {
        let candles = self.result.values().next().unwrap();
        let mut res = vec![];
        for candle in candles {
            res.push(NormalizedCandle {
                open_time: candle.0.parse().unwrap(),
                low_price: Decimal::try_from(candle.1.as_str()).unwrap(),
                high_price: Decimal::try_from(candle.2.as_str()).unwrap(),
                open_price: Decimal::try_from(candle.3.as_str()).unwrap(),
                close_price: Decimal::try_from(candle.4.as_str()).unwrap(),
                volume: Decimal::try_from(candle.5.as_str()).unwrap(),
            });
        }
        res
    }
}