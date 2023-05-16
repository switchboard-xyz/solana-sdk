import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionWithdrawArgs {
  params: types.FunctionWithdrawParamsFields;
}

export interface FunctionWithdrawAccounts {
  function: PublicKey;
  attestationQueue: PublicKey;
  authority: PublicKey;
  state: PublicKey;
  escrow: PublicKey;
  receiver: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionWithdrawParams.layout('params'),
]);

export function functionWithdraw(
  program: SwitchboardProgram,
  args: FunctionWithdrawArgs,
  accounts: FunctionWithdrawAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.state, isSigner: false, isWritable: true },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([6, 182, 241, 39, 40, 111, 65, 195]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionWithdrawParams.toEncodable(args.params),
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
