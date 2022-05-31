import { flags } from "@oclif/command";
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
  static description = "create a buffer relayer account";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that will be the aggregator authority",
    }),
    name: flags.string({
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
    const { args, flags } = this.parse(JobCreate);
    const payerKeypair = programWallet(this.program);
    const authority = await this.loadAuthority(flags.authority);

    const jobDefinitionPath = args.jobDefinition.startsWith("/")
      ? args.jobDefinition
      : path.join(process.cwd(), args.jobDefinition);
    if (!fs.existsSync(jobDefinitionPath)) {
      throw new Error(`jobDefinitionPath does not exist, ${jobDefinitionPath}`);
    }

    const oracleJob = OracleJob.create(
      JSON.parse(fs.readFileSync(jobDefinitionPath, "utf-8"))
    );
    if (!("tasks" in oracleJob)) {
      throw new Error("Must provide tasks in job definition");
    }

    const data = Buffer.from(
      OracleJob.encodeDelimited(
        OracleJob.create({
          tasks: oracleJob.tasks,
        })
      ).finish()
    );
    console.log(`DATA: [${data.join(",")}]`);
    const jobAccount = await JobAccount.create(this.program, {
      authority: authority.publicKey,
      name: flags.name ? Buffer.from(flags.name) : Buffer.from(""),
      data,
    });

    if (this.silent) {
      this.logger.info(jobAccount.publicKey.toString());
      return;
    }

    const job = await jobAccount.loadData();
    this.logger.info(await prettyPrintJob(jobAccount, job));

    console.log(`DATA: [${job.data.join(",")}]`);
  }

  async catch(error) {
    super.catch(error, "failed to create buffer relayer account");
  }
}
