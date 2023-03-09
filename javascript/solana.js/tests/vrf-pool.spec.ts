import { Keypair, PublicKey } from '@solana/web3.js';
import assert from 'assert';
import 'mocha';
import {
  OracleAccount,
  PermissionAccount,
  QueueAccount,
  TransactionObject,
  types,
  VrfLiteAccount,
  VrfPoolAccount,
} from '../src';
import { setupTest, TestContext } from './utils';

import { sleep } from '@switchboard-xyz/common';
import { NodeOracle } from '@switchboard-xyz/oracle';

describe('Vrf Pool Tests', () => {
  let ctx: TestContext;

  before(async () => {});

  let userTokenAddress: PublicKey;

  let queueAccount: QueueAccount;
  // const queueAuthorityKeypair = Keypair.generate();
  let queueAuthorityKeypair: Keypair;
  let oracle1: OracleAccount;
  let nodeOracle: NodeOracle;

  let vrfPoolAccount: VrfPoolAccount;
  let vrfLiteAccount: VrfLiteAccount;

  before(async () => {
    ctx = await setupTest();

    queueAuthorityKeypair = ctx.payer;

    [userTokenAddress] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.program.walletPubkey,
      { fundUpTo: 1 }
    );

    [queueAccount] = await QueueAccount.create(ctx.program, {
      name: 'q1',
      metadata: '',
      queueSize: 2,
      reward: 0,
      minStake: 0,
      oracleTimeout: 600,
      slashingEnabled: false,
      unpermissionedFeeds: false,
      unpermissionedVrf: true,
      enableBufferRelayers: false,
      authority: queueAuthorityKeypair.publicKey,
    });
    const queue = await queueAccount.loadData();
    assert(
      queue.authority.equals(queueAuthorityKeypair.publicKey),
      `Queue authority mismatch, expected ${queueAuthorityKeypair.publicKey}, received ${queue.authority}`
    );

    [oracle1] = await queueAccount.createOracle({
      name: 'Oracle 1',
      enable: true,
      queueAuthority: queueAuthorityKeypair,
    });
    await oracle1.heartbeat();
    await oracle1.loadData();

    nodeOracle = await NodeOracle.fromReleaseChannel({
      releaseChannel: 'testnet',
      chain: 'solana',
      network: 'localnet',
      rpcUrl: 'http://0.0.0.0:8899',
      oracleKey: oracle1.publicKey.toBase58(),
      secretPath: '~/.config/solana/id.json',
      silent: true,
    });

    chalkString('payer', ctx.program.walletPubkey.toBase58());
    chalkString('queueAuthority', queue.authority.toBase58());
    chalkString('QueueAccount', queueAccount.publicKey.toBase58());
    chalkString('OracleAccount', oracle1.publicKey.toBase58());

    await nodeOracle.startAndAwait(180); // gh actions can be slow to pull this
  });

  after(async () => {
    await nodeOracle?.stop();
  });

  describe('Vrf Pool Tests', () => {});

  it('Creates a Vrf Pool', async () => {
    [vrfPoolAccount] = await VrfPoolAccount.create(ctx.program, {
      maxRows: 100,
      minInterval: 60,
      queueAccount: queueAccount,
    });
    chalkString('VrfPool', vrfPoolAccount.publicKey.toBase58());
    await sleep(3000);
    const vrfPool = await vrfPoolAccount.loadData();
    console.log(vrfPool.toJSON());
    assert(vrfPool.size === 0, `VrfPoolSizeMismatch`);
  });

  it('Creates a VrfLiteAccount', async () => {
    [vrfLiteAccount] = await queueAccount.createVrfLite({
      enable: true,
      queueAuthority: queueAuthorityKeypair,
    });
    chalkString('VrfLite', vrfLiteAccount.publicKey.toBase58());

    const [permissionAccount] = PermissionAccount.fromSeed(
      ctx.program,
      queueAuthorityKeypair.publicKey,
      queueAccount.publicKey,
      vrfLiteAccount.publicKey
    );
    chalkString('VrfLitePermission', permissionAccount.publicKey.toBase58());

    const vrfLite = await vrfLiteAccount.loadData();
    const permission = await permissionAccount.loadData();
    console.log(permission.toJSON());
    assert(
      permission.permissions ===
        types.SwitchboardPermission.PermitVrfRequests.discriminator,
      `PermissionsMismatch, expected ${types.SwitchboardPermission.PermitVrfRequests.discriminator}, received ${permission.permissions}`
    );
  });

  it('Pushes a VrfLiteAccount on to a pool', async () => {
    const pushSig = await vrfPoolAccount.push({
      vrf: vrfLiteAccount,
    });
    const vrfPool = await vrfPoolAccount.loadData();

    chalkString('Size', vrfPool.pool.length);

    assert(vrfPool.size === 1, `VrfPoolSizeMismatch`);
  });

  it('Pops a VrfLiteAccount from a pool', async () => {
    const popSig = await vrfPoolAccount.pop();
    const vrfPool = await vrfPoolAccount.loadData();

    chalkString('Size', vrfPool.pool.length);

    assert(vrfPool.size === 0, `VrfPoolSizeMismatch`);
  });

  it('Re-pushes a VrfLiteAccount on to a pool', async () => {
    const pushSig = await vrfPoolAccount.push({
      vrf: vrfLiteAccount,
    });
    const vrfPool = await vrfPoolAccount.loadData();

    chalkString('Size', vrfPool.pool.length);

    assert(vrfPool.size === 1, `VrfPoolSizeMismatch`);
  });

  it('Adds new VRF Lite account to pool', async () => {
    const [newVrfLiteAccount] = await queueAccount.createVrfLite({
      queueAuthority: queueAuthorityKeypair,
      enable: true,
    });
    const newVrfLite = await vrfLiteAccount.loadData();
    chalkString('New VrfLite', newVrfLiteAccount.publicKey.toBase58());

    // const permissionAccount = await newVrfLiteAccount.permissionAccount;
    // chalkString(
    //   "New VrfLitePermission",
    //   permissionAccount.publicKey.toBase58()
    // );

    const pushSig = await vrfPoolAccount.push({
      vrf: newVrfLiteAccount,
    });
    const vrfPool = await vrfPoolAccount.loadData();

    chalkString('Size', vrfPool.pool.length);

    assert(vrfPool.size === 2, `VrfPoolSizeMismatch`);
  });

  it('Requests randomness from the VRF Pool', async () => {
    chalkString(
      'lastRequest',
      (await vrfLiteAccount.loadData()).requestTimestamp.toNumber()
    );

    const transferSig = await vrfPoolAccount.deposit({
      tokenWallet: userTokenAddress,
      amount: 0.1,
    });

    console.log((await vrfPoolAccount.loadData()).pool.map(r => r.toJSON()));

    const [event, signature] = await vrfPoolAccount.requestAndAwaitEvent({});
    console.log(signature);
    const newVrfLiteState: types.VrfLiteAccountData =
      await vrfLiteAccount.awaitRandomness({
        requestSlot: event.slot,
      });

    console.log(
      `Status: ${newVrfLiteState.status.kind} (${newVrfLiteState.status.discriminator})`
    );

    assert(
      newVrfLiteState.status.kind ===
        types.VrfStatus.StatusCallbackSuccess.kind ||
        newVrfLiteState.status.kind === types.VrfStatus.StatusVerified.kind,
      `VrfLiteStatusMismatch`
    );

    assert(
      !newVrfLiteState.result.every(val => val === 0),
      `VrfLiteResultMissing`
    );
  });

  it('Fails to request randomness back-to-back', async () => {
    const signature = await vrfPoolAccount.request();
    console.log('completed first request', signature);

    await assert.rejects(async () => {
      await vrfPoolAccount.request();
      console.log('completed second request');
    }, new RegExp(/VrfPoolRequestTooSoon|6096/g));
  });

  it('Create a VrfAccount and request randomness', async () => {
    const [vrfAccount] = await queueAccount.createVrf({
      vrfKeypair: Keypair.generate(),
      callback: {
        programId: PublicKey.default,
        accounts: [],
        ixData: Buffer.from(''),
      },
      enable: true,
      queueAuthority: queueAuthorityKeypair,
    });
    const [permissionAccount] = PermissionAccount.fromSeed(
      ctx.program,
      queueAuthorityKeypair.publicKey,
      queueAccount.publicKey,
      vrfAccount.publicKey
    );

    chalkString('VrfAccount', vrfAccount.publicKey.toBase58());
    chalkString('PermissionAccount', permissionAccount.publicKey.toBase58());

    // await sleep(3000);

    const vrfData = await vrfAccount.loadData();
    console.log((await permissionAccount.loadData()).toJSON());

    const [newVrfState] = await vrfAccount.requestAndAwaitResult({
      payerTokenWallet: userTokenAddress,
      vrf: vrfData,
      queueAccount: queueAccount,
      queue: await queueAccount.loadData(),
    });

    assert(
      newVrfState.status.kind === 'StatusVerified' ||
        newVrfState.status.kind === 'StatusCallbackSuccess',
      'VrfStatusMismatch'
    );
  });

  describe('Closes VrfAccounts', () => {
    it('Closes a VrfLite and permission account', async () => {
      const [myVrfLiteAccount] = await queueAccount.createVrfLite({
        // keypair: vrfLiteKeypair,
        enable: true,
        queueAuthority: queueAuthorityKeypair,
      });

      chalkString('VrfLite', myVrfLiteAccount.publicKey.toBase58());
      const [permissionAccount] = PermissionAccount.fromSeed(
        ctx.program,
        queueAuthorityKeypair.publicKey,
        queueAccount.publicKey,
        myVrfLiteAccount.publicKey
      );

      await sleep(3000);
      await myVrfLiteAccount.deposit({ amount: 0.05 });
      const vrfLite = await myVrfLiteAccount.loadData();
      const permissions = await permissionAccount.loadData();

      // close account

      const closeSignature = await myVrfLiteAccount.closeAccount();
      console.log(closeSignature);

      // await sleep(15000);
      // const vrfLiteAccountInfo = await ctx.program.connection.getAccountInfo(
      //   vrfLiteAccount.publicKey,
      //   { commitment: "single" }
      // );
      // assert(
      //   vrfLiteAccountInfo === null,
      //   `VrfLiteAccount not closed, expected null, received ${JSON.stringify(
      //     vrfLiteAccountInfo
      //   )}`
      // );
      // const permissionAccountInfo = await ctx.program.connection.getAccountInfo(
      //   permissionAccount.publicKey,
      //   { commitment: "single" }
      // );
      // assert(permissionAccountInfo === null, "PermissionAccount not closed");
    });

    it('Create and closes a VrfAccount', async () => {
      const [vrfAccount] = await queueAccount.createVrf({
        vrfKeypair: Keypair.generate(),
        callback: {
          programId: PublicKey.default,
          accounts: [],
          ixData: Buffer.from(''),
        },
        enable: true,
        queueAuthority: queueAuthorityKeypair,
      });
      const [permissionAccount] = PermissionAccount.fromSeed(
        ctx.program,
        queueAuthorityKeypair.publicKey,
        queueAccount.publicKey,
        vrfAccount.publicKey
      );

      chalkString('VrfAccount', vrfAccount.publicKey.toBase58());
      chalkString('PermissionAccount', permissionAccount.publicKey.toBase58());

      // await sleep(3000);

      const vrfDataBefore = await vrfAccount.loadData();

      const closeAccountSig = await vrfAccount.closeAccount();
      console.log(closeAccountSig);

      const vrfAccountInfo = await ctx.program.connection.getAccountInfo(
        vrfAccount.publicKey,
        'processed'
      );
      assert(vrfAccountInfo === null, 'VrfAccountNotClosed');
    });
  });

  describe('Cycles through a VrfPool', () => {
    it('Creates a 10 row VrfPool and cycles through them', async () => {
      const POOL_SIZE = 10;
      const [bigVrfPoolAccount] = await VrfPoolAccount.create(ctx.program, {
        maxRows: POOL_SIZE,
        minInterval: 0, // no delay if ready
        queueAccount: queueAccount,
      });
      chalkString('VrfPool', bigVrfPoolAccount.publicKey.toBase58());
      await sleep(3000);
      const initialVrfPool = await bigVrfPoolAccount.loadData();

      const txns: Array<[VrfLiteAccount, TransactionObject]> =
        await Promise.all(
          Array.from(Array(POOL_SIZE).keys()).map(async n => {
            const [vrfLiteAccount, vrfLiteInit] =
              await bigVrfPoolAccount.pushNewInstruction(ctx.payer.publicKey, {
                enable: true,
                queueAuthority: queueAuthorityKeypair,
              });

            return [vrfLiteAccount, vrfLiteInit];
          })
        );

      const packed = TransactionObject.pack(txns.map(t => t[1]));
      await TransactionObject.signAndSendAll(
        ctx.program.provider,
        packed,
        { skipPreflight: true },
        undefined,
        10
      );

      await sleep(5000);

      const newVrfPool = await bigVrfPoolAccount.loadData();

      const pool = [...newVrfPool.pool];

      assert(newVrfPool.pool.length === POOL_SIZE, 'VrfPoolSizeMismatch');

      const [tokenWallet] = await ctx.program.mint.getOrCreateWrappedUser(
        ctx.program.walletPubkey,
        {
          amount: POOL_SIZE * 2 * 0.002,
        }
      );

      await bigVrfPoolAccount.deposit({
        tokenWallet,
        amount: POOL_SIZE * 2 * 0.002,
      });

      let vrfPool = newVrfPool;
      let ws: number | undefined = bigVrfPoolAccount.onChange(updVrfPool => {
        vrfPool = updVrfPool;
      });

      for await (const n of Array.from(
        Array(Math.ceil(POOL_SIZE * 1.25)).keys()
      )) {
        const idx = n % pool.length;
        assert(vrfPool.idx === idx, 'VrfPoolIdxMismatch');

        const [event, signature] =
          await bigVrfPoolAccount.requestAndAwaitEvent();

        const vrfLiteAccount = new VrfLiteAccount(
          bigVrfPoolAccount.program,
          pool[idx].pubkey
        );
        assert(
          event.vrfPubkey.equals(vrfLiteAccount.publicKey),
          'VrfRowMismatch'
        );

        await sleep(1500);
        const nextIdx = (idx + 1) % pool.length;
        assert(vrfPool.idx === nextIdx, 'VrfPoolIdxMismatch');
      }

      if (ws) {
        await bigVrfPoolAccount.program.connection
          .removeAccountChangeListener(ws)
          .then(() => {
            ws = undefined;
          })
          .catch();
      }

      return;
    });
  });
});

const chalkString = (
  key: string,
  value: string | number | boolean | PublicKey
) =>
  console.log(
    `\x1b[34m${key.padEnd(16, ' ')}\x1b[0m : \x1b[33m${value}\x1b[0m`
  );
