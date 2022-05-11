import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { buffer2string } from "@switchboard-xyz/sbv2-utils";
import { OracleJob, SwitchboardDecimal } from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import bs58 from "bs58";
import fs from "fs";
import path from "path";
import BaseCommand from "../../BaseCommand";

export default class MetricsAggregator extends BaseCommand {
  static description = "get metrics on switchboard aggregators";

  static hidden = true;

  outputBasePath: string;
  outputTxtFile?: string;
  outputJsonFile?: string;
  outputCsvFile?: string;

  aggregatorAccounts: { pubkey: PublicKey; account: AccountInfo<Buffer> }[];

  aggregators: any[];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite outputFile if it already exists",
    }),
    task: flags.string({
      description:
        "search for a given string in an aggregator task definitions",
      required: false,
    }),
    queue: flags.string({
      description: "oracle queue to filter aggregators by",
      required: false,
    }),
    json: flags.boolean({
      description: "output aggregator accounts in json format",
    }),
    csv: flags.boolean({
      description: "output aggregator accounts in csv format",
    }),
    txt: flags.boolean({
      description: "output aggregator pubkeys in txt format",
    }),
  };

  static args = [
    {
      name: "outputFile",
      required: true,
      description:
        "Output file to save accounts to. An extension of txt, csv, or json will affect output format.",
    },
  ];

  async run() {
    const { args, flags } = this.parse(MetricsAggregator);

    const parsedPath = path.parse(
      args.outputFile.startsWith("/") || args.outputFile.startsWith("C:")
        ? args.outputFile
        : path.join(process.cwd(), args.outputFile)
    );
    this.outputBasePath = path.join(parsedPath.dir, parsedPath.name);
    if (parsedPath.ext === ".txt" || flags.txt) {
      this.outputTxtFile = `${this.outputBasePath}.txt`;
      if (fs.existsSync(this.outputTxtFile) && !args.force) {
        throw new Error(
          `output txt file already exists: ${this.outputTxtFile}`
        );
      }
    }
    if (parsedPath.ext === ".json" || flags.json) {
      this.outputJsonFile = `${this.outputBasePath}.json`;
      if (fs.existsSync(this.outputJsonFile) && !args.force) {
        throw new Error(
          `output json file already exists: ${this.outputJsonFile}`
        );
      }
    }
    if (parsedPath.ext === ".csv" || flags.csv) {
      this.outputCsvFile = `${this.outputBasePath}.csv`;
      if (fs.existsSync(this.outputCsvFile) && !args.force) {
        throw new Error(
          `output csv file already exists: ${this.outputCsvFile}`
        );
      }
    }
    if (!(this.outputJsonFile || this.outputCsvFile || this.outputTxtFile)) {
      throw new Error(
        `no output format specified, try --txt, --json, or --csv`
      );
    }

    const accountCoder = new anchor.BorshAccountsCoder(this.program.idl);

    const aggregatorDiscriminator = Uint8Array.from([
      217, 230, 65, 101, 201, 162, 27, 125,
    ]);

    this.aggregatorAccounts =
      await this.program.provider.connection.getProgramAccounts(
        this.program.programId,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: bs58.encode(aggregatorDiscriminator),
              },
            },
          ],
        }
      );

    const aggregatorPubkeys = this.aggregatorAccounts.map((account) =>
      account.pubkey.toString()
    );

    const allAggregators = await buildAggregators(
      this.program,
      this.aggregatorAccounts
    );

    const aggregators: Aggregator[] = [];

    // output list of aggregators by a given task type
    if (flags.task) {
      // const aggregators: Aggregator[] = [];
      for (const aggregator of allAggregators) {
        // check aggregator job definitions for task type
        for (const job of aggregator.jobs) {
          if (job === undefined || job.tasks === undefined) {
            continue;
          }
          const jobString = JSON.stringify(job.tasks).toLowerCase();
          if (jobString.indexOf(flags.task.toLowerCase()) !== -1) {
            aggregators.push(aggregator);
            break;
          }
        }
      }
    } else if (flags.queue) {
      for (const aggregator of allAggregators) {
        if (aggregator.queuePubkey.toString() === flags.queue) {
          aggregators.push(aggregator);
        }
      }
    } else {
      aggregators.push(...allAggregators);
    }

    writeAggregators(
      aggregators,
      this.outputTxtFile,
      this.outputJsonFile,
      this.outputCsvFile
    );
  }

  async catch(error) {
    super.catch(error, "failed to filter aggregator jobs");
  }
}

