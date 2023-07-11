import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierHeartbeatArgs {
  params: types.VerifierHeartbeatParamsFields;
}

export interface VerifierHeartbeatAccounts {
  verifier: PublicKey;
  verifierSigner: PublicKey;
  attestationQueue: PublicKey;
  queueAuthority: PublicKey;
  gcNode: PublicKey;
  permission: PublicKey;
}

export const layout = borsh.struct([
  types.VerifierHeartbeatParams.layout("params"),
]);

export function verifierHeartbeat(
  program: SwitchboardProgram,
  args: VerifierHeartbeatArgs,
  accounts: VerifierHeartbeatAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.verifier, isSigner: false, isWritable: true },
    { pubkey: accounts.verifierSigner, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.gcNode, isSigner: false, isWritable: true },
    { pubkey: accounts.permission, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([25, 238, 221, 14, 250, 148, 0, 140]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VerifierHeartbeatParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
