import 'mocha';

import * as sbv2 from '../src';
import { PermissionAccount, TransactionMissingSignerError } from '../src';
import { programConfig } from '../src/generated';

import { setupTest, TestContext } from './utils';

import { BN } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import assert from 'assert';

describe('Quote Tests', () => {
  let ctx: TestContext;

  let queueAccount: sbv2.QueueAccount;
  let oracleAccount: sbv2.OracleAccount;

  const mrEnclave = Array.from(Buffer.from('Mr. Enclave'))
    .concat(Array(64).fill(0))
    .slice(0, 64);

  before(async () => {
    ctx = await setupTest();
    const programStateData = await new sbv2.ProgramStateAccount(
      ctx.program,
      ctx.program.programState.publicKey
    ).loadData();

    [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      reward: 0,
      minStake: 0,
      enableTeeOnly: true,
    });
    [oracleAccount] = await queueAccount.createOracle({});

    ctx.program.signAndSend(
      new sbv2.TransactionObject(
        ctx.program.walletPubkey,
        [
          programConfig(
            ctx.program,
            {
              params: {
                token: PublicKey.default,
                bump: ctx.program.programState.bump,
                daoMint: PublicKey.default,
                addEnclaves: [mrEnclave],
                rmEnclaves: [],
              },
            },
            {
              authority: programStateData.authority,
              programState: ctx.program.programState.publicKey,
              daoMint: PublicKey.default,
            }
          ),
        ],
        []
      )
    );
  });

  it('Creates a TEE oracle', async () => {
    // Create attestation queue for the quote.
    const [attestationQueueAccount] = await sbv2.AttestationQueueAccount.create(
      ctx.program,
      {
        reward: 0,
        allowAuthorityOverrideAfter: 0,
        maxQuoteVerificationAge: 0,
        requireAuthorityHeartbeatPermission: false,
        requireUsagePermissions: false,
      }
    );
    // Create a quote.
    const [quoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      cid: undefined, // @TODO: Replace with proper cid.
      queueAccount: attestationQueueAccount,
    });
    // Verify the quote.
    await quoteAccount.verify({
      timestamp: new BN(Date.now()),
      mrEnclave: new Uint8Array(mrEnclave),
    });
    const queueData = await queueAccount.loadData();
    // Perform tee heartbeat.
    await oracleAccount.teeHeartbeat({
      gcOracle: PublicKey.default, // @TODO: Replace with proper pubkey.
      tokenWallet: PublicKey.default, // @TODO: Replace with proper pubkey.
      oracleQueue: queueAccount.publicKey,
      dataBuffer: queueData.dataBuffer,
      quote: quoteAccount.publicKey,
      permission: [], // @TODO: Replace with proper permission account and bump.
    });
  });
});