function writeAggregators(
  aggregators: Aggregator[],
  outputTxtFile?: string,
  outputJsonFile?: string,
  outputCsvFile?: string
) {
  // write txt file
  if (outputTxtFile) {
    fs.writeFileSync(
      outputTxtFile,
      aggregators.map((a) => a.publicKey.toString()).join("\n")
    );
  }

  // write json file
  if (outputJsonFile) {
    fs.writeFileSync(outputJsonFile, JSON.stringify(aggregators, undefined, 2));
  }

  // write csv file or output to console
  if (outputCsvFile) {
    const headers = [
      "name",
      "metadata",
      "publicKey",
      "authority",
      "queuePubkey",
      "crankPubkey",
      "historyBuffer",
      "oracleRequestBatchSize",
      "minOracleResults",
      "minJobResults",
      "minUpdateDelaySeconds",
      "varianceThreshold",
      "forceReportPeriod",
    ];
    const rows = aggregators.map((a) => {
      return [
        a.name,
        a.metadata,
        a.publicKey.toString(),
        a.authority.toString(),
        a.queuePubkey.toString(),
        a.crankPubkey.toString(),
        a.historyBuffer.toString(),
        a.oracleRequestBatchSize.toString(),
        a.minOracleResults.toString(),
        a.minJobResults.toString(),
        a.minUpdateDelaySeconds.toString(),
        a.varianceThreshold.toString(),
        a.forceReportPeriod.toString(),
      ];
    });

    if (outputCsvFile) {
      fs.writeFileSync(
        outputCsvFile,
        `${headers.join(",")}\n${rows.map((r) => r.join(",")).join("\n")}`
      );
    }
    // if (!flags.silent) {
    //   console.table(table.rows, table.headers);
    // }
  }
}

async function buildAggregators(
  program: anchor.Program,
  aggregatorAccounts: { pubkey: PublicKey; account: AccountInfo<Buffer> }[]
): Promise<Aggregator[]> {
  const accountCoder = new anchor.BorshAccountsCoder(program.idl);
  // get all job pubkeys tied to aggregators
  const jobPubkeys = aggregatorAccounts
    .map((agg) => {
      const aggregatorData = accountCoder.decode(
        "AggregatorAccountData",
        agg.account.data
      );
      const jobKeys = (
        aggregatorData.jobPubkeysData.slice(
          0,
          aggregatorData.jobPubkeysSize
        ) as anchor.web3.PublicKey[]
      ).filter(
        (pubkey: anchor.web3.PublicKey) =>
          pubkey !== anchor.web3.PublicKey.default
      );
      return jobKeys;
    })
    .flat();

  // store a map of job pubkeys and their definitions
  const jobMap = await buildJobMap(program, jobPubkeys);

  const aggregators: Aggregator[] = [];
  for await (const account of aggregatorAccounts) {
    const aggregatorData = accountCoder.decode(
      "AggregatorAccountData",
      account.account.data
    );
    const jobKeys = (
      aggregatorData.jobPubkeysData.slice(
        0,
        aggregatorData.jobPubkeysSize
      ) as anchor.web3.PublicKey[]
    ).filter(
      (pubkey: anchor.web3.PublicKey) =>
        pubkey !== anchor.web3.PublicKey.default
    );

    const jobs = jobKeys.map((jobKey) => jobMap.get(jobKey.toString()));
    const aggregator = new Aggregator(account.pubkey, aggregatorData, jobs);
    aggregators.push(aggregator);
  }

  return aggregators;
}

async function buildJobMap(
  program: anchor.Program,
  pubkeys: PublicKey[],
  max = 300
): Promise<Map<string, Job>> {
  function sliceIntoChunks(arr: PublicKey[], chunkSize: number): PublicKey[][] {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  }
  const jobMap = new Map<string, Job>();
  const publicKeys = sliceIntoChunks(pubkeys, max);
  for await (const pubKeyBatch of publicKeys) {
    const jobAccountInfos = await program.account.jobAccountData.fetchMultiple(
      pubKeyBatch
    );
    for (const [index, jobAccount] of jobAccountInfos.entries()) {
      const publicKey = pubKeyBatch[index];
      const oracleJob = OracleJob.decodeDelimited(jobAccount["data"]);
      const job = new Job(publicKey, jobAccount, oracleJob.tasks);
      //   console.log(`jobKey: ${publicKey}, ${JSON.stringify(job)}`);
      jobMap.set(publicKey.toString(), job);
    }
  }

  return jobMap;
}

interface JobData {
  name: Buffer;
  metadata: Buffer;
  authority: PublicKey;
  expiration: anchor.BN;
  hash: Uint8Array;
  data: Buffer;
  referenceCount: number;
  totalSpent: anchor.BN;
  createdAt: anchor.BN;
}

class Job {
  publicKey: PublicKey;
  tasks: OracleJob.ITask[];
  name?: string;
  metadata?: string;
  authorWallet?: PublicKey;
  expiration?: number;
  hash?: Buffer;
  referenceCount?: number;
  totalSpent?: number;

