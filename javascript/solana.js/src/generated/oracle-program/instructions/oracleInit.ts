import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleInitArgs {
  params: types.OracleInitParamsFields;
}

export interface OracleInitAccounts {
  oracle: PublicKey;
  oracleAuthority: PublicKey;
  wallet: PublicKey;
  programState: PublicKey;
  queue: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.OracleInitParams.layout("params")]);

export function oracleInit(
  program: SwitchboardProgram,
  args: OracleInitArgs,
  accounts: OracleInitAccounts,
  programId: PublicKey = program.oracleProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.wallet, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([21, 158, 66, 65, 60, 221, 148, 61]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.OracleInitParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
