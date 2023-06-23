import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
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

export function functionRequestVerify(
  program: SwitchboardProgram,
  args: FunctionRequestVerifyArgs,
  accounts: FunctionRequestVerifyAccounts
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
    { pubkey: accounts.state, isSigner: false, isWritable: true },
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
  const ix = new TransactionInstruction({
    keys,
    programId: program.attestationProgramId,
    data,
  });
  return ix;
}
