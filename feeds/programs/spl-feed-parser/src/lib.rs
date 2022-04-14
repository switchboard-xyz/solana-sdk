pub use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};
use std::convert::TryInto;
pub use switchboard_aggregator::AggregatorAccountData;

entrypoint!(process_instruction);

fn process_instruction<'a>(
    _program_id: &'a Pubkey,
    accounts: &'a [AccountInfo],
    _instruction_data: &'a [u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let aggregator = next_account_info(accounts_iter)?;

    let val: f64 = AggregatorAccountData::new(aggregator)?
        .get_result()?
        .try_into()?;

    msg!("Current feed result is {}!", val);
    Ok(())
}
