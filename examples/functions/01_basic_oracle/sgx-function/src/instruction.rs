use crate::*;

use crate::binance::Ticker;

pub use switchboard_solana::prelude::*;

pub fn build(
    runner: &FunctionRunner,
    symbol_str: &str,
    ticker: &Ticker,
    state_pubkey: &Pubkey,
) -> solana_program::instruction::Instruction {
    let symbol = string_to_bytes(symbol_str);

    let (program_state_pubkey, _state_bump) =
        Pubkey::find_program_address(&[b"BASICORACLE"], &PROGRAM_ID);

    let (oracle_pubkey, _oracle_bump) =
        Pubkey::find_program_address(&[b"ORACLE_V1_SEED"], &PROGRAM_ID);

    let price = ticker.lastPrice.parse::<f64>().unwrap();
    let volume = ticker.volume.parse::<f64>().unwrap();

    Instruction {
        program_id: basic_oracle::ID,
        accounts: vec![
            AccountMeta {
                pubkey: *state_pubkey,
                is_signer: false,
                is_writable: true,
            },
            AccountMeta {
                pubkey: oracle_pubkey,
                is_signer: false,
                is_writable: false,
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
            AccountMeta {
                pubkey: runner.payer,
                is_signer: true,
                is_writable: false,
            },
            AccountMeta {
                pubkey: solana_program::system_program::ID,
                is_signer: false,
                is_writable: false,
            },
            AccountMeta {
                pubkey: solana_program::sysvar::rent::ID,
                is_signer: false,
                is_writable: false,
            },
        ],
        data: PushDataParams {
            symbol,
            price,
            volume,
            oracle_timestamp: unix_timestamp(),
        }
        .try_to_vec()
        .unwrap_or_default(),
    }
}

pub fn string_to_bytes(s: &str) -> [u8; 32] {
    let mut array = [0; 32];
    let bytes = s.as_bytes();

    for (&x, p) in bytes.iter().zip(array.iter_mut()) {
        *p = x;
    }

    if bytes.len() > 32 {
        eprintln!("Warning: string was longer than 32 bytes, it has been truncated");
    }

    array
}
