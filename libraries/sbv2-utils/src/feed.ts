import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token-v2";
import {
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  AggregatorAccount,
  AggregatorInitParams,
  JobAccount,
  LeaseAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import { promiseWithTimeout } from "./async.js";

export async function awaitOpenRound(
  aggregatorAccount: AggregatorAccount,
  queueAccount: OracleQueueAccount,
  payerTokenWallet: PublicKey,
  expectedValue: Big | undefined,
  timeout = 30
): Promise<Big> {
  // call open round and wait for new value
  const accountsCoder = new anchor.BorshAccountsCoder(
    aggregatorAccount.program.idl
  );

  let accountWs: number;
  const awaitUpdatePromise = new Promise((resolve: (value: Big) => void) => {
    accountWs = aggregatorAccount.program.provider.connection.onAccountChange(
      aggregatorAccount?.publicKey ?? PublicKey.default,
      async (accountInfo) => {
        const aggregator = accountsCoder.decode(
          "AggregatorAccountData",
          accountInfo.data
        );
        const latestResult = await aggregatorAccount.getLatestValue(aggregator);
        if (!expectedValue) {
          resolve(new Big(0));
        } else if (latestResult?.eq(expectedValue)) {
          resolve(latestResult);
        }
      }
    );
  });

  const updatedValuePromise = promiseWithTimeout(
    timeout * 1000,
    awaitUpdatePromise,
    new Error(`aggregator failed to update in ${timeout} seconds`)
  ).finally(() => {
    if (accountWs) {
      aggregatorAccount.program.provider.connection.removeAccountChangeListener(
        accountWs
      );
    }
  });

  await aggregatorAccount.openRound({
    oracleQueueAccount: queueAccount,
    payoutWallet: payerTokenWallet,
  });

  const result = await updatedValuePromise;

  if (!result) {
    throw new Error(`failed to update aggregator`);
  }

  return result;
}

export async function createAggregator(
  program: anchor.Program,
  queueAccount: OracleQueueAccount,
  params: AggregatorInitParams,
  jobs: [JobAccount, number][]
) {
  const payerKeypair = programWallet(program);
  const queue = await queueAccount.loadData();
  const mint = await queueAccount.loadMint();
  const payerTokenWallet = (
    await spl.getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      payerKeypair,
      mint.address,
      payerKeypair.publicKey,
      undefined,
      undefined,
      undefined,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    )
  ).address;

  // Aggregator params
  const aggregatorKeypair = params.keypair ?? anchor.web3.Keypair.generate();
  const authority = params.authority ?? payerKeypair.publicKey;
  const size = program.account.aggregatorAccountData.size;
  const [programStateAccount, stateBump] =
    ProgramStateAccount.fromSeed(program);
  const state = await programStateAccount.loadData();
  const aggregatorAccount = new AggregatorAccount({
    program,
    publicKey: aggregatorKeypair.publicKey,
  });

  // Permission params
  const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
    program,
    queue.authority,
    queueAccount.publicKey,
    aggregatorKeypair.publicKey
  );

  // Lease params
  const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
    program,
    queueAccount,
    aggregatorAccount
  );
  const leaseEscrow = await spl.getAssociatedTokenAddress(
    mint.address,
    leaseAccount.publicKey,
    true,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // const jobPubkeys: Array<PublicKey> = [];
  // const jobWallets: Array<PublicKey> = [];
  // const walletBumps: Array<number> = [];
  // for (const idx in jobs) {
  //   const [jobWallet, bump] = anchor.utils.publicKey.findProgramAddressSync(
  //     [
  //       payerKeypair.publicKey.toBuffer(),
  //       spl.TOKEN_PROGRAM_ID.toBuffer(),
  //       mint.address.toBuffer(),
  //     ],
  //     spl.ASSOCIATED_TOKEN_PROGRAM_ID
  //   );
  //   jobPubkeys.push(jobs[idx].publicKey);
  //   jobWallets.push(jobWallet);
  //   walletBumps.push(bump);
  // }

  const createIxns: TransactionInstruction[] = [];

  createIxns.push(
    ...([
      // allocate aggregator account
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: programWallet(program).publicKey,
        newAccountPubkey: aggregatorKeypair.publicKey,
        space: size,
        lamports:
          await program.provider.connection.getMinimumBalanceForRentExemption(
            size
          ),
        programId: program.programId,
      }),
      // create aggregator
      await program.methods
        .aggregatorInit({
          name: (params.name ?? Buffer.from("")).slice(0, 32),
          metadata: (params.metadata ?? Buffer.from("")).slice(0, 128),
          batchSize: params.batchSize,
          minOracleResults: params.minRequiredOracleResults,
          minJobResults: params.minRequiredJobResults,
          minUpdateDelaySeconds: params.minUpdateDelaySeconds,
          varianceThreshold: SwitchboardDecimal.fromBig(
            new Big(params.varianceThreshold ?? 0)
          ),
          forceReportPeriod: params.forceReportPeriod ?? new anchor.BN(0),
          expiration: params.expiration ?? new anchor.BN(0),
          stateBump,
        })
        .accounts({
          aggregator: aggregatorKeypair.publicKey,
          authority,
          queue: params.queueAccount.publicKey,
          authorWallet: params.authorWallet ?? state.tokenVault,
          programState: programStateAccount.publicKey,
        })
        .instruction(),
      await program.methods
        .permissionInit({})
        .accounts({
          permission: permissionAccount.publicKey,
          authority: params.authority,
          granter: queueAccount.publicKey,
          grantee: aggregatorKeypair.publicKey,
          payer: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
      payerKeypair.publicKey.equals(queue.authority)
        ? await program.methods
            .permissionSet({
              permission: { permitOracleQueueUsage: null },
              enable: true,
            })
            .accounts({
              permission: permissionAccount.publicKey,
              authority: queue.authority,
            })
            .instruction()
        : undefined,
      spl.createAssociatedTokenAccountInstruction(
        payerKeypair.publicKey,
        leaseEscrow,
        leaseAccount.publicKey,
        mint.address,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      ),
      await program.methods
        .leaseInit({
          loadAmount: new anchor.BN(0),
          stateBump,
          leaseBump,
          withdrawAuthority: payerKeypair.publicKey,
          walletBumps: Buffer.from([]),
        })
        .accounts({
          programState: programStateAccount.publicKey,
          lease: leaseAccount.publicKey,
          queue: queueAccount.publicKey,
          aggregator: aggregatorAccount.publicKey,
          systemProgram: SystemProgram.programId,
          funder: payerTokenWallet,
          payer: payerKeypair.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          escrow: leaseEscrow,
          owner: payerKeypair.publicKey,
          mint: mint.address,
        })
        // .remainingAccounts(
        //   jobPubkeys.concat(jobWallets).map((pubkey: PublicKey) => {
        //     return { isSigner: false, isWritable: true, pubkey };
        //   })
        // )
        .instruction(),
      ...(await Promise.all(
        jobs.map(async ([jobAccount, weight]) => {
          return program.methods
            .aggregatorAddJob({
              weight,
            })
            .accounts({
              aggregator: aggregatorKeypair.publicKey,
              authority: payerKeypair.publicKey,
              job: jobAccount.publicKey,
            })
            .instruction();
        })
      )),
    ].filter(Boolean) as TransactionInstruction[])
  );

  const createSig = await sendAndConfirmTransaction(
    program.provider.connection,
    new Transaction().add(...createIxns),
    [payerKeypair, aggregatorKeypair]
  );

  return aggregatorAccount;
}
