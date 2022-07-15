import { Command, Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor/dist/cjs/coder";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  DEFAULT_KEYPAIR,
  prettyPrintAggregator,
  prettyPrintBufferRelayer,
  prettyPrintCrank,
  prettyPrintJob,
  prettyPrintLease,
  prettyPrintOracle,
  prettyPrintPermissions,
  prettyPrintProgramState,
  prettyPrintQueue,
  prettyPrintVrf,
  SwitchboardAccountType,
  SWITCHBOARD_DISCRIMINATOR_MAP,
} from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  BufferRelayerAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as path from "path";
import { CliConfig } from "./config";
import { FsProvider } from "./types";
import { CommandContext } from "./types/context/context";
import { LoggerParameters, LogProvider } from "./types/context/logging";
import { FAILED_ICON, loadAnchor } from "./utils";

export interface ClusterConfigs {
  devnet: anchor.Program;
  mainnet: anchor.Program;
}

abstract class PrintBaseCommand extends Command {
  static flags = {
    help: Flags.help({ char: "h" }),
    verbose: Flags.boolean({
      char: "v",
      description: "log everything",
      default: false,
    }),
  };

  public cliConfig: CliConfig;

  public logger: LogProvider;

  public context: CommandContext;

  public clusters: ClusterConfigs;

  async init() {
    const { flags } = (await this.parse(this.constructor as any)) as any;
    // this.flags = flags;

    // setup logging
    const level = flags.silent ? "error" : flags.verbose ? "debug" : "info";
    const logFilename = path.join(this.config.cacheDir, "log.txt");
    const logParameters: LoggerParameters = {
      console: {
        level,
      },
      file: {
        level: "debug",
        filename: logFilename,
      },
      silent: flags.silent,
      verbose: flags.verbose,
    };
    this.logger = new LogProvider(logParameters);

    this.context = {
      logger: this.logger,
      fs: new FsProvider(this.config.dataDir, this.logger),
      config: this.cliConfig,
    };

    this.clusters = {
      devnet: await loadAnchor(
        "devnet",
        new Connection(clusterApiUrl("devnet")),
        Keypair.fromSeed(new Uint8Array(32).fill(1))
      ),
      mainnet: await loadAnchor(
        "mainnet-beta",
        new Connection(clusterApiUrl("mainnet-beta")),
        Keypair.fromSeed(new Uint8Array(32).fill(1))
      ),
    };
  }

  private async printAccount(
    program: anchor.Program,
    publicKey: PublicKey,
    accountType: SwitchboardAccountType
  ) {
    switch (accountType) {
      case "JobAccountData": {
        const job = new JobAccount({ program, publicKey });
        this.logger.log(await prettyPrintJob(job));
        break;
      }

      case "AggregatorAccountData": {
        const aggregator = new AggregatorAccount({ program, publicKey });
        this.logger.log(
          await prettyPrintAggregator(aggregator, undefined, true, true)
        );
        break;
      }

      case "OracleAccountData": {
        const oracle = new OracleAccount({ program, publicKey });
        this.logger.log(await prettyPrintOracle(oracle, undefined, true));
        break;
      }

      case "PermissionAccountData": {
        const permission = new PermissionAccount({ program, publicKey });
        this.logger.log(await prettyPrintPermissions(permission));
        break;
      }

      case "LeaseAccountData": {
        const lease = new LeaseAccount({ program, publicKey });
        this.logger.log(await prettyPrintLease(lease));
        break;
      }

      case "OracleQueueAccountData": {
        const queue = new OracleQueueAccount({ program, publicKey });
        this.logger.log(await prettyPrintQueue(queue));
        break;
      }

      case "CrankAccountData": {
        const crank = new CrankAccount({ program, publicKey });
        this.logger.log(await prettyPrintCrank(crank));
        break;
      }

      case "SbState":
      case "ProgramStateAccountData": {
        const [programState] = ProgramStateAccount.fromSeed(program);
        this.logger.log(await prettyPrintProgramState(programState));
        break;
      }

      case "VrfAccountData": {
        const vrfAccount = new VrfAccount({ program, publicKey });
        this.logger.log(await prettyPrintVrf(vrfAccount));
        break;
      }
      case "BufferRelayerAccountData": {
        const bufferRelayerAccount = new BufferRelayerAccount({
          program,
          publicKey,
        });
        this.logger.log(await prettyPrintBufferRelayer(bufferRelayerAccount));
        break;
      }
      case "BUFFERxx": {
        console.log(`Found buffer account but dont know which one`);
        break;
      }
    }
  }

  // should also check if pubkey is a token account
  async printDevnetAccount(
    publicKey: PublicKey
  ): Promise<SwitchboardAccountType> {
    const account =
      await this.clusters.devnet.provider.connection.getAccountInfo(publicKey);
    if (!account) {
      throw new Error(`devnet account not found`);
    }

    const accountDiscriminator = account.data.slice(
      0,
      ACCOUNT_DISCRIMINATOR_SIZE
    );

    // console.log(`[${Uint8Array.from(accountDiscriminator)}]`);

    for await (const [
      accountType,
      discriminator,
    ] of SWITCHBOARD_DISCRIMINATOR_MAP.entries()) {
      if (Buffer.compare(accountDiscriminator, discriminator) === 0) {
        await this.printAccount(this.clusters.devnet, publicKey, accountType);
        return;
      }
    }

    throw new Error(`no devnet switchboard account found for ${publicKey}`);
  }

  // should also check if pubkey is a token account
  async printMainnetAccount(
    publicKey: PublicKey
  ): Promise<SwitchboardAccountType> {
    const account =
      await this.clusters.mainnet.provider.connection.getAccountInfo(publicKey);
    if (!account) {
      throw new Error(`mainnet account not found`);
    }

    const accountDiscriminator = account.data.slice(
      0,
      ACCOUNT_DISCRIMINATOR_SIZE
    );

    for await (const [
      accountType,
      discriminator,
    ] of SWITCHBOARD_DISCRIMINATOR_MAP.entries()) {
      if (Buffer.compare(accountDiscriminator, discriminator) === 0) {
        await this.printAccount(this.clusters.mainnet, publicKey, accountType);
        return;
      }
    }

    throw new Error(`no mainnet switchboard account found for ${publicKey}`);
  }

  async catch(error, message?: string) {
    // fall back to console if logger is not initialized yet
    const logger = this.logger ?? console;

    if (message) {
      logger.info(chalk.red(`${FAILED_ICON}${message}`));
    }

    if (error.message) {
      const messageLines = error.message.split("\n");
      logger.error(messageLines[0]);
    } else if (error.stack) {
      logger.error(error);
    } else {
      logger.error(error.toString());
    }

    this.exit(1); // causes unreadable errors
  }
}

export default PrintBaseCommand;
