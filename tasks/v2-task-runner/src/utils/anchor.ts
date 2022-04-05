import * as anchor from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";

const DEFAULT_KEYPAIR = Keypair.fromSeed(new Uint8Array(32).fill(1));

export const getDefaultProvider = (connection: Connection): anchor.Provider => {
  return new anchor.Provider(
    connection,
    new anchor.Wallet(DEFAULT_KEYPAIR),
    anchor.Provider.defaultOptions()
  );
};
