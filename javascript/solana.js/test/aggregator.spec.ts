/* eslint-disable no-unused-vars */
import "mocha";

import type { QueueAccount } from "../src/index.js";
import {
  AggregatorAccount,
  JobAccount,
  LeaseAccount,
  types,
} from "../src/index.js";
import * as sbv2 from "../src/index.js";

import type { TestContext } from "./utils.js";
import { setupTest } from "./utils.js";

import { Keypair } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/common";
import assert from "assert";

describe("Aggregator Tests", () => {
  let ctx: TestContext;

  const queueAuthority = Keypair.generate();
  let queueAccount: QueueAccount;

  let jobAccount: JobAccount;

  let aggregatorAccount: AggregatorAccount;

  before(async () => {
    ctx = await setupTest();

    [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      name: "aggregator-queue",
      metadata: "",
      authority: queueAuthority.publicKey,
      queueSize: 1,
      reward: 0,
      minStake: 0,
      oracleTimeout: 86400,
      slashingEnabled: false,
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: false,
    });

    await ctx.program.mint.getOrCreateAssociatedUser(ctx.program.walletPubkey);

    // add a single oracle for open round calls
    await queueAccount.createOracle({
      name: "oracle-1",
    });

    [jobAccount] = await JobAccount.create(ctx.program, {
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
      name: "Job1",
    });
  });

  it("Adds job, updates it's weight, then removes it from aggregator", async () => {
    const aggregatorKeypair = Keypair.generate();
    const aggregatorAuthority = Keypair.generate();

    const [aggregatorAccount1] = await AggregatorAccount.create(ctx.program, {
      queueAccount,
      queueAuthority: queueAuthority.publicKey,
      authority: aggregatorAuthority.publicKey,
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 60,
      keypair: aggregatorKeypair,
    });
    await aggregatorAccount1.loadData();

    const oracleJob = OracleJob.fromObject({
      tasks: [
        {
          valueTask: {
            value: 1,
          },
        },
      ],
    });

    const [jobAccount] = await JobAccount.create(ctx.program, {
      data: OracleJob.encodeDelimited(oracleJob).finish(),
      name: "Job1",
    });

    await aggregatorAccount1.addJob({
      job: jobAccount,
      weight: 1,
      authority: aggregatorAuthority,
    });

    const postAddJobAggregatorState = await aggregatorAccount1.loadData();
    const jobIdx = postAddJobAggregatorState.jobPubkeysData.findIndex(
      (pubkey) => pubkey.equals(jobAccount.publicKey)
    );
    assert(jobIdx !== -1, `Failed to add job to aggregator`);

    await aggregatorAccount1.updateJobWeight({
      job: jobAccount,
      jobIdx: jobIdx,
      weight: 2,
      authority: aggregatorAuthority,
    });
    const postUpdateWeightAggregatorState = await aggregatorAccount1.loadData();
    assert(
      postUpdateWeightAggregatorState.jobWeights[0] === 2,
      `Failed to update job weight in aggregator`
    );

    await aggregatorAccount1.removeJob({
      job: jobAccount,
      jobIdx: jobIdx,
      authority: aggregatorAuthority,
    });
    const postRemoveJobAggregatorState = await aggregatorAccount1.loadData();
    const jobIdx1 = postRemoveJobAggregatorState.jobPubkeysData.findIndex(
      (pubkey) => pubkey.equals(jobAccount.publicKey)
    );
    assert(jobIdx1 === -1, `Failed to remove job from aggregator`);
  });

  it("Creates and funds aggregator", async () => {
    [aggregatorAccount] = await queueAccount.createFeed({
      queueAuthority: queueAuthority,
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 60,
      fundAmount: 2.5,
      enable: true,
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

    assert(
      aggregator.jobPubkeysSize === 2,
      `Aggregator failed to add the correct number of jobs`
    );

    assert(
      aggregator.jobWeights[0] === 1 && aggregator.jobWeights[1] === 2,
      `Aggregator set the incorrect job weights`
    );

    const [leaseAccount] = LeaseAccount.fromSeed(
      ctx.program,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );
    const leaseBalance = await leaseAccount.fetchBalance();
    assert(
      leaseBalance === 2.5,
      `Lease balance has incorrect funds, expected 2.5 wSOL, received ${leaseBalance}`
    );
  });

  it("Extends an aggregator lease", async () => {
    if (!aggregatorAccount) {
      throw new Error(`Aggregator does not exist`);
    }

    const extendAmount = 0.15;

    const [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: extendAmount }
    );

    const [leaseAccount] = LeaseAccount.fromSeed(
      ctx.program,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );

    const leaseBalance = await leaseAccount.fetchBalance();

    await leaseAccount.extend({
      fundAmount: extendAmount,
      funderTokenWallet: userTokenAddress,
      disableWrap: true,
    });

    const expectedFinalBalance = leaseBalance + extendAmount;
    const finalBalance = await leaseAccount.fetchBalance();
    assert(
      expectedFinalBalance === finalBalance,
      `Lease balance has incorrect funds, expected ${expectedFinalBalance} wSOL, received ${finalBalance}`
    );
  });

  it("Withdraws funds from an aggregator lease", async () => {
    if (!aggregatorAccount) {
      throw new Error(`Aggregator does not exist`);
    }

    const WITHDRAW_AMOUNT = 1;

    const [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0 }
    );

    const initialUserTokenBalance =
      (await ctx.program.mint.fetchBalance(userTokenAddress)) ?? 0;

    const [leaseAccount] = LeaseAccount.fromSeed(
      ctx.program,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );
    const leaseBalance = await leaseAccount.fetchBalance();

    const expectedFinalBalance = leaseBalance - WITHDRAW_AMOUNT;

    await leaseAccount.withdraw({
      amount: WITHDRAW_AMOUNT,
      unwrap: false,
      withdrawWallet: userTokenAddress,
    });

    const finalBalance = await leaseAccount.fetchBalance();
    assert(
      expectedFinalBalance === finalBalance,
      `Lease balance has incorrect funds, expected ${expectedFinalBalance} wSOL, received ${finalBalance}`
    );

    const finalUserTokenBalance = await ctx.program.mint.fetchBalance(
      userTokenAddress
    );
    assert(finalUserTokenBalance !== null, `Users wrapped account was closed`);

    const expectedFinalUserTokenBalance =
      initialUserTokenBalance + WITHDRAW_AMOUNT;
    assert(
      expectedFinalUserTokenBalance === finalUserTokenBalance,
      `User token balance has incorrect funds, expected ${expectedFinalUserTokenBalance} wSOL, received ${finalUserTokenBalance}`
    );
  });

  it("Terminates a lease and closes the users wrapped SOL wallet", async () => {
    if (!aggregatorAccount) {
      throw new Error(`Aggregator does not exist`);
    }

    const [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0 }
    );

    const initialUserTokenBalance =
      (await ctx.program.mint.fetchBalance(userTokenAddress)) ?? 0;

    const [leaseAccount] = LeaseAccount.fromSeed(
      ctx.program,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );
    const { queue, aggregator } = await leaseAccount.fetchAccounts();

    const expectedFinalBalance = LeaseAccount.minimumLeaseAmount(
      aggregator.oracleRequestBatchSize,
      queue.reward
    );

    await leaseAccount.withdraw({
      amount: "all",
      unwrap: true,
    });

    const finalBalance = await leaseAccount.fetchBalanceBN();
    assert(
      expectedFinalBalance.eq(finalBalance),
      `Lease balance has incorrect funds, expected ${expectedFinalBalance} wSOL, received ${finalBalance}`
    );

    const finalUserTokenBalance = await ctx.program.mint.fetchBalance(
      userTokenAddress
    );
    assert(
      finalUserTokenBalance !== null,
      `Users wrapped account was unexpectedly closed`
    );

    assert(
      initialUserTokenBalance === finalUserTokenBalance,
      `User token balance has incorrect funds, expected ${initialUserTokenBalance} wSOL, received ${finalUserTokenBalance}`
    );
  });

  it("Adds job, updates it's config, then removes it from aggregator", async () => {
    const aggregatorKeypair = Keypair.generate();
    const aggregatorAuthority = Keypair.generate();

    const [aggregatorAccount] = await AggregatorAccount.create(ctx.program, {
      queueAccount,
      queueAuthority: queueAuthority.publicKey,
      authority: aggregatorAuthority.publicKey,
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 60,
      keypair: aggregatorKeypair,
      varianceThreshold: 1,
    });
    await aggregatorAccount.loadData();

    const oracleJob = OracleJob.fromObject({
      tasks: [{ valueTask: { value: 1 } }],
    });

    const [jobAccount] = await JobAccount.create(ctx.program, {
      data: OracleJob.encodeDelimited(oracleJob).finish(),
      name: "Job1",
    });

    await aggregatorAccount.addJob({
      job: jobAccount,
      weight: 1,
      authority: aggregatorAuthority,
    });

    const postAddJobAggregatorState = await aggregatorAccount.loadData();
    const jobIdx = postAddJobAggregatorState.jobPubkeysData.findIndex(
      (pubkey) => pubkey.equals(jobAccount.publicKey)
    );
    if (jobIdx === -1) {
      throw new Error(`Failed to add job to aggregator`);
    }

    const badSetConfigSignature = await aggregatorAccount
      .setConfigInstruction(aggregatorAuthority.publicKey, { minJobResults: 2 })
      .catch(() => undefined);
    // If badSetConfigSignature isn't undefined, a (bad) transaction was built and sent.
    assert(
      badSetConfigSignature === undefined,
      "Aggregator should not let minJobResults increase above numJobs"
    );

    await aggregatorAccount.setConfig({
      authority: aggregatorAuthority,
      minUpdateDelaySeconds: 300,
      force: true, // Bypass validation rules.
      varianceThreshold: 0,
    });
    const postUpdateAggregatorState = await aggregatorAccount.loadData();
    assert(
      postUpdateAggregatorState.minUpdateDelaySeconds === 300,
      `Failed to setConfig on aggregator (minUpdateDelaySeconds)`
    );
    assert(
      postUpdateAggregatorState.varianceThreshold.toBig().toNumber() === 0,
      `Failed to setConfig on aggregator (varianceThreshold)`
    );
  });

  it("Sets priority fees during feed creation", async () => {
    const basePriorityFee = 10000;
    const priorityFeeBump = 1000;
    const priorityFeeBumpPeriod = 60;
    const maxPriorityFeeMultiplier = 10;

    const [myAggregatorAccount] = await queueAccount.createFeed({
      queueAuthority: queueAuthority,
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 60,
      fundAmount: 2.5,
      enable: true,
      slidingWindow: true,
      basePriorityFee,
      priorityFeeBump,
      priorityFeeBumpPeriod,
      maxPriorityFeeMultiplier,
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

    const myAggregator = await myAggregatorAccount.loadData();

    assert(
      myAggregator.resolutionMode.discriminator ===
        types.AggregatorResolutionMode.ModeSlidingResolution.discriminator,
      `resolutionMode mismatch, expected ${types.AggregatorResolutionMode.ModeSlidingResolution.discriminator}, received ${myAggregator.resolutionMode.discriminator}`
    );
    assert(
      myAggregator.basePriorityFee === basePriorityFee,
      `basePriorityFee mismatch, expected ${basePriorityFee}, received ${myAggregator.basePriorityFee}`
    );
    assert(
      myAggregator.priorityFeeBump === priorityFeeBump,
      `priorityFeeBump mismatch, expected ${priorityFeeBump}, received ${myAggregator.priorityFeeBump}`
    );
    assert(
      myAggregator.priorityFeeBumpPeriod === priorityFeeBumpPeriod,
      `priorityFeeBumpPeriod mismatch, expected ${priorityFeeBumpPeriod}, received ${myAggregator.priorityFeeBumpPeriod}`
    );
    assert(
      myAggregator.maxPriorityFeeMultiplier === maxPriorityFeeMultiplier,
      `maxPriorityFeeMultiplier mismatch, expected ${maxPriorityFeeMultiplier}, received ${myAggregator.maxPriorityFeeMultiplier}`
    );
  });

  it("Initializes an aggregator and sets the authority", async () => {
    const myAuth = Keypair.generate();
    const myAgg = Keypair.generate();

    const [aggregatorAccount1] = await queueAccount.createFeed(
      {
        queueAccount,
        queueAuthority: queueAuthority,
        batchSize: 1,
        minRequiredOracleResults: 1,
        minRequiredJobResults: 1,
        minUpdateDelaySeconds: 60,
        authority: myAuth.publicKey,
        keypair: myAgg,
        enable: true,
        fundAmount: 0.25,
        historyLimit: 25,
        forceReportPeriod: 3600,
        varianceThreshold: 0.25,
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
      },
      { skipPreflight: true }
    );

    const agg1 = await aggregatorAccount1.loadData();

    assert(
      agg1.authority.equals(myAuth.publicKey),
      `AggregatorAuthorityMismatch, expected ${myAuth.publicKey}, received ${agg1.authority}`
    );
    const forceReportPeriod = agg1.forceReportPeriod.toNumber();
    console.log(`forceReportPeriod: ${forceReportPeriod}`);
    assert(
      forceReportPeriod === 3600,
      `AggregatorForceReportPeriodMismatch, expected 3600, received ${forceReportPeriod}`
    );
    const varianceThreshold = agg1.varianceThreshold.toBig().toNumber();
    console.log(`varianceThreshold: ${varianceThreshold}`);
    assert(
      varianceThreshold === 0.25,
      `AggregatorVarianceThresholdMismatch, expected 0.25 %, received ${varianceThreshold}`
    );
  });
});
