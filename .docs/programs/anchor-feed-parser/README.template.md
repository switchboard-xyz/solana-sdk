<div align="center">
  <a href="#">
    <img src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png" />
  </a>

  <h1>anchor-feed-parser</h1>

  <p>An example program written in Anchor demonstrating how to deserialize and read a Switchboard data feed on Solana.</p>

</div>

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
