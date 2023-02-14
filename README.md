<div align="center">
  <a href="#">
    <img height="170" src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.svg" />
  </a>

  <h1>Switchboard V2</h1>

  <p>A collection of libraries and examples for interacting with Switchboard V2 on Solana.</p>

  <p>
    <img alt="Test Status" src="https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml/badge.svg" />
	  <a href="https://crates.io/crates/switchboard-v2">
      <img alt="Crates.io" src="https://img.shields.io/crates/v/switchboard-v2?label=switchboard-v2&logo=rust">
    </a>
	  <a href="https://www.npmjs.com/package/@switchboard-xyz/solana.js">
      <img alt="NPM Badge" src="https://img.shields.io/github/package-json/v/switchboard-xyz/sbv2-solana?color=red&filename=javascript%2Fsolana.js%2Fpackage.json&label=%40switchboard-xyz%2Fsolana.js&logo=npm">
    </a>
  </p>

  <p>
    <a href="https://discord.gg/switchboardxyz">
      <img alt="Discord" src="https://img.shields.io/discord/841525135311634443?color=blueviolet&logo=discord&logoColor=white">
    </a>
    <a href="https://twitter.com/switchboardxyz">
      <img alt="Twitter" src="https://img.shields.io/twitter/follow/switchboardxyz?label=Follow+Switchboard" />
    </a>
  </p>

  <h4>
    <strong>Documentation: </strong><a href="https://docs.switchboard.xyz">docs.switchboard.xyz</a>
  </h4>
</div>

## Getting Started

To get started, clone the
[sbv2-solana](https://github.com/switchboard-xyz/sbv2-solana) repository.

```bash
git clone https://github.com/switchboard-xyz/sbv2-solana
```

## Program IDs

| **Network**  | **Program ID**                                 |
| ------------ | ---------------------------------------------- |
| Mainnet-Beta | `SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f`  |
| Devnet       | `2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG` |

See [switchboard.xyz/explorer](https://switchboard.xyz/explorer) for a list of
feeds deployed on Solana.

See [app.switchboard.xyz](https://app.switchboard.xyz) to create your own Solana
feeds.

## Libraries

| **Lang** | **Name**                                                                                                                                                                                                | **Description**                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Rust     | [switchboard-v2](/rust/switchboard-v2/) <br />[[Crates.io](https://crates.io/crates/switchboard-v2), [Typedocs](https://docs.rs/switchboard-v2/latest/sbv2_solana/)]                                    | Rust crate to deserialize and read Switchboard data feeds                |
| JS       | [@switchboard-xyz/solana.js](/javascript/solana.js/) <br />[[npmjs](https://www.npmjs.com/package/@switchboard-xyz/solana.js), [Typedocs](https://docs.switchboard.xyz/api/@switchboard-xyz/solana.js)] | Typescript package to interact with Switchboard V2                       |
| Python   | [switchboardpy](/python/switchboardpy/) <br />[[pypi](https://pypi.org/project/switchboardpy/), [Typedocs](https://docs.switchboard.xyz/api/switchboardpy/)]                                            | Python package to interact with Switchboard V2. **No longer maintained** |

## Example Programs

- [native-feed-parser](/programs/native-feed-parser/): Read a Switchboard feed
  using Solana's native program library
- [anchor-feed-parser](/programs/anchor-feed-parser/): Read a Switchboard feed
  using Anchor
- [anchor-history-parser](/programs/anchor-history-parser/): Read a Switchboard
  history buffer using Anchor
- [anchor-vrf-parser](/programs/anchor-vrf-parser/): Read a Switchboard VRF
  account and make a Cross Program Invocation (CPI) to request a new randomness
  value
- [anchor-buffer-parser](/programs/anchor-buffer-parser/): Read a Switchboard
  buffer relayer using Anchor

## Troubleshooting

1. File a
   [GitHub Issue](https://github.com/switchboard-xyz/sbv2-solana/issues/new)
2. Ask a question in
   [Discord #dev-support](https://discord.com/channels/841525135311634443/984343400377647144)
