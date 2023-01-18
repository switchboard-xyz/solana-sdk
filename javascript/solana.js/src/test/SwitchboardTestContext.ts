import * as anchor from '@project-serum/anchor';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { BNtoDateTimeString, OracleJob } from '@switchboard-xyz/common';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { AggregatorAccount, JobAccount, QueueAccount } from '../accounts';
import {
  DEVNET_GENESIS_HASH,
  SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_QUEUE,
} from '../const';
import { AggregatorAccountData } from '../generated';
import { Mint } from '../mint';
import { SwitchboardNetwork } from '../SwitchboardNetwork';
import { AnchorWallet, SwitchboardProgram } from '../SwitchboardProgram';
import { TransactionObject } from '../TransactionObject';

export const LATEST_DOCKER_VERSION = 'dev-v2-RC_01_05_23_03_24';

/** Get the program data address for a given programId
 * @param programId the programId for a given on-chain program
 * @return the publicKey of the address holding the upgradeable program buffer
 */
export const getProgramDataAddress = (programId: PublicKey): PublicKey => {
  return anchor.utils.publicKey.findProgramAddressSync(
    [programId.toBytes()],
    new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')
  )[0];
};

/** Get the IDL address for a given programId
 * @param programId the programId for a given on-chain program
 * @return the publicKey of the IDL address
 */
export const getIdlAddress = async (
  programId: PublicKey
): Promise<PublicKey> => {
  const base = (await PublicKey.findProgramAddress([], programId))[0];
  return PublicKey.createWithSeed(base, 'anchor:idl', programId);
};

export class SwitchboardTestContext {
  constructor(
    readonly program: SwitchboardProgram,
    readonly queue: QueueAccount,
    readonly payerTokenWallet: PublicKey
  ) {}

