import 'mocha';
import assert from 'assert';

import * as sbv2 from '../src';
import { createFeed, createFeeds, setupTest, TestContext } from './utilts';
import { Keypair, PublicKey } from '@solana/web3.js';
import {
  AggregatorAccount,
  CrankAccount,
  QueueAccount,
  SolanaClock,
  types,
} from '../src';
import { sleep } from '@switchboard-xyz/common';

describe('Crank Tests', () => {
  const CRANK_SIZE = 10;
  let ctx: TestContext;

  const queueAuthority = Keypair.generate();

  let userTokenAddress: PublicKey;

  let queueAccount: QueueAccount;
  let queue: types.OracleQueueAccountData;

  let crankAccount: CrankAccount;

  let aggregatorAccounts: Array<AggregatorAccount>;

  before(async () => {
    ctx = await setupTest();

    [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      name: 'q1',
      metadata: '',
      queueSize: 2,
      reward: 0.0025,
      minStake: 0,
      oracleTimeout: 60,
      slashingEnabled: false,
      unpermissionedFeeds: false,
      unpermissionedVrf: true,
      enableBufferRelayers: false,
      authority: queueAuthority.publicKey,
    });
    queue = await queueAccount.loadData();
    assert(
      queue.authority.equals(queueAuthority.publicKey),
      'Incorrect queue authority'
    );

    [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.program.walletPubkey,
      { fundUpTo: 0 }
    );
  });

  it('Creates a Crank', async () => {
    [crankAccount] = await queueAccount.createCrank({
      name: 'Crank #1',
      maxRows: CRANK_SIZE,
    });
    const crank = await crankAccount.loadData();
    const crankRows = await crankAccount.loadCrank();
    assert(
      crankRows.length === 0,
      `Crank should be empty but found ${crankRows.length} rows`
    );
  });

  it('Adds a set of feeds to the crank', async () => {
    aggregatorAccounts = await createFeeds(queueAccount, CRANK_SIZE, {
      queueAuthority,
      minUpdateDelaySeconds: 5,
    });

    assert(
      aggregatorAccounts.length === CRANK_SIZE,
      `Failed to create ${CRANK_SIZE} AggregatorAccount's`
    );

    await Promise.all(
      aggregatorAccounts.map(async aggregatorAccount => {
        await crankAccount.push({ aggregatorAccount });
      })
    );

    const crankRows = await crankAccount.loadCrank();
    assert(
      crankRows.length === CRANK_SIZE,
      `Failed to push all ${CRANK_SIZE} aggregators onto the crank, crank size = ${crankRows.length}`
    );

    for (const row of crankRows) {
      const idx = aggregatorAccounts.findIndex(aggregator =>
        aggregator.publicKey.equals(row.pubkey)
      );
      assert(
        idx !== -1,
        `Failed to find aggregatorAccount on crank, ${row.pubkey}`
      );
    }
  });

  it('Fails to push a non-permitted aggregator onto the crank', async () => {
    const newAggregatorAccount = await createFeed(queueAccount, {
      name: 'No Crank Aggregator',
      // queueAuthority,
    });

    await assert.rejects(
      async () => {
        await crankAccount.push({ aggregatorAccount: newAggregatorAccount });
      },
      new RegExp(/custom program error: 0x1793/g)
      // { code: 6035 } // PermissionDenied
    );
  });

  it('Fails to push a new aggregator onto a full crank', async () => {
    const newAggregatorAccount = await createFeed(queueAccount, {
      name: 'No Crank Aggregator',
      queueAuthority,
    });

    await assert.rejects(
      async () => {
        await crankAccount.push({ aggregatorAccount: newAggregatorAccount });
      },
      new RegExp(/custom program error: 0x1786/g)
      // { code: 6022 } // CrankMaxCapacityError
    );
  });

  // it('Crank pop tests', async () => {
  //   const timestamp = (await SolanaClock.fetch(ctx.program.connection))
  //     .unixTimestamp;

  //   const nextAvailable = (await crankAccount.loadCrank()).reduce(
  //     (nextTimestamp, row) => {
  //       return nextTimestamp < row.nextTimestamp.toNumber()
  //         ? row.nextTimestamp.toNumber()
  //         : nextTimestamp;
  //     },
  //     0
  //   );

  //   // sleep until crank pop is ready
  //   const delay = nextAvailable - timestamp.toNumber();
  //   if (delay > -2) {
  //     await sleep((delay + 2) * 1000);
  //   }

  //   const initialCrankRows = await crankAccount.loadCrank();

  //   const readyRows = initialCrankRows.filter(row =>
  //     timestamp.gte(row.nextTimestamp)
  //   );
  //   initialCrankRows.forEach(row =>
  //     console.log(`${row.nextTimestamp} > ${timestamp.toNumber()}`)
  //   );

  //   assert(readyRows.length > 0, `No aggregators ready!`);

  //   const crankPopTxns = await crankAccount.pop({
  //     // readyPubkeys: readyRows.map(r => r.pubkey),
  //     unixTimestamp: timestamp.toNumber(),
  //     payoutWallet: userTokenAddress,
  //   });

  //   const newCrankRows = await crankAccount.loadCrank();

  //   for (const [i, row] of initialCrankRows.entries()) {
  //     const idx = newCrankRows.findIndex(newRow =>
  //       newRow.pubkey.equals(row.pubkey)
  //     );
  //     assert(idx !== -1, `Failed to find aggregator`);

  //     console.log(
  //       `${row.pubkey}: ${row.nextTimestamp.toNumber()} => ${newCrankRows[
  //         idx
  //       ].nextTimestamp.toNumber()}`
  //     );
  //   }
  // });
});
