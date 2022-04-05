import type * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import type Big from "big.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import { JupiterSwap } from "../clients";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedJupiterSwapError extends SwitchboardTaskError {
  constructor() {
    super("UnexpectedJupiterSwapError", "JupiterSwap");
  }
}

export class JupiterSwapTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.IJupiterSwapTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const jupiterSwapTask = OracleJob.JupiterSwapTask.create(task);
    const mainnet =
      context?.mainnetConnection ??
      new Connection(clusterApiUrl("mainnet-beta"));
    const jupiter = context?.jupiter ?? new JupiterSwap(mainnet);

    if (jupiterSwapTask.inTokenAddress && jupiterSwapTask.outTokenAddress) {
      return jupiter.calculateSwapPrice(
        jupiterSwapTask.inTokenAddress,
        jupiterSwapTask.outTokenAddress
      );
    }

    throw new UnexpectedJupiterSwapError();
  }
}
