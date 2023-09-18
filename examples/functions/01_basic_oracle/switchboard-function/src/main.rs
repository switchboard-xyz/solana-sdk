pub use switchboard_solana::prelude::*;

pub mod binance;
pub use binance::*;

pub use basic_oracle::{
    self, OracleData, OracleDataWithTradingSymbol, RefreshPrices, RefreshPricesParams,
    SwitchboardDecimal, TradingSymbol, ID as PROGRAM_ID,
};

#[tokio::main(worker_threads = 12)]
async fn main() {
    // First, initialize the runner instance with a freshly generated Gramine keypair
    let runner: FunctionRunner = FunctionRunner::from_env(None).unwrap();

    msg!("function runner loaded!");

    // Then, write your own Rust logic and build a Vec of instructions.
    // Should  be under 700 bytes after serialization
    let binance = Binance::fetch().await.unwrap();
    let ixs: Vec<Instruction> = binance.to_ixns(&runner);

    msg!("sending transaction");

    // Finally, emit the signed quote and partially signed transaction to the functionRunner oracle
    // The functionRunner oracle will use the last outputted word to stdout as the serialized result. This is what gets executed on-chain.
    runner.emit(ixs).await.unwrap();
}
