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
use switchboard_v2::AggregatorAccountData;
use std::convert::TryInto;

let feed_result = AggregatorAccountData::new(feed_account_info)?.get_result()?;

let decimal: f64 = feed_result.try_into()?;
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
if result_buffer == [0u8; 32] {
    msg!("vrf buffer empty");
    return Ok(());
}

let value: &[u128] = bytemuck::cast_slice(&result_buffer[..]);
let result = value[0] % 256000 as u128;
```
