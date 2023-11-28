import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfPoolInitArgs {
  params: types.VrfPoolInitParamsFields;
}

export interface VrfPoolInitAccounts {
  authority: PublicKey;
  vrfPool: PublicKey;
  queue: PublicKey;
  mint: PublicKey;
  escrow: PublicKey;
  programState: PublicKey;
  payer: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
}

export const layout = borsh.struct([types.VrfPoolInitParams.layout("params")]);

export function vrfPoolInit(
  program: SwitchboardProgram,
  args: VrfPoolInitArgs,
  accounts: VrfPoolInitAccounts,
  programId: PublicKey = program.oracleProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.vrfPool, isSigner: false, isWritable: true },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([213, 10, 27, 81, 131, 152, 33, 195]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfPoolInitParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
