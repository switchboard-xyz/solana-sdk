import {
  AggregatorAccount,
  AggregatorHistoryBuffer,
} from "@switchboard-xyz/solana.js";

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);
const aggregator = await aggregatorAccount.loadData();

const [historyBuffer, addHistorySignature] =
  await AggregatorHistoryBuffer.create(program, {
    aggregatorAccount,
    maxSamples: 10000,
  });
const history = await historyBuffer.loadData();
