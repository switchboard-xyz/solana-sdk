import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteInitArgs {
  params: types.QuoteInitParamsFields;
}

export interface QuoteInitAccounts {
  quote: PublicKey;
  attestationQueue: PublicKey;
  queueAuthority: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.QuoteInitParams.layout('params')]);

export function quoteInit(
  program: SwitchboardProgram,
  args: QuoteInitArgs,
  accounts: QuoteInitAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.quote, isSigner: true, isWritable: true },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([124, 251, 28, 247, 136, 141, 198, 116]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.QuoteInitParams.toEncodable(args.params),
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
