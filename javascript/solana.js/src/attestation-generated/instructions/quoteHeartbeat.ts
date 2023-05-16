import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteHeartbeatArgs {
  params: types.QuoteHeartbeatParamsFields;
}

export interface QuoteHeartbeatAccounts {
  quote: PublicKey;
  attestationQueue: PublicKey;
  queueAuthority: PublicKey;
  gcNode: PublicKey;
  permission: PublicKey;
}

export const layout = borsh.struct([
  types.QuoteHeartbeatParams.layout('params'),
]);

export function quoteHeartbeat(
  program: SwitchboardProgram,
  args: QuoteHeartbeatArgs,
  accounts: QuoteHeartbeatAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.quote, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.gcNode, isSigner: false, isWritable: false },
    { pubkey: accounts.permission, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([202, 24, 19, 240, 75, 39, 154, 110]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.QuoteHeartbeatParams.toEncodable(args.params),
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
