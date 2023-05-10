<div align="center">
  <a href="#">
    <img src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png" />
  </a>

  <h1>anchor-vrf-parser</h1>

  <p>An example program written in Anchor demonstrating how to deserialize and read a Switchboard VRF account on Solana.</p>

</div>

## Usage

Build the example program

```bash
anchor build
```

Get your program ID and update `Anchor.toml` and `src/lib.rs` with your pubkey

```bash
export ANCHOR_VRF_PARSER_PUBKEY=$(solana-keygen pubkey target/deploy/anchor_vrf_parser-keypair.json)
sed -i '' s/4wTeTACfwiXqqvy44bNBB3V2rFjmSTXVoEr4ZAYamJEN/"$ANCHOR_VRF_PARSER_PUBKEY"/g Anchor.toml
sed -i '' s/4wTeTACfwiXqqvy44bNBB3V2rFjmSTXVoEr4ZAYamJEN/"$ANCHOR_VRF_PARSER_PUBKEY"/g src/lib.rs
```

Then run Anchor test

```bash
anchor test
```
