import { Flags } from "@oclif/core";
import { Keypair, PublicKey } from "@solana/web3.js";
import { prettyPrintQueue } from "@switchboard-xyz/sbv2-utils";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, getProgramPayer } from "../../../utils";

export default class QueueSetVrf extends BaseCommand {
  queueAccount: OracleQueueAccount;

  queueAuthority: Keypair | undefined = undefined;

  static description = "set unpermissionedVrfEnabled";

  static flags = {
    ...BaseCommand.flags,
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that is the authority for oracle queue",
    }),
    disable: Flags.boolean({
      description: "disable unpermissionedVrfEnabled",
    }),
  };

  static args = [
    {
      name: "queueKey",
      description: "public key of the oracle queue to create a crank on",
    },
  ];

  static examples = [
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1",
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../payer-keypair.json -a ../authority-keypair.json",
  ];

  async run() {
    const { args, flags } = await this.parse(QueueSetVrf);

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: new PublicKey(args.queueKey),
    });
    const queue = await queueAccount.loadData();

    const queueAuthority = await this.loadAuthority(
      flags.authority,
      queue.authority
    );

    const setVrfTxn = await this.queueAccount.setVrfSettings({
      unpermissionedVrf: true,
      authority: this.queueAuthority ?? getProgramPayer(this.program),
    });

    if (this.silent) {
      console.log(setVrfTxn);
    } else {
      this.logger.log(await prettyPrintQueue(queueAccount, undefined, true));
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Queue VRF successfully set\r\n`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set queue VRF settings");
  }
}
