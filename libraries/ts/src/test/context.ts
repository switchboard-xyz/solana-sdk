import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import * as sbv2 from "..";
import { DEFAULT_PUBKEY, promiseWithTimeout } from "./utils";

export interface ISwitchboardTestContext {
  program: anchor.Program;
  mint: spl.Token;
  tokenWallet: PublicKey;
  queue: sbv2.OracleQueueAccount;
  oracle: sbv2.OracleAccount;
}

export class SwitchboardTestContext implements ISwitchboardTestContext {
  program: anchor.Program;
  mint: spl.Token;
  tokenWallet: PublicKey;
  queue: sbv2.OracleQueueAccount;
  oracle: sbv2.OracleAccount;

  constructor(ctx: ISwitchboardTestContext) {
    this.program = ctx.program;
    this.mint = ctx.mint;
    this.tokenWallet = ctx.tokenWallet;
    this.queue = ctx.queue;
    this.oracle = ctx.oracle;
  }

  // Switchboard currently uses wrapped SOL for mint
  private static async createSwitchboardWallet(
    program: anchor.Program,
    amount = 1_000_000
  ): Promise<PublicKey> {
    const payerKeypair = sbv2.getPayer(program);
    return spl.Token.createWrappedNativeAccount(
      program.provider.connection,
      spl.TOKEN_PROGRAM_ID,
      payerKeypair.publicKey,
      payerKeypair,
      amount
    );
  }

  // public static async depositSwitchboardWallet(
  //   program: anchor.Program,
  //   wallet: PublicKey,
  //   amount: number
  // ) {
  //   const payerKeypair = sbv2.getPayer(program);

  //   const requestTxn = await program.provider.connection.requestAirdrop(
  //     wallet,
  //     amount
  //   );

  //   // TODO: Figure out how to wrap from spl.Token
  // }

  /** Load SwitchboardTestContext from an env file containing $SWITCHBOARD_PROGRAM_ID, $ORACLE_QUEUE, $AGGREGATOR, $ORACLE
   * @param provider anchor Provider containing connection and payer Keypair
   * @param filePath filesystem path to env file
   */
  public static async loadFromEnv(
    provider: anchor.Provider,
    filePath: string
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

    // TODO: Check oracle is heartbeating when context starts
    if (!process.env.ORACLE) {
      throw new Error(`your env file must have $ORACLE set`);
    }
    const SWITCHBOARD_ORACLE = new PublicKey(process.env.ORACLE);
    const oracle = new sbv2.OracleAccount({
      program: switchboardProgram,
      publicKey: SWITCHBOARD_ORACLE,
    });

    const [switchboardProgramState] =
      sbv2.ProgramStateAccount.fromSeed(switchboardProgram);
    const switchboardMint = await switchboardProgramState.getTokenMint();

    const tokenWallet = await SwitchboardTestContext.createSwitchboardWallet(
      switchboardProgram
    );

    const context: ISwitchboardTestContext = {
      program: switchboardProgram,
      mint: switchboardMint,
      tokenWallet,
      queue,
      oracle,
    };

    return new SwitchboardTestContext(context);
  }

  /** Create a static data feed that resolves to an expected value */
  public async createStaticFeed(
    value: number
  ): Promise<sbv2.AggregatorAccount> {
    const queue = await this.queue.loadData();
    const payerKeypair = sbv2.getPayer(this.program);

    // create aggregator
    const aggregatorAccount = await sbv2.AggregatorAccount.create(
      this.program,
      {
        batchSize: 1,
        minRequiredJobResults: 1,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 5,
        queueAccount: this.queue,
        authorWallet: this.tokenWallet,
      }
    );

    // create permission account and approve if necessary
    const permissionAccount = await sbv2.PermissionAccount.create(
      this.program,
      {
        authority: queue.authority,
        granter: this.queue.publicKey,
        grantee: aggregatorAccount.publicKey,
      }
    );
    if (!queue.unpermissionedFeedsEnabled) {
      if (queue.authority.equals(payerKeypair.publicKey)) {
        await permissionAccount.set({
          authority: payerKeypair,
          enable: true,
          permission: sbv2.SwitchboardPermission.PERMIT_ORACLE_QUEUE_USAGE,
        });
      }
      throw new Error(
        `must provide queue authority to permit data feeds to join`
      );
    }

    // create lease contract
    const leaseAccount = await sbv2.LeaseAccount.create(this.program, {
      aggregatorAccount,
      funder: this.tokenWallet,
      funderAuthority: payerKeypair,
      loadAmount: new anchor.BN(0),
      oracleQueueAccount: this.queue,
    });

    // create and add job account
    const staticJob = await sbv2.JobAccount.create(this.program, {
      name: Buffer.from(`Value ${value}`),
      authorWallet: this.tokenWallet,
      data: Buffer.from(
        OracleJob.encodeDelimited(
          OracleJob.create({
            tasks: [
              OracleJob.Task.create({
                valueTask: OracleJob.ValueTask.create({
                  value,
                }),
              }),
            ],
          })
        ).finish()
      ),
    });
    await aggregatorAccount.addJob(staticJob);

    // open new round and request new result
    await aggregatorAccount.openRound({
      oracleQueueAccount: this.queue,
      payoutWallet: this.tokenWallet,
    });

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
    const aggregator = await aggregatorAccount.loadData();
    const expectedValue = new Big(value);

    const queue = await this.queue.loadData();

    // remove all existing jobs
    const existingJobs: sbv2.JobAccount[] = aggregator.jobPubkeysData
      // eslint-disable-next-line array-callback-return
      .filter((jobKey: PublicKey) => {
        if (!jobKey.equals(DEFAULT_PUBKEY)) {
          return jobKey;
        }
      })
      .map(
        (jobKey) =>
          new sbv2.JobAccount({
            program: this.program,
            publicKey: jobKey,
          })
      );
    await Promise.all(
      existingJobs.map((job) => aggregatorAccount.removeJob(job))
    );

    // add new static job
    const staticJob = await sbv2.JobAccount.create(this.program, {
      name: Buffer.from(`Value ${value}`),
      data: Buffer.from(
        OracleJob.encodeDelimited(
          OracleJob.create({
            tasks: [
              OracleJob.Task.create({
                valueTask: OracleJob.ValueTask.create({
                  value,
                }),
              }),
            ],
          })
        ).finish()
      ),
    });
    await aggregatorAccount.addJob(staticJob);

    // call open round and wait for new value
    const accountsCoder = new anchor.BorshAccountsCoder(this.program.idl);

    let accountWs: number;
    const awaitUpdatePromise = new Promise((resolve: (value: Big) => void) => {
      accountWs = this.program.provider.connection.onAccountChange(
        aggregatorAccount.publicKey,
        async (accountInfo) => {
          const aggregator = accountsCoder.decode(
            "AggregatorAccountData",
            accountInfo.data
          );
          const latestResult = await aggregatorAccount.getLatestValue(
            aggregator
          );
          if (latestResult.eq(expectedValue)) {
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
        this.program.provider.connection.removeAccountChangeListener(accountWs);
      }
    });

    await aggregatorAccount.openRound({
      oracleQueueAccount: this.queue,
      payoutWallet: this.tokenWallet,
    });

    await updatedValuePromise;

    if (!updatedValuePromise) {
      throw new Error(`failed to update aggregator`);
    }
  }
}
