import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  OracleJob,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import fs from "fs";
import path from "path";
import BaseCommand from "../../../BaseCommand";
import { verifyProgramHasPayer } from "../../../utils";

export default class AggregatorCreate extends BaseCommand {
  static description = "create an aggregator account";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({ description: "skip job confirmation" }),
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the authority for the aggregator",
    }),
    forceReportPeriod: flags.string({
      description:
        "Number of seconds for which, even if the variance threshold is not passed, accept new responses from oracles.",
    }),
    batchSize: flags.string({
      description: "number of oracles requested for each open round call",
    }),
    minJobs: flags.string({
      description: "number of jobs that must respond before an oracle responds",
    }),
    minOracles: flags.string({
      description:
        "number of oracles that must respond before a value is accepted on-chain",
    }),
    newQueue: flags.string({
      description: "public key of the new oracle queue",
    }),
    updateInterval: flags.string({
      description: "set an aggregator's minimum update delay",
    }),
    varianceThreshold: flags.string({
      description:
        "percentage change between a previous accepted result and the next round before an oracle reports a value on-chain. Used to conserve lease cost during low volatility",
    }),
    job: flags.string({
      char: "j",
      description: "filesystem path to job definition file",
      multiple: true,
    }),
  };

  static args = [
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description:
        "public key of the oracle queue account to create aggregator for",
    },
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = this.parse(AggregatorCreate);

    const payerKeypair = programWallet(this.program);

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });
    const switchTokenMint = await queueAccount.loadMint();
    const payerTokenWallet = (
      await switchTokenMint.getOrCreateAssociatedAccountInfo(
        payerKeypair.publicKey
      )
    ).address;

    const jobs = flags.job.map((jobDefinition) => {
      const jobJson = JSON.parse(
        fs.readFileSync(
          jobDefinition.startsWith("/")
            ? jobDefinition
            : path.join(process.cwd(), jobDefinition),
          "utf8"
        )
      );
      if (!jobJson || !("tasks" in jobJson)) {
        throw new Error("job definition missing tasks");
      }
      const data = Buffer.from(
        OracleJob.encodeDelimited(
          OracleJob.create({
            tasks: jobJson.tasks,
          })
        ).finish()
      );
    });
  }

  async catch(error) {
    super.catch(error, "Failed to create aggregator account");
  }
}
