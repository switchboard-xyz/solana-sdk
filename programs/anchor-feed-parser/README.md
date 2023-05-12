<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

# anchor-feed-parser

> An example program written in Anchor demonstrating how to deserialize and read
> a Switchboard data feed on Solana.

[![Anchor Test Status](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml/badge.svg)](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml)

</div>

<!-- install -->

<!-- installstop -->

## Usage

Build the example program

```bash
anchor build
```

Get your program ID and update `Anchor.toml` and `src/lib.rs` with your pubkey

```bash
export ANCHOR_FEED_PARSER_PUBKEY=$(solana-keygen pubkey target/deploy/anchor_feed_parser-keypair.json)
sed -i '' s/Fstf3oTcBxHMZFaoBzxk5oSkTh5HaAjxjh6zcgdZpNBb/"$ANCHOR_FEED_PARSER_PUBKEY"/g Anchor.toml
sed -i '' s/Fstf3oTcBxHMZFaoBzxk5oSkTh5HaAjxjh6zcgdZpNBb/"$ANCHOR_FEED_PARSER_PUBKEY"/g src/lib.rs
```

Then run Anchor test

```bash
anchor test
```
