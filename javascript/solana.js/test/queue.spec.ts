import 'mocha';
import assert from 'assert';

import * as sbv2 from '../src';
import { setupTest, TestContext } from './utilts';
import { Keypair } from '@solana/web3.js';
import { PermissionAccount } from '../src';

describe('Queue Tests', () => {
  let ctx: TestContext;

  before(async () => {
    ctx = await setupTest();
  });

  const queueAuthority = Keypair.generate();
  let queueAccount: sbv2.QueueAccount;

  it('Creates a Queue', async () => {
    [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      name: 'q1',
      metadata: '',
      queueSize: 2,
      reward: 0,
      minStake: 0,
      oracleTimeout: 60,
      slashingEnabled: false,
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: false,
      authority: queueAuthority.publicKey,
    });
    await queueAccount.loadData();
  });

  it('Adds an oracle to a queue', async () => {
    if (!queueAccount) {
      throw new Error('OracleQueue does not exist');
    }
    const oracleAuthority = Keypair.generate();
    // Create a new oracle
    const [oracleAccount] = await queueAccount.createOracle({
      name: 'oracle2',
      metadata: '',
      queueAuthority,
      enable: true,
      authority: oracleAuthority,
      stakeAmount: 2,
    });

    const oracle = await oracleAccount.loadData();
    const [permissionAccount] = PermissionAccount.fromSeed(
      ctx.program,
      queueAuthority.publicKey,
      queueAccount.publicKey,
      oracleAccount.publicKey
    );
    await permissionAccount.loadData();

    await oracleAccount.heartbeat({
      queueAccount,
      tokenWallet: oracle.tokenAccount,
      authority: oracleAuthority,
    });

    const oracles = await queueAccount.loadOracles();
    const idx = oracles.findIndex(o => o.equals(oracleAccount.publicKey));
    if (idx === -1) {
      throw new Error('Failed to push oracle #2 onto queue');
    }
  });

  it('Pushes a second oracle onto the queue', async () => {
    if (!queueAccount) {
      throw new Error('OracleQueue does not exist');
    }
    const oracleAuthority = Keypair.generate();

    // Create a new oracle
    const [oracleAccount] = await queueAccount.createOracle({
      name: 'oracle2',
      metadata: '',
      queueAuthority,
      enable: true,
      authority: oracleAuthority,
    });

    const oracle = await oracleAccount.loadData();

    await oracleAccount.heartbeat({
      queueAccount,
      tokenWallet: oracle.tokenAccount,
      authority: oracleAuthority,
    });

    const oracles = await queueAccount.loadOracles();

    const idx = oracles.findIndex(o => o.equals(oracleAccount.publicKey));
    if (idx === -1) {
      throw new Error('Failed to push oracle #2 onto queue');
    }
  });

  it('Fails to push oracle #3 - Queue Size Exceeded', async () => {
    if (!queueAccount) {
      throw new Error('OracleQueue does not exist');
    }
    const oracleAuthority = Keypair.generate();
    const tokenWallet = Keypair.generate();

    // Create a new oracle
    const [oracleAccount] = await queueAccount.createOracle({
      name: 'oracle3',
      metadata: '',
      queueAuthority,
      enable: true,
      authority: oracleAuthority,
    });

    await oracleAccount.loadData();

    assert.rejects(
      async () => {
        await oracleAccount.heartbeat({
          queueAccount,
          tokenWallet: tokenWallet.publicKey,
          authority: oracleAuthority,
        });
      },
      { code: 6001 }
    );
  });

  // it('Deposits into an oracle account', async () => {
  //   if (!queueAccount) {
  //     throw new Error('OracleQueue does not exist');
  //   }
  //   if (!oracle1Account) {
  //     throw new Error('oracleAccount does not exist');
  //   }

  //   // TODO: Handle wrapped funds
  // });
});
