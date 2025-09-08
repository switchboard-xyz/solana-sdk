<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/core-sdk/raw/main/website/static/img/icons/switchboard/avatar.png)

# switchboard-on-demand

> A Rust library for seamless interaction with Switchboard Oracle accounts on the Solana blockchain.

[![Crates.io](https://img.shields.io/crates/v/switchboard-solana.svg?style=flat-square&logo=rust)](https://crates.io/crates/switchboard-solana)
[![Discord](https://img.shields.io/discord/841525135311634443?label=Discord&logo=discord&logoColor=white&style=flat-square)](https://discord.gg/switchboardxyz)
[![Twitter Follow](https://img.shields.io/twitter/follow/switchboardxyz?style=social)](https://twitter.com/switchboardxyz)

<h4>
    <strong>Switchboard Documentation:</strong> <a href="https://docs.switchboard.xyz">docs.switchboard.xyz</a>
    <br>
    <strong>Rustdoc:</strong> <a href="https://switchboard-on-demand-rust-docs.web.app">switchboard-on-demand-rust-docs.web.app</a>
</h4>

</div>

## Overview

`switchboard-on-demand` provides Rust developers with an efficient and easy-to-use client for integrating Solana-based oracles from Switchboard into their applications. This library empowers developers to leverage decentralized, trustless, and highly reliable oracle data for various applications, particularly in the DeFi and Web3 spaces.

## Features

- **On-Demand Oracle Data**: Fetch real-time, accurate, and tamper-proof data for blockchain applications.
- **Custom Oracle Creation**: Design and deploy your own oracles tailored to your specific data needs.
- **High Fidelity Financial Data**: Ideal for applications requiring precise and dependable financial data.
- **Privacy-Focused**: Operates within confidential runtimes to ensure data integrity and security.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Rust (latest stable version)
- Cargo
- Solana CLI tools (if interacting directly with the Solana blockchain)

### Installation

Add `switchboard-on-demand` to your `Cargo.toml`:

```toml
[dependencies]
switchboard-on-demand = "0.1.0"
```

### Using on chain

```rust
use switchboard_on_demand::PullFeedAccountData;
use rust_decimal::Decimal;

pub fn solana_ix<'a>(mut ctx: Context<YourAccounts<'a>>, params: Params) -> Result<()> {
    // Assume `account_info` is obtained from the Solana blockchain
    let feed = PullFeedAccountData::parse(ctx.accounts.sb_feed)?;
    let max_stale_slots = 100; // Define the maximum number of slots before data is considered stale
    let min_samples = 5; // Set the minimum number of samples for data accuracy
    let price: Decimal = feed.get_value(&Clock::get()?, max_stale_slots, min_samples, true)?;

    msg!("Oracle Price: {}", price);

    Ok(())
}
```
