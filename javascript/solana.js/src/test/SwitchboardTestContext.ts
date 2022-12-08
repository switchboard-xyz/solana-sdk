import * as anchor from '@project-serum/anchor';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { QueueAccount } from '../accounts';
import { SwitchboardProgram } from '../program';
import fs from 'fs';
import path from 'path';
import { BNtoDateTimeString } from '@switchboard-xyz/common';
import { Mint } from '../mint';

export const LATEST_DOCKER_VERSION = 'dev-v2-RC_12_05_22_22_48';

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
    readonly queue: QueueAccount
  ) {}

  // static async load(): Promise<SwitchboardTestContext> {
  //   throw new Error(`Not implemented yet`);
  // }

  // public static findSwitchboardEnv(envFileName = 'switchboard.env'): string {
  //   throw new Error(`Not implemented yet`);
  // }

  // public async createStaticFeed(
  //   value: number,
  //   timeout = 30
  // ): Promise<AggregatorAccount> {
  //   throw new Error(`Not implemented yet`);
  // }

  // public async updateStaticFeed(
  //   aggregatorAccount: AggregatorAccount,
  //   value: number,
  //   timeout = 30
  // ): Promise<AggregatorAccount> {
  //   throw new Error(`Not implemented yet`);
  // }

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

    const [accounts] = await program.createNetwork({
      name: 'Test Queue',
      metadata: `created ${BNtoDateTimeString(
        new anchor.BN(Math.floor(Date.now() / 1000))
      )}`,
      reward: 0,
      minStake: 0,
      queueSize: 10,
      dataBufferKeypair: dataBufferKeypair,
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
      oracleQueue: accounts.queueAccount.publicKey,
      oracleQueueAuthority: program.walletPubkey,
      oracleQueueBuffer: dataBufferKeypair.publicKey,
      crank: crank.publicKey,
      crankBuffer: crankBufferKeypair.publicKey,
      oracle: oracle.account.publicKey,
      oracleAuthority: program.walletPubkey,
      oracleEscrow: oracleStakingWalletKeypair.publicKey,
      oraclePermissions: oracle.permissions.account.publicKey,
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
    return Object.keys(this)
      .map(key => {
        if (this[key] instanceof PublicKey) {
          return `${camelToUpperCaseWithUnderscores(key)}="${this[
            key
          ].toBase58()}"`;
        }
        return;
      })
      .filter(Boolean)
      .join('\n');
  }

  public get anchorToml(): string {
    return [
      `[provider]
cluster = "localnet"
wallet = "${this.payerKeypairPath}"

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
