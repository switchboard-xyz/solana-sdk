import { Flags } from "@oclif/core";
import { Input } from "@oclif/parser";
import * as anchor from "@project-serum/anchor";
import { SwitchboardDecimal } from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import fs from "fs";
import path from "path";
import BaseCommand from "./BaseCommand";

abstract class OutputFileBaseCommand extends BaseCommand {
  outputBasePath: string;

  // outputTxtFile?: string;

  outputJsonFile?: string;

  outputCsvFile?: string;

  static flags = {
    ...BaseCommand.flags,
    force: Flags.boolean({ description: "overwrite output file if exists" }),
    outputFile: Flags.string({
      char: "f",
      description: "output file to save aggregator pubkeys to",
      required: true,
    }),
    json: Flags.boolean({
      description: "output aggregator accounts in json format",
    }),
    csv: Flags.boolean({
      description: "output aggregator accounts in csv format",
    }),
    // txt: Flags.boolean({
    //   description: "output aggregator pubkeys in txt format",
    // }),
  };

  async init() {
    await super.init();
    const { flags } = await this.parse((<Input<any>>this.constructor) as any);
    BaseCommand.flags = flags as any;

    const parsedPath = path.parse(
      flags.outputFile.startsWith("/") || flags.outputFile.startsWith("C:")
        ? flags.outputFile
        : path.join(process.cwd(), flags.outputFile)
    );
    this.outputBasePath = path.join(parsedPath.dir, parsedPath.name);

    if (parsedPath.ext === ".json" || flags.json) {
      this.outputJsonFile = `${this.outputBasePath}.json`;
      if (fs.existsSync(this.outputJsonFile) && !flags.force) {
        throw new Error(
          `output json file already exists: ${this.outputJsonFile}`
        );
      }
    }

    if (parsedPath.ext === ".csv" || flags.csv) {
      this.outputCsvFile = `${this.outputBasePath}.csv`;
      if (fs.existsSync(this.outputCsvFile) && !flags.force) {
        throw new Error(
          `output csv file already exists: ${this.outputCsvFile}`
        );
      }
    }

    if (!(this.outputJsonFile || this.outputCsvFile)) {
      throw new Error(`no output format specified, try --json, or --csv`);
    }
  }

  jsonReplacers(key: any, value: any) {
    if (typeof value === "string") {
      return value;
    } else if (typeof value === "number") {
      return value;
    } else if (typeof value === "boolean") {
      return value.toString();
    } else {
      if (value instanceof Big) {
        return value.toString();
      } else if (anchor.BN.isBN(value)) {
        return value.toString(10);
      } else if (
        ("scale" in value && "mantissa" in value) ||
        value instanceof SwitchboardDecimal
      ) {
        return new SwitchboardDecimal(value.mantissa, value.scale)
          .toBig()
          .toString();
      }
    }

    return value;
  }

  save<T, K extends keyof T>(rows?: T | T[], headers?: K[]) {
    if (rows) {
      this.saveJson(rows);
    }
    if (rows !== undefined && headers !== undefined) {
      this.saveCsv(rows, headers);
    }
  }

  saveJson<T>(rows: T | T[]) {
    if (this.outputJsonFile) {
      fs.writeFileSync(
        this.outputJsonFile,
        JSON.stringify(rows, this.jsonReplacers, 2)
      );
    }
  }

  saveCsv<T, K extends keyof T>(rows: T | T[], headers: K[]) {
    if (this.outputCsvFile) {
      const grid: string[][] = [];
      grid.push(headers as string[]);
      if (Array.isArray(rows)) {
        rows.forEach((row) => {
          const cols: string[] = [];
          headers.forEach((col) => {
            const val = row[col];
            cols.push(
              typeof val === "string" ? val : this.jsonReplacers(undefined, val)
            );
          });
          grid.push(cols);
        });
      } else {
        const cols: string[] = [];
        headers.forEach((col) => {
          const val = rows[col];
          cols.push(
            typeof val === "string" ? val : this.jsonReplacers(undefined, val)
          );
        });
        grid.push(cols);
      }

      const lines = grid.map((col) => col.join(","));
      fs.writeFileSync(this.outputCsvFile, lines.join("\n"));
    }
  }
}

export default OutputFileBaseCommand;
