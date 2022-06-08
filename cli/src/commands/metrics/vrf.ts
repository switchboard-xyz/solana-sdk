import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import { AccountInfo, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";
import path from "path";
import BaseCommand from "../../BaseCommand";

export default class MetricsVrf extends BaseCommand {
  static description = "get metrics on switchboard vrfs";

  static hidden = true;

  outputBasePath: string;

  outputTxtFile?: string;

  outputJsonFile?: string;

  outputCsvFile?: string;

  vrfAccounts: { pubkey: PublicKey; account: AccountInfo<Buffer> }[];

  vrfs: any[];

  static flags = {
    ...BaseCommand.flags,
    force: Flags.boolean({
      description: "overwrite outputFile if it already exists",
    }),
    queue: Flags.string({
      description: "oracle queue to filter aggregators by",
      required: false,
    }),
    json: Flags.boolean({
      description: "output aggregator accounts in json format",
    }),
    csv: Flags.boolean({
      description: "output aggregator accounts in csv format",
    }),
    txt: Flags.boolean({
      description: "output aggregator pubkeys in txt format",
    }),
  };

  static args = [
    {
      name: "outputFile",
      required: true,
      description: "Output file to save accounts to",
    },
  ];

  async run() {
    const { args, flags } = await this.parse(MetricsVrf);

    const parsedPath = path.parse(
      args.outputFile.startsWith("/") || args.outputFile.startsWith("C:")
        ? args.outputFile
        : path.join(process.cwd(), args.outputFile)
    );
    this.outputBasePath = path.join(parsedPath.dir, parsedPath.name);
    if (parsedPath.ext === ".txt" || flags.txt) {
      this.outputTxtFile = `${this.outputBasePath}.txt`;
      if (fs.existsSync(this.outputTxtFile) && flags.force === false) {
        throw new Error(
          `output txt file already exists: ${this.outputTxtFile}`
        );
      }
    }

    if (parsedPath.ext === ".json" || flags.json) {
      this.outputJsonFile = `${this.outputBasePath}.json`;
      if (fs.existsSync(this.outputJsonFile) && flags.force === false) {
        throw new Error(
          `output json file already exists: ${this.outputJsonFile}`
        );
      }
    }

    if (parsedPath.ext === ".csv" || flags.csv) {
      this.outputCsvFile = `${this.outputBasePath}.csv`;
      if (fs.existsSync(this.outputCsvFile) && flags.force === false) {
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
      101, 35, 62, 239, 103, 151, 6, 18,
    ]);

    this.vrfAccounts =
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

    const vrfPubkeys = this.vrfAccounts.map((account) =>
      account.pubkey.toString()
    );

    fs.writeFileSync(this.outputTxtFile, vrfPubkeys.join("\n"));

    // writeAggregators(
    //   aggregators,
    //   this.outputTxtFile,
    //   this.outputJsonFile,
    //   this.outputCsvFile
    // );
  }

  async catch(error) {
    super.catch(error, "failed to filter vrf accounts");
  }
}

// function writeVrfs(
//   vrfs: Aggregator[],
//   outputTxtFile?: string,
//   outputJsonFile?: string,
//   outputCsvFile?: string
// ) {
//   // write txt file
//   if (outputTxtFile) {
//     fs.writeFileSync(
//       outputTxtFile,
//       aggregators.map((a) => a.publicKey.toString()).join("\n")
//     );
//   }

//   // write json file
//   if (outputJsonFile) {
//     fs.writeFileSync(outputJsonFile, JSON.stringify(aggregators, undefined, 2));
//   }

//   // write csv file or output to console
//   if (outputCsvFile) {
//     const headers = [
//       "name",
//       "metadata",
//       "publicKey",
//       "authority",
//       "queuePubkey",
//       "crankPubkey",
//       "historyBuffer",
//       "oracleRequestBatchSize",
//       "minOracleResults",
//       "minJobResults",
//       "minUpdateDelaySeconds",
//       "varianceThreshold",
//       "forceReportPeriod",
//     ];
//     const rows = aggregators.map((a) => {
//       return [
//         a.name,
//         a.metadata,
//         a.publicKey.toString(),
//         a.authority.toString(),
//         a.queuePubkey.toString(),
//         a.crankPubkey.toString(),
//         a.historyBuffer.toString(),
//         a.oracleRequestBatchSize.toString(),
//         a.minOracleResults.toString(),
//         a.minJobResults.toString(),
//         a.minUpdateDelaySeconds.toString(),
//         a.varianceThreshold.toString(),
//         a.forceReportPeriod.toString(),
//       ];
//     });

//     if (outputCsvFile) {
//       fs.writeFileSync(
//         outputCsvFile,
//         `${headers.join(",")}\n${rows.map((r) => r.join(",")).join("\n")}`
//       );
//     }
//     // if (!flags.silent) {
//     //   console.table(table.rows, table.headers);
//     // }
//   }
// }
