import type { Connection, SignatureResult } from "@solana/web3.js";

/** Watch a transaction and resolve when it is finalized */
export async function watchTransaction(
  txn: string,
  connection: Connection
): Promise<void> {
  console.log(`https://explorer.solana.com/tx/${txn}?cluster=devnet`);
  connection.onSignature(txn, async (signatureResult: SignatureResult) => {
    const response = await connection.getTransaction(txn);
    console.log(JSON.stringify(response?.meta?.logMessages, undefined, 2));
  });
}
