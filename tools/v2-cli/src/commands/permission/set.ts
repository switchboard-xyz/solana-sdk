import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  PermissionAccount,
  SwitchboardPermission,
} from "@switchboard-xyz/switchboard-v2";
import { loadSwitchboardAccount } from "@switchboard-xyz/v2-utils-ts";
import * as chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class PermissionSet extends BaseCommand {
  static description = "permit a grantee to use a granters resources";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the granters authority",
    }),
    disable: flags.boolean({
      description: "disable permissions",
    }),
  };

  static args = [
    {
      name: "permissionKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the permission account",
    },
  ];

  async run() {
    const { args, flags } = this.parse(PermissionSet);
    verifyProgramHasPayer(this.program);

    const permissionAccount = new PermissionAccount({
      program: this.program,
      publicKey: args.permissionKey,
    });
    const permission = await permissionAccount.loadData();

    // check and load granters account type
    const [granteeAccountType, grantee] = await loadSwitchboardAccount(
      this.program,
      permission.grantee
    );
    let authorityKey: PublicKey;
    switch (granteeAccountType) {
      case "OracleQueueAccountData":
        const data = await grantee.loadData();
        authorityKey = data.authority;
        break;
      default:
        throw new Error("Grantee should be a OracleQueueAccount");
    }
    const authority = await this.loadAuthority(flags.authority, authorityKey);

    // check and load grantees account type, and assign permissions based on type
    let assignedPermission: SwitchboardPermission;
    const [granterAccountType, granter] = await loadSwitchboardAccount(
      this.program,
      permission.granter
    );
    switch (granterAccountType) {
      case "OracleAccountData":
        assignedPermission = SwitchboardPermission.PERMIT_ORACLE_HEARTBEAT;
        break;
      case "AggregatorAccountData":
        assignedPermission = SwitchboardPermission.PERMIT_ORACLE_QUEUE_USAGE;
        break;
      case "VrfAccountData":
        assignedPermission = SwitchboardPermission.PERMIT_VRF_REQUESTS;
        break;
      default:
        throw new Error(
          "Granter must be an AggregatorAccount, OracleAccount, or VrfAccount"
        );
    }

    // set the permission
    const txn = await permissionAccount.set({
      authority,
      enable: !flags.disable,
      permission: assignedPermission,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Permissions set successfully`)}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to set permissions");
  }
}
