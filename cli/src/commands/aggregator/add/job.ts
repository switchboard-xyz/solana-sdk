import { Flags } from "@oclif/core";
import BaseCommand from "../../../BaseCommand";

export default class AggregatorAddJob extends BaseCommand {
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

    // const aggregatorAccount = new AggregatorAccount({
    //   program: this.program,
    //   publicKey: new PublicKey(args.aggregatorKey),
    // });
    // const aggregator = await aggregatorAccount.loadData();
    // const authority = await this.loadAuthority(
    //   flags.authority,
    //   aggregator.authority
    // );

    // let jobAccount: JobAccount;
    // if (flags.jobDefinition) {
    //   const jobDefinition = JSON.parse(flags.jobDefinition, pubKeyReviver);
    //   // create job account
    // }

    // if (flags.jobKey) {
    //   jobAccount = new JobAccount({
    //     program: this.program,
    //     publicKey: new PublicKey(flags.jobKey),
    //   });
    // }

    // const job = this.jobAccount
    //   ? await JobClass.fromAccount(this.context, this.jobAccount)
    //   : await JobClass.build(this.context, this.program, this.jobDefinition);
    // const txn = await this.aggregatorAccount.addJob(
    //   job.account,
    //   this.aggregatorAuthority
    // );
    // const aggregator = await AggregatorClass.fromAccount(
    //   this.context,
    //   this.aggregatorAccount
    // );
    // if (this.silent) {
    //   console.log(txn);
    //   ReadableStreamDefaultController;
    // }
    // this.logger.log(
    //   `${chalk.green(
    //     `${CHECK_ICON}Job succesfully added to aggregator account\r\n`
    //   )}`
    // );
    // this.logger.log(
    //   `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
    // );
  }

  async catch(error) {
    super.catch(error, "failed to add job to aggregator account");
  }
}
