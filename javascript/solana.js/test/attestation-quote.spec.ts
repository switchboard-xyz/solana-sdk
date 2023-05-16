import 'mocha';

import * as sbv2 from '../src';

import { setupTest, TestContext } from './utils';

import { Keypair } from '@solana/web3.js';
import assert from 'assert';

describe('SGX Quote Tests', () => {
  let ctx: TestContext;

  let oldQueueAccount: sbv2.QueueAccount;
  let queueAccount: sbv2.AttestationQueueAccount;
  let quoteAccount: sbv2.QuoteAccount;

  before(async () => {
    ctx = await setupTest();

    const queueAuthority = Keypair.generate();
    [queueAccount] = await sbv2.AttestationQueueAccount.create(ctx.program, {
      reward: 69420,
      allowAuthorityOverrideAfter: 321,
      maxQuoteVerificationAge: 123,
      requireAuthorityHeartbeatPermission: false,
      requireUsagePermissions: false,
      authority: queueAuthority,
    });

    [oldQueueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      reward: 0,
      minStake: 0,
      enableTeeOnly: true,
    });
  });

  it('Creates a Quote', async () => {
    const cid = new Uint8Array([1, 2, 3]);
    [quoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      queueAccount,
      cid,
    });
    const expected = Array.from(cid).concat(Array(64).fill(0)).slice(0, 64);
    const data = await quoteAccount.loadData();
    assert(data.isOnQueue === true);
    console.log(data);
  });
});
