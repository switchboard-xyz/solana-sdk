<div align="center">
  <a href="#">
    <img src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png" />
  </a>

  <h1>anchor-buffer-parser</h1>

  <p>An example program written in Anchor demonstrating how to deserialize and read a Switchboard buffer relayer on Solana.</p>

</div>

## Usage

Build the example program

```bash
anchor build
```

Get your program ID and update `Anchor.toml` and `src/lib.rs` with your pubkey

```bash
export ANCHOR_BUFFER_PARSER_PUBKEY=$(solana-keygen pubkey target/deploy/anchor_buffer_parser-keypair.json)
sed -i '' s/96punQGZDShZGkzsBa3SsfTxfUnwu4XGpzXbhF7NTgcP/"$ANCHOR_BUFFER_PARSER_PUBKEY"/g Anchor.toml
sed -i '' s/96punQGZDShZGkzsBa3SsfTxfUnwu4XGpzXbhF7NTgcP/"$ANCHOR_BUFFER_PARSER_PUBKEY"/g src/lib.rs
```

Then run Anchor test

```bash
anchor test
```
