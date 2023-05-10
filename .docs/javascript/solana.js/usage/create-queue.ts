import { QueueAccount } from '@switchboard-xyz/solana.js';

const [queueAccount, txnSignature] = await QueueAccount.create(program, {
  name: 'My Queue',
  metadata: 'Top Secret',
  queueSize: 100,
  reward: 0.00001337,
  minStake: 10,
  oracleTimeout: 60,
  slashingEnabled: false,
  unpermissionedFeeds: true,
  unpermissionedVrf: true,
  enableBufferRelayers: false,
});
const queue = await queueAccount.loadData();
