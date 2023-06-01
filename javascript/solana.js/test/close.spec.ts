/* eslint-disable no-unused-vars */
import "mocha";

import * as sbv2 from "../src";
import { CrankAccount, QueueAccount } from "../src";

import { setupTest, TestContext } from "./utils";

import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleJob, sleep } from "@switchboard-xyz/common";
import assert from "assert";

describe("Close Aggregator Tests", () => {
  // let ctx: TestContext;
  // const queueAuthority = Keypair.generate();
  // let queueAccount: QueueAccount;
  // let payerTokenWallet: PublicKey;
  // let crankAccount: CrankAccount;
  // if (
  //   !process.env.SOLANA_CLUSTER ||
  //   process.env.SOLANA_CLUSTER !== 'mainnet-beta'
  // ) {
  //   before(async () => {
  //     ctx = await setupTest();
  //     [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
  //       name: 'aggregator-queue',
  //       metadata: '',
  //       authority: queueAuthority.publicKey,
  //       queueSize: 1,
  //       reward: 0,
  //       minStake: 0,
  //       oracleTimeout: 86400,
  //       slashingEnabled: false,
  //       unpermissionedFeeds: true,
  //       unpermissionedVrf: true,
  //       enableBufferRelayers: false,
  //     });
  //     [crankAccount] = await queueAccount.createCrank({
  //       maxRows: 10,
  //       name: 'Crank-1',
  //     });
  //     payerTokenWallet = await ctx.program.mint.getOrCreateAssociatedUser(
  //       ctx.program.walletPubkey
  //     );
  //     // add a single oracle for open round calls
  //     const [oracleAccount] = await queueAccount.createOracle({
  //       name: 'oracle-1',
  //       enable: true,
  //       queueAuthority: queueAuthority,
  //     });
  //     await oracleAccount.heartbeat();
  //   });
  //   it('Creates and closes an aggregator not on a crank', async () => {
  //     if (
  //       process.env.SOLANA_CLUSTER &&
  //       process.env.SOLANA_CLUSTER === 'mainnet-beta'
  //     ) {
  //     }
  //     const [aggregatorAccount] = await queueAccount.createFeed({
  //       queueAuthority: queueAuthority,
  //       batchSize: 1,
  //       minRequiredOracleResults: 1,
  //       minRequiredJobResults: 1,
  //       minUpdateDelaySeconds: 60,
  //       enable: true,
  //       historyLimit: 1000,
  //       slidingWindow: true,
  //       jobs: [
  //         {
  //           data: OracleJob.encodeDelimited(
  //             OracleJob.fromObject({
  //               tasks: [
  //                 {
  //                   valueTask: {
  //                     value: 1,
  //                   },
  //                 },
  //               ],
  //             })
  //           ).finish(),
  //           name: 'Job1',
  //         },
  //       ],
  //     });
  //     console.log(`Created aggregator ${aggregatorAccount.publicKey}`);
  //     const {
  //       permissionAccount,
  //       permissionBump,
  //       leaseAccount,
  //       leaseBump,
  //       leaseEscrow,
  //     } = aggregatorAccount.getAccounts(queueAccount, queueAuthority.publicKey);
  //     await sleep(1000);
  //     const initialAggregatorState = await aggregatorAccount.loadData();
  //     console.log(`loaded aggregator, ${aggregatorAccount.publicKey}`);
  //     const initialSlidingWindowAccountInfo =
  //       await aggregatorAccount.program.connection.getAccountInfo(
  //         aggregatorAccount.slidingWindowKey
  //       );
  //     console.log(`SlidingWindow: ${aggregatorAccount.slidingWindowKey}`);
  //     assert(
  //       initialSlidingWindowAccountInfo !== null,
  //       `SlidingWindowAccount was not initialized`
  //     );
  //     const closeTxn = await aggregatorAccount.closeInstructions(
  //       ctx.program.walletPubkey
  //     );
  //     const closeSig = await ctx.program.signAndSend(closeTxn, {
  //       skipPreflight: true,
  //     });
  //     console.log(closeSig);
  //     const parsedTxnLogs =
  //       await queueAccount.program.connection.getParsedTransaction(closeSig);
  //     console.log(
  //       JSON.stringify(parsedTxnLogs?.meta?.logMessages, undefined, 2)
  //     );
  //     const finalAggregatorState =
  //       await queueAccount.program.connection.getAccountInfo(
  //         aggregatorAccount.publicKey
  //       );
  //     assert(finalAggregatorState === null, 'AggregatorAccount was not closed');
  //     const finalPermissionState =
  //       await queueAccount.program.connection.getAccountInfo(
  //         permissionAccount.publicKey
  //       );
  //     assert(finalPermissionState === null, 'PermissionAccount was not closed');
  //     const finalLeaseState =
  //       await queueAccount.program.connection.getAccountInfo(
  //         leaseAccount.publicKey
  //       );
  //     assert(finalLeaseState === null, 'LeaseAccount was not closed');
  //     const finalSlidingWindowAccountInfo =
  //       await aggregatorAccount.program.connection.getAccountInfo(
  //         aggregatorAccount.slidingWindowKey
  //       );
  //     assert(
  //       finalSlidingWindowAccountInfo === null,
  //       `SlidingWindowAccount was not closed`
  //     );
  //   });
  //   it('Creates and closes an aggregator with a crank', async () => {
  //     const [aggregatorAccount] = await queueAccount.createFeed({
  //       queueAuthority: queueAuthority,
  //       batchSize: 1,
  //       minRequiredOracleResults: 1,
  //       minRequiredJobResults: 1,
  //       minUpdateDelaySeconds: 60,
  //       enable: true,
  //       crankPubkey: crankAccount.publicKey,
  //       historyLimit: 1000,
  //       jobs: [
  //         {
  //           data: OracleJob.encodeDelimited(
  //             OracleJob.fromObject({
  //               tasks: [
  //                 {
  //                   valueTask: {
  //                     value: 1,
  //                   },
  //                 },
  //               ],
  //             })
  //           ).finish(),
  //           name: 'Job1',
  //         },
  //       ],
  //     });
  //     console.log(`Created aggregator ${aggregatorAccount.publicKey}`);
  //     const {
  //       permissionAccount,
  //       permissionBump,
  //       leaseAccount,
  //       leaseBump,
  //       leaseEscrow,
  //     } = aggregatorAccount.getAccounts(queueAccount, queueAuthority.publicKey);
  //     console.log(`permission: ${permissionAccount.publicKey}`);
  //     const initialAggregatorState = await aggregatorAccount.loadData();
  //     const initialCrankRows = await crankAccount.loadCrank();
  //     const crankIdx = initialCrankRows.findIndex(r =>
  //       r.pubkey.equals(aggregatorAccount.publicKey)
  //     );
  //     assert(crankIdx !== -1, 'Aggregator initially missing from the crank');
  //     const closeTxn = await aggregatorAccount.closeInstructions(
  //       ctx.program.walletPubkey
  //     );
  //     const closeSig = await ctx.program.signAndSend(closeTxn, {
  //       skipPreflight: true,
  //     });
  //     console.log(closeSig);
  //     const parsedTxnLogs =
  //       await queueAccount.program.connection.getParsedTransaction(closeSig);
  //     console.log(
  //       JSON.stringify(parsedTxnLogs?.meta?.logMessages, undefined, 2)
  //     );
  //     const finalAggregatorState =
  //       await queueAccount.program.connection.getAccountInfo(
  //         aggregatorAccount.publicKey
  //       );
  //     assert(finalAggregatorState === null, 'AggregatorAccount was not closed');
  //     const finalPermissionState =
  //       await queueAccount.program.connection.getAccountInfo(
  //         permissionAccount.publicKey
  //       );
  //     assert(finalPermissionState === null, 'PermissionAccount was not closed');
  //     const finalLeaseState =
  //       await queueAccount.program.connection.getAccountInfo(
  //         leaseAccount.publicKey
  //       );
  //     assert(finalLeaseState === null, 'LeaseAccount was not closed');
  //     const finalCrankRows = await crankAccount.loadCrank();
  //     const newCrankIdx = finalCrankRows.findIndex(r =>
  //       r.pubkey.equals(aggregatorAccount.publicKey)
  //     );
  //     assert(newCrankIdx === -1, 'Aggregator is still on the crank');
  //   });
  // }
});
