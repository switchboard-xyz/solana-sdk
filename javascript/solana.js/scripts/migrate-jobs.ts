import * as sbv2 from "./src";
import type { Job } from "./utils";
import { FAILED_ICON, setupOutputDir } from "./utils";

import { clusterApiUrl, Connection } from "@solana/web3.js";
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

  const jobs = new Map<string, Job>();
  for (const file of fs.readdirSync(oldJobDirPath)) {
    const fileName = path.basename(file).replace(".json", "");
    const jobDef: Job = JSON.parse(
      fs.readFileSync(path.join(oldJobDirPath, file), "utf-8")
    );
    jobs.set(fileName, jobDef);
  }

  console.log(`Found ${jobs.size} jobs to migrate`);

  const jobMap = loadJobMap();

  console.log(`Found ${jobMap.size} jobs that have already been migrated`);

  for (const [jobKey, job] of jobs.entries()) {
    if (jobMap.has(jobKey)) {
      continue;
    }
    const newJobPath = path.join(newJobDirPath, `${jobKey}.json`);
    if (fs.existsSync(newJobPath)) {
      continue;
    }
    try {
      const [jobAccount] = await sbv2.JobAccount.create(newProgram, {
        data: new Uint8Array(JSON.parse(job.definition.data)),
        name: job.definition.name,
        expiration: job.definition.expiration,
      });
      console.log(
        `${jobKey.padEnd(44, " ")} -> ${jobAccount.publicKey.toBase58()}`
      );
      fs.writeFileSync(
        newJobPath,
        JSON.stringify(
          {
            newPublicKey: jobAccount.publicKey.toBase58(),
            oldPublicKey: jobKey,
            job: job,
          },
          undefined,
          2
        )
      );

      jobMap.set(jobKey, jobAccount.publicKey.toBase58());
      writeJobMap(jobMap);
    } catch (error) {
      console.error(`${FAILED_ICON} ${jobKey} failed`);
      console.error(error);
      console.error(error);
    }
  }
}

main().catch((error) => {
  console.error(error);
});

function writeJobMap(map: Map<string, string>) {
  const fileString = `oldPubkey, newPubkey\n${Array.from(map.entries())
    .map((r) => r.join(", "))
    .join("\n")}`;
  fs.writeFileSync(jobMapPath, fileString);
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
