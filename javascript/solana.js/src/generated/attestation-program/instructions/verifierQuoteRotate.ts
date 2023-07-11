import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierQuoteRotateArgs {
  params: types.VerifierQuoteRotateParamsFields;
}

export interface VerifierQuoteRotateAccounts {
  verifier: PublicKey;
  authority: PublicKey;
  enclaveSigner: PublicKey;
  attestationQueue: PublicKey;
}

export const layout = borsh.struct([
  types.VerifierQuoteRotateParams.layout("params"),
]);

export function verifierQuoteRotate(
  program: SwitchboardProgram,
  args: VerifierQuoteRotateArgs,
  accounts: VerifierQuoteRotateAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.verifier, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.enclaveSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: true },
  ];
  const identifier = Buffer.from([52, 93, 191, 90, 182, 82, 65, 197]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VerifierQuoteRotateParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
