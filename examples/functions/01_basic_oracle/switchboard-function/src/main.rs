pub use switchboard_solana::switchboard_function;

pub mod binance;
pub use binance::*;

pub use basic_oracle::{
    self, OracleData, OracleDataWithTradingSymbol, RefreshPrices, RefreshPricesParams,
    SwitchboardDecimal, TradingSymbol, ID as PROGRAM_ID,
};

#[switchboard_function]
pub async fn binance_oracle_function(
    runner: FunctionRunner,
    _params: Vec<u8>,
) -> Result<Vec<Instruction>, SbFunctionError> {
    msg!("function runner loaded!");

    // Then, write your own Rust logic and build a Vec of instructions.
    // Should  be under 700 bytes after serialization
    let binance = Binance::fetch().await?;
    let ixs: Vec<Instruction> = binance.to_ixns(&runner);

    // Emit the instructions for the oracle to validate and relay on-chain
    Ok(ixs)
}
