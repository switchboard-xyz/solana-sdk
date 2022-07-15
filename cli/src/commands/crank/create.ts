import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  prettyPrintCrank,
  verifyProgramHasPayer,
} from "@switchboard-xyz/sbv2-utils";
import {
  CrankAccount,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON } from "../../utils";

export default class QueueAddCrank extends BaseCommand {
  static description = "add a crank to an existing oracle queue";

  static alias = ["queue:add:crank"];

  static flags = {
    ...BaseCommand.flags,
    name: Flags.string({
      char: "n",
      description: "name of the crank for easier identification",
    }),
    maxRows: Flags.integer({
      char: "r",
      default: 100,
      description: "maximum number of rows a crank can support",
    }),
    queueAuthority: Flags.string({
      description: "alternative keypair to use for queue authority",
    }),
  };

  static args = [
    {
      name: "queueKey",
      description: "public key of the oracle queue to create a crank on",
    },
  ];

  static examples = [
    "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1",
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../payer-keypair.json -a ../authority-keypair.json",
  ];

  async run() {
    const { args, flags } = await this.parse(QueueAddCrank);
    verifyProgramHasPayer(this.program);
    const payerKeypair = programWallet(this.program);

    if (flags.maxRows < 0) {
      throw new Error("max rows must be a positive number");
    }

    const maxRows = flags.maxRows;

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: new PublicKey(args.queueKey),
    });
    const queue = await queueAccount.loadData();

    const queueAuthority = await this.loadAuthority(
      flags.queueAuthority,
      queue.authority
    );

    const crankKeypair = anchor.web3.Keypair.generate();
    const bufferKeypair = anchor.web3.Keypair.generate();
    const crankSize = this.program.account.crankAccountData.size;
    const bufferSize = maxRows * 40 + 8;
    const signature = await this.program.methods
      .crankInit({
        name: (flags.name ? Buffer.from(flags.name) : Buffer.from("")).slice(
          0,
          32
        ),
        metadata: Buffer.from("").slice(0, 64),
        crankSize: maxRows,
      })
      .accounts({
        crank: crankKeypair.publicKey,
        queue: queueAccount.publicKey,
        buffer: bufferKeypair.publicKey,
        systemProgram: SystemProgram.programId,
        payer: payerKeypair.publicKey,
      })
      .signers([crankKeypair, bufferKeypair])
      .preInstructions([
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: payerKeypair.publicKey,
          newAccountPubkey: bufferKeypair.publicKey,
          space: bufferSize,
          lamports:
            await this.program.provider.connection.getMinimumBalanceForRentExemption(
              bufferSize
            ),
          programId: this.program.programId,
        }),
      ])
      .rpc();

    const crankAccount = new CrankAccount({
      program: this.program,
      publicKey: crankKeypair.publicKey,
    });

    if (this.silent) {
      console.log(crankKeypair.publicKey.toString());
    } else {
      this.logger.log(await prettyPrintCrank(crankAccount));
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Crank created successfully\r\n`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to create crank");
  }
}
