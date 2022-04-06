import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { OracleClass } from "../../accounts/oracle/oracle";
import { ProgramStateClass } from "../../accounts/state/state";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";
import {
  CHECK_ICON,
  getProgramPayer,
  loadKeypair,
  verifyProgramHasPayer,
} from "../../utils";

export default class OracleWithdraw extends BaseCommand {
  oracleAccount: OracleAccount;

  oracleAuthority: Keypair;

  amount: number;

  withdrawAddress: PublicKey;

  force?: boolean;

  static description = "withdraw tokens from an oracle's token wallet";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      char: "f",
      description:
        "skip minStake balance check. your oracle may be removed from the queue",
    }),
    withdrawAccount: flags.string({
      char: "w",
      required: false,
      description:
        "optional solana pubkey or keypair filesystem path to withdraw funds to. default destination is oracle authority's token wallet",
    }),
    authority: flags.string({
      char: "a",
      description:
        "keypair delegated as the authority for managing the oracle account",
    }),
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle to withdraw from",
    },
    {
      name: "amount",
      required: true,
      description: "amount to withdraw from oracle's token wallet",
    },
  ];

  static examples = [
    "$ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../oracle-keypair.json",
    "$ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json --authority ../oracle-keypair.json -w ByJs8E29jxvqf2KFLwfyiE2gUh5fivaS7aShcRMAsnzg",
  ];

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);

    const { args, flags } = this.parse(OracleWithdraw);
    this.force = flags.force;
    this.amount = args.amount;
    if (this.amount <= 0)
      throw new Error("amount to withdraw must be greater than 0");

    this.oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
    });

    this.oracleAuthority = flags.authority
      ? await loadKeypair(flags.authority)
      : getProgramPayer(this.program);

    let withdrawAccount: PublicKey;
    if (flags.withdrawAccount) {
      try {
        withdrawAccount = new PublicKey(flags.withdrawAccount);
      } catch {
        try {
          const withdrawKeypair = await loadKeypair(flags.withdrawAccount);
          withdrawAccount = withdrawKeypair.publicKey;
        } catch {
          throw new Error(
            `failed to parse withdrawAccount flag ${flags.withdrawAccount}`
          );
        }
      }
    } else {
      withdrawAccount = this.program.provider.wallet.publicKey;
    }

    this.withdrawAddress = await ProgramStateClass.getAssociatedTokenAddress(
      this.program,
      withdrawAccount,
      this.context
    );
  }

  async run() {
    const withdrawTxn = await OracleClass.withdrawTokens(
      this.context,
      this.oracleAccount,
      this.amount,
      this.withdrawAddress,
      this.oracleAuthority,
      this.force
    );

    // check final balance
    const newBalance = await OracleClass.getBalance(this.oracleAccount);

    if (this.silent) {
      console.log(withdrawTxn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Withdrew ${this.amount} tokens from oracle account`
        )}`
      );
      this.logger.log(
        `https://solscan.io/tx/${withdrawTxn}?cluster=${this.cluster}`
      );
      this.logger.log(chalkString("New Oracle Token Balance", newBalance));
    }
  }

  async catch(error) {
    super.catch(error, "failed to withdraw tokens from oracle token account");
  }
}
