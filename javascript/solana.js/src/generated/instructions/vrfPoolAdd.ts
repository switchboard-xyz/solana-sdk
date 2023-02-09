import { SwitchboardProgram } from '../../SwitchboardProgram';
import {
  TransactionInstruction,
  PublicKey,
  AccountMeta,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfPoolAddArgs {
  params: types.VrfPoolAddParamsFields;
}

export interface VrfPoolAddAccounts {
  authority: PublicKey;
  vrfPool: PublicKey;
  vrfLite: PublicKey;
  queue: PublicKey;
  permission: PublicKey;
}

export const layout = borsh.struct([types.VrfPoolAddParams.layout('params')]);

export function vrfPoolAdd(
  program: SwitchboardProgram,
  args: VrfPoolAddArgs,
  accounts: VrfPoolAddAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.vrfPool, isSigner: false, isWritable: true },
    { pubkey: accounts.vrfLite, isSigner: false, isWritable: true },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.permission, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([234, 143, 61, 230, 212, 57, 8, 234]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfPoolAddParams.toEncodable(args.params),
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
