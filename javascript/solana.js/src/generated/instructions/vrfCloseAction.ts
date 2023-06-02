import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfCloseActionArgs {
  params: types.VrfCloseParamsFields;
}

export interface VrfCloseActionAccounts {
  authority: PublicKey;
  vrf: PublicKey;
  permission: PublicKey;
  oracleQueue: PublicKey;
  queueAuthority: PublicKey;
  programState: PublicKey;
  escrow: PublicKey;
  solDest: PublicKey;
  escrowDest: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([types.VrfCloseParams.layout("params")]);

export function vrfCloseAction(
  program: SwitchboardProgram,
  args: VrfCloseActionArgs,
  accounts: VrfCloseActionAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.vrf, isSigner: false, isWritable: true },
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.solDest, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowDest, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([97, 172, 124, 16, 175, 10, 246, 147]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfCloseParams.toEncodable(args.params),
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
