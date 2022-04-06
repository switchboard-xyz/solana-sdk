import { PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import { OracleClass } from "../../../accounts/oracle/oracle";
import BaseCommand from "../../../BaseCommand";

export default class OraclePermissionPrint extends BaseCommand {
  static description =
    "Print the permission account associated with a Switchboard oracle account";

  static aliases = ["oracle:permission:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description:
        "public key of the oracle account to fetch permission account and deserialize",
    },
  ];

  static examples = [
    "$ sbv2 oracle:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args } = this.parse(OraclePermissionPrint);

    const oracle = await OracleClass.fromPublicKey(
      this.context,
      this.program,
      args.oracleKey
    );

    this.logger.debug(
      `${chalk.yellow("oracle:")} ${chalk.blue(oracle.publicKey.toString())}`
    );

    if (!oracle.permissionAccount) {
      throw new Error(
        `failed to find permission account for oracle ${oracle.publicKey}`
      );
    }

    this.logger.log(oracle.permissionAccount.prettyPrint());
  }

  async catch(error) {
    super.catch(error, "failed to print oracle permission account");
  }
}
