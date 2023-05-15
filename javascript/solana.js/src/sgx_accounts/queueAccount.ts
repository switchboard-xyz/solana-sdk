import { OracleAccount } from '../accounts';
import { Account } from '../accounts/account';
import * as errors from '../errors';
import * as types from '../sgx-generated';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';

import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';

/**
 *  Parameters for initializing an {@linkcode QueueAccount}
 */
export interface QueueAccountInitParams {
  /**
   *  Rewards to provide oracles and round openers on this queue.
   */
  reward: number;
  /**
   *  @TODO: document this param
   */
  allowAuthorityOverrideAfter: number;
  /**
   *  @TODO: document this param
   */
  maxQuoteVerificationAge: number;
  /**
   *  A flag indicating whether usage authority is required to heartbeat.
   *
   *  @default false
   */
  requireAuthorityHeartbeatPermission: boolean;
  /**
   *  A flag indicating whether usage permissions are required.
   *
   *  @default false
   */
  requireUsagePermissions: boolean;
  /**
   *  Time period (in seconds) we should remove an oracle after if no response.
   *
   *  @default 180
   */
  nodeTimeout?: number;
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
 *  Parameters for an {@linkcode types.queueAddMrEnclave} instruction.
 */
export interface QueueAddMrEnclaveParams {
  mrEnclave: Uint8Array;
  authority?: Keypair;
}
/**
 *  Parameters for an {@linkcode types.queueRemoveMrEnclave} instruction.
 */
export interface QueueRemoveMrEnclaveParams {
  mrEnclave: Uint8Array;
  authority?: Keypair;
}
/**
 * Account type representing an oracle queue's configuration along with a buffer account holding a
 * list of oracles that are actively heartbeating.
 *
 * A QueueAccount is responsible for allocating update requests to it's round robin queue of
 * {@linkcode OracleAccount}'s.
 *
 * Data: {@linkcode types.ServiceQueueAccountData}
 *
 * Buffer: {@linkcode QueueDataBuffer}
 */
export class QueueAccount extends Account<types.ServiceQueueAccountData> {
  static accountName = 'ServiceQueueAccountData';

  /**
   *  Load an existing {@linkcode QueueAccount} with its current on-chain state
   */
  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[QueueAccount, types.ServiceQueueAccountData]> {
    const queueAccount = new QueueAccount(program, address);
    const state = await queueAccount.loadData();
    return [queueAccount, state];
  }

  public static createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: QueueAccountInitParams,
    options?: TransactionObjectOptions
  ): [QueueAccount, TransactionObject] {
    const queueKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(queueKeypair);

    const instruction = types.queueInit(
      program,
      {
        params: {
          reward: params.reward,
          allowAuthorityOverrideAfter: params.allowAuthorityOverrideAfter,
          maxQuoteVerificationAge: params.maxQuoteVerificationAge,
          nodeTimeout: params.nodeTimeout ?? 180,
          requireAuthorityHeartbeatPermission:
            params.requireAuthorityHeartbeatPermission ?? false,
          requireUsagePermissions: params.requireUsagePermissions ?? false,
        },
      },
      {
        queue: queueKeypair.publicKey,
        authority: params.authority ? params.authority.publicKey : payer,
        payer: payer,
        systemProgram: SystemProgram.programId,
      }
    );
    return [
      new QueueAccount(program, queueKeypair.publicKey),
      new TransactionObject(payer, [instruction], [queueKeypair], options),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: QueueAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[QueueAccount, TransactionSignature]> {
    const [account, txnObject] = this.createInstruction(
      program,
      program.walletPubkey,
      params,
      options
    );
    return [account, await program.signAndSend(txnObject, options)];
  }

  /**
   * Get the size of an {@linkcode QueueAccount} on-chain.
   */
  public readonly size = this.program.sgxAccount.serviceQueueAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.PermissionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.ServiceQueueAccountData> {
    const data = await types.ServiceQueueAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError('Queue (SGX)', this.publicKey);
  }

  public async addMrEnclaveInstruction(
    payer: PublicKey,
    params: QueueAddMrEnclaveParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const mrEnclave = Array.from(params.mrEnclave)
      .concat(Array(32).fill(0))
      .slice(0, 32);
    const instruction = types.queueAddMrEnclave(
      this.program,
      { params: { mrEnclave } },
      { authority, queue: this.publicKey }
    );
    return new TransactionObject(payer, [instruction], signers, options);
  }

  public async addMrEnclave(
    params: QueueAddMrEnclaveParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.addMrEnclaveInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then(txn => this.program.signAndSend(txn, options));
  }

  public async removeMrEnclaveInstruction(
    payer: PublicKey,
    params: QueueRemoveMrEnclaveParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const mrEnclave = Array.from(params.mrEnclave)
      .concat(Array(32).fill(0))
      .slice(0, 32);
    const instruction = types.queueRemoveMrEnclave(
      this.program,
      { params: { mrEnclave } },
      { authority, queue: this.publicKey }
    );
    return new TransactionObject(payer, [instruction], signers, options);
  }

  public async removeMrEnclave(
    params: QueueRemoveMrEnclaveParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.removeMrEnclaveInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then(txn => this.program.signAndSend(txn, options));
  }
}
