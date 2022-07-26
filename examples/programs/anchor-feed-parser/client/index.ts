import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import fs from "fs";
import { readResult } from "./instructions/readResult";

async function main() {
  const payer = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(process.argv[2], "utf8")))
  );
  const connection = new Connection(
    "https://devnet.genesysgo.net",
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

(async () => main())();
