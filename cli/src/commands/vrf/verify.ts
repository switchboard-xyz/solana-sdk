import { PublicKey } from "@solana/web3.js";
import {
  toVrfStatusString,
  verifyProgramHasPayer,
} from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  programWallet,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class VrfVerify extends BaseCommand {
  static description = "if ready, verify a VRF proof";

  static examples = [];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "vrfKey",
      description: "public key of the VRF account to request randomness for",
    },
  ];

  async run() {
    const { args, flags } = await this.parse(VrfVerify);
    verifyProgramHasPayer(this.program);
    const payerKeypair = programWallet(this.program);

    const vrfAccount = new VrfAccount({
      program: this.program,
      publicKey: new PublicKey(args.vrfKey),
    });
    const vrf = await vrfAccount.loadData();

    const status = toVrfStatusString(vrf.status);
    if (status !== "StatusVerifying") {
      throw new Error(`Vrf not ready to be verified, current status ${status}`);
    }

    if (vrf.txRemaining === 0) {
      throw new Error(`vrf has ${vrf.txRemaining} txRemaining to verify proof`);
    }

    const oracle = new OracleAccount({
      program: this.program,
      publicKey: vrf.builders[0].producer as PublicKey,
    });

    const signatures = await vrfAccount.verify(oracle);

    this.log(
      `VrfAccount verification instructions sent\r\n${JSON.stringify(
        signatures,
        undefined,
        2
      )}`
    );
  }
}
