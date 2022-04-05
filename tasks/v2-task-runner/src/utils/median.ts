import Big from "big.js";
import * as BigUtil from "./big";

export function median(results: Array<Big>): Big {
  if (!results?.length) throw new Error("Cannot take median of empty array.");

  const arraySort = [...results].sort();
  const mid = Math.ceil(results.length / 2);
  return results.length % 2 === 0
    ? BigUtil.safeDiv(arraySort[mid].add(arraySort[mid - 1]), new Big(2))
    : arraySort[mid - 1];
}
