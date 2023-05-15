import 'mocha';

import * as sbv2 from '../src';
import { PermissionAccount, TransactionMissingSignerError } from '../src';
import * as sgxTypes from '../src/sgx-generated';

import { setupTest, TestContext } from './utils';

import { Keypair } from '@solana/web3.js';
import assert from 'assert';

describe('SGX Queue Tests', () => {
  let ctx: TestContext;

  before(async () => (ctx = await setupTest()));

  const queueAuthority = Keypair.generate();
  let queueAccount: sbv2.SgxAccounts.QueueAccount;

  const oracleAuthority = Keypair.generate();
  let oracleAccount: sbv2.OracleAccount;

  it('Creates a Queue', async () => {
    const [_, txn] = sbv2.SgxAccounts.QueueAccount.createInstruction(
      ctx.program,
      ctx.program.walletPubkey,
      {
        reward: 69420,
        allowAuthorityOverrideAfter: 321,
        maxQuoteVerificationAge: 123,
        requireAuthorityHeartbeatPermission: true,
        requireUsagePermissions: true,
        authority: queueAuthority,
      }
    );

    const firstIxn = txn.ixns[0];

    assert(
      Buffer.compare(
        firstIxn.data.slice(0, 8),
        Buffer.from([144, 18, 99, 145, 133, 27, 207, 13])
      ) === 0,
      `QueueInit discriminator mismatch, expected [144, 18, 99, 145, 133, 27, 207, 13], received [${new Uint8Array(
        firstIxn.data.slice(0, 8)
      )}]`
    );

    [queueAccount] = await sbv2.SgxAccounts.QueueAccount.create(ctx.program, {
      reward: 69420,
      allowAuthorityOverrideAfter: 321,
      maxQuoteVerificationAge: 123,
      requireAuthorityHeartbeatPermission: true,
      requireUsagePermissions: true,
      authority: queueAuthority,
    });

    const data = await queueAccount.loadData();
    assert(data.reward === 69420);
    assert(data.allowAuthorityOverrideAfter.eqn(321));
    assert(data.maxQuoteVerificationAge.eqn(123));
    assert(data.requireAuthorityHeartbeatPermission === true);
    assert(data.requireUsagePermissions === true);
    assert(data.authority.equals(queueAuthority.publicKey));
  });

  // it('Adds an oracle to a queue', async () => {
  //   if (!queueAccount) {
  //     throw new Error('OracleQueue does not exist');
  //   }

  //   // Create a new oracle
  //   [oracleAccount] = await queueAccount.createOracle({
  //     name: 'oracle2',
  //     metadata: '',
  //     queueAuthority,
  //     enable: true,
  //     authority: oracleAuthority,
  //     stakeAmount: 2,
  //   });

  //   const oracle = await oracleAccount.loadData();
  //   const [permissionAccount] = PermissionAccount.fromSeed(
  //     ctx.program,
  //     queueAuthority.publicKey,
  //     queueAccount.publicKey,
  //     oracleAccount.publicKey
  //   );
  //   await permissionAccount.loadData();

  //   await oracleAccount.heartbeat({
  //     queueAccount,
  //     tokenWallet: oracle.tokenAccount,
  //     authority: oracleAuthority,
  //   });

  //   const oracles = await queueAccount.loadOracles();
  //   const idx = oracles.findIndex(o => o.equals(oracleAccount.publicKey));
  //   if (idx === -1) {
  //     throw new Error('Failed to push oracle #2 onto queue');
  //   }
  // });

  // it('Pushes a second oracle onto the queue', async () => {
  //   if (!queueAccount) {
  //     throw new Error('OracleQueue does not exist');
  //   }
  //   const oracleAuthority = Keypair.generate();

  //   // Create a new oracle
  //   const [oracleAccount] = await queueAccount.createOracle({
  //     name: 'oracle2',
  //     metadata: '',
  //     queueAuthority,
  //     enable: true,
  //     authority: oracleAuthority,
  //   });

  //   const oracle = await oracleAccount.loadData();

  //   await oracleAccount.heartbeat({
  //     queueAccount,
  //     tokenWallet: oracle.tokenAccount,
  //     authority: oracleAuthority,
  //   });

  //   const oracles = await queueAccount.loadOracles();

  //   const idx = oracles.findIndex(o => o.equals(oracleAccount.publicKey));
  //   if (idx === -1) {
  //     throw new Error('Failed to push oracle #2 onto queue');
  //   }
  // });

  // it('Fails to push oracle #3 - Queue Size Exceeded', async () => {
  //   if (!queueAccount) {
  //     throw new Error('OracleQueue does not exist');
  //   }
  //   const oracleAuthority = Keypair.generate();

  //   // Create a new oracle
  //   const [oracleAccount] = await queueAccount.createOracle({
  //     name: 'oracle3',
  //     metadata: '',
  //     queueAuthority,
  //     enable: true,
  //     authority: oracleAuthority,
  //   });

  //   const oracle = await oracleAccount.loadData();

  //   await assert.rejects(async () => {
  //     await oracleAccount.heartbeat({
  //       queueAccount,
  //       tokenWallet: oracle.tokenAccount,
  //       authority: oracleAuthority,
  //     });
  //   }, new RegExp(/QueueOperationError|6001|0x1771/g));
  // });

  // it('Deposits into an oracle staking wallet', async () => {
  //   if (!queueAccount) {
  //     throw new Error('OracleQueue does not exist');
  //   }
  //   if (!oracleAccount) {
  //     throw new Error('oracleAccount does not exist');
  //   }

  //   const STAKE_AMOUNT = 1.25;

  //   const oracle = await oracleAccount.loadData();

  //   const initialStakeBalance = await oracleAccount.fetchBalance(
  //     oracle.tokenAccount
  //   );

  //   await oracleAccount.stake({
  //     stakeAmount: STAKE_AMOUNT,
  //     tokenAccount: oracle.tokenAccount,
  //   });

  //   const finalStakeBalance = await oracleAccount.fetchBalance(
  //     oracle.tokenAccount
  //   );

  //   assert(
  //     finalStakeBalance === initialStakeBalance + STAKE_AMOUNT,
  //     `Oracle token balance mismatch, expected ${
  //       initialStakeBalance + STAKE_AMOUNT
  //     }, received ${finalStakeBalance}`
  //   );
  // });

  // it('Fails to withdraw if authority is missing', async () => {
  //   if (!queueAccount) {
  //     throw new Error('OracleQueue does not exist');
  //   }
  //   if (!oracleAccount) {
  //     throw new Error('oracleAccount does not exist');
  //   }

  //   await assert.rejects(async () => {
  //     await oracleAccount.withdraw({
  //       amount: 1,
  //       unwrap: false,
  //     });
  //   }, TransactionMissingSignerError);
  // });

  // it('Withdraws from an oracle staking wallet', async () => {
  //   if (!queueAccount) {
  //     throw new Error('OracleQueue does not exist');
  //   }
  //   if (!oracleAccount) {
  //     throw new Error('oracleAccount does not exist');
  //   }

  //   const WITHDRAW_AMOUNT = 0.55;

  //   const oracle = await oracleAccount.loadData();

  //   const initialStakeBalance = await oracleAccount.fetchBalance(
  //     oracle.tokenAccount
  //   );

  //   await oracleAccount.withdraw({
  //     amount: WITHDRAW_AMOUNT,
  //     authority: oracleAuthority,
  //     unwrap: false,
  //   });

  //   const finalStakeBalance = await oracleAccount.fetchBalance(
  //     oracle.tokenAccount
  //   );

  //   assert(
  //     finalStakeBalance === initialStakeBalance - WITHDRAW_AMOUNT,
  //     `Oracle token balance mismatch, expected ${
  //       initialStakeBalance - WITHDRAW_AMOUNT
  //     }, received ${finalStakeBalance}`
  //   );
  // });
});
