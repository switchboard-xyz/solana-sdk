import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineDisableArgs {
  params: types.FunctionRoutineDisableParamsFields;
}

export interface FunctionRoutineDisableAccounts {
  routine: PublicKey;
  function: PublicKey;
  attestationQueue: PublicKey;
  authority: PublicKey;
  functionAuthority: PublicKey;
  queueAuthority: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionRoutineDisableParams.layout("params"),
]);

export function functionRoutineDisable(
  program: SwitchboardProgram,
  args: FunctionRoutineDisableArgs,
  accounts: FunctionRoutineDisableAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.routine, isSigner: false, isWritable: true },
    { pubkey: accounts.function, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.functionAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.queueAuthority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([8, 89, 112, 206, 251, 129, 150, 18]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionRoutineDisableParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
