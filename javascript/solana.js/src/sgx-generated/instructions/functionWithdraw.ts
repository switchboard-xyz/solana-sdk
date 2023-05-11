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
  params: types.FunctionVerifyParamsFields;
}

export interface FunctionWithdrawAccounts {
  function: PublicKey;
  fnSigner: PublicKey;
  fnQuote: PublicKey;
  verifierQuote: PublicKey;
  verifierQueue: PublicKey;
  escrow: PublicKey;
  receiver: PublicKey;
  permission: PublicKey;
  state: PublicKey;
  tokenProgram: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionVerifyParams.layout('params'),
]);

export function functionWithdraw(
  program: SwitchboardProgram,
  args: FunctionWithdrawArgs,
  accounts: FunctionWithdrawAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.fnSigner, isSigner: true, isWritable: false },
    { pubkey: accounts.fnQuote, isSigner: false, isWritable: true },
    { pubkey: accounts.verifierQuote, isSigner: true, isWritable: false },
    { pubkey: accounts.verifierQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.permission, isSigner: false, isWritable: false },
    { pubkey: accounts.state, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([6, 182, 241, 39, 40, 111, 65, 195]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionVerifyParams.toEncodable(args.params),
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
