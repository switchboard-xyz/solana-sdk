import { Connection, PublicKey } from "@solana/web3.js";
import { buildContext, TaskSimulator } from "@switchboard-xyz/v2-task-runner";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

async function main(): Promise<void> {
  const argv = yargs(hideBin(process.argv))
    // eslint-disable-next-line @typescript-eslint/no-shadow
    .command(`run [jobFile]`, "run a local job file", (yargs) => {
      return yargs.positional("jobFile", {
        type: "string",
        describe: "filesystem path of job file to test",
        demand: false,
      });
    })
    .options({
      jobKey: {
        type: "string",
        alias: "j",
        describe: "optional public key of job account to simulate",
        demand: false,
      },
      aggregatorKey: {
        type: "string",
        alias: "a",
        describe: "optional public key of aggregator jobs to simulate",
        demand: false,
      },
      dir: {
        type: "string",
        alias: "d",
        describe: "directory of json files to simulate",
        demand: false,
      },
      cluster: {
        type: "string",
        alias: "c",
        describe: "optional cluster to fetch public key account",
        options: ["devnet", "mainnet-beta"],
        default: "devnet",
        demand: false,
      },
      rpcUrl: {
        type: "string",
        alias: "u",
        describe: "RPC URL to connect to",
        default: "https://switchboard.rpcpool.com/ec20ad2831092cfcef66d677539a",
        demand: true,
      },
    })
    .parseSync();

  const { jobFile, jobKey, aggregatorKey, dir, rpcUrl, cluster } = argv;

  const simulator = new TaskSimulator("mainnet-beta");

  const mainnetConnection = new Connection(rpcUrl);
  const context = await buildContext(mainnetConnection, console);

  if (aggregatorKey) {
    const aggregatorPubkey = new PublicKey(aggregatorKey);
    await simulator.simulateAggregatorKey(aggregatorPubkey, context);
  } else if (jobKey) {
    const jobPubkey = new PublicKey(jobKey);
    await simulator.simulateJobKey(jobPubkey, context);
  } else if (dir) {
    await simulator.simulateJobJsonDirectory(dir, context);
  } else {
    await simulator.simulateJobJson(jobFile ?? "", context);
  }
}

main().then(
  () => {},
  (error) => {
    console.error(error);
  }
);
