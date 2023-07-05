import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WalletFundArgs {
  params: types.WalletFundParamsFields;
}

export interface WalletFundAccounts {
  wallet: PublicKey;
  mint: PublicKey;
  authority: PublicKey;
  attestationQueue: PublicKey;
  tokenWallet: PublicKey;
  funderWallet: PublicKey;
  funder: PublicKey;
  state: PublicKey;
  tokenProgram: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([types.WalletFundParams.layout("params")]);

export function walletFund(
  program: SwitchboardProgram,
  args: WalletFundArgs,
  accounts: WalletFundAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.wallet, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.attestationQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.funderWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: false },
    { pubkey: accounts.state, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([93, 170, 44, 19, 223, 172, 40, 164]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.WalletFundParams.toEncodable(args.params),
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
