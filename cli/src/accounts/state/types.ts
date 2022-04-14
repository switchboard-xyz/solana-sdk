import { PublicKey } from "@solana/web3.js";

export interface ProgramStateData {
  authority: PublicKey;
  tokenMint: PublicKey;
  tokenVault: PublicKey;
}

export interface IProgramStateClass {
  publicKey: PublicKey;
  authorityPublicKey: PublicKey;
  tokenMintPublicKey: PublicKey;
  tokenVaultPublicKey: PublicKey;
}
