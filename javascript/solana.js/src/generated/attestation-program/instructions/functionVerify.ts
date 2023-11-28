import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionVerifyArgs {
  params: types.FunctionVerifyParamsFields;
}

export interface FunctionVerifyAccounts {
  function: PublicKey;
  functionEnclaveSigner: PublicKey;
  verifier: PublicKey;
  verifierSigner: PublicKey;
  verifierPermission: PublicKey;
  escrowWallet: PublicKey;
  escrowTokenWallet: PublicKey;
  receiver: PublicKey;
  attestationQueue: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionVerifyParams.layout("params"),
]);

/**
 * Verifies a function was executed within an enclave and sets the enclave signer
 * on the function account for downstream instructions to verify.
 *
 * # Errors
 *
 * * `InsufficientQueue` - If the attestation queue has no active verifier oracles
 * * `InvalidQuote` - If the verifier oracle has an invalid or expired quote
 * * `IncorrectMrEnclave` - If the verifiers mr_enclave is not found in the attestation queue's enclave set
 * * `IllegalVerifier` - If the incorrect verifier has responded and the routine is less than 30 seconds stale.
 *
 * * `FunctionNotReady` - If the function status is not Active
 * * `InvalidMrEnclave` - If the measured mr_enclave value is not null
 * * `MrEnclavesEmpty` - If the function has 0 mr_enclaves whitelisted
 * * `IncorrectMrEnclave` - If the measured mr_enclave is not found in the functions enclave set
 *
 * * `IncorrectObservedTime` - If the oracles observed time has drifted by 20 seconds
 *
 */
export function functionVerify(
  program: SwitchboardProgram,
  args: FunctionVerifyArgs,
  accounts: FunctionVerifyAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    {
      pubkey: accounts.functionEnclaveSigner,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.verifier, isSigner: false, isWritable: false },
    { pubkey: accounts.verifierSigner, isSigner: true, isWritable: false },
    { pubkey: accounts.verifierPermission, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowWallet, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowTokenWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([210, 108, 154, 138, 198, 14, 53, 191]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionVerifyParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
