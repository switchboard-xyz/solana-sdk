import Big from 'big.js';
import { AggregatorAccount } from '@switchboard-xyz/solana.js';

const aggregatorAccount = new AggregatorAccount(program, aggregatorPubkey);

const ws = aggregatorAccount.onChange(aggregator => {
  const result = AggregatorAccount.decodeLatestValue(aggregator);
  if (result !== null) {
    console.log(result.toString());
  }
});