import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionTriggerArgs {
  params: types.FunctionTriggerParamsFields;
}

export interface FunctionTriggerAccounts {
  function: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionTriggerParams.layout("params"),
]);

export function functionTrigger(
  program: SwitchboardProgram,
  args: FunctionTriggerArgs,
  accounts: FunctionTriggerAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([45, 224, 218, 184, 248, 83, 239, 200]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionTriggerParams.toEncodable(args.params),
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
