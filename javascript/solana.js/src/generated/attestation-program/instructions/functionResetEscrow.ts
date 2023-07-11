import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionResetEscrowArgs {
  params: types.FunctionResetEscrowParamsFields;
}

export interface FunctionResetEscrowAccounts {
  function: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  mint: PublicKey;
  escrowWallet: PublicKey;
  defaultWallet: PublicKey;
  tokenWallet: PublicKey;
  payer: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionResetEscrowParams.layout("params"),
]);

export function functionResetEscrow(
  program: SwitchboardProgram,
  args: FunctionResetEscrowArgs,
  accounts: FunctionResetEscrowAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.defaultWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([18, 242, 138, 38, 112, 252, 39, 228]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionResetEscrowParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
