import { Flags } from "@oclif/core";
import { PublicKey, Transaction } from "@solana/web3.js";
import { verifyProgramHasPayer } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  OracleQueueAccount,
  programWallet,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON } from "../../../utils";

export default class AggregatorSet extends BaseCommand {
  static description = "set an aggregator's config";

  static aliases = ["set:aggregator"];

  static flags = {
    ...BaseCommand.flags,
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that is the authority for the aggregator",
    }),
    forceReportPeriod: Flags.string({
      description:
        "Number of seconds for which, even if the variance threshold is not passed, accept new responses from oracles.",
    }),
    // batchSize: Flags.string({
    //   description: "number of oracles requested for each open round call",
    // }),
    minJobs: Flags.string({
      description: "number of jobs that must respond before an oracle responds",
    }),
    minOracles: Flags.string({
      description:
        "number of oracles that must respond before a value is accepted on-chain",
    }),
    newQueue: Flags.string({
      description: "public key of the new oracle queue",
    }),
    updateInterval: Flags.string({
      description: "set an aggregator's minimum update delay",
    }),
    varianceThreshold: Flags.string({
      description:
        "percentage change between a previous accepted result and the next round before an oracle reports a value on-chain. Used to conserve lease cost during low volatility",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:set GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --updateInterval 300 --minOracles 3 --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args, flags } = await this.parse(AggregatorSet);
    verifyProgramHasPayer(this.program);

    const payerKeypair = programWallet(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();
    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    const txn = new Transaction({ feePayer: payerKeypair.publicKey });

    // batch size
    // if (flags.batchSize) {
    //   const batchSize = Number.parseInt(args.batchSize, 10);
    //   //   if (batchSize <= 0 || batchSize > 16) {
    //   //     throw new Error(`Invalid batch size (1 - 16), ${batchSize}`);
    //   //   }
    //   //   if (flags.minOracles && Number.parseInt(flags.minOracles) > batchSize) {
    //   //     throw new Error(
    //   //       `Batch size ${batchSize} must be greater than minOracleResults ${flags.minOracles}`
    //   //     );
    //   //   }
    //   //   if (
    //   //     flags.minOracles === undefined &&
    //   //     Number.parseInt(aggregator.minOracleResults) > batchSize
    //   //   ) {
    //   //     throw new Error(
    //   //       `Batch size ${batchSize} must be greater than minOracleResults ${aggregator.minOracleResults}`
    //   //     );
    //   //   }

    //   txn.add(
    //     await this.program.methods
    //       .aggregatorSetBatchSize({
    //         batchSize: batchSize,
    //       })
    //       .accounts({
    //         aggregator: aggregatorAccount.publicKey,
    //         authority: authority.publicKey,
    //       })
    //       .instruction()
    //   );
    // }

    // min oracles responses
    if (flags.minOracles) {
      const minOracles = Number.parseInt(flags.minOracles, 10);
      txn.add(
        await this.program.methods
          .aggregatorSetMinOracles({
            minOracleResults: minOracles,
          })
          .accounts({
            aggregator: aggregatorAccount.publicKey,
            authority: authority.publicKey,
          })
          .instruction()
      );
    }

    // min job responses
    if (flags.minJobs) {
      const minJobs = Number.parseInt(flags.minJobs, 10);
      txn.add(
        await this.program.methods
          .aggregatorSetMinJobs({
            minJobResults: minJobs,
          })
          .accounts({
            aggregator: aggregatorAccount.publicKey,
            authority: authority.publicKey,
          })
          .instruction()
      );
    }

    // oracle queue
    if (flags.newQueue) {
      const queueAccount = new OracleQueueAccount({
        program: this.program,
        publicKey: new PublicKey(flags.newQueue),
      });
      txn.add(
        await this.program.methods
          .aggregatorSetQueue({})
          .accounts({
            aggregator: aggregatorAccount.publicKey,
            authority: authority.publicKey,
            queue: queueAccount.publicKey,
          })
          .instruction()
      );
    }

    // force report period
    if (flags.forceReportPeriod) {
      txn.add(
        await this.program.methods
          .aggregatorSetForceReportPeriod({
            forceReportPeriod: Number.parseInt(flags.forceReportPeriod, 10),
          })
          .accounts({
            aggregator: aggregatorAccount.publicKey,
            authority: authority.publicKey,
          })
          .instruction()
      );
    }

    // variance threshold
    if (flags.varianceThreshold) {
      const varianceThreshold = new Big(flags.varianceThreshold);
      txn.add(
        await this.program.methods
          .aggregatorSetVarianceThreshold({
            varianceThreshold: SwitchboardDecimal.fromBig(varianceThreshold),
          })
          .accounts({
            aggregator: aggregatorAccount.publicKey,
            authority: authority.publicKey,
          })
          .instruction()
      );
    }

    // update interval
    if (flags.updateInterval) {
      const updateInterval = Number.parseInt(flags.updateInterval, 10);
      txn.add(
        await this.program.methods
          .aggregatorSetUpdateInterval({
            newInterval: updateInterval,
          })
          .accounts({
            aggregator: aggregatorAccount.publicKey,
            authority: authority.publicKey,
          })
          .instruction()
      );
    }

    const signature = await this.program.provider.sendAndConfirm(txn, [
      payerKeypair,
      authority,
    ]);

    if (this.silent) {
      console.log(signature);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Aggregator force report period set successfully`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${signature}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator's config");
  }
}
