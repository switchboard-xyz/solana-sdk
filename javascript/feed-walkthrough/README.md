<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

# Javascript Feed Walkthrough

> Create a private Switchboard queue and oracle and fulfill your own oracle
> updates

[![Test Status](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml/badge.svg)](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml)

[![Types Badge](https://img.shields.io/badge/types-docs.switchboard.xyz-blue)](https://docs.switchboard.xyz/api/solana.js)

</div>

## Install

```bash
npm i
```

## Usage

**Directory**

- [Simulate an OracleJob](#simulate-an-oraclejob)
- [Create a Devnet Feed](#create-a-devnet-feed)
- [Create a Private Switchboard Network](#create-a-private-switchboard-network)
- [Create a Feed with the CLI](#create-a-feed-with-the-cli)

### Simulate an OracleJob

Edit the OracleJob file `src/oracle-job.json`, then run

```bash
ts-node src/simulate
```

### Create a Devnet Feed

You can create your own feeds using the devnet permissionless network. This
network does _NOT_ require the queue authority to grant you permissions so you
are free to use it as a testing environment.

You do **_NOT_** need to run your own oracles for this network.

Edit the OracleJob file `src/oracle-job.json`, then run

```bash
ts-node src/devnet
```

Optionally, provide these env variables

```bash
RPC_URL=https://my_custom_rpc_url.com \
PAYER_KEYPAIR=~/my_keypair.json \
ts-node src/devnet
```

### Create a Private Switchboard Network

You can also create your own private Switchboard network and run your own
oracles. This requires you to run your own oracles for this network.

The following script will

- Create a private queue and crank
- Create a new data feed on this network
- Start a local oracle
- Call OpenRound and await the updated result from your local oracle

```bash
ts-node src/private-queue
```

Optionally, provide these env variables

```bash
RPC_URL=https://my_custom_rpc_url.com \
PAYER_KEYPAIR=~/my_keypair.json \
ts-node src/private-queue
```

### Create a Feed with the CLI

First install the sbv2 cli

```bash
npm install -g @switchboard-xyz
```

Then run the following command to create your own feed using the devnet
permissionless queue and crank

```bash
export QUEUE_KEY=uPeRMdfPmrPqgRWSrjAnAkH78RqAhe5kXoW6vBYRqFX
export CRANK_KEY=GN9jjCy2THzZxhYqZETmPM3my8vg4R5JyNkgULddUMa5
sbv2 solana aggregator create "$QUEUE_KEY" \
    --keypair ~/.config/solana/id.json \
    --crankKey "$CRANK_KEY" \
    --name "My_Test_Feed" \
    --updateInterval 10 \
    --minOracles 1 \
    --batchSize 1 \
    --leaseAmount 0.1 \
    --job ./src/oracle-job.json \
    --verbose
```

Then request an update for your new feed

```bash
sbv2 solana aggregator update $AGGREGATOR_KEY \
    --keypair ~/.config/solana/id.json
```

**_NOTE:_** You can provide multiple `--job` flags to add additional oracle jobs
to your data feed
