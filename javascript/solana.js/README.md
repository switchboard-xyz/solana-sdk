<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

# @switchboard-xyz/solana.js

> A Typescript client to interact with Switchboard V2 on Solana.

[![Test Status](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml/badge.svg)](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/solana-js-test.yml)
[![Anchor Test Status](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml/badge.svg)](https://github.com/switchboard-xyz/sbv2-solana/actions/workflows/anchor-test.yml)

[![NPM Badge](https://img.shields.io/github/package-json/v/switchboard-xyz/sbv2-solana?color=red&filename=javascript%2Fsolana.js%2Fpackage.json&label=%40switchboard-xyz%2Fsolana.js&logo=npm)](https://www.npmjs.com/package/@switchboard-xyz/solana.js)
[![Types Badge](https://img.shields.io/badge/types-docs.switchboard.xyz-blue)](https://docs.switchboard.xyz/api/solana.js)

</div>

## Install

```bash
npm i --save @switchboard-xyz/solana.js
```

## Usage

**Directory**

- [Load Switchboard Program](#load-switchboard-program)
- [Create a Queue](#create-a-queue)
- [Add an Oracle](#add-an-oracle)
- [Add a Data Feed](#add-a-data-feed)
- [Request a New Value](#request-a-new-value)
- [Read a Data Feed](#read-a-data-feed)
- [Add a History Buffer](#add-a-history-buffer)
- [Watch Data Feed](#watch-data-feed)

### Load Switchboard Program

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

### Create a Queue

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

### Add an Oracle

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

### Add a Data Feed

```ts
import { QueueAccount } from '@switchboard-xyz/solana.js';
import { OracleJob } from '@switchboard-xyz/common';

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

### Request a New Value

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

### Add a History Buffer

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

### Watch Data Feed

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
