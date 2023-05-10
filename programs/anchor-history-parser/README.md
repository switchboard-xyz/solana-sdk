<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

# anchor-history-parser

> An example program written in Anchor demonstrating how to deserialize and read
> a Switchboard data feed's history buffer on Solana.

[![Anchor Test Status](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml/badge.svg)](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml)

</div>

## Usage

Build the example program

```bash
anchor build
```

Get your program ID and update `Anchor.toml` and `src/lib.rs` with your pubkey

```bash
export ANCHOR_HISTORY_PARSER_PUBKEY=$(solana-keygen pubkey target/deploy/anchor_history_parser-keypair.json)
sed -i '' s/C7rn1qJkq9FjTwV86RrY5Uih91NgymRVLdJ81rqLNXRS/"$ANCHOR_HISTORY_PARSER_PUBKEY"/g Anchor.toml
sed -i '' s/C7rn1qJkq9FjTwV86RrY5Uih91NgymRVLdJ81rqLNXRS/"$ANCHOR_HISTORY_PARSER_PUBKEY"/g src/lib.rs
```

Then run Anchor test

```bash
anchor test
```
