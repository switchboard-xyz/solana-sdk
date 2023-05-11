import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PermissionSetArgs {
  params: types.PermissionSetParamsFields;
}

export interface PermissionSetAccounts {
  permission: PublicKey;
  authority: PublicKey;
  queue: PublicKey;
  node: PublicKey;
}

export const layout = borsh.struct([
  types.PermissionSetParams.layout('params'),
]);

export function permissionSet(
  program: SwitchboardProgram,
  args: PermissionSetArgs,
  accounts: PermissionSetAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([211, 122, 185, 120, 129, 182, 55, 103]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.PermissionSetParams.toEncodable(args.params),
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
