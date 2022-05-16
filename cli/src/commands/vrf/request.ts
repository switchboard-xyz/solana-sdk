import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  OracleQueueAccount,
  programWallet,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";
import { loadKeypair, sleep, verifyProgramHasPayer } from "../../utils";

export default class VrfRequest extends BaseCommand {
  static description = "request a new value for a VRF";

  static flags = {
    ...BaseCommand.flags,
    funderAuthority: flags.string({
      description: "alternative keypair to pay for VRF request",
    }),
    authority: flags.string({
      description: "alternative keypair that is the VRF authority",
    }),
  };

  static args = [
    {
      name: "vrfKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the VRF account to request randomness for",
    },
  ];

  async run() {
    const { args, flags } = this.parse(VrfRequest);
    verifyProgramHasPayer(this.program);
    const payerKeypair = programWallet(this.program);

    const vrfAccount = new VrfAccount({
      program: this.program,
      publicKey: args.vrfKey,
    });
    const vrf = await vrfAccount.loadData();
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: vrf.oracleQueue,
    });
    const queue = await queueAccount.loadData();
    const tokenMint = await queueAccount.loadMint();

    const authority = await this.loadAuthority(flags.authority, vrf.authority);
    const funderAuthority = flags.funderAuthority
      ? await loadKeypair(flags.funderAuthority)
      : payerKeypair;

    const funderTokenWallet = (
      await tokenMint.getOrCreateAssociatedAccountInfo(
        funderAuthority.publicKey
      )
    ).address;

    const signature = await vrfAccount.requestRandomness({
      authority,
      payerAuthority: funderAuthority,
      payer: funderTokenWallet,
    });

    if (this.silent) {
      console.log(signature);
      return;
    }

    await sleep(1000);

    this.logger.log(
      `https://explorer.solana.com/tx/${signature}?cluster=${this.cluster}`
    );
  }
}
