<div align="center">
  <a href="#">
    <img src="https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png" />
  </a>

  <h1>@switchboard-xyz/solana.js</h1>

  <p>A Typescript client to interact with Switchboard V2 on Solana.</p>

  <p>
    <img alt="Test Status" src="https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml/badge.svg" />
	  <a href="https://www.npmjs.com/package/@switchboard-xyz/solana.js">
      <img alt="NPM Badge" src="https://img.shields.io/github/package-json/v/switchboard-xyz/sbv2-solana?color=red&filename=javascript%2Fsolana.js%2Fpackage.json&label=%40switchboard-xyz%2Fsolana.js&logo=npm" />
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
npm i --save @switchboard-xyz/solana.js
```

## Usage

### Load the Switchboard Program

```ts
import { Connection } from '@solana/web3.js';
import {
  SwitchboardProgram,
  TransactionObject,
} from '@switchboard-xyz/solana.js';

const program = await SwitchboardProgram.load(
  'mainnet-beta',
  new Connection('https://api.mainnet-beta.solana.com'),
  payerKeypair /** Optional, READ-ONLY if not provided */
);
```

### Create a queue

```ts
import { QueueAccount } from '@switchboard-xyz/solana.js';

const [queueAccount, txnSignature] = await QueueAccount.create(program, {
  name: 'My Queue',
  metadata: 'Top Secret',
  queueSize: 100,
  reward: 0.00001337,
  minStake: 10,
  oracleTimeout: 60,
  slashingEnabled: false,
  unpermissionedFeeds: true,
  unpermissionedVrf: true,
  enableBufferRelayers: false,
});
const queue = await queueAccount.loadData();
```

### Add an oracle

```ts
import { QueueAccount } from '@switchboard-xyz/solana.js';

const queueAccount = new QueueAccount(program, queuePubkey);

const [oracleAccount, oracleInitSignature] = await queueAccount.createOracle({
  name: 'My Oracle',
  metadata: 'Oracle #1',
  stakeAmount: 10,
});
const oracle = await oracleAccount.loadData();

await oracleAccount.heartbeat();
```

### Add a data feed

```ts
import { QueueAccount } from '@switchboard-xyz/solana.js';

const queueAccount = new QueueAccount(program, queuePubkey);

const [aggregatorAccount, aggregatorInitSignatures] =
  await queueAccount.createFeed({
    batchSize: 1,
    minRequiredOracleResults: 1,
    minRequiredJobResults: 1,
    minUpdateDelaySeconds: 60,
    fundAmount: 2.5, // deposit 2.5 wSOL into the leaseAccount escrow
    jobs: [
      { pubkey: jobAccount.publicKey },
      {
        weight: 2,
        data: OracleJob.encodeDelimited(
          OracleJob.fromObject({
            tasks: [
              {
                valueTask: {
                  value: 1,
                },
              },
            ],
          })
        ).finish(),
      },
    ],
  });
const aggregator = await aggregatorAccount.loadData();
```

### Request a new value

```ts
import { AggregatorAccount } from '@switchboard-xyz/solana.js';

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

await aggregatorAccount.openRound();
```

### Read a Data Feed

After the oracles respond, read the feed result

```ts
import Big from 'big.js';
import { AggregatorAccount } from '@switchboard-xyz/solana.js';

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

const result: Big | null = await aggregatorAccount.fetchLatestValue();
if (result === null) {
  throw new Error('Aggregator holds no value');
}
console.log(result.toString());
```

### History Buffer

Optionally, add a history buffer to your feed to store the last N historical samples

```ts
import {
  AggregatorAccount,
  AggregatorHistoryBuffer,
} from '@switchboard-xyz/solana.js';

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);
const aggregator = await aggregatorAccount.loadData();

const [historyBuffer, addHistorySignature] =
  await AggregatorHistoryBuffer.create(program, {
    aggregatorAccount,
    maxSamples: 10000,
  });
const history = await historyBuffer.loadData();
```

### Watch a Data Feed

Setup a websocket listener to invoke a callback whenever an aggregator is updated

```ts
import Big from 'big.js';
import { AggregatorAccount } from '@switchboard-xyz/solana.js';

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

const ws = aggregatorAccount.onChange(aggregator => {
  const result = AggregatorAccount.decodeLatestValue(aggregator);
  if (result !== null) {
    console.log(result.toString());
  }
});
```
