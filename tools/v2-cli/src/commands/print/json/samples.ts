import fs from "fs";
import path from "path";
import BaseCommand from "../../../BaseCommand";

export default class PrintJsonSamples extends BaseCommand {
  static description = "write sample definition files to a directory";

  static aliases = ["json:samples", "write:json:samples"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "outputDirectory",
      required: true,
      description: "filesystem path to output sample definition files",
    },
  ];

  static examples = [
    "$ sbv2 print:json:samples ~/switchboard_json_samples",
    "$ sbv2 json:samples ~/switchboard_json_samples",
    "$ sbv2 write:json:samples ~/switchboard_json_samples",
  ];

  async run() {
    const { args } = this.parse(PrintJsonSamples);
    // eslint-disable-next-line unicorn/prefer-module
    const projectPath = path.join(__dirname, "../../../../examples"); // this path is relative to the current *.ts file
    const files = [
      "aggregator.json",
      "job.ftxCom.json",
      "job.serum.json",
      "queue.json",
    ];

    const outputPath = args.outputDirectory;

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
      if (!fs.existsSync(outputPath)) {
        throw new Error("outputDirectory is not a valid file path");
      }
    }
    if (!fs.lstatSync(outputPath).isDirectory) {
      throw new Error("outputDirectory is not a valid directory");
    }

    for (const f of files) {
      const outputFile = path.join(outputPath, f);
      fs.copyFileSync(path.join(projectPath, f), outputFile);
      this.logger.log(`${outputFile}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to write sample json files to disk");
  }
}
