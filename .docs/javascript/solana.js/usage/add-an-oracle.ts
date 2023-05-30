import { QueueAccount } from "@switchboard-xyz/solana.js";

const queueAccount = new QueueAccount(program, queuePubkey);

const [oracleAccount, oracleInitSignature] = await queueAccount.createOracle({
  name: "My Oracle",
  metadata: "Oracle #1",
  stakeAmount: 10,
});
const oracle = await oracleAccount.loadData();

await oracleAccount.heartbeat();
