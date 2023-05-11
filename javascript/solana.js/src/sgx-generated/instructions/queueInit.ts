import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QueueInitArgs {
  params: types.QueueInitParamsFields;
}

export interface QueueInitAccounts {
  queue: PublicKey;
  authority: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.QueueInitParams.layout('params')]);

export function queueInit(
  program: SwitchboardProgram,
  args: QueueInitArgs,
  accounts: QueueInitAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.queue, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([144, 18, 99, 145, 133, 27, 207, 13]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.QueueInitParams.toEncodable(args.params),
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
