import * as anchor from "@project-serum/anchor";
import {
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import {
  packInstructions,
  signTransactions,
} from "@switchboard-xyz/switchboard-v2";

export async function packAndSend(
  program: anchor.Program,
  ixnsBatch: (TransactionInstruction | TransactionInstruction[])[],
  ixnsBatch2: (TransactionInstruction | TransactionInstruction[])[],
  signers: Keypair[],
  feePayer: PublicKey
): Promise<TransactionSignature[]> {
  const signatures: Promise<TransactionSignature>[] = [];
  const { blockhash } = await program.provider.connection.getLatestBlockhash();

  const packedTransactions = packInstructions(ixnsBatch, feePayer, blockhash);
  const signedTransactions = signTransactions(packedTransactions, signers);
  // const signedTxs = await (
  //   program.provider as anchor.AnchorProvider
  // ).wallet.signAllTransactions(signedTransactions);

  for (let k = 0; k < packedTransactions.length; k += 1) {
    const tx = signedTransactions[k];
    signatures.push(
      program.provider.connection.sendTransaction(tx, signers, {
        skipPreflight: true,
        maxRetries: 10,
      })
    );
  }

  await Promise.all(signatures);

  if (ixnsBatch2 && ixnsBatch2.length > 0) {
    const packedTransactions2 = packInstructions(
      ixnsBatch2,
      feePayer,
      blockhash
    );
    const signedTransactions2 = signTransactions(packedTransactions2, signers);
    const signedTxs2 = await (
      program.provider as anchor.AnchorProvider
    ).wallet.signAllTransactions(signedTransactions2);

    for (let k = 0; k < packedTransactions2.length; k += 1) {
      const tx = signedTxs2[k];
      const rawTx = tx.serialize();
      signatures.push(
        program.provider.connection.sendRawTransaction(rawTx, {
          skipPreflight: true,
          maxRetries: 10,
        })
      );
    }
  }

  return Promise.all(signatures);
}
