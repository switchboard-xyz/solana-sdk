import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationQueueAddMrEnclaveArgs {
  params: types.AttestationQueueAddMrEnclaveParamsFields;
}

export interface AttestationQueueAddMrEnclaveAccounts {
  queue: PublicKey;
  authority: PublicKey;
}

export const layout = borsh.struct([
  types.AttestationQueueAddMrEnclaveParams.layout("params"),
]);

export function attestationQueueAddMrEnclave(
  program: SwitchboardProgram,
  args: AttestationQueueAddMrEnclaveArgs,
  accounts: AttestationQueueAddMrEnclaveAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([62, 27, 24, 221, 30, 240, 63, 167]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AttestationQueueAddMrEnclaveParams.toEncodable(args.params),
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
