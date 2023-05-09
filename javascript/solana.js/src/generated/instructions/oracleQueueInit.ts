import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleQueueInitArgs {
  params: types.OracleQueueInitParamsFields;
}

export interface OracleQueueInitAccounts {
  oracleQueue: PublicKey;
  authority: PublicKey;
  buffer: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
  mint: PublicKey;
}

export const layout = borsh.struct([
  types.OracleQueueInitParams.layout('params'),
]);

export function oracleQueueInit(
  program: SwitchboardProgram,
  args: OracleQueueInitArgs,
  accounts: OracleQueueInitAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.oracleQueue, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.buffer, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([250, 226, 231, 111, 158, 164, 27, 136]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.OracleQueueInitParams.toEncodable(args.params),
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
