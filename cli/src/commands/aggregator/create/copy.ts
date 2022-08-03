/* eslint-disable unicorn/no-array-push-push */
import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token-v2";
import {
  AccountInfo,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  packAndSend,
  prettyPrintAggregator,
  promiseWithTimeout,
  verifyProgramHasPayer,
} from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleJob,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import BaseCommand from "../../../BaseCommand";

// TODO: Fix command so it accepts a feed authority flag
// TODO: Add flag that skips job creation
export default class AggregatorCreateCopy extends BaseCommand {
  static description = "copy an aggregator account to a new oracle queue";

  static flags = {
    ...BaseCommand.flags,
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that will be the aggregator authority",
    }),
    minOracles: Flags.integer({
      description: "override source aggregator's minOracleResults",
    }),
    batchSize: Flags.integer({
      description: "override source aggregator's oracleRequestBatchSize",
    }),
    minJobs: Flags.integer({
      description: "override source aggregator's minJobResults",
    }),
    minUpdateDelay: Flags.integer({
      description: "override source aggregator's minUpdateDelaySeconds",
    }),
    forceReportPeriod: Flags.integer({
      description: "override source aggregator's forceReportPeriod",
    }),
    varianceThreshold: Flags.string({
      description: "override source aggregator's varianceThreshold",
    }),
    queueKey: Flags.string({
      description: "public key of the queue to create aggregator for",
      required: true,
    }),
    crankKey: Flags.string({
      description: "public key of the crank to push aggregator to",
      required: false,
    }),
    enable: Flags.boolean({
      description: "set permissions to PERMIT_ORACLE_QUEUE_USAGE",
    }),
    queueAuthority: Flags.string({
      description: "alternative keypair to use for queue authority",
    }),
    copyJobs: Flags.boolean({
      description:
        "create copy of job accounts instead of referincing existing job account",
    }),
    // sourceCluster: Flags.string({
    //   description: "alternative solana cluster to copy source aggregator from",
    //   required: false,
    //   options: ["devnet", "mainnet-beta"],
    // }),
  };

  static args = [
    {
      name: "aggregatorSource",
      description: "public key of the aggregator account to copy",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:create:copy GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --queueKey 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json",
    "$ sbv2 aggregator:create:copy GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --queueKey 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json --sourceCluster mainnet-beta",
    "$ sbv2 aggregator:create:copy FcSmdsdWks75YdyCGegRqXdt5BiNGQKxZywyzb8ckD7D --queueKey 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json --sourceCluster mainnet-beta",
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = await this.parse(AggregatorCreateCopy);

    const payerKeypair = programWallet(this.program);
    const feedAuthority = await this.loadAuthority(flags.authority);
    const queueAuthority = await this.loadAuthority(flags.queueAuthority);

    // const sourceProgram = !flags.sourceCluster
    //   ? this.program
    //   : flags.sourceCluster === "devnet" ||
    //     flags.sourceCluster === "mainnet-beta"
    //   ? await loadSwitchboardProgram(
    //       flags.sourceCluster,
    //       undefined,
    //       payerKeypair
    //     )
    //   : undefined;
    const sourceProgram = this.program;
    if (sourceProgram === undefined) {
      throw new Error(`Invalid sourceAggregatorCluster`);
    }

    const sourceAggregatorAccount = new AggregatorAccount({
      program: sourceProgram,
      publicKey: args.aggregatorSource,
    });

    const sourceAggregator = await sourceAggregatorAccount.loadData();
    const sourceJobPubkeys: PublicKey[] = sourceAggregator.jobPubkeysData.slice(
      0,
      sourceAggregator.jobPubkeysSize
    );

    const sourceJobAccounts = sourceJobPubkeys.map((publicKey) => {
      return new JobAccount({ program: sourceProgram, publicKey: publicKey });
    });

    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );
    const programState = await programStateAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: new PublicKey(flags.queueKey),
    });
    const queue = await queueAccount.loadData();
    const mint = await queueAccount.loadMint();
    const tokenWallet = (
      await spl.getOrCreateAssociatedTokenAccount(
        this.program.provider.connection,
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

    const createAccountInstructions: (
      | TransactionInstruction
      | TransactionInstruction[]
    )[] = [];
    const createAccountSigners: Keypair[] = [
      payerKeypair,
      feedAuthority,
      queueAuthority,
    ];

    // Create Aggregator & Permissions
    const aggregatorKeypair = Keypair.generate();
    this.logger.debug(`Aggregator: ${aggregatorKeypair.publicKey}`);
    createAccountSigners.push(aggregatorKeypair);
    const aggregatorSize = this.program.account.aggregatorAccountData.size;
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      aggregatorKeypair.publicKey
    );

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: aggregatorKeypair.publicKey,
    });

    // Create lease and push to crank
    const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
      this.program,
      queueAccount,
      aggregatorAccount
    );
    const leaseEscrow = await spl.getAssociatedTokenAddress(
      mint.address,
      leaseAccount.publicKey,
      true
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
            authority: feedAuthority.publicKey,
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
        flags.enable && queueAuthority.publicKey.equals(queue.authority)
          ? await this.program.methods
              .permissionSet({
                permission: { permitOracleQueueUsage: undefined },
                enable: true,
              })
              .accounts({
                permission: permissionAccount.publicKey,
                authority: queueAuthority.publicKey,
              })
              .instruction()
          : undefined,
      ].filter((item) => item)
    );

    createAccountInstructions.push(
      [
        spl.createAssociatedTokenAccountInstruction(
          payerKeypair.publicKey,
          leaseEscrow,
          leaseAccount.publicKey,
          mint.address,
          spl.TOKEN_PROGRAM_ID,
          spl.ASSOCIATED_TOKEN_PROGRAM_ID
        ),
        await this.program.methods
          .leaseInit({
            loadAmount: new anchor.BN(0),
            stateBump,
            leaseBump,
            withdrawAuthority: feedAuthority.publicKey,
            walletBumps: Buffer.from([]),
          })
          .accounts({
            programState: programStateAccount.publicKey,
            lease: leaseAccount.publicKey,
            queue: queueAccount.publicKey,
            aggregator: aggregatorAccount.publicKey,
            systemProgram: SystemProgram.programId,
            funder: tokenWallet,
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
        flags.crankKey
          ? await this.program.methods
              .crankPush({
                stateBump,
                permissionBump,
                nofitiRef: null,
                notifiRef: null,
              })
              .accounts({
                crank: new PublicKey(flags.crankKey),
                aggregator: aggregatorKeypair.publicKey,
                oracleQueue: queueAccount.publicKey,
                queueAuthority: queue.authority,
                permission: permissionAccount.publicKey,
                lease: leaseAccount.publicKey,
                escrow: leaseEscrow,
                programState: programStateAccount.publicKey,
                dataBuffer: (
                  await new CrankAccount({
                    program: this.program,
                    publicKey: new PublicKey(flags.crankKey),
                  }).loadData()
                ).dataBuffer,
              })
              .instruction()
          : undefined,
      ].filter((item) => item)
    );

    const createJobIxns = flags.copyJobs
      ? // create job account copies
        await Promise.all(
          sourceJobAccounts.map(async (jobAccount) => {
            const jobKeypair = Keypair.generate();
            createAccountSigners.push(jobKeypair); // add signers

            const job = await jobAccount.loadData();
            const data = await jobAccount.loadData();
            const jobData = Buffer.from(
              OracleJob.encodeDelimited(
                OracleJob.create({
                  tasks: job.tasks,
                })
              ).finish()
            );

            const size =
              280 + jobData.length + (data.variables?.join("")?.length ?? 0);

            return [
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
                  authority: feedAuthority.publicKey,
                  programState: programStateAccount.publicKey,
                })
                .signers([feedAuthority])
                .instruction(),
              await this.program.methods
                .aggregatorAddJob({
                  weight: 1,
                })
                .accounts({
                  aggregator: aggregatorKeypair.publicKey,
                  authority: feedAuthority.publicKey,
                  job: jobAccount.publicKey,
                })
                .instruction(),
            ];
          })
        )
      : // add job by pubkey
        await Promise.all(
          sourceJobAccounts.map(async (jobAccount) => {
            const addJobIxn = await this.program.methods
              .aggregatorAddJob({
                weight: 1,
              })
              .accounts({
                aggregator: aggregatorKeypair.publicKey,
                authority: feedAuthority.publicKey,
                job: jobAccount.publicKey,
              })
              .instruction();
            return addJobIxn;
          })
        );

    const createAccountSignatures = packAndSend(
      this.program,
      [createAccountInstructions, createJobIxns],
      createAccountSigners,
      payerKeypair.publicKey
    ).catch((error) => {
      throw error;
    });

    let aggInitWs: number;
    const aggInitPromise = new Promise((resolve: (result: any) => void) => {
      aggInitWs = this.program.provider.connection.onAccountChange(
        aggregatorKeypair.publicKey,
        (accountInfo: AccountInfo<Buffer>, slot) => {
          const aggData = new anchor.BorshAccountsCoder(
            this.program.idl
          ).decode("AggregatorAccountData", accountInfo.data);
          resolve(aggData);
        }
      );
    });

    const result = await promiseWithTimeout(45_000, aggInitPromise).finally(
      () => {
        try {
          this.program.provider.connection.removeAccountChangeListener(
            aggInitWs
          );
        } catch {}
      }
    );

    if (this.silent) {
      console.log(aggregatorAccount.publicKey.toString());
      return;
    }

    this.logger.info(
      await prettyPrintAggregator(aggregatorAccount, result, true, true, true)
    );
  }

  async catch(error) {
    super.catch(error, "Failed to copy aggregator account to new queue");
  }
}
