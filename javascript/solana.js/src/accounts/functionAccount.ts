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
import { parseCronSchedule, parseMrEnclave } from "../utils.js";

import {
  AttestationPermissionAccount,
  AttestationQueueAccount,
  EnclaveAccount,
  FunctionRequestAccount,
  FunctionRequestAccountInitParams,
} from "./index.js";

import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  AddressLookupTableAccount,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { BN, toUtf8 } from "@switchboard-xyz/common";

/**
 *  Parameters for initializing a {@linkcode FunctionAccount}
 */
export interface FunctionAccountInitParams {
  name?: string;
  metadata?: string;
  container: string;
  version: string;
  containerRegistry?: string;
  schedule: string;

  mrEnclave: Buffer | Uint8Array | number[];
  attestationQueue: AttestationQueueAccount;

  /**
   *  A keypair to be used to address this account.
   *
   *  @default Keypair.generate()
   */
  keypair?: Keypair;
  /**
   *  An authority to be used to control this account.
   *
   *  @default payer
   */
  authority?: Keypair;
}

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

  authority?: Keypair;
}

/**
 *  Parameters for an {@linkcode types.functionFund} instruction.
 */
export interface FunctionFundParams {
  /**
   *  The amount to fund this function with.
   */
  fundAmount: number;
  /**
   *  _OPTIONAL_ The token account to fund the lease from. Defaults to payer's associated token account.
   */
  funderTokenWallet?: PublicKey;
  /**
   *  _OPTIONAL_ The funderTokenWallet authority if it differs from the provided payer.
   */
  funderAuthority?: Keypair;
}

interface FunctionWithdrawBaseParams {
  amount: number | "all";
  unwrap: boolean;
}

export interface FunctionWithdrawUnwrapParams
  extends FunctionWithdrawBaseParams {
  unwrap: true;
}

export interface FunctionWithdrawWalletParams
  extends FunctionWithdrawBaseParams {
  unwrap: false;
  withdrawWallet: PublicKey;
  withdrawAuthority?: Keypair;
}

/**
 *  Parameters for an {@linkcode types.functionWithdraw} instruction.
 */
export type FunctionWithdrawParams =
  | FunctionWithdrawUnwrapParams
  | FunctionWithdrawWalletParams;

/**
 *  Parameters for an {@linkcode types.functionVerify} instruction.
 */

export interface FunctionVerifyParams {
  observedTime: anchor.BN;
  nextAllowedTimestamp: anchor.BN;
  isFailure: boolean;
  mrEnclave: Uint8Array;
  verifier: EnclaveAccount;
  functionEnclaveSigner: PublicKey;
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

