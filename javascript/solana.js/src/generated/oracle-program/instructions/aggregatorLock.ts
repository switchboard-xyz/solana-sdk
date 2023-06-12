import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorLockArgs {
  params: types.AggregatorLockParamsFields;
}

export interface AggregatorLockAccounts {
  aggregator: PublicKey;
  authority: PublicKey;
}

export const layout = borsh.struct([
  types.AggregatorLockParams.layout("params"),
]);

export function aggregatorLock(
  program: SwitchboardProgram,
  args: AggregatorLockArgs,
  accounts: AggregatorLockAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([228, 238, 67, 53, 69, 176, 185, 227]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AggregatorLockParams.toEncodable(args.params),
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
