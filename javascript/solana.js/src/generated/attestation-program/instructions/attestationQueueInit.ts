import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationQueueInitArgs {
  params: types.AttestationQueueInitParamsFields;
}

export interface AttestationQueueInitAccounts {
  queue: PublicKey;
  authority: PublicKey;
  payer: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([
  types.AttestationQueueInitParams.layout("params"),
]);

export function attestationQueueInit(
  program: SwitchboardProgram,
  args: AttestationQueueInitArgs,
  accounts: AttestationQueueInitAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.queue, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([82, 211, 133, 63, 177, 112, 210, 216]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.AttestationQueueInitParams.toEncodable(args.params),
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
