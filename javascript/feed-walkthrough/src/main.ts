import type { PublicKey } from "@solana/web3.js";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { OracleJob, sleep } from "@switchboard-xyz/common";
import { NodeOracle } from "@switchboard-xyz/oracle";
import {
  AggregatorAccount,
  SwitchboardNetwork,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import path from "path";

dotenv.config();

let oracle: NodeOracle | undefined = undefined;

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

  if ((process.env.CLUSTER ?? "").startsWith("mainnet")) {
    throw new Error(`This script should not be used on mainnet`);
  }

  // get cluster
  let cluster: "devnet" | "localnet";
  if (
    process.env.CLUSTER &&
    (process.env.CLUSTER === "devnet" || process.env.CLUSTER === "localnet")
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
    new Connection(rpcUrl, "confirmed"),
    authority
  );

  console.log(chalk.yellow("######## Switchboard Setup ########"));

  const [network, signatures] = await SwitchboardNetwork.create(program, {
    name: "Queue-1",
    slashingEnabled: false,
    reward: 0,
    minStake: 0,
    cranks: [{ name: "Crank", maxRows: 10 }],
    oracles: [
      {
        name: "Oracle",
        enable: true,
      },
    ],
  });

  const queueAccount = network.queue.account;
  console.log(toAccountString("Oracle Queue", queueAccount.publicKey));

  const crankAccount = network.cranks[0].account;
  console.log(toAccountString("Crank", crankAccount.publicKey));

  const oracleAccount = network.oracles[0].account;
  console.log(toAccountString("Oracle", oracleAccount.publicKey));

  const [aggregatorAccount] = await queueAccount.createFeed({
    name: "SOL_USD",
    batchSize: 1,
    minRequiredOracleResults: 1,
    minRequiredJobResults: 1,
    minUpdateDelaySeconds: 10,
    fundAmount: 0.5,
    queueAuthority: authority,
    enable: true,
    crankPubkey: crankAccount.publicKey,
    jobs: [
      {
        weight: 2,
        data: OracleJob.encodeDelimited(
          OracleJob.fromObject({
            tasks: [
              {
                valueTask: {
                  value: 10,
                },
              },
            ],
          })
        ).finish(),
      },
    ],
  });
  console.log(toAccountString("Aggregator", aggregatorAccount.publicKey));

  console.log(chalk.green("\u2714 Switchboard setup complete"));

  console.log(chalk.yellow("######## Start the Oracle ########"));
  oracle = await NodeOracle.fromReleaseChannel({
    releaseChannel: "testnet",
    chain: "solana",
    network: program.cluster === "mainnet-beta" ? "mainnet" : program.cluster,
    rpcUrl: program.connection.rpcEndpoint,
    oracleKey: oracleAccount.publicKey.toBase58(),
    secretPath: payerKeypairPath,
    envVariables: {
      VERBOSE: "1",
      DEBUG: "1",
      DISABLE_NONE_QUEUE: "1",
    },
  });
  await oracle.startAndAwait();
  await sleep(1000); // wait 1 extra second for oracle to heartbeat
  console.log(chalk.green("\u2714 Oracle ready"));

  console.log(chalk.yellow("######## Calling OpenRound ########"));
  const [newAggregatorState] =
    await aggregatorAccount.openRoundAndAwaitResult();
  console.log(
    `${chalk.blue("Result:")} ${chalk.green(
      AggregatorAccount.decodeLatestValue(newAggregatorState).toString()
    )}\r\n`
  );
  console.log(chalk.green("\u2714 Aggregator succesfully updated!"));

  if (oracle) {
    oracle.stop();
    oracle = undefined;
  }
}

main().then(
  () => {
    oracle?.stop();
    process.exit();
  },
  (error) => {
    oracle?.stop();
    console.error("Failed to create a private feed");
    console.error(error);
    process.exit(-1);
  }
);
