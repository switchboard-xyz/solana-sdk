import type * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import {
  ProgramStateAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";

export const getOrCreateSwitchboardTokenAccount = async (
  program: anchor.Program,
  switchboardMint?: spl.Mint,
  payer = programWallet(program)
): Promise<PublicKey> => {
  const getAssociatedAddress = async (mint: spl.Mint): Promise<PublicKey> => {
    const tokenAccount = await spl.getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      payer,
      mint.address,
      payer.publicKey,
      undefined,
      undefined,
      undefined,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return tokenAccount.address;
  };

  let mint = switchboardMint;
  if (mint) {
    return getAssociatedAddress(mint);
  }
  const [programState] = ProgramStateAccount.fromSeed(program);
  mint = await programState.getTokenMint();
  if (mint) {
    return getAssociatedAddress(mint);
  }

  throw new Error(`failed to get associated token account`);
};
