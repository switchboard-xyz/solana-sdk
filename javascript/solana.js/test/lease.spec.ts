import 'mocha';

import * as sbv2 from '../src';
import { setupTest, TestContext } from './utilts';
import { Keypair } from '@solana/web3.js';

describe('Lease Tests', () => {
  let ctx: TestContext;

  before(async () => {
    ctx = await setupTest();
  });

  const aggregator = Keypair.generate();
  const queue = Keypair.generate();

  it('Creates a Lease', async () => {
    const aggregatorAccount = new sbv2.AggregatorAccount(
      ctx.program,
      aggregator.publicKey
    );
    const queueAccount = new sbv2.QueueAccount(ctx.program, queue.publicKey);
    const [leaseAccount] = await sbv2.LeaseAccount.create(ctx.program, {
      aggregatorAccount,
      queueAccount,
      loadAmount: 0.01,
    });
    await leaseAccount.loadData();
  });
});
