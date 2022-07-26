import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { readResult } from "./instructions/readResult";

async function main() {
  const payer = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(require("fs").readFileSync(process.argv[2], "utf8"))
    )
  );
  const connection = new Connection(
    "https://switchboard.devnet.rpcpool.com/f9fe774d81ba4527a418f5b19477",
    "confirmed"
  );
  const ix = readResult(
    { params: { maxConfidenceInterval: null } },
    {
      aggregator: new PublicKey("8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee"),
    }
  );
  const tx = new Transaction();
  tx.add(ix);
  tx.feePayer = payer.publicKey;
  const sig = await connection.sendTransaction(tx, [payer]);
  console.log(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

(async () => await main())();
