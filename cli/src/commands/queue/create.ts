/* eslint-disable unicorn/new-for-builtins */
import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import {
  fromQueueJSON,
  getArrayOfSizeN,
  OracleQueueClass,
  PermissionClass,
  pubKeyConverter,
} from "../../accounts";
import BaseCommand from "../../BaseCommand";
import { OutputFileExistsNoForce } from "../../types";
import {
  CHECK_ICON,
  FAILED_ICON,
  loadKeypair,
  verifyProgramHasPayer,
} from "../../utils";

export default class QueueCreate extends BaseCommand {
  queueAuthority?: Keypair;

  definition: fromQueueJSON;

  outputFile?: string;

  force = false;

  static description = "create an oracle queue";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite output file if existing",
      default: false,
    }),
    authority: flags.string({
      char: "a",
      description:
        "keypair to delegate authority to for creating permissions targeted at the queue",
    }),
    name: flags.string({
      char: "n",
      description: "name of the queue for easier identification",
    }),
    minStake: flags.string({
      description: "minimum stake required by an oracle to join the queue",
    }),
    reward: flags.string({
      char: "r",
      description:
        "oracle rewards for successfully responding to an update request",
    }),
    numCranks: flags.integer({
      char: "c",
      description: "number of cranks to add to the queue",
    }),
    numOracles: flags.integer({
      char: "o",
      description: "number of oracles to add to the queue",
    }),
    queueSize: flags.integer({
      description: "maximum number of oracles the queue can support",
    }),
    outputFile: flags.string({
      char: "f",
      description: "output queue schema to a json file",
    }),
  };

  static examples = [
    "$ sbv2 queue:create --keypair ../authority-keypair.json --name queue-1",
    "$ sbv2 queue:create --keypair ../payer-keypair.json --name queue-1 --authority ../authority-keypair.json",
    "$ sbv2 queue:create --keypair ../authority-keypair.json --name queue-1 --numCranks 1 --numOracles 1 --outputFile new-queue.json",
  ];

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);

    const { flags } = this.parse(QueueCreate);

    this.outputFile = flags.outputFile
      ? path.join(process.cwd(), flags.outputFile)
      : undefined;

    this.force = flags.force;
    if (this.outputFile && fs.existsSync(this.outputFile) && !this.force) {
      throw new OutputFileExistsNoForce(this.outputFile);
    }

    this.queueAuthority = flags.authority
      ? await loadKeypair(flags.authority)
      : (this.program.provider.wallet as anchor.Wallet).payer;

    this.definition = {
      name: flags.name || "",
      minStake: flags.minStake ? Number.parseInt(flags.minStake, 10) : 0,
      reward: flags.reward ? Number.parseInt(flags.reward, 10) : 0,
      authorityPublicKey: this.queueAuthority.publicKey,
      queueSize: flags.queueSize ?? 0,
    };

    if (flags.numCranks) {
      this.definition.cranks = flags.numCranks;
    }

    if (flags.numOracles) {
      this.definition.oracles = getArrayOfSizeN(flags.numOracles).map((n) => {
        return {
          name: `Oracle-${n}`,
          authorityPublicKey: this.queueAuthority.publicKey,
        };
      });
    }
  }

  async run() {
    const queue = await OracleQueueClass.fromJSON(
      this.context,
      this.program,
      this.definition
    );

    // grant oracle permissions to use the queue
    for await (const oracle of queue.oracles) {
      oracle.permissionAccount = await PermissionClass.grantPermission(
        this.context,
        oracle.account,
        this.queueAuthority
      );
    }

    if (this.silent) {
      console.log(queue.publicKey.toString());
    } else {
      this.logger.log(queue.prettyPrint(true));
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Oracle Queue account created successfully`
        )}`
      );
    }

    if (this.outputFile) {
      fs.writeFileSync(
        this.outputFile,
        JSON.stringify(queue, pubKeyConverter, 2)
      );
      if (!this.silent) {
        this.logger.log(
          `${chalk.green(`${CHECK_ICON}Oracle queue outputted to json file`)} ${
            this.outputFile
          }`
        );
      }
    }
  }

  async catch(error) {
    if (!this.silent) {
      this.logger.error(
        chalk.red(`${FAILED_ICON}Failed to create queue account`)
      );
      this.logger.error(error.message);
      this.logger.error(error.stack);
      this.exit(1);
    }
  }
}
