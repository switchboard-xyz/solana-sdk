import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionSetAuthorityArgs {
  params: types.FunctionSetAuthorityParamsFields;
}

export interface FunctionSetAuthorityAccounts {
  function: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  escrowWallet: PublicKey;
  escrowAuthority: PublicKey;
  newAuthority: PublicKey;
  walletAuthority: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionSetAuthorityParams.layout("params"),
]);

export function functionSetAuthority(
  program: SwitchboardProgram,
  args: FunctionSetAuthorityArgs,
  accounts: FunctionSetAuthorityAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.escrowAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.newAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.walletAuthority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([78, 25, 50, 98, 179, 86, 25, 125]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionSetAuthorityParams.toEncodable(args.params),
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
