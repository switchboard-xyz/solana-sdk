import 'mocha';
import chai, { expect } from 'chai';
import assert from 'assert';

import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import * as sbv2 from '../src';
import { setupTest, TestContext } from './utilts';
import { Keypair } from '@solana/web3.js';
import { PermissionAccount } from '../src';

describe('Queue Tests', () => {
  let ctx: TestContext;

  before(async () => {
    ctx = await setupTest();
  });

  let queueAccount: sbv2.QueueAccount;
  const queueAuthority = Keypair.generate();

  it('Creates a Queue', async () => {
    const [createQueueSignature, oracleQueue] = await sbv2.QueueAccount.create(
      ctx.program,
      {
        name: Buffer.from('q1'),
        metadata: Buffer.from(''),
        queueSize: 2,
        reward: new anchor.BN(0),
        minStake: new anchor.BN(0),
        oracleTimeout: 60,
        mint: spl.NATIVE_MINT,
        slashingEnabled: false,
        unpermissionedFeeds: true,
        unpermissionedVrf: true,
        enableBufferRelayers: false,
        authority: queueAuthority.publicKey,
      }
    );
    queueAccount = oracleQueue;
    const queue = await queueAccount.loadData();
  });

  it('Adds an oracle to a queue', async () => {
    if (!queueAccount) {
      throw new Error('OracleQueue does not exist');
    }
    const oracleAuthority = Keypair.generate();
    // Create a new oracle
    const [createOracleSignatures, oracleAccount] =
      await queueAccount.createOracle({
        name: 'oracle2',
        metadata: '',
        queueAuthority,
        enable: true,
        authority: oracleAuthority,
      });

    const oracle = await oracleAccount.loadData();
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      ctx.program,
      queueAuthority.publicKey,
      queueAccount.publicKey,
      oracleAccount.publicKey
    );

    const heartbeatSignature = await oracleAccount.heartbeat({
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
    const [createOracleSignatures, oracleAccount] =
      await queueAccount.createOracle({
        name: 'oracle2',
        metadata: '',
        queueAuthority,
        enable: true,
        authority: oracleAuthority,
      });

    const oracle = await oracleAccount.loadData();

    const heartbeatSignature = await oracleAccount.heartbeat({
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
    const [createOracleSignatures, oracleAccount] =
      await queueAccount.createOracle({
        name: 'oracle3',
        metadata: '',
        queueAuthority,
        enable: true,
        authority: oracleAuthority,
      });

    const oracle = await oracleAccount.loadData();

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
