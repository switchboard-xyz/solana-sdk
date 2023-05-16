import * as types from '../attestation-generated';
import * as errors from '../errors';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';

import { Account } from './account';
import { OracleAccount, OracleInitParams, OracleStakeParams } from '.';

import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';

/**
 *  Parameters for initializing an {@linkcode QueueAccount}
 */
export interface AttestationQueueAccountInitParams {
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
export interface AttestationQueueAddMrEnclaveParams {
  mrEnclave: Uint8Array;
  authority?: Keypair;
}
/**
 *  Parameters for an {@linkcode types.queueRemoveMrEnclave} instruction.
 */
export interface AttestationQueueRemoveMrEnclaveParams {
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
 * Data: {@linkcode types.AttestationQueueAccountData}
 *
 * Buffer: {@linkcode QueueDataBuffer}
 */
export class AttestationQueueAccount extends Account<types.AttestationQueueAccountData> {
  static accountName = 'AttestationQueueAccountData';

  /**
   *  Load an existing {@linkcode AttestationQueueAccount} with its current on-chain state
   */
  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[AttestationQueueAccount, types.AttestationQueueAccountData]> {
    const queueAccount = new AttestationQueueAccount(program, address);
    const state = await queueAccount.loadData();
    return [queueAccount, state];
  }

  public static createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: AttestationQueueAccountInitParams,
    options?: TransactionObjectOptions
  ): [AttestationQueueAccount, TransactionObject] {
    const queueKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(queueKeypair);

    const instruction = types.attestationQueueInit(
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
      new AttestationQueueAccount(program, queueKeypair.publicKey),
      new TransactionObject(payer, [instruction], [queueKeypair], options),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: AttestationQueueAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[AttestationQueueAccount, TransactionSignature]> {
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
  public readonly size =
    this.program.attestationAccount.attestationQueueAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.PermissionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.AttestationQueueAccountData> {
    const data = await types.AttestationQueueAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError('AttestationQueue', this.publicKey);
  }

  public async addMrEnclaveInstruction(
    payer: PublicKey,
    params: AttestationQueueAddMrEnclaveParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const mrEnclave = Array.from(params.mrEnclave)
      .concat(Array(32).fill(0))
      .slice(0, 32);
    const instruction = types.attestationQueueAddMrEnclave(
      this.program,
      { params: { mrEnclave } },
      { authority, queue: this.publicKey }
    );
    return new TransactionObject(payer, [instruction], signers, options);
  }

  public async addMrEnclave(
    params: AttestationQueueAddMrEnclaveParams,
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
    params: AttestationQueueRemoveMrEnclaveParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const mrEnclave = Array.from(params.mrEnclave)
      .concat(Array(32).fill(0))
      .slice(0, 32);
    const instruction = types.attestationQueueRemoveMrEnclave(
      this.program,
      { params: { mrEnclave } },
      { authority, queue: this.publicKey }
    );
    return new TransactionObject(payer, [instruction], signers, options);
  }

  public async removeMrEnclave(
    params: AttestationQueueRemoveMrEnclaveParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.removeMrEnclaveInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then(txn => this.program.signAndSend(txn, options));
  }
}