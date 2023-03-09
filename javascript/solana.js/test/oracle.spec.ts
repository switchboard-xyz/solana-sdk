import 'mocha';

import * as sbv2 from '../src';
import {
  OracleAccount,
  PermissionAccount,
  QueueAccount,
  TransactionObject,
  types,
} from '../src';
import { SwitchboardPermission } from '../src/generated';

import { setupTest, TestContext } from './utils';

import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import assert from 'assert';

describe('OracleAccount Tests', () => {
  let ctx: TestContext;

  const queueAuthority = Keypair.generate();
  const oracleAuthority = Keypair.generate();

  let queueAccount: QueueAccount;
  let queue: types.OracleQueueAccountData;

  let oracleAccount: OracleAccount;
  let oracle: types.OracleAccountData;

  let oraclePermissionAccount: PermissionAccount;

  before(async () => {
    ctx = await setupTest();

    [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      name: 'q1',
      metadata: '',
      queueSize: 2,
      reward: 0.0025,
      minStake: 2,
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

    const transferToOracleAuthorityTxn = new TransactionObject(
      ctx.payer.publicKey,
      [
        SystemProgram.transfer({
          fromPubkey: ctx.payer.publicKey,
          toPubkey: oracleAuthority.publicKey,
          lamports: LAMPORTS_PER_SOL,
        }),
      ],
      []
    );
    await ctx.program.signAndSend(transferToOracleAuthorityTxn);
  });

  it('Creates an oracle account without permissions enabled', async () => {
    [oracleAccount] = await queueAccount.createOracle({
      name: 'oracle-1',
      metadata: 'oracle-1',
      queueAuthority,
      enable: false,
      authority: oracleAuthority,
    });
    oracle = await oracleAccount.loadData();
    assert(
      oracle.oracleAuthority.equals(oracleAuthority.publicKey),
      'Incorrect oracle authority'
    );

    [oraclePermissionAccount] = PermissionAccount.fromSeed(
      ctx.program,
      queueAuthority.publicKey,
      queueAccount.publicKey,
      oracleAccount.publicKey
    );
    const oraclePermissions = await oraclePermissionAccount.loadData();

    assert(
      oraclePermissions.permissions === 0,
      `Incorrect oracle permissions, expected PERMIT_NONE (0), received ${oraclePermissions.permissions}`
    );
  });

  it('Oracle fails to heartbeat if permissions are not enabled', async () => {
    await assert.rejects(async () => {
      await oracleAccount.heartbeat({
        queueAccount,
        authority: oracleAuthority,
      });
    }, new RegExp(/PermissionDenied|6035|0x1793/g));
  });

  it('Queue authority grants the oracle permissions', async () => {
    await oraclePermissionAccount.set({
      queueAuthority,
      enable: true,
      permission: new SwitchboardPermission.PermitOracleHeartbeat(),
    });
    const oraclePermissions = await oraclePermissionAccount.loadData();

    assert(
      oraclePermissions.permissions ===
        new SwitchboardPermission.PermitOracleHeartbeat().discriminator,
      `Incorrect oracle permissions, expected PERMIT_ORACLE_HEARTBEAT (${
        new SwitchboardPermission.PermitOracleHeartbeat().discriminator
      }), received ${oraclePermissions.permissions}`
    );
  });

  it('Oracle deposits funds to its staking wallet', async () => {
    const queueMinStake = ctx.program.mint.fromTokenAmountBN(queue.minStake);
    await oracleAccount.stake({
      stakeAmount: queueMinStake,
    });

    const oracleBalance = await oracleAccount.fetchBalance();

    assert(
      oracleBalance === queueMinStake,
      `Oracle stake amount mismatch, expected ${queueMinStake}, received ${oracleBalance}`
    );
  });

  it('Oracle heartbeats on-chain', async () => {
    await oracleAccount.heartbeat({ queueAccount, authority: oracleAuthority });
  });

  it('Oracle withdraws from staking wallet and unwraps funds', async () => {
    const queueMinStake = ctx.program.mint.fromTokenAmountBN(queue.minStake);
    const withdrawAmount = queueMinStake / 10;

    const initialOracleStakingBalance = await oracleAccount.fetchBalance();
    const initialOracleAuthorityBalance =
      (await ctx.program.connection.getBalance(oracleAuthority.publicKey)) /
      LAMPORTS_PER_SOL;

    await oracleAccount.withdraw({
      amount: withdrawAmount,
      authority: oracleAuthority,
      unwrap: true,
    });

    const finalOracleStakingBalance = await oracleAccount.fetchBalance();
    const finalOracleAuthorityBalance =
      (await ctx.program.connection.getBalance(oracleAuthority.publicKey)) /
      LAMPORTS_PER_SOL;

    // round to two decimal places
    const stakingBalanceDiff = ctx.round(
      finalOracleStakingBalance - initialOracleStakingBalance,
      2
    );
    const authorityBalanceDiff = ctx.round(
      finalOracleAuthorityBalance - initialOracleAuthorityBalance,
      2
    );

    assert(
      -1 * withdrawAmount === stakingBalanceDiff,
      `Oracle unstake difference mismatch, expected ${withdrawAmount}, received ${stakingBalanceDiff}`
    );

    assert(
      withdrawAmount === authorityBalanceDiff,
      `Oracle authority balance difference mismatch, expected ${withdrawAmount}, received ${authorityBalanceDiff}`
    );
  });
});
