import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QueueRemoveMrEnclaveArgs {
  params: types.QueueRemoveMrEnclaveParamsFields;
}

export interface QueueRemoveMrEnclaveAccounts {
  queue: PublicKey;
  authority: PublicKey;
}

export const layout = borsh.struct([
  types.QueueRemoveMrEnclaveParams.layout('params'),
]);

export function queueRemoveMrEnclave(
  program: SwitchboardProgram,
  args: QueueRemoveMrEnclaveArgs,
  accounts: QueueRemoveMrEnclaveAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([3, 64, 135, 33, 190, 133, 68, 252]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.QueueRemoveMrEnclaveParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({
    keys,
    programId: program.sgxProgramId,
    data,
  });
  return ix;
}
