import 'mocha';

import * as sbv2 from '../src';
import { programConfig } from '../src/generated';

import { setupTest, TestContext } from './utils';

import { BN } from '@coral-xyz/anchor';
import { NATIVE_MINT, transfer } from '@solana/spl-token';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import { Big, OracleJob, sleep } from '@switchboard-xyz/common';
import assert from 'assert';

describe('Attestation Oracle Tests', () => {
  let ctx: TestContext;

  let queueAccount: sbv2.QueueAccount;
  let oracleAccount: sbv2.OracleAccount;
  let oracleQuoteAccount: sbv2.QuoteAccount;

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
    [oracleAccount] = await queueAccount.createOracle({
      enable: true,
      queueAuthorityPubkey: ctx.program.walletPubkey,
    });

    if (
      sbv2.ProgramStateAccount.findEnclaveIdx(
        programStateData.mrEnclaves.map(e => new Uint8Array(e)),
        new Uint8Array(mrEnclave)
      ) === -1
    ) {
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
    }
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

    [attestationQuoteAccount] = await attestationQueueAccount.createQuote({
      registryKey: new Uint8Array(Array(64).fill(1)),
      keypair: quoteKeypair,
      enable: true,
      queueAuthorityPubkey: ctx.program.walletPubkey,
    });
    const quoteState = await attestationQuoteAccount.loadData();
    const verificationStatus =
      sbv2.QuoteAccount.getVerificationStatus(quoteState);
    assert(
      verificationStatus.kind === 'VerificationOverride',
      `Quote account has not been verified`
    );

    // join the queue so we can verify other quotes
    await attestationQuoteAccount.heartbeat({ keypair: quoteKeypair });

    const payer2 = Keypair.generate();

    await ctx.program.signAndSend(
      new sbv2.TransactionObject(
        ctx.payer.publicKey,
        [
          SystemProgram.transfer({
            fromPubkey: ctx.payer.publicKey,
            toPubkey: payer2.publicKey,
            lamports: LAMPORTS_PER_SOL,
          }),
        ],
        []
      )
    );

    const quoteKeypair2 = Keypair.generate();
    const [attestationQuoteAccount2] =
      await attestationQueueAccount.createQuote({
        registryKey: new Uint8Array(Array(64).fill(1)),
        keypair: quoteKeypair2,
        enable: true,
        queueAuthorityPubkey: ctx.program.walletPubkey,
        owner: payer2.publicKey,
      });

    await attestationQuoteAccount2.verify({
      timestamp: new BN(Math.floor(Date.now() / 1000)),
      mrEnclave: new Uint8Array(quoteVerifierMrEnclave),
      verifierKeypair: quoteKeypair,
    });
    const quoteState2 = await attestationQuoteAccount2.loadData();
    const verificationStatus2 =
      sbv2.QuoteAccount.getVerificationStatus(quoteState2);
    assert(
      verificationStatus2.kind === 'VerificationSuccess',
      `Quote account has not been verified`
    );

    // join the queue so we can verify the overrridden quote
    await attestationQuoteAccount2.heartbeat({ keypair: quoteKeypair2 });

    await attestationQuoteAccount.verify({
      timestamp: new BN(Math.floor(Date.now() / 1000)),
      mrEnclave: new Uint8Array(quoteVerifierMrEnclave),
      verifierKeypair: quoteKeypair2,
    });
    const newQuoteState = await attestationQuoteAccount.loadData();
    const newVerificationStatus =
      sbv2.QuoteAccount.getVerificationStatus(newQuoteState);
    assert(
      newVerificationStatus.kind === 'VerificationSuccess',
      `Quote account has not been verified`
    );

    const newQueueState = await attestationQueueAccount.loadData();
    assert(newQueueState.dataLen === 2, 'AttestationQueue incorrect size');
  });

  it('Creates a TEE oracle', async () => {
    const oracleQuoteKeypair = Keypair.generate();

    [oracleQuoteAccount] = await attestationQueueAccount.createQuote({
      registryKey: new Uint8Array(Array(64).fill(1)),
      keypair: oracleQuoteKeypair,
    });
    assert(
      oracleQuoteKeypair.publicKey.equals(oracleQuoteAccount.publicKey),
      'QuotePubkeyMismatch'
    );

    await oracleQuoteAccount.verify({
      timestamp: new BN(Math.floor(Date.now() / 1000)),
      mrEnclave: new Uint8Array(mrEnclave),
      verifierKeypair: quoteKeypair,
    });

    const quoteData = await oracleQuoteAccount.loadData();
    assert(
      Buffer.compare(
        new Uint8Array(mrEnclave),
        new Uint8Array(quoteData.mrEnclave)
      ) === 0,
      'QuoteData MRECLAVE mismatch'
    );

    // Perform tee heartbeat.
    await oracleAccount.teeHeartbeat({
      quoteKeypair: oracleQuoteKeypair,
    });
  });

  it('Calls TeeSaveResult', async () => {
    const programStateData = await new sbv2.ProgramStateAccount(
      ctx.program,
      ctx.program.programState.publicKey
    ).loadData();
    assert(
      sbv2.ProgramStateAccount.findEnclaveIdx(
        programStateData.mrEnclaves.map(e => new Uint8Array(e)),
        new Uint8Array(mrEnclave)
      ) !== -1,
      'ProgramState does not have the NodeJS MRENCLAVE measurement'
    );
    // 1. Create basic aggregator with valueTask
    const [aggregatorAccount] = await queueAccount.createFeed({
      queueAuthority: ctx.payer,
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 60,
      fundAmount: 0.15,
      enable: true,
      historyLimit: 1000,
      slidingWindow: true,
      jobs: [
        {
          weight: 2,
          data: OracleJob.encodeDelimited(
            OracleJob.fromObject({
              tasks: [
                {
                  valueTask: {
                    value: 1,
                  },
                },
              ],
            })
          ).finish(),
        },
      ],
    });

    const aggregator = await aggregatorAccount.loadData();
    const jobs = await aggregatorAccount.loadJobs(aggregator);

    assert(
      aggregator.resolutionMode.kind === 'ModeSlidingResolution',
      'Aggregator account needs to be sliding window mode'
    );

    // 2. Call openRound
    await aggregatorAccount.openRound();

    // 3. Send tee_save_result
    const updatedAggregatorState = await aggregatorAccount.loadData();
    const oracles = await aggregatorAccount.loadCurrentRoundOracles(
      updatedAggregatorState
    );
    const saveResultTxn = aggregatorAccount.teeSaveResultInstructionSync(
      ctx.payer.publicKey,
      {
        ...aggregatorAccount.getAccounts(
          queueAccount,
          ctx.program.walletPubkey
        ),
        oraclePermission: oracleAccount.getPermissionAccount(
          queueAccount.publicKey,
          ctx.payer.publicKey
        ),
        jobs: jobs.map(j => j.job),
        value: new Big(1),
        minResponse: new Big(1),
        maxResponse: new Big(1),
        queueAccount: queueAccount,
        queueAuthority: ctx.program.walletPubkey,
        oracles: oracles,
        oracleIdx: 0,
        aggregator: updatedAggregatorState,
        quotePubkey: oracleQuoteAccount.publicKey,
      }
    );

    await ctx.program.signAndSend(saveResultTxn, {
      skipPreflight: true,
    });

    const finalAggregatorState = await aggregatorAccount.loadData();

    const finalValue =
      sbv2.AggregatorAccount.decodeLatestValue(finalAggregatorState);
    assert(
      finalValue !== null && finalValue.toNumber() === 1,
      `AggregatorValue is incorrect, ${finalValue}`
    );
  });
});
