import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

export const DEFAULT_PUBKEY = new PublicKey("11111111111111111111111111111111");

export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

export async function promiseWithTimeout<T>(
  ms: number,
  promise: Promise<T>,
  timeoutError = new Error("timeoutError")
): Promise<T> {
  // create a promise that rejects in milliseconds
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(timeoutError);
    }, ms);
  });

  return Promise.race<T>([promise, timeout]);
}

export const getProgramDataAddress = (programId: PublicKey): PublicKey => {
  return findProgramAddressSync(
    [programId.toBytes()],
    new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
  )[0];
};

export const getIdlAddress = async (
  programId: PublicKey
): Promise<PublicKey> => {
  const base = (await PublicKey.findProgramAddress([], programId))[0];
  return PublicKey.createWithSeed(base, "anchor:idl", programId);
};
