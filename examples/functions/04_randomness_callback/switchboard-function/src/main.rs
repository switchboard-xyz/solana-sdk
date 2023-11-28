use std::str::FromStr;

pub use switchboard_solana::get_ixn_discriminator;
pub use switchboard_solana::prelude::*;

mod params;
pub use params::*;

#[switchboard_function]
pub async fn randomness_callback(
    runner: FunctionRunner,
    params: Vec<u8>,
) -> Result<Vec<Instruction>, SbFunctionError> {
    // parse and validate user provided request params
    let params = ContainerParams::decode(&params).unwrap();

    // Determine the final result
    let mut bytes: [u8; 1] = [0u8; 1];
    Gramine::read_rand(&mut bytes).expect("gramine failed to generate randomness");
    let result = (bytes[0] % params.max_guess) + 1;

    // derive pubkeys to build ixn
    let (house_pubkey, _house_bump) =
        Pubkey::find_program_address(&[b"CUSTOMRANDOMNESS"], &params.program_id);
    let mint = anchor_spl::token::spl_token::native_mint::ID;
    let house_escrow =
        anchor_spl::associated_token::get_associated_token_address(&house_pubkey, &mint);
    let user_escrow =
        anchor_spl::associated_token::get_associated_token_address(&params.user_key, &mint);

    // build ixn data from discriminator and result
    let mut ixn_data = get_ixn_discriminator("user_settle").to_vec();
    ixn_data.push(result);

    let user_settle_ixn = Instruction {
        program_id: params.program_id,
        data: ixn_data,
        accounts: vec![
            AccountMeta::new_readonly(house_pubkey, false),
            AccountMeta::new(params.user_key, false),
            AccountMeta::new_readonly(runner.function, false),
            AccountMeta::new_readonly(runner.function_request_key.unwrap(), false),
            AccountMeta::new_readonly(runner.signer, true),
            AccountMeta::new_readonly(anchor_spl::token::ID, false),
            AccountMeta::new_readonly(mint, false),
            AccountMeta::new(house_escrow, false),
            AccountMeta::new(user_escrow, false),
        ],
    };

    // Then, write your own Rust logic and build a Vec of instructions.
    // Should  be under 700 bytes after serialization
    let ixs: Vec<solana_program::instruction::Instruction> = vec![user_settle_ixn];

    Ok(ixs)
}
