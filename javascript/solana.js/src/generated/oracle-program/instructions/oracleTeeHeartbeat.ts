import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleTeeHeartbeatArgs {
  params: types.OracleTeeHeartbeatParamsFields;
}

export interface OracleTeeHeartbeatAccounts {
  oracle: PublicKey;
  oracleAuthority: PublicKey;
  tokenAccount: PublicKey;
  gcOracle: PublicKey;
  oracleQueue: PublicKey;
  permission: PublicKey;
  dataBuffer: PublicKey;
  quote: PublicKey;
  programState: PublicKey;
}

export const layout = borsh.struct([
  types.OracleTeeHeartbeatParams.layout("params"),
]);

export function oracleTeeHeartbeat(
  program: SwitchboardProgram,
  args: OracleTeeHeartbeatArgs,
  accounts: OracleTeeHeartbeatAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenAccount, isSigner: false, isWritable: false },
    { pubkey: accounts.gcOracle, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.permission, isSigner: false, isWritable: false },
    { pubkey: accounts.dataBuffer, isSigner: false, isWritable: true },
    { pubkey: accounts.quote, isSigner: true, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([92, 64, 133, 138, 16, 62, 245, 251]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.OracleTeeHeartbeatParams.toEncodable(args.params),
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
