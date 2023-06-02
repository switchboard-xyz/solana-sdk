import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteVerifyArgs {
  params: types.QuoteVerifyParamsFields;
}

export interface QuoteVerifyAccounts {
  quote: PublicKey;
  verifier: PublicKey;
  attestationQueue: PublicKey;
}

export const layout = borsh.struct([types.QuoteVerifyParams.layout("params")]);

export function quoteVerify(
  program: SwitchboardProgram,
  args: QuoteVerifyArgs,
  accounts: QuoteVerifyAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.quote, isSigner: false, isWritable: true },
    { pubkey: accounts.verifier, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([158, 203, 69, 10, 212, 218, 45, 184]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.QuoteVerifyParams.toEncodable(args.params),
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
