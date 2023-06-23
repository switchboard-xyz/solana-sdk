import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteRotateArgs {
  params: types.QuoteRotateParamsFields;
}

export interface QuoteRotateAccounts {
  quote: PublicKey;
  authority: PublicKey;
  enclaveSigner: PublicKey;
  attestationQueue: PublicKey;
}

export const layout = borsh.struct([types.QuoteRotateParams.layout("params")]);

export function quoteRotate(
  program: SwitchboardProgram,
  args: QuoteRotateArgs,
  accounts: QuoteRotateAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.quote, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.enclaveSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: true },
  ];
  const identifier = Buffer.from([153, 94, 246, 7, 7, 124, 62, 7]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.QuoteRotateParams.toEncodable(args.params),
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
