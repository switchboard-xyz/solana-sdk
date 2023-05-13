import { Account } from '../accounts/account';
import * as errors from '../errors';
import * as types from '../sgx-generated';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';
import * as anchor from '@coral-xyz/anchor';

import { PermissionAccount, QueueAccount, QuoteAccount } from './index';
import * as spl from '@solana/spl-token';

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';

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
  amount: number | 'all';
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

  public async fundInstruction(
    payer: PublicKey,
    params: FunctionFundParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const funderAuthority = params.funderAuthority
      ? params.funderAuthority.publicKey
      : payer;
    const funderTokenWallet =
      params.funderTokenWallet ??
      this.program.mint.getAssociatedAddress(funderAuthority);

    const functionData = await this.loadData();
    const instruction = types.functionFund(
      this.program,
      { params: { amount: params.fundAmount } },
      {
        function: this.publicKey,
        verifierQueue: functionData.verifierQueue,
        escrow: this.getEscrow(),
        funder: funderTokenWallet,
        funderAuthority: funderAuthority,
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
    ).then(txn => this.program.signAndSend(txn, options));
  }

  public async withdrawInstruction(
    payer: PublicKey,
    params: FunctionWithdrawParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const functionData = await this.loadData();
    const [queueAccount, queueData] = await QueueAccount.load(
      this.program,
      functionData.verifierQueue
    );

    const withdrawAmount: number = await (async () => {
      const minRequiredBalance = queueData.reward * 2;
      const escrowBalance = await spl
        .getAccount(this.program.connection, this.getEscrow())
        .then(escrow => this.program.mint.fromTokenAmount(escrow.amount));
      const maxWithdrawAmount = escrowBalance - minRequiredBalance;

      if (params.amount === 'all') return maxWithdrawAmount;
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
          { params: { amount: withdrawAmount } },
          {
            function: this.publicKey,
            verifierQueue: queueAccount.publicKey,
            escrow: this.getEscrow(),
            authority: payer,
            receiver: ephemeralWallet.publicKey,
            state: PublicKey.default, // @TODO: find state account pubkey
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
            { params: { amount: withdrawAmount } },
            {
              function: this.publicKey,
              verifierQueue: queueAccount.publicKey,
              escrow: this.getEscrow(),
              authority: params.withdrawAuthority
                ? params.withdrawAuthority.publicKey
                : payer,
              receiver: params.withdrawWallet,
              state: PublicKey.default, // @TODO: find state account pubkey
              tokenProgram: TOKEN_PROGRAM_ID,
            }
          ),
        ],
        params.withdrawAuthority ? [params.withdrawAuthority] : [],
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
    ).then(txn => this.program.signAndSend(txn, options));
  }

  public async verifyInstruction(
    payer: PublicKey,
    params: FunctionVerifyParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const functionData = await this.loadData();
    const permissionAccount = PermissionAccount.fromSeed(
      /* program= */ this.program,
      /* authority= */ functionData.authority,
      /* granter= */ functionData.verifierQueue,
      /* grantee= */ this.publicKey
    )[0];
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
        fnSigner: PublicKey.default, // @TODO: find fn signer pubkey
        fnQuote: PublicKey.default, // @TODO: find fn quote pubkey
        verifierQuote: PublicKey.default, // @TODO: find verifier quote pubkey
        verifierQueue: functionData.verifierQueue,
        escrow: this.getEscrow(),
        receiver: PublicKey.default, // @TODO: find receiver pubkey
        permission: permissionAccount.publicKey,
        state: PublicKey.default, // @TODO: find state account pubkey
        tokenProgram: TOKEN_PROGRAM_ID,
        payer,
        systemProgram: SystemProgram.programId,
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
    ).then(txn => this.program.signAndSend(txn, options));
  }
}
