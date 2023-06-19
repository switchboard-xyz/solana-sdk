<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

# switchboard-solana

> A Rust library to interact with Switchboard accounts on Solana.

  <p>
	  <a href="https://crates.io/crates/switchboard-solana">
      <img alt="Crates.io" src="https://img.shields.io/crates/v/switchboard-solana?label=switchboard-solana&logo=rust" />
    </a>
  </p>

  <p>
    <a href="https://discord.gg/switchboardxyz">
      <img alt="Discord" src="https://img.shields.io/discord/841525135311634443?color=blueviolet&logo=discord&logoColor=white" />
    </a>
    <a href="https://twitter.com/switchboardxyz">
      <img alt="Twitter" src="https://img.shields.io/twitter/follow/switchboardxyz?label=Follow+Switchboard" />
    </a>
  </p>

  <h4>
    <strong>Typedocs: </strong><a href="https://docs.rs/switchboard-solana">docs.rs/switchboard-solana</a>
  </h4>
  <h4>
    <strong>Sbv2 Solana SDK: </strong><a href="https://github.com/switchboard-xyz/sbv2-solana">github.com/switchboard-xyz/sbv2-solana</a>
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
switchboard-solana = "0.5.0"
```

## Usage

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

**Example(s)**:
[anchor-feed-parser](https://github.com/switchboard-xyz/sbv2-solana/blob/main/programs/anchor-feed-parser/src/lib.rs),
[native-feed-parser](https://github.com/switchboard-xyz/sbv2-solana/blob/main/programs/native-feed-parser/src/lib.rs)

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

#### Read Latest Result

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

**Example**:
[anchor-vrf-parser](https://github.com/switchboard-xyz/sbv2-solana/blob/main/programs/anchor-vrf-parser/src/actions/update_result.rs)

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

**Example**:
[anchor-vrf-parser](https://github.com/switchboard-xyz/sbv2-solana/blob/main/programs/anchor-vrf-parser/src/actions/request_result.rs)

### Buffer Relayer Account

#### Read Latest Result

```rust
use anchor_lang::solana_program::clock;
use std::convert::TryInto;
use switchboard_solana::{BufferRelayerAccountData, SWITCHBOARD_PROGRAM_ID};

// check feed owner
let owner = *aggregator.owner;
if owner != SWITCHBOARD_PROGRAM_ID {
    return Err(error!(ErrorCode::InvalidSwitchboardAccount));
}

// deserialize account info
let buffer = BufferRelayerAccountData::new(feed_account_info)?;

// get result
let buffer_result = buffer.get_result();

// check if feed has been updated in the last 5 minutes
buffer.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)?;

// convert buffer to a string
let result_string = String::from_utf8(buffer.result)
    .map_err(|_| error!(ErrorCode::StringConversionFailed))?;
msg!("Buffer string {:?}!", result_string);
```

**Example**:
[anchor-buffer-parser](https://github.com/switchboard-xyz/sbv2-solana/blob/main/programs/anchor-buffer-parser/src/lib.rs)

## Supported CPI Calls

| Instruction                 | is supported |
| --------------------------- | ------------ |
| permission_set              | true         |
| vrf_request_randomness      | true         |
| vrf_set_callback            | true         |
| vrf_close                   | true         |
| vrf_lite_request_randomness | true         |
| vrf_lite_close              | true         |
| vrf_pool_request_randomness | true         |
| vrf_pool_remove             | true         |
| vrf_pool_add                | TODO         |
| aggregator_open_round       | TODO         |
| buffer_relayer_open_round   | TODO         |

See
[https://docs.switchboard.xyz/solana/idl](https://docs.switchboard.xyz/solana/idl)
for a list of all program instructions.
