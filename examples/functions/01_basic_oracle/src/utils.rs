pub use crate::*;

pub fn parse_mr_enclaves(enclaves: &Vec<[u8; 32]>) -> anchor_lang::Result<[[u8; 32]; 32]> {
    // enclaves
    //     .clone()
    //     .try_into()
    //     .map_err(|_| error!(BasicOracleError::ArrayOverflow))
    if enclaves.len() > 32 {
        return Err(error!(BasicOracleError::ArrayOverflow));
    }
    let mut result: [[u8; 32]; 32] = [[0; 32]; 32];

    for (i, enclave) in enclaves.iter().enumerate() {
        result[i] = *enclave;
    }

    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_mr_enclaves_success() {
        let enclaves: Vec<[u8; 32]> = vec![[1; 32]; 10];
        let result = parse_mr_enclaves(&enclaves).unwrap();

        // Check first 10 elements are [1; 32]
        for i in 0..10 {
            assert_eq!(result[i], [1; 32]);
        }

        // Check the remaining elements are [0; 32] (default)
        for i in 10..32 {
            assert_eq!(result[i], [0; 32]);
        }
    }

    // #[test]
    // fn test_parse_mr_enclaves_overflow() {
    //     let enclaves: Vec<[u8; 32]> = vec![[1; 32]; 33];
    //     match parse_mr_enclaves(&enclaves) {
    //         Err(BasicOracleError::ArrayOverflow) => {} // test passes
    //         _ => panic!("Unexpected result"),          // test fails
    //     };
    // }
}
