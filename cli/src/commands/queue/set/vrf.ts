import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2/src";
import chalk from "chalk";
import { fromCrankJSON, OracleQueueClass } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, getProgramPayer, loadKeypair } from "../../../utils";

export default class QueueSetVrf extends BaseCommand {
  queueAccount: OracleQueueAccount;

  crankDefinition: fromCrankJSON;

  queueAuthority: Keypair | undefined = undefined;

  static description = "add a crank to an existing oracle queue";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the authority for oracle queue",
    }),
    disable: flags.boolean({
      description: "disable unpermissionedVrfEnabled",
    }),
  };

  static args = [
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue to create a crank on",
    },
  ];

  static examples = [
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1",
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../payer-keypair.json -a ../authority-keypair.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(QueueSetVrf);

    this.queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });

    // TODO: Not implemented yet
    if (flags.authority) {
      this.queueAuthority = await loadKeypair(flags.authority);
    }
  }

  async run() {
    const setVrfTxn = await this.queueAccount.setVrfSettings({
      unpermissionedVrf: true,
      authority: this.queueAuthority ?? getProgramPayer(this.program),
    });

    const queue = await OracleQueueClass.fromAccount(
      this.context,
      this.queueAccount
    );

    if (this.silent) {
      console.log(setVrfTxn);
    } else {
      this.logger.log(queue.prettyPrint());
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Queue VRF successfully set\r\n`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set queue VRF settings");
  }
}
