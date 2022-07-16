import { PublicKey } from "@solana/web3.js";
import { prettyPrintVrf } from "@switchboard-xyz/sbv2-utils";
import { VrfAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class VrfPrint extends BaseCommand {
  outputFile?: string;

  static enableJsonFlag = true;

  static description = "Print the deserialized Switchboard VRF account";

  static aliases = ["vrf:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "vrfKey",
      description: "public key of the vrf account to deserialize",
    },
  ];

  static examples = ["$ sbv2 vrf:print"];

  async run() {
    const { args, flags } = await this.parse(VrfPrint);

    const vrfAccount = new VrfAccount({
      program: this.program,
      publicKey: new PublicKey(args.vrfKey),
    });

    this.logger.log(
      await prettyPrintVrf(vrfAccount, await vrfAccount.loadData(), true)
    );
  }

  async catch(error) {
    super.catch(error, "failed to print vrf account");
  }
}
