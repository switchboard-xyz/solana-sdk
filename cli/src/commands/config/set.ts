import { Flags } from "@oclif/core";
import BaseCommand from "../../BaseCommand";

export default class ConfigSet extends BaseCommand {
  hidden = true;

  static description = "set a configuration option";

  static flags = {
    ...BaseCommand.flags,
    reset: Flags.boolean({
      char: "r",
      description: "remove value or set to default rpc",
    }),
  };

  static args = [
    {
      name: "param",
      options: ["devnet-rpc", "mainnet-rpc"],
      description: "configuration parameter to set",
    },
    {
      name: "value",
      required: false,
      description: "value of the param to set",
    },
  ];

  async run() {
    const { args, flags } = await this.parse(ConfigSet);
    this.setConfig(args.param, flags.reset ? undefined : args.value);
  }

  async catch(error) {
    super.catch(error, "failed to set config option");
  }
}
