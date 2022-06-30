import { Command, Flags } from "@oclif/core";
import { Input } from "@oclif/parser";
import * as anchor from "@project-serum/anchor";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { BigUtils } from "@switchboard-xyz/sbv2-utils";
import {
  AnchorWallet,
  getSwitchboardPid,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { CliConfig, ConfigParameter, DEFAULT_CONFIG } from "./config";
import { AuthorityMismatch } from "./types";
import { CommandContext } from "./types/context/context";
import { FsProvider } from "./types/context/FsProvider";
import { LoggerParameters, LogProvider } from "./types/context/logging";
import { FAILED_ICON, loadKeypair, toCluster } from "./utils";

abstract class BaseCommand extends Command {
  static flags = {
    verbose: Flags.boolean({
      char: "v",
      description: "log everything",
    }),
    silent: Flags.boolean({
      char: "s",
      description: "suppress cli prompts",
    }),
    mainnetBeta: Flags.boolean({
      description: "WARNING: use mainnet-beta solana cluster",
    }),
    rpcUrl: Flags.string({
      char: "u",
      description: "alternate RPC url",
    }),
    programId: Flags.string({
      description: "alternative Switchboard program ID to interact with",
    }),
    keypair: Flags.string({
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

  public payerKeypair: Keypair;

  async init() {
    const { flags } = await this.parse((<Input<any>>this.constructor) as any);
    BaseCommand.flags = flags as any;

    // setup logging
    this.silent = (flags as any).silent;
    this.verbose = (flags as any).verbose;
    const level = (flags as any).silent
      ? "error"
      : (flags as any).verbose
      ? "debug"
      : "info";
    const logFilename = path.join(this.config.cacheDir, "log.txt");
    const logParameters: LoggerParameters = {
      console: {
        level,
      },
      file: {
        level: "debug",
        filename: logFilename,
      },
      silent: this.silent ?? false,
      verbose: this.verbose ?? false,
    };
    this.logger = new LogProvider(logParameters);

    fs.mkdirSync(this.config.dataDir, { recursive: true });

    this.loadConfig();

    this.cluster = (flags as any).mainnetBeta
      ? toCluster("mainnet-beta")
      : toCluster("devnet");

    const url =
      (flags as any).rpcUrl ??
      this.getRpcUrl(this.cluster) ??
      clusterApiUrl(this.cluster);

    try {
      this.connection = new Connection(url, {
        commitment: "confirmed",
      });
    } catch {
      this.connection = new Connection(clusterApiUrl(this.cluster), {
        commitment: "confirmed",
      });
      this.logger.log(
        `resetting rpc url for ${this.cluster}. invalid URL ${url}`
      );
      this.setConfig(
        this.cluster === "devnet" ? "devnet-rpc" : "mainnet-rpc",
        clusterApiUrl(this.cluster)
      );
    }

    this.payerKeypair = (flags as any).keypair
      ? await loadKeypair((flags as any).keypair)
      : Keypair.fromSeed(new Uint8Array(32).fill(1));

    const programId = (flags as any).programId
      ? new anchor.web3.PublicKey((flags as any).programId)
      : getSwitchboardPid(this.cluster as "mainnet-beta" | "devnet");

    const wallet = new AnchorWallet(this.payerKeypair);
    const provider = new anchor.AnchorProvider(this.connection, wallet, {
      commitment: "confirmed",
      // preflightCommitment: "finalized",
    });

    const anchorIdl = await anchor.Program.fetchIdl(programId, provider);
    if (!anchorIdl) {
      throw new Error(`failed to read idl for ${programId}`);
    }

    this.program = new anchor.Program(anchorIdl, programId, provider);

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

  async catch(error: any, message?: string) {
    // fall back to console if logger is not initialized yet
    const logger = this.logger ?? console;

    if (message) {
      logger.info(chalk.red(`${FAILED_ICON}${message}`));
    }

    if (error.message) {
      const messageLines = error.message.split("\n");
      logger.error(messageLines[0]);
    }

    if (this.verbose) {
      console.error(error);
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
    authorityPath: string | unknown,
    expectedAuthority?: PublicKey
  ): Promise<Keypair> {
    const authority: Keypair =
      typeof authorityPath === "string"
        ? await loadKeypair(authorityPath)
        : programWallet(this.program);

    if (expectedAuthority && !expectedAuthority.equals(authority.publicKey)) {
      throw new AuthorityMismatch();
    }

    return authority;
  }

  mainnetCheck(): void {
    if (this.cluster === "mainnet-beta") {
      throw new Error(
        "switchboardv2-cli is still in beta, mainnet is disabled for this command."
      );
    }
  }

  loadConfig(): void {
    const configPath = path.join(this.config.configDir, "config.json");
    if (fs.existsSync(configPath)) {
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
          this.cliConfig.devnet.rpcUrl ?? clusterApiUrl(toCluster("devnet"))
        );
      case "mainnet-beta":
        return (
          this.cliConfig.mainnet.rpcUrl ??
          clusterApiUrl(toCluster("mainnet-beta"))
        );
      default:
        return clusterApiUrl(toCluster("devnet"));
    }
  }

  // Converts a string to a tokenAmount
  // If a decimal is found, it will be normalized using 9 decimal places
  getTokenAmount(value: string, decimals = 9): anchor.BN {
    if (Number.isNaN(Number(value))) {
      throw new TypeError("tokenAmount must be an integer or decimal");
    }

    if (value.split(".").length > 1) {
      const float = new Big(value);
      const scale = BigUtils.safePow(new Big(10), decimals);
      const tokenAmount = BigUtils.safeMul(float, scale);
      return new anchor.BN(tokenAmount.toFixed(0));
    }

    return new anchor.BN(value);
  }
}

export default BaseCommand;
