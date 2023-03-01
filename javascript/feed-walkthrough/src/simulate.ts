import { simulateOracleJobs } from "@switchboard-xyz/common";
import chalk from "chalk";
import { myOracleJob } from "./oracle-job";

async function main() {
  const response = await simulateOracleJobs([myOracleJob], "devnet");

  console.log(
    chalk.blue(`\u2139 TaskRunner Version: ${response.taskRunnerVersion}`)
  );
  console.log(
    chalk.green(`\u2714 Result: ${response.result.toString()}`),
    `[${response.results.map((r) => r.toString()).join(", ")}]`
  );
}

main().then(
  () => {
    process.exit();
  },
  (error) => {
    console.error("Failed to simulate the oracle job response");
    console.error(error);
    process.exit(1);
  }
);
