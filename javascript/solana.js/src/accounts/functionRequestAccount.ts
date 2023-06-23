import { Account } from "../accounts/account.js";
import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { RawBuffer } from "../types.js";
import { parseMrEnclave } from "../utils.js";

import { FunctionAccount } from "./index.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common";

/**
 *  Parameters for initializing a {@linkcode FunctionRequestAccount}
 */
export interface FunctionRequestAccountInitParams {
  functionAccount: FunctionAccount;
  maxContainerParamsLen?: number;
  containerParams?: Buffer;
  garbageCollectionSlot?: number;

  /**
   *  A keypair to be used to address this account.
   *
   *  @default Keypair.generate()
   */
  keypair?: Keypair;

  authority?: PublicKey;
}

/**
 *  Parameters for setting a {@linkcode FunctionRequestAccount} config
 */
export interface FunctionRequestSetConfigParams {
  containerParams: Buffer;
  appendContainerParams?: boolean;
  authority?: Keypair;
}
/**
 *  Parameters for triggering a {@linkcode FunctionRequestAccount} config
 */
export interface FunctionRequestTriggerParams {
  bounty?: number | BN;
  slotsUntilExpiration?: BN;
  authority?: Keypair;
}

export interface FunctionRequestVerifyParams {
  observedTime?: number;
  isFailure?: boolean;
  mrEnclave: RawBuffer;
  requestSlot: number | BN;

  // accounts
  functionEnclaveSigner: PublicKey;
  function: PublicKey;
  verifierQuote: PublicKey;
  verifierEnclaveSigner: PublicKey;
  verifierPermission: PublicKey;
  attestationQueue: PublicKey;
  receiver: PublicKey;
}

/**
 * Account type representing a Switchboard Function.
 *
 * Data: {@linkcode types.FunctionRequestAccountData}
 */
export class FunctionRequestAccount extends Account<types.FunctionRequestAccountData> {
  static accountName = "FunctionRequestAccountData";

  /**
   * Get the size of an {@linkcode FunctionRequestAccount} on-chain.
   */
  public readonly size =
    this.program.attestationAccount.functionAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.FunctionRequestAccountData} stored in this account.
   */
  public async loadData(): Promise<types.FunctionRequestAccountData> {
    const data = await types.FunctionRequestAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError("Function", this.publicKey);
  }

  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[FunctionRequestAccount, types.FunctionRequestAccountData]> {
    program.verifyAttestation();

    const functionAccount = new FunctionRequestAccount(program, address);
    const state = await functionAccount.loadData();
    return [functionAccount, state];
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: FunctionRequestAccountInitParams,
    options?: TransactionObjectOptions
  ): Promise<[FunctionRequestAccount, TransactionObject]> {
    // TODO: Calculate the max size of data we can support up front then split into multiple txns

    program.verifyAttestation();

    // TODO: Add way to make this a PDA
    const requestKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(requestKeypair);

    const escrow = program.mint.getAssociatedAddress(requestKeypair.publicKey);

    const functionState = await params.functionAccount.loadData();

    const instruction = types.functionRequestInit(
      program,
      {
        params: {
          maxContainerParamsLen: null,
          containerParams: new Uint8Array(
            params.containerParams ?? Buffer.from("")
          ),
          garbageCollectionSlot: params.garbageCollectionSlot
            ? new BN(params.garbageCollectionSlot)
            : null,
        },
      },
      {
        request: requestKeypair.publicKey,
        function: params.functionAccount.publicKey,
        functionAuthority: functionState.authority,
        attestationQueue: functionState.attestationQueue,
        escrow,
        mint: program.mint.address,
        state: program.attestationProgramState.publicKey,
        payer,
        authority: params.authority ?? payer,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      }
    );
    return [
      new FunctionRequestAccount(program, requestKeypair.publicKey),
      new TransactionObject(payer, [instruction], [requestKeypair], options),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: FunctionRequestAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[FunctionRequestAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createInstruction(
      program,
      program.walletPubkey,
      params,
      options
    );
    const txSignature = await program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  public getEscrow(): PublicKey {
    return this.program.mint.getAssociatedAddress(this.publicKey);
  }

  public async getBalance(): Promise<number> {
    const balance = await this.program.mint.getAssociatedBalance(
      this.publicKey
    );
    if (balance === null) {
      throw new errors.AccountNotFoundError(
        `Function escrow`,
        this.getEscrow()
      );
    }
    return balance;
  }

  public async getBalanceBN(): Promise<BN> {
    const balance = await this.getBalance();
    return this.program.mint.toTokenAmountBN(balance);
  }

  public async setConfigInstruction(
    payer: PublicKey,
    params: FunctionRequestSetConfigParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const requestState = await this.loadData();

    const setConfigIxn = types.functionRequestSetConfig(
      this.program,
      {
        params: {
          containerParams: new Uint8Array(params.containerParams),
          appendContainerParams: params.appendContainerParams ?? false,
        },
      },
      {
        request: this.publicKey,
        authority: requestState.authority,
      }
    );

    return new TransactionObject(
      payer,
      [setConfigIxn],
      params?.authority ? [params.authority] : []
    );
  }

  public async setConfig(
    params?: FunctionRequestSetConfigParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.setConfigInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async triggerInstruction(
    payer: PublicKey,
    params?: FunctionRequestTriggerParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const requestState = await this.loadData();
    const functionAccount = new FunctionAccount(
      this.program,
      requestState.function
    );
    const functionState = await functionAccount.loadData();

    const setConfigIxn = types.functionRequestTrigger(
      this.program,
      {
        params: {
          bounty: params?.bounty
            ? typeof params.bounty === "number"
              ? new BN(params.bounty)
              : params.bounty
            : null,
          slotsUntilExpiration: params?.slotsUntilExpiration ?? null,
        },
      },
      {
        request: this.publicKey,
        authority: requestState.authority,
        escrow: requestState.escrow,
        function: requestState.function,
        state: this.program.attestationProgramState.publicKey,
        attestationQueue: functionState.attestationQueue,
        payer,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }
    );

    return new TransactionObject(
      payer,
      [setConfigIxn],
      params?.authority ? [params.authority] : [],
      options
    );
  }

  public async trigger(
    params?: FunctionRequestTriggerParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.triggerInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public verifyIxn(
    params: FunctionRequestVerifyParams
  ): TransactionInstruction {
    const ixn = types.functionRequestVerify(
      this.program,
      {
        params: {
          observedTime: new BN(
            params.observedTime
              ? params.observedTime
              : Math.floor(Date.now() / 1000)
          ),
          isFailure: params.isFailure ?? false,
          mrEnclave: Array.from(parseMrEnclave(params.mrEnclave)),
          requestSlot:
            typeof params.requestSlot === "number"
              ? new BN(params.requestSlot)
              : params.requestSlot,
        },
      },
      {
        request: this.publicKey,
        functionEnclaveSigner: params.functionEnclaveSigner,
        escrow: this.program.mint.getAssociatedAddress(this.publicKey),
        function: params.function,
        functionEscrow: this.program.mint.getAssociatedAddress(params.function),
        verifierQuote: params.verifierQuote,
        verifierEnclaveSigner: params.verifierEnclaveSigner,
        verifierPermission: params.verifierPermission,
        state: this.program.attestationProgramState.publicKey,
        attestationQueue: params.attestationQueue,
        receiver: params.receiver,
        tokenProgram: TOKEN_PROGRAM_ID,
      }
    );

    return ixn;
  }
}
