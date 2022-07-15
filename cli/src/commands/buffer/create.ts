import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import { prettyPrintBufferRelayer } from "@switchboard-xyz/sbv2-utils";
import {
  BufferRelayerAccount,
  JobAccount,
  OracleJob,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import fs from "fs";
import path from "path";
import BaseCommand from "../../BaseCommand";
import { verifyProgramHasPayer } from "../../utils";

export default class BufferCreate extends BaseCommand {
  static description = "create a buffer relayer account";

  static flags = {
    ...BaseCommand.flags,
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that will be the aggregator authority",
    }),
    name: Flags.string({
      char: "n",
      description: "name of the buffer account",
    }),
    minUpdateDelaySeconds: Flags.integer({
      description: "minimum number of seconds between update calls",
      default: 30,
    }),
    jobDefinition: Flags.string({
      description: "filesystem path to job definition",
      exclusive: ["jobKey"],
    }),
    jobKey: Flags.string({
      description: "public key of existing job account",
      exclusive: ["jobDefinition"],
    }),
  };

  static args = [
    {
      name: "queueKey",
      description: "oracle queue to create BufferRelayer account on",
    },
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = await this.parse(BufferCreate);
    const payerKeypair = programWallet(this.program);
    const authority = await this.loadAuthority(flags.authority);

    let jobAccount: JobAccount;
    if (flags.jobDefinition) {
      const jobDefinitionPath = flags.jobDefinition.startsWith("/")
        ? flags.jobDefinition
        : path.join(process.cwd(), flags.jobDefinition);
      if (!fs.existsSync(jobDefinitionPath)) {
        throw new Error(
          `jobDefinitionPath does not exist, ${jobDefinitionPath}`
        );
      }

      const oracleJob = OracleJob.create(
        JSON.parse(fs.readFileSync(jobDefinitionPath, "utf-8"))
      );
      jobAccount = await JobAccount.create(this.program, {
        authority: authority.publicKey,
        name: flags.name ? Buffer.from(flags.name) : Buffer.from(""),
        data: Buffer.from(OracleJob.encodeDelimited(oracleJob).finish()),
      });
    } else if (flags.jobKey) {
      jobAccount = new JobAccount({
        program: this.program,
        publicKey: new PublicKey(flags.jobKey),
      });
    } else {
      throw new Error(`Need to provide --jobDefinition or --jobKey flag`);
    }

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: new PublicKey(args.queueKey),
    });

    const bufferRelayerAccount = await BufferRelayerAccount.create(
      this.program,
      {
        authority: authority.publicKey,
        name: flags.name ? Buffer.from(flags.name) : Buffer.from(""),
        minUpdateDelaySeconds: flags.minUpdateDelaySeconds,
        queueAccount,
        jobAccount,
      }
    );
    if (this.silent) {
      this.logger.info(bufferRelayerAccount.publicKey.toString());
      return;
    }

    this.logger.info(await prettyPrintBufferRelayer(bufferRelayerAccount));
  }

  async catch(error) {
    super.catch(error, "failed to create buffer relayer account");
  }
}
