import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionSetConfigArgs {
  params: types.FunctionSetConfigParamsFields;
}

export interface FunctionSetConfigAccounts {
  function: PublicKey;
  authority: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionSetConfigParams.layout("params"),
]);

export function functionSetConfig(
  program: SwitchboardProgram,
  args: FunctionSetConfigArgs,
  accounts: FunctionSetConfigAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([232, 132, 21, 251, 253, 189, 96, 94]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionSetConfigParams.toEncodable(args.params),
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
