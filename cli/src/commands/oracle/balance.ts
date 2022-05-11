import { PublicKey } from "@solana/web3.js";
import { OracleAccount } from "@switchboard-xyz/switchboard-v2";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";

export default class OracleBalance extends BaseCommand {
  static description = "check an oracles token balance";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle to check token balance",
    },
  ];

  static examples = [
    "$ sbv2 oracle:balance 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args } = this.parse(OracleBalance);

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
    });
    const oracle = await oracleAccount.loadData();

    const balance =
      await this.program.provider.connection.getTokenAccountBalance(
        oracle.tokenAccount
      );

    if (this.silent) {
      console.log(balance.value.amount);
    } else {
      this.logger.log(
        chalkString(
          "Oracle Balance:",
          `${balance.value.uiAmountString} (${balance.value.amount})`,
          12
        )
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to get oracle token balance");
  }
}
