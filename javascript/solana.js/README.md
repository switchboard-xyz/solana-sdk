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

**Directory**

1. [Load Switchboard Program](#load-switchboard-program)
2. [Create a Queue](#create-a-queue)

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
