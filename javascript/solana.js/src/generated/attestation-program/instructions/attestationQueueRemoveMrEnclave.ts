import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationQueueRemoveMrEnclaveArgs {
  params: types.AttestationQueueRemoveMrEnclaveParamsFields;
}

export interface AttestationQueueRemoveMrEnclaveAccounts {
  queue: PublicKey;
  authority: PublicKey;
}

export const layout = borsh.struct([
  types.AttestationQueueRemoveMrEnclaveParams.layout("params"),
]);

export function attestationQueueRemoveMrEnclave(
  program: SwitchboardProgram,
  args: AttestationQueueRemoveMrEnclaveArgs,
  accounts: AttestationQueueRemoveMrEnclaveAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([202, 141, 93, 179, 212, 230, 34, 238]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AttestationQueueRemoveMrEnclaveParams.toEncodable(
        args.params
      ),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
