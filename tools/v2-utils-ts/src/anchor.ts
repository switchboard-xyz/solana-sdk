import * as anchor from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

const DEFAULT_KEYPAIR = Keypair.fromSeed(new Uint8Array(32).fill(1));

/** Return the default anchor.Provider that will fail if a transaction is sent. This is used to avoid accidentally loading a
 * valid keypair from the anchor environment defaults.
 * @param connection a Solana connection object for a given Solana cluster and endpoint
 * @return the anchor.Provider object
 * */
export const getDefaultProvider = (connection: Connection): anchor.Provider => {
  return new anchor.Provider(
    connection,
    new anchor.Wallet(DEFAULT_KEYPAIR),
    anchor.Provider.defaultOptions()
  );
};

/** Get the program data address for a given programId
 * @param programId the programId for a given on-chain program
 * @return the publicKey of the address holding the upgradeable program buffer
 */
export const getProgramDataAddress = (programId: PublicKey): PublicKey => {
  return findProgramAddressSync(
    [programId.toBytes()],
    new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
  )[0];
};

/** Get the IDL address for a given programId
 * @param programId the programId for a given on-chain program
 * @return the publicKey of the IDL address
 */
export const getIdlAddress = async (
  programId: PublicKey
): Promise<PublicKey> => {
  const base = (await PublicKey.findProgramAddress([], programId))[0];
  return PublicKey.createWithSeed(base, "anchor:idl", programId);
};
