import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';
import { Account } from '../accounts/account';
import * as errors from '../errors';
import * as types from '../sgx-generated';
import { QueueAccount } from '..';

/**
 *  Parameters for initializing an {@linkcode QuoteAccount}
 */
export interface QuoteAccountInitParams {
  cid: Uint8Array;
  /**
   *  The queue to which this function account will be linked
   */
  queueAccount: QueueAccount;
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
  authority?: Keypair;
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
    const authority = params.authority ? params.authority.publicKey : payer;
    const account = new QuoteAccount(program, quoteKeypair.publicKey);
    const instruction = types.quoteInit(
      program,
      {
        params: {
          cid: Array.from(params.cid),
        },
      },
      {
        quote: account.publicKey,
        verifierQueue: params.queueAccount.publicKey,
        queueAuthority: queueData.authority,
        payer,
        systemProgram: SystemProgram.programId,
      }
    );
    return [account, new TransactionObject(payer, [instruction], [], options)];
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
  public readonly size = this.program.account.quoteAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.PermissionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.QuoteAccountData> {
    const data = await types.QuoteAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError('Quote (SGX)', this.publicKey);
  }
}
