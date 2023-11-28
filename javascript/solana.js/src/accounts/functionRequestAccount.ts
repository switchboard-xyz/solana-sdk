import { Account } from "../accounts/account.js";
import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import type { SwitchboardProgram } from "../SwitchboardProgram.js";
import type {
  SendTransactionObjectOptions,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { TransactionObject } from "../TransactionObject.js";
import { parseRawBuffer } from "../utils.js";

import type { SwitchboardWalletFundParams } from "./index.js";
import { FunctionAccount, SwitchboardWallet } from "./index.js";

import * as spl from "@solana/spl-token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type {
  Commitment,
  PublicKey,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { Keypair, SystemProgram } from "@solana/web3.js";
import type { RawBuffer } from "@switchboard-xyz/common";
import { BN, parseRawMrEnclave, sleep } from "@switchboard-xyz/common";

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
  validAfterSlot?: BN;
  authority?: Keypair;
}

export interface FunctionRequestVerifyParams {
  observedTime?: number;
  isFailure?: boolean;
  mrEnclave: RawBuffer;
  requestSlot: number | BN;
  containerParamsHash: RawBuffer;

  // accounts
  functionEnclaveSigner: PublicKey;
  function: PublicKey;
  functionEscrow: PublicKey;
  verifierQuote: PublicKey;
  verifierEnclaveSigner: PublicKey;
  verifierPermission: PublicKey;
  attestationQueue: PublicKey;
  receiver: PublicKey;
}

export interface FunctionRequestFundParams {
  funderTokenWallet?: PublicKey; // defaults to payer tokenWallet
  funderAuthority?: Keypair; // defaults to payer
  transferAmount: number;
}

/**
 * Account type representing a Switchboard Function.
 *
 * Data: {@linkcode types.FunctionRequestAccountData}
 */
export class FunctionRequestAccount extends Account<types.FunctionRequestAccountData> {
  static accountName = "FunctionRequestAccountData";

  /**
   *  Retrieve and decode the {@linkcode types.FunctionRequestAccountData} stored in this account.
   */
  public async loadData(): Promise<types.FunctionRequestAccountData> {
    const data = await types.FunctionRequestAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError("Request", this.publicKey);
  }

  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[FunctionRequestAccount, types.FunctionRequestAccountData]> {
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

    // TODO: Add way to make this a PDA
    const requestKeypair = params.keypair ?? Keypair.generate();
    await program.verifyNewKeypair(requestKeypair);

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

  public get tokenAccount(): PublicKey {
    return this.program.mint.getAssociatedAddress(this.publicKey);
  }

  public async getBalance(): Promise<number> {
    const balance = await this.program.mint.getAssociatedBalance(
      this.publicKey
    );
    if (balance === null) {
      throw new errors.AccountNotFoundError(
        `Function escrow`,
        this.tokenAccount
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
      params?.authority ? [params.authority] : [],
      options
    );
  }

  public async setConfig(
    params: FunctionRequestSetConfigParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.setConfigInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async fundInstruction(
    payer: PublicKey,
    params: FunctionRequestFundParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const wrapTxn = (
      await this.program.mint.getOrCreateWrappedUserInstructions(payer, {
        fundUpTo: params.transferAmount,
      })
    )[1];

    const funderAuthority = params.funderAuthority?.publicKey ?? payer;
    const source =
      params.funderTokenWallet ??
      this.program.mint.getAssociatedAddress(funderAuthority);
    const destination = this.tokenAccount;

    const transferAmount = this.program.mint.toTokenAmount(
      params.transferAmount
    );

    const signers = params.funderAuthority ? [params.funderAuthority] : [];
    const ixn = spl.createTransferInstruction(
      source,
      destination,
      funderAuthority,
      transferAmount,
      signers
    );
    const transferTxn = new TransactionObject(payer, [ixn], signers, options);

    return wrapTxn?.combine(transferTxn) ?? transferTxn;
  }

  public async fund(
    params: FunctionRequestFundParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.fundInstruction(
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
          validAfterSlot: params?.validAfterSlot ?? null,
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
          errorCode: params.isFailure ? 1 : 0,
          mrEnclave: Array.from(parseRawMrEnclave(params.mrEnclave)),
          requestSlot:
            typeof params.requestSlot === "number"
              ? new BN(params.requestSlot)
              : params.requestSlot,
          containerParamsHash: Array.from(
            parseRawBuffer(params.containerParamsHash)
          ),
        },
      },
      {
        request: this.publicKey,
        functionEnclaveSigner: params.functionEnclaveSigner,
        escrow: this.program.mint.getAssociatedAddress(this.publicKey),
        function: params.function,
        functionEscrow: params.functionEscrow,
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

  /**
   * Poll a FunctionRequest Account and wait for the status to be set to 'RequestSuccess' or 'RequestFailure'
   * @param requestSlot
   * @param maxAttempts
   * @throws if the round is never closed before maxAttempts
   * @returns
   */
  public async poll(
    requestSlot?: number,
    maxAttempts = 60,
    commitment: Commitment = "processed"
  ): Promise<types.FunctionRequestTriggerRound> {
    const slot = requestSlot ?? (await this.program.connection.getSlot());

    const isSettled = (state: types.FunctionRequestAccountData): boolean =>
      slot >= state.activeRequest.requestSlot.toNumber() &&
      state.activeRequest.fulfilledSlot.toNumber() > 0;

    let ws: number | undefined = undefined;
    let requestState: types.FunctionRequestAccountData | undefined = undefined;
    let shouldPoll = true;
    let attempts = 0;

    ws = this.program.provider.connection.onAccountChange(
      this.publicKey,
      (accountInfo) => {
        requestState = types.FunctionRequestAccountData.decode(
          accountInfo.data
        );
        if (isSettled(requestState)) {
          shouldPoll = false;
          if (ws !== undefined) {
            this.program.provider.connection
              .removeAccountChangeListener(ws)
              .then(() => {
                ws = undefined;
              })
              .catch();
          }
        }
      },
      commitment
    );

    while (shouldPoll && attempts < maxAttempts) {
      await sleep(1000);
      attempts = attempts + 1;
    }

    if (ws !== undefined) {
      this.program.provider.connection
        .removeAccountChangeListener(ws)
        .then(() => {
          ws = undefined;
        })
        .catch();
    }

    if (requestState === undefined) {
      requestState = await this.loadData();
    }

    if (isSettled(requestState)) {
      return requestState.activeRequest;
    }

    throw new Error(
      `Function Request failed to verify in ${maxAttempts} attempts. Check the chain for more details.`
    );
  }
}
