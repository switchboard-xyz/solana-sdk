import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationPermissionSetArgs {
  params: types.AttestationPermissionSetParamsFields;
}

export interface AttestationPermissionSetAccounts {
  permission: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  node: PublicKey;
}

export const layout = borsh.struct([
  types.AttestationPermissionSetParams.layout("params"),
]);

export function attestationPermissionSet(
  program: SwitchboardProgram,
  args: AttestationPermissionSetArgs,
  accounts: AttestationPermissionSetAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([56, 253, 255, 201, 100, 153, 10, 76]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AttestationPermissionSetParams.toEncodable(args.params),
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