  /**
   *  Retrieve and decode the {@linkcode types.FunctionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.FunctionAccountData> {
    const data = await types.FunctionAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError("Function", this.publicKey);
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
    options?: TransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionObject]> {
    program.verifyAttestation();

    const functionKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(functionKeypair);

    const authority = params.authority ? params.authority.publicKey : payer;

    const cronSchedule = parseCronSchedule(params.schedule);

    const attestationQueueAccount = params.attestationQueue;
    const attestationQueue = await attestationQueueAccount.loadData();

    const recentSlot = new BN(
      (
        await program.connection.getLatestBlockhashAndContext({
          commitment: "finalized",
        })
      ).context.slot
    );
    const addressLookupProgram = new PublicKey(
      "AddressLookupTab1e1111111111111111111111111"
    );
    const [addressLookupTable] = PublicKey.findProgramAddressSync(
      [authority.toBuffer(), recentSlot.toBuffer("le", 8)],
      addressLookupProgram
    );

    // get PDA accounts
    const functionAccount = new FunctionAccount(
      program,
      functionKeypair.publicKey
    );

    const [enclaveAccount] = functionAccount.getEnclaveAccount();
    const escrow = functionAccount.getEscrow();

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
          requestsDisabled: false,
          requestsRequireAuthorization: false,
          requestsDefaultSlotsUntilExpiration: new anchor.BN(1000),
          requestsRequestFee: new anchor.BN(0),
        },
      },
      {
        function: functionAccount.publicKey,
        addressLookupTable: addressLookupTable,
        authority: authority,
        quote: enclaveAccount.publicKey,
        attestationQueue: attestationQueueAccount.publicKey,
        escrow,
        state: program.attestationProgramState.publicKey,
        mint: program.mint.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        payer,
        systemProgram: SystemProgram.programId,
        addressLookupProgram: addressLookupProgram,
      }
    );
    return [
      functionAccount,
      new TransactionObject(
        payer,
        [instruction],
        params.authority
          ? [params.authority, functionKeypair]
          : [functionKeypair],
        options
      ),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: FunctionAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createInstruction(
      program,
      program.walletPubkey,
      params,
      options
    );
    const txSignature = await program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  public getEnclaveAccount(): [EnclaveAccount, number] {
    return EnclaveAccount.fromSeed(this.program, this.publicKey);
  }

  public getEscrow(): PublicKey {
    return this.program.mint.getAssociatedAddress(this.publicKey);
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
          requestsDisabled: false,
          requestsRequireAuthorization: false,
          requestsDefaultSlotsUntilExpiration: new anchor.BN(1000),
          requestsRequestFee: new anchor.BN(0),
        },
      },
      {
        function: this.publicKey,
        quote: this.getEnclaveAccount()[0].publicKey,
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
    params: FunctionFundParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    this.program.verifyAttestation();

    const fundTokenAmountBN = this.program.mint.toTokenAmountBN(
      params.fundAmount
    );

    // TODO: Create funder token wallet if it doesnt exist
    const funderAuthority = params.funderAuthority
      ? params.funderAuthority.publicKey
      : payer;
    const funderTokenWallet =
      params.funderTokenWallet ??
      this.program.mint.getAssociatedAddress(funderAuthority);

    const functionData = await this.loadData();
    const instruction = types.functionFund(
      this.program,
      { params: { amount: fundTokenAmountBN } },
      {
        function: this.publicKey,
        attestationQueue: functionData.attestationQueue,
        escrow: this.getEscrow(),
        funder: funderTokenWallet,
        funderAuthority: funderAuthority,
        state: this.program.attestationProgramState.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      }
    );
    return new TransactionObject(payer, [instruction], [], options);
  }

  public async fund(
    params: FunctionFundParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.fundInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async withdrawInstruction(
    payer: PublicKey,
    params: FunctionWithdrawParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    this.program.verifyAttestation();

    const functionData = await this.loadData();
    const [queueAccount, queueData] = await AttestationQueueAccount.load(
      this.program,
      functionData.attestationQueue
    );

    const withdrawAmount: number = await (async () => {
      const minRequiredBalance = queueData.reward * 2;
      const escrowBalance = await spl
        .getAccount(this.program.connection, this.getEscrow())
        .then((escrow) => this.program.mint.fromTokenAmount(escrow.amount));
      const maxWithdrawAmount = escrowBalance - minRequiredBalance;

      if (params.amount === "all") return maxWithdrawAmount;
      return Math.min(params.amount, maxWithdrawAmount);
    })();

    if (params.unwrap) {
      const ephemeralWallet = Keypair.generate();

      const instructions: TransactionInstruction[] = [
        // initialize space for ephemeral token account
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: ephemeralWallet.publicKey,
          lamports:
            await this.program.connection.getMinimumBalanceForRentExemption(
              spl.ACCOUNT_SIZE
            ),
          space: spl.ACCOUNT_SIZE,
          programId: spl.TOKEN_PROGRAM_ID,
        }),
        // initialize ephemeral token account
        spl.createInitializeAccountInstruction(
          ephemeralWallet.publicKey,
          this.program.mint.address,
          payer,
          spl.TOKEN_PROGRAM_ID
        ),
        // perform withdraw
        types.functionWithdraw(
          this.program,
          {
            params: {
              amount: this.program.mint.toTokenAmountBN(withdrawAmount),
            },
          },
          {
            function: this.publicKey,
            attestationQueue: queueAccount.publicKey,
            escrow: this.getEscrow(),
            authority: payer,
            receiver: ephemeralWallet.publicKey,
            state: this.program.attestationProgramState.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          }
        ),
        // close ephemeral token account
        spl.createCloseAccountInstruction(
          ephemeralWallet.publicKey,
          payer,
          payer
        ),
      ];

      return new TransactionObject(
        payer,
        instructions,
        [ephemeralWallet],
        options
      );
    } else {
      return new TransactionObject(
        payer,
        [
          types.functionWithdraw(
            this.program,
            {
              params: {
                amount: this.program.mint.toTokenAmountBN(withdrawAmount),
              },
            },
            {
              function: this.publicKey,
              attestationQueue: queueAccount.publicKey,
              escrow: this.getEscrow(),
              authority:
                "withdrawAuthority" in params && params.withdrawAuthority
                  ? params.withdrawAuthority.publicKey
                  : payer,
              receiver:
                "withdrawWallet" in params && params.withdrawWallet
                  ? params.withdrawWallet
                  : this.program.mint.getAssociatedAddress(payer),
              state: this.program.attestationProgramState.publicKey,
              tokenProgram: TOKEN_PROGRAM_ID,
            }
          ),
        ],
        "withdrawAuthority" in params && params.withdrawAuthority
          ? [params.withdrawAuthority]
          : [],
        options
      );
    }
  }

  public async withdraw(
    params: FunctionWithdrawParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.withdrawInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
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

  public async verifyInstruction(
    payer: PublicKey,
    params: FunctionVerifyParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    this.program.verifyAttestation();

    const functionData = await this.loadData();
    const attestationQueueAccount = new AttestationQueueAccount(
      this.program,
      functionData.attestationQueue
    );
    const attestationQueue = await attestationQueueAccount.loadData();

    const fnEnclaveAccount = this.getEnclaveAccount()[0];

    const verifierPermissionAccount = AttestationPermissionAccount.fromSeed(
      this.program,
      attestationQueue.authority,
      attestationQueueAccount.publicKey,
      payer
    )[0];

    const quoteVerifier = await params.verifier.loadData();
    if (!quoteVerifier.authority.equals(payer)) {
      throw new Error(
        `The verifier owner must be the payer of this transaction, expected ${quoteVerifier.authority}, received ${payer}`
      );
    }

    const receiver = await this.program.mint.getOrCreateAssociatedUser(payer);

    const instruction = types.functionVerify(
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
        function: this.publicKey,
        functionEnclaveSigner: params.functionEnclaveSigner,
        fnQuote: fnEnclaveAccount.publicKey,
        verifierQuote: params.verifier.publicKey,
        attestationQueue: functionData.attestationQueue,
        escrow: this.getEscrow(),
        receiver: receiver,
        verifierPermission: verifierPermissionAccount.publicKey,
        state: this.program.attestationProgramState.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        verifierEnclaveSigner: PublicKey.default, // TODO: update with correct account
      }
    );
    return new TransactionObject(payer, [instruction], [], options);
  }

  public async verify(
    params: FunctionVerifyParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.verifyInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
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
    if (addresses.length !== 16) {
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
    const escrowPubkey = addresses[13]!;
    const fnPermission = addresses[14]!;
    const fnQuote = addresses[15]!;

    return {
      systemProgram,
      tokenProgram,
      assocatedTokenProgram,
      sysVarRent,
      sysVarRecentBlockhashes,
      sysVarInstructions,
      sysVarSlotHashes,
      sysVarSlotHistory,
      switchboardProgram,
      attestationProgram,
      statePubkey,
      attestationQueuePubkey,
      functionPubkey,
      escrowPubkey,
      fnPermission,
      fnQuote,
    };
  }
}
