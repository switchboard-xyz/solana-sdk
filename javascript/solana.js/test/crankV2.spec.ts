import assert from 'assert';
import 'mocha';

import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BN, promiseWithTimeout, sleep } from '@switchboard-xyz/common';
import {
  AggregatorAccount,
  AggregatorPdaAccounts,
  CrankAccount,
  QueueAccount,
  SolanaClock,
  types,
} from '../src';
import { createFeed, createFeeds, setupTest, TestContext } from './utils';

describe('Crank V2 Tests', () => {
  const CRANK_SIZE = 50;
  const QUEUE_REWARD = 15_000 / LAMPORTS_PER_SOL;
  // const QUEUE_REWARD = 0;

  let ctx: TestContext;

  const queueAuthority = Keypair.generate();

  let userTokenAddress: PublicKey;

  let queueAccount: QueueAccount;
  let queue: types.OracleQueueAccountData;

  let crankAccount: CrankAccount;

  before(async () => {
    ctx = await setupTest();

    [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.program.walletPubkey,
      { fundUpTo: 50 }
    );

    [queueAccount] = await QueueAccount.create(ctx.program, {
      name: 'q1',
      metadata: '',
      queueSize: 2,
      reward: QUEUE_REWARD,
      minStake: 0,
      oracleTimeout: 600,
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

    const [oracle1] = await queueAccount.createOracle({
      name: 'Oracle 1',
      enable: true,
      queueAuthority: queueAuthority,
    });
    await oracle1.heartbeat();

    const [oracle2] = await queueAccount.createOracle({
      name: 'Oracle 2',
      enable: true,
      queueAuthority: queueAuthority,
    });
    await oracle2.heartbeat();
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
    const aggregatorAccounts: Array<AggregatorAccount> = [];

    // create in batches
    for (const _ of Array.from(Array(10).keys())) {
      const newAggregatorAccounts = await createFeeds(
        queueAccount,
        Math.round(CRANK_SIZE / 10),
        {
          queueAuthority,
          minUpdateDelaySeconds: 5,
          fundAmount: QUEUE_REWARD * 10,
          funderTokenWallet: userTokenAddress,
        }
      );
      await Promise.all(
        newAggregatorAccounts.map(async aggregatorAccount => {
          await crankAccount.push({ aggregatorAccount });
        })
      );
      aggregatorAccounts.push(...newAggregatorAccounts);
    }

    assert(
      aggregatorAccounts.length === CRANK_SIZE,
      `Failed to create ${CRANK_SIZE} AggregatorAccount's`
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

    await assert.rejects(async () => {
      await crankAccount.push({ aggregatorAccount: newAggregatorAccount });
    }, new RegExp(/PermissionDenied|6035|0x1793/g));
  });

  it('Fails to push a new aggregator onto a full crank', async () => {
    const newAggregatorAccount = await createFeed(queueAccount, {
      name: 'No Crank Aggregator',
      queueAuthority,
    });

    await assert.rejects(async () => {
      await crankAccount.push({ aggregatorAccount: newAggregatorAccount });
    }, new RegExp(/CrankMaxCapacityError|6022|0x1786/g));
  });

  it('Crank pop tests', async () => {
    const getTimestamp = async (): Promise<BN> => {
      return (await SolanaClock.fetch(ctx.program.connection)).unixTimestamp;
    };

    const crank = await crankAccount.loadData();

    let timestamp = await getTimestamp();

    const nextAvailable = (await crankAccount.loadCrank(false)).reduce(
      (nextTimestamp, row) => {
        return nextTimestamp < row.nextTimestamp.toNumber()
          ? row.nextTimestamp.toNumber()
          : nextTimestamp;
      },
      0
    );

    // sleep until crank pop is ready
    const delay = nextAvailable - timestamp.toNumber();
    if (delay > 0) {
      await sleep((delay + 1) * 1000);
    }

    const initialCrankRows = await crankAccount.loadCrank(true);

    const crankAccounts = crankAccount.getCrankAccounts(
      initialCrankRows,
      queueAccount,
      queue.authority
    );
    assert(
      initialCrankRows.length === crankAccounts.size,
      `Failed to load all crank accounts`
    );

    timestamp = await getTimestamp();

    let readyRows: Array<[number, types.CrankRow]> = [];
    for (const [idx, row] of initialCrankRows.entries()) {
      if (timestamp.gte(row.nextTimestamp)) {
        readyRows.push([idx, row]);
      }
    }
    readyRows = readyRows.sort(([idxA, rowA], [idxB, rowB]) =>
      rowA.nextTimestamp.cmp(rowB.nextTimestamp)
    );

    assert(readyRows.length > 0, `No aggregators ready!`);

    const readyAggregators: Array<
      [number, AggregatorAccount, AggregatorPdaAccounts]
    > = readyRows.map(([idx, row]) => {
      const aggregatorAccount = new AggregatorAccount(
        crankAccount.program,
        row.pubkey
      );
      const pdaAccounts = aggregatorAccount.getAccounts(
        queueAccount,
        queueAuthority.publicKey
      );
      return [idx, aggregatorAccount, pdaAccounts];
    });

    const packedTxns = crankAccount.packAndPopInstructionsV2(
      ctx.payer.publicKey,
      {
        payoutTokenWallet: userTokenAddress,

        queuePubkey: queueAccount.publicKey,
        queueAuthority: queue.authority,
        queueDataBuffer: queue.dataBuffer,
        crankDataBuffer: crank.dataBuffer,

        readyAggregators: readyAggregators,
        failOpenOnMismatch: true,
      }
    );
    assert(packedTxns.length > 0, `Failed to create packed transactions`);

    const startingTokenBalance = (await ctx.program.mint.fetchBalance(
      userTokenAddress
    ))!;

    const signatures = await ctx.program.signAndSendAll(
      packedTxns,
      {
        skipPreflight: true,
        skipConfrimation: true,
      },
      undefined,
      10
    );

    await promiseWithTimeout(
      5000,
      Promise.allSettled(
        signatures.map(
          async s => await ctx.program.connection.confirmTransaction(s)
        )
      )
    );

    const newCrankRows = await crankAccount.loadCrank();

    let numPopped = 0;
    for (const [i, row] of initialCrankRows.entries()) {
      const idx = newCrankRows.findIndex(newRow =>
        newRow.pubkey.equals(row.pubkey)
      );
      assert(idx !== -1, `Failed to find aggregator #${i} - ${row.pubkey}`);
      if (!row.nextTimestamp.eq(newCrankRows[idx].nextTimestamp)) {
        numPopped = numPopped + 1;
      }
    }

    console.log(`Popped ${numPopped}/${readyRows.length} rows`);

    const finalTokenBalance = Number.parseFloat(
      (await ctx.program.mint.fetchBalance(userTokenAddress))!.toFixed(4)
    );
    const queueReward =
      (await queueAccount.loadData()).reward.toNumber() / LAMPORTS_PER_SOL;

    const expectedTokenBalance = Number.parseFloat(
      (startingTokenBalance + numPopped * queueReward).toFixed(4)
    );
    assert(
      finalTokenBalance === expectedTokenBalance,
      `Crank turner was not rewarded sufficiently, expected ${expectedTokenBalance}, received ${finalTokenBalance}`
    );

    assert(
      numPopped >= 0.5 * readyRows.length,
      `Failed to pop at least 50% of the crank, ${numPopped}/${readyRows.length}`
    );
  });
});
