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

  it('Creates a Queue', async () => {
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

  it('addMrEnclave', async () => {
    const mrEnclave = new Uint8Array([1, 2, 3]);
    await queueAccount.addMrEnclave({ mrEnclave, authority: queueAuthority });

    const expected = Array.from(mrEnclave)
      .concat(Array(32).fill(0))
      .slice(0, 32);
    const data = await queueAccount.loadData();
    assert(data.mrEnclavesLen === 1);
    assert(JSON.stringify(data.mrEnclaves[0]) === JSON.stringify(expected));

    await queueAccount.removeMrEnclave({
      mrEnclave,
      authority: queueAuthority,
    });
    const data2 = await queueAccount.loadData();
    assert(data2.mrEnclavesLen === 0);
  });
});
