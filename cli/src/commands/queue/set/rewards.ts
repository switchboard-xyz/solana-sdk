import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2/src";
import * as chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class QueueSetRewards extends BaseCommand {
  static description = "set an oracle queue's rewards";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the authority for oracle queue",
    }),
  };

  static args = [
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue",
    },
    {
      name: "rewards",
      required: true,
      parse: (reward: string) => new anchor.BN(reward),
      description: "token rewards for each assigned oracle per open round call",
    },
  ];

  static examples = [
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1",
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../payer-keypair.json -a ../authority-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(QueueSetRewards);
    verifyProgramHasPayer(this.program);

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });
    const queue = await queueAccount.loadData();

    const authority = await this.loadAuthority(
      flags.authority,
      queue.authority
    );

    const txn = await queueAccount.setRewards({
      rewards: args.rewards,
      authority,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Queue rewards set successfully\r\n`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set queue rewards");
  }
}
