import { Account } from "../accounts/account.js";
import * as types from "../attestation-generated/index.js";
import * as errors from "../errors.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { RawMrEnclave } from "../types.js";
import { parseMrEnclave } from "../utils.js";

import {
  AttestationPermissionAccount,
  AttestationQueueAccount,
} from "./index.js";

import * as anchor from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";

export const QUOTE_SEED: string = "QuoteAccountData";

/**
 *  Parameters for initializing an {@linkcode QuoteAccount}
 */
export interface QuoteAccountInitParams {
  /**
   * Key to lookup the buffer data on IPFS or an alternative decentralized storage solution.
   */
  registryKey: Uint8Array;
  /**
   *  The queue to which this function account will be linked
   */
  queueAccount: AttestationQueueAccount;
  /**
   *  A keypair to be used to address this account
   *
   *  @default Keypair.generate()
   */
  keypair?: Keypair;
  /**
   *  An authority to be used to control this account.
   *
   *  @default payer
   */
  owner?: PublicKey;
}
/**
 *  Parameters for an {@linkcode types.quoteHeartbeat} instruction.
 */
export interface QuoteHeartbeatSyncParams {
  gcOracle: PublicKey;
  attestationQueue: PublicKey;
  permission: [AttestationPermissionAccount, number];
  queueAuthority: PublicKey;
}

/**
 *  Parameters for an {@linkcode types.quoteHeartbeat} instruction.
 */
export type QuoteHeartbeatParams = Partial<QuoteHeartbeatSyncParams> & {
  keypair: Keypair;
} & Partial<{
    quote: types.QuoteAccountData;
    queue: types.AttestationQueueAccountData;
  }>;

/**
 *  Parameters for an {@linkcode types.quoteVerify} instruction.
 */
export interface QuoteVerifyParams {
  /**
   *  @TODO: Docs for timestamp
   */
  timestamp: anchor.BN;
  /**
   *  @TODO: Docs for mrEnclave
   */
  mrEnclave: RawMrEnclave;

  /**
   * Keypair of the verifier that has a valid MRENCLAVE quote
   */
  verifierKeypair: Keypair;
}
/**
 * @TODO: Documentation
 *
 * Data: {@linkcode types.QuoteAccountData}
 */
export class QuoteAccount extends Account<types.QuoteAccountData> {
  static accountName = "QuoteAccountData";

  /**
   *  Load an existing {@linkcode QuoteAccount} with its current on-chain state
   */
  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[QuoteAccount, types.QuoteAccountData]> {
    const quoteAccount = new QuoteAccount(program, address);
    const state = await quoteAccount.loadData();
    return [quoteAccount, state];
  }

