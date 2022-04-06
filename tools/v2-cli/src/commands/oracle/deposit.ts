import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { ProgramStateClass } from "../../accounts";
import { OracleClass } from "../../accounts/oracle/oracle";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class OracleDeposit extends BaseCommand {
  oracleAccount: OracleAccount;

  oracleAuthority: Keypair | undefined = undefined;

  amount: number;

  static description = "deposit tokens into an oracle's token wallet";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle to deposit funds into",
    },
    {
      name: "amount",
      required: true,
      description: "amount to deposit into oracle's token wallet",
    },
  ];

  static examples = [
    "$ sbv2 oracle:deposit 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json",
  ];

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);

    const { args } = this.parse(OracleDeposit);
    this.amount = args.amount;
    if (this.amount <= 0)
      throw new Error("amount to deposit must be greater than 0");

    this.oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
    });
  }

  async run() {
    const funderTokenAccount = await ProgramStateClass.getProgramTokenAddress(
      this.oracleAccount.program,
      this.context
    );

    const tx = await OracleClass.depositTokens(
      this.context,
      this.oracleAccount,
      this.amount,
      funderTokenAccount
    );

    if (this.silent) {
      console.log(tx);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON} Deposited ${this.amount} tokens into oracle account`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${tx}?cluster=${this.cluster}`);
      const newBalance = await OracleClass.getBalance(this.oracleAccount);
      this.logger.log(chalkString("New Oracle Token Balance", newBalance));
    }
  }

  async catch(error) {
    super.catch(error, "failed to deposit into oracle token account");
  }
}
