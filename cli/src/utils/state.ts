import type * as anchor from "@project-serum/anchor";
import type * as spl from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import {
  ProgramStateAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";

export const getOrCreateSwitchboardMintTokenAccount = async (
  program: anchor.Program,
  switchboardMint?: spl.Token
): Promise<PublicKey> => {
  const payer = programWallet(program);

  const returnAssociatedAddress = async (
    mint: spl.Token
  ): Promise<PublicKey> => {
    const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(
      payer.publicKey
    );
    return tokenAccount.address;
  };

  let mint = switchboardMint;
  if (mint) {
    returnAssociatedAddress(mint);
  }

  const [programState] = ProgramStateAccount.fromSeed(program);
  mint = await programState.getTokenMint();
  if (mint) {
    returnAssociatedAddress(mint);
  }

  throw new Error(`failed to get associated token account`);
};
