import type * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import { MercurialSwap, RaydiumExchange, SaberSwap } from "../clients";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedLpExchangeRateError extends SwitchboardTaskError {
  constructor() {
    super("UnexpectedLpExchangeRateError", "LpExchangeRate");
  }
}

export class LpExchangeRateTask extends SwitchboardTask {
  static saberProgramId = new PublicKey(
    "SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ"
  );

  static saberUser = new PublicKey(
    "2YbB88p9EBTJijsxAkmaUjenTXJnmrJvp6MRyT5LiBiM"
  );

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.ILpExchangeRateTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const lpExchangeRateTask = OracleJob.LpExchangeRateTask.create(task);
    const mainnet =
      context?.mainnetConnection ??
      new Connection(clusterApiUrl("mainnet-beta"));

    if (lpExchangeRateTask.mercurialPoolAddress) {
      const mercurial = context?.mercurial ?? new MercurialSwap(mainnet);
      return mercurial.calculateSwapPrice(
        lpExchangeRateTask.mercurialPoolAddress,
        lpExchangeRateTask.inTokenAddress,
        lpExchangeRateTask.outTokenAddress
      );
    }

    if (lpExchangeRateTask.saberPoolAddress) {
      const saber = context?.saber ?? new SaberSwap(mainnet);
      return saber.calculateSwapPrice(lpExchangeRateTask.saberPoolAddress);
    }

    if (lpExchangeRateTask.raydiumPoolAddress) {
      const raydium = context?.raydium ?? new RaydiumExchange(mainnet);
      return raydium.calculateSwapPrice(lpExchangeRateTask.raydiumPoolAddress);
    }

    throw new UnexpectedLpExchangeRateError();
  }
}
