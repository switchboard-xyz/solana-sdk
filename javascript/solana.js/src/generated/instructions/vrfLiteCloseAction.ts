import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
  PublicKey,
  AccountMeta,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfLiteCloseActionArgs {
  params: types.VrfLiteCloseParamsFields;
}

export interface VrfLiteCloseActionAccounts {
  authority: PublicKey;
  vrfLite: PublicKey;
  permission: PublicKey;
  queue: PublicKey;
  queueAuthority: PublicKey;
  programState: PublicKey;
  escrow: PublicKey;
  solDest: PublicKey;
  escrowDest: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([types.VrfLiteCloseParams.layout("params")]);

export function vrfLiteCloseAction(
  program: SwitchboardProgram,
  args: VrfLiteCloseActionArgs,
  accounts: VrfLiteCloseActionAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.vrfLite, isSigner: false, isWritable: true },
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.solDest, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowDest, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([200, 82, 160, 32, 59, 80, 50, 137]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfLiteCloseParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({
    keys,
    programId: program.programId,
    data,
  });
  return ix;
}
