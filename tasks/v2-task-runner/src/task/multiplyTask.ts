import type * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import TaskRunner from "../";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedMultiplyError extends SwitchboardTaskError {
  constructor() {
    super(`unexpected error`, "Multiply");
  }
}

export class MultiplyTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.IMultiplyTask,
    input: Big,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const multiplyTask = OracleJob.MultiplyTask.create(task);
    const cache = context?.cache ?? undefined;
    let result: Big | null;

    switch (multiplyTask.Multiple) {
      case "scalar": {
        result = new Big(multiplyTask.scalar);
        break;
      }

      case "aggregatorPubkey": {
        const aggregatorKey = new PublicKey(multiplyTask.aggregatorPubkey);
        const aggregatorAccount = new AggregatorAccount({
          program,
          publicKey: aggregatorKey,
        });
        const cachingKey = aggregatorKey.toBase58();
        let aggregator: any;
        if (cache && cache.hasAggregatorPromise(aggregatorKey)) {
          /// If the aggregator result is already known to our feedIndexCache, it
          /// should be used to multiply.
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
        const { tasks } = OracleJob.create(multiplyTask.job ?? undefined);
        const multiplyResult = await TaskRunner.performTasks(
          tasks,
          program,
          context
        );
        if (multiplyResult.isErr()) throw multiplyResult.error;
        result = multiplyResult.value;
        break;
      }
    }

    if (!result) {
      throw new UnexpectedMultiplyError();
    }

    return input.mul(result);
  }
}
