import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorSetHistoryBufferArgs {
  params: types.AggregatorSetHistoryBufferParamsFields;
}

export interface AggregatorSetHistoryBufferAccounts {
  aggregator: PublicKey;
  authority: PublicKey;
  buffer: PublicKey;
}

export const layout = borsh.struct([
  types.AggregatorSetHistoryBufferParams.layout("params"),
]);

export function aggregatorSetHistoryBuffer(
  program: SwitchboardProgram,
  args: AggregatorSetHistoryBufferArgs,
  accounts: AggregatorSetHistoryBufferAccounts,
  programId: PublicKey = program.oracleProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.buffer, isSigner: false, isWritable: true },
  ];
  const identifier = Buffer.from([88, 49, 214, 242, 229, 44, 171, 52]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AggregatorSetHistoryBufferParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
