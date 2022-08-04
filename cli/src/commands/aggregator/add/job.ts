import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  JobAccount,
  OracleJob,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON } from "../../../utils";

export default class AggregatorAddJob extends BaseCommand {
  jobAccount: JobAccount;
  aggregatorAccount: AggregatorAccount;

  static description = "add a job to an aggregator";

  static flags = {
    ...BaseCommand.flags,
    jobDefinition: Flags.string({
      description: "filesystem path of job json definition file",
      exclusive: ["jobKey"],
    }),
    jobKey: Flags.string({
      description:
        "public key of an existing job account to add to an aggregator",
      exclusive: ["jobDefinition"],
    }),
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that is the authority for the aggregator",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account",
    },
  ];

  static examples = ["$ sbv2 aggregator:add:job"];

  async run() {
    const { args, flags } = await this.parse(AggregatorAddJob);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregatorData = await aggregatorAccount.loadData();
    const authority = await this.loadAuthority(
      flags.authority,
      aggregatorData.authority
    );

    let jobAccount: JobAccount;
    if (flags.jobDefinition) {
      const jobJson = JSON.parse(
        fs
          .readFileSync(
            flags.jobDefinition.startsWith("/")
              ? flags.jobDefinition
              : path.join(process.cwd(), flags.jobDefinition),
            "utf8"
          )
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/g, "")
      );
      if (!jobJson || !("tasks" in jobJson)) {
        throw new Error("job definition missing tasks");
      }

      const jobKeypair = anchor.web3.Keypair.generate();

      const data = Buffer.from(
        OracleJob.encodeDelimited(
          OracleJob.create({
            tasks: jobJson.tasks,
          })
        ).finish()
      );

      jobAccount = await JobAccount.create(this.program, {
        data,
        keypair: jobKeypair,
        authority: authority.publicKey,
      });
    }

    if (flags.jobKey) {
      jobAccount = new JobAccount({
        program: this.program,
        publicKey: new PublicKey(flags.jobKey),
      });
    }

    if (!jobAccount) {
      throw new Error(`Failed to load JobAccount`);
    }

    const txn = await aggregatorAccount.addJob(jobAccount, authority, 1);

    if (this.silent) {
      console.log(txn);
    }
    this.logger.log(
      `${chalk.green(
        `${CHECK_ICON}Job successfully added to aggregator account`
      )}`
    );
    this.logger.log(
      `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
    );
  }

  async catch(error) {
    super.catch(error, "failed to add job to aggregator account");
  }
}
