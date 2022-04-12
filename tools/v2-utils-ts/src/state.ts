import type * as anchor from "@project-serum/anchor";
import type * as spl from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import { getPayer, ProgramStateAccount } from "@switchboard-xyz/switchboard-v2";

export const getOrCreateSwitchboardMintTokenAccount = async (
  program: anchor.Program,
  switchboardMint?: spl.Token
): Promise<PublicKey> => {
  let mint = switchboardMint;
  if (!mint) {
    const [programState] = ProgramStateAccount.fromSeed(program);
    mint = await programState.getTokenMint();
  }

  const payer = getPayer(program);

  const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    payer.publicKey
  );

  return tokenAccount.address;
};
