use crate::*;
use std::str::FromStr;

pub struct ContainerParams {
    pub program_id: Pubkey,
    pub raffle_key: Pubkey,
    pub round_close_slot: u64,
}

impl ContainerParams {
    pub fn decode(container_params: &[u8]) -> Result<Self, SbFunctionError> {
        let params = String::from_utf8(container_params.to_vec()).unwrap();

        let mut program_id: Pubkey = Pubkey::default();
        let mut raffle_key: Pubkey = Pubkey::default();
        let mut round_close_slot: u64 = 0;

        for env_pair in params.split(',') {
            let pair: Vec<&str> = env_pair.splitn(2, '=').collect();
            if pair.len() == 2 {
                match pair[0] {
                    "PID" => {
                        program_id = Pubkey::from_str(pair[1]).unwrap();
                    }
                    "RAFFLE" => {
                        raffle_key = Pubkey::from_str(pair[1]).unwrap();
                    }
                    "ROUND_CLOSE_SLOT" => {
                        round_close_slot = pair[1].parse::<u64>().unwrap();
                    }
                    _ => {}
                }
            }
        }

        if program_id == Pubkey::default() {
            return Err(SbFunctionError::FunctionError(100));
        }

        if raffle_key == Pubkey::default() {
            return Err(SbFunctionError::FunctionError(101));
        }

        if round_close_slot == 0 {
            return Err(SbFunctionError::FunctionError(102));
        }

        Ok(Self {
            program_id,
            raffle_key,
            round_close_slot,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_params_decode() {
        let request_params_string = format!(
            "PID={},RAFFLE={},ROUND_CLOSE_SLOT={}",
            anchor_spl::token::ID,
            anchor_spl::token::ID,
            8
        );
        let request_params_bytes = request_params_string.into_bytes();

        let params = ContainerParams::decode(&request_params_bytes).unwrap();

        assert_eq!(params.program_id, anchor_spl::token::ID);
        assert_eq!(params.raffle_key, anchor_spl::token::ID);
        assert_eq!(params.round_close_slot, 8);
    }
}
