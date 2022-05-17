import { flags } from "@oclif/command";
import BaseCommand from "../../BaseCommand";
import { ConfigParameter } from "../../config";

export default class ConfigSet extends BaseCommand {
  hidden = true;

  static description = "set a configuration option";

  static flags = {
    ...BaseCommand.flags,
    reset: flags.boolean({
      char: "r",
      description: "remove value or set to default rpc",
    }),
  };

  static args = [
    {
      name: "param",
      required: true,
      options: ["devnet-rpc", "mainnet-rpc"],
      parse: (string_: string) => string_ as ConfigParameter,
      description: "configuration parameter to set",
    },
    {
      name: "value",
      required: false,
      description: "value of the param to set",
    },
  ];

  async run() {
    const { args, flags } = this.parse(ConfigSet);
    this.setConfig(args.param, flags.reset ? undefined : args.value);
  }

  async catch(error) {
    super.catch(error, "failed to set config option");
  }
}
