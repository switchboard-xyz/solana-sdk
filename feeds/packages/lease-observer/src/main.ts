/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PublicKey, Connection } from "@solana/web3.js";
import { Pager } from "./pager";
import * as sbv2 from "@switchboard-xyz/switchboard-v2";
import * as dotenv from "dotenv"; // should be loaded upon entry
import { sleep } from "@switchboard-xyz/v2-utils-ts";
dotenv.config();

async function main() {
  const cluster = process.env.CLUSTER;
  if (cluster !== "devnet" && cluster !== "mainnet-beta") {
    throw new Error(`Invalid cluster ${cluster}`);
  }
  const program = await sbv2.loadSwitchboardProgram(
    cluster,
    new Connection(process.env.RPC_URL)
  );
  const aggregatorPubkey = new PublicKey(process.env.AGGREGATOR_KEY);
  const aggregatorAccount = new sbv2.AggregatorAccount({
    program,
    publicKey: aggregatorPubkey,
  });
  const pagerKey = process.env.PAGERDUTY_EVENT_KEY!;
  const pageThreshold: number = +process.env.PAGE_THRESHOLD!;
  const aggregator = await aggregatorAccount.loadData();
  const queueKey = aggregator.queuePubkey;
  const queueAccount = new sbv2.OracleQueueAccount({
    program,
    publicKey: queueKey,
  });
  const [leaseAccount] = sbv2.LeaseAccount.fromSeed(
    program,
    queueAccount,
    aggregatorAccount
  );
  while (true) {
    const balance = await leaseAccount.getBalance();
    console.log(`${aggregatorPubkey.toBase58()} balance ${balance}`);
    if (balance < pageThreshold) {
      await Pager.sendEvent(
        pagerKey,
        "critical",
        `Switchboard feed ${aggregatorPubkey.toBase58()} is running low on funds.`,
        {
          balance,
        }
      );
    }
    await sleep(1000);
  }
}

main().then(
  () => {
    process.exit();
  },
  (err) => {
    console.error(err);
    process.exit(0);
  }
);
