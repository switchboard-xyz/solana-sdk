import type * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import type Big from "big.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import { SerumSwap } from "../clients";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedSerumTaskError extends SwitchboardTaskError {
  constructor() {
    super("UnexpectedSerumSwapError", "SerumSwap");
  }
}

export class SerumSwapTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.ISerumSwapTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const serumTask = OracleJob.SerumSwapTask.create(task);
    const mainnet =
      context?.mainnetConnection ??
      new Connection(clusterApiUrl("mainnet-beta"));
    const serum = context?.serum ?? new SerumSwap(mainnet);

    if (serumTask.serumPoolAddress) {
      return serum.calculateSwapPrice(serumTask.serumPoolAddress);
    }

    throw new UnexpectedSerumTaskError();
  }
}
