import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfLiteRequestRandomnessArgs {
  params: types.VrfLiteRequestRandomnessParamsFields;
}

export interface VrfLiteRequestRandomnessAccounts {
  authority: PublicKey;
  vrfLite: PublicKey;
  queue: PublicKey;
  queueAuthority: PublicKey;
  dataBuffer: PublicKey;
  permission: PublicKey;
  escrow: PublicKey;
  recentBlockhashes: PublicKey;
  programState: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.VrfLiteRequestRandomnessParams.layout("params"),
]);

export function vrfLiteRequestRandomness(
  program: SwitchboardProgram,
  args: VrfLiteRequestRandomnessArgs,
  accounts: VrfLiteRequestRandomnessAccounts,
  programId: PublicKey = program.oracleProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.vrfLite, isSigner: false, isWritable: true },
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.dataBuffer, isSigner: false, isWritable: false },
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.recentBlockhashes, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([221, 11, 167, 47, 80, 107, 18, 71]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfLiteRequestRandomnessParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
