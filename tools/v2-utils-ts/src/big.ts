/* eslint-disable unicorn/require-number-to-fixed-digits-argument */
import type { OrcaU64 } from "@orca-so/sdk";
import * as anchor from "@project-serum/anchor";
import type {
  Fraction,
  Price,
  TokenAmount as SaberTokenAmount,
} from "@saberhq/token-utils";
import type { TokenAmount } from "@solana/web3.js";
import { SwitchboardDecimal } from "@switchboard-xyz/switchboard-v2";
import assert from "assert";
import Big from "big.js";
import Decimal from "decimal.js";

/** Safely divide a Big.js while maintaing a set number of decimal place precision
 * @param number_ the numerator
 * @param denominator the denominator
 * @param decimals the Big.DP precision
 */
export function safeDiv(number_: Big, denominator: Big, decimals = 20): Big {
  const oldDp = Big.DP;
  Big.DP = decimals;
  const result = number_.div(denominator);
  Big.DP = oldDp;
  return result;
}

/** Safely multiply a collection of Big.js numbers */
export function safeMul(...n: Big[]): Big {
  if (n.length === 0) {
    throw new Error(`need to provide elements to multiply ${n}`);
  }

  let result = new Big(1);
  for (const x of n) {
    result = result.mul(x);
  }

  return result;
}

/** Safely take the nth root of a Big.js while maintaing a set number of decimal place precision */
export function safeNthRoot(big: Big, nthRoot: number, decimals = 20): Big {
  if (nthRoot <= 0) {
    throw new Error(`cannot take the nth root of a negative number`);
  }

  const oldDp = Big.DP;
  Big.DP = decimals;

  const decimal = toDecimal(big);
  const frac = new Decimal(1).div(nthRoot);
  const root: Decimal =
    big.s === -1
      ? decimal.abs().pow(frac).mul(new Decimal(big.s))
      : decimal.pow(frac);

  const result: Big = fromDecimal(root);

  Big.DP = oldDp;

  return result;
}

/** Safely take the square root of a Big.js while maintaing a set number of decimal place precision */
export function safeSqrt(n: Big, decimals = 20): Big {
  const oldDp = Big.DP;
  Big.DP = decimals;
  const result = n.sqrt();
  Big.DP = oldDp;
  return result;
}

/** Safely raise a Big.js to an exponent while maintaing a set number of decimal place precision */
export function safePow(n: Big, exp: number, decimals = 20): Big {
  const oldDp = Big.DP;
  Big.DP = decimals;

  const oldPrecision = Decimal.precision;
  Decimal.set({ precision: decimals });
  const base = toDecimal(n);
  const value = base.pow(exp);
  const result = fromDecimal(value);
  Decimal.set({ precision: oldPrecision });

  Big.DP = oldDp;
  return result;
}

/** Convert an anchor.BN to a Big.js object */
export function fromBN(n: anchor.BN, decimals = 0): Big {
  const big = new SwitchboardDecimal(n, decimals).toBig();
  // assert(n.cmp(new anchor.BN(big.toFixed())) === 0);
  return big;
}

/** Convert a Big.js to a Decimal.js object */
export function toDecimal(big: Big, decimals = 20): Decimal {
  const decimal = new Decimal(big.toFixed());
  assert(decimal.toFixed() === big.toFixed());
  return decimal;
  // const b = new Big(big);

  // const decimal = new Decimal(0);
  // (decimal as any).d = groupArray(b.c);
  // (decimal as any).e = b.e;
  // (decimal as any).s = b.s;

  // console.log(`toDecimal: ${big.toString()} => ${decimal.toString()}`);
  // return decimal;
}

/** Convert a Decimal.js to a Big.js object */
export function fromDecimal(decimal: Decimal, decimals = 20): Big {
  if (decimal.isNaN()) {
    throw new TypeError(`cannot convert NaN decimal.js to Big.js`);
  }

  if (!decimal.isFinite()) {
    throw new TypeError(`cannot convert INF decimal.js to Big.js`);
  }

  const big = new Big(decimal.toFixed());
  assert(big.toFixed() === decimal.toFixed());
  return big;
  // const d = new Decimal(decimal);

  // const big = new Big(0);
  // console.log(`fromDecimal (${d.toString()}) d.d ${d.d}`);
  // big.c = splitToDigits(d.d);
  // big.e = d.e;
  // big.s = d.s;

  // console.log(`fromDecimal: ${decimal.toString()} => ${big.toString()}`);
  // return big;
}

/** Convert an OrcaU64 to a Big.js object */
export function fromOrcaU64(u64: OrcaU64): Big {
  return fromBN(new anchor.BN(u64.value), u64.scale);
}

/** Convert Saber's TokenAmount to a Big.js object */
export function fromSaberTokenAmount(token: SaberTokenAmount): Big {
  return fromBN(new anchor.BN(token.toU64()), token.token.info.decimals);
}

/** Convert a TokenAmount to a Big.js object */
export function fromTokenAmount(token: TokenAmount): Big {
  return fromBN(new anchor.BN(token.amount), token.decimals);
}

/** Convert Saber's Price to a Big.js object */
export function fromPrice(price: Price | Fraction): Big {
  const numerator = new Big(price.numerator.toString());
  const denominator = new Big(price.denominator.toString());
  return safeDiv(numerator, denominator);
}

// input: 1234,5678912,3456789,1234567,8900000
// output: 1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0,0,0,0,0
function splitToDigits(numbers: number[]): number[] {
  const n = [...numbers];
  let output: number[] = [];
  for (const i of numbers) {
    output = [...output, ...[...String(i)].map(Number)];
  }

  if (output.length === 0) {
    return numbers; // direct assignment works but discouraged
  }

  return output;
}

// input: 1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0,0,0,0,0
// output: 1234,5678912,3456789,1234567,8900000
function groupArray(numbers: number[], group = 7): number[] {
  const output: number[] = [];
  while (numbers.length > group) {
    const slice = numbers.splice(numbers.length - group, group);
    output.unshift(Number(slice.join("")));
  }

  output.unshift(Number(numbers.join("")));
  return output;
}
