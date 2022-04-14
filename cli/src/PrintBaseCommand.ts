/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import Command, { flags } from "@oclif/command";
import { Input } from "@oclif/parser";
import * as anchor from "@project-serum/anchor";
import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor/dist/cjs/coder";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import * as chalk from "chalk";
import * as path from "path";
import {
  AggregatorClass,
  CrankClass,
  DEFAULT_KEYPAIR,
  JobClass,
  LeaseClass,
  OracleClass,
  OracleQueueClass,
  PermissionClass,
  ProgramStateClass,
  SwitchboardAccountType,
  SWITCHBOARD_DISCRIMINATOR_MAP,
  toVrfStatus,
} from "./accounts";
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
    help: flags.help({ char: "h" }),
    verbose: flags.boolean({
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
    const { flags } = this.parse(<Input<any>>this.constructor);
    PrintBaseCommand.flags = flags;

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
        DEFAULT_KEYPAIR
      ),
      mainnet: await loadAnchor(
        "mainnet-beta",
        new Connection(clusterApiUrl("mainnet-beta")),
        DEFAULT_KEYPAIR
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
        const job = await JobClass.fromAccount(
          this.context,
          new JobAccount({ program, publicKey })
        );
        this.logger.log(job.prettyPrint());
        break;
      }
      case "AggregatorAccountData": {
        const aggregator = await AggregatorClass.fromAccount(
          this.context,
          new AggregatorAccount({ program, publicKey })
        );
        this.logger.log(aggregator.prettyPrint());
        break;
      }
      case "OracleAccountData": {
        const oracle = await OracleClass.fromAccount(
          this.context,
          new OracleAccount({ program, publicKey })
        );
        this.logger.log(oracle.prettyPrint());
        break;
      }
      case "PermissionAccountData": {
        const permission = await PermissionClass.fromAccount(
          this.context,
          new PermissionAccount({ program, publicKey })
        );
        this.logger.log(permission.prettyPrint());
        break;
      }
      case "LeaseAccountData": {
        const lease = await LeaseClass.fromAccount(
          this.context,
          new LeaseAccount({ program, publicKey })
        );
        this.logger.log(lease.prettyPrint());
        break;
      }
      case "OracleQueueAccountData": {
        const queue = await OracleQueueClass.fromAccount(
          this.context,
          new OracleQueueAccount({ program, publicKey })
        );
        this.logger.log(queue.prettyPrint());
        break;
      }
      case "CrankAccountData": {
        const crank = await CrankClass.fromAccount(
          this.context,
          new CrankAccount({ program, publicKey })
        );
        this.logger.log(crank.prettyPrint());
        break;
      }
      case "SbState":
      case "ProgramStateAccountData": {
        const state = await ProgramStateClass.build(program);
        this.logger.log(state.prettyPrint());
        break;
      }
      case "VrfAccountData": {
        const vrfAccount = new VrfAccount({ program, publicKey });
        const vrf = await vrfAccount.loadData();
        const data = {
          status: toVrfStatus(vrf.status),
          authority: vrf.authority?.toString() ?? "",
          counter: vrf.counter.toString(),
          producer: vrf.builders[0]?.producer ?? "",
          result: vrf.currentRound.result
            ? `[${(vrf.currentRound.result as number[]).join(",")}]`
            : "",
          alpha: vrf.currentRound.alpha
            ? `[${(vrf.currentRound.alpha as number[]).join(",")}]`
            : "",
          txRemaining: vrf.builders[0]?.txRemaining ?? "",
        };
        console.log(JSON.stringify(data, undefined, 2));
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

    console.log(`[${Uint8Array.from(accountDiscriminator)}]`);

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
