// Note: Binance API requires a non-US IP address

use crate::*;

pub use switchboard_utils::reqwest;

use serde::Deserialize;

const ONE: i128 = 1000000000;

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

#[derive(Clone, Debug)]
pub struct IndexData {
    pub symbol: String,
    pub hr: Ticker,
    pub d: Ticker,
}
impl Into<OracleData> for IndexData {
    fn into(self) -> OracleData {
        let oracle_timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs()
            .try_into()
            .unwrap_or_default();

        let price = parse_string_value(self.hr.lastPrice.as_str());

        let volume_1hr = parse_string_value(self.hr.volume.as_str());
        let volume_24hr = parse_string_value(self.d.volume.as_str());

        let twap_1hr = parse_string_value(self.hr.weightedAvgPrice.as_str());
        let twap_24hr = parse_string_value(self.d.weightedAvgPrice.as_str());

        OracleData {
            oracle_timestamp,
            price,
            volume_1hr,
            volume_24hr,
            twap_1hr,
            twap_24hr,
        }
    }
}

pub struct Binance {
    btc_usdt: IndexData,
    usdc_usdt: IndexData,
    eth_usdt: IndexData,
    sol_usdt: IndexData,
    doge_usdt: IndexData,
}

impl Binance {
    // Fetch data from the Binance API
    pub async fn fetch() -> std::result::Result<Binance, SwitchboardClientError> {
        let symbols = ["BTCUSDT", "USDCUSDT", "ETHUSDT", "SOLUSDT", "DOGEUSDT"];

        let tickers_1hr = reqwest::get(format!(
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

        let tickers_1d = reqwest::get(format!(
            "https://api.binance.com/api/v3/ticker?symbols=[{}]&windowSize=1d",
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

        assert!(
            tickers_1d.len() == symbols.len(),
            "ticker (1d) length mismatch"
        );
        assert!(
            tickers_1hr.len() == symbols.len(),
            "ticker (1hr) length mismatch"
        );

        let data: Vec<IndexData> = symbols
            .iter()
            .enumerate()
            .map(|(i, s)| IndexData {
                symbol: s.to_string(),
                d: tickers_1d.get(i).unwrap().clone(),
                hr: tickers_1hr.get(i).unwrap().clone(),
            })
            .collect();

        Ok(Binance {
            btc_usdt: data.get(0).unwrap().clone(),
            usdc_usdt: data.get(1).unwrap().clone(),
            eth_usdt: data.get(2).unwrap().clone(),
            sol_usdt: data.get(3).unwrap().clone(),
            doge_usdt: data.get(4).unwrap().clone(),
        })
    }

    pub fn to_ixns(&self, runner: &FunctionRunner) -> Vec<Instruction> {
        let rows: Vec<OracleDataWithTradingSymbol> = vec![
            OracleDataWithTradingSymbol {
                symbol: TradingSymbol::Btc,
                data: self.btc_usdt.clone().into(),
            },
            OracleDataWithTradingSymbol {
                symbol: TradingSymbol::Usc,
                data: self.usdc_usdt.clone().into(),
            },
            OracleDataWithTradingSymbol {
                symbol: TradingSymbol::Eth,
                data: self.eth_usdt.clone().into(),
            },
            OracleDataWithTradingSymbol {
                symbol: TradingSymbol::Sol,
                data: self.sol_usdt.clone().into(),
            },
            OracleDataWithTradingSymbol {
                symbol: TradingSymbol::Doge,
                data: self.doge_usdt.clone().into(),
            },
        ];

        let params = RefreshPricesParams { rows };

        let (program_state_pubkey, _state_bump) =
            Pubkey::find_program_address(&[b"BASICORACLE"], &PROGRAM_ID);

        let (oracle_pubkey, _oracle_bump) =
            Pubkey::find_program_address(&[b"ORACLE_V1_SEED"], &PROGRAM_ID);

        let ixn = Instruction {
            program_id: basic_oracle::ID,
            accounts: vec![
                AccountMeta {
                    pubkey: program_state_pubkey,
                    is_signer: false,
                    is_writable: false,
                },
                AccountMeta {
                    pubkey: oracle_pubkey,
                    is_signer: false,
                    is_writable: true,
                },
                AccountMeta {
                    pubkey: runner.function,
                    is_signer: false,
                    is_writable: false,
                },
                AccountMeta {
                    pubkey: runner.quote,
                    is_signer: false,
                    is_writable: false,
                },
                AccountMeta {
                    pubkey: runner.signer,
                    is_signer: true,
                    is_writable: false,
                },
            ],
            data: params.try_to_vec().unwrap_or_default(),
        };

        vec![ixn]
    }
}

// Convert a string to an i128 scaled to 9 decimal places
pub fn parse_string_value(value: &str) -> i128 {
    let f64_value = value.parse::<f64>().unwrap();
    let sb_decimal = SwitchboardDecimal::from_f64(f64_value);
    sb_decimal.scale_to(9)
}
