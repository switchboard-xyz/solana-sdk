import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierQuoteVerifyArgs {
  params: types.VerifierQuoteVerifyParamsFields;
}

export interface VerifierQuoteVerifyAccounts {
  quote: PublicKey;
  verifier: PublicKey;
  enclaveSigner: PublicKey;
  attestationQueue: PublicKey;
}

export const layout = borsh.struct([
  types.VerifierQuoteVerifyParams.layout("params"),
]);

export function verifierQuoteVerify(
  program: SwitchboardProgram,
  args: VerifierQuoteVerifyArgs,
  accounts: VerifierQuoteVerifyAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.quote, isSigner: false, isWritable: true },
    { pubkey: accounts.verifier, isSigner: false, isWritable: false },
    { pubkey: accounts.enclaveSigner, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([73, 38, 235, 197, 78, 209, 141, 253]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VerifierQuoteVerifyParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
