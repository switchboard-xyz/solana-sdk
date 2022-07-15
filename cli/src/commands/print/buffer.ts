/* eslint-disable unicorn/import-style */
import { Flags } from "@oclif/core";
import { prettyPrintBufferRelayer } from "@switchboard-xyz/sbv2-utils";
import { BufferRelayerAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class BufferPrint extends BaseCommand {
  static description =
    "Print the deserialized Switchboard buffer relayer account";

  static aliases = ["buffer:print"];

  static flags = {
    ...BaseCommand.flags,
    job: Flags.boolean({
      description: "output job definitions",
      default: false,
    }),
  };

  static args = [
    {
      name: "bufferRelayerKey",
      description: "public key of the buffer relayer account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 buffer:print 23GvzENjwgqqaLejsAtAWgTkSzWjSMo2LUYTAETT8URp",
  ];

  async run() {
    const { args, flags } = await this.parse(BufferPrint);

    const bufferAccount = new BufferRelayerAccount({
      program: this.program,
      publicKey: args.bufferRelayerKey,
    });
    const bufferAccountData = await bufferAccount.loadData();

    this.logger.log(
      await prettyPrintBufferRelayer(
        bufferAccount,
        bufferAccountData,
        flags.job
      )
    );
  }

  async catch(error) {
    super.catch(error, "failed to print buffer relayer account");
  }
}
