import * as anchor from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import type { Callback } from "@switchboard-xyz/switchboard-v2";

export function getVrfClientFromSeed(
  program: anchor.Program,
  vrfPubkey: PublicKey,
  authority: PublicKey
): [PublicKey, number] {
  const [statePubkey, stateBump] =
    anchor.utils.publicKey.findProgramAddressSync(
      [Buffer.from("STATE"), vrfPubkey.toBytes(), authority.toBytes()],
      program.programId
    );
  return [statePubkey, stateBump];
}

export function getVrfClientCallback(
  vrfClientProgram: anchor.Program,
  clientKey: PublicKey,
  vrfKey: PublicKey
): Callback {
  const vrfIxCoder = new anchor.BorshInstructionCoder(vrfClientProgram.idl);
  const callback: Callback = {
    programId: vrfClientProgram.programId,
    accounts: [
      // ensure all accounts in updateResult are populated
      { pubkey: clientKey, isSigner: false, isWritable: true },
      { pubkey: vrfKey, isSigner: false, isWritable: false },
    ],
    ixData: vrfIxCoder.encode("updateResult", ""), // pass any params for instruction here
  };
  return callback;
}

// export async function createVrfClient(
//   switchboardProgram: anchor.Program,
//   vrfKeypair: Keypair
// ): Promise<VrfClient> {}
