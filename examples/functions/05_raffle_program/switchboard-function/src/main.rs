pub use switchboard_solana::prelude::*;

pub mod params;
pub use params::*;

#[switchboard_function]
pub async fn raffle_callback(
    runner: FunctionRunner,
    params: Vec<u8>
) -> Result<Vec<Instruction>, SbFunctionError> {
    // parse and validate user provided request params
    let params = ContainerParams::decode(&params).unwrap();

    // Then, write your own Rust logic and build a Vec of instructions.
    // Should  be under 700 bytes after serialization
    let ixs: Vec<solana_program::instruction::Instruction> = vec![];

    Ok(ixs)
}
