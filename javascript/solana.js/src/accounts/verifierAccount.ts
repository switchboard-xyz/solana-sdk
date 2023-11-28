import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import type { SwitchboardProgram } from "../SwitchboardProgram.js";
import type {
  SendTransactionObjectOptions,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { TransactionObject } from "../TransactionObject.js";
import { parseRawBuffer } from "../utils.js";

import { Account } from "./account.js";
import {
  AttestationPermissionAccount,
  AttestationQueueAccount,
} from "./index.js";

import type * as anchor from "@coral-xyz/anchor";
import type {
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { parseRawMrEnclave, type RawBuffer } from "@switchboard-xyz/common";

export const QUOTE_SEED: string = "QuoteAccountData";

/**
 *  Parameters for initializing an {@linkcode VerifierAccount}
 */
export interface VerifierAccountInitParams {
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
  authority?: PublicKey;
}

/**
 *  Parameters for an {@linkcode types.quoteHeartbeat} instruction.
 */
export interface VerifierHeartbeatSyncParams {
  gcOracle: PublicKey;
  attestationQueue: PublicKey;
  permission: AttestationPermissionAccount;
  queueAuthority: PublicKey;
}

/**
 *  Parameters for an {@linkcode types.quoteHeartbeat} instruction.
 */
export type VerifierHeartbeatParams = Partial<VerifierHeartbeatSyncParams> & {
  enclaveSigner: Keypair;
} & Partial<{
    quote: types.VerifierAccountData;
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
  mrEnclave: RawBuffer;

  /**
   * Keypair of the enclave signer generated in the verifiers secure enclave
   */
  enclaveSigner?: Keypair;

  quote: VerifierAccount;
  quoteState?: types.VerifierAccountData;
}

/**
 *  Parameters for an {@linkcode types.quoteRotate} instruction.
 */
export interface VerifierRotateParams {
  authority?: Keypair;
  enclaveSigner: Keypair;
  registryKey: string | Buffer | Uint8Array;
}

/**
 * Account type representing a Switchboard Attestation quote.
 *
 * Data: {@linkcode types.VerifierAccountData}
 */
export class VerifierAccount extends Account<types.VerifierAccountData> {
  static accountName = "VerifierAccountData";

  /**
   *  Load an existing {@linkcode VerifierAccount} with its current on-chain state
   */
  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[VerifierAccount, types.VerifierAccountData]> {
    const verifierAccount = new VerifierAccount(program, address);
    const state = await verifierAccount.loadData();
    return [verifierAccount, state];
  }

  /**
   * Finds the {@linkcode VerifierAccount} from the seed from which it was generated.
   *
   * Only applicable for VerifierAccounts tied to a {@linkcode FunctionAccount}. Enclaves can also be generated from a keypair.
   *
   * @return VerifierAccount and PDA bump tuple.
   */
  public static fromSeed(
    program: SwitchboardProgram,
    functionPubkey: PublicKey
  ): VerifierAccount {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(QUOTE_SEED), functionPubkey.toBytes()],
      program.attestationProgramId
    );
    return new VerifierAccount(program, publicKey);
  }

  /**
   * Create a transaction object to initialize a quote account.
   */
  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: VerifierAccountInitParams,
    options?: TransactionObjectOptions
  ): Promise<[VerifierAccount, TransactionObject]> {
    const verifierKeypair = params.keypair ?? Keypair.generate();
    await program.verifyNewKeypair(verifierKeypair);

    const queueData = await params.queueAccount.loadData();

    const registryKey = Array.from(params.registryKey)
      .concat(Array(64).fill(0))
      .slice(0, 64);

    const instruction = types.verifierInit(
      program,
      { params: { registryKey } },
      {
        verifier: verifierKeypair.publicKey,
        attestationQueue: params.queueAccount.publicKey,
        queueAuthority: queueData.authority,
        authority: params.authority ?? payer,
        payer,
        systemProgram: SystemProgram.programId,
      }
    );
    return [
      new VerifierAccount(program, verifierKeypair.publicKey),
      new TransactionObject(payer, [instruction], [verifierKeypair], options),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: VerifierAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[VerifierAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createInstruction(
      program,
      program.walletPubkey,
      params,
      options
    );
    const txSignature = await program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  public getPermissionAccount(
    queuePubkey: PublicKey,
    queueAuthority: PublicKey,
    owner: PublicKey
  ): AttestationPermissionAccount {
    return AttestationPermissionAccount.fromSeed(
      this.program,
      queueAuthority,
      queuePubkey,
      owner
    );
  }

  static getVerificationStatus(
    state: types.VerifierAccountData
  ): types.VerificationStatusKind {
    switch (state.enclave.verificationStatus) {
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
      `Failed to get the verification status, expected [${types.VerificationStatus.None.discriminator}, ${types.VerificationStatus.VerificationPending.discriminator}, ${types.VerificationStatus.VerificationFailure.discriminator}, ${types.VerificationStatus.VerificationSuccess.discriminator}], or ${types.VerificationStatus.VerificationOverride.discriminator}], received ${state.enclave.verificationStatus}`
    );
  }

  /**
   *  Retrieve and decode the {@linkcode types.VerifierAccountData} stored in this account.
   */
  public async loadData(): Promise<types.VerifierAccountData> {
    const data = await types.VerifierAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError("Verifier", this.publicKey);
  }

  public heartbeatInstruction(params: {
    gcOracle: PublicKey;
    attestationQueue: PublicKey;
    permission: AttestationPermissionAccount;
    queueAuthority: PublicKey;
    enclaveSigner: PublicKey;
  }): TransactionInstruction {
    const instruction = types.verifierHeartbeat(
      this.program,
      { params: {} },
      {
        verifier: this.publicKey,
        verifierSigner: params.enclaveSigner,
        attestationQueue: params.attestationQueue,
        queueAuthority: params.queueAuthority,
        gcNode: params.gcOracle,
        permission: params.permission.publicKey,
      }
    );
    return instruction;
  }

  public async heartbeat(
    params: VerifierHeartbeatParams,
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
          this.publicKey
        ),
      gcOracle: lastPubkey,
      attestationQueue: quote.attestationQueue,
      enclaveSigner: params.enclaveSigner.publicKey,
    });

    const heartbeatTxn = new TransactionObject(
      this.program.walletPubkey,
      [heartbeatIxn],
      [params.enclaveSigner],
      options
    );

    const txnSignature = await this.program.signAndSend(heartbeatTxn, options);
    return txnSignature;
  }

  public async rotateInstruction(
    payer: PublicKey,
    params: VerifierRotateParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const registryKey = parseRawBuffer(params.registryKey, 64);

    const quoteData = await this.loadData();

    const authority = params.authority ? params.authority.publicKey : payer;
    if (!quoteData.authority.equals(authority)) {
      throw new errors.IncorrectAuthority(quoteData.authority, authority);
    }

    const rotateIxn = types.verifierQuoteRotate(
      this.program,
      {
        params: { registryKey: [...registryKey].slice(0, 64) },
      },
      {
        verifier: this.publicKey,
        authority: authority,
        enclaveSigner: params.enclaveSigner.publicKey,
        attestationQueue: quoteData.attestationQueue,
      }
    );

    const rotateTxn: TransactionObject = new TransactionObject(
      payer,
      [rotateIxn],
      params.authority
        ? [params.authority, params.enclaveSigner]
        : [params.enclaveSigner],
      options
    );
    return rotateTxn;
  }

  public async rotate(
    params: VerifierRotateParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.rotateInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async verifyInstruction(
    payer: PublicKey,
    params: QuoteVerifyParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const verifierState = await this.loadData();

    const signers: Keypair[] = [];
    if (params.enclaveSigner) {
      if (
        !params.enclaveSigner.publicKey.equals(
          verifierState.enclave.enclaveSigner
        )
      ) {
        throw new Error(
          `SignerMismatch, expected ${verifierState.enclave.enclaveSigner}, received ${params.enclaveSigner.publicKey}`
        );
      }
      signers.push(params.enclaveSigner);
    }

    const attestationQueueAccount = new AttestationQueueAccount(
      this.program,
      verifierState.attestationQueue
    );

    const attestationQueue = await attestationQueueAccount.loadData();
    const verifierIdx = attestationQueue.data
      .slice(0, attestationQueue.dataLen)
      .findIndex((pubkey) => pubkey.equals(this.publicKey));
    if (verifierIdx === -1) {
      throw new Error(`Verifier not found on the attestation queue`);
    }

    const instruction = types.verifierQuoteVerify(
      this.program,
      {
        params: {
          timestamp: params.timestamp,
          mrEnclave: Array.from(parseRawMrEnclave(params.mrEnclave)),
          idx: verifierIdx,
        },
      },
      {
        quote: params.quote.publicKey,
        enclaveSigner: verifierState.enclave.enclaveSigner,
        verifier: this.publicKey,
        attestationQueue: verifierState.attestationQueue,
      }
    );
    return new TransactionObject(payer, [instruction], signers, options);
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
