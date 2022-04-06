import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  AggregatorHistoryRow,
} from "@switchboard-xyz/switchboard-v2";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";
import * as BigUtil from "../utils/big";

export class TwapInsufficientHistoryError extends SwitchboardTaskError {
  constructor() {
    super(`InsufficientHistoryForTwapError`, "Twap");
  }
}

export class TwapInsufficientSamplesError extends SwitchboardTaskError {
  constructor() {
    super(`InsufficientSamplesForTwapError`, "Twap");
  }
}

export class TwapTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.ITwapTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const twapTask = OracleJob.TwapTask.create(task);
    const aggregatorAccount = new AggregatorAccount({
      program,
      publicKey: new PublicKey(twapTask.aggregatorPubkey),
    });
    const period = twapTask.period;
    const minSamples = twapTask.minSamples ?? 1;

    const history = await aggregatorAccount.loadHistory();
    if (history.length === 0) {
      throw new TwapInsufficientHistoryError();
    }

    const end = twapTask.endingUnixTimestamp
      ? new anchor.BN(twapTask.endingUnixTimestamp)
      : new anchor.BN(Date.now() / 1000);
    const start = end.sub(new anchor.BN(period));

    if (twapTask.weightByPropagationTime) {
      return this.weightedTwap(history, [start, end], minSamples);
    }

    return this.standardTwap(history, [start, end], minSamples);
  }

  weightedTwap(
    history: AggregatorHistoryRow[],
    historyInterval: [anchor.BN, anchor.BN],
    minSamples: number
  ): Big {
    const [startTimestamp, endTimestamp] = historyInterval;
    const lastIndex = history.length - 1;
    let index = lastIndex;
    let weightedSum = new Big(0);
    let nextTimestamp = endTimestamp;
    const timestamp = history[lastIndex].timestamp;
    let interval = new anchor.BN(0);
    let numberSamples = 0;
    let currentRow = history[index];
    while (index >= 0 && currentRow.timestamp.gte(startTimestamp)) {
      const propagationTime = nextTimestamp.sub(currentRow.timestamp);
      nextTimestamp = currentRow.timestamp;

      weightedSum = weightedSum.add(
        currentRow.value.mul(BigUtil.fromBN(propagationTime))
      );
      ++numberSamples;
      --index;

      interval = interval.add(propagationTime);
      currentRow = history[index];
    }

    if (index >= 0) {
      const propagationTime = nextTimestamp.sub(startTimestamp);
      interval = interval.add(propagationTime);
      weightedSum = weightedSum.add(
        currentRow.value.mul(BigUtil.fromBN(propagationTime))
      );
      ++numberSamples;
    }

    if (numberSamples < minSamples) {
      throw new Error("InsufficientHistoryForTwapError");
    }

    const result = BigUtil.safeDiv(weightedSum, BigUtil.fromBN(interval));
    return result;
  }

  standardTwap(
    history: AggregatorHistoryRow[],
    historyInterval: [anchor.BN, anchor.BN],
    minSamples: number
  ): Big {
    const [startTimestamp, endTimestamp] = historyInterval;
    const lastIndex = history.length - 1;
    let sum = new Big(0);
    let counter = 0;
    let timestamp = history[lastIndex].timestamp;
    while (timestamp.gte(startTimestamp)) {
      sum = sum.add(history[lastIndex - counter].value);

      timestamp = history[lastIndex - counter - 1].timestamp;
      counter += 1;
    }

    if (counter < minSamples) {
      throw new Error("InsufficientHistoryForTwapError");
    }

    const result = BigUtil.safeDiv(sum, new Big(counter));
    return result;
  }
}

function printHistory(history: AggregatorHistoryRow[]): void {
  const revHistory = [...history].reverse().slice(0, 20);
  for (const row of revHistory) {
    console.log(`${row.timestamp},\t${row.value}`);
  }
}

const padTime = (number_: number): string => {
  return number_.toString().padStart(2, "0");
};

function toDateString(d: Date | undefined): string {
  if (d)
    return `${d.getFullYear()}-${padTime(d.getMonth() + 1)}-${padTime(
      d.getDate()
    )} L`;
  return "";
}

function anchorBNtoDateString(ts: anchor.BN): string {
  if (!ts.toNumber()) return "N/A";
  return toDateString(new Date(ts.toNumber() * 1000));
}

function toDateTimeString(d: Date | undefined): string {
  if (d)
    return `${d.getFullYear()}-${padTime(d.getMonth() + 1)}-${padTime(
      d.getDate()
    )} ${padTime(d.getHours())}:${padTime(d.getMinutes())}:${padTime(
      d.getSeconds()
    )} L`;
  return "";
}

function anchorBNtoDateTimeString(ts: anchor.BN): string {
  if (!ts.toNumber()) return "N/A";
  return toDateTimeString(new Date(ts.toNumber() * 1000));
}
