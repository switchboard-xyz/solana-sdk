/* eslint-disable unicorn/prevent-abbreviations */

import { Flags } from "@oclif/core";
import { AnchorProvider } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  sleep,
  SwitchboardTestContext,
  verifyProgramHasPayer,
} from "@switchboard-xyz/sbv2-utils";
import { ChildProcess, exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import BaseCommand from "../../BaseCommand";

export default class AnchorTest extends BaseCommand {
  static description = "run anchor test and a switchboard oracle in parallel";

  dockerOracleProcess?: ChildProcess;
  anchorChildProcess?: ChildProcess;

  timestamp: number = Date.now();

  static flags = {
    ...BaseCommand.flags,
    switchboardDir: Flags.string({
      char: "d",
      description:
        "directory with switchboard.env to load a switchboard environment",
    }),
    oracleKey: Flags.string({
      description: "public key of the oracle to start-up",
    }),
    nodeImage: Flags.string({
      description: "public key of the oracle to start-up",
      default: "dev-v2-08-14-22a-mc-beta",
    }),
    arm: Flags.boolean({
      description: "apple silicon needs to use a docker image for linux/arm64",
    }),
    timeout: Flags.integer({
      char: "t",
      default: 120,
      description: "number of seconds before timing out",
    }),
    silent: Flags.boolean({
      char: "s",
      description: "suppress docker logging",
    }),
  };

  saveLogs(logs: string[], nodeImage: string): string | null {
    if (!fs.existsSync(".switchboard")) {
      fs.mkdirSync(".switchboard");
    }
    const fileName = path.join(
      ".switchboard",
      `docker.${nodeImage}.${Math.floor(this.timestamp / 1000)}.log`
    );
    const filteredLogs = logs.filter((l) => Boolean);
    if (filteredLogs.length > 0) {
      fs.writeFileSync(fileName, filteredLogs.join(""));
      return fileName;
    }

    return null;
  }

  startDockerOracle(
    nodeImage: string,
    platform: string,
    oracleKey: PublicKey,
    keypairPath: string,
    silent = false,
    allLogs: string[] = []
  ) {
    this.dockerOracleProcess = spawn(
      "docker",
      ["start", "--attach", `sbv2-localnet-${nodeImage}`],
      {
        shell: true,
        env: process.env,
        stdio: silent ? null : ["inherit", "pipe", "pipe"],
      }
    );

    this.dockerOracleProcess.stdout.on("data", (data) => {
      allLogs.push(data.toString());
      // logs.push(`\x1b[34m${data.toString()}\x1b[0m`);
      if (!silent) {
        console.log(`\x1b[34m${data.toString()}\x1b[0m`);
      }
    });

    this.dockerOracleProcess.stderr.on("error", (error) => {
      allLogs.push(error.toString());
      // logs.push(`\x1b[31m${error.toString()}\x1b[0m`);
      if (!silent) {
        console.error(`\x1b[31m${error.toString()}\x1b[0m`);
      }
    });

    this.dockerOracleProcess.on("close", (code) => {
      this.saveLogs(allLogs, nodeImage);
      if (code === 0) {
        this.startDockerOracle(
          nodeImage,
          platform,
          oracleKey,
          keypairPath,
          silent,
          allLogs
        );
      } else if (!silent) {
        console.error(`\x1b[31mDocker image exited with code ${code}\x1b[0m`);
      } else if (code !== 0 && code !== 1) {
        console.error(`\x1b[31mDocker image exited with code ${code}\x1b[0m`);
      }
    });
  }

  createDockerOracle(
    nodeImage: string,
    platform: string,
    oracleKey: PublicKey,
    keypairPath: string,
    silent = false,
    allLogs = []
  ) {
    this.dockerOracleProcess = spawn(
      "docker",
      [
        "run",
        `--name sbv2-localnet-${nodeImage}`,
        `--platform=${platform}`,
        `-e ORACLE_KEY=${oracleKey}`,
        `-e CLUSTER=localnet`,
        `-e VERBOSE=1`,
        `--mount type=bind,source=${keypairPath},target=/home/payer_secrets.json`,
        `switchboardlabs/node:${nodeImage}`,
      ],
      {
        shell: true,
        env: process.env,
        stdio: silent ? null : ["inherit", "pipe", "pipe"],
      }
    );

    // let logs: string[] = [];

    this.dockerOracleProcess.stdout.on("data", (data) => {
      // logs.push(`\x1b[34m${data}\x1b[0m`);
      console.log(`\x1b[34m${data}\x1b[0m`);
      allLogs.push(data);
    });

    this.dockerOracleProcess.stderr.on("error", (error) => {
      if (
        !silent ||
        !error
          .toString()
          .includes(
            `The container name "/sbv2-localnet-${nodeImage}" is already in use by container`
          )
      ) {
        // logs.push(`\x1b[31m${error.toString()}\x1b[0m`);
        console.error(`\x1b[31m${error.toString()}\x1b[0m`);
        allLogs.push(error.toString());
      }
    });

    this.dockerOracleProcess.on("close", (code) => {
      this.saveLogs(allLogs, nodeImage);
      // if reboot from no RPC or if image already exists
      if (code === 0 || code === 125) {
        this.startDockerOracle(
          nodeImage,
          platform,
          oracleKey,
          keypairPath,
          silent,
          allLogs
        );
      } else if (!silent) {
        console.error(`\x1b[31mDocker image exited with code ${code}\x1b[0m`);
      } else if (code !== 0) {
        console.error(`\x1b[31mDocker image exited with code ${code}\x1b[0m`);
      }
    });
  }

  async run() {
    verifyProgramHasPayer(this.program);
    const { flags } = await this.parse(AnchorTest);

    let oraclePubkey: PublicKey;
    if (flags.oracleKey) {
      oraclePubkey = new PublicKey(flags.oracleKey);
    } else {
      const switchboard = await SwitchboardTestContext.loadFromEnv(
        this.program.provider as AnchorProvider,
        flags.switchboardDir || undefined
      );
      oraclePubkey = switchboard.oracle.publicKey;
    }

    let isFinished = false;

    const keypairPath =
      flags.keypair.charAt(0) === "/" || flags.keypair.startsWith("C:")
        ? flags.keypair
        : path.join(process.cwd(), flags.keypair);
    const oracleKey = oraclePubkey;

    // start docker oracle first
    this.createDockerOracle(
      flags.nodeImage,
      flags.arm ? "linux/arm64" : "linux/amd64",
      oracleKey,
      keypairPath,
      flags.silent
    );

    this.anchorChildProcess = spawn("anchor", ["test"], {
      shell: true,
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
    });

    this.anchorChildProcess.on("message", (data) => {
      if (data.toString().includes("✨  Done")) {
        exec(`docker kill sbv2-localnet-${flags.nodeImage}`);
        this.dockerOracleProcess.kill();
        isFinished = true;
      }
    });

    this.anchorChildProcess.on("close", (code) => {
      // console.log(`anchor test process closing ...`);
      exec(`docker stop sbv2-localnet-${flags.nodeImage}`);
      isFinished = true;
    });

    const refreshInterval = Math.ceil(flags.timeout / 20);

    let retryCount = 20;
    while (retryCount > 0) {
      if (isFinished) {
        break;
      }
      await sleep(refreshInterval * 1000);
      --retryCount;
    }

    try {
      this.anchorChildProcess.kill();
      this.dockerOracleProcess.kill();
    } catch {}
  }

  async catch(error) {
    super.catch(error, "Failed to create localnet test environment");
  }
}
