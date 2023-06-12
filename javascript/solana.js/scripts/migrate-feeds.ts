import * as sbv2 from "../src/index.js";
import {
  CrankAccount,
  QueueAccount,
  SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_CRANK,
  SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_QUEUE,
} from "../src/index.js";

import {
  Aggregator,
  CHECK_ICON,
  FAILED_ICON,
  jsonReplacers,
  setupOutputDir,
} from "./utils.js";

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
// import { backOff } from 'exponential-backoff';
import fs from "fs";
import os from "os";
import path from "path";

const VERBOSE = process.env.VERBOSE || false;

const jobMapPath = path.join(
  os.homedir(),
  "devnet-migration",
  sbv2.SB_V2_PID.toBase58(),
  "job_map.csv"
);
const aggregatorMapPath = path.join(
  os.homedir(),
  "devnet-migration",
  sbv2.SB_V2_PID.toBase58(),
  "aggregator_map.csv"
);

async function main() {
  const [oldDirPath, oldFeedDirPath, oldJobDirPath] = setupOutputDir(
    "2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG"
  );
  const [newDirPath, newFeedDirPath, newJobDirPath] = setupOutputDir(
    sbv2.SB_V2_PID.toBase58()
  );

  const devnetConnection = new Connection(
    process.env.SOLANA_DEVNET_RPC ?? clusterApiUrl("devnet")
  );
  console.log(`rpcUrl: ${devnetConnection.rpcEndpoint}`);

  const payer = sbv2.SwitchboardTestContextV2.loadKeypair(
    "~/switchboard_environments_v2/devnet/upgrade_authority/upgrade_authority.json"
  );
  console.log(`payer: ${payer.publicKey.toBase58()}`);

  const newProgram = await sbv2.SwitchboardProgram.load(
    "devnet",
    devnetConnection,
    payer,
    sbv2.SB_V2_PID
  );

  const [queueAccount, queue] = await QueueAccount.load(
    newProgram,
    SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_QUEUE
  );
  const [crankAccount, crank] = await CrankAccount.load(
    newProgram,
    SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_CRANK
  );

  const [payerTokenWallet] = await newProgram.mint.getOrCreateWrappedUser(
    payer.publicKey,
    { fundUpTo: 100 }
  );

  const aggregators = new Map<string, Aggregator>();
  for (const file of fs.readdirSync(oldFeedDirPath)) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const fileName = path.basename(file).replace(".json", "");
    const aggregatorDef: Aggregator = JSON.parse(
      fs.readFileSync(path.join(oldFeedDirPath, file), "utf-8")
    );
    aggregators.set(fileName, aggregatorDef);
  }

  console.log(`Found ${aggregators.size} aggregators to migrate`);

  const jobMap = loadJobMap();
  const aggregatorMap = loadAggregatorMap();

  console.log(`Found ${jobMap.size} jobs that have already been migrated`);
  console.log(
    `Found ${aggregatorMap.size} aggregators that have already been migrated`
  );

  for (const [aggregatorKey, aggregator] of aggregators.entries()) {
    if (jobMap.has(aggregatorKey)) {
      continue;
    }
    const newFeedPath = path.join(newFeedDirPath, `${aggregatorKey}.json`);
    if (fs.existsSync(newFeedPath)) {
      continue;
    }

    try {
      // find job accounts
      const jobs: Array<{ pubkey: PublicKey; weight: number }> =
        aggregator.definition.jobs.map((j) => {
          const newJobKey = jobMap.get(j.pubkey);
          if (!newJobKey) {
            throw new Error(`Job ${j.pubkey} was not migrated`);
          }
          return { pubkey: new PublicKey(newJobKey), weight: j.weight ?? 1 };
        });
      if (jobs.length === 0) {
        console.log(`${FAILED_ICON} ${aggregatorKey} has no jobs`);
        continue;
      }

      // create a feed but keep ourself as the authority until we do all final checks
      const [aggregatorAccount] = await queueAccount.createFeed({
        authority: payer.publicKey,
        name: aggregator.definition.name,
        metadata: aggregator.definition.metadata,
        batchSize: aggregator.definition.batchSize,
        minRequiredOracleResults:
          aggregator.definition.minRequiredOracleResults,
        minRequiredJobResults: aggregator.definition.minRequiredJobResults,
        minUpdateDelaySeconds: aggregator.definition.minUpdateDelaySeconds,
        startAfter: aggregator.definition.startAfter,
        varianceThreshold: aggregator.definition.varianceThreshold,
        forceReportPeriod: aggregator.definition.forceReportPeriod,
        expiration: aggregator.definition.expiration,
        disableCrank: aggregator.definition.disableCrank,
        slidingWindow: aggregator.definition.slidingWindow,
        basePriorityFee: aggregator.definition.basePriorityFee ?? 0,
        priorityFeeBump: aggregator.definition.priorityFeeBump ?? 0,
        priorityFeeBumpPeriod: aggregator.definition.priorityFeeBumpPeriod ?? 0,
        maxPriorityFeeMultiplier:
          aggregator.definition.maxPriorityFeeMultiplier ?? 0,
        jobs: jobs,
        crankPubkey: aggregator.definition.pushCrank
          ? crankAccount.publicKey
          : undefined,
        crankDataBuffer: aggregator.definition.pushCrank
          ? crank.dataBuffer
          : undefined,
        historyLimit: aggregator.definition.historyBufferLength
          ? aggregator.definition.historyBufferLength
          : 100, // enable some history, its free anyway
        queueAuthorityPubkey: queue.authority,
        enable: false, // permissionless queue
        fundAmount: Math.max(0.1, aggregator.data?.balance ?? 0.1),
        funderTokenWallet: payerTokenWallet,
        withdrawAuthority: new PublicKey(
          aggregator.data.lease.withdrawAuthority
        ),
      });

      console.log(
        `${CHECK_ICON} ${aggregatorKey.padEnd(
          44,
          " "
        )} -> ${aggregatorAccount.publicKey.toBase58()}`
      );

      try {
        const accounts = await aggregatorAccount.fetchAccounts(
          undefined,
          queueAccount,
          queue,
          "processed"
        );
        fs.writeFileSync(
          newFeedPath,
          JSON.stringify(
            {
              newPublicKey: aggregatorAccount.publicKey.toBase58(),
              oldPublicKey: aggregatorKey,
              newFeed: accounts,
              oldFeed: aggregator,
            },
            jsonReplacers,
            2
          )
        );
      } catch {
        fs.writeFileSync(
          newFeedPath,
          JSON.stringify(
            {
              newPublicKey: aggregatorAccount.publicKey.toBase58(),
              oldPublicKey: aggregatorKey,
              oldFeed: aggregator,
            },
            jsonReplacers,
            2
          )
        );
      }

      aggregatorMap.set(aggregatorKey, aggregatorAccount.publicKey.toBase58());
      writeAggregatorMap(aggregatorMap);
    } catch (error) {
      console.error(`${FAILED_ICON} ${aggregatorKey} failed`);
      console.error(error);
    }

    // throw new Error(`Safety`);
  }
}

main().catch((error) => {
  console.error(error);
});

function writeAggregatorMap(map: Map<string, string>) {
  const fileString = `oldPubkey, newPubkey\n${Array.from(map.entries())
    .map((r) => r.join(", "))
    .join("\n")}`;
  fs.writeFileSync(aggregatorMapPath, fileString);
}

function loadJobMap(): Map<string, string> {
  if (!fs.existsSync(jobMapPath)) {
    return new Map();
  }

  const map = new Map();
  const fileString = fs.readFileSync(jobMapPath, "utf-8");
  const fileLines = fileString.split("\n").slice(1);
  fileLines.forEach((r) => {
    const [oldPubkey, newPubkey] = r.split(", ");
    map.set(oldPubkey, newPubkey);
  });

  return map;
}

function loadAggregatorMap(): Map<string, string> {
  if (!fs.existsSync(aggregatorMapPath)) {
    return new Map();
  }

  const map = new Map();
  const fileString = fs.readFileSync(aggregatorMapPath, "utf-8");
  const fileLines = fileString.split("\n").slice(1);
  fileLines.forEach((r) => {
    const [oldPubkey, newPubkey] = r.split(", ");
    map.set(oldPubkey, newPubkey);
  });

  return map;
}
