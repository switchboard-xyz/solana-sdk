/* eslint-disable no-unused-vars */
import "mocha";

import { calculatePriorityFee } from "../src/index.js";

import assert from "assert";

describe("Priority Fees Tests", () => {
  it("Calculates priority fee with empty values", async () => {
    const fee = calculatePriorityFee(10000000, 0, 0, 0, 0, 0);
    assert(fee === 0, "PriorityFeeMismatch");
  });

  it("Calculates priority fee with empty max multiplier", async () => {
    const fee = calculatePriorityFee(10_500, 10_000, 100, 10, 60, 0);
    assert(fee === 100, "PriorityFeeMismatch");
  });

  it("Calculates priority fee with empty bump period", async () => {
    const fee = calculatePriorityFee(10_500, 10_000, 100, 10, 0, 10);
    assert(fee === 100, "PriorityFeeMismatch");
  });

  it("Calculates priority fee when not stale", async () => {
    const fee = calculatePriorityFee(10_500, 10_500, 100, 10, 60, 10);
    assert(fee === 100, "PriorityFeeMismatch");
  });

  it("Calculates priority fee when barely stale", async () => {
    const fee = calculatePriorityFee(10_510, 10_500, 100, 10, 60, 10);
    assert(fee === 100, "PriorityFeeMismatch");
  });

  it("Calculates priority fee when stale for 1 period", async () => {
    const fee = calculatePriorityFee(10_621, 10_500, 100, 10, 60, 10);
    assert(fee === 110, "PriorityFeeMismatch");
  });

  it("Calculates priority fee when stale for 5 periods", async () => {
    const fee = calculatePriorityFee(10_861, 10_500, 100, 10, 60, 10);
    assert(fee === 150, "PriorityFeeMismatch");
  });

  it("Calculates priority fee when max multiplier exceeded", async () => {
    const fee = calculatePriorityFee(10_861, 0, 100, 10, 60, 10);
    assert(fee === 200, "PriorityFeeMismatch");
  });
});
