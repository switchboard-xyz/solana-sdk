import type { PublicKey } from "@solana/web3.js";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/common";
import {
  CrankAccount,
  SwitchboardProgram,
  OracleAccount,
  QueueAccount,
  PermissionAccount,
  types,
} from "@switchboard-xyz/solana.js";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import path from "path";
import readlineSync from "readline-sync";

dotenv.config();

export const toAccountString = (
  label: string,
  publicKey: PublicKey | string | undefined
): string => {
  if (typeof publicKey === "string") {
    return `${chalk.blue(label.padEnd(24, " "))} ${chalk.yellow(publicKey)}`;
  }
  if (!publicKey) {
    return "";
  }
  return `${chalk.blue(label.padEnd(24, " "))} ${chalk.yellow(
    publicKey.toString()
  )}`;
};

export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

export const getKeypair = (keypairPath: string): Keypair => {
  if (!fs.existsSync(keypairPath)) {
    throw new Error(
      `failed to load authority keypair from ${keypairPath}, try providing a path to your keypair with the script 'ts-node src/main KEYPAIR_PATH'`
    );
  }
  const keypairString = fs.readFileSync(keypairPath, "utf8");
  const keypairBuffer = new Uint8Array(JSON.parse(keypairString));
  const walletKeypair = Keypair.fromSecretKey(keypairBuffer);
  return walletKeypair;
};

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

  // get cluster
  let cluster: "mainnet-beta" | "devnet" | "localnet";
  if (
    process.env.CLUSTER &&
    (process.env.CLUSTER === "mainnet-beta" ||
      process.env.CLUSTER === "devnet" ||
      process.env.CLUSTER === "localnet")
  ) {
    cluster = process.env.CLUSTER;
  } else {
    cluster = "devnet";
  }

  // get RPC_URL
  let rpcUrl: string;
  if (process.env.RPC_URL) {
    rpcUrl = process.env.RPC_URL;
  } else {
    rpcUrl =
      cluster === "localnet" ? "http://localhost:8899" : clusterApiUrl(cluster);
  }

  const program = await SwitchboardProgram.load(
    cluster === "localnet" ? "devnet" : cluster,
    new Connection(rpcUrl),
    authority
  );

  console.log(chalk.yellow("######## Switchboard Setup ########"));

  // create our token wallet for the wrapped SOL mint
  const tokenAccount = await program.mint.getOrCreateAssociatedUser(
    program.walletPubkey
  );

  // Oracle Queue
  const [queueAccount] = await QueueAccount.create(program, {
    name: "Queue-1",
    slashingEnabled: false,
    reward: 0,
    minStake: 0,
  });
  console.log(toAccountString("Oracle Queue", queueAccount.publicKey));

  // Crank
  const [crankAccount] = await queueAccount.createCrank({
    name: "Crank",
    maxRows: 10,
  });
  console.log(toAccountString("Crank", crankAccount.publicKey));

  // Oracle
  const [oracleAccount] = await queueAccount.createOracle({
    name: "Oracle",
    enable: true,
  });
  console.log(toAccountString("Oracle", oracleAccount.publicKey));
  await oracleAccount.heartbeat();

  // Aggregator

  const [aggregatorAccount] = await queueAccount.createFeed({
    name: "SOL_USD",
    queueAuthority: authority,
    batchSize: 1,
    minRequiredOracleResults: 1,
    minRequiredJobResults: 1,
    minUpdateDelaySeconds: 10,
    fundAmount: 0.5,
    enable: true,
    crankPubkey: crankAccount.publicKey,
    jobs: [
      {
        weight: 2,
        data: OracleJob.encodeDelimited(
          OracleJob.fromObject({
            tasks: [
              {
                httpTask: {
                  url: `https://ftx.us/api/markets/SOL_USD`,
                },
              },
              {
                jsonParseTask: { path: "$.result.price" },
              },
            ],
          })
        ).finish(),
      },
    ],
  });
  console.log(toAccountString("Aggregator", aggregatorAccount.publicKey));
  const aggregator = await aggregatorAccount.loadData();

  console.log(chalk.green("\u2714 Switchboard setup complete"));

  // Run the oracle
  console.log(chalk.yellow("######## Start the Oracle ########"));
  console.log(chalk.blue("Run the following command in a new shell\r\n"));
  console.log(
    `      ORACLE_KEY=${oracleAccount.publicKey} PAYER_KEYPAIR=${payerKeypairPath} RPC_URL=${rpcUrl} docker-compose up\r\n`
  );
  if (
    !readlineSync.keyInYN(
      `Select 'Y' when the docker container displays ${chalk.underline(
        "Starting listener..."
      )}`
    )
  ) {
    console.log(chalk.red("\u2716 User exited..."));
    return;
  }
  console.log("");

  const confirmedRoundPromise = aggregatorAccount.nextRound();

  // Turn the Crank
  async function turnCrank(retryCount: number): Promise<number> {
    try {
      const readyPubkeys = await crankAccount.peakNextReady(5);
      if (readyPubkeys) {
        await crankAccount.pop({
          payoutWallet: tokenAccount,
          readyPubkeys,
          nonce: 0,
        });
        console.log(chalk.green("\u2714 Crank turned"));
        return 0;
      } else {
        console.log(chalk.red("\u2716 No feeds ready, exiting"));
        return --retryCount;
      }
    } catch {
      return --retryCount;
    }
  }
  // Might need time for accounts to propagate
  let retryCount = 3;
  while (retryCount) {
    await sleep(3000);
    retryCount = await turnCrank(retryCount);
  }

  // Read Aggregators latest result
  console.log(chalk.yellow("######## Aggregator Result ########"));
  const confirmedRound = await confirmedRoundPromise;
  console.log(
    `${chalk.blue("Result:")} ${chalk.green(confirmedRound.result.toBig())}\r\n`
  );
  console.log(chalk.green("\u2714 Aggregator succesfully updated!"));
}

main().then(
  () => process.exit(),
  (error) => {
    console.error("Failed to create a private feed");
    console.error(error);
    process.exit(-1);
  }
);
