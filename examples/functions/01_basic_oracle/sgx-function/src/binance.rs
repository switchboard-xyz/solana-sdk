// Note: Binance API requires a non-US IP address

use crate::*;

pub use switchboard_utils::reqwest;

use serde::Deserialize;

#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct Ticker {
    pub symbol: String, // BTCUSDT
    pub priceChange: String,
    pub priceChangePercent: String,
    pub weightedAvgPrice: String,
    pub openPrice: String,
    pub highPrice: String,
    pub lowPrice: String,
    pub lastPrice: String,
    pub volume: String,
    pub quoteVolume: String,
    pub openTime: u64,  // ms
    pub closeTime: u64, // ms
}

impl Into<OracleData> for Ticker {
    fn into(self) -> OracleData {
        let oracle_timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs()
            .try_into()
            .unwrap_or_default();
        let price = parse_string_value(self.lastPrice.as_str());
        let volume = parse_string_value(self.volume.as_str());
        let twap_24hr = parse_string_value(self.weightedAvgPrice.as_str());

        OracleData {
            oracle_timestamp,
            price,
            volume,
            twap_24hr,
        }
    }
}

// impl TryInto<OracleData> for Ticker {
//     type Error = SwitchboardClientError;
//     fn try_into(self) -> std::result::Result<OracleData, SwitchboardClientError> {
//         let oracle_timestamp = std::time::SystemTime::now()
//             .duration_since(std::time::UNIX_EPOCH)
//             .unwrap_or_default()
//             .as_secs()
//             .try_into()
//             .unwrap_or_default();
//         let price = parse_string_value(self.lastPrice.as_str());
//         let volume = parse_string_value(self.volume.as_str());
//         let twap_24hr = parse_string_value(self.weightedAvgPrice.as_str());

//         Ok(OracleData {
//             oracle_timestamp,
//             price,
//             volume,
//             twap_24hr,
//         })
//     }
// }

#[derive(Clone, Debug)]
pub struct BinanceTickers {
    pub btc: Option<OracleData>,
    pub eth: Option<OracleData>,
}

impl BinanceTickers {
    pub async fn fetch() -> std::result::Result<Self, SwitchboardClientError> {
        let symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDC"];
        let tickers = reqwest::get(format!(
            "https://api.binance.com/api/v3/ticker?symbols=[{}]&windowSize=1h",
            symbols
                .iter()
                .map(|x| format!("\"{}\"", x))
                .collect::<Vec<String>>()
                .join(",")
        ))
        .await
        .unwrap()
        .json::<Vec<Ticker>>()
        .await
        .unwrap();

        let btc_ticker = tickers.get(0).unwrap().clone();
        let eth_ticker = tickers.get(1).unwrap().clone();

        Ok(BinanceTickers {
            btc: Some(btc_ticker.into()),
            eth: Some(eth_ticker.into()),
        })
    }
}

pub fn parse_string_value(value: &str) -> i128 {
    let f64_value = value.parse::<f64>().unwrap();
    let sb_decimal = SwitchboardDecimal::from_f64(f64_value);
    sb_decimal.scale_to(9)
}
