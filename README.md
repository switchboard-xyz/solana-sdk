# switchboard-v2

A monorepo containing APIs, Utils, and examples for Switchboard V2.

## Table of Contents

### Libraries

| Package                                        | Description                                                   |
| ---------------------------------------------- | ------------------------------------------------------------- |
| [Typescript](./libraries/ts)                   | Typescript client to interact with Switchboard V2.            |
| [Typescript **_Lite_**](./libraries/sbv2-lite) | Typescript "Lite" client to deserialize aggregator accounts   |
| [Sbv2 Utils](./libraries/sbv2-utils)           | Typescript library with helpful utility functions             |
| [Python](./libraries/py)                       | Python client to interact with Switchboard V2.                |
| [Rust](./libraries/rs)                         | Rust client to interact with Switchboard V2.                  |
| [CLI](./cli)                                   | Command Line Interface (CLI) to interact with Switchboard V2. |

### Program Examples

| Package                                             | Description                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [anchor-feed-parser](./programs/anchor-feed-parser) | Anchor example program demonstrating how to deserialize and read an onchain aggregator.                                   |
| [spl-feed-parser](./programs/spl-feed-parser)       | Solana Program Library example demonstrating how to deserialize and read an onchain aggregator.                           |
| [anchor-vrf-parser](./programs/anchor-vrf-parser)   | Anchor example program demonstrating how to deserialize and read an onchain verifiable randomness function (VRF) account. |

### Client Examples

| Package                                         | Description                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [feed-parser](./packages/feed-parser)           | Typescript example demonstrating how to read an aggregator account.                                       |
| [feed-walkthrough](./packages/feed-walkthrough) | Typescript example demonstrating how to create and manage your own oracle queue.                          |
| [lease-observer](./packages/lease-observer)     | Typescript example demonstrating how to send PagerDuty alerts when your aggregator lease is low on funds. |

## Dependencies

- [Node and Yarn](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Docker Compose](https://docs.docker.com/compose/install)
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor)
- [Python3](https://www.python.org/downloads/)

## Setup

```
yarn install
yarn workspaces run build
yarn workspace @switchboard-xyz/switchboardv2-cli link
anchor build && node ./scripts/setup-example-programs.js
```

### Localnet Testing Setup

You may wish to run your own oracle for integration test. The following command will create a devnet Switchboard environment and output a `Switchboard.env` file to assist copying

```
sbv2 localnet:env --keypair ../payer-keypair.json -o .switchboard
```

Set the _[provider.cluster]_ in `Anchor.toml` to localnet.

Run each of the commands in a separate shell

- `./.switchboard/start-local-validator.sh`
- `./.switchboard/start-oracle.sh`
- `anchor test --skip-local-validator`

## Website

```
yarn workspace website start
```
