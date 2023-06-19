pub use switchboard_solana::prelude::*;

pub mod binance;
pub use binance::*;

pub mod instruction;
pub use instruction::*;

pub use basic_oracle::{
    self, OracleData, RefreshPrices, RefreshPricesParams, SwitchboardDecimal, ID as PROGRAM_ID,
};

#[tokio::main(worker_threads = 12)]
async fn main() {
    // First, initialize the runner instance with a freshly generated Gramine keypair
    let runner = FunctionRunner::new_from_cluster(Cluster::Devnet, None).unwrap();

    // Then, write your own Rust logic and build a Vec of instructions.
    // Should  be under 700 bytes after serialization
    let tickers = BinanceTickers::fetch().await.unwrap();

    let ixs: Vec<solana_program::instruction::Instruction> = symbols
        .iter()
        .enumerate()
        .map(|(i, s)| instruction::build(&runner, s, tickers.get(i).unwrap(), &state_pubkey))
        .collect();

    // Finally, emit the signed quote and partially signed transaction to the functionRunner oracle
    // The functionRunner oracle will use the last outputted word to stdout as the serialized result. This is what gets executed on-chain.
    runner.emit(ixs).await.unwrap();
}
