import type * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import { MangoPerps } from "../clients";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedMangoPerpTaskError extends SwitchboardTaskError {
  constructor() {
    super("UnexpectedMangoPerpError", "MangoPerp");
  }
}

export class MangoPerpTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.IMangoPerpMarketTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const mangoTask = OracleJob.MangoPerpMarketTask.create(task);
    const mainnet =
      context?.mainnetConnection ??
      new Connection(clusterApiUrl("mainnet-beta"));
    const mango = context?.mango ?? new MangoPerps(mainnet);

    return mango.calculatePerpPrice(mangoTask.perpMarketAddress);

    throw new UnexpectedMangoPerpTaskError();
  }
}
