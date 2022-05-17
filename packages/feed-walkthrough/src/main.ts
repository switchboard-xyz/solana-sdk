import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  loadSwitchboardProgram,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  SwitchboardPermission,
} from "@switchboard-xyz/switchboard-v2";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import chalk from "chalk";
import dotenv from "dotenv";
import os from "os";
import path from "path";
import readlineSync from "readline-sync";
import { getKeypair, sleep, toAccountString } from "./utils";

dotenv.config();

async function main() {
  // get payer keypair
  let authority: Keypair;
  if (process.env.PAYER_KEYPAIR) {
    authority = getKeypair(process.env.PAYER_KEYPAIR);
  } else {
    // attempt to load default keypair
    const homeDir = os.homedir();
    authority = getKeypair(path.join(homeDir, ".config/solana/id.json"));
  }

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

  const program = await loadSwitchboardProgram(
    cluster === "localnet" ? "devnet" : cluster,
    new Connection(rpcUrl),
    authority,
    {
      commitment: "finalized",
    }
  );

  console.log(chalk.yellow("######## Switchboard Setup ########"));

  // Program State Account and token mint for payout rewards
  const [programStateAccount] = ProgramStateAccount.fromSeed(program);
  console.log(toAccountString("Program State", programStateAccount.publicKey));
  const switchTokenMint = await programStateAccount.getTokenMint();
  const tokenAccount = await switchTokenMint.createAccount(authority.publicKey);

  // Oracle Queue
  const queueAccount = await OracleQueueAccount.create(program, {
    name: Buffer.from("Queue-1"),
    mint: spl.NATIVE_MINT,
    slashingEnabled: false,
    reward: new anchor.BN(0), // no token account needed
    minStake: new anchor.BN(0),
    authority: authority.publicKey,
  });
  console.log(toAccountString("Oracle Queue", queueAccount.publicKey));

  // Crank
  const crankAccount = await CrankAccount.create(program, {
    name: Buffer.from("Crank"),
    maxRows: 10,
    queueAccount,
  });
  console.log(toAccountString("Crank", crankAccount.publicKey));

  // Oracle
  const oracleAccount = await OracleAccount.create(program, {
    name: Buffer.from("Oracle"),
    queueAccount,
  });
  console.log(toAccountString("Oracle", oracleAccount.publicKey));

  // Oracle permissions
  const oraclePermission = await PermissionAccount.create(program, {
    authority: authority.publicKey,
    granter: queueAccount.publicKey,
    grantee: oracleAccount.publicKey,
  });
  await oraclePermission.set({
    authority,
    permission: SwitchboardPermission.PERMIT_ORACLE_HEARTBEAT,
    enable: true,
  });
  console.log(toAccountString(`  Permission`, oraclePermission.publicKey));
  await oracleAccount.heartbeat(authority);

  // Aggregator
  const aggregatorAccount = await AggregatorAccount.create(program, {
    name: Buffer.from("SOL_USD"),
    batchSize: 1,
    minRequiredOracleResults: 1,
    minRequiredJobResults: 1,
    minUpdateDelaySeconds: 10,
    queueAccount,
    authority: authority.publicKey,
  });
  console.log(
    toAccountString(`Aggregator (SOL/USD)`, aggregatorAccount.publicKey)
  );
  if (!aggregatorAccount.publicKey) {
    throw new Error(`failed to read Aggregator publicKey`);
  }

  // Aggregator permissions
  const aggregatorPermission = await PermissionAccount.create(program, {
    authority: authority.publicKey,
    granter: queueAccount.publicKey,
    grantee: aggregatorAccount.publicKey,
  });
  await aggregatorPermission.set({
    authority,
    permission: SwitchboardPermission.PERMIT_ORACLE_QUEUE_USAGE,
    enable: true,
  });
  console.log(toAccountString(`  Permission`, aggregatorPermission.publicKey));

  // Lease
  const leaseContract = await LeaseAccount.create(program, {
    loadAmount: new anchor.BN(0),
    funder: tokenAccount,
    funderAuthority: authority,
    oracleQueueAccount: queueAccount,
    aggregatorAccount,
  });
  console.log(toAccountString(`  Lease`, leaseContract.publicKey));

  // Job
  const tasks: OracleJob.Task[] = [
    OracleJob.Task.create({
      httpTask: OracleJob.HttpTask.create({
        url: `https://ftx.us/api/markets/SOL_USD`,
      }),
    }),
    OracleJob.Task.create({
      jsonParseTask: OracleJob.JsonParseTask.create({ path: "$.result.price" }),
    }),
  ];
  const jobData = Buffer.from(
    OracleJob.encodeDelimited(
      OracleJob.create({
        tasks,
      })
    ).finish()
  );
  const jobKeypair = anchor.web3.Keypair.generate();
  const jobAccount = await JobAccount.create(program, {
    data: jobData,
    keypair: jobKeypair,
    authority: authority.publicKey,
  });
  console.log(toAccountString(`  Job (FTX)`, jobAccount.publicKey));

  await aggregatorAccount.addJob(jobAccount, authority); // Add Job to Aggregator
  await crankAccount.push({ aggregatorAccount }); // Add Aggregator to Crank

  console.log(chalk.green("\u2714 Switchboard setup complete"));

  // Run the oracle
  console.log(chalk.yellow("######## Start the Oracle ########"));
  console.log(chalk.blue("Run the following command in a new shell\r\n"));
  console.log(
    `      ORACLE_KEY=${oracleAccount.publicKey} PAYER_KEYPAIR=${authority} RPC_URL=${rpcUrl} docker-compose up\r\n`
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

  // Turn the Crank
  async function turnCrank(retryCount: number): Promise<number> {
    try {
      const readyPubkeys = await crankAccount.peakNextReady(5);
      if (readyPubkeys) {
        const crank = await crankAccount.loadData();
        const queue = await queueAccount.loadData();

        const crankTurnSignature = await crankAccount.popTxn({
          payoutWallet: tokenAccount,
          queuePubkey: queueAccount.publicKey,
          queueAuthority: queue.authority,
          readyPubkeys,
          nonce: 0,
          crank,
          queue,
          tokenMint: switchTokenMint.publicKey,
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
  await sleep(5000);
  try {
    const result = await aggregatorAccount.getLatestValue();
    console.log(`${chalk.blue("Result:")} ${chalk.green(result)}\r\n`);
    console.log(chalk.green("\u2714 Aggregator succesfully updated!"));
  } catch (error: any) {
    if (error.message === "Aggregator currently holds no value.") {
      console.log(
        chalk.red("\u2716 Aggregator holds no value, was the oracle running?")
      );
      return;
    }
    console.error(error);
  }
}

main().then(
  () => process.exit(),
  (error) => {
    console.error("Failed to create a private feed");
    console.error(error);
    process.exit(-1);
  }
);
