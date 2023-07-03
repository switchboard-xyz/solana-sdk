import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionExtendLookupArgs {
  params: types.FunctionExtendLookupParamsFields;
}

export interface FunctionExtendLookupAccounts {
  function: PublicKey;
  payer: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  addressLookupTable: PublicKey;
  addressLookupProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionExtendLookupParams.layout("params"),
]);

export function functionExtendLookup(
  program: SwitchboardProgram,
  args: FunctionExtendLookupArgs,
  accounts: FunctionExtendLookupAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.addressLookupTable, isSigner: false, isWritable: true },
    {
      pubkey: accounts.addressLookupProgram,
      isSigner: false,
      isWritable: false,
    },
  ];
  const identifier = Buffer.from([76, 22, 195, 201, 117, 67, 51, 152]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionExtendLookupParams.toEncodable(args.params),
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
