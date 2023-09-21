pub use switchboard_solana::prelude::*;

pub mod binance;
pub use binance::*;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub use basic_oracle::{
    self, OracleData, OracleDataWithTradingSymbol, RefreshPrices, RefreshPricesParams,
    SwitchboardDecimal, TradingSymbol, ID as PROGRAM_ID,
};

pub async fn perform(runner: &FunctionRunner) -> Result<()> {

    msg!("function runner loaded!");

    // Then, write your own Rust logic and build a Vec of instructions.
    // Should  be under 700 bytes after serialization
    let binance = Binance::fetch().await?;
    let ixs: Vec<Instruction> = binance.to_ixns(&runner);

    msg!("sending transaction");

    // Finally, emit the signed quote and partially signed transaction to the functionRunner oracle
    // The functionRunner oracle will use the last outputted word to stdout as the serialized result. This is what gets executed on-chain.
    runner.emit(ixs).await?;
    Ok(())
}

#[tokio::main(worker_threads = 12)]
async fn main() -> Result<()> {
    // First, initialize the runner instance with a freshly generated Gramine keypair
    let runner = FunctionRunner::from_env(None)?;
    if runner.assert_mr_enclave().is_err() {
        runner.emit_error(199).await?;
    }

    let res = perform(&runner).await;
    if let Some(e) = res.err() {
        runner.emit_error(1).await?;
    }
    Ok(())
}
