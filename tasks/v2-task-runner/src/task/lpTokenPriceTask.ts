/* eslint-disable complexity */
import type * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import TaskRunner from "../";
import {
  MercurialSwap,
  OrcaExchange,
  RaydiumExchange,
  SaberSwap,
} from "../clients";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";
import { getFeedsLatestValue } from "../utils";

export class UnknownLpPool extends SwitchboardTaskError {
  constructor() {
    super("unknown lpTokenPriceTask pool", "LpTokenPrice");
  }
}

export class LpTokenPriceTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.ILpTokenPriceTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const lpTokenPriceTask = OracleJob.LpTokenPriceTask.create(task);
    const mainnet =
      context?.mainnetConnection ??
      new Connection(clusterApiUrl("mainnet-beta"));

    if (
      lpTokenPriceTask.useFairPrice === true &&
      lpTokenPriceTask.priceFeedAddresses.length > 0
    ) {
      const feedPricePromises = getFeedsLatestValue(
        program,
        mainnet,
        ...lpTokenPriceTask.priceFeedAddresses
      ).catch((error) => {
        throw error;
      });

      if (lpTokenPriceTask.mercurialPoolAddress) {
        const mercurial = context?.mercurial ?? new MercurialSwap(mainnet);
        return mercurial.calculateFairLpTokenPrice(
          lpTokenPriceTask.mercurialPoolAddress,
          feedPricePromises
        );
      }

      if (lpTokenPriceTask.saberPoolAddress) {
        const saber = context?.saber ?? new SaberSwap(mainnet);
        const pool = new PublicKey(lpTokenPriceTask.saberPoolAddress);
        return saber.calculateFairLpTokenPrice(pool, feedPricePromises);
      }

      if (lpTokenPriceTask.orcaPoolAddress) {
        const orcaExchange = context?.orca ?? new OrcaExchange(mainnet);
        return orcaExchange.calculateFairLpTokenPrice(
          lpTokenPriceTask.orcaPoolAddress,
          feedPricePromises
        );
      }

      if (lpTokenPriceTask.raydiumPoolAddress) {
        const raydium = context?.raydium ?? new RaydiumExchange(mainnet);
        const pool = new PublicKey(lpTokenPriceTask.raydiumPoolAddress);
        return raydium.calculateFairLpTokenPrice(pool, feedPricePromises);
      }
    } else if (
      lpTokenPriceTask.useFairPrice === true &&
      lpTokenPriceTask.priceFeedJobs.length > 0
    ) {
      const feedPricesPromise = Promise.all(
        lpTokenPriceTask.priceFeedJobs.map(async (job) => {
          const { tasks } = OracleJob.create(job);
          const result = await TaskRunner.performTasks(tasks, program, context);
          if (result.isErr()) throw result.error;
          return result.value;
        })
      );

      if (lpTokenPriceTask.mercurialPoolAddress) {
        const mercurial = context?.mercurial ?? new MercurialSwap(mainnet);
        return mercurial.calculateFairLpTokenPrice(
          lpTokenPriceTask.mercurialPoolAddress,
          feedPricesPromise
        );
      }

      if (lpTokenPriceTask.saberPoolAddress) {
        const saber = context?.saber ?? new SaberSwap(mainnet);
        const pool = new PublicKey(lpTokenPriceTask.saberPoolAddress);
        return saber.calculateFairLpTokenPrice(pool, feedPricesPromise);
      }

      if (lpTokenPriceTask.orcaPoolAddress) {
        const orcaExchange = context?.orca ?? new OrcaExchange(mainnet);
        return orcaExchange.calculateFairLpTokenPrice(
          lpTokenPriceTask.orcaPoolAddress,
          feedPricesPromise
        );
      }

      if (lpTokenPriceTask.raydiumPoolAddress) {
        const raydium = context?.raydium ?? new RaydiumExchange(mainnet);
        const pool = new PublicKey(lpTokenPriceTask.raydiumPoolAddress);
        return raydium.calculateFairLpTokenPrice(pool, feedPricesPromise);
      }
    } else if (lpTokenPriceTask.useFairPrice === false) {
      if (lpTokenPriceTask.mercurialPoolAddress) {
        const mercurial = context?.mercurial ?? new MercurialSwap(mainnet);
        return mercurial.calculateLpTokenPrice(
          lpTokenPriceTask.mercurialPoolAddress
        );
      }

      if (lpTokenPriceTask.saberPoolAddress) {
        const saber = context?.saber ?? new SaberSwap(mainnet);
        return saber.calculateLpTokenPrice(lpTokenPriceTask.saberPoolAddress);
      }

      if (lpTokenPriceTask.orcaPoolAddress) {
        const orcaExchange = context?.orca ?? new OrcaExchange(mainnet);
        return orcaExchange.calculateLpTokenPrice(
          lpTokenPriceTask.orcaPoolAddress
        );
      }

      if (lpTokenPriceTask.raydiumPoolAddress) {
        throw new Error("raydium LpTokenPriceTask needs priceFeedAddresses");
      }
    }

    throw new UnknownLpPool();
  }
}
