import 'mocha';

import * as sbv2 from '../src';
import { PermissionAccount, TransactionMissingSignerError } from '../src';
import { QueueAccount } from '../src/sgx_accounts';
import * as sgxTypes from '../src/sgx-generated';

import { setupTest, TestContext } from './utils';

import { Keypair } from '@solana/web3.js';
import assert from 'assert';

describe('SGX Quote Tests', () => {
  let ctx: TestContext;

  let queueAccount: sbv2.SgxAccounts.QueueAccount;
  let quoteAccount: sbv2.SgxAccounts.QuoteAccount;

  before(async () => {
    ctx = await setupTest();

    const queueAuthority = Keypair.generate();
    [queueAccount] = await sbv2.SgxAccounts.QueueAccount.create(ctx.program, {
      reward: 69420,
      allowAuthorityOverrideAfter: 321,
      maxQuoteVerificationAge: 123,
      requireAuthorityHeartbeatPermission: false,
      requireUsagePermissions: false,
      authority: queueAuthority,
    });
    // add a single oracle for open round calls
    await queueAccount.createOracle({
      name: 'oracle-1',
      enable: false,
      permission: new sgxTypes.SwitchboardPermission.PermitNodeheartbeat(),
      queueAuthorityPubkey: queueAuthority.publicKey,
    });
  });

  it('Creates a Quote', async () => {
    // const cid = new Uint8Array([1, 2, 3]);
    // [quoteAccount] = await sbv2.SgxAccounts.QuoteAccount.create(ctx.program, {
    //   queueAccount,
    //   cid,
    // });
    // const expected = Array.from(cid).concat(Array(64).fill(0)).slice(0, 64);
    // const data = await quoteAccount.loadData();
    // assert(data.isOnQueue === true);
    // console.log(data);
  });

  // it('addMrEnclave', async () => {
  //   const mrEnclave = new Uint8Array([1, 2, 3]);
  //   await queueAccount.addMrEnclave({ mrEnclave, authority: queueAuthority });

  //   const expected = Array.from(mrEnclave)
  //     .concat(Array(32).fill(0))
  //     .slice(0, 32);
  //   const data = await queueAccount.loadData();
  //   assert(data.mrEnclavesLen === 1);
  //   assert(JSON.stringify(data.mrEnclaves[0]) === JSON.stringify(expected));

  //   await queueAccount.removeMrEnclave({
  //     mrEnclave,
  //     authority: queueAuthority,
  //   });
  //   const data2 = await queueAccount.loadData();
  //   assert(data2.mrEnclavesLen === 0);
  // });
});
