import type * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import TaskRunner from "..";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedSubtractError extends SwitchboardTaskError {
  constructor() {
    super(`unexpected error`, "Subtract");
  }
}

export class SubtractTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.ISubtractTask,
    input: Big,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const subtractTask = OracleJob.SubtractTask.create(task);
    const cache = context?.cache ?? undefined;

    let result: any;

    switch (subtractTask.Subtraction) {
      case "scalar": {
        result = new Big(subtractTask.scalar);
        break;
      }

      case "aggregatorPubkey": {
        const aggregatorKey = new PublicKey(subtractTask.aggregatorPubkey);
        const aggregatorAccount = new AggregatorAccount({
          program,
          publicKey: aggregatorKey,
        });
        let aggregator: any;
        if (cache && cache.hasAggregatorPromise(aggregatorKey)) {
          /// If the aggregator result is already known to our feedIndexCache, it
          /// should be used to subtract
          aggregator = await cache.getAggregatorPromise(aggregatorKey);
        } else {
          const aggregatorPromise: Promise<any> = aggregatorAccount.loadData();
          // Save the promise in the cache before calling await. This way other
          // requests will re-use the same promise.
          if (cache)
            cache.setAggregatorPromise(aggregatorKey, aggregatorPromise);
          aggregator = await aggregatorPromise;
        }

        result = await aggregatorAccount.getLatestValue(aggregator);
        break;
      }

      case "job": {
        const job = OracleJob.create(subtractTask.job ?? undefined);
        result = await TaskRunner.performTasks(job.tasks, program, context);
        break;
      }
      // No default
    }

    if (!result) {
      throw new UnexpectedSubtractError();
    }

    return input.sub(result);
  }
}
