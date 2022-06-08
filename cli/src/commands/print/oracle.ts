import { PublicKey } from "@solana/web3.js";
import { prettyPrintOracle } from "@switchboard-xyz/sbv2-utils";
import { OracleAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class OraclePrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard oracle account";

  static aliases = ["oracle:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      description: "public key of the oracle account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 oracle:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args, flags } = await this.parse(OraclePrint);

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: new PublicKey(args.oracleKey),
    });
    const data = await oracleAccount.loadData();

    this.logger.log(await prettyPrintOracle(oracleAccount, data, true));
  }

  async catch(error) {
    super.catch(error, "failed to print oracle account");
  }
}
