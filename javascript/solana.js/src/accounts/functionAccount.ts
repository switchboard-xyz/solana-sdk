import { Account } from '../accounts/account';
import * as types from '../attestation-generated';
import * as errors from '../errors';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';
import { parseMrEnclave } from '../utils';

import {
  AttestationPermissionAccount,
  AttestationQueueAccount,
  QuoteAccount,
} from './index';

import * as anchor from '@coral-xyz/anchor';
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
import { toUtf8 } from '@switchboard-xyz/common';
import { isValidCron } from 'cron-validator';

/**
 *  Parameters for initializing an {@linkcode FunctionAccount}
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
    throw new errors.AccountNotFoundError('Function', this.publicKey);
  }

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

    if (!isValidCron(params.schedule, { seconds: true })) {
      throw new errors.InvalidCronSchedule(params.schedule);
    }

    const attestationQueueAccount = params.attestationQueue;
    const attestationQueue = await attestationQueueAccount.loadData();

    // get PDA accounts
    const functionAccount = new FunctionAccount(
      program,
      functionKeypair.publicKey
    );
    const [permissionAccount] = functionAccount.getPermissionAccount(
      attestationQueueAccount.publicKey,
      attestationQueue.authority
    );
    const [quoteAccount] = functionAccount.getQuoteAccount();
    const escrow = functionAccount.getEscrow();

    const instruction = types.functionInit(
      program,
      {
        params: {
          name: new Uint8Array(Buffer.from(params.name ?? '', 'utf8')),
          metadata: new Uint8Array(Buffer.from(params.metadata ?? '', 'utf8')),
          schedule: new Uint8Array(Buffer.from(params.schedule, 'utf8')),
          container: new Uint8Array(Buffer.from(params.container, 'utf8')),
          version: new Uint8Array(Buffer.from(params.version, 'utf8')),
          containerRegistry: new Uint8Array(
            Buffer.from(params.containerRegistry ?? '', 'utf8')
          ),
        },
      },
      {
        function: functionAccount.publicKey,
        authority: params.authority ? params.authority.publicKey : payer,
        quote: quoteAccount.publicKey,
        attestationQueue: attestationQueueAccount.publicKey,
        permission: permissionAccount.publicKey,
        escrow,
        state: program.attestationProgramState.publicKey, // @TODO: find state account pubkey
        mint: program.mint.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        payer,
        systemProgram: SystemProgram.programId,
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

  public getPermissionAccount(
    queuePubkey: PublicKey,
    queueAuthority: PublicKey
  ): [AttestationPermissionAccount, number] {
    return AttestationPermissionAccount.fromSeed(
      this.program,
      queueAuthority,
      queuePubkey,
      this.publicKey
    );
  }

  public getQuoteAccount(): [QuoteAccount, number] {
    return QuoteAccount.fromSeed(this.program, this.publicKey);
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
        attestationQueue: functionData.attestationQueue,
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
    const [queueAccount, queueData] = await AttestationQueueAccount.load(
      this.program,
      functionData.attestationQueue
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
            attestationQueue: queueAccount.publicKey,
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
              attestationQueue: queueAccount.publicKey,
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
    const permissionAccount = AttestationPermissionAccount.fromSeed(
      /* program= */ this.program,
      /* authority= */ functionData.authority,
      /* granter= */ functionData.attestationQueue,
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
        attestationQueue: functionData.attestationQueue,
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
