import * as types from '../attestation-generated';
import * as errors from '../errors';
import { AttestationQueueAccount } from '../index';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';

import { Account } from './account';

import * as anchor from '@coral-xyz/anchor';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';

/**
 *  Parameters for initializing an {@linkcode QuoteAccount}
 */
export interface QuoteAccountInitParams {
  cid: Uint8Array;
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
}
/**
 *  Parameters for an {@linkcode types.quoteHeartbeat} instruction.
 */
export interface QuoteHeartbeatParams {}
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
  mrEnclave: Uint8Array;
}
/**
 * @TODO: Documentation
 *
 * Data: {@linkcode types.QuoteAccountData}
 */
export class QuoteAccount extends Account<types.QuoteAccountData> {
  static accountName = 'QuoteAccountData';

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

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: QuoteAccountInitParams,
    options?: TransactionObjectOptions
  ): Promise<[QuoteAccount, TransactionObject]> {
    const quoteKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(quoteKeypair);

    const queueData = await params.queueAccount.loadData();
    const cid = Array.from(params.cid).concat(Array(64).fill(0)).slice(0, 64);
    const instruction = types.quoteInit(
      program,
      { params: { cid } },
      {
        quote: quoteKeypair.publicKey,
        attestationQueue: params.queueAccount.publicKey,
        queueAuthority: queueData.authority,
        payer,
        systemProgram: SystemProgram.programId,
      }
    );
    return [
      new QuoteAccount(program, quoteKeypair.publicKey),
      new TransactionObject(payer, [instruction], [quoteKeypair], options),
    ];
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
    throw new errors.AccountNotFoundError('Quote', this.publicKey);
  }

  public async heartbeatInstruction(
    payer: PublicKey,
    params: QuoteHeartbeatParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const quoteData = await this.loadData();
    const [queueAccount, queueData] = await AttestationQueueAccount.load(
      this.program,
      quoteData.attestationQueue
    );
    const instruction = types.quoteHeartbeat(
      this.program,
      { params },
      {
        quote: this.publicKey,
        attestationQueue: queueAccount.publicKey,
        queueAuthority: queueData.authority,
        gcNode: PublicKey.default, // @TODO: gcNode publicKey
        permission: PublicKey.default, // @TODO: permission publicKey
      }
    );
    return new TransactionObject(payer, [instruction], [], options);
  }

  public async heartbeat(
    params: QuoteHeartbeatParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.heartbeatInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then(txn => this.program.signAndSend(txn, options));
  }

  public async verifyInstruction(
    payer: PublicKey,
    params: QuoteVerifyParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const quoteData = await this.loadData();
    const instruction = types.quoteVerify(
      this.program,
      {
        params: {
          timestamp: params.timestamp,
          mrEnclave: Array.from(params.mrEnclave),
        },
      },
      {
        quote: this.publicKey,
        verifier: PublicKey.default, // @TODO: verifier publicKey
        attestationQueue: quoteData.attestationQueue,
      }
    );
    return new TransactionObject(payer, [instruction], [], options);
  }

  public async verify(
    params: QuoteVerifyParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.verifyInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then(txn => this.program.signAndSend(txn, options));
  }
}
