<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/core-sdk/raw/main/website/static/img/icons/switchboard/avatar.png)

# switchboard-solana

> A Rust library to interact with Switchboard accounts on Solana.

[![Crates.io Badge](https://img.shields.io/crates/v/switchboard-solana?label=switchboard-solana&logo=rust)](https://crates.io/crates/switchboard-solana)

[![Discord Badge](https://img.shields.io/discord/841525135311634443?color=blueviolet&logo=discord&logoColor=white)](https://discord.gg/switchboardxyz)

[![Twitter Badge](https://img.shields.io/twitter/follow/switchboardxyz?label=Follow+Switchboard)](https://twitter.com/switchboardxyz)

  <h4>
    <strong>Typedocs: </strong><a href="https://docs.rs/switchboard-solana">docs.rs/switchboard-solana</a>
  </h4>
  <h4>
    <strong>Solana SDK: </strong><a href="https://github.com/switchboard-xyz/solana-sdk">github.com/switchboard-xyz/solana-sdk</a>
  </h4>
  <h4>
    <strong>Switchboard Documentation: </strong><a href="https://docs.switchboard.xyz">docs.switchboard.xyz</a>
  </h4>
</div>

## Install

Run the following Cargo command in your project directory:

```bash
cargo add switchboard-solana
```

Or add the following line to your Cargo.toml:

```toml
[dependencies]
switchboard-solana = "0.29"
```

**NOTE**: The minor version corresponds to the anchor-lang dependency. Version `0.29.*` of this crate uses anchor-lang `0.29.0` while version `0.27.*` of this crate uses anchor-lang `0.27.0`. We currently support Anchor 29, 28, and 27.

## Accounts

This SDK provides the following account definitions for the Oracle Program:

- [OracleQueue](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/queue/struct.OracleQueueAccountData.html)
- [Crank](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/crank/struct.CrankAccountData.html)
- [Oracle](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/oracle/struct.OracleAccountData.html)
- [Permission](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/permission/struct.PermissionAccountData.html)
- [Aggregator](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/aggregator/struct.AggregatorAccountData.html)
- [Job](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/job/struct.JobAccountData.html)
- [Lease](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/lease/struct.LeaseAccountData.html)
- [Vrf](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/vrf/struct.VrfAccountData.html)
- [VrfLite](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/vrf_lite/struct.VrfLiteAccountData.html)
- [VrfPool](https://docs.rs/switchboard-solana/latest/switchboard_solana/oracle_program/accounts/vrf_pool/struct.VrfPoolAccountData.html)

This SDK provides the following account definitions for the Attestation Program:

- [AttestationQueue](https://docs.rs/switchboard-solana/latest/switchboard_solana/attestation_program/accounts/attestation_queue/struct.AttestationQueueAccountData.html)
- [Verifier](https://docs.rs/switchboard-solana/latest/switchboard_solana/attestation_program/accounts/verifier/struct.VerifierAccountData.html)
- [AttestationPermission](https://docs.rs/switchboard-solana/latest/switchboard_solana/attestation_program/accounts/attestation_permission/struct.AttestationPermissionAccountData.html)
- [SwitchboardWallet](https://docs.rs/switchboard-solana/latest/switchboard_solana/attestation_program/accounts/switchboard_wallet/struct.SwitchboardWallet.html)
- [Function](https://docs.rs/switchboard-solana/latest/switchboard_solana/attestation_program/accounts/function/struct.FunctionAccountData.html)
- [FunctionRequest](https://docs.rs/switchboard-solana/latest/switchboard_solana/attestation_program/accounts/function_request/struct.FunctionRequestAccountData.html)

## Usage

### Functions

You will need to validate your function's enclave_signer before allowing your program to modify its state.

```rust
use switchboard_solana::FunctionAccountData;

#[derive(Accounts)]
pub struct SaveDataInstruction<'info> {
    // ... your required accounts to modify your program's state

    // We use this to derive and verify the functions enclave state
    #[account(
        constraint =
            function.load()?.validate(
              &enclave_signer.to_account_info()
            )?
    )]
    pub function: AccountLoader<'info, FunctionAccountData>,
    pub enclave_signer: Signer<'info>,
}
```

### Aggregator

#### Read Latest Result

```rust
use anchor_lang::solana_program::clock;
use std::convert::TryInto;
use switchboard_solana::{AggregatorAccountData, SwitchboardDecimal, SWITCHBOARD_PROGRAM_ID};

// check feed owner
let owner = *aggregator.owner;
if owner != SWITCHBOARD_PROGRAM_ID {
    return Err(error!(ErrorCode::InvalidSwitchboardAccount));
}

// deserialize account info
let feed = ctx.accounts.aggregator.load()?;
// OR
let feed = AggregatorAccountData::new(feed_account_info)?;

// get result
let decimal: f64 = feed.get_result()?.try_into()?;

// check if feed has been updated in the last 5 minutes
feed.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)?;

// check if feed exceeds a confidence interval of +/i $0.80
feed.check_confidence_interval(SwitchboardDecimal::from_f64(0.80))?;
```

#### Read Aggregator History

**_Note: The Aggregator must have a history buffer initialized before using_**

```rust
use switchboard_solana::AggregatorHistoryBuffer;
use std::convert::TryInto;

let history_buffer = AggregatorHistoryBuffer::new(history_account_info)?;
let current_timestamp = Clock::get()?.unix_timestamp;
let one_hour_ago: f64 = history_buffer.lower_bound(current_timestamp - 3600).unwrap().try_into()?;
```

### VRF Account

#### Read VRF Result

```rust
use switchboard_solana::VrfAccountData;

// deserialize the account info
let vrf = ctx.accounts.vrf.load()?;
// OR
let vrf = VrfAccountData::new(vrf_account_info)?;

// read the result
let result_buffer = vrf.get_result()?;
let value: &[u128] = bytemuck::cast_slice(&result_buffer[..]);
let result = value[0] % 256000 as u128;
```

#### RequestRandomness CPI

```rust
pub use switchboard_solana::{VrfAccountData, VrfRequestRandomness};

let switchboard_program = ctx.accounts.switchboard_program.to_account_info();

let vrf_request_randomness = VrfRequestRandomness {
    authority: ctx.accounts.state.to_account_info(),
    vrf: ctx.accounts.vrf.to_account_info(),
    oracle_queue: ctx.accounts.oracle_queue.to_account_info(),
    queue_authority: ctx.accounts.queue_authority.to_account_info(),
    data_buffer: ctx.accounts.data_buffer.to_account_info(),
    permission: ctx.accounts.permission.to_account_info(),
    escrow: ctx.accounts.escrow.clone(),
    payer_wallet: ctx.accounts.payer_wallet.clone(),
    payer_authority: ctx.accounts.payer_authority.to_account_info(),
    recent_blockhashes: ctx.accounts.recent_blockhashes.to_account_info(),
    program_state: ctx.accounts.program_state.to_account_info(),
    token_program: ctx.accounts.token_program.to_account_info(),
};

let vrf_key = ctx.accounts.vrf.key.clone();
let authority_key = ctx.accounts.authority.key.clone();

let state_seeds: &[&[&[u8]]] = &[&[
    &STATE_SEED,
    vrf_key.as_ref(),
    authority_key.as_ref(),
    &[bump],
]];
msg!("requesting randomness");
vrf_request_randomness.invoke_signed(
    switchboard_program,
    params.switchboard_state_bump,
    params.permission_bump,
    state_seeds,
)?;

```
