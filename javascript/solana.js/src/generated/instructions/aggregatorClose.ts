import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorCloseArgs {
  params: types.AggregatorCloseParamsFields;
}

export interface AggregatorCloseAccounts {
  authority: PublicKey;
  aggregator: PublicKey;
  permission: PublicKey;
  lease: PublicKey;
  escrow: PublicKey;
  oracleQueue: PublicKey;
  queueAuthority: PublicKey;
  programState: PublicKey;
  solDest: PublicKey;
  escrowDest: PublicKey;
  tokenProgram: PublicKey;
  /** Optional accounts */
  crank: PublicKey;
  dataBuffer: PublicKey;
  slidingWindow: PublicKey;
}

export const layout = borsh.struct([
  types.AggregatorCloseParams.layout('params'),
]);

export function aggregatorClose(
  program: SwitchboardProgram,
  args: AggregatorCloseArgs,
  accounts: AggregatorCloseAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.lease, isSigner: false, isWritable: true },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.solDest, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowDest, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.crank, isSigner: false, isWritable: true },
    { pubkey: accounts.dataBuffer, isSigner: false, isWritable: true },
    { pubkey: accounts.slidingWindow, isSigner: false, isWritable: true },
  ];
  const identifier = Buffer.from([77, 29, 85, 88, 224, 181, 157, 69]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AggregatorCloseParams.toEncodable(args.params),
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
