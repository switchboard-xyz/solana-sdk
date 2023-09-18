import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { AccountMeta, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WalletWithdrawArgs {
  params: types.WalletWithdrawParamsFields;
}

export interface WalletWithdrawAccounts {
  wallet: PublicKey;
  mint: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  tokenWallet: PublicKey;
  destinationWallet: PublicKey;
  state: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([
  types.WalletWithdrawParams.layout("params"),
]);

export function walletWithdraw(
  program: SwitchboardProgram,
  args: WalletWithdrawArgs,
  accounts: WalletWithdrawAccounts,
  programId: PublicKey = program.attestationProgramId
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.wallet, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.destinationWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.state, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([157, 251, 53, 205, 191, 139, 118, 213]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.WalletWithdrawParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
