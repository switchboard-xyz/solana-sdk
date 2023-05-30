import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionVerifyArgs {
  params: types.FunctionVerifyParamsFields;
}

export interface FunctionVerifyAccounts {
  function: PublicKey;
  fnSigner: PublicKey;
  fnQuote: PublicKey;
  verifierQuote: PublicKey;
  attestationQueue: PublicKey;
  escrow: PublicKey;
  receiver: PublicKey;
  verifierPermission: PublicKey;
  fnPermission: PublicKey;
  state: PublicKey;
  tokenProgram: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionVerifyParams.layout('params'),
]);

export function functionVerify(
  program: SwitchboardProgram,
  args: FunctionVerifyArgs,
  accounts: FunctionVerifyAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.fnSigner, isSigner: true, isWritable: false },
    { pubkey: accounts.fnQuote, isSigner: false, isWritable: false },
    { pubkey: accounts.verifierQuote, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.verifierPermission, isSigner: false, isWritable: false },
    { pubkey: accounts.fnPermission, isSigner: false, isWritable: false },
    { pubkey: accounts.state, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([210, 108, 154, 138, 198, 14, 53, 191]);
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
    programId: program.attestationProgramId,
    data,
  });
  return ix;
}
