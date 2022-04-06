import type * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedValueError extends SwitchboardTaskError {
  constructor() {
    super(`unexpected error`, "Value");
  }
}

export class ValueTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    valueTask: OracleJob.IValueTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    // Convert task to JSON to remove any default values that might come with it.
    const task = OracleJob.ValueTask.create(valueTask);

    if (task.Value === "value") {
      return new Big(task.value ?? 0);
    }

    if (task.Value === "aggregatorPubkey") {
      const aggregatorAccount = new AggregatorAccount({
        program,
        publicKey: new PublicKey(task.aggregatorPubkey ?? ""),
      });
      const value: Big = await aggregatorAccount.getLatestValue();
      if (value === null) {
        throw new Error("AggregatorEmptyError");
      }

      return value;
    }

    throw new UnexpectedValueError();
  }
}
