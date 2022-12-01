import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import * as errors from '../errors';
import * as types from '../generated';
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

export type PermissionSetParams =
  | {
      /** The {@linkcode types.SwitchboardPermission} to set for the grantee. */
      permission: boolean;
      /** Keypair used to enable heartbeat permissions if payer is not the queue authority. */
      queueAuthority?: Keypair;
    }
  | {
      /** Whether to enable PERMIT_ORACLE_HEARTBEAT permissions. **Note:** Requires a provided queueAuthority keypair or payer to be the assigned queue authority. */
      enable?: boolean;
      /** Keypair used to enable heartbeat permissions if payer is not the queue authority. */
      queueAuthority?: Keypair;
    };

/**
 * Account type dictating the level of permissions between a granter and a grantee.
 *
 * A {@linkcode QueueAccount} acts as the granter where the queue authority assigns or revokes a grantee's {@linkcode types.SwitchboardPermission}. A grantee can be one of the following: {@linkcode AggregatorAccount}, {@linkcode BufferRelayerAccount}, or {@linkcode VrfAccount}.
 *
 * Data: {@linkcode types.PermissionAccountData}
 */
export class PermissionAccount extends Account<types.PermissionAccountData> {
  static accountName = 'PermissionAccountData';

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

  public static async create(
    program: SwitchboardProgram,
    params: PermissionAccountInitParams
  ): Promise<[string, PermissionAccount]> {
    const [txnObject, account] = this.createInstruction(
      program,
      program.walletPubkey,
      params
    );
    const txSignature = await program.signAndSend(txnObject);
    return [txSignature, account];
  }

  public static createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: PermissionAccountInitParams
  ): [TransactionObject, PermissionAccount] {
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
    return [new TransactionObject(payer, [instruction], []), account];
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
  public async set(params: {
    permission: types.SwitchboardPermissionKind;
    enable: boolean;
    authority?: Keypair;
  }): Promise<string> {
    const setTxn = this.setInstruction(this.program.walletPubkey, params);
    const txnSignature = await this.program.signAndSend(setTxn);
    return txnSignature;
  }

  /**
   * Produces the instruction to set the permission in the PermissionAccount
   */
  public setInstruction(
    payer: PublicKey,
    params: {
      permission: types.SwitchboardPermissionKind;
      enable: boolean;
      authority?: Keypair;
    }
  ): TransactionObject {
    return new TransactionObject(
      payer,
      [
        types.permissionSet(
          this.program,
          { params },
          {
            permission: this.publicKey,
            authority: params.authority ? params.authority.publicKey : payer,
          }
        ),
      ],
      params.authority ? [params.authority] : []
    );
  }
}
