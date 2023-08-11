import type * as anchor from "@coral-xyz/anchor";
import { sleep } from "@switchboard-xyz/common";

export async function printLogs(
  connection: anchor.web3.Connection,
  tx: string,
  v0Txn?: boolean,
  delay = 3000
) {
  await sleep(delay);
  const parsed = await connection.getParsedTransaction(tx, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: v0Txn ? 0 : undefined,
  });
  console.log(parsed?.meta?.logMessages?.join("\n"));
}
