/* eslint-disable no-unused-vars */
import assert from 'assert';
import 'mocha';

import { BN } from '@switchboard-xyz/common';
import { AggregatorAccount, types } from '../src';

describe('Priority Fees Tests', () => {
  const defaultState = AggregatorAccount.default();

  const startingTimestamp = 100;
  const basePriorityFee = 1000; // always bump fee by 1000 lamports
  const priorityFeeBump = 500; // bump fee by 500 lamports for every period the feed is stale
  const priorityFeeBumpPeriod = 30; // bump fee by priorityFeeBump every 30s
  const maxPriorityFeeMultiplier = 10; // the max fee multiplier is 10 * 500 lamports

  const aggregatorFields: types.AggregatorAccountDataFields = {
    ...defaultState,
    basePriorityFee: basePriorityFee,
    priorityFeeBump: priorityFeeBump,
    priorityFeeBumpPeriod: priorityFeeBumpPeriod,
    maxPriorityFeeMultiplier: maxPriorityFeeMultiplier,
    latestConfirmedRound: {
      ...defaultState.latestConfirmedRound,
      roundOpenTimestamp: new BN(startingTimestamp),
    },
  };
  const aggregator = new types.AggregatorAccountData(aggregatorFields);

  it('Calculates the priority fee with no staleness', async () => {
    // no staleness
    const noStalenessFee = AggregatorAccount.calculatePriorityFee(
      aggregator,
      startingTimestamp
    );
    const expectedNoStalenessFee = Math.round(basePriorityFee);
    assert(
      expectedNoStalenessFee === noStalenessFee,
      `priorityFee mismatch with no staleness, expected ${expectedNoStalenessFee}, received ${noStalenessFee}`
    );
  });

  it('Calculates the priority fee with staleness multiplier', async () => {
    // with staleness
    const multipliers = [0.5, 1, 1.33333, 1.8323232, 2, 5, 10];
    for (const multiplier of multipliers) {
      const priorityFee = AggregatorAccount.calculatePriorityFee(
        aggregator,
        startingTimestamp + multiplier * priorityFeeBumpPeriod
      );
      const expectedPriorityFee = Math.round(
        basePriorityFee + multiplier * priorityFeeBump
      );
      assert(
        expectedPriorityFee === priorityFee,
        `priorityFee mismatch for multiplier ${multiplier}, expected ${expectedPriorityFee}, received ${priorityFee}`
      );
    }
  });

  it('Calculates the priority fee with max multiplier', async () => {
    // with max multiplier
    const expectedPriorityFee = Math.round(
      basePriorityFee + maxPriorityFeeMultiplier * priorityFeeBump
    ); // should never exceed this

    const multipliers = [
      maxPriorityFeeMultiplier + 1,
      maxPriorityFeeMultiplier * 2,
      maxPriorityFeeMultiplier * 10,
    ];

    for (const multiplier of multipliers) {
      const priorityFee = AggregatorAccount.calculatePriorityFee(
        aggregator,
        startingTimestamp + multiplier * priorityFeeBumpPeriod
      );
      assert(
        expectedPriorityFee === priorityFee,
        `priorityFee mismatch for max multiplier, expected ${expectedPriorityFee}, received ${priorityFee}`
      );
    }
  });
});