  constructor(publicKey: PublicKey, jobData: any, tasks: OracleJob.ITask[]) {
    this.publicKey = publicKey;
    this.tasks = tasks;
    this.name = buffer2string(jobData.name);
    this.metadata = buffer2string(jobData.metadata);
    this.authorWallet =
      jobData.authorWallet && !PublicKey.default.equals(jobData.authorWallet)
        ? jobData.authorWallet
        : PublicKey.default;
    this.expiration = jobData.expiration.toNumber();
    this.hash = jobData.hash;
    this.referenceCount = jobData.referenceCount;
    this.totalSpent = jobData.totalSpent;
  }

  toJSON(): any {
    return {
      publicKey: this.publicKey.toString(),
      name: this.name,
      metadata: this.metadata,
      authorWallet: this.authorWallet.equals(PublicKey.default)
        ? "N/A"
        : this.authorWallet.toString(),
      expiration: this.expiration,
      hash: this.hash.toString(),
      referenceCount: this.referenceCount,
      totalSpent: this.totalSpent,
      tasks: this.tasks,
    };
  }
}

class Aggregator {
  publicKey: PublicKey;
  jobs: Job[];
  name?: string;
  metadata?: string;
  authorWallet?: PublicKey;
  queuePubkey?: PublicKey;
  oracleRequestBatchSize?: number;
  minOracleResults?: number;
  minJobResults?: number;
  minUpdateDelaySeconds?: number;
  startAfter: anchor.BN;
  varianceThreshold?: Big;
  forceReportPeriod?: anchor.BN;
  expiration?: number;
  crankPubkey?: PublicKey;
  jobPubkeysSize?: number;
  authority?: PublicKey;
  historyBuffer?: PublicKey;
  disableCrank?: boolean;

  constructor(publicKey: PublicKey, aggregatorData: any, jobs: Job[]) {
    this.publicKey = publicKey;
    this.jobs = jobs;
    this.name = buffer2string(aggregatorData.name);
    this.metadata = buffer2string(aggregatorData.metadata);
    this.authorWallet =
      aggregatorData.authorWallet &&
      !PublicKey.default.equals(aggregatorData.authorWallet)
        ? aggregatorData.authorWallet
        : PublicKey.default;
    this.queuePubkey =
      aggregatorData.queuePubkey &&
      !PublicKey.default.equals(aggregatorData.queuePubkey)
        ? aggregatorData.queuePubkey
        : PublicKey.default;
    this.oracleRequestBatchSize = aggregatorData.oracleRequestBatchSize;
    this.minOracleResults = aggregatorData.minOracleResults;
    this.minJobResults = aggregatorData.minJobResults;
    this.minUpdateDelaySeconds = aggregatorData.minUpdateDelaySeconds;
    this.startAfter = aggregatorData.startAfter;
    this.varianceThreshold = SwitchboardDecimal.from(
      aggregatorData.varianceThreshold
    ).toBig();
    this.forceReportPeriod = aggregatorData.forceReportPeriod;
    this.expiration = aggregatorData.expiration.toNumber();
    this.crankPubkey =
      aggregatorData.crankPubkey &&
      !PublicKey.default.equals(aggregatorData.crankPubkey)
        ? aggregatorData.crankPubkey
        : PublicKey.default;
    this.jobPubkeysSize = aggregatorData.jobPubkeysSize;
    this.authority = aggregatorData.authority;
    this.historyBuffer =
      aggregatorData.historyBuffer &&
      !PublicKey.default.equals(aggregatorData.historyBuffer)
        ? aggregatorData.historyBuffer
        : PublicKey.default;
    this.disableCrank = aggregatorData.disableCrank;
  }

  toJSON(): any {
    return {
      publicKey: this.publicKey.toString(),
      name: this.name,
      metadata: this.metadata,
      authorWallet: this.authorWallet.equals(PublicKey.default)
        ? "N/A"
        : this.authorWallet.toString(),
      queuePubkey: this.queuePubkey.equals(PublicKey.default)
        ? "N/A"
        : this.queuePubkey.toString(),
      oracleRequestBatchSize: this.oracleRequestBatchSize,
      minOracleResults: this.minOracleResults,
      minJobResults: this.minJobResults,
      minUpdateDelaySeconds: this.minUpdateDelaySeconds,
      startAfter: this.startAfter.toNumber(),
      varianceThreshold: this.varianceThreshold.toNumber(),
      forceReportPeriod: this.forceReportPeriod.toNumber(),
      expiration: this.expiration,
      crankPubkey: this.crankPubkey.equals(PublicKey.default)
        ? "N/A"
        : this.crankPubkey.toString(),
      jobPubkeysSize: this.jobPubkeysSize,
      authority: this.authority.equals(PublicKey.default)
        ? "N/A"
        : this.authority.toString(),
      historyBuffer: this.historyBuffer.equals(PublicKey.default)
        ? "N/A"
        : this.historyBuffer.toString(),
      disableCrank: this.disableCrank,
      jobs: this.jobs.map((job) => (job !== undefined ? job.toJSON() : "N/A")),
    };
  }
}
