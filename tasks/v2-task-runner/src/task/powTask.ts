import type * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";
import * as BigUtil from "../utils/big";

export class UnexpectedPowerError extends SwitchboardTaskError {
  constructor() {
    super(`unexpected error`, "Power");
  }
}

export class PowTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.IPowTask,
    input: Big,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const powTask = OracleJob.PowTask.create(task);
    const cache = context?.cache ?? undefined;

    if (powTask.Exponent === "scalar") {
      return BigUtil.safePow(input, powTask.scalar ?? 1);
    }

    if (powTask.Exponent === "aggregatorPubkey") {
      const aggregatorAccount = new AggregatorAccount({
        program,
        publicKey: new PublicKey(powTask.aggregatorPubkey ?? ""),
      });
      const value: Big = await aggregatorAccount.getLatestValue();
      if (value === null) {
        throw new Error("AggregatorEmptyError");
      }

      return BigUtil.safePow(input, value.toNumber());
    }

    throw new UnexpectedPowerError();
  }
}
