import * as anchor from "@project-serum/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  OracleJob,
  ProgramStateAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";

export interface SwitchboardInstructionResult {
  ixns: (TransactionInstruction | Promise<TransactionInstruction>)[];
  signers: Keypair[];
}

export class SwitchboardTransaction {
  program: anchor.Program;

  payerKeypair: Keypair;

  programStateAccount: ProgramStateAccount;

  //   programState: Promise<any>;

  //   programMint: Promise<spl.Token>;

  stateBump: number;

  constructor(program: anchor.Program) {
    this.program = program;
    this.payerKeypair = programWallet(program);
    const [programStateAccount, stateBump] =
      ProgramStateAccount.fromSeed(program);
    this.programStateAccount = programStateAccount;
    this.stateBump = stateBump;
    // this.programState = programStateAccount.loadData();
    // this.programMint = programStateAccount.getTokenMint();
  }

  createInitJobInstruction(
    job: OracleJob,
    rentExemption: number,
    authorWallet: PublicKey,
    params: {
      name?: string;
      metadata?: string;
      authority?: PublicKey;
      expiration?: anchor.BN;
      variables?: string[];
    }
  ): SwitchboardInstructionResult {
    const jobKeypair = Keypair.generate();
    const jobData = Buffer.from(
      OracleJob.encodeDelimited(
        OracleJob.create({
          tasks: job.tasks,
        })
      ).finish()
    );
    const size =
      280 + jobData.length + (params.variables?.join("")?.length ?? 0);

    const ixns: (TransactionInstruction | Promise<TransactionInstruction>)[] = [
      SystemProgram.createAccount({
        fromPubkey: this.payerKeypair.publicKey,
        newAccountPubkey: jobKeypair.publicKey,
        space: size,
        lamports: rentExemption,
        programId: this.program.programId,
      }),
      this.program.methods
        .jobInit({
          name: Buffer.from(params.name ?? ""),
          data: jobData,
          variables:
            params.variables?.map((item) => Buffer.from("")) ??
            new Array<Buffer>(),
          stateBump: this.stateBump,
        })
        .accounts({
          job: jobKeypair.publicKey,
          authorWallet: authorWallet,
          authority: this.payerKeypair.publicKey,
          programState: this.programStateAccount.publicKey,
        })
        // .signers([jobKeypair])
        .instruction(),
    ];

    return {
      ixns,
      signers: [jobKeypair],
    };
  }
}
