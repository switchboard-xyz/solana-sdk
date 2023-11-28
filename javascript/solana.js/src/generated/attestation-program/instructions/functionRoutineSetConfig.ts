import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineSetConfigArgs {
  params: types.FunctionRoutineSetConfigParamsFields;
}

export interface FunctionRoutineSetConfigAccounts {
  routine: PublicKey;
  authority: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionRoutineSetConfigParams.layout("params"),
]);

export function functionRoutineSetConfig(
  program: SwitchboardProgram,
  args: FunctionRoutineSetConfigArgs,
  accounts: FunctionRoutineSetConfigAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.routine, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([171, 170, 164, 53, 255, 71, 245, 79]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionRoutineSetConfigParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
