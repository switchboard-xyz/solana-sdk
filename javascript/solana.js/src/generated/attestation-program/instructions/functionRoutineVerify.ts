import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineVerifyArgs {
  params: types.FunctionRoutineVerifyParamsFields;
}

export interface FunctionRoutineVerifyAccounts {
  routine: PublicKey;
  functionEnclaveSigner: PublicKey;
  escrowWallet: PublicKey;
  escrowTokenWallet: PublicKey;
  function: PublicKey;
  functionEscrowTokenWallet: PublicKey;
  verifierQuote: PublicKey;
  verifierEnclaveSigner: PublicKey;
  verifierPermission: PublicKey;
  attestationQueue: PublicKey;
  receiver: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionRoutineVerifyParams.layout("params"),
]);

/**
 * Verifies a function routine was executed within an enclave and sets
 * the enclave signer on the routine account for downstream instructions to verify.
 *
 * # Errors
 *
 * * `InsufficientQueue` - If the attestation queue has no active verifier oracles
 * * `InvalidQuote` - If the verifier oracle has an invalid or expired quote
 * * `IncorrectMrEnclave` - If the verifiers mr_enclave is not found in the attestation queue's enclave set
 * * `IllegalVerifier` - If the incorrect verifier has responded and the routine is less than 30 seconds stale.
 *
 * * `RoutineDisabled` - If the routine has been disabled
 * * `FunctionRoutinesDisabled` - If the function has disabled routines
 * * `FunctionNotReady` - If the function status is not Active
 * * `InvalidMrEnclave` - If the measured mr_enclave value is not null
 * * `MrEnclavesEmpty` - If the function has 0 mr_enclaves whitelisted
 * * `IncorrectMrEnclave` - If the measured mr_enclave is not found in the functions enclave set
 *
 * * `InvalidEscrow` - If the function escrow was provided but incorrect.
 * * `MissingFunctionEscrow` - If the function escrow was not provided but required because func.routines_dev_fee > 0
 * * `IncorrectObservedTime` - If the oracles observed time has drifted by 20 seconds
 * * `InvalidParamsHash` If the container params hash is not the same as the routine params hash. Used to mitigate malicous RPCs.
 *
 */
export function functionRoutineVerify(
  program: SwitchboardProgram,
  args: FunctionRoutineVerifyArgs,
  accounts: FunctionRoutineVerifyAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.routine, isSigner: false, isWritable: true },
    {
      pubkey: accounts.functionEnclaveSigner,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.escrowWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.escrowTokenWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    {
      pubkey: accounts.functionEscrowTokenWallet,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.verifierQuote, isSigner: false, isWritable: false },
    {
      pubkey: accounts.verifierEnclaveSigner,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.verifierPermission, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([138, 151, 43, 227, 196, 155, 245, 105]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionRoutineVerifyParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
