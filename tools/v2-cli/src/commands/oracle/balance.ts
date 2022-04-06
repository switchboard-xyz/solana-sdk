import { PublicKey } from "@solana/web3.js";
import { OracleAccount } from "@switchboard-xyz/switchboard-v2";
import { OracleClass } from "../../accounts/oracle/oracle";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";

export default class OracleBalance extends BaseCommand {
  oracleAccount: OracleAccount;

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

  async init() {
    await super.init();
    const { args } = this.parse(OracleBalance);

    this.oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
    });
  }

  async run() {
    const oracle = await OracleClass.fromAccount(
      this.context,
      this.oracleAccount
    );

    if (this.silent) {
      console.log(oracle.balance.toString());
    } else {
      this.logger.log(chalkString("Oracle Balance:", oracle.balance, 12));
    }
  }

  async catch(error) {
    super.catch(error, "failed to get oracle token balance");
  }
}
