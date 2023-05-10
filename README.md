<div align="center">
  <a href="#">
    <img src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png" />
  </a>

  <h1>Switchboard V2</h1>

  <p>A collection of libraries and examples for interacting with Switchboard V2 on Solana.</p>

  <p>
    <a href="https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml">
      <img alt="Test Status" src="https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml/badge.svg" />
    </a>
      <a href="https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml">
       <img alt="Anchor Test Status" src="https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml/badge.svg" />
    </a>
	  <a href="https://crates.io/crates/switchboard-v2">
      <img alt="Crates.io" src="https://img.shields.io/crates/v/switchboard-v2?label=switchboard-v2&logo=rust" />
    </a>
	  <a href="https://www.npmjs.com/package/@switchboard-xyz/solana.js">
      <img alt="NPM Badge" src="https://img.shields.io/github/package-json/v/switchboard-xyz/sbv2-solana?color=red&filename=javascript%2Fsolana.js%2Fpackage.json&label=%40switchboard-xyz%2Fsolana.js&logo=npm" />
    </a>
  </p>

</div>

## Getting Started

To get started, clone the
[sbv2-solana](https://github.com/switchboard-xyz/sbv2-solana) repository.

```bash
git clone https://github.com/switchboard-xyz/sbv2-solana
```

Then install the dependencies

```bash
cd sbv2-solana
pnpm install
pnpm build
```

## Addresses

The following addresses can be used with the Switchboard deployment on Solana

### Mainnet

| Account              | Address                                        |
| -------------------- | ---------------------------------------------- |
| Program ID           | `SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f`  |
| Program Authority    | `2NvGRFswVx3GXxURNSfjbsWY4iP1ufj8LvAKJWGXSm4D` |
| IdlAddress           | `Fi8vncGpNKbq62gPo56G4toCehWNy77GgqGkTaAF5Lkk` |
| Permissioned Queue   | `3HBb2DQqDfuMdzWxNk1Eo9RTMkFYmuEAd32RiLKn9pAn` |
| Permissionless Queue | `5JYwqvKkqp35w8Nq3ba4z1WYUeJQ1rB36V8XvaGp6zn1` |

### Devnet

| Account              | Address                                        |
| -------------------- | ---------------------------------------------- |
| Program ID           | `SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f`  |
| Program Authority    | `2KgowxogBrGqRcgXQEmqFvC3PGtCu66qERNJevYW8Ajh` |
| IdlAddress           | `Fi8vncGpNKbq62gPo56G4toCehWNy77GgqGkTaAF5Lkk` |
| Permissioned Queue   | `PeRMnAqNqHQYHUuCBEjhm1XPeVTh4BxjY4t4TPan1pG`  |
| Permissionless Queue | `uPeRMdfPmrPqgRWSrjAnAkH78RqAhe5kXoW6vBYRqFX`  |

## Clients

| **Lang**   | **Name**                                           | **Description**                                                    |
| ---------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| Rust       | [switchboard-v2](rust/switchboard-v2)              | A Rust library to interact with Switchboard V2 accounts on Solana. |
| Javascript | [@switchboard-xyz/solana.js](javascript/solana.js) | A Typescript client to interact with Switchboard on Solana.        |

## Example Programs

| **Lang** | **Name**                                                | **Description**                                                                                            |
| -------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Rust     | [native-feed-parser](programs/native-feed-parser)       | Read a Switchboard feed using Solana's native program library"                                             |
| Anchor   | [anchor-feed-parser](programs/anchor-feed-parser)       | Read a Switchboard feed using Anchor                                                                       |
| Anchor   | [anchor-history-parser](programs/anchor-history-parser) | Read a data feeds history buffer and get the closest historical sample to a given timestamp                |
| Anchor   | [anchor-vrf-parser](programs/anchor-vrf-parser)         | Read a Switchboard VRF account and make a Cross Program Invocation (CPI) to request a new randomness value |
| Anchor   | [anchor-buffer-parser](programs/anchor-buffer-parser)   | Read a Switchboard buffer relayer using Anchor                                                             |

## Troubleshooting

1. File a
   [GitHub Issue](https://github.com/switchboard-xyz/sbv2-solana/issues/new)
2. Ask a question in
   [Discord #dev-support](https://discord.com/channels/841525135311634443/984343400377647144)
