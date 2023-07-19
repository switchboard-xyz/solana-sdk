<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

# anchor-vrf-lite-parser

> An example program written in Anchor demonstrating how to integrate Switchboard Functions and verify attestation on-chain.

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
export ANCHOR_VRF_LITE_PARSER_PUBKEY=$(solana-keygen pubkey target/deploy/anchor_vrf_lite_parser-keypair.json)
sed -i '' s/5Hhm5xKDiThfidbpqjJpKmMJEcKmjj5tEUNFpi2DzSvb/"$ANCHOR_VRF_LITE_PARSER_PUBKEY"/g Anchor.toml
sed -i '' s/5Hhm5xKDiThfidbpqjJpKmMJEcKmjj5tEUNFpi2DzSvb/"$ANCHOR_VRF_LITE_PARSER_PUBKEY"/g src/lib.rs
```

Then run Anchor test

```bash
anchor test
```
