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
import { PermissionAccount, QueueAccount, QuoteAccount } from './index';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

/**
 *  Parameters for initializing an {@linkcode FunctionAccount}
 */
export interface FunctionAccountInitParams {
  container: Uint8Array;
  version: Uint8Array;
  schedule: Uint8Array;

  /**
   *  The quote account to which this function account will be linked
   */
  quoteAccount: QuoteAccount;
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
 * Account type representing a Switchboard Function.
 *
 * Data: {@linkcode types.FunctionAccountData}
 */
export class FunctionAccount extends Account<types.FunctionAccountData> {
  static accountName = 'FunctionAccountData';

  /**
   *  Load an existing {@linkcode FunctionAccount} with its current on-chain state
   */
  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[FunctionAccount, types.FunctionAccountData]> {
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
    const functionKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(functionKeypair);

    const quoteData = await params.quoteAccount.loadData();
    const [queueAccount, queueData] = await QueueAccount.load(
      program,
      quoteData.verifierQueue
    );
    const authority = params.authority ? params.authority.publicKey : payer;
    const account = new FunctionAccount(program, functionKeypair.publicKey);
    const permissionAccount = PermissionAccount.fromSeed(
      program,
      authority,
      queueAccount.publicKey,
      account.publicKey
    )[0];
    const instruction = types.functionInit(
      program,
      {
        params: {
          container: Array.from(params.container),
          version: Array.from(params.version),
          schedule: Array.from(params.schedule),
        },
      },
      {
        function: account.publicKey,
        authority,
        quote: params.quoteAccount.publicKey,
        queue: queueAccount.publicKey,
        permission: permissionAccount.publicKey,
        escrow: account.getEscrow(),
        state: PublicKey.default, // @TODO: find state account pubkey
        mint: program.mint.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        payer,
        systemProgram: SystemProgram.programId,
      }
    );
    return [account, new TransactionObject(payer, [instruction], [], options)];
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

  /**
   * Get the size of an {@linkcode FunctionAccount} on-chain.
   */
  public readonly size = this.program.account.functionAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.FunctionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.FunctionAccountData> {
    const data = await types.FunctionAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError('Function (SGX)', this.publicKey);
  }

  public getEscrow(): PublicKey {
    return this.program.mint.getAssociatedAddress(this.publicKey);
  }
}
