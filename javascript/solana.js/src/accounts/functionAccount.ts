import { Account } from "../accounts/account.js";
import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import {
  SB_ATTESTATION_PID,
  SB_V2_PID,
  SwitchboardProgram,
} from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { RawBuffer } from "../types.js";
import {
  numToBN,
  parseCronSchedule,
  parseMrEnclave,
  parseRawBuffer,
} from "../utils.js";

import {
  AttestationPermissionAccount,
  AttestationQueueAccount,
  EnclaveAccount,
  FunctionRequestAccount,
  FunctionRequestAccountInitParams,
  SwitchboardWallet,
  SwitchboardWalletFundParams,
} from "./index.js";

import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  AccountInfo,
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  SendOptions,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { BN, toUtf8 } from "@switchboard-xyz/common";
import assert from "assert";

export type FunctionAccountInitSeeds = {
  recentSlot?: number;
  creatorSeed?: RawBuffer; // defaults to payer pubkey bytes
};

/**
 *  Parameters for initializing a {@linkcode FunctionAccount}
 */
export type FunctionAccountInitParams = FunctionAccountInitSeeds & {
  name?: string;
  metadata?: string;
  container: string;
  version: string;
  containerRegistry?: string;
  schedule: string;

  mrEnclave: Buffer | Uint8Array | number[];
  attestationQueue: AttestationQueueAccount;

  requestsDisabled?: boolean;
  requestsRequireAuthorization?: boolean;
  requestsDefaultSlotsUntilExpiration?: number;
  requestsFee?: number;

  /**
   *  An authority to be used to control this account.
   *
   *  @default payer
   */
  authority?: PublicKey;
};

/**
 *  Parameters for setting a {@linkcode FunctionAccount} config
 */
export interface FunctionSetConfigParams {
  name?: string;
  metadata?: string;
  container?: string;
  containerRegistry?: string;
  version?: string;
  schedule?: string;
  mrEnclaves?: Array<RawBuffer>;
  requestsDisabled?: boolean;
  requestsRequireAuthorization?: boolean;
  requestsDefaultSlotsUntilExpiration?: number;
  requestsFee?: number;

  authority?: Keypair;
}

/**
 *  Parameters for an {@linkcode types.functionVerify} instruction.
 */

export interface FunctionVerifySyncParams {
  observedTime: anchor.BN;
  nextAllowedTimestamp: anchor.BN;
  isFailure: boolean;
  mrEnclave: Uint8Array;

  escrowWallet: PublicKey;

  functionAuthority: PublicKey;
  functionEnclaveSigner: PublicKey;

  attestationQueue: PublicKey;
  attestationQueueAuthority: PublicKey;

  quoteVerifier: PublicKey;
  quoteVerifierEnclaveSigner: PublicKey;

  receiver: PublicKey;
}

/**
 *  Parameters for an {@linkcode types.functionVerify} instruction.
 */

export interface FunctionVerifyParams {
  observedTime: anchor.BN;
  nextAllowedTimestamp: anchor.BN;
  isFailure: boolean;
  mrEnclave: Uint8Array;
  verifier: EnclaveAccount;
  verifierEnclaveSigner: PublicKey;
  functionEnclaveSigner: PublicKey;
  receiver: PublicKey;

  fnState?: types.FunctionAccountData;
  attestationQueueAuthority?: PublicKey;
}

/**
 *  Parameters for an {@linkcode types.functionTrigger} instruction.
 */

export interface FunctionTriggerParams {
  authority?: Keypair;
}

export type CreateFunctionRequestParams = Omit<
  FunctionRequestAccountInitParams,
  "functionAccount"
> & { user?: Keypair };

/**

/**
 * Account type representing a Switchboard Function.
 *
 * Data: {@linkcode types.FunctionAccountData}
 */
export class FunctionAccount extends Account<types.FunctionAccountData> {
  static accountName = "FunctionAccountData";

