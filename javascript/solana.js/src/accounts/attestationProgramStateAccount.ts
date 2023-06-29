import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import { TransactionObject } from "../TransactionObject.js";

import { Account } from "./account.js";

import {
  AccountInfo,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";

/**
 * Account type representing Switchboard global program state.
 *
 * Data: {@linkcode types.AttestationProgramState}
 */
export class AttestationProgramStateAccount extends Account<types.AttestationProgramState> {
  static accountName = "State";

  public static size = 1128;

  /**
   * @return account size of the global {@linkcode AttestationProgramStateAccount}.
   */
  public readonly size =
    this.program.attestationAccount.attestationProgramState.size;

  /**
   * Finds the {@linkcode AttestationProgramStateAccount} from the static seed from which it was generated.
   * @return AttestationProgramStateAccount and PDA bump tuple.
   */
  public static fromSeed(
    program: SwitchboardProgram
  ): [AttestationProgramStateAccount, number] {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("STATE")],
      program.attestationProgramId
    );
    return [new AttestationProgramStateAccount(program, publicKey), bump];
  }

  /** Load the AttestationProgramStateAccount with its current on-chain state */
  public static async load(
    program: SwitchboardProgram,
    publicKey: PublicKey | string
  ): Promise<[AttestationProgramStateAccount, types.AttestationProgramState]> {
    const account = new AttestationProgramStateAccount(
      program,
      typeof publicKey === "string" ? new PublicKey(publicKey) : publicKey
    );
    const state = await account.loadData();
    return [account, state];
  }

  /**
   * Retrieve and decode the {@linkcode types.AttestationProgramState} stored in this account.
   */
  public async loadData(): Promise<types.AttestationProgramState> {
    const data = await types.AttestationProgramState.fetch(
      this.program,
      this.publicKey
    );
    if (data === null)
      throw new errors.AccountNotFoundError(
        "Attestation Program State",
        this.publicKey
      );
    return data;
  }

  /**
   * Retrieves the {@linkcode AttestationProgramStateAccount}, creates it if it doesn't exist;
   */
  static async getOrCreate(
    program: SwitchboardProgram
  ): Promise<
    [AttestationProgramStateAccount, number, TransactionSignature | undefined]
  > {
    const [account, bump, txn] =
      await AttestationProgramStateAccount.getOrCreateInstructions(
        program,
        program.walletPubkey
      );

    if (txn) {
      const txnSignature = await program.signAndSend(txn);
      return [account, bump, txnSignature];
    }

    return [account, bump, undefined];
  }

  static async getOrCreateInstructions(
    program: SwitchboardProgram,
    payer: PublicKey
  ): Promise<
    [AttestationProgramStateAccount, number, TransactionObject | undefined]
  > {
    const [account, bump] = AttestationProgramStateAccount.fromSeed(program);

    try {
      await account.loadData();
      return [account, bump, undefined];
    } catch (e) {
      const stateInit = types.stateInit(
        program,
        { params: {} },
        {
          state: account.publicKey,
          payer: payer,
          systemProgram: SystemProgram.programId,
        }
      );

      const programInit = new TransactionObject(payer, [stateInit], []);

      return [account, bump, programInit];
    }
  }
}
