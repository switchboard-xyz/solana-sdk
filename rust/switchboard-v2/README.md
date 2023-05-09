<div align="center">
  <a href="#">
    <img src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png" />
  </a>

  <h1>switchboard-v2</h1>

  <p>A Rust library to interact with Switchboard V2 accounts on Solana.</p>

  <p>
	  <a href="https://crates.io/crates/switchboard-v2">
      <img alt="Crates.io" src="https://img.shields.io/crates/v/switchboard-v2?label=switchboard-v2&logo=rust" />
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
    <strong>Typedocs: </strong><a href="https://docs.rs/switchboard-v2/latest/switchboard-v2/">docs.rs/switchboard-v2</a>
  </h4>
  <h4>
    <strong>Sbv2 Solana SDK: </strong><a href="https://github.com/switchboard-xyz/sbv2-solana">github.com/switchboard-xyz/sbv2-solana</a>
  </h4>
</div>

## Install

Run the following Cargo command in your project directory:

```bash
cargo add switchboard-v2
```

Or add the following line to your Cargo.toml:

```toml
[dependencies]
switchboard-v2 = "0.1.23"
```

## Usage

**Directory**

- [Read Latest Result](#read-latest-result)

### Read Latest Result

Read an aggregator result on-chain

```rust
use anchor_lang::solana_program::clock;
use std::convert::TryInto;
use switchboard_v2::{AggregatorAccountData, SwitchboardDecimal, SWITCHBOARD_PROGRAM_ID};

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
