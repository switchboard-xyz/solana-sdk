# switchboard-v2

A monorepo containing APIs, Utils, and examples for Switchboard V2.

## Dependencies

- [Node and NPM](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Docker Compose](https://docs.docker.com/compose/install)
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor)

## Setup

```
yarn install
yarn workspaces run build
yarn workspace @switchboard-xyz/switchboardv2-cli run link
```

## Test

```
sbv2 localnet:env --keypair ../payer-keypair.json
npm run test -ws
```

## Website

```
npm start -w website
```
