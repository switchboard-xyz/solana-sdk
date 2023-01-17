import { SwitchboardProgram } from '../../SwitchboardProgram';
import {
  TransactionInstruction,
  PublicKey,
  AccountMeta,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfPoolRequestArgs {
  params: types.VrfPoolRequestParamsFields;
}

export interface VrfPoolRequestAccounts {
  vrfPool: PublicKey;
  authority: PublicKey;
  escrow: PublicKey;
  mint: PublicKey;
  queue: PublicKey;
  queueAuthority: PublicKey;
  dataBuffer: PublicKey;
  recentBlockhashes: PublicKey;
  programState: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.VrfPoolRequestParams.layout('params'),
]);

export function vrfPoolRequest(
  program: SwitchboardProgram,
  args: VrfPoolRequestArgs,
  accounts: VrfPoolRequestAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.vrfPool, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.dataBuffer, isSigner: false, isWritable: false },
    { pubkey: accounts.recentBlockhashes, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([67, 49, 182, 255, 222, 161, 116, 238]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfPoolRequestParams.toEncodable(args.params),
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
