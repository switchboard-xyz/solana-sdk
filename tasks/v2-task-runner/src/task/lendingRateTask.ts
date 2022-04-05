import type * as anchor from "@project-serum/anchor";
import type { AssetRate, Protocol } from "@switchboard-xyz/defi-yield-ts";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedLendingRateError extends SwitchboardTaskError {
  constructor() {
    super(`unexpected error`, "LendingRate");
  }
}

export class LendingRateTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.ILendingRateTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const lendingTask = OracleJob.LendingRateTask.create(task);

    const { rates } = await context.lendingRateObserver.fetch(
      lendingTask.protocol as Protocol,
      context.mainnetConnection
    );
    const assetRate = rates.find(
      (rate: AssetRate) => rate.mint.toBase58() === lendingTask.assetMint
    );
    if (assetRate === undefined) {
      throw new Error("LendingRateTaskAssetNotFoundError");
    }

    if (
      lendingTask.field === OracleJob.LendingRateTask.Field.FIELD_DEPOSIT_RATE
    ) {
      if (assetRate.deposit === undefined) {
        throw new Error("LendingRateTaskAssetDepositRateNotFoundError");
      }

      return new Big(assetRate.deposit);
    }

    if (assetRate.borrow === undefined) {
      throw new Error("LendingRateTaskAssetBorrowRateNotFoundError");
    }

    return new Big(assetRate.borrow);
  }
}
