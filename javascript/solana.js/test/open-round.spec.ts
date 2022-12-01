import 'mocha';
import assert from 'assert';

import * as sbv2 from '../src';
import { setupTest, TestContext } from './utilts';
import { Keypair } from '@solana/web3.js';
import {
  AggregatorAccount,
  OracleAccount,
  PermissionAccount,
  QueueAccount,
  types,
} from '../src';
import { OracleJob } from '@switchboard-xyz/common';
import { PermitOracleQueueUsage } from '../src/generated/types/SwitchboardPermission';
import Big from 'big.js';

describe('Open Round Tests', () => {
  let ctx: TestContext;

  const queueAuthority = Keypair.generate();

  let queueAccount: QueueAccount;
  let queue: types.OracleQueueAccountData;

  let oracleAccount1: OracleAccount;
  let oracle1: types.OracleAccountData;

  let oracleAccount2: OracleAccount;
  let oracle2: types.OracleAccountData;

  let aggregatorAccount: AggregatorAccount;
  let aggregator: types.AggregatorAccountData;
  let aggregatorPermissionAccount: PermissionAccount;

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

    [oracleAccount1] = await queueAccount.createOracle({
      name: 'oracle-1',
      metadata: 'oracle-1',
      queueAuthority,
      enable: true,
    });
    oracle1 = await oracleAccount1.loadData();
    assert(
      oracle1.oracleAuthority.equals(ctx.payer.publicKey),
      'Incorrect oracle authority'
    );

    [oracleAccount2] = await queueAccount.createOracle({
      name: 'oracle-2',
      metadata: 'oracle-2',
      queueAuthority,
      enable: true,
    });
    oracle2 = await oracleAccount2.loadData();
    assert(
      oracle2.oracleAuthority.equals(ctx.payer.publicKey),
      'Incorrect oracle authority'
    );

    [aggregatorAccount] = await queueAccount.createFeed({
      batchSize: 2,
      minRequiredOracleResults: 2,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 5,
      fundAmount: 1,
      enable: false,
      jobs: [
        {
          weight: 2,
          data: OracleJob.encodeDelimited(
            OracleJob.fromObject({
              tasks: [
                {
                  valueTask: {
                    value: 1337,
                  },
                },
              ],
            })
          ).finish(),
        },
      ],
    });
    await aggregatorAccount.loadData();

    [aggregatorPermissionAccount] = PermissionAccount.fromSeed(
      ctx.program,
      queueAuthority.publicKey,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );
  });

  it('fails to call open round when aggregator lacks permissions', async () => {
    assert.rejects(
      async () => {
        await aggregatorAccount.openRound();
      },
      new RegExp(/custom program error: 0x1793/g)
      // { code: 6035 } // PermissionDenied
    );
  });

  it('sets aggregator permissions', async () => {
    await aggregatorPermissionAccount.set({
      permission: new PermitOracleQueueUsage(),
      enable: true,
      queueAuthority,
    });
    const permissions = await aggregatorPermissionAccount.loadData();

    assert(
      permissions.permissions === PermitOracleQueueUsage.discriminator + 1,
      `Aggregator has incorrect permissions, expected ${
        PermitOracleQueueUsage.kind
      }, received ${PermissionAccount.getPermissions(permissions).kind}`
    );
  });

  it('fails to call open round when not enough oracles are heartbeating', async () => {
    assert.rejects(
      async () => {
        await aggregatorAccount.openRound();
      },
      new RegExp(/custom program error: 0x17a4/g)
      // { code: 6052 } // InsufficientOracleQueueError
    );

    // still fails when queueSize < batchSize
    await oracleAccount1.heartbeat();
    assert.rejects(
      async () => {
        await aggregatorAccount.openRound();
      },
      new RegExp(/custom program error: 0x17a4/g)
      // { code: 6052 } // InsufficientOracleQueueError
    );
  });

  it('successfully calls open round', async () => {
    await oracleAccount2.heartbeat();
    // start heartbeating
    await aggregatorAccount.openRound();
  });

  it('oracles successfully respond and close the round', async () => {
    const aggregator = await aggregatorAccount.loadData();

    const jobs = (await aggregatorAccount.loadJobs(aggregator)).map(
      jobs => jobs.job
    );

    const result = new Big(1337);

    const confirmedRoundPromise = aggregatorAccount.nextRound(
      aggregator.currentRound.roundOpenSlot
    );

    await Promise.all(
      [oracleAccount1, oracleAccount2].map(async oracleAccount => {
        return await aggregatorAccount.saveResult({
          jobs,
          oracleAccount,
          value: result,
          minResponse: result,
          maxResponse: result,
        });
      })
    );

    const currentRound = await confirmedRoundPromise;
    assert(
      currentRound.roundOpenSlot.eq(aggregator.currentRound.roundOpenSlot),
      `Current round open slot does not match expected round open slot, expected ${aggregator.currentRound.roundOpenSlot}, received ${currentRound.roundOpenSlot}`
    );
    assert(
      currentRound.result.toBig().eq(result),
      `Incorrect current round result, expected ${result}, received ${currentRound.result.toBig()}`
    );
  });
});
