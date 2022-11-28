/* eslint-disable no-unused-vars */
import 'mocha';
import chai, { expect } from 'chai';
import assert from 'assert';

import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import * as sbv2 from '../src';
import { setupTest, TestContext } from './utilts';
import { Keypair } from '@solana/web3.js';
import {
  AggregatorAccount,
  JobAccount,
  LeaseAccount,
  QueueAccount,
} from '../src';
import { OracleJob } from '@switchboard-xyz/common';
import { PermitOracleQueueUsage } from '../src/generated/types/SwitchboardPermission';

describe('Aggregator Tests', () => {
  let ctx: TestContext;

  const queueAuthority = Keypair.generate();
  let queueAccount: QueueAccount;

  let jobAccount: JobAccount;

  let fundedAggregator: AggregatorAccount;

  before(async () => {
    ctx = await setupTest();

    const [createQueueSignature, oracleQueue] = await sbv2.QueueAccount.create(
      ctx.program,
      {
        name: Buffer.from('aggregator-queue'),
        metadata: Buffer.from(''),
        authority: queueAuthority.publicKey,
        queueSize: 1,
        reward: new anchor.BN(0),
        minStake: new anchor.BN(0),
        oracleTimeout: 86400,
        mint: spl.NATIVE_MINT,
        slashingEnabled: false,
        unpermissionedFeeds: true,
        unpermissionedVrf: true,
        enableBufferRelayers: false,
      }
    );

    queueAccount = oracleQueue;

    // add a single oracle for open round calls
    await queueAccount.createOracle({
      name: 'oracle-1',
    });

    const [createJobSigs, jobAccount1] = await JobAccount.create(ctx.program, {
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
      name: 'Job1',
    });
    jobAccount = jobAccount1;
  });

  it('Adds and removes a job from an aggregator', async () => {
    const aggregatorKeypair = Keypair.generate();
    const aggregatorAuthority = Keypair.generate();

    const [createAggregatorSig, aggregatorAccount] =
      await AggregatorAccount.create(ctx.program, {
        queueAccount,
        queueAuthority: queueAuthority.publicKey,
        authority: aggregatorAuthority.publicKey,
        batchSize: 1,
        minRequiredOracleResults: 1,
        minRequiredJobResults: 1,
        minUpdateDelaySeconds: 60,
        keypair: aggregatorKeypair,
      });
    const aggregator = await aggregatorAccount.loadData();

    const oracleJob = OracleJob.fromObject({
      tasks: [
        {
          valueTask: {
            value: 1,
          },
        },
      ],
    });

    const [createJobSigs, jobAccount] = await JobAccount.create(
      ctx.program,

      {
        data: OracleJob.encodeDelimited(oracleJob).finish(),
        name: 'Job1',
      }
    );

    const addSig = await aggregatorAccount.addJob({
      job: jobAccount,
      weight: 1,
      authority: aggregatorAuthority,
    });

    const postAddJobAggregatorState = await aggregatorAccount.loadData();
    const jobIdx = postAddJobAggregatorState.jobPubkeysData.findIndex(pubkey =>
      pubkey.equals(jobAccount.publicKey)
    );
    if (jobIdx === -1) {
      throw new Error(`Failed to add job to aggregator`);
    }

    const removeSig = await aggregatorAccount.removeJob({
      job: jobAccount,
      jobIdx: jobIdx,
      authority: aggregatorAuthority,
    });
    const postRemoveJobAggregatorState = await aggregatorAccount.loadData();
    const jobIdx1 = postRemoveJobAggregatorState.jobPubkeysData.findIndex(
      pubkey => pubkey.equals(jobAccount.publicKey)
    );
    if (jobIdx1 !== -1) {
      throw new Error(`Failed to remove job from aggregator`);
    }
  });

  it('Creates and funds aggregator', async () => {
    const [createAggregatorSig, aggregatorAccount] =
      await queueAccount.createFeed({
        queueAuthority: queueAuthority,
        batchSize: 1,
        minRequiredOracleResults: 1,
        minRequiredJobResults: 1,
        minUpdateDelaySeconds: 60,
        loadAmount: 2.5,
        enable: true,
        permission: new PermitOracleQueueUsage(),
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

    if (aggregator.jobPubkeysSize !== 2) {
      throw new Error(`Aggregator failed to add the correct number of jobs`);
    }

    if (aggregator.jobWeights[0] !== 1 || aggregator.jobWeights[1] !== 2) {
      throw new Error(`Aggregator set the incorrect job weights`);
    }

    const [leaseAccount] = LeaseAccount.fromSeed(
      ctx.program,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );
    const leaseBalance = await leaseAccount.getBalance();
    if (leaseBalance !== 2.5) {
      throw new Error(
        `Lease balance has incorrect funds, expected 2.5 wSOL, received ${leaseBalance}`
      );
    }

    fundedAggregator = aggregatorAccount;
  });

  it('Withdraws funds from an aggregator lease', async () => {
    if (!fundedAggregator) {
      throw new Error(`Aggregator does not exist`);
    }
    const aggregatorAccount = fundedAggregator;

    const initialUserTokenBalance = await ctx.program.mint.getBalance(
      ctx.payer.publicKey
    );

    const [leaseAccount] = LeaseAccount.fromSeed(
      ctx.program,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );
    const leaseBalance = await leaseAccount.getBalance();

    const expectedFinalBalance = leaseBalance - 1;

    await leaseAccount.withdraw({
      amount: 1,
      unwrap: true,
    });

    const finalBalance = await leaseAccount.getBalance();
    if (expectedFinalBalance !== finalBalance) {
      throw new Error(
        `Lease balance has incorrect funds, expected ${expectedFinalBalance} wSOL, received ${finalBalance}`
      );
    }

    const finalUserTokenBalance = await ctx.program.mint.getBalance(
      ctx.payer.publicKey
    );
    if (initialUserTokenBalance !== finalUserTokenBalance) {
      throw new Error(
        `User token balance has incorrect funds, expected ${initialUserTokenBalance} wSOL, received ${finalUserTokenBalance}`
      );
    }
  });
});
