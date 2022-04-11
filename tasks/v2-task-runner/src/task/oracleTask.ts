import type * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import { ChainlinkClient, PythClient } from "../clients";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedOracleTaskError extends SwitchboardTaskError {
  constructor() {
    super(`unexpected error`, "Oracle");
  }
}

export class OracleTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    iTask: OracleJob.IOracleTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const task = OracleJob.OracleTask.create(iTask);

    const mainnet =
      context?.mainnetConnection ??
      new Connection(clusterApiUrl("mainnet-beta"));

    if (task.switchboardAddress) {
      const aggregatorAccount = new AggregatorAccount({
        program,
        publicKey: new PublicKey(task.switchboardAddress ?? ""),
      });
      const value: Big = await aggregatorAccount.getLatestValue();
      if (value === null) {
        throw new Error("AggregatorEmptyError");
      }

      return value;
    }

    if (task.pythAddress) {
      const pyth = context?.pyth ?? new PythClient(mainnet);
      return pyth.getOraclePrice(
        task.pythAddress,
        task.pythAllowedConfidenceInterval
      );
    }

    if (task.chainlinkAddress) {
      const chainlink = context?.chainlink ?? new ChainlinkClient();
      return chainlink.getOraclePrice(task.chainlinkAddress);
    }

    throw new UnexpectedOracleTaskError();
  }
}
