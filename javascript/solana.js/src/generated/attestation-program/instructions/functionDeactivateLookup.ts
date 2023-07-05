import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionDeactivateLookupAccounts {
  function: PublicKey;
  payer: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  addressLookupTable: PublicKey;
  addressLookupProgram: PublicKey;
}

export function functionDeactivateLookup(
  program: SwitchboardProgram,
  accounts: FunctionDeactivateLookupAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.addressLookupTable, isSigner: false, isWritable: true },
    {
      pubkey: accounts.addressLookupProgram,
      isSigner: false,
      isWritable: false,
    },
  ];
  const identifier = Buffer.from([160, 179, 246, 143, 186, 195, 74, 35]);
  const data = identifier;
  const ix = new TransactionInstruction({
    keys,
    programId: program.attestationProgramId,
    data,
  });
  return ix;
}
