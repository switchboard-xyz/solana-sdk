# switchboard-v2

A monorepo containing APIs, Utils, and examples for Switchboard V2.

## Dependencies

- [Node and Yarn](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Docker Compose](https://docs.docker.com/compose/install)
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor)
- [Python3](https://www.python.org/downloads/)

## Setup

You will need to have yarn installed to build the javascript projects and poetry installed to build the python library.

### Typescript Setup

```
npm install --global yarn
yarn install
yarn workspaces run build
yarn workspace @switchboard-xyz/switchboardv2-cli link
```

### Python Setup

```
pip install poetry
cd libraries/py
poetry install
```

## Test

### Libraries

```
yarn test:libraries
```

### Programs

```
sbv2 localnet:env --keypair ../payer-keypair.json
chmod +x ./start-local-validator.sh && chmod +x ./start-oracle.sh
```

Run each of the commands in a separate shell

- `./start-local-validator.sh`
- `./start-oracle.sh`
- `yarn test:anchor`

## Website

```
yarn workspace website start
```
