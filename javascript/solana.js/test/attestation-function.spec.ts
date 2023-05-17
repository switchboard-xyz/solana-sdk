import 'mocha';

import * as sbv2 from '../src';

import { setupTest, TestContext } from './utils';

import { Keypair } from '@solana/web3.js';
import assert from 'assert';

describe('SGX Function Tests', () => {
  let ctx: TestContext;

  let queueAccount: sbv2.AttestationQueueAccount;
  let quoteAccount: sbv2.QuoteAccount;
  let functionAccount: sbv2.FunctionAccount;

  before(async () => {
    ctx = await setupTest();

    [queueAccount] = await sbv2.AttestationQueueAccount.create(ctx.program, {
      reward: 69420,
      allowAuthorityOverrideAfter: 321,
      maxQuoteVerificationAge: 123,
      requireAuthorityHeartbeatPermission: false,
      requireUsagePermissions: false,
      authority: Keypair.generate(),
    });
    [quoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      registryKey: new Uint8Array([1, 2, 3]),
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

  it('Fund the function', async () => {});

  it('Withdraw from the function', async () => {});
});
