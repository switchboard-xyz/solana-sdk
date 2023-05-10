import { AggregatorAccount } from "@switchboard-xyz/solana.js";

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

await aggregatorAccount.openRound();
