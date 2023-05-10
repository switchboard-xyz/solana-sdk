import Big from "big.js";
import { AggregatorAccount } from "@switchboard-xyz/solana.js";

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

const result: Big | null = await aggregatorAccount.fetchLatestValue();
if (result === null) {
  throw new Error("Aggregator holds no value");
}
console.log(result.toString());