  /**
   * Finds the {@linkcode QuoteAccount} from the seed from which it was generated.
   *
   * Only applicable for QuoteAccounts tied to a {@linkcode FunctionAccount}. Quotes can also be generated from a keypair.
   *
   * @return QuoteAccount and PDA bump tuple.
   */
  public static fromSeed(
    program: SwitchboardProgram,
    functionPubkey: PublicKey
  ): [QuoteAccount, number] {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(QUOTE_SEED), functionPubkey.toBytes()],
      program.attestationProgramId
    );
    return [new QuoteAccount(program, publicKey), bump];
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: QuoteAccountInitParams,
    options?: TransactionObjectOptions
  ): Promise<[QuoteAccount, TransactionObject]> {
    const quoteKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(quoteKeypair);

    const queueData = await params.queueAccount.loadData();

    const registryKey = Array.from(params.registryKey)
      .concat(Array(64).fill(0))
      .slice(0, 64);

    const instruction = types.quoteInit(
      program,
      { params: { registryKey } },
      {
        quote: quoteKeypair.publicKey,
        attestationQueue: params.queueAccount.publicKey,
        queueAuthority: queueData.authority,
        payer,
        systemProgram: SystemProgram.programId,
        owner: params.owner ?? payer,
      }
    );
    return [
      new QuoteAccount(program, quoteKeypair.publicKey),
      new TransactionObject(payer, [instruction], [quoteKeypair], options),
    ];
  }

  public getPermissionAccount(
    queuePubkey: PublicKey,
    queueAuthority: PublicKey,
    owner: PublicKey
  ): [AttestationPermissionAccount, number] {
    return AttestationPermissionAccount.fromSeed(
      this.program,
      queueAuthority,
      queuePubkey,
      owner
    );
  }

  static getVerificationStatus(
    state: types.QuoteAccountData
  ): types.VerificationStatusKind {
    switch (state.verificationStatus) {
      case types.VerificationStatus.None.discriminator:
        return new types.VerificationStatus.None();
      case types.VerificationStatus.VerificationPending.discriminator:
        return new types.VerificationStatus.VerificationPending();
      case types.VerificationStatus.VerificationFailure.discriminator:
        return new types.VerificationStatus.VerificationFailure();
      case types.VerificationStatus.VerificationSuccess.discriminator:
        return new types.VerificationStatus.VerificationSuccess();
      case types.VerificationStatus.VerificationOverride.discriminator:
        return new types.VerificationStatus.VerificationOverride();
    }

    throw new Error(
      `Failed to get the verification status, expected [${types.VerificationStatus.None.discriminator}, ${types.VerificationStatus.VerificationPending.discriminator}, ${types.VerificationStatus.VerificationFailure.discriminator}, ${types.VerificationStatus.VerificationSuccess.discriminator}], or ${types.VerificationStatus.VerificationOverride.discriminator}], received ${state.verificationStatus}`
    );
  }

  public static async create(
    program: SwitchboardProgram,
    params: QuoteAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[QuoteAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createInstruction(
      program,
      program.walletPubkey,
      params,
      options
    );
    const txSignature = await program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  /**
   * Get the size of an {@linkcode QuoteAccount} on-chain.
   */
  public readonly size = this.program.attestationAccount.quoteAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.QuoteAccountData} stored in this account.
   */
  public async loadData(): Promise<types.QuoteAccountData> {
    const data = await types.QuoteAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError("Quote", this.publicKey);
  }

  public heartbeatInstruction(params: {
    gcOracle: PublicKey;
    attestationQueue: PublicKey;
    permission: [AttestationPermissionAccount, number];
    queueAuthority: PublicKey;
  }): TransactionInstruction {
    const [permissionAccount, permissionBump] = params.permission;
    const instruction = types.quoteHeartbeat(
      this.program,
      { params: params ?? {} },
      {
        quote: this.publicKey,
        attestationQueue: params.attestationQueue,
        queueAuthority: params.queueAuthority,
        gcNode: params.gcOracle,
        permission: permissionAccount.publicKey,
      }
    );
    return instruction;
  }

  public async heartbeat(
    params: QuoteHeartbeatParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const quote = params.quote ?? (await this.loadData());
    const queue =
      params.queue ??
      (await new AttestationQueueAccount(
        this.program,
        quote.attestationQueue
      ).loadData());

    const quotes = queue.data.slice(0, queue.dataLen);

    let lastPubkey = this.publicKey;
    if (quotes.length !== 0 && quotes.length > queue.gcIdx) {
      lastPubkey = quotes[queue.gcIdx];
    }

    const heartbeatIxn = this.heartbeatInstruction({
      queueAuthority: queue.authority,
      permission:
        params.permission ??
        this.getPermissionAccount(
          quote.attestationQueue,
          queue.authority,
          quote.owner
        ),
      gcOracle: lastPubkey,
      attestationQueue: quote.attestationQueue,
    });

    const heartbeatTxn = new TransactionObject(
      this.program.walletPubkey,
      [heartbeatIxn],
      [params.keypair],
      options
    );

    const txnSignature = await this.program.signAndSend(heartbeatTxn, options);
    return txnSignature;
  }

  public async verifyInstruction(
    payer: PublicKey,
    params: QuoteVerifyParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const quoteData = await this.loadData();

    const attestationQueueAccount = new AttestationQueueAccount(
      this.program,
      quoteData.attestationQueue
    );
    const attestationQueue = await attestationQueueAccount.loadData();
    const verifierIdx = attestationQueue.data
      .slice(0, attestationQueue.dataLen)
      .findIndex((pubkey) => pubkey.equals(params.verifierKeypair.publicKey));
    if (verifierIdx === -1) {
      throw new Error(`Verifier not found on the attestation queue`);
    }

    const instruction = types.quoteVerify(
      this.program,
      {
        params: {
          timestamp: params.timestamp,
          mrEnclave: Array.from(parseMrEnclave(params.mrEnclave)),
          idx: verifierIdx,
        },
      },
      {
        quote: this.publicKey,
        verifier: params.verifierKeypair.publicKey,
        attestationQueue: quoteData.attestationQueue,
      }
    );
    return new TransactionObject(
      payer,
      [instruction],
      [params.verifierKeypair],
      options
    );
  }

  public async verify(
    params: QuoteVerifyParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.verifyInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }
}
