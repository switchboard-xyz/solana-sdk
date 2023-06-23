import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionSetPermissionsArgs {
  params: types.FunctionSetPermissionsParamsFields;
}

export interface FunctionSetPermissionsAccounts {
  function: PublicKey;
  attestationQueue: PublicKey;
  queueAuthority: PublicKey;
  authority: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionSetPermissionsParams.layout("params"),
]);

export function functionSetPermissions(
  program: SwitchboardProgram,
  args: FunctionSetPermissionsArgs,
  accounts: FunctionSetPermissionsAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.queueAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([90, 80, 156, 65, 119, 149, 19, 104]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionSetPermissionsParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({
    keys,
    programId: program.attestationProgramId,
    data,
  });
  return ix;
}
