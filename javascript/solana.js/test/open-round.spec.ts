import 'mocha';

import * as sbv2 from '../src';
import { setupTest, TestContext } from './utilts';
import { Keypair } from '@solana/web3.js';
import { AggregatorAccount, OracleAccount, QueueAccount, types } from '../src';
import { OracleJob } from '@switchboard-xyz/common';

describe('Open Round Tests', () => {
  let ctx: TestContext;

  const queueAuthority = Keypair.generate();

  let createQueueSignature: string;
  let queueAccount: QueueAccount;
  let queue: types.OracleQueueAccountData;

  let createOracleSignature1: string;
  let oracleAccount1: OracleAccount;
  let oracle1: types.OracleAccountData;

  let createOracleSignature2: string;
  let oracleAccount2: OracleAccount;
  let oracle2: types.OracleAccountData;

  let createAggregatorSignatures: string[];
  let aggregatorAccount: AggregatorAccount;
  let aggregator: types.AggregatorAccountData;

  before(async () => {
    ctx = await setupTest();

    [queueAccount, createQueueSignature] = await sbv2.QueueAccount.create(
      ctx.program,
      {
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
      }
    );
    queue = await queueAccount.loadData();

    [oracleAccount1, createOracleSignature1] = await queueAccount.createOracle({
      name: 'oracle-1',
      metadata: 'oracle-1',
      queueAuthority,
    });
    oracle1 = await oracleAccount1.loadData();

    [oracleAccount2, createOracleSignature2] = await queueAccount.createOracle({
      name: 'oracle-2',
      metadata: 'oracle-2',
      queueAuthority,
    });
    oracle2 = await oracleAccount2.loadData();

    [aggregatorAccount, createAggregatorSignatures] =
      await queueAccount.createFeed({
        queueAuthority: queueAuthority,
        batchSize: 1,
        minRequiredOracleResults: 1,
        minRequiredJobResults: 1,
        minUpdateDelaySeconds: 60,
        fundAmount: 1,
        enable: true,
        jobs: [
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
  });
});
