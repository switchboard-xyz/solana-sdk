import { Flags } from "@oclif/core";
import { prettyPrintJob } from "@switchboard-xyz/sbv2-utils";
import {
  JobAccount,
  OracleJob,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import fs from "fs";
import path from "path";
import BaseCommand from "../../../BaseCommand";
import { verifyProgramHasPayer } from "../../../utils";

export default class JobCreate extends BaseCommand {
  static description = "create a job account";

  static flags = {
    ...BaseCommand.flags,
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that will be the account authority",
    }),
    name: Flags.string({
      char: "n",
      description: "name of the buffer account",
    }),
  };

  static args = [
    {
      name: "jobDefinition",
      required: true,
      description: "filesystem path to job definition",
    },
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = await this.parse(JobCreate);
    const payerKeypair = programWallet(this.program);
    const authority = await this.loadAuthority(flags.authority);

    const jobDefinitionPath = args.jobDefinition.startsWith("/")
      ? args.jobDefinition
      : path.join(process.cwd(), args.jobDefinition);
    if (!fs.existsSync(jobDefinitionPath)) {
      throw new Error(`jobDefinitionPath does not exist, ${jobDefinitionPath}`);
    }

    const oracleJob = OracleJob.fromObject(
      JSON.parse(
        fs
          .readFileSync(jobDefinitionPath, "utf-8")
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/g, "")
      )
    );
    const jobAccount = await JobAccount.create(this.program, {
      authority: authority.publicKey,
      name: flags.name ? Buffer.from(flags.name) : Buffer.from(""),
      data: Buffer.from(OracleJob.encodeDelimited(oracleJob).finish()),
    });

    if (this.silent) {
      this.logger.info(jobAccount.publicKey.toString());
      return;
    }

    const jobData = await jobAccount.loadData();
    this.logger.info(await prettyPrintJob(jobAccount, jobData));
  }

  async catch(error) {
    super.catch(error, "failed to create job account");
  }
}
