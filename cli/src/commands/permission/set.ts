import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import {
  PermissionAccount,
  SwitchboardPermission,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import {
  CHECK_ICON,
  loadSwitchboardAccount,
  verifyProgramHasPayer,
} from "../../utils";

export default class PermissionSet extends BaseCommand {
  static description = "permit a grantee to use a granters resources";

  static flags = {
    ...BaseCommand.flags,
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that is the granters authority",
    }),
    disable: Flags.boolean({
      description: "disable permissions",
    }),
  };

  static args = [
    {
      name: "permissionKey",
      description: "public key of the permission account",
    },
  ];

  async run() {
    const { args, flags } = await this.parse(PermissionSet);
    verifyProgramHasPayer(this.program);

    const permissionAccount = new PermissionAccount({
      program: this.program,
      publicKey: new PublicKey(args.permissionKey),
    });
    const permission = await permissionAccount.loadData();

    // check and load granters account type
    const [granterAccountType, granter] = await loadSwitchboardAccount(
      this.program,
      permission.granter
    );
    let authorityKey: PublicKey;
    switch (granterAccountType) {
      case "OracleQueueAccountData": {
        const data = await granter.loadData();
        authorityKey = data.authority;
        break;
      }

      default: {
        throw new Error(
          `Granter should be a OracleQueueAccount, received ${granterAccountType}`
        );
      }
    }

    const authority = await this.loadAuthority(flags.authority, authorityKey);

    // check and load grantees account type, and assign permissions based on type
    let assignedPermission: SwitchboardPermission;
    const [granteeAccountType, grantee] = await loadSwitchboardAccount(
      this.program,
      permission.grantee
    );
    switch (granteeAccountType) {
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
          `Grantee must be an AggregatorAccount, OracleAccount, or VrfAccount, received ${granteeAccountType}`
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
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set permissions");
  }
}
