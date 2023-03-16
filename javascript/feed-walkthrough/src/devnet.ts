/**
 * Create a new data feed on the devnet permissionless queue.
 *
 * The devnet queue does NOT require you to run your own oracle.
 *
 * This script will:
 *  - load the existing devnet permissionless queue
 *  - load the existing devnet permissionless crank
 *  - create a new data feed for the queue and crank
 *  - call open round on the feed and await the result
 */

import OracleJobJson from "./oracle-job.json";
import { getKeypair, toAccountString } from "./utils";

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  CrankAccount,
  QueueAccount,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import chalk from "chalk";
import dotenv from "dotenv";
import os from "os";
import path from "path";

dotenv.config();

const DEVNET_PERMISSIONLESS_QUEUE = new PublicKey(
  "uPeRMdfPmrPqgRWSrjAnAkH78RqAhe5kXoW6vBYRqFX"
);

const DEVNET_PERMISSIONLESS_CRANK = new PublicKey(
  "GN9jjCy2THzZxhYqZETmPM3my8vg4R5JyNkgULddUMa5"
);

async function main() {
  // get payer keypair
  let payerKeypairPath: string;
  if (process.argv.length > 2 && process.argv[2]) {
    payerKeypairPath = process.argv[2];
  } else if (process.env.PAYER_KEYPAIR) {
    payerKeypairPath = process.env.PAYER_KEYPAIR;
  } else {
    payerKeypairPath = path.join(os.homedir(), ".config/solana/id.json");
  }
  const authority = getKeypair(payerKeypairPath);

  // get RPC_URL
  let rpcUrl: string;
  if (process.env.RPC_URL) {
    rpcUrl = process.env.RPC_URL;
  } else {
    rpcUrl = clusterApiUrl("devnet");
  }

  const program = await SwitchboardProgram.load(
    "devnet",
    new Connection(rpcUrl, "confirmed"),
    authority
  );

  console.log(chalk.yellow("######## Switchboard Setup ########"));

  const [queueAccount, queueData] = await QueueAccount.load(
    program,
    DEVNET_PERMISSIONLESS_QUEUE
  );
  console.log(toAccountString("Oracle Queue", queueAccount.publicKey));

  if (
    !queueData.unpermissionedFeedsEnabled &&
    !queueData.authority.equals(authority.publicKey)
  ) {
    throw new Error(
      `This queue requires the queue authority (${queueData.authority}) to grant you permissions to join`
    );
  }

  const [crankAccount, crankData] = await CrankAccount.load(
    program,
    DEVNET_PERMISSIONLESS_CRANK
  );
  console.log(toAccountString("Crank", crankAccount.publicKey));

  const [aggregatorAccount] = await queueAccount.createFeed({
    name: "SOL_USD",
    batchSize: 1,
    minRequiredOracleResults: 1,
    minRequiredJobResults: 1,
    minUpdateDelaySeconds: 10,
    fundAmount: 0.1,
    enable: false, // permissionless queue does not require explicit permissions
    crankPubkey: crankAccount.publicKey,
    jobs: [
      {
        weight: 2,
        data: OracleJob.encodeDelimited(
          OracleJob.fromObject(OracleJobJson)
        ).finish(),
      },
    ],
  });
  console.log(toAccountString("Aggregator", aggregatorAccount.publicKey));

  console.log(chalk.green("\u2714 Switchboard setup complete"));

  console.log(chalk.yellow("######## Calling OpenRound ########"));
  const [newAggregatorState] =
    await aggregatorAccount.openRoundAndAwaitResult();
  console.log(
    `${chalk.blue("Result:")} ${chalk.green(
      AggregatorAccount.decodeLatestValue(newAggregatorState).toString()
    )}\r\n`
  );
  console.log(chalk.green("\u2714 Aggregator succesfully updated!"));
}

main().then(
  () => {
    process.exit();
  },
  (error) => {
    console.error("Failed to create a feed on the devnet permissionless queue");
    console.error(error);
    process.exit(1);
  }
);
