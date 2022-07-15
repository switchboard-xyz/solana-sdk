# switchboard-v2

A Rust library to interact with Switchboard V2's hosted data feeds.

<!-- https://badgen.net/crates/v/switchboard-v2 -->

[![cargo](https://badgen.net/crates/v/switchboard-v2)](https://crates.io/crates/switchboard-v2)&nbsp;&nbsp;
[![twitter](https://badgen.net/twitter/follow/switchboardxyz)](https://twitter.com/switchboardxyz)&nbsp;&nbsp;

## Description

This package can be used to manage Switchboard data feed account parsing.

Specifically, this package will return the most recent confirmed round result
from a provided data feed AccountInfo.

## Usage

### Aggregator

```rust
use anchor_lang::solana_program::clock;
use std::convert::TryInto;
use switchboard_v2::{AggregatorAccountData, SWITCHBOARD_V2_DEVNET, SWITCHBOARD_V2_MAINNET};

// check feed owner
let owner = *aggregator.owner;
if owner != SWITCHBOARD_V2_DEVNET && owner != SWITCHBOARD_V2_MAINNET {
    return Err(error!(ErrorCode::InvalidSwitchboardAccount));
}

// deserialize account info
let feed = AggregatorAccountData::new(feed_account_info)?;

// get result
let decimal: f64 = feed.get_result()?.try_into()?;

// check if feed has been updated in the last 5 minutes
feed.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)?;

// check if feed exceeds a confidence interval of +/i $0.80
feed.check_confidence_interval(0.80)?;
```

### Aggregator History

```rust
use switchboard_v2::AggregatorHistoryBuffer;
use std::convert::TryInto;

let history_buffer = AggregatorHistoryBuffer::new(history_account_info)?;
let current_timestamp = Clock::get()?.unix_timestamp;
let one_hour_ago: f64 = history_buffer.lower_bound(current_timestamp - 3600).unwrap().try_into()?;
```

### VRF Account

```rust
use switchboard_v2::VrfAccountData;

let vrf = VrfAccountData::new(vrf_account_info)?;
let result_buffer = vrf.get_result()?;
let value: &[u128] = bytemuck::cast_slice(&result_buffer[..]);
let result = value[0] % 256000 as u128;
```

### Buffer Relayer Account

```rust
use anchor_lang::solana_program::clock;
use std::convert::TryInto;
use switchboard_v2::{BufferRelayerAccountData, SWITCHBOARD_V2_DEVNET, SWITCHBOARD_V2_MAINNET};

// check feed owner
let owner = *aggregator.owner;
if owner != SWITCHBOARD_V2_DEVNET && owner != SWITCHBOARD_V2_MAINNET {
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
