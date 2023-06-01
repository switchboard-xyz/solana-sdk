import "mocha";

import * as sbv2 from "../src";
import {
  AggregatorAccount,
  JobAccount,
  LeaseAccount,
  QueueAccount,
} from "../src";

import { setupTest, TestContext } from "./utils";

import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/common";
import assert from "assert";

describe("Lease Tests", () => {
  let ctx: TestContext;

  const jobData = OracleJob.encodeDelimited(
    OracleJob.fromObject({
      tasks: [
        {
          valueTask: {
            value: 1337,
          },
        },
      ],
    })
  ).finish();

  const queueAuthority = Keypair.generate();
  let queueAccount: QueueAccount;

  const jobAuthority1 = Keypair.generate();
  let jobAccount1: JobAccount;

  const jobAuthority2 = Keypair.generate();
  let jobAccount2: JobAccount;

  let aggregatorAccount: AggregatorAccount;

  let userTokenAddress: PublicKey;

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

    [jobAccount1] = await JobAccount.create(ctx.program, {
      authority: jobAuthority1,
      data: jobData,
      weight: 1,
    });

    [jobAccount2] = await JobAccount.create(ctx.program, {
      authority: jobAuthority2,
      data: jobData,
      weight: 1,
    });

    [aggregatorAccount] = await AggregatorAccount.create(ctx.program, {
      queueAccount: queueAccount,
      queueAuthority: queueAuthority.publicKey,
      batchSize: 2,
      minRequiredOracleResults: 2,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 5,
    });

    [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0.1 }
    );
  });

  it("Creates a Lease", async () => {
    const fundAmount = 0.025;

    const [leaseAccount] = await sbv2.LeaseAccount.create(ctx.program, {
      aggregatorAccount,
      queueAccount,
      fundAmount: fundAmount,
      funderTokenWallet: userTokenAddress,
    });

    await leaseAccount.loadData();

    const leaseBalance = await leaseAccount.fetchBalance();

    assert(
      leaseBalance === fundAmount,
      `Incorrect lease balance, expected ${fundAmount} wSOL, received ${leaseBalance}`
    );
  });

  it("Extends a Lease", async () => {
    const [leaseAccount] = LeaseAccount.fromSeed(
      ctx.program,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
    );

    const initialLeaseBalance = await leaseAccount.fetchBalance();

    await leaseAccount.extend({
      fundAmount: 0.075,
      funderTokenWallet: userTokenAddress,
    });

    const expectedFinalBalance = initialLeaseBalance + 0.075;
    const finalBalance = await leaseAccount.fetchBalance();

    assert(
      finalBalance === expectedFinalBalance,
      `Incorrect lease balance, expected ${expectedFinalBalance} wSOL, received ${finalBalance}`
    );
  });
});