  private _wallet: Promise<SwitchboardWallet> | undefined = undefined;

  /**
   *  Returns the functions's name buffer in a stringified format.
   */
  public static getName = (functionData: types.FunctionAccountData) =>
    toUtf8(functionData.name);

  /**
   *  Returns the functions's metadata buffer in a stringified format.
   */
  public static getMetadata = (functionData: types.FunctionAccountData) =>
    toUtf8(functionData.metadata);

  /**
   *  Load an existing {@linkcode FunctionAccount} with its current on-chain state
   */

  /**
   * Get the size of an {@linkcode FunctionAccount} on-chain.
   */
  public readonly size =
    this.program.attestationAccount.functionAccountData.size;

  public get wallet(): Promise<SwitchboardWallet> {
    if (!this._wallet) {
      this._wallet = this.loadData().then((fnState) => {
        return new SwitchboardWallet(this.program, fnState.escrowWallet);
      });
    }

    return this._wallet;
  }

  public static fromSeed(
    program: SwitchboardProgram,
    creatorSeed: Uint8Array,
    recentSlot: BN
  ): FunctionAccount {
    const functionPubkey = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("FunctionAccountData"),
        creatorSeed,
        recentSlot.toBuffer("le", 8),
      ],
      program.attestationProgramId
    )[0];
    return new FunctionAccount(program, functionPubkey);
  }

  public async getBalance(): Promise<number> {
    const wallet = await this.wallet;
    const balance = await wallet.getBalance();
    return balance;
  }

  public async getBalanceBN(): Promise<BN> {
    const wallet = await this.wallet;
    const balance = await wallet.getBalanceBN();
    return balance;
  }

  /**
   *  Retrieve and decode the {@linkcode types.FunctionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.FunctionAccountData> {
    const data = await types.FunctionAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (!data) {
      throw new errors.AccountNotFoundError("Function", this.publicKey);
    }
    this._wallet = Promise.resolve(
      new SwitchboardWallet(this.program, data.escrowWallet)
    );
    return data;
  }

  /**
   *  Decode the {@linkcode types.FunctionAccountData} stored in this account.
   */
  public static async decode(
    program: SwitchboardProgram,
    accountInfo: AccountInfo<Buffer>
  ): Promise<[FunctionAccount, types.FunctionAccountData]> {
    if (!accountInfo.owner.equals(program.attestationProgramId)) {
      throw new errors.IncorrectOwner(
        program.attestationProgramId,
        accountInfo.owner
      );
    }

    const data = types.FunctionAccountData.decode(accountInfo.data);
    if (!data) {
      throw new errors.AccountNotFoundError("Function", PublicKey.default);
    }

    const functionAccount = FunctionAccount.fromSeed(
      program,
      new Uint8Array(data.creatorSeed),
      data.createdAt
    );

    functionAccount._wallet = Promise.resolve(
      new SwitchboardWallet(program, data.escrowWallet)
    );

    return [functionAccount, data];
  }

  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[FunctionAccount, types.FunctionAccountData]> {
    program.verifyAttestation();

    const functionAccount = new FunctionAccount(program, address);
    const state = await functionAccount.loadData();
    return [functionAccount, state];
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: FunctionAccountInitParams,
    wallet?: SwitchboardWallet,
    options?: TransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionObject]> {
    program.verifyAttestation();

    const authorityPubkey = params.authority ?? payer;

    const cronSchedule = parseCronSchedule(params.schedule);

    const attestationQueueAccount = params.attestationQueue;

    const recentSlot: BN = params.recentSlot
      ? new BN(params.recentSlot)
      : new BN(
          (
            await program.connection.getLatestBlockhashAndContext({
              commitment: "finalized",
            })
          ).context.slot
        );

    const creatorSeed = params.creatorSeed
      ? parseRawBuffer(params.creatorSeed, 32)
      : payer.toBytes();
    assert(creatorSeed.length === 32);

    const functionAccount = FunctionAccount.fromSeed(
      program,
      creatorSeed,
      recentSlot
    );

    const addressLookupProgram = new PublicKey(
      "AddressLookupTab1e1111111111111111111111111"
    );

    const [addressLookupTable] = PublicKey.findProgramAddressSync(
      [functionAccount.publicKey.toBuffer(), recentSlot.toBuffer("le", 8)],
      addressLookupProgram
    );

    let escrowWallet: SwitchboardWallet;
    let escrowWalletAuthority: PublicKey;
    if (wallet) {
      escrowWallet = wallet;
      escrowWalletAuthority = (await escrowWallet.loadData()).authority;
      if (
        !escrowWalletAuthority.equals(payer) &&
        !escrowWalletAuthority.equals(authorityPubkey)
      ) {
        throw new errors.IncorrectAuthority(
          escrowWalletAuthority,
          authorityPubkey
        );
      }
    } else {
      escrowWallet = SwitchboardWallet.fromSeed(
        program,
        attestationQueueAccount.publicKey,
        authorityPubkey,
        functionAccount.publicKey.toBytes()
      );
      escrowWalletAuthority = authorityPubkey;
    }

    const enclaveAccount = functionAccount.getEnclaveAccount();

    const instruction = types.functionInit(
      program,
      {
        params: {
          name: new Uint8Array(Buffer.from(params.name ?? "", "utf8")),
          metadata: new Uint8Array(Buffer.from(params.metadata ?? "", "utf8")),
          container: new Uint8Array(Buffer.from(params.container, "utf8")),
          containerRegistry: new Uint8Array(
            Buffer.from(params.containerRegistry ?? "", "utf8")
          ),
          version: new Uint8Array(Buffer.from(params.version, "utf8")),
          schedule: new Uint8Array(Buffer.from(cronSchedule, "utf8")),
          mrEnclave: Array.from(parseMrEnclave(params.mrEnclave)),
          recentSlot: recentSlot,
          requestsDisabled: params.requestsDisabled ?? false,
          requestsRequireAuthorization:
            params.requestsRequireAuthorization ?? false,
          requestsDefaultSlotsUntilExpiration: numToBN(
            params.requestsDefaultSlotsUntilExpiration,
            1000
          ),
          requestsFee: numToBN(params.requestsFee),
          creatorSeed: Array.from(creatorSeed),
        },
      },
      {
        function: functionAccount.publicKey,
        addressLookupTable: addressLookupTable,
        authority: authorityPubkey,
        quote: enclaveAccount.publicKey,
        attestationQueue: attestationQueueAccount.publicKey,
        payer,
        wallet: escrowWallet.publicKey,
        walletAuthority: escrowWalletAuthority,
        tokenWallet: escrowWallet.tokenWallet,
        state: program.attestationProgramState.publicKey,
        mint: program.mint.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        addressLookupProgram: addressLookupProgram,
      }
    );
    return [
      functionAccount,
      new TransactionObject(
        payer,
        [
          ComputeBudgetProgram.setComputeUnitLimit({ units: 250_000 }),
          instruction,
        ],
        [],
        {
          ...options,
          computeUnitLimit: undefined,
        }
      ),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: FunctionAccountInitParams,
    wallet?: SwitchboardWallet,
    options?: SendTransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createInstruction(
      program,
      program.walletPubkey,
      params,
      wallet,
      options
    );
    const txSignature = await program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  public getEnclaveAccount(): EnclaveAccount {
    return EnclaveAccount.fromSeed(this.program, this.publicKey);
  }

  public async createRequestInstruction(
    payer: PublicKey,
    params: CreateFunctionRequestParams,
    options?: TransactionObjectOptions
  ): Promise<[FunctionRequestAccount, TransactionObject]> {
    // const functionState = await this.loadData();
    const [requestAccount, txnObject] =
      await FunctionRequestAccount.createInstruction(
        this.program,
        payer,
        {
          ...params,
          functionAccount: this,
        },
        options
      );

    return [requestAccount, txnObject];
  }

  public async createRequest(
    params: CreateFunctionRequestParams,
    options?: SendTransactionObjectOptions
  ): Promise<[FunctionRequestAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createRequestInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txSignature = await this.program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  public async setConfigInstruction(
    payer: PublicKey,
    params: FunctionSetConfigParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const functionData = await this.loadData();

    if (params.authority) {
      if (!params.authority.publicKey.equals(functionData.authority)) {
        throw new errors.IncorrectAuthority(
          functionData.authority,
          params.authority.publicKey
        );
      }
    } else {
      if (!payer.equals(functionData.authority)) {
        throw new errors.IncorrectAuthority(functionData.authority, payer);
      }
    }

    const toOptionalBytes = (param: string | undefined): Uint8Array | null => {
      return param ? new Uint8Array(Buffer.from(param, "utf8")) : null;
    };

    const setConfigIxn = types.functionSetConfig(
      this.program,
      {
        params: {
          name: toOptionalBytes(params.name),
          metadata: toOptionalBytes(params.metadata),
          container: toOptionalBytes(params.container),
          containerRegistry: toOptionalBytes(params.containerRegistry),
          version: toOptionalBytes(params.version),
          schedule: toOptionalBytes(params.schedule),
          mrEnclaves: [],
          requestsDisabled: params.requestsDisabled ?? null,
          requestsRequireAuthorization:
            params.requestsRequireAuthorization ?? null,
          requestsDefaultSlotsUntilExpiration:
            params.requestsDefaultSlotsUntilExpiration
              ? new BN(params.requestsDefaultSlotsUntilExpiration)
              : null,
          requestsFee: params.requestsFee ? new BN(params.requestsFee) : null,
        },
      },
      {
        function: this.publicKey,
        quote: this.getEnclaveAccount().publicKey,
        authority: functionData.authority,
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
    params?: FunctionSetConfigParams,
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
    params: SwitchboardWalletFundParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    this.program.verifyAttestation();

    const wallet = await this.wallet;

    const txn = await wallet.fundInstruction(payer, params, options);
    return txn;
  }

  public async fund(
    params: SwitchboardWalletFundParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.fundInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async wrapInstruction(
    payer: PublicKey,
    amount: number,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    this.program.verifyAttestation();

    const wallet = await this.wallet;

    const txn = await wallet.wrapInstruction(payer, amount, options);
    return txn;
  }

  public async wrap(
    amount: number,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.wrapInstruction(
      this.program.walletPubkey,
      amount,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async withdrawInstruction(
    payer: PublicKey,
    amount: number,
    destinationWallet?: PublicKey,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    this.program.verifyAttestation();

    const wallet = await this.wallet;

    const txn = await wallet.withdrawInstruction(
      payer,
      amount,
      destinationWallet,
      options
    );

    return txn;
  }

  public async withdraw(
    amount: number,
    destinationWallet?: PublicKey,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.withdrawInstruction(
      this.program.walletPubkey,
      amount,
      destinationWallet,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public verifyInstructionSync(
    params: FunctionVerifySyncParams
  ): TransactionInstruction {
    const fnEnclaveAccount = this.getEnclaveAccount();
    const wallet = new SwitchboardWallet(this.program, params.escrowWallet);
    const escrowTokenWallet = wallet.tokenWallet;

    return types.functionVerify(
      this.program,
      {
        params: {
          observedTime: params.observedTime,
          nextAllowedTimestamp: params.nextAllowedTimestamp,
          isFailure: params.isFailure,
          mrEnclave: Array.from(params.mrEnclave),
        },
      },
      {
        // fn accounts
        function: this.publicKey,
        authority: params.functionAuthority,
        functionEnclaveSigner: params.functionEnclaveSigner,
        fnQuote: fnEnclaveAccount.publicKey,
        // verifier accounts
        verifierQuote: params.quoteVerifier,
        verifierEnclaveSigner: params.quoteVerifierEnclaveSigner,
        verifierPermission: AttestationPermissionAccount.fromSeed(
          this.program,
          params.attestationQueueAuthority,
          params.attestationQueue,
          params.quoteVerifier
        ).publicKey,
        // token accounts
        escrowWallet: params.escrowWallet,
        escrowTokenWallet: escrowTokenWallet,
        receiver: params.receiver,
        // others
        state: this.program.attestationProgramState.publicKey,
        attestationQueue: params.attestationQueue,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      }
    );
  }

  public async verifyInstruction(
    params: FunctionVerifyParams
  ): Promise<TransactionInstruction> {
    this.program.verifyAttestation();

    const functionData = params.fnState ?? (await this.loadData());

    const wallet = await this.wallet;

    let attestationQueueAuthority = params.attestationQueueAuthority;
    if (!attestationQueueAuthority) {
      const attestationQueueAccount = new AttestationQueueAccount(
        this.program,
        functionData.attestationQueue
      );
      attestationQueueAuthority = (await attestationQueueAccount.loadData())
        .authority;
    }

    const quoteVerifier = await params.verifier.loadData();

    return this.verifyInstructionSync({
      observedTime: params.observedTime,
      nextAllowedTimestamp: params.nextAllowedTimestamp,
      isFailure: params.isFailure,
      mrEnclave: params.mrEnclave,

      escrowWallet: wallet.publicKey,
      functionAuthority: functionData.authority,
      functionEnclaveSigner: params.functionEnclaveSigner,

      attestationQueue: functionData.attestationQueue,
      attestationQueueAuthority: attestationQueueAuthority,

      quoteVerifier: params.verifier.publicKey,
      quoteVerifierEnclaveSigner: quoteVerifier.enclaveSigner,

      receiver: params.receiver,
    });
  }

  public async verifyTransaction(
    params: FunctionVerifyParams
  ): Promise<anchor.web3.VersionedTransaction> {
    const fnState = await this.loadData();
    const ixn = await this.verifyInstruction({ ...params, fnState });

    const lookupTable = await this.program.connection
      .getAddressLookupTable(fnState.addressLookupTable)
      .then((res) => res.value!);

    const messageV0 = new anchor.web3.TransactionMessage({
      payerKey: this.program.walletPubkey,
      recentBlockhash: (await this.program.connection.getLatestBlockhash())
        .blockhash,
      instructions: [ixn], // note this is an array of instructions
    }).compileToV0Message([lookupTable]);
    const transactionV0 = new anchor.web3.VersionedTransaction(messageV0);

    return transactionV0;
  }

  public async verify(
    params: FunctionVerifyParams,
    signers: {
      quoteVerifier: Keypair;
      fnEnclaveSigner: Keypair;
    },
    options?: SendOptions
  ): Promise<TransactionSignature> {
    const transactionV0 = await this.verifyTransaction(params);

    transactionV0.sign([signers.quoteVerifier]);
    transactionV0.sign([signers.fnEnclaveSigner]);
    transactionV0.sign([this.program.wallet.payer]);

    const rawTxn = transactionV0.serialize();

    console.log(`functionVerify bytes: ${rawTxn.byteLength}`);

    const txnSignature = await this.program.connection.sendEncodedTransaction(
      Buffer.from(rawTxn).toString("base64"),
      options
    );
    return txnSignature;
  }

  public async triggerInstruction(
    payer: PublicKey,
    params?: FunctionTriggerParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const functionData = await this.loadData();

    // verify authority is correct
    if (params && params?.authority) {
      if (!params.authority.publicKey.equals(functionData.authority)) {
        throw new errors.IncorrectAuthority(
          functionData.authority,
          params.authority.publicKey
        );
      }
    } else {
      if (!payer.equals(functionData.authority)) {
        throw new errors.IncorrectAuthority(functionData.authority, payer);
      }
    }

    const functionTrigger = types.functionTrigger(
      this.program,
      { params: {} },
      {
        function: this.publicKey,
        authority: functionData.authority,
        attestationQueue: functionData.attestationQueue,
      }
    );

    return new TransactionObject(
      payer,
      [functionTrigger],
      params?.authority ? [params.authority] : []
    );
  }

  public async trigger(
    params?: FunctionTriggerParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.triggerInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public static decodeAddressLookup(lookupTable: AddressLookupTableAccount) {
    const addresses = lookupTable.state.addresses;
    if (addresses.length < 18) {
      throw new Error(`Failed to decode address lookup table`);
    }

    const systemProgram = addresses[0]!;
    if (!systemProgram.equals(anchor.web3.SystemProgram.programId)) {
      throw new Error("AddressLookupMismatch");
    }

    const tokenProgram = addresses[1]!;
    if (!tokenProgram.equals(anchor.utils.token.TOKEN_PROGRAM_ID)) {
      throw new Error("AddressLookupMismatch");
    }

    const assocatedTokenProgram = addresses[2]!;
    if (
      !assocatedTokenProgram.equals(anchor.utils.token.ASSOCIATED_PROGRAM_ID)
    ) {
      throw new Error("AddressLookupMismatch");
    }

    const sysVarRent = addresses[3]!;
    if (!sysVarRent.equals(anchor.web3.SYSVAR_RENT_PUBKEY)) {
      throw new Error("AddressLookupMismatch");
    }

    const sysVarRecentBlockhashes = addresses[4]!;
    if (
      !sysVarRecentBlockhashes.equals(
        anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY
      )
    ) {
      throw new Error("AddressLookupMismatch");
    }

    const sysVarInstructions = addresses[5]!;
    if (!sysVarInstructions.equals(anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY)) {
      throw new Error("AddressLookupMismatch");
    }

    const sysVarSlotHashes = addresses[6]!;
    if (!sysVarSlotHashes.equals(anchor.web3.SYSVAR_SLOT_HASHES_PUBKEY)) {
      throw new Error("AddressLookupMismatch");
    }

    const sysVarSlotHistory = addresses[7]!;
    if (!sysVarSlotHistory.equals(anchor.web3.SYSVAR_SLOT_HISTORY_PUBKEY)) {
      throw new Error("AddressLookupMismatch");
    }

    const switchboardProgram = addresses[8]!;
    if (!switchboardProgram.equals(SB_V2_PID)) {
      throw new Error("AddressLookupMismatch");
    }

    const attestationProgram = addresses[9]!;
    if (!attestationProgram.equals(SB_ATTESTATION_PID)) {
      throw new Error("AddressLookupMismatch");
    }

    // switchboard accounts, not worth the network calls
    const statePubkey = addresses[10]!;
    const attestationQueuePubkey = addresses[11]!;
    const functionPubkey = addresses[12]!;
    const functionAuthorityPubkey = addresses[13]!;
    const fnQuote = addresses[14]!;
    const mintPubkey = addresses[15]!;
    const walletPubkey = addresses[16]!;
    const escrowPubkey = addresses[17]!;

    return {
      systemProgram, // 1
      tokenProgram,
      assocatedTokenProgram,
      sysVarRent,
      sysVarRecentBlockhashes, // 5
      sysVarInstructions,
      sysVarSlotHashes,
      sysVarSlotHistory,
      switchboardProgram,
      attestationProgram, // 10
      statePubkey,
      attestationQueuePubkey,
      functionPubkey,
      functionAuthorityPubkey,
      fnQuote, // 15
      mintPubkey,
      walletPubkey,
      escrowPubkey, // 18
    };
  }
}
