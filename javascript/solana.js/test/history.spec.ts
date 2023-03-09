import 'mocha';

import { AggregatorHistoryBuffer } from '../src';

import HistoryBufferAccountInfo from './data/history_buffer_account_info.json';

import assert from 'assert';

describe('History Tests', () => {
  /** History buffer should be returned with the oldest elements (lowest timestamps) first */
  it('Verifies a history buffer is decoded in order', async () => {
    const historyBuffer = Buffer.from(
      HistoryBufferAccountInfo.data[0],
      HistoryBufferAccountInfo.data[1] as 'base64'
    );
    const history = AggregatorHistoryBuffer.decode(historyBuffer);

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
});
