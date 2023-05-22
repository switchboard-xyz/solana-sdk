import 'mocha';

import * as sbv2 from '../src';

import { setupTest, TestContext } from './utils';

import { Keypair } from '@solana/web3.js';
import assert from 'assert';

describe('Function Tests', () => {
  let ctx: TestContext;

  let attestationQueueAccount: sbv2.AttestationQueueAccount;
  let attestationQuoteVerifierAccount: sbv2.QuoteAccount;
  const quoteVerifierKeypair = Keypair.generate();

  const quoteVerifierMrEnclave = Array.from(
    Buffer.from('This is the quote verifier MrEnclave')
  )
    .concat(Array(32).fill(0))
    .slice(0, 32);

  let functionAccount: sbv2.FunctionAccount;

  const mrEnclave = Array.from(
    Buffer.from('This is the custom function MrEnclave')
  )
    .concat(Array(32).fill(0))
    .slice(0, 32);

  before(async () => {
    ctx = await setupTest();

    [attestationQueueAccount] = await sbv2.AttestationQueueAccount.create(
      ctx.program,
      {
        reward: 0,
        allowAuthorityOverrideAfter: 60, // should increase this
        maxQuoteVerificationAge: 604800,
        requireAuthorityHeartbeatPermission: false,
        requireUsagePermissions: false,
        nodeTimeout: 604800,
      }
    );

    await attestationQueueAccount.addMrEnclave({
      mrEnclave: new Uint8Array(quoteVerifierMrEnclave),
    });

    [attestationQuoteVerifierAccount] =
      await attestationQueueAccount.createQuote({
        registryKey: new Uint8Array(Array(64).fill(1)),
        keypair: quoteVerifierKeypair,
        enable: true,
        queueAuthorityPubkey: ctx.program.walletPubkey,
      });

    // join the queue so we can verify other quotes
    await attestationQuoteVerifierAccount.heartbeat({
      keypair: quoteVerifierKeypair,
    });
  });

  it('Creates a Function', async () => {
    const functionKeypair = Keypair.generate();

    [functionAccount] = await sbv2.FunctionAccount.create(
      ctx.program,
      {
        name: 'FUNCTION_NAME',
        metadata: 'FUNCTION_METADATA',
        schedule: '* * * * *',
        container: 'containerId',
        version: '1.0.0',
        mrEnclave,
        attestationQueue: attestationQueueAccount,
        keypair: functionKeypair,
      },
      { skipPreflight: true }
    );

    const myFunction = await functionAccount.loadData();
  });

  it('Fund the function', async () => {});

  it('Withdraw from the function', async () => {});
});
