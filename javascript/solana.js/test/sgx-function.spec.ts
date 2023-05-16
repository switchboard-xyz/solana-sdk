import 'mocha';

import * as sbv2 from '../src';
import { PermissionAccount, TransactionMissingSignerError } from '../src';

import { setupTest, TestContext } from './utils';

import { Keypair } from '@solana/web3.js';
import assert from 'assert';

describe('Function Tests', () => {
  let ctx: TestContext;

  let queueAccount: sbv2.QueueAccount;
  let quoteAccount: sbv2.QuoteAccount;
  let functionAccount: sbv2.FunctionAccount;

  before(async () => {
    ctx = await setupTest();

    [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      reward: 69420,
      allowAuthorityOverrideAfter: 321,
      maxQuoteVerificationAge: 123,
      requireAuthorityHeartbeatPermission: false,
      requireUsagePermissions: false,
      authority: Keypair.generate(),
    });
    [quoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      cid: new Uint8Array([1, 2, 3]),
      queueAccount,
    });
  });

  it('Creates a Function', async () => {
    [functionAccount] = await sbv2.FunctionAccount.create(ctx.program, {
      name: 'FUNCTION_NAME',
      metadata: 'FUNCTION_METADATA',
      schedule: '* * * * *',
      container: 'containerId',
      version: '1.0.0',
      quoteAccount,
    });

    const data = await quoteAccount.loadData();
    assert(data.isOnQueue === true);
    console.log(data);
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
