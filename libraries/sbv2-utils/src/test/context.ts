/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as sbv2 from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import fs from "fs";
import path from "path";
import { awaitOpenRound, createAggregator } from "../feed.js";

export interface ISwitchboardTestContext {
  program: anchor.Program;
  mint: spl.Token;
  payerTokenWallet: PublicKey;
  queue: sbv2.OracleQueueAccount;
  oracle?: sbv2.OracleAccount;
}

export class SwitchboardTestContext implements ISwitchboardTestContext {
  program: anchor.Program;

  mint: spl.Token;

  payerTokenWallet: PublicKey;

  queue: sbv2.OracleQueueAccount;

  oracle?: sbv2.OracleAccount;

  constructor(ctx: ISwitchboardTestContext) {
    this.program = ctx.program;
    this.mint = ctx.mint;
    this.payerTokenWallet = ctx.payerTokenWallet;
    this.queue = ctx.queue;
    this.oracle = ctx.oracle;
  }

  // Switchboard currently uses wrapped SOL for mint
  private static async createSwitchboardWallet(
    program: anchor.Program,
    amount = 1_000_000
  ): Promise<PublicKey> {
    const payerKeypair = sbv2.programWallet(program);
    return spl.Token.createWrappedNativeAccount(
      program.provider.connection,
      spl.TOKEN_PROGRAM_ID,
      payerKeypair.publicKey,
      payerKeypair,
      amount
    );
  }

  static async loadDevnetQueue(
    provider: anchor.AnchorProvider,
    queueKey = "F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy"
  ) {
    const payerKeypair = (provider.wallet as sbv2.AnchorWallet).payer;
    let program: anchor.Program;
    try {
      program = await sbv2.loadSwitchboardProgram(
        "devnet",
        provider.connection,
        payerKeypair
      );
    } catch (error: any) {
      throw new Error(
        `Failed to load the SBV2 program for the given cluster, ${error.message}`
      );
    }
    let queue: sbv2.OracleQueueAccount;
    let queueData: any;
    try {
      queue = new sbv2.OracleQueueAccount({
        program,
        publicKey: new PublicKey(queueKey),
      });
      queueData = await queue.loadData();
      if (queueData.queue.length < 1) {
        throw new Error(`OracleQueue has no active oracles heartbeating`);
      }
    } catch (error: any) {
      throw new Error(
        `Failed to load the SBV2 queue for the given cluster, ${error.message}`
      );
    }
    let mint: spl.Token;
    try {
      mint = await queue.loadMint();
    } catch (error: any) {
      throw new Error(
        `Failed to load the SBV2 mint for the given cluster, ${error.message}`
      );
    }
    let payerTokenWallet: PublicKey;
    try {
      payerTokenWallet = (
        await mint.getOrCreateAssociatedAccountInfo(payerKeypair.publicKey)
      ).address;
    } catch (error: any) {
      throw new Error(
        `Failed to load the SBV2 mint for the given cluster, ${error.message}`
      );
    }
    return new SwitchboardTestContext({
      program,
      queue,
      mint,
      payerTokenWallet,
    });
  }

  // public static async depositSwitchboardWallet(
  //   program: anchor.Program,
  //   wallet: PublicKey,
  //   amount: number
  // ) {
  //   const payerKeypair = sbv2.programWallet(program);

  //   const requestTxn = await program.provider.connection.requestAirdrop(
  //     wallet,
  //     amount
  //   );

  //   // TODO: Figure out how to wrap from spl.Token
  // }

  /** Recursively loop through directories and return the filepath of switchboard.env
   * @param envFileName alternative filename to search for. defaults to switchboard.env
   * @returns the filepath for a switchboard env file to load
   */
  public static findSwitchboardEnv(envFileName = "switchboard.env"): string {
    const NotFoundError = new Error(
      "failed to find switchboard.env file in current directory recursively"
    );
    let retryCount = 5;

    let currentDirectory = process.cwd();
    while (retryCount > 0) {
      // look for .switchboard directory
      try {
        const localSbvPath = path.join(currentDirectory, ".switchboard");
        if (fs.existsSync(localSbvPath)) {
          const localSbvEnvPath = path.join(localSbvPath, envFileName);
          if (fs.existsSync(localSbvEnvPath)) {
            return localSbvEnvPath;
          }
        }
      } catch {}

      // look for switchboard.env
      try {
        const currentPath = path.join(currentDirectory, envFileName);
        if (fs.existsSync(currentPath)) {
          return currentPath;
        }
        currentDirectory = path.join(currentDirectory, "../");
      } catch {
        throw NotFoundError;
      }

      retryCount--;
    }

    throw NotFoundError;
  }

