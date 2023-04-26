<div align="center">
  <a href="#">
    <img height="170" src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.svg" />
  </a>

  <h1>sbv2-solana / anchor-buffer-parser</h1>

  <p>An example program written in Anchor demonstrating how to deserialize and read a Switchboard buffer relayer on Solana.</p>

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
    <strong>Sbv2 Solana SDK: </strong><a href="https://github.com/switchboard-xyz/sbv2-solana">github.com/switchboard-xyz/sbv2-solana</a>
  </h4>
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
