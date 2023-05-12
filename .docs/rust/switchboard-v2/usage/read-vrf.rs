use switchboard_v2::VrfAccountData;

// deserialize the account info
let vrf = ctx.accounts.vrf.load()?;
// OR
let vrf = VrfAccountData::new(vrf_account_info)?;

// read the result
let result_buffer = vrf.get_result()?;
let value: &[u128] = bytemuck::cast_slice(&result_buffer[..]);
let result = value[0] % 256000 as u128;