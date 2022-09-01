# switchboard-v2

A monorepo containing APIs, Utils, and examples for Switchboard V2.

## Table of Contents

### Libraries

| Package                                        | Description                                                    |
| ---------------------------------------------- | -------------------------------------------------------------- |
| [Protobufs](./libraries/protos)                | Protocol buffers used by the oracle to fetch and publish data. |
| [Typescript](./libraries/ts)                   | Typescript client to interact with Switchboard V2.             |
| [Typescript **_Lite_**](./libraries/sbv2-lite) | Typescript "Lite" client to deserialize aggregator accounts    |
| [Sbv2 Utils](./libraries/sbv2-utils)           | Typescript library with helpful utility functions              |
| [Python](./libraries/py)                       | Python client to interact with Switchboard V2.                 |
| [Rust](./libraries/rs)                         | Rust client to interact with Switchboard V2.                   |
| [CLI](./cli)                                   | Command Line Interface (CLI) to interact with Switchboard V2.  |

### Program Examples

| Package                                                          | Description                                                                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [anchor-feed-parser](./examples/programs/anchor-feed-parser)     | Anchor example program demonstrating how to deserialize and read an onchain aggregator account.                           |
| [native-feed-parser](./examples/programs/native-feed-parser)     | Solana Program Library example demonstrating how to deserialize and read an onchain aggregator account.                   |
| [anchor-vrf-parser](./examples/programs/anchor-vrf-parser)       | Anchor example program demonstrating how to deserialize and read an onchain verifiable randomness function (VRF) account. |
| [anchor-buffer-parser](./examples/programs/anchor-buffer-parser) | Anchor example program demonstrating how to deserialize and read an onchain buffer relayer account.                       |

### Client Examples

| Package                                                 | Description                                                                                               |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [feed-parser](./examples/clients/feed-parser)           | Typescript example demonstrating how to read an aggregator account.                                       |
| [feed-walkthrough](./examples/clients/feed-walkthrough) | Typescript example demonstrating how to create and manage your own oracle queue.                          |
| [lease-observer](./examples/clients/lease-observer)     | Typescript example demonstrating how to send PagerDuty alerts when your aggregator lease is low on funds. |

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

## Website

Run live server

```
yarn workspace website start
```

Build

```
yarn docs:build
```

## Publishing

See [./Publishing.md](./Publishing.md) for a detailed guide.

```
lerna version patch --no-private --yes
lerna publish from-git --yes
```

### Localnet Testing Setup

The SDK supports copying a Switchboard devnet environment to your localnet
environment for integration testing. This is useful if you want to see how your
program will react to Switchboard data feed updates.

First, set the _[provider.cluster]_ in `Anchor.toml` to localnet.

Next, create a Switchboard devnet queue and oracle.

```
sbv2 localnet:env --keypair ../payer-keypair.json -o .switchboard
```

This command will output:

- **start-local-validator.sh**: starts a local Solana validator with the
  Switchboard program, IDL, and our devnet environment pre-loaded
- **start-oracle.sh**: start a Switchboard oracle and start heartbeating on the
  localnet queue
- **docker-compose.yml**: docker file with the Switchboard oracle environment
- **switchboard.env**: contains your Switchboard accounts

In three separate shells, run the following commands in this order:

- `./.switchboard/start-local-validator.sh`
- `./.switchboard/start-oracle.sh`
- `anchor test --skip-local-validator`

The anchor test are configured to first fetch the account info for the
Switchboard DAO controlled devnet permissionless queue. If the account info is
not found, it assumes a localnet connection and looks for the `switchboard.env`
with your Switchboard environment specific public keys. If a`.switchboard`
directory or `switchboard.env` file is not found in the root project directory,
it will look 2 levels higher until giving up.
