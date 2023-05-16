import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationPermissionInitArgs {
  params: types.AttestationPermissionInitParamsFields;
}

export interface AttestationPermissionInitAccounts {
  permission: PublicKey;
  authority: PublicKey;
  queue: PublicKey;
  node: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([
  types.AttestationPermissionInitParams.layout('params'),
]);

export function attestationPermissionInit(
  program: SwitchboardProgram,
  args: AttestationPermissionInitArgs,
  accounts: AttestationPermissionInitAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([219, 80, 131, 73, 164, 190, 142, 215]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AttestationPermissionInitParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({
    keys,
    programId: program.attestationProgramId,
    data,
  });
  return ix;
}
