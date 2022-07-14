import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import {
  buffer2string,
  chalkString,
  jsonReplacers,
  prettyPrintAggregator,
} from "@switchboard-xyz/sbv2-utils";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class AggregatorPrint extends BaseCommand {
  static enableJsonFlag = true;

  static description = "Print the deserialized Switchboard aggregator account";

  static aliases = ["aggregator:print"];

  static flags = {
    ...BaseCommand.flags,
    jobs: Flags.boolean({
      description: "output job definitions",
      default: false,
    }),
    oraclePubkeysData: Flags.boolean({
      char: "o",
      description: "print the assigned oracles for the current round",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:print GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR",
  ];

  async run() {
    const { args, flags } = await this.parse(AggregatorPrint);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();

    if (flags.json) {
      const parsedAggregator = {
        ...aggregator,
        name: buffer2string(aggregator.name),
        metadata: buffer2string(aggregator.metadata),
        reserved1: undefined,
        jobPubkeysData: aggregator.jobPubkeysData.slice(
          0,
          aggregator.jobPubkeysSize
        ),
        jobWeights: aggregator.jobWeights.slice(0, aggregator.jobPubkeysSize),
        // jobHashes: aggregator.jobHashes.slice(0, aggregator.jobPubkeysSize),
        jobHashes: undefined,
        jobsChecksum: undefined,
        currentRound: {
          ...aggregator.currentRound,
          mediansData: aggregator.currentRound.mediansData.slice(
            0,
            aggregator.oracleRequestBatchSize
          ),
          currentPayout: aggregator.currentRound.currentPayout.slice(
            0,
            aggregator.oracleRequestBatchSize
          ),
          mediansFulfilled: aggregator.currentRound.mediansFulfilled.slice(
            0,
            aggregator.oracleRequestBatchSize
          ),
          errorsFulfilled: aggregator.currentRound.errorsFulfilled.slice(
            0,
            aggregator.oracleRequestBatchSize
          ),
          oraclePubkeysData: aggregator.currentRound.oraclePubkeysData.filter(
            (pubkey) => !PublicKey.default.equals(pubkey)
          ),
        },
        latestConfirmedRound: {
          ...aggregator.latestConfirmedRound,
          mediansData: aggregator.latestConfirmedRound.mediansData.slice(
            0,
            aggregator.oracleRequestBatchSize
          ),
          currentPayout: aggregator.latestConfirmedRound.currentPayout.slice(
            0,
            aggregator.oracleRequestBatchSize
          ),
          mediansFulfilled:
            aggregator.latestConfirmedRound.mediansFulfilled.slice(
              0,
              aggregator.oracleRequestBatchSize
            ),
          errorsFulfilled:
            aggregator.latestConfirmedRound.errorsFulfilled.slice(
              0,
              aggregator.oracleRequestBatchSize
            ),
          oraclePubkeysData:
            aggregator.latestConfirmedRound.oraclePubkeysData.filter(
              (pubkey) => !PublicKey.default.equals(pubkey)
            ),
        },
      };
      return JSON.parse(JSON.stringify(parsedAggregator, jsonReplacers));
    }

    this.logger.log(
      await prettyPrintAggregator(
        aggregatorAccount,
        aggregator,
        true,
        true,
        flags.jobs
      )
    );

    if (flags.oraclePubkeysData) {
      this.logger.log(
        chalkString(
          "oraclePubkeyData",
          "\n" +
            (aggregator.currentRound.oraclePubkeysData as PublicKey[])
              .filter((pubkey) => !PublicKey.default.equals(pubkey))
              .map((pubkey) => pubkey.toString())
              .join("\n")
        )
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to print aggregator account");
  }
}
