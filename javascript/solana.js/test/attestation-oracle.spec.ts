import 'mocha';

import * as sbv2 from '../src';
import { PermissionAccount, TransactionMissingSignerError } from '../src';
import { programConfig } from '../src/generated';

import { setupTest, TestContext } from './utils';

import { BN } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import assert from 'assert';

describe('Attestation Oracle Tests', () => {
  let ctx: TestContext;

  let queueAccount: sbv2.QueueAccount;
  let oracleAccount: sbv2.OracleAccount;
  let oraclePermissionAccount: sbv2.PermissionAccount;
  let oraclePermissionBump: number;
  let oracleQuoteAccount: sbv2.QuoteAccount;
  const oracleQuoteKeypair = Keypair.generate();

  let attestationQueueAccount: sbv2.AttestationQueueAccount;
  const quoteKeypair = Keypair.generate();
  let attestationQuoteAccount: sbv2.QuoteAccount;

  const quoteVerifierMrEnclave = Array.from(
    Buffer.from('This is the quote verifier MrEnclave')
  )
    .concat(Array(32).fill(0))
    .slice(0, 32);

  const mrEnclave = Array.from(
    Buffer.from('This is the NodeJS oracle MrEnclave')
  )
    .concat(Array(32).fill(0))
    .slice(0, 32);

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

    [oraclePermissionAccount, oraclePermissionBump] =
      oracleAccount.getPermissionAccount(
        queueAccount.publicKey,
        ctx.program.walletPubkey
      );
  });

  it('Creates an Attestation Queue', async () => {
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

    const attestationQueueState = await attestationQueueAccount.loadData();
    console.log(
      attestationQueueState.mrEnclaves.slice(
        0,
        attestationQueueState.mrEnclavesLen
      )
    );

    [attestationQuoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      cid: new Uint8Array(Array(64).fill(1)),
      queueAccount: attestationQueueAccount,
      keypair: quoteKeypair,
    });

    const quoteState = await attestationQuoteAccount.loadData();
    console.log(sbv2.QuoteAccount.getVerificationStatus(quoteState));

    console.log(new Uint8Array(quoteVerifierMrEnclave));

    // try {
    await attestationQuoteAccount.verify({
      timestamp: new BN(Math.floor(Date.now() / 1000)),
      mrEnclave: new Uint8Array(quoteVerifierMrEnclave),
      verifierKeypair: quoteKeypair,
    });
    // } catch (verifyError) {
    //   console.log((verifyError as any).logs);
    //   throw verifyError;
    // }

    // add itself since requireAuthorityHeartbeatPermission is false
    await attestationQuoteAccount.heartbeat();
  });

  it('Creates a TEE oracle', async () => {
    const queueData = await queueAccount.loadData();

    const oracleData = await oracleAccount.loadData();

    [oracleQuoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      cid: new Uint8Array(Array(64).fill(1)),
      queueAccount: attestationQueueAccount,
      keypair: quoteKeypair,
    });

    await oracleQuoteAccount.verify({
      timestamp: new BN(Math.floor(Date.now() / 1000)),
      mrEnclave: new Uint8Array(mrEnclave),
      verifierKeypair: quoteKeypair,
    });

    // // Perform tee heartbeat.
    // await oracleAccount.teeHeartbeat({
    //   gcOracle: PublicKey.default, // @TODO: Replace with proper pubkey.
    //   tokenWallet: oracleData.tokenAccount,
    //   oracleQueue: queueAccount.publicKey,
    //   dataBuffer: queueData.dataBuffer,
    //   quote: quoteAccount.publicKey,
    //   permission: [oraclePermissionAccount, oraclePermissionBump],
    // });
  });
});
