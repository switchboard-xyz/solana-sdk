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
 *  Parameters for initializing an {@linkcode PermissionAccount}
 */
export interface PermissionAccountInitParams {
  granter: PublicKey;
  grantee: PublicKey;
  authority?: Keypair;
}
/**
 *  Parameters for setting the permissions of a {@linkcode PermissionAccount}
 */
export interface PermissionSetParams {
  enable: boolean;
  /**
   *  The {@linkcode types.SwitchboardPermission} to set for the grantee.
   */
  permission: types.SwitchboardPermissionKind;
  /**
   *  The authority with which to sign this transaction
   *
   *  @default payer
   */
  authority?: Keypair;
}
/**
 *  Account type dictating the level of permissions between a granter and a grantee.
 *
 *  Data: {@linkcode types.PermissionAccountData}
 */
export class PermissionAccount extends Account<types.PermissionAccountData> {
  static accountName = 'PermissionAccountData';

  /**
   *  Load an existing PermissionAccount with its current on-chain state
   */
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
   *  Loads a PermissionAccount from the expected PDA seed format.
   *
   *  @param program The Switchboard program for the current connection.
   *  @param authority The authority pubkey to be incorporated into the account seed.
   *  @param granter The granter pubkey to be incorporated into the account seed.
   *  @param grantee The grantee pubkey to be incorporated into the account seed.
   *
   *  @return PermissionAccount and PDA bump.
   */
  public static fromSeed(
    program: SwitchboardProgram,
    authority: PublicKey,
    granter: PublicKey,
    grantee: PublicKey
  ): [PermissionAccount, number] {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(
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
    params: PermissionAccountInitParams,
    options?: TransactionObjectOptions
  ): [PermissionAccount, TransactionObject] {
    const authority = params.authority ? params.authority.publicKey : payer;
    const [account] = PermissionAccount.fromSeed(
      program,
      authority,
      params.granter,
      params.grantee
    );
    const instruction = types.permissionInit(
      program,
      { params: {} },
      {
        permission: account.publicKey,
        queue: params.granter,
        node: params.grantee,
        authority,
        payer,
        systemProgram: SystemProgram.programId,
      }
    );
    return [account, new TransactionObject(payer, [instruction], [], options)];
  }

  public static async create(
    program: SwitchboardProgram,
    params: PermissionAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[PermissionAccount, TransactionSignature]> {
    const [account, txnObject] = this.createInstruction(
      program,
      program.walletPubkey,
      params,
      options
    );
    const txSignature = await program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  /**
   *  Returns the size of an on-chain {@linkcode PermissionAccount}.
   */
  public readonly size = this.program.sgxAccount.permissionAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.PermissionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.PermissionAccountData> {
    const data = await types.PermissionAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError('Permissions (SGX)', this.publicKey);
  }

  /**
   *  Produces the instruction to set the permission in the PermissionAccount
   */
  public async setInstruction(
    payer: PublicKey,
    params: PermissionSetParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const data = await this.loadData();
    return new TransactionObject(
      payer,
      [
        types.permissionSet(
          this.program,
          {
            params: {
              permission: params.permission.discriminator,
              enable: params.enable,
            },
          },
          {
            permission: this.publicKey,
            authority: params.authority ? params.authority.publicKey : payer,
            queue: data.granter,
            node: data.grantee,
          }
        ),
      ],
      params.authority ? [params.authority] : [],
      options
    );
  }

  /**
   *  Sets the permission in the PermissionAccount
   */
  public async set(
    params: PermissionSetParams,
    options?: SendTransactionObjectOptions
  ): Promise<string> {
    const setTxn = await this.setInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(setTxn, options);
    return txnSignature;
  }
}
