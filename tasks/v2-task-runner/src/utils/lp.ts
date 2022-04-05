/* eslint-disable unicorn/no-array-reduce */
import Big from "big.js";
import * as BigUtil from "./big";

/*
 * https://blog.alphafinance.io/fair-lp-token-pricing/
 * P_LP = (N * (R1*R2*RN)^1/N * (P1*P2*PN)^1/N) / R_LP
 */
export const calcFairLpPrice = (
  totalSupply: Big,
  reserves: Big[],
  prices: Big[]
): Big => {
  if (reserves.length !== prices.length || reserves.length === 0) {
    throw new Error(
      `must provide equal number of reserves (${reserves.length}) and prices (${prices.length}) to calc fair Lp token price`
    );
  }

  const N = reserves.length;
  const K = BigUtil.safeNthRoot(BigUtil.safeMul(...reserves), N);
  const P = BigUtil.safeNthRoot(BigUtil.safeMul(...prices), N);
  const numerator = BigUtil.safeMul(new Big(N), K, P);
  const result = BigUtil.safeDiv(numerator, totalSupply);

  console.log(
    `${N} * (${reserves
      .map((r) => r.toString())
      .join(" * ")})^(1/${N}) * (${prices
      .map((p) => p.toString())
      .join(" * ")})^(1/${N}) / ${totalSupply.toString()}`
  );
  const TVL = reserves.reduce(function (r, a, index) {
    return r.add(BigUtil.safeMul(a, prices[index]));
  }, new Big(0));
  const raw = BigUtil.safeDiv(TVL, totalSupply);
  console.log(`TVL: ${TVL}`);
  console.log(`Fair: ${result.toString()}\nRaw: ${raw.toString()}`);

  // console.debug(
  //   `2 * \u221A(${reserves.map((r) => r.toNumber())}) * \u221A(${prices.map(
  //     (p) => p.toNumber()
  //   )}) = ${numerator.toString()}`
  // );
  // console.debug(`${totalSupply.toString()}`);
  // console.debug(
  //   `${numerator.toString()} / ${totalSupply.toString()} = ${result.toString()}`
  // );

  return result;
};
