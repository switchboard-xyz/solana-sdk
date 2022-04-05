import type * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import { DriftClient } from "../clients";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedPerpMarketTaskError extends SwitchboardTaskError {
  constructor() {
    super("UnexpectedMangoPerpError", "PerpMarket");
  }
}

export class PerpMarketTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    iTask: OracleJob.IPerpMarketTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const task = OracleJob.PerpMarketTask.create(iTask);
    const mainnet =
      context?.mainnetConnection ??
      new Connection(clusterApiUrl("mainnet-beta"));

    if (task.driftMarketAddress) {
      const drift = context?.drift ?? new DriftClient(mainnet);
      return drift.getPerpPrice(task.driftMarketAddress);
    }

    // if (task.zetaMarketAddress) {
    //   const zeta = context?.zeta ?? new ZetaClient(mainnet);
    //   return zeta.getPerpPrice(task.zetaMarketAddress);
    // }

    throw new UnexpectedPerpMarketTaskError();
  }
}
