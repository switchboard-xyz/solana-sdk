import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestVerifyArgs {
  params: types.FunctionRequestVerifyParamsFields;
}

export interface FunctionRequestVerifyAccounts {
  request: PublicKey;
  functionEnclaveSigner: PublicKey;
  escrow: PublicKey;
  function: PublicKey;
  functionEscrow: PublicKey;
  verifierQuote: PublicKey;
  verifierEnclaveSigner: PublicKey;
  verifierPermission: PublicKey;
  state: PublicKey;
  attestationQueue: PublicKey;
  receiver: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.FunctionRequestVerifyParams.layout("params"),
]);

/**
 * Verifies a function request was executed within an enclave and sets
 * the enclave signer on the request account for downstream instructions to verify.
 *
 * # Errors
 *
 * * `InsufficientQueue` - If the attestation queue has no active verifier oracles
 * * `InvalidQuote` - If the verifier oracle has an invalid or expired quote
 * * `IncorrectMrEnclave` - If the verifiers mr_enclave is not found in the attestation queue's enclave set
 *
 * * `RequestRoundNotActive` - If there is no active round for the request
 * * `FunctionRequestNotReady` - If the request is not active yet
 * * `UserRequestsDisabled` - If the function has disabled routines
 * * `FunctionNotReady` - If the function status is not Active
 * * `InvalidMrEnclave` - If the measured mr_enclave value is not null
 * * `MrEnclavesEmpty` - If the function has 0 mr_enclaves whitelisted
 * * `IncorrectMrEnclave` - If the measured mr_enclave is not found in the functions enclave set
 *
 * * `InvalidRequest` - If the provided params.request_slot does not match the active round request_slot
 * * `IllegalExecuteAttempt` - If the request slot is 0 or greater than the current slot
 *
 * * `InvalidEscrow` - If the function escrow was provided but incorrect.
 * * `MissingFunctionEscrow` - If the function escrow was not provided but required because func.routines_dev_fee > 0
 * * `IncorrectObservedTime` - If the oracles observed time has drifted by 20 seconds
 * * `InvalidParamsHash` If the container params hash is not the same as the routine params hash. Used to mitigate malicous RPCs.
 *
 */
export function functionRequestVerify(
  program: SwitchboardProgram,
  args: FunctionRequestVerifyArgs,
  accounts: FunctionRequestVerifyAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.request, isSigner: false, isWritable: true },
    {
      pubkey: accounts.functionEnclaveSigner,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.function, isSigner: false, isWritable: true },
    { pubkey: accounts.functionEscrow, isSigner: false, isWritable: true },
    { pubkey: accounts.verifierQuote, isSigner: false, isWritable: false },
    {
      pubkey: accounts.verifierEnclaveSigner,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.verifierPermission, isSigner: false, isWritable: false },
    { pubkey: accounts.state, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([179, 6, 88, 97, 232, 112, 143, 253]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.FunctionRequestVerifyParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
