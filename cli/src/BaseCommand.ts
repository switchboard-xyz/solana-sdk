/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import Command, { flags } from "@oclif/command";
import { Input } from "@oclif/parser";
import * as anchor from "@project-serum/anchor";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { getPayer } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { DEFAULT_KEYPAIR } from "./accounts";
import { CliConfig, ConfigParameter, DEFAULT_CONFIG } from "./config";
import { AuthorityMismatch, NoPayerKeypairProvided } from "./types";
import { CommandContext } from "./types/context/context";
import { FsProvider } from "./types/context/FsProvider";
import { LoggerParameters, LogProvider } from "./types/context/logging";
import { FAILED_ICON, loadAnchor, loadKeypair, toCluster } from "./utils";

abstract class BaseCommand extends Command {
  static flags = {
    help: flags.help({ char: "h" }),
    verbose: flags.boolean({
      char: "v",
      description: "log everything",
      default: false,
    }),
    silent: flags.boolean({
      char: "s",
      description: "suppress cli prompts",
      default: false,
    }),
    mainnetBeta: flags.boolean({
      description: "WARNING: use mainnet-beta solana cluster",
    }),
    rpcUrl: flags.string({
      char: "u",
      description: "alternate RPC url",
    }),
    keypair: flags.string({
      char: "k",
      description:
        "keypair that will pay for onchain transactions. defaults to new account authority if no alternate authority provided",
    }),
  };

  public silent: boolean; // TODO: move to logger

  public verbose: boolean; // TODO: move to logger

  public cluster: Cluster;

  public connection: Connection;

  public cliConfig: CliConfig;

  public logger: LogProvider;

  public context: CommandContext;

  public program: anchor.Program;

  public payerKeypair?: Keypair | undefined = undefined;

  async init() {
    const { flags } = this.parse(<Input<any>>this.constructor);
    BaseCommand.flags = flags;

    // setup logging
    this.silent = flags.silent;
    this.verbose = flags.verbose;
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

    fs.mkdirSync(this.config.dataDir, { recursive: true });

    this.loadConfig();

    this.cluster = flags.mainnetBeta
      ? toCluster("mainnet-beta")
      : toCluster("devnet");
    const url = flags.rpcUrl ?? clusterApiUrl(this.cluster);
    try {
      this.connection = new Connection(url, {
        commitment: "finalized",
      });
    } catch {
      this.connection = new Connection(clusterApiUrl(this.cluster), {
        commitment: "finalized",
      });
      this.logger.log(
        `resetting rpc url for ${this.cluster}. invalid URL ${url}`
      );
      this.setConfig(
        this.cluster === "devnet" ? "devnet-rpc" : "mainnet-rpc",
        clusterApiUrl(this.cluster)
      );
    }

    if (flags.keypair) {
      this.payerKeypair = await loadKeypair(flags.keypair);
      if (this.payerKeypair === undefined) {
        throw new NoPayerKeypairProvided();
      }
      this.program = await loadAnchor(
        this.cluster,
        this.connection,
        this.payerKeypair
      );
    } else {
      this.logger.debug(`no keypair provided, using dummy keypair`);
      this.program = await loadAnchor(
        this.cluster,
        this.connection,
        DEFAULT_KEYPAIR // set to dummy keypair
      );
    }

    this.program = await loadAnchor(
      this.cluster,
      this.connection,
      this.payerKeypair ?? DEFAULT_KEYPAIR // set to dummy keypair
    );

    if (this.verbose) {
      this.logger.log("verbose logging enabled");
    }
    this.logger.debug(chalk.underline(chalk.blue("## Config".padEnd(16))));
    this.logger.debug(
      `${chalk.yellow("cluster:")} ${chalk.blue(this.cluster)}`
    );
    this.logger.debug(`${chalk.yellow("rpc:")} ${chalk.blue(url)}`);

    this.context = {
      logger: this.logger,
      fs: new FsProvider(this.config.dataDir, this.logger),
      config: this.cliConfig,
    };
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
    }
    // if (error.stack) {
    //   logger.error(error);
    // } else {
    //   logger.error(error.toString());
    // }

    // this.exit(1); // causes unreadable errors?
  }

  /** Load an authority from a CLI flag and optionally check if it matches the expected account authority */
  async loadAuthority(
    authorityPath?: string,
    expectedAuthority?: PublicKey
  ): Promise<Keypair> {
    const authority = authorityPath
      ? await loadKeypair(authorityPath)
      : getPayer(this.program);

    if (expectedAuthority && !expectedAuthority.equals(authority.publicKey)) {
      throw new AuthorityMismatch();
    }

    return authority;
  }

  mainnetCheck(): void {
    if (this.cluster === "mainnet-beta") {
      throw new Error(
        `switchboardv2-cli is still in beta, mainnet is disabled for this command.`
      );
    }
  }

  loadConfig(): void {
    const configPath = path.join(this.config.configDir, "config.json");
    if (fs.existsSync(configPath)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userConfig: CliConfig = JSON.parse(
        fs.readFileSync(configPath, "utf-8")
      );
      this.cliConfig = userConfig;
    } else {
      fs.mkdirSync(this.config.configDir, { recursive: true });
      this.saveConfig(DEFAULT_CONFIG);
    }
  }

  saveConfig(config: CliConfig): void {
    this.cliConfig = config;
    const configPath = path.join(this.config.configDir, "config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, undefined, 2));
    this.logger.info(chalk.green("Saved Config: ") + configPath);
  }

  setConfig(parameter: ConfigParameter, value?: string) {
    switch (parameter) {
      case "devnet-rpc": {
        const newConfig = {
          ...this.cliConfig,
          devnet: {
            ...this.cliConfig.devnet,
            rpcUrl: value || clusterApiUrl(toCluster("devnet")),
          },
        };
        this.saveConfig(newConfig);
        break;
      }
      case "mainnet-rpc": {
        const newConfig = {
          ...this.cliConfig,
          mainnet: {
            ...this.cliConfig.devnet,
            rpcUrl: value || clusterApiUrl(toCluster("mainnet-beta")),
          },
        };
        this.saveConfig(newConfig);
        break;
      }
      default: {
        this.logger.warn("not implemented yet");
      }
    }
  }

  getRpcUrl(cluster: Cluster): string {
    switch (cluster) {
      case "devnet":
        return (
          this.cliConfig.devnet.rpcUrl || clusterApiUrl(toCluster("devnet"))
        );
      case "mainnet-beta":
        return (
          this.cliConfig.devnet.rpcUrl ||
          clusterApiUrl(toCluster("mainnet-beta"))
        );
    }
  }
}

export default BaseCommand;
