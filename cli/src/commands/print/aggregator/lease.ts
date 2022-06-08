import { PublicKey } from "@solana/web3.js";
import { prettyPrintLease } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  LeaseAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../../BaseCommand";

export default class AggregatorLeasePrint extends BaseCommand {
  static description =
    "Print the lease account associated with a Switchboard aggregator account";

  static aliases = ["aggregator:lease:print", "aggregator:print:lease"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      description:
        "public key of the aggregator account to fetch permission account and deserialize",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:lease:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee",
  ];

  async run() {
    const { args } = await this.parse(AggregatorLeasePrint);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregator.queuePubkey,
    });
    const queue = await queueAccount.loadData();

    const [leaseAccount] = LeaseAccount.fromSeed(
      this.program,
      queueAccount,
      aggregatorAccount
    );
    try {
      const lease = await leaseAccount.loadData();
      this.logger.log(await prettyPrintLease(leaseAccount, lease));
    } catch {
      this.logger.error(`failed to find a lease account`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to print lease account");
  }
}
