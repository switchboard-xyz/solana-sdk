pub mod coinbase;
pub use coinbase::*;
pub mod binance;
pub use binance::*;
pub mod bitfinex;
pub use bitfinex::*;
pub mod kraken;
pub use kraken::*;
pub use switchboard_solana::prelude::*;

use rust_decimal::Decimal;
use serde::Deserialize;
use std::collections::HashMap;
pub use switchboard_utils::reqwest;

pub use basic_oracle::{
    self, OracleData, OracleDataWithTradingSymbol, RefreshPrices, RefreshPricesParams,
    SwitchboardDecimal, TradingSymbol, ID as PROGRAM_ID,
};

pub fn ix_discriminator(name: &str) -> [u8; 8] {
    let preimage = format!("global:{}", name);
    let mut sighash = [0u8; 8];
    sighash.copy_from_slice(
        &anchor_lang::solana_program::hash::hash(preimage.as_bytes()).to_bytes()[..8],
    );
    sighash
}

#[derive(Deserialize, Default, Clone, Debug)]
pub struct NormalizedCandle {
    pub open_time: i64,
    pub open_price: Decimal,
    pub high_price: Decimal,
    pub low_price: Decimal,
    pub close_price: Decimal,
    pub volume: Decimal,
}

#[tokio::main(worker_threads = 12)]
async fn main() {
    // First, initialize the runner instance with a freshly generated Gramine keypair
    let _runner: FunctionRunner = FunctionRunner::new_from_cluster(Cluster::Devnet, None).unwrap();

    let _binance_candles: Vec<NormalizedCandle> =
        reqwest::get("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1")
            .await
            .unwrap()
            .json::<Vec<BinanceCandle>>()
            .await
            .unwrap()
            .iter()
            .map(|c| c.clone().into())
            .collect();

    let _coinbase_candles: Vec<NormalizedCandle> =
        reqwest::get("https://api.pro.coinbase.com/products/BTC-USD/candles?granularity=60")
            .await
            .unwrap()
            .json::<Vec<CoinbaseCandle>>()
            .await
            .unwrap()
            .iter()
            .map(|c| c.clone().into())
            .collect();

    let _kraken_candle: Vec<NormalizedCandle> =
        reqwest::get("https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=1")
            .await
            .unwrap()
            .json::<KrakenCandleResponse>()
            .await
            .unwrap()
            .into();

    let _bitfinex_candle: Vec<NormalizedCandle> = reqwest::get("https://api-pub.bitfinex.com/v2/candles/trade:1m:tBTCUSD/hist?limit=1")
        .await
        .unwrap()
        .json::<Vec<BitfinexCandle>>()
        .await
        .unwrap()
        .iter()
        .map(|c| c.clone().into())
        .collect();

    // let ixs: Vec<Instruction> = vec![];
    // // Finally, emit the signed quote and partially signed transaction to the functionRunner oracle
    // // The functionRunner oracle will use the last outputted word to stdout as the serialized result. This is what gets executed on-chain.
    // runner.emit(ixs).await.unwrap();
}