import type * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import TaskRunner from "../";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";
import * as BigUtil from "../utils/big";

export class DivideResultError extends SwitchboardTaskError {
  constructor(result: Big) {
    super(`cannot divide by result ${result}`, "Divide");
  }
}

export class DivideTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.IDivideTask,
    input: Big,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const divideTask = OracleJob.DivideTask.create(task);
    const cache = context?.cache ?? undefined;
    let result: Big;

    // WARNING: JS protobuf default populates numerical fields with default
    // values even if null.  Must explicity check the enum population
    // (and possibly change the rest of the enum checks)
    switch (divideTask.Denominator) {
      case "scalar": {
        result = new Big(divideTask.scalar);
        break;
      }

      case "aggregatorPubkey": {
        const aggregatorKey = new PublicKey(divideTask.aggregatorPubkey);
        const aggregatorAccount = new AggregatorAccount({
          program,
          publicKey: aggregatorKey,
        });
        let aggregator: any;
        if (cache && cache.hasAggregatorPromise(aggregatorKey)) {
          /// If the aggregator result is already known to our feedIndexCache, it
          /// should be used to divide
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
        const { tasks } = OracleJob.create(divideTask.job ?? undefined);
        const divideResult = await TaskRunner.performTasks(
          tasks,
          program,
          context
        );
        if (divideResult.isErr()) throw divideResult.error;
        result = divideResult.value;
        break;
      }
    }

    if (result === null || result.eq(new Big(0))) {
      throw new DivideResultError(result);
    }

    return BigUtil.safeDiv(input, result);
  }
}
