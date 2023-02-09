import { SwitchboardProgram } from '../../SwitchboardProgram';
import {
  TransactionInstruction,
  PublicKey,
  AccountMeta,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfLiteInitArgs {
  params: types.VrfLiteInitParamsFields;
}

export interface VrfLiteInitAccounts {
  authority: PublicKey;
  vrf: PublicKey;
  mint: PublicKey;
  escrow: PublicKey;
  queueAuthority: PublicKey;
  queue: PublicKey;
  permission: PublicKey;
  programState: PublicKey;
  payer: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
}

export const layout = borsh.struct([types.VrfLiteInitParams.layout('params')]);

export function vrfLiteInit(
  program: SwitchboardProgram,
  args: VrfLiteInitArgs,
  accounts: VrfLiteInitAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.vrf, isSigner: true, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([144, 40, 147, 33, 238, 92, 88, 46]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfLiteInitParams.toEncodable(args.params),
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
