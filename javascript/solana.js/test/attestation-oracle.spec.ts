import 'mocha';

import * as sbv2 from '../src';
import { PermissionAccount, TransactionMissingSignerError } from '../src';
import { programConfig } from '../src/generated';

import { setupTest, TestContext } from './utils';

import { BN } from '@coral-xyz/anchor';
import { NATIVE_MINT } from '@solana/spl-token';
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

    const daoMint = programStateData.daoMint.equals(PublicKey.default)
      ? NATIVE_MINT
      : programStateData.daoMint;

    ctx.program.signAndSend(
      new sbv2.TransactionObject(
        ctx.program.walletPubkey,
        [
          programConfig(
            ctx.program,
            {
              params: {
                token: programStateData.tokenMint,
                bump: ctx.program.programState.bump,
                daoMint: daoMint,
                addEnclaves: [mrEnclave],
                rmEnclaves: [],
              },
            },
            {
              authority: programStateData.authority,
              programState: ctx.program.programState.publicKey,
              daoMint: daoMint,
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

    assert(
      Buffer.compare(
        Buffer.from(
          attestationQueueState.mrEnclaves.slice(
            0,
            attestationQueueState.mrEnclavesLen
          )[0]
        ),
        Buffer.from(quoteVerifierMrEnclave)
      ) === 0,
      `Attestation queue does not have the correct MRENCLAVE`
    );

    [attestationQuoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      cid: new Uint8Array(Array(64).fill(1)),
      queueAccount: attestationQueueAccount,
      keypair: quoteKeypair,
    });

    const quoteState = await attestationQuoteAccount.loadData();
    const verificationStatus =
      sbv2.QuoteAccount.getVerificationStatus(quoteState);

    assert(
      verificationStatus.kind === 'VerificationOverride',
      `Quote account has not been verified`
    );

    // we do not need to verify because of the override
  });

  it('Creates a TEE oracle', async () => {
    const queueData = await queueAccount.loadData();

    const oracleData = await oracleAccount.loadData();

    [oracleQuoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      cid: new Uint8Array(Array(64).fill(1)),
      queueAccount: attestationQueueAccount,
      keypair: oracleQuoteKeypair,
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
