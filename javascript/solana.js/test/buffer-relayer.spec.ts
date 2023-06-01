import "mocha";

import {
  BufferRelayerAccount,
  OracleAccount,
  QueueAccount,
  types,
} from "../src";

import { setupTest, TestContext } from "./utils";

import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/common";
import assert from "assert";

describe("BufferRelayer Tests", () => {
  let ctx: TestContext;

  const queueAuthority = Keypair.generate();
  let queueAccount: QueueAccount;

  let oracleAccount: OracleAccount;
  let oracle: types.OracleAccountData;

  let bufferAccount: BufferRelayerAccount;
  const expectedResult: Buffer = Buffer.from(
    JSON.stringify({
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    }),
    "utf-8"
  );

  let userTokenAddress: PublicKey;

  before(async () => {
    ctx = await setupTest();

    [queueAccount] = await QueueAccount.create(ctx.program, {
      name: "buffer-relayer-queue",
      metadata: "",
      authority: queueAuthority.publicKey,
      queueSize: 1,
      reward: 0,
      minStake: 0,
      oracleTimeout: 86400,
      slashingEnabled: false,
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: true,
    });

    [oracleAccount] = await queueAccount.createOracle({
      name: "oracle-1",
      metadata: "oracle-1",
      queueAuthority,
      enable: true,
    });
    await oracleAccount.heartbeat();
    oracle = await oracleAccount.loadData();

    assert(
      oracle.oracleAuthority.equals(ctx.payer.publicKey),
      "Incorrect oracle authority"
    );

    [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0.1 }
    );
  });

  it("Creates a Buffer Relayer", async () => {
    [bufferAccount] = await queueAccount.createBufferRelayer({
      name: "My Buffer",
      minUpdateDelaySeconds: 30,
      enable: true,
      queueAuthorityPubkey: queueAuthority.publicKey,
      queueAuthority: queueAuthority,
      job: {
        name: "Buffer Job",
        data: Buffer.from(
          OracleJob.encodeDelimited(
            OracleJob.create({
              tasks: [
                OracleJob.Task.create({
                  httpTask: OracleJob.HttpTask.create({
                    url: "https://jsonplaceholder.typicode.com/todos/1",
                  }),
                }),
              ],
            })
          ).finish()
        ),
      },
    });
  });

  it("Calls openRound on a BufferRelayer", async () => {
    if (!bufferAccount) {
      throw new Error(`No BufferRelayer account`);
    }

    await bufferAccount.openRound({
      tokenWallet: userTokenAddress,
    });

    const bufferRelayer = await bufferAccount.loadData();

    assert(
      bufferRelayer.currentRound.oraclePubkey.equals(oracleAccount.publicKey),
      `Oracle assignment mismatch, expected ${oracleAccount.publicKey}, received ${bufferRelayer.currentRound.oraclePubkey}`
    );
  });

  it("Calls saveResult on a BufferRelayer", async () => {
    if (!bufferAccount) {
      throw new Error(`No BufferRelayer account`);
    }

    await bufferAccount.saveResult({
      result: expectedResult,
      success: true,
    });

    const bufferRelayer = await bufferAccount.loadData();

    assert(
      Buffer.compare(expectedResult, bufferRelayer.result) === 0,
      `BufferRelayer result mismatch, expected [${new Uint8Array(
        expectedResult
      )}], received [${new Uint8Array(bufferRelayer.result)}]`
    );
  });
});
