<div align="center">
  <a href="#">
    <img height="170" src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.svg" />
  </a>

  <h1>Sbv2 Feed Walkthrough</h1>

  <p>An example showing how to create your own feed using Switchboard.</p>

  <p>
    <a href="https://discord.gg/switchboardxyz">
      <img alt="Discord" src="https://img.shields.io/discord/841525135311634443?color=blueviolet&logo=discord&logoColor=white" />
    </a>
    <a href="https://twitter.com/switchboardxyz">
      <img alt="Twitter" src="https://img.shields.io/twitter/follow/switchboardxyz?label=Follow+Switchboard" />
    </a>
  </p>

  <h4>
    <strong>Npm: </strong><a href="https://www.npmjs.com/package/@switchboard-xyz/solana.js">npmjs.com/package/@switchboard-xyz/solana.js</a>
  </h4>
  <h4>
    <strong>Typedocs: </strong><a href="https://docs.switchboard.xyz/api/@switchboard-xyz/solana.js">docs.switchboard.xyz/api/@switchboard-xyz/solana.js</a>
  </h4>
  <h4>
    <strong>Sbv2 Solana SDK: </strong><a href="https://github.com/switchboard-xyz/sbv2-solana">github.com/switchboard-xyz/sbv2-solana</a>
  </h4>
</div>

## Install

```bash
npm i
```

## Usage

### Simulate an OracleJob

Edit the OracleJob file `src/oracle-job.json`, then run

```bash
ts-node src/simulate
```

### Create a Feed on Devnet

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

### Create a Private Queue and Oracle

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
npm install -g @switchboard-xyz/cli^2
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

See
[docs.switchboard.xyz/solana/program/devnet](https://docs.switchboard.xyz/solana/program/devnet)
for a list of devnet accounts to use

**_NOTE:_** You can provide multiple `--job` flags to add additional oracle jobs
to your data feed
