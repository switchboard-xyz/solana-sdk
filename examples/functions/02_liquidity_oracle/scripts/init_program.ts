import * as anchor from "@coral-xyz/anchor";
import { BasicOracle } from "../target/types/basic_oracle";
import {
  Connection,
  PublicKey,
  Keypair,
  sendAndConfirmRawTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

(async function main() {
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(require("fs").readFileSync("<YOUR_KEYPAIR_FILE>", "utf8"))
    )
  );
  const programId = new PublicKey(
    "EF68PJkRqQu2VthTSy19kg6TWynMtRmLpxcMDKEdLC8t"
  );
  const commitment = "processed";
  const connection = new Connection("https://api.devnet.solana.com", {
    commitment,
  });
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment,
    preflightCommitment: commitment,
  });
  const idl = await anchor.Program.fetchIdl(programId, provider);
  const program = new anchor.Program(idl!, programId!, provider!);
  const [state] = PublicKey.findProgramAddressSync(
    [Buffer.from("BASICORACLE")],
    program.programId
  );
  const [oracle] = PublicKey.findProgramAddressSync(
    [Buffer.from("ORACLE_V1_SEED")],
    program.programId
  );
  const initSig = await program.methods
    .initialize({})
    .accounts({
      program: state,
      oracle,
      authority: walletKeypair.publicKey,
      payer: walletKeypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([walletKeypair])
    .rpc();
  console.log(initSig);
})();