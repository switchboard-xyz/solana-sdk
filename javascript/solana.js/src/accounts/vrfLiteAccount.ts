import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
} from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common';
import * as errors from '../errors';
import * as types from '../generated';
import { vrfLiteInit } from '../generated';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';
import { Account } from './account';
import { OracleAccount } from './oracleAccount';
import { PermissionAccount } from './permissionAccount';
import { QueueAccount } from './queueAccount';
import { Callback } from './vrfAccount';

export interface VrfLiteInitParams {
  callback?: Callback;
  expiration?: number;
  keypair?: Keypair;
  authority?: PublicKey;
}

export type VrfLiteDepositParams = {
  tokenWallet?: PublicKey;
  tokenAuthority?: Keypair;
  amount: number;
};

export interface VrfLiteProveAndVerifyParams {
  vrfLite: types.VrfLiteAccountData;
  counter?: BN;
  proof: string;
  oraclePubkey: PublicKey;
  oracleTokenWallet: PublicKey;
  oracleAuthority: PublicKey;
}

export class VrfLiteAccount extends Account<types.VrfLiteAccountData> {
  public size = this.program.account.vrfLiteAccountData.size;

  // private _permission: Promise<PermissionAccount> | undefined;

  // get permissionAccount(): Promise<PermissionAccount> {
  //   return (
  //     this._permission?.catch(() => {
  //       this._permission = undefined;
  //       return this.permissionAccount;
  //     }) ??
  //     new Promise(async (resolve, reject) => {
  //       try {
  //         const vrfLite = await this.loadData();
  //         const [queueAccount, queue] = await QueueAccount.load(
  //           this.program,
  //           vrfLite.queue
  //         );
  //         const [permissionAccount] = PermissionAccount.fromSeed(
  //           this.program,
  //           queue.authority,
  //           queueAccount.publicKey,
  //           this.publicKey
  //         );
  //         resolve(permissionAccount);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     })
  //   );
  // }

  public async loadData(): Promise<types.VrfLiteAccountData> {
    const data = await types.VrfLiteAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null)
      throw new errors.AccountNotFoundError('VrfLite', this.publicKey);
    return data;
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: VrfLiteInitParams & { queueAccount: QueueAccount }
  ): Promise<[VrfLiteAccount, TransactionObject]> {
    const queue = await params.queueAccount.loadData();

    const vrfLiteKeypair = params.keypair ?? Keypair.generate();
    const vrfLiteAccount = new VrfLiteAccount(
      program,
      vrfLiteKeypair.publicKey
    );

    const vrfPoolEscrow = program.mint.getAssociatedAddress(
      vrfLiteKeypair.publicKey
    );

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      program,
      queue.authority,
      params.queueAccount.publicKey,
      vrfLiteKeypair.publicKey
    );

    const vrfLiteInitIxn = vrfLiteInit(
      program,
      {
        params: {
          callback: params.callback ?? null,
          stateBump: program.programState.bump,
          expiration: new BN(params.expiration ?? 0),
        },
      },
      {
        vrf: vrfLiteKeypair.publicKey,
        authority: params.authority ?? payer,
        mint: program.mint.address,
        escrow: vrfPoolEscrow,
        queueAuthority: queue.authority,
        queue: params.queueAccount.publicKey,
        permission: permissionAccount.publicKey,
        programState: program.programState.publicKey,
        payer: payer,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      }
    );

    const vrfLiteInitTxn = new TransactionObject(
      payer,
      [vrfLiteInitIxn],
      [vrfLiteKeypair]
    );

    return [vrfLiteAccount, vrfLiteInitTxn];
  }

  public static async create(
    program: SwitchboardProgram,
    params: VrfLiteInitParams & { queueAccount: QueueAccount }
  ): Promise<[VrfLiteAccount, TransactionSignature]> {
    const [account, transaction] = await VrfLiteAccount.createInstruction(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(transaction);
    return [account, txnSignature];
  }

  public async depositInstructions(
    payer: PublicKey,
    params: VrfLiteDepositParams
  ): Promise<TransactionObject> {
    const userTokenAddress =
      params.tokenWallet ??
      this.program.mint.getAssociatedAddress(
        params.tokenAuthority?.publicKey ?? payer
      );
    const transferTxn = new TransactionObject(
      payer,
      [
        createTransferInstruction(
          userTokenAddress,
          this.program.mint.getAssociatedAddress(this.publicKey),
          params.tokenAuthority?.publicKey ?? payer,
          this.program.mint.toTokenAmount(params.amount)
        ),
      ],
      params.tokenAuthority ? [params.tokenAuthority] : []
    );
    return transferTxn;
  }

  public async deposit(
    params: VrfLiteDepositParams
  ): Promise<TransactionSignature> {
    const transaction = await this.depositInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(transaction);
    return txnSignature;
  }

  public proveAndVerifyInstructions(
    params: VrfLiteProveAndVerifyParams,
    options?: TransactionObjectOptions,
    numTxns = 40
  ): Array<TransactionObject> {
    const remainingAccounts = params.vrfLite.callback.accounts.slice(
      0,
      params.vrfLite.callback.accountsLen
    );

    const txns = Array.from(Array(numTxns).keys()).map(i => {
      const proveIxn = types.vrfLiteProveAndVerify(
        this.program,
        {
          params: {
            nonce: i,
            proof: new Uint8Array(),
            proofEncoded: params.proof,
            counter: params.counter ?? params.vrfLite.counter,
          },
        },
        {
          vrfLite: this.publicKey,
          callbackPid: params.vrfLite.callback.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          escrow: params.vrfLite.escrow,
          programState: this.program.programState.publicKey,
          oracle: params.oraclePubkey,
          oracleAuthority: params.oracleAuthority,
          oracleWallet: params.oracleTokenWallet,
          instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        }
      );
      proveIxn.keys = proveIxn.keys.concat(remainingAccounts);

      return new TransactionObject(this.program.walletPubkey, [proveIxn], [], {
        computeUnitLimit: 1_400_000, // allow user to override
        ...options,
      });
    });

    return txns;
  }

  public async proveAndVerify(
    params: Partial<VrfLiteProveAndVerifyParams> & { skipPreflight?: boolean },
    options?: TransactionObjectOptions,
    numTxns = 40
  ): Promise<Array<TransactionSignature>> {
    const vrfLite = params.vrfLite ?? (await this.loadData());
    const oraclePubkey = params.oraclePubkey ?? vrfLite.builder.producer;

    let oracleTokenWallet = params.oracleTokenWallet;
    let oracleAuthority = params.oracleAuthority;
    if (!oracleTokenWallet || !oracleAuthority) {
      const oracleAccount = new OracleAccount(this.program, oraclePubkey);
      const oracle = await oracleAccount.loadData();
      oracleTokenWallet = oracle.tokenAccount;
      oracleAuthority = oracle.oracleAuthority;
    }

    const txns = this.proveAndVerifyInstructions(
      {
        vrfLite,
        proof: params.proof ?? '',
        oraclePubkey,
        oracleTokenWallet,
        oracleAuthority,
      },
      options,
      numTxns
    );

    const txnSignatures = await this.program.signAndSendAll(txns, {
      skipPreflight: params.skipPreflight ?? true,
    });

    return txnSignatures;
  }
}
