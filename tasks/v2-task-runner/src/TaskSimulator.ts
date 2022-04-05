/* eslint-disable unicorn/require-number-to-fixed-digits-argument */
import * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  JobAccount,
  SBV2_DEVNET_PID,
} from "@switchboard-xyz/switchboard-v2";
import { OracleJob, IOracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { URL } from "url";
import TaskRunner from "./TaskRunner";
import type { OracleContext } from "./types";

export class TaskSimulator {
  static async getProgram(cliCluster?: string): Promise<anchor.Program> {
    const cluster = cliCluster ?? process.env.CLUSTER ?? "devnet";
    switch (cluster) {
      case "devnet": {
        const connection = new Connection(clusterApiUrl(cluster));
        const dummyKeypair = anchor.web3.Keypair.generate();
        const wallet = new anchor.Wallet(dummyKeypair);
        const provider = new anchor.Provider(connection, wallet, {
          commitment: "processed",
          preflightCommitment: "processed",
        });
        const anchorIdl = await anchor.Program.fetchIdl(
          SBV2_DEVNET_PID,
          provider
        );
        return new anchor.Program(anchorIdl, SBV2_DEVNET_PID, provider);
      }

      default:
        throw new Error(`not implemented for cluster ${cluster}`);
    }
  }

  async performJob(job: OracleJob, context?: OracleContext): Promise<Big> {
    const program = await TaskSimulator.getProgram();
    const { tasks } = job;
    // console.log(`TASKS ${JSON.stringify(job.toJSON())}`);
    const result = await TaskRunner.performTasks(tasks, program, context);
    if (result.isErr()) throw result.error;
    return result.value;
  }

  async simulateAggregatorKey(
    aggregatorKey: PublicKey,
    context?: OracleContext
  ) {
    const program = await TaskSimulator.getProgram();
    const aggregatorAccount = new AggregatorAccount({
      program,
      publicKey: new PublicKey(aggregatorKey),
    });
    const jobs = await aggregatorAccount.loadJobs();
    let numberSuccess = 0;
    for await (const [index, job] of jobs.entries()) {
      try {
        const start = Date.now();
        const result = await this.performJob(job, context);
        const end = Date.now();
        const runTime = ((end - start) / 1000).toFixed(3);
        console.log(
          `${index + 1}:`.padEnd(3),
          chalk.green(`\u2714 ${result.toFixed()}`.padEnd(12)),
          `${runTime} sec`.padEnd(10),
          `(${this.getUrlFromTask(job)})`
        );
        numberSuccess += 1;
      } catch (error) {
        console.log(chalk.red("\u2717", "Task failed"), error.message);
      }
    }

    console.log(chalk.blue("== Results =="));
    console.log(`Success: ${chalk.green(numberSuccess)} \\ ${jobs.length}`);
    console.log(
      `Failed:  ${chalk.red(jobs.length - numberSuccess)} \\ ${jobs.length}`
    );
  }

  async simulateJobKey(jobKey: PublicKey, context?: OracleContext) {
    const program = await TaskSimulator.getProgram();
    const jobAccount = new JobAccount({
      program,
      publicKey: new PublicKey(jobKey),
    });
    const job = await jobAccount.loadJob();

    try {
      console.log(`simulating task for job account... ${jobKey}`);
      const start = Date.now();
      const result = await this.performJob(job, context);
      const end = Date.now();
      const runTime = ((end - start) / 1000).toFixed(3);
      console.log(
        chalk.green(`\u2714 ${result.toFixed(2)}`.padEnd(12)),
        `${runTime} sec`.padEnd(10),
        `(${this.getUrlFromTask(job)})`
      );
    } catch (error) {
      console.log(chalk.red("\u2717", "Task failed"), error.message);
      throw error;
    }
  }

  async simulateJobJsonDirectory(
    directoryPath: string,
    context?: OracleContext
  ) {
    const directory = path.join(process.cwd(), directoryPath);
    const files = getAllJsonFiles(directory, []);
    for await (const file of files) {
      try {
        await this.simulateJobJson(file, context);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async simulateJobJson(jsonPath: string, context?: OracleContext) {
    const program = await TaskSimulator.getProgram();
    if (!jsonPath) throw new Error(`failed to provide job file to run`);
    let job: OracleJob;
    try {
      const fileString = fs
        .readFileSync(jsonPath, "utf8")
        // replace all json comments https://regex101.com/r/B8WkuX/1
        .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/g, "");
      const tasks: IOracleJob = JSON.parse(fileString);
      job = OracleJob.create(tasks);
    } catch (error) {
      throw new Error(`failed to read job file ${jsonPath}: ${error}`);
    }

    try {
      console.log(
        `simulating task for json file... ${jsonPath.replace(
          process.cwd(),
          "."
        )} `
      );
      const start = Date.now();
      const result = await this.performJob(job, context);
      const end = Date.now();
      const runTime = ((end - start) / 1000).toFixed(3);
      console.log(
        chalk.green(`\u2714 ${result.toFixed()}`.padEnd(12)),
        `${runTime} sec`.padEnd(10),
        `(${this.getUrlFromTask(job)})`
      );
    } catch (error) {
      console.log(chalk.red("\u2717", "Task failed"), error.message);
      throw error;
    }
  }

  getUrlFromTask(job: OracleJob): string {
    const { tasks } = job;
    const firstTask = tasks[0];
    const jobUrl: string = firstTask.httpTask
      ? firstTask.httpTask.url
      : firstTask.websocketTask
      ? firstTask.websocketTask.url
      : "";
    if (jobUrl === "") return jobUrl;
    const parsedUrl = new URL(jobUrl);
    return parsedUrl.hostname;
  }
}

const getAllJsonFiles = (dirPath: string, arrayOfFiles: string[]): string[] => {
  const files = fs.readdirSync(dirPath, "utf8");

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file: string) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllJsonFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith(".json") || file.endsWith(".jsonc")) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
};
