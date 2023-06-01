import "mocha";

import { AggregatorHistoryBuffer } from "../src";

import HistoryBufferAccountInfo from "./data/history_buffer_account_info.json";

import { BN } from "@switchboard-xyz/common";
import assert from "assert";

describe("History Tests", () => {
  const historyBuffer = Buffer.from(
    HistoryBufferAccountInfo.data[0],
    HistoryBufferAccountInfo.data[1] as "base64"
  );
  const fullHistory = AggregatorHistoryBuffer.decode(historyBuffer);

  /** History buffer should be returned with the oldest elements (lowest timestamps) first */
  it("Verifies a history buffer is decoded in order", async () => {
    const history = [...fullHistory];

    let lastTimestamp: number | undefined = undefined;
    for (const [n, row] of history.entries()) {
      if (lastTimestamp === undefined) {
        lastTimestamp = row.timestamp.toNumber();
        continue;
      }

      const currentTimestamp = row.timestamp.toNumber();

      assert(
        lastTimestamp < currentTimestamp,
        `Aggregator History is out of order at element ${n}, prev ${lastTimestamp}, curr ${currentTimestamp}`
      );

      lastTimestamp = currentTimestamp;
    }
  });

  /** History buffer should be returned with any elements exceeding the starting and ending timestamp removed */
  it("Decodes a history buffer with a starting and ending timestamp", async () => {
    const startingTimestamp = 1670770328;
    const endingTimestamp = 1670834728;
    // Get history without the starting and ending 32,200 seconds (~ 9 hours)
    const history = AggregatorHistoryBuffer.decode(
      historyBuffer,
      startingTimestamp,
      endingTimestamp
    );

    assert(
      history.length < fullHistory.length,
      `Failed to trim the aggregator history`
    );

    for (const row of history) {
      assert(
        row.timestamp.gte(new BN(startingTimestamp)),
        `History row is before the provided starting timestamp`
      );
      assert(
        row.timestamp.lte(new BN(endingTimestamp)),
        `History row is after the provided ending timestamp`
      );
    }
  });
});
