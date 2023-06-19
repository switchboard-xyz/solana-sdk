import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BasicOracle } from "../target/types/basic_oracle";
import {
  AttestationQueueAccount,
  SwitchboardProgram,
  type BootstrappedAttestationQueue,
  FunctionAccount,
  parseMrEnclave,
  MrEnclave,
} from "@switchboard-xyz/solana.js";

// vv1gTnfuUiroqgJHS4xsRASsRQqqixCv1su85VWvcP9

const MRENCLAVE = parseMrEnclave(
  Buffer.from("3H98v4rOe5oTewVgg/9u2OoNM9fvPcZxRj2vya0R1p4=", "base64")
);

function has_mr_enclave(
  enclaves: Array<MrEnclave>,
  unknown_enclave: MrEnclave
) {
  return enclaves.includes(unknown_enclave);
}

describe("basic_oracle", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BasicOracle as Program<BasicOracle>;

  const payer = (program.provider as anchor.AnchorProvider).publicKey;

  const programStatePubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("BASICORACLE")],
    program.programId
  )[0];

  const oraclePubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ORACLE_V1_SEED")],
    program.programId
  )[0];

  let switchboard: BootstrappedAttestationQueue;
  let functionAccount: FunctionAccount;

  before(async () => {
    switchboard = await AttestationQueueAccount.bootstrapNewQueue(
      await SwitchboardProgram.fromProvider(
        program.provider as anchor.AnchorProvider
      )
    );

    [functionAccount] = await FunctionAccount.create(
      switchboard.attestationQueueAccount.program,
      {
        container: "switchboardlabs/basic-oracle-function",
        version: "latest",
        schedule: "15 * * * * *",
        mrEnclave: MRENCLAVE,
        attestationQueue: switchboard.attestationQueueAccount,
      }
    );
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize({ mrEnclaves: [] })
      .accounts({
        program: programStatePubkey,
        oracle: oraclePubkey,
        authority: payer,
      })
      .rpc()
      .catch((err) => {
        console.error(err);
        throw err;
      });
    console.log("Your transaction signature", tx);
  });
});
