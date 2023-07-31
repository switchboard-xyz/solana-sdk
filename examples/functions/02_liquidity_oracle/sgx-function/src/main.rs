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

#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct NormalizedOrdersRow {
    price: Decimal,
    amount: Decimal,
}
#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct NormalizedBook {
    pub bids: Vec<NormalizedOrdersRow>,
    pub asks: Vec<NormalizedOrdersRow>,
    pub price: Decimal,
}

#[tokio::main(worker_threads = 12)]
async fn main() {
    // First, initialize the runner instance with a freshly generated Gramine keypair
    let _runner: FunctionRunner = FunctionRunner::new_from_cluster(Cluster::Devnet, None).unwrap();

    let _binance_book: NormalizedBook =
        reqwest::get("https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=1000")
            .await
            .unwrap()
            .json::<BinanceBook>()
            .await
            .unwrap()
            .into();

    let _coinbase_book: NormalizedBook =
        reqwest::get("https://api.pro.coinbase.com/products/BTC-USD/book?level=2")
            .await
            .unwrap()
            .json::<CoinbaseBook>()
            .await
            .unwrap()
            .into();

    let _kraken_book: NormalizedBook =
        reqwest::get("https://api.kraken.com/0/public/Depth?pair=BTCUSD")
            .await
            .unwrap()
            .json::<KrakenBook>()
            .await
            .unwrap()
            .into();

    let _bitfinex_book: NormalizedBook = reqwest::get("https://api.bitfinex.com/v1/book/btcusd")
        .await
        .unwrap()
        .json::<BitfinexBook>()
        .await
        .unwrap()
        .into();

    // let ixs: Vec<Instruction> = vec![];
    // // Finally, emit the signed quote and partially signed transaction to the functionRunner oracle
    // // The functionRunner oracle will use the last outputted word to stdout as the serialized result. This is what gets executed on-chain.
    // runner.emit(ixs).await.unwrap();
}