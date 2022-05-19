import { PublicKey } from "@solana/web3.js";
import { prettyPrintVrf } from "@switchboard-xyz/sbv2-utils";
import { VrfAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class VrfPrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard VRF account";

  static aliases = ["vrf:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "vrfKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the vrf account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 vrf:print SzTvFZLz3hwjZFMwVWzuEnr1oUF6qyvXwXCvsqf7qeA",
  ];

  async run() {
    const { args, flags } = this.parse(VrfPrint);

    const vrfAccount = new VrfAccount({
      program: this.program,
      publicKey: args.vrfKey,
    });

    this.logger.log(await prettyPrintVrf(vrfAccount, undefined, true));
  }

  async catch(error) {
    super.catch(error, "failed to print vrf account");
  }
}