  /** Load SwitchboardTestContext from an env file containing $SWITCHBOARD_PROGRAM_ID, $ORACLE_QUEUE, $AGGREGATOR
   * @param provider anchor Provider containing connection and payer Keypair
   * @param filePath filesystem path to env file
   */
  public static async loadFromEnv(
    provider: anchor.AnchorProvider,
    filePath = SwitchboardTestContext.findSwitchboardEnv()
  ): Promise<SwitchboardTestContext> {
    require("dotenv").config({ path: filePath });
    if (!process.env.SWITCHBOARD_PROGRAM_ID) {
      throw new Error(`your env file must have $SWITCHBOARD_PROGRAM_ID set`);
    }
    const SWITCHBOARD_PID = new PublicKey(process.env.SWITCHBOARD_PROGRAM_ID);
    const switchboardIdl = await anchor.Program.fetchIdl(
      SWITCHBOARD_PID,
      provider
    );
    if (!switchboardIdl) {
      throw new Error(`failed to load Switchboard IDL`);
    }
    const switchboardProgram = new anchor.Program(
      switchboardIdl,
      SWITCHBOARD_PID,
      provider
    );

    if (!process.env.ORACLE_QUEUE) {
      throw new Error(`your env file must have $ORACLE_QUEUE set`);
    }
    const SWITCHBOARD_QUEUE = new PublicKey(process.env.ORACLE_QUEUE);
    const queue = new sbv2.OracleQueueAccount({
      program: switchboardProgram,
      publicKey: SWITCHBOARD_QUEUE,
    });
    const queueData = await queue.loadData();
    if (queueData.queue.length < 1) {
      throw new Error(`OracleQueue has no active oracles heartbeating`);
    }

    const oracle = process.env.ORACLE
      ? new sbv2.OracleAccount({
          program: switchboardProgram,
          publicKey: new PublicKey(process.env.ORACLE),
        })
      : undefined;

    const [switchboardProgramState] =
      sbv2.ProgramStateAccount.fromSeed(switchboardProgram);
    const switchboardMint = await switchboardProgramState.getTokenMint();

    const payerTokenWallet =
      await SwitchboardTestContext.createSwitchboardWallet(switchboardProgram);

    const context: ISwitchboardTestContext = {
      program: switchboardProgram,
      mint: switchboardMint,
      payerTokenWallet,
      queue,
      oracle,
    };

    return new SwitchboardTestContext(context);
  }

  /** Create a static data feed that resolves to an expected value */
  public async createStaticFeed(
    value: number,
    timeout = 30
  ): Promise<sbv2.AggregatorAccount> {
    const queue = await this.queue.loadData();
    const payerKeypair = sbv2.programWallet(this.program);

    const staticJob = await sbv2.JobAccount.create(this.program, {
      name: Buffer.from(`Value ${value}`),
      authority: this.payerTokenWallet,
      data: Buffer.from(
        sbv2.OracleJob.encodeDelimited(
          sbv2.OracleJob.create({
            tasks: [
              sbv2.OracleJob.Task.create({
                valueTask: sbv2.OracleJob.ValueTask.create({
                  value,
                }),
              }),
            ],
          })
        ).finish()
      ),
    });

    const aggregatorAccount = await createAggregator(
      this.program,
      this.queue,
      {
        batchSize: 1,
        minRequiredJobResults: 1,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 5,
        queueAccount: this.queue,
        authorWallet: this.payerTokenWallet,
        authority: payerKeypair.publicKey,
      },
      [[staticJob, 1]]
    );

    const aggValue = await awaitOpenRound(
      aggregatorAccount,
      this.queue,
      this.payerTokenWallet,
      new Big(value),
      timeout
    );

    return aggregatorAccount;
  }

  /** Update a feed to a single job that resolves to a new expected value
   * @param aggregatorAccount the aggregator to change a job definition for
   * @param value the new expected value
   * @param timeout how long to wait for the oracle to update the aggregator's latestRound result
   */
  public async updateStaticFeed(
    aggregatorAccount: sbv2.AggregatorAccount,
    value: number,
    timeout = 30
  ): Promise<void> {
    const payerKeypair = sbv2.programWallet(this.program);
    const aggregator = await aggregatorAccount.loadData();
    const expectedValue = new Big(value);

    const queue = await this.queue.loadData();

    // remove all existing jobs
    const existingJobs: sbv2.JobAccount[] = aggregator.jobPubkeysData
      // eslint-disable-next-line array-callback-return
      .filter((jobKey: PublicKey) => {
        if (!jobKey.equals(PublicKey.default)) {
          return jobKey;
        }
        return undefined;
      })
      .filter((item: PublicKey | undefined) => item !== undefined)
      .map(
        (jobKey: PublicKey) =>
          new sbv2.JobAccount({
            program: this.program,
            publicKey: jobKey,
          })
      );
    await Promise.all(
      existingJobs.map((job) => aggregatorAccount.removeJob(job, payerKeypair))
    );

    // add new static job
    const staticJob = await sbv2.JobAccount.create(this.program, {
      name: Buffer.from(`Value ${value}`),
      authority: Keypair.generate().publicKey,
      data: Buffer.from(
        sbv2.OracleJob.encodeDelimited(
          sbv2.OracleJob.create({
            tasks: [
              sbv2.OracleJob.Task.create({
                valueTask: sbv2.OracleJob.ValueTask.create({
                  value,
                }),
              }),
            ],
          })
        ).finish()
      ),
    });
    await aggregatorAccount.addJob(staticJob, payerKeypair);

    const aggValue = await awaitOpenRound(
      aggregatorAccount,
      this.queue,
      this.payerTokenWallet,
      expectedValue,
      timeout
    );
  }
}