  public static async load(
    provider: anchor.AnchorProvider,
    params?: {
      tokenAmount?: number;
      queueKey?: PublicKey | string;
      filePath?: string;
    }
  ): Promise<SwitchboardTestContext> {
    // fetch genesis hash

    const genesisHash = await provider.connection.getGenesisHash();
    if (genesisHash === DEVNET_GENESIS_HASH) {
      // if queueKey is defined should we bother loading the local env?

      // first try to load the local env
      try {
        const testContext = await SwitchboardTestContext.loadFromEnv(
          provider,
          params?.filePath ?? undefined,
          params?.tokenAmount ?? undefined
        );
        // verify the oracle is heartbeating
        const oracles = await testContext.queue.loadActiveOracleAccounts();
        if (oracles.length > 0) {
          return testContext;
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}

      // fallback to the devnet permissionless queue
      try {
        const testContext = await SwitchboardTestContext.loadDevnetQueue(
          provider,
          params?.queueKey ?? undefined,
          params?.tokenAmount ?? undefined
        );
        // verify the oracle is heartbeating
        const oracles = await testContext.queue.loadActiveOracleAccounts();
        if (oracles.length > 0) {
          return testContext;
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}

      throw new Error(
        `Failed to load a Switchboard environment from a local file or the devnet permissionless queue`
      );
    } else {
      const testContext = await SwitchboardTestContext.loadFromEnv(
        provider,
        params?.filePath ?? undefined,
        params?.tokenAmount ?? undefined
      );
      return testContext;
    }
  }

  /** Load SwitchboardTestContext using a specified queue
   * @param provider anchor Provider containing connection and payer Keypair
   * @param queueKey the oracle queue to load
   * @param tokenAmount number of tokens to populate in switchboard mint's associated token account
   */
  static async loadDevnetQueue(
    provider: anchor.AnchorProvider,
    queueKey: PublicKey | string = SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_QUEUE,
    tokenAmount = 0
  ) {
    const payerKeypair = (provider.wallet as AnchorWallet).payer;

    const balance = await provider.connection.getBalance(
      payerKeypair.publicKey
    );
    if (!balance) {
      try {
        await provider.connection.requestAirdrop(
          payerKeypair.publicKey,
          1_000_000_000
        );
        // eslint-disable-next-line no-empty
      } catch {}
    }

    const program = await SwitchboardProgram.load(
      'devnet',
      provider.connection,
      payerKeypair
    ).catch(error => {
      throw new Error(
        `Failed to load the SBV2 program for the given cluster, ${error.message}`
      );
    });

    const queueAccount = new QueueAccount(
      program,
      typeof queueKey === 'string' ? new PublicKey(queueKey) : queueKey
    );
    try {
      await queueAccount.loadData();
      const oracles = await queueAccount.loadOracles();
      if (oracles.length < 1) {
        throw new Error(`OracleQueue has no active oracles heartbeating`);
      }
    } catch (error) {
      throw new Error(
        `Failed to load the SBV2 queue for the given cluster, ${
          (error as any).message
        }`
      );
    }

    const [userTokenAmount] = await program.mint.getOrCreateWrappedUser(
      program.walletPubkey,
      { fundUpTo: tokenAmount }
    );

    return new SwitchboardTestContext(program, queueAccount, userTokenAmount);
  }

  /** Recursively loop through directories and return the filepath of switchboard.env
   * @param envFileName alternative filename to search for. defaults to switchboard.env
   * @returns the filepath for a switchboard env file to load
   */
  public static findSwitchboardEnv(envFileName = 'switchboard.env'): string {
    const NotFoundError = new Error(
      'failed to find switchboard.env file in current directory recursively'
    );
    let retryCount = 5;

    let currentDirectory = process.cwd();
    while (retryCount > 0) {
      // look for switchboard.env
      try {
        const currentPath = path.join(currentDirectory, envFileName);
        if (fs.existsSync(currentPath)) {
          return currentPath;
        }
        // eslint-disable-next-line no-empty
      } catch {}

      // look for .switchboard directory
      try {
        const localSbvPath = path.join(currentDirectory, '.switchboard');
        if (fs.existsSync(localSbvPath)) {
          const localSbvEnvPath = path.join(localSbvPath, envFileName);
          if (fs.existsSync(localSbvEnvPath)) {
            return localSbvEnvPath;
          }
        }
        // eslint-disable-next-line no-empty
      } catch {}

      currentDirectory = path.join(currentDirectory, '../');

      --retryCount;
    }

    throw NotFoundError;
  }

  /** Load SwitchboardTestContext from an env file containing $SWITCHBOARD_PROGRAM_ID, $ORACLE_QUEUE, $AGGREGATOR
   * @param provider anchor Provider containing connection and payer Keypair
   * @param filePath filesystem path to env file
   * @param tokenAmount number of tokens to populate in switchboard mint's associated token account
   */
  public static async loadFromEnv(
    provider: anchor.AnchorProvider,
    filePath = SwitchboardTestContext.findSwitchboardEnv(),
    tokenAmount = 0
  ): Promise<SwitchboardTestContext> {
    // eslint-disable-next-line node/no-unpublished-require
    dotenv.config({ path: filePath });
    if (!process.env.SWITCHBOARD_PROGRAM_ID) {
      throw new Error(`your env file must have $SWITCHBOARD_PROGRAM_ID set`);
    }
    if (!process.env.ORACLE_QUEUE) {
      throw new Error(`your env file must have $ORACLE_QUEUE set`);
    }

    const program = await SwitchboardProgram.load(
      'devnet',
      provider.connection,
      (provider.wallet as AnchorWallet).payer,
      new PublicKey(process.env.SWITCHBOARD_PROGRAM_ID)
    );

    const balance = await provider.connection.getBalance(program.walletPubkey);
    if (!balance) {
      try {
        const airdropSignature = await provider.connection.requestAirdrop(
          program.walletPubkey,
          1_000_000_000
        );
        await provider.connection.confirmTransaction(airdropSignature);
        // eslint-disable-next-line no-empty
      } catch {}
    }

    const queueAccount = new QueueAccount(
      program,
      new PublicKey(process.env.ORACLE_QUEUE)
    );

    const [userTokenAmount] = await program.mint.getOrCreateWrappedUser(
      program.walletPubkey,
      { fundUpTo: tokenAmount }
    );

    return new SwitchboardTestContext(program, queueAccount, userTokenAmount);
  }

  /**
   * Create a static data feed that resolves to an expected value
   * @param value - the static value the feed will resolve to
   * @param timeout - the number of milliseconds to wait before timing out
   */
  public async createStaticFeed(
    value: number,
    timeout = 30000
  ): Promise<[AggregatorAccount, AggregatorAccountData]> {
    const [aggregatorAccount] = await this.queue.createFeed({
      name: `Value ${value}`,
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 10,
      enable: true,
      queueAuthorityPubkey: this.program.walletPubkey,
      jobs: [
        {
          data: OracleJob.encodeDelimited(
            OracleJob.create({
              tasks: [
                OracleJob.Task.create({
                  valueTask: OracleJob.ValueTask.create({
                    value,
                  }),
                }),
              ],
            })
          ).finish(),
        },
      ],
    });

    const [state] = await aggregatorAccount.openRoundAndAwaitResult(
      undefined,
      timeout
    );

    return [aggregatorAccount, state];
  }

  /**
   * Update an existing aggregator that resolves to a new static value then await the new result
   * @params aggregatorAccount - the aggregator account to modify
   * @param value - the static value the feed will resolve to
   * @param timeout - the number of milliseconds to wait before timing out
   */
  public async updateStaticFeed(
    aggregatorAccount: AggregatorAccount,
    value: number,
    timeout = 30000
  ): Promise<[AggregatorAccount, AggregatorAccountData]> {
    const aggregator = await aggregatorAccount.loadData();

    const [jobAccount, jobInit] = JobAccount.createInstructions(
      this.program,
      this.program.walletPubkey,
      {
        data: OracleJob.encodeDelimited(
          OracleJob.create({
            tasks: [
              OracleJob.Task.create({
                valueTask: OracleJob.ValueTask.create({
                  value,
                }),
              }),
            ],
          })
        ).finish(),
      }
    );

    const oldJobKeys = aggregator.jobPubkeysData.filter(
      pubkey => !pubkey.equals(PublicKey.default)
    );

    const oldJobs: Array<[JobAccount, number]> = oldJobKeys.map((pubkey, i) => [
      new JobAccount(this.program, pubkey),
      i,
    ]);

    const removeJobTxns = oldJobs.map(job =>
      aggregatorAccount.removeJobInstruction(this.program.walletPubkey, {
        job: job[0],
        jobIdx: job[1],
      })
    );

    const addJobTxn = aggregatorAccount.addJobInstruction(
      this.program.walletPubkey,
      { job: jobAccount }
    );

    const txns = TransactionObject.pack([
      ...jobInit,
      ...removeJobTxns,
      addJobTxn,
    ]);
    await this.program.signAndSendAll(txns);

    const [state] = await aggregatorAccount.openRoundAndAwaitResult(
      undefined,
      timeout
    );

    return [aggregatorAccount, state];
  }

  static async createEnvironment(
    payerKeypairPath: string,
    alternateProgramId?: PublicKey
  ): Promise<SwitchboardTestEnvironment> {
    const fullKeypairPath =
      payerKeypairPath.startsWith('/') || payerKeypairPath.startsWith('C:')
        ? payerKeypairPath
        : path.join(process.cwd(), payerKeypairPath);
    if (!fs.existsSync(fullKeypairPath)) {
      throw new Error('Failed to find payer keypair path');
    }

    const payerKeypair = Keypair.fromSecretKey(
      new Uint8Array(
        JSON.parse(
          fs.readFileSync(fullKeypairPath, {
            encoding: 'utf-8',
          })
        )
      )
    );

    const connection = new Connection(clusterApiUrl('devnet'), {
      commitment: 'confirmed',
    });

    const program = await SwitchboardProgram.load(
      'devnet',
      connection,
      payerKeypair,
      alternateProgramId
    );

    const [userTokenWallet] = await program.mint.getOrCreateWrappedUser(
      program.walletPubkey,
      { amount: 0 }
    );

    const programDataAddress = getProgramDataAddress(program.programId);
    const idlAddress = await getIdlAddress(program.programId);

    // use pre-generated keypairs so we dont need to rely on account loading
    const dataBufferKeypair = Keypair.generate();
    const crankBufferKeypair = Keypair.generate();
    const oracleStakingWalletKeypair = Keypair.generate();

    const [accounts] = await SwitchboardNetwork.create(program, {
      name: 'Test Queue',
      metadata: `created ${BNtoDateTimeString(
        new anchor.BN(Math.floor(Date.now() / 1000))
      )}`,
      authority: payerKeypair,
      reward: 0,
      minStake: 0,
      queueSize: 10,
      dataBufferKeypair: dataBufferKeypair,
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: true,
      slashingEnabled: false,
      cranks: [
        {
          name: 'Test Crank',
          maxRows: 100,
          dataBufferKeypair: crankBufferKeypair,
        },
      ],
      oracles: [
        {
          name: 'Test Oracle',
          enable: true,
          stakingWalletKeypair: oracleStakingWalletKeypair,
          queueAuthorityPubkey: program.walletPubkey,
        },
      ],
    });

    const crank = accounts.cranks.shift();
    if (!crank) {
      throw new Error(`Failed to create the crank`);
    }

    const oracle = accounts.oracles.shift();
    if (!oracle) {
      throw new Error(`Failed to create the oracle`);
    }

    // async load the accounts
    const programState = await accounts.programState.account.loadData();

    return new SwitchboardTestEnvironment({
      switchboardProgramId: program.programId,
      switchboardProgramDataAddress: programDataAddress,
      switchboardIdlAddress: idlAddress,
      switchboardProgramState: accounts.programState.account.publicKey,
      switchboardVault: programState.tokenVault,
      switchboardMint: programState.tokenMint.equals(PublicKey.default)
        ? Mint.native
        : programState.tokenMint,
      tokenWallet: userTokenWallet,
      oracleQueue: accounts.queue.account.publicKey,
      oracleQueueAuthority: program.walletPubkey,
      oracleQueueBuffer: dataBufferKeypair.publicKey,
      crank: crank.account.publicKey,
      crankBuffer: crankBufferKeypair.publicKey,
      oracle: oracle.account.publicKey,
      oracleAuthority: program.walletPubkey,
      oracleEscrow: oracleStakingWalletKeypair.publicKey,
      oraclePermissions: oracle.permission.account.publicKey,
      payerKeypairPath: fullKeypairPath,
    });
  }
}

export interface ISwitchboardTestEnvironment {
  switchboardProgramId: PublicKey;
  switchboardProgramDataAddress: PublicKey;
  switchboardIdlAddress: PublicKey;
  switchboardProgramState: PublicKey;
  switchboardVault: PublicKey;
  switchboardMint: PublicKey;
  tokenWallet: PublicKey;
  oracleQueue: PublicKey;
  oracleQueueAuthority: PublicKey;
  oracleQueueBuffer: PublicKey;
  crank: PublicKey;
  crankBuffer: PublicKey;
  oracle: PublicKey;
  oracleAuthority: PublicKey;
  oracleEscrow: PublicKey;
  oraclePermissions: PublicKey;
  payerKeypairPath: string;
}

export class SwitchboardTestEnvironment implements ISwitchboardTestEnvironment {
  switchboardProgramId: PublicKey;
  switchboardProgramDataAddress: PublicKey;
  switchboardIdlAddress: PublicKey;
  switchboardProgramState: PublicKey;
  switchboardVault: PublicKey;
  switchboardMint: PublicKey;
  tokenWallet: PublicKey;
  oracleQueue: PublicKey;
  oracleQueueAuthority: PublicKey;
  oracleQueueBuffer: PublicKey;
  crank: PublicKey;
  crankBuffer: PublicKey;
  oracle: PublicKey;
  oracleAuthority: PublicKey;
  oracleEscrow: PublicKey;
  oraclePermissions: PublicKey;
  payerKeypairPath: string;

  constructor(ctx: ISwitchboardTestEnvironment) {
    this.switchboardProgramId = ctx.switchboardProgramId;
    this.switchboardProgramDataAddress = ctx.switchboardProgramDataAddress;
    this.switchboardIdlAddress = ctx.switchboardIdlAddress;
    this.switchboardProgramState = ctx.switchboardProgramState;
    this.switchboardVault = ctx.switchboardVault;
    this.switchboardMint = ctx.switchboardMint;
    this.tokenWallet = ctx.tokenWallet;
    this.oracleQueue = ctx.oracleQueue;
    this.oracleQueueAuthority = ctx.oracleQueueAuthority;
    this.oracleQueueBuffer = ctx.oracleQueueBuffer;
    this.crank = ctx.crank;
    this.crankBuffer = ctx.crankBuffer;
    this.oracle = ctx.oracle;
    this.oracleAuthority = ctx.oracleAuthority;
    this.oracleEscrow = ctx.oracleEscrow;
    this.oraclePermissions = ctx.oraclePermissions;
    this.payerKeypairPath = ctx.payerKeypairPath;
  }

  public get envFileString(): string {
    // const fileString = Object.keys(this)
    //   .map(key => {
    //     if (this[key] instanceof PublicKey) {
    //       return `${camelToUpperCaseWithUnderscores(key)}="${this[
    //         key
    //       ].toBase58()}"`;
    //     }
    //     return;
    //   })
    //   .filter(Boolean)
    //   .join('\n');
    return `SWITCHBOARD_PROGRAM_ID="${this.switchboardProgramId.toBase58()}"
SWITCHBOARD_PROGRAM_DATA_ADDRESS="${this.switchboardProgramDataAddress.toBase58()}"
SWITCHBOARD_IDL_ADDRESS="${this.switchboardIdlAddress.toBase58()}"
SWITCHBOARD_PROGRAM_STATE="${this.switchboardProgramState.toBase58()}"
SWITCHBOARD_VAULT="${this.switchboardVault.toBase58()}"
SWITCHBOARD_MINT="${this.switchboardMint.toBase58()}"
TOKEN_WALLET="${this.tokenWallet.toBase58()}"
ORACLE_QUEUE="${this.oracleQueue.toBase58()}"
ORACLE_QUEUE_AUTHORITY="${this.oracleQueueAuthority.toBase58()}"
ORACLE_QUEUE_BUFFER="${this.oracleQueueBuffer.toBase58()}"
CRANK="${this.crank.toBase58()}"
CRANK_BUFFER="${this.crankBuffer.toBase58()}"
ORACLE="${this.oracle.toBase58()}"
ORACLE_AUTHORITY="${this.oracleAuthority.toBase58()}"
ORACLE_ESCROW="${this.oracleEscrow.toBase58()}"
ORACLE_PERMISSIONS="${this.oraclePermissions.toBase58()}"`;
  }

  public get anchorToml(): string {
    return [
      `
[test]
startup_wait = 10000

[test.validator]
url = "https://api.devnet.solana.com"
`,
      Object.keys(this)
        .map(key => {
          if (this[key] instanceof PublicKey) {
            return `[[test.validator.clone]] # ${key}\naddress = "${this[key]}"`;
          }
        })
        .filter(Boolean)
        .join('\n\n'),
    ].join('\n\n');
  }

  public get accountCloneString(): string {
    const accounts = Object.keys(this).map(key => {
      if (typeof this[key] === 'string') {
        return;
      }

      return `--clone ${(this[key] as PublicKey).toBase58()} \`# ${key}\` `;
    });

    return accounts.filter(Boolean).join(`\\\n`);
  }

  public get dockerCompose(): string {
    return `version: "3.3"
services:
  oracle:
    image: "switchboardlabs/node:\${SBV2_ORACLE_VERSION:-${LATEST_DOCKER_VERSION}}" # https://hub.docker.com/r/switchboardlabs/node/tags
    network_mode: host
    restart: always
    secrets:
      - PAYER_SECRETS
    environment:
      - VERBOSE=1
      - CLUSTER=\${CLUSTER:-localnet}
      - HEARTBEAT_INTERVAL=30 # Seconds
      - ORACLE_KEY=${this.oracle.toBase58()}
      - TASK_RUNNER_SOLANA_RPC=${clusterApiUrl('mainnet-beta')}
    #  - RPC_URL=\${RPC_URL}
secrets:
  PAYER_SECRETS:
    file: ${this.payerKeypairPath}`;
  }

  public get localValidatorScript(): string {
    return `#!/bin/bash
    
mkdir -p .anchor/test-ledger

solana-test-validator -r --ledger .anchor/test-ledger --mint ${this.oracleAuthority.toBase58()} --bind-address 0.0.0.0 --url ${clusterApiUrl(
      'devnet'
    )} --rpc-port 8899 ${this.accountCloneString}`;
  }

  public get startOracleScript(): string {
    return `#!/usr/bin/env bash

script_dir=$( cd -- "$( dirname -- "\${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

docker-compose -f  "$script_dir"/docker-compose.switchboard.yml up`;
  }

  public toJSON(): ISwitchboardTestEnvironment {
    return {
      switchboardProgramId: this.switchboardProgramId,
      switchboardProgramDataAddress: this.switchboardProgramDataAddress,
      switchboardIdlAddress: this.switchboardIdlAddress,
      switchboardProgramState: this.switchboardProgramState,
      switchboardVault: this.switchboardVault,
      switchboardMint: this.switchboardMint,
      tokenWallet: this.tokenWallet,
      oracleQueue: this.oracleQueue,
      oracleQueueAuthority: this.oracleQueueAuthority,
      oracleQueueBuffer: this.oracleQueueBuffer,
      crank: this.crank,
      crankBuffer: this.crankBuffer,
      oracle: this.oracle,
      oracleAuthority: this.oracleAuthority,
      oracleEscrow: this.oracleEscrow,
      oraclePermissions: this.oraclePermissions,
      payerKeypairPath: this.payerKeypairPath,
    };
  }

  /** Write switchboard test environment to filesystem */
  public writeAll(outputDir: string): void {
    fs.mkdirSync(outputDir, { recursive: true });
    this.writeEnv(outputDir);
    this.writeJSON(outputDir);
    this.writeScripts(outputDir);
    this.writeDockerCompose(outputDir);
    this.writeAnchorToml(outputDir);
  }

  /** Write the env file to filesystem */
  public writeEnv(filePath: string): void {
    const ENV_FILE_PATH = path.join(filePath, 'switchboard.env');
    fs.writeFileSync(ENV_FILE_PATH, this.envFileString);
  }

  public writeJSON(outputDir: string): void {
    const JSON_FILE_PATH = path.join(outputDir, 'switchboard.json');
    fs.writeFileSync(
      JSON_FILE_PATH,
      JSON.stringify(
        this.toJSON(),
        (key, value) => {
          if (value instanceof PublicKey) {
            return value.toBase58();
          }
          return value;
        },
        2
      )
    );
  }

  public writeScripts(outputDir: string): void {
    // create script to start local validator with accounts cloned
    const LOCAL_VALIDATOR_SCRIPT = path.join(
      outputDir,
      'start-local-validator.sh'
    );
    fs.writeFileSync(LOCAL_VALIDATOR_SCRIPT, this.localValidatorScript);
    fs.chmodSync(LOCAL_VALIDATOR_SCRIPT, '755');

    // create bash script to start local oracle
    const ORACLE_SCRIPT = path.join(outputDir, 'start-oracle.sh');
    fs.writeFileSync(ORACLE_SCRIPT, this.startOracleScript);
    fs.chmodSync(ORACLE_SCRIPT, '755');
  }

  public writeDockerCompose(outputDir: string): void {
    const DOCKER_COMPOSE_FILEPATH = path.join(
      outputDir,
      'docker-compose.switchboard.yml'
    );
    fs.writeFileSync(DOCKER_COMPOSE_FILEPATH, this.dockerCompose);
  }

  public writeAnchorToml(outputDir: string) {
    const ANCHOR_TOML_FILEPATH = path.join(
      outputDir,
      'Anchor.switchboard.toml'
    );
    fs.writeFileSync(ANCHOR_TOML_FILEPATH, this.anchorToml);
  }
}

export function camelToUpperCaseWithUnderscores(str: string): string {
  // Use a regular expression to match any uppercase or lowercase letters followed by uppercase letters
  // and replace them with a matched group (the uppercase or lowercase letters) followed by an underscore
  // and the uppercase letter
  return (
    str
      .replace(/([a-z]+)([A-Z])/g, (_, p1, p2) => p1 + '_' + p2)
      // Make the entire string uppercase
      .toUpperCase()
  );
}
