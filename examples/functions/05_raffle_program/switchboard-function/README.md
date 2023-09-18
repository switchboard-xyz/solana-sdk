<div align="center">
  <img src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png" />

  <h1>Switchboard<br>Solana Functions Template</h1>

  <p>
    <a href="https://discord.gg/switchboardxyz">
      <img alt="Discord" src="https://img.shields.io/discord/841525135311634443?color=blueviolet&logo=discord&logoColor=white" />
    </a>
    <a href="https://twitter.com/switchboardxyz">
      <img alt="Twitter" src="https://img.shields.io/twitter/follow/switchboardxyz?label=Follow+Switchboard" />
    </a>
  </p>
</div>

## Switchboard Functions

Switchboards V3 architecture allows users to permissionlessly build and run any
code you like and we attest the output is from your code.

## Table of Content

- [Project Setup](#setup)
- [Examples](./examples/README.md)
  - [Binance](./examples/binance/binance.rs)
  - [Randomness](./examples/randomness/randomness.rs)
  - [Secrets](./examples/secrets/README.md)

## Setup

Edit the Makefile with your docker image name. Make sure to include your docker
organization if publishing to the repository (For example:
`switchboard/my-function`).

## Build

Run the following command to build the docker image with your custom function

```bash
make
```

You should see a `measurement.txt` in the root of the project containing the
base64 encoding of the MRENCLAVE measurement. You will need to re-generate this
measurement anytime your source code or dependencies change.

## Publishing

```bash
make publish
```

## Integration

To get started, you will first need to:

1. Build your docker image and upload to a Docker/IPFS repository
2. Generate your MRENCLAVE measurement

Next, you will need to create a Function account for your given MRENCLAVE
measurement. Head over to [app.switchboard.xyz](https://app.switchboard.xyz) and
create a new function with your given repository and MRENCLAVE measurement.

Alternatively, create a function with the Switchboard CLI:

```bash
npm i --global @switchboard-xyz/cli

sbv2 solana function create CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE \
  --name "My Function" \
  --metadata "Basic binance oracle with TWAP" \
  --fundAmount 0.25 \
  --schedule "30 * * * * *" \
  --container switchboardlabs/basic-oracle-function \
  --keypair ~/.config/id/solana.json

# or fund an existing function
sbv2 solana function fund $MY_FUNCTION_PUBKEY \
  --fundAmount 0.25 \
  --keypair ~/.config/id/solana.json
```

## More Info

See [docs.switchboard.xyz](https://docs.switchboard.xyz/guides/solana/functions)
to get started.
