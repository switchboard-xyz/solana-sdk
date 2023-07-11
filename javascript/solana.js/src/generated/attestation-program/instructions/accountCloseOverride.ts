import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AccountCloseOverrideAccounts {
  enclave: PublicKey;
  function: PublicKey;
  solDest: PublicKey;
  systemProgram: PublicKey;
}

export function accountCloseOverride(
  program: SwitchboardProgram,
  accounts: AccountCloseOverrideAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.enclave, isSigner: false, isWritable: true },
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.solDest, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([65, 72, 78, 213, 38, 245, 58, 189]);
  const data = identifier;
  const ix = new TransactionInstruction({
    keys,
    programId: program.attestationProgramId,
    data,
  });
  return ix;
}
