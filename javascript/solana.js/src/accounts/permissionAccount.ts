import * as anchor from '@project-serum/anchor';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';
import * as errors from '../errors';
import * as types from '../generated';
import {
  PermitOracleHeartbeat,
  PermitOracleQueueUsage,
  PermitVrfRequests,
} from '../generated/types/SwitchboardPermission';
import { SwitchboardProgram } from '../program';
import { TransactionObject } from '../transaction';
import { Account } from './account';

/**
 *  Parameters for initializing an {@linkcode PermissionAccount}
 */
export interface PermissionAccountInitParams {
  granter: PublicKey;
  grantee: PublicKey;
  authority: PublicKey;
}

export interface PermitNoneJSON {
  kind: 'PermitNone';
}

export class PermitNone {
  static readonly discriminator = 0;
  static readonly kind = 'NONE';
  readonly discriminator = 0;
  readonly kind = 'PermitNone';

  toJSON(): PermitNoneJSON {
    return {
      kind: 'PermitNone',
    };
  }

  toEncodable() {
    return {
      PermitOracleHeartbeat: {},
    };
  }
}

export interface PermissionSetParams {
  /** The {@linkcode types.SwitchboardPermission} to set for the grantee. */
  permission: types.SwitchboardPermissionKind;
  /** Whether to enable PERMIT_ORACLE_HEARTBEAT permissions. **Note:** Requires a provided queueAuthority keypair or payer to be the assigned queue authority. */
  enable: boolean;
  /** Keypair used to enable heartbeat permissions if payer is not the queue authority. */
  queueAuthority?: Keypair;
}

/**
 * Account type dictating the level of permissions between a granter and a grantee.
 *
 * A {@linkcode QueueAccount} acts as the granter where the queue authority assigns or revokes a grantee's {@linkcode types.SwitchboardPermission}. A grantee can be one of the following: {@linkcode AggregatorAccount}, {@linkcode BufferRelayerAccount}, or {@linkcode VrfAccount}.
 *
 * Data: {@linkcode types.PermissionAccountData}
 */
export class PermissionAccount extends Account<types.PermissionAccountData> {
  static accountName = 'PermissionAccountData';

  static getPermissions(
    permission: types.PermissionAccountData
  ): types.SwitchboardPermissionKind | PermitNone {
    switch (permission.permissions) {
      case 0:
        return new PermitNone();
      case 1:
        return new PermitOracleHeartbeat();
      case 2:
        return new PermitOracleQueueUsage();
      case 3:
        return new PermitVrfRequests();
    }

    throw new Error(
      `Failed to find the assigned permissions, expected a value from 0 - 3, received ${permission.permissions}`
    );
  }

  /** Load an existing PermissionAccount with its current on-chain state */
  public static async load(
    program: SwitchboardProgram,
    authority: PublicKey | string,
    granter: PublicKey | string,
    grantee: PublicKey | string
  ): Promise<[PermissionAccount, types.PermissionAccountData, number]> {
    const [account, bump] = PermissionAccount.fromSeed(
      program,
      typeof authority === 'string' ? new PublicKey(authority) : authority,
      typeof granter === 'string' ? new PublicKey(granter) : granter,
      typeof grantee === 'string' ? new PublicKey(grantee) : grantee
    );
    const state = await account.loadData();
    return [account, state, bump];
  }

  /**
   * Loads a PermissionAccount from the expected PDA seed format.
   * @param program The Switchboard program for the current connection.
   * @param authority The authority pubkey to be incorporated into the account seed.
   * @param granter The granter pubkey to be incorporated into the account seed.
   * @param grantee The grantee pubkey to be incorporated into the account seed.
   * @return PermissionAccount and PDA bump.
   */
  public static fromSeed(
    program: SwitchboardProgram,
    authority: PublicKey,
    granter: PublicKey,
    grantee: PublicKey
  ): [PermissionAccount, number] {
    const [publicKey, bump] = anchor.utils.publicKey.findProgramAddressSync(
      [
        Buffer.from('PermissionAccountData'),
        authority.toBytes(),
        granter.toBytes(),
        grantee.toBytes(),
      ],
      program.programId
    );
    return [new PermissionAccount(program, publicKey), bump];
  }

  public static createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: PermissionAccountInitParams
  ): [PermissionAccount, TransactionObject] {
    const [account] = PermissionAccount.fromSeed(
      program,
      params.authority,
      params.granter,
      params.grantee
    );
    const instruction = types.permissionInit(
      program,
      { params: {} },
      {
        permission: account.publicKey,
        granter: params.granter,
        grantee: params.grantee,
        systemProgram: SystemProgram.programId,
        authority: params.authority,
        payer,
      }
    );
    return [account, new TransactionObject(payer, [instruction], [])];
  }

  public static async create(
    program: SwitchboardProgram,
    params: PermissionAccountInitParams
  ): Promise<[PermissionAccount, TransactionSignature]> {
    const [account, txnObject] = this.createInstruction(
      program,
      program.walletPubkey,
      params
    );
    const txSignature = await program.signAndSend(txnObject);
    return [account, txSignature];
  }

  /**
   * Returns the size of an on-chain {@linkcode PermissionAccount}.
   */
  public readonly size = this.program.account.permissionAccountData.size;

  /**
   * Retrieve and decode the {@linkcode types.PermissionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.PermissionAccountData> {
    const data = await types.PermissionAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }

  /**
   * Check if a specific permission is enabled on this permission account
   */
  public async isPermissionEnabled(permission): Promise<boolean> {
    const permissions = (await this.loadData()).permissions;
    return (permissions & (permission as number)) !== 0;
  }

  /**
   * Sets the permission in the PermissionAccount
   */
  public async set(params: PermissionSetParams): Promise<string> {
    const setTxn = this.setInstruction(this.program.walletPubkey, params);
    const txnSignature = await this.program.signAndSend(setTxn);
    return txnSignature;
  }

  /**
   * Produces the instruction to set the permission in the PermissionAccount
   */
  public setInstruction(
    payer: PublicKey,
    params: PermissionSetParams
  ): TransactionObject {
    return new TransactionObject(
      payer,
      [
        types.permissionSet(
          this.program,
          {
            params: {
              permission: params.permission,
              enable: params.enable,
            },
          },
          {
            permission: this.publicKey,
            authority: params.queueAuthority
              ? params.queueAuthority.publicKey
              : payer,
          }
        ),
      ],
      params.queueAuthority ? [params.queueAuthority] : []
    );
  }
}
