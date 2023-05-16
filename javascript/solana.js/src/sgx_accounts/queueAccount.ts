import {
  OracleAccount,
  OracleInitParams,
  OracleStakeParams,
} from '../accounts';
import { Account } from '../accounts/account';
import * as errors from '../errors';
import * as types from '../sgx-generated';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';
import { SgxAccounts } from '..';

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
export type CreateQueueOracleParams = OracleInitParams &
  Partial<OracleStakeParams> &
  SgxAccounts.PermissionSetParams & {
    queueAuthorityPubkey?: PublicKey;
  };
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

  /**
   *  Creates a transaction object with oracleInit instructions for the given QueueAccount.
   *
   *  @param payer - the publicKey of the account that will pay for the new accounts. Will also be used as the account authority if no other authority is provided.
   *
   *  @param params - the oracle configuration parameters.
   *
   *  @return Transaction signature and the newly created OracleAccount.
   *
   *  Basic usage example:
   *
   *  ```ts
   *  import { QueueAccount } from '@switchboard-xyz/solana.js';
   *  const queueAccount = new QueueAccount(program, queuePubkey);
   *  const [oracleAccount, oracleInitTxn] = await queueAccount.createOracleInstructions(payer, {
   *    name: "My Oracle",
   *    metadata: "Oracle #1"
   *  });
   *  const oracleInitSignature = await program.signAndSend(oracleInitTxn);
   *  const oracle = await oracleAccount.loadData();
   *  ```
   */
  public async createOracleInstructions(
    /** The publicKey of the account that will pay for the new accounts. Will also be used as the account authority if no other authority is provided. */
    payer: PublicKey,
    params: CreateQueueOracleParams,
    options?: TransactionObjectOptions
  ): Promise<[OracleAccount, Array<TransactionObject>]> {
    const queueData = await this.loadData();
    const queueAuthorityPubkey = params.authority
      ? params.authority.publicKey
      : params.queueAuthorityPubkey ?? queueData.authority;

    const [oracleAccount, createOracleTxnObject] =
      await OracleAccount.createInstructions(
        this.program,
        payer,
        { ...params, queueAccount: this },
        options
      );
    const [permissionAccount, createPermissionTxnObject] =
      SgxAccounts.PermissionAccount.createInstruction(
        this.program,
        payer,
        {
          granter: this.publicKey,
          grantee: oracleAccount.publicKey,
          authority: queueAuthorityPubkey,
        },
        options
      );

    if (
      params.enable &&
      (params.authority || queueAuthorityPubkey.equals(payer))
    ) {
      const permissionSetTxn = await permissionAccount.setInstruction(
        payer,
        {
          permission: params.permission,
          enable: true,
          authority: params.authority,
        },
        options
      );
      createPermissionTxnObject.combine(permissionSetTxn);
    }

    return [
      oracleAccount,
      TransactionObject.pack(
        [...createOracleTxnObject, createPermissionTxnObject],
        options
      ),
    ];
  }

  /**
   *  Creates a new {@linkcode OracleAccount}.
   *
   *  @param params - the oracle configuration parameters.
   *
   *  @return Transaction signature and the newly created OracleAccount.
   *
   *  Basic usage example:
   *
   *  ```ts
   *  import { QueueAccount } from '@switchboard-xyz/solana.js';
   *  const queueAccount = new QueueAccount(program, queuePubkey);
   *  const [oracleAccount, oracleInitSignature] = await queueAccount.createOracle({
   *    name: "My Oracle",
   *    metadata: "Oracle #1"
   *  });
   *  const oracle = await oracleAccount.loadData();
   *  ```
   */
  public async createOracle(
    params: CreateQueueOracleParams,
    options?: SendTransactionObjectOptions
  ): Promise<[OracleAccount, Array<TransactionSignature>]> {
    const [oracleAccount, txn] = await this.createOracleInstructions(
      this.program.walletPubkey,
      params,
      options
    );
    return [oracleAccount, await this.program.signAndSendAll(txn)];
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
