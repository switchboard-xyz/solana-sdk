import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WalletCloseArgs {
  params: types.WalletCloseParamsFields;
}

export interface WalletCloseAccounts {
  wallet: PublicKey;
  mint: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  tokenWallet: PublicKey;
  destinationWallet: PublicKey;
  state: PublicKey;
  solDest: PublicKey;
  escrowDest: PublicKey;
  tokenProgram: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.WalletCloseParams.layout("params")]);

export function walletClose(
  program: SwitchboardProgram,
  args: WalletCloseArgs,
  accounts: WalletCloseAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.wallet, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.destinationWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.state, isSigner: false, isWritable: false },
    { pubkey: accounts.solDest, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowDest, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([88, 153, 120, 100, 41, 170, 2, 43]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.WalletCloseParams.toEncodable(args.params),
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
