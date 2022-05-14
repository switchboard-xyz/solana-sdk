import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { prettyPrintAggregator } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleJob,
  OracleQueueAccount,
  packInstructions,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  signTransactions,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import BaseCommand from "../../../BaseCommand";
import { sleep, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorCreateCopy extends BaseCommand {
  static description = "copy an aggregator account to a new oracle queue";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({ description: "skip job confirmation" }),
    outputFile: flags.string({
      char: "f",
      description: "output file to save aggregator definition to",
    }),
    authority: flags.string({
      char: "a",
      description: "alternate keypair that will be the aggregator authority",
    }),
    minOracles: flags.integer({
      description: "override source aggregator's minOracleResults",
    }),
    batchSize: flags.integer({
      description: "override source aggregator's oracleRequestBatchSize",
    }),
    minJobs: flags.integer({
      description: "override source aggregator's minJobResults",
    }),
    minUpdateDelay: flags.integer({
      description: "override source aggregator's minUpdateDelaySeconds",
    }),
    forceReportPeriod: flags.integer({
      description: "override source aggregator's forceReportPeriod",
    }),
    varianceThreshold: flags.string({
      description: "override source aggregator's varianceThreshold",
    }),
    queueKey: flags.string({
      description: "public key of the queue to create aggregator for",
      required: true,
    }),
    crankKey: flags.string({
      description: "public key of the crank to push aggregator to",
      required: false,
    }),
  };

  static args = [
    {
      name: "aggregatorSource",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator account to copy",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:create:copy 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee AY3vpUu6v49shWajeFjHjgikYfaBWNJgax8zoEouUDTs --keypair ../payer-keypair.json",
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = this.parse(AggregatorCreateCopy);

    const payerKeypair = programWallet(this.program);

    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );
    const programState = await programStateAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: new PublicKey(flags.queueKey),
    });
    const queue = await queueAccount.loadData();
    const tokenMint = await queueAccount.loadMint();
    const tokenWallet = (
      await tokenMint.getOrCreateAssociatedAccountInfo(payerKeypair.publicKey)
    ).address;

    const sourceAggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorSource,
    });
    const sourceAggregator = await sourceAggregatorAccount.loadData();
    const sourceJobPubkeys: PublicKey[] = sourceAggregator.jobPubkeysData.slice(
      0,
      sourceAggregator.jobPubkeysSize
    );

    const sourceJobAccounts = sourceJobPubkeys.map((publicKey) => {
      return new JobAccount({ program: this.program, publicKey: publicKey });
    });

    const sourceJobs = await Promise.all(
      sourceJobAccounts.map(async (jobAccount) => {
        const data = await jobAccount.loadData();
        const job = OracleJob.decodeDelimited(data.data);
        return { job, data };
      })
    );

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
    const permissionAccountSize =
      this.program.account.permissionAccountData.size;
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      aggregatorKeypair.publicKey
    );
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
              flags.batchSize ?? sourceAggregator.oracleRequestBatchSize,
            minOracleResults:
              flags.minOracles ?? sourceAggregator.minOracleResults,
            minJobResults: flags.minJobs ?? sourceAggregator.minJobResults,
            minUpdateDelaySeconds:
              flags.minUpdateDelay ?? sourceAggregator.minUpdateDelaySeconds,
            varianceThreshold: flags.varianceThreshold
              ? SwitchboardDecimal.fromBig(new Big(flags.varianceThreshold))
              : sourceAggregator.varianceThreshold,
            forceReportPeriod:
              flags.forceReportPeriod ?? sourceAggregator.forceReportPeriod,
            stateBump,
          })
          .accounts({
            aggregator: aggregatorKeypair.publicKey,
            authority: payerKeypair.publicKey,
            queue: queueAccount.publicKey,
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
            granter: queueAccount.publicKey,
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
      ].filter((item) => item)
    );

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: aggregatorKeypair.publicKey,
    });

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

    const createAccountSignatures = await packAndSend(
      this.program,
      createAccountInstructions,
      finalInstructions,
      createAccountSigners,
      payerKeypair.publicKey
    );

    // TODO: Create lease account

    let retryCount = 5;
    let aggregator: any;
    while (retryCount) {
      try {
        aggregator = await aggregatorAccount.loadData();
        break;
      } catch {
        await sleep(1000 * retryCount);
        retryCount--;
      }
    }

    await LeaseAccount.create(this.program, {
      aggregatorAccount,
      oracleQueueAccount: queueAccount,
      funder: tokenWallet,
      funderAuthority: payerKeypair,
      loadAmount: new anchor.BN(0),
      withdrawAuthority: payerKeypair.publicKey,
    });

    if (flags.crankKey) {
      const crankAccount = new CrankAccount({
        program: this.program,
        publicKey: new PublicKey(flags.crankKey),
      });
      await crankAccount.push({ aggregatorAccount });
    }

    if (this.silent) {
      console.log(aggregatorAccount.publicKey.toString());
      return;
    }

    this.logger.info(
      await prettyPrintAggregator(
        aggregatorAccount,
        aggregator,
        true,
        true,
        true
      )
    );
  }

  async catch(error) {
    super.catch(error, "Failed to copy aggregator account to new queue");
  }
}

async function packAndSend(
  program: anchor.Program,
  ixnsBatch1: (TransactionInstruction | TransactionInstruction[])[],
  ixnsBatch2: (TransactionInstruction | TransactionInstruction[])[],
  signers: Keypair[],
  feePayer: PublicKey
): Promise<TransactionSignature[]> {
  const signatures: Promise<TransactionSignature>[] = [];
  const { blockhash } = await program.provider.connection.getLatestBlockhash();

  const packedTransactions1 = packInstructions(ixnsBatch1, feePayer, blockhash);
  const signedTransactions1 = signTransactions(packedTransactions1, signers);
  const signedTxs1 = await (
    program.provider as anchor.AnchorProvider
  ).wallet.signAllTransactions(signedTransactions1);
  for (let k = 0; k < packedTransactions1.length; k += 1) {
    const tx = signedTxs1[k];
    const rawTx = tx.serialize();
    signatures.push(
      program.provider.connection.sendRawTransaction(rawTx, {
        skipPreflight: true,
        maxRetries: 10,
      })
    );
  }

  await Promise.all(signatures);

  const packedTransactions2 = packInstructions(ixnsBatch2, feePayer, blockhash);
  const signedTransactions2 = signTransactions(packedTransactions2, signers);
  const signedTxs2 = await (
    program.provider as anchor.AnchorProvider
  ).wallet.signAllTransactions(signedTransactions2);
  for (let k = 0; k < packedTransactions2.length; k += 1) {
    const tx = signedTxs2[k];
    const rawTx = tx.serialize();
    signatures.push(
      program.provider.connection.sendRawTransaction(rawTx, {
        skipPreflight: true,
        maxRetries: 10,
      })
    );
  }

  return Promise.all(signatures);
}
