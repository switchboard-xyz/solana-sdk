import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleJob,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import type Big from "big.js";

interface CopyAggregatorParameters {
  authority?: PublicKey;
  minOracles?: number;
  batchSize?: number;
  minJobs?: number;
  minUpdateDelay?: number;
  forceReportPeriod?: number;
  varianceThreshold?: Big;
  crankKey?: PublicKey;
}

export async function copyAggregatorTxn(
  payerKeypair: Keypair,
  sourceAggregatorAccount: AggregatorAccount,
  targetQueue: OracleQueueAccount,
  params: CopyAggregatorParameters
) {
  // load source environment
  const sourceAggregator = await sourceAggregatorAccount.loadData();
  const sourceJobPubkeys: PublicKey[] = sourceAggregator.jobPubkeysData.slice(
    0,
    sourceAggregator.jobPubkeysSize
  );
  const sourceJobAccounts = sourceJobPubkeys.map((publicKey) => {
    return new JobAccount({
      program: sourceAggregatorAccount.program,
      publicKey: publicKey,
    });
  });
  const sourceJobs = await Promise.all(
    sourceJobAccounts.map(async (jobAccount) => {
      const data = await jobAccount.loadData();
      const job = OracleJob.decodeDelimited(data.data);
      return { job, data };
    })
  );

  const program = targetQueue.program;

  const [programStateAccount, stateBump] =
    ProgramStateAccount.fromSeed(program);
  const programState = await programStateAccount.loadData();
  const queue = await targetQueue.loadData();

  const tokenMint = await targetQueue.loadMint();
  const tokenWallet = (
    await tokenMint.getOrCreateAssociatedAccountInfo(payerKeypair.publicKey)
  ).address;

  const createAccountInstructions: (
    | TransactionInstruction
    | TransactionInstruction[]
  )[] = [];
  const createAccountSigners: Keypair[] = [payerKeypair];

  const jobAccounts = await Promise.all(
    sourceJobs.map(async ({ job, data }) => {
      const jobKeypair = Keypair.generate();
      createAccountSigners.push(jobKeypair);

      const jobData = Buffer.from(
        OracleJob.encodeDelimited(
          OracleJob.create({
            tasks: job.tasks,
          })
        ).finish()
      );
      const size =
        280 + jobData.length + (data.variables?.join("")?.length ?? 0);

      createAccountInstructions.push([
        SystemProgram.createAccount({
          fromPubkey: payerKeypair.publicKey,
          newAccountPubkey: jobKeypair.publicKey,
          space: size,
          lamports:
            await this.program.provider.connection.getMinimumBalanceForRentExemption(
              size
            ),
          programId: this.program.programId,
        }),
        await this.program.methods
          .jobInit({
            name: Buffer.from(data.name),
            data: jobData,
            variables:
              data.variables?.map((item) => Buffer.from("")) ??
              new Array<Buffer>(),
            authorWallet: payerKeypair.publicKey,
            stateBump,
          })
          .accounts({
            job: jobKeypair.publicKey,
            authorWallet: tokenWallet,
            authority: payerKeypair.publicKey,
            programState: programStateAccount.publicKey,
          })
          // .signers([jobKeypair])
          .instruction(),
      ]);

      return new JobAccount({
        program: this.program,
        publicKey: jobKeypair.publicKey,
      });
    })
  );

  const aggregatorKeypair = Keypair.generate();
  this.logger.debug(`Aggregator: ${aggregatorKeypair.publicKey}`);
  createAccountSigners.push(aggregatorKeypair);
  const aggregatorSize = this.program.account.aggregatorAccountData.size;
  const permissionAccountSize = this.program.account.permissionAccountData.size;
  const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
    this.program,
    queue.authority,
    targetQueue.publicKey,
    aggregatorKeypair.publicKey
  );

  const aggregatorAccount = new AggregatorAccount({
    program: this.program,
    publicKey: aggregatorKeypair.publicKey,
  });

  // Create lease and push to crank
  const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
    this.program,
    targetQueue,
    aggregatorAccount
  );
  const leaseEscrow = await spl.Token.getAssociatedTokenAddress(
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
    spl.TOKEN_PROGRAM_ID,
    tokenMint.publicKey,
    leaseAccount.publicKey,
    true
  );

  const jobPubkeys: Array<PublicKey> = [];
  const jobWallets: Array<PublicKey> = [];
  const walletBumps: Array<number> = [];
  for (const idx in jobAccounts) {
    const [jobWallet, bump] = anchor.utils.publicKey.findProgramAddressSync(
      [
        payerKeypair.publicKey.toBuffer(),
        spl.TOKEN_PROGRAM_ID.toBuffer(),
        tokenMint.publicKey.toBuffer(),
      ],
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );
    jobPubkeys.push(jobAccounts[idx].publicKey);
    jobWallets.push(jobWallet);
    walletBumps.push(bump);
  }

  createAccountInstructions.push(
    [
      // allocate aggregator space
      SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: aggregatorKeypair.publicKey,
        space: aggregatorSize,
        lamports:
          await this.program.provider.connection.getMinimumBalanceForRentExemption(
            aggregatorSize
          ),
        programId: this.program.programId,
      }),
      // create aggregator
      await this.program.methods
        .aggregatorInit({
          name: sourceAggregator.name,
          metadata: sourceAggregator.metadata,
          batchSize:
            params.batchSize ?? sourceAggregator.oracleRequestBatchSize,
          minOracleResults:
            params.minOracles ?? sourceAggregator.minOracleResults,
          minJobResults: params.minJobs ?? sourceAggregator.minJobResults,
          minUpdateDelaySeconds:
            params.minUpdateDelay ?? sourceAggregator.minUpdateDelaySeconds,
          varianceThreshold: params.varianceThreshold
            ? SwitchboardDecimal.fromBig(params.varianceThreshold)
            : sourceAggregator.varianceThreshold,
          forceReportPeriod:
            params.forceReportPeriod ?? sourceAggregator.forceReportPeriod,
          stateBump,
        })
        .accounts({
          aggregator: aggregatorKeypair.publicKey,
          authority: payerKeypair.publicKey,
          queue: targetQueue.publicKey,
          authorWallet: tokenWallet,
          programState: programStateAccount.publicKey,
        })
        .instruction(),
      // create permissions
      await this.program.methods
        .permissionInit({})
        .accounts({
          permission: permissionAccount.publicKey,
          authority: queue.authority,
          granter: targetQueue.publicKey,
          grantee: aggregatorKeypair.publicKey,
          payer: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
      payerKeypair.publicKey.equals(queue.authority)
        ? await this.program.methods
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
      spl.Token.createAssociatedTokenAccountInstruction(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        tokenMint.publicKey,
        leaseEscrow,
        leaseAccount.publicKey,
        payerKeypair.publicKey
      ),
      await this.program.methods
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
          queue: targetQueue.publicKey,
          aggregator: aggregatorAccount.publicKey,
          systemProgram: SystemProgram.programId,
          funder: tokenWallet,
          payer: payerKeypair.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          escrow: leaseEscrow,
          owner: payerKeypair.publicKey,
          mint: tokenMint.publicKey,
        })
        // .remainingAccounts(
        //   jobPubkeys.concat(jobWallets).map((pubkey: PublicKey) => {
        //     return { isSigner: false, isWritable: true, pubkey };
        //   })
        // )
        .instruction(),
      params.crankKey
        ? await this.program.methods
            .crankPush({
              stateBump,
              permissionBump,
            })
            .accounts({
              crank: new PublicKey(params.crankKey),
              aggregator: aggregatorAccount.publicKey,
              oracleQueue: targetQueue.publicKey,
              queueAuthority: queue.authority,
              permission: permissionAccount.publicKey,
              lease: leaseAccount.publicKey,
              escrow: leaseEscrow,
              programState: programStateAccount.publicKey,
              dataBuffer: (
                await new CrankAccount({
                  program: this.program,
                  publicKey: new PublicKey(params.crankKey),
                }).loadData()
              ).dataBuffer,
            })
            .instruction()
        : undefined,
    ].filter((item) => item)
  );

  const finalInstructions: (
    | TransactionInstruction
    | TransactionInstruction[]
  )[] = [];

  finalInstructions.push(
    ...(await Promise.all(
      jobAccounts.map(async (jobAccount) => {
        return this.program.methods
          .aggregatorAddJob({
            weight: 1,
          })
          .accounts({
            aggregator: aggregatorKeypair.publicKey,
            authority: payerKeypair.publicKey,
            job: jobAccount.publicKey,
          })
          .instruction();
      })
    ))
  );
  return "";
}
