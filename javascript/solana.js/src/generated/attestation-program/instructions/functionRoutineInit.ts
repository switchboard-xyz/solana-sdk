import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineInitArgs {
  params: types.FunctionRoutineInitParamsFields;
}

export interface FunctionRoutineInitAccounts {
  routine: PublicKey;
  authority: PublicKey;
  function: PublicKey;
  functionAuthority: PublicKey;
  escrowWallet: PublicKey;
  escrowWalletAuthority: PublicKey;
  escrowTokenWallet: PublicKey;
  mint: PublicKey;
  attestationQueue: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionRoutineInitParams.layout("params"),
]);

/**
 * Routine Actions
 * Initializes a Function routine account
 *
 * # Errors
 *
 * * `MissingSbWalletAuthoritySigner` - If the provided SbWallet authority does not match the routine
 * authority and the wallet authority did not sign the transaction.
 */
export function functionRoutineInit(
  program: SwitchboardProgram,
  args: FunctionRoutineInitArgs,
  accounts: FunctionRoutineInitAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.routine, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.functionAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.escrowWallet, isSigner: false, isWritable: true },
    {
      pubkey: accounts.escrowWalletAuthority,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.escrowTokenWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ];
  const identifier = Buffer.from([70, 25, 243, 23, 253, 78, 27, 169]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionRoutineInitParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
