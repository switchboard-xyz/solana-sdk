import * as types from "../attestation-generated/index.js";
import * as errors from "../errors.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";

import { Account } from "./account.js";

import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";

/**
 *  Parameters for initializing an {@linkcode AttestationPermissionAccount}
 */
export interface AttestationPermissionAccountInitParams {
  granter: PublicKey;
  grantee: PublicKey;
  authority?: PublicKey;
}
/**
 *  Parameters for setting the permissions of a {@linkcode AttestationPermissionAccount}
 */
export interface AttestationPermissionSetParams {
  enable: boolean;
  /**
   *  The {@linkcode types.SwitchboardPermission} to set for the grantee.
   */
  permission: types.SwitchboardAttestationPermissionKind;
  /**
   *  The authority with which to sign this transaction
   *
   *  @default payer
   */
  authority?: Keypair;

  queue: PublicKey;
  node: PublicKey;
}
/**
 *  Account type dictating the level of permissions between a granter and a grantee.
 *
 *  Data: {@linkcode types.AttestationPermissionAccountData}
 */
export class AttestationPermissionAccount extends Account<types.AttestationPermissionAccountData> {
  static accountName = "AttestationPermissionAccountData";

  /**
   *  Load an existing PermissionAccount with its current on-chain state
   */
  public static async load(
    program: SwitchboardProgram,
    authority: PublicKey | string,
    granter: PublicKey | string,
    grantee: PublicKey | string
  ): Promise<
    [
      AttestationPermissionAccount,
      types.AttestationPermissionAccountData,
      number
    ]
  > {
    const [account, bump] = AttestationPermissionAccount.fromSeed(
      program,
      typeof authority === "string" ? new PublicKey(authority) : authority,
      typeof granter === "string" ? new PublicKey(granter) : granter,
      typeof grantee === "string" ? new PublicKey(grantee) : grantee
    );
    const state = await account.loadData();
    return [account, state, bump];
  }

  /**
   *  Loads an AttestationPermissionAccount from the expected PDA seed format.
   *
   *  @param program The Switchboard program for the current connection.
   *  @param authority The authority pubkey to be incorporated into the account seed.
   *  @param granter The granter pubkey to be incorporated into the account seed.
   *  @param grantee The grantee pubkey to be incorporated into the account seed.
   *
   *  @return AttestationPermissionAccount and PDA bump.
   */
  public static fromSeed(
    program: SwitchboardProgram,
    authority: PublicKey,
    granter: PublicKey,
    grantee: PublicKey
  ): [AttestationPermissionAccount, number] {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("PermissionAccountData"),
        authority.toBytes(),
        granter.toBytes(),
        grantee.toBytes(),
      ],
      program.attestationProgramId
    );
    return [new AttestationPermissionAccount(program, publicKey), bump];
  }

  public static createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: AttestationPermissionAccountInitParams,
    options?: TransactionObjectOptions
  ): [AttestationPermissionAccount, TransactionObject] {
    const authority = params.authority ?? payer;

    const [account] = AttestationPermissionAccount.fromSeed(
      program,
      authority,
      params.granter,
      params.grantee
    );

    const instruction = types.attestationPermissionInit(
      program,
      { params: {} },
      {
        permission: account.publicKey,
        attestationQueue: params.granter,
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
    params: AttestationPermissionAccountInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[AttestationPermissionAccount, TransactionSignature]> {
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
   *  Returns the size of an on-chain {@linkcode AttestationPermissionAccount}.
   */
  public readonly size =
    this.program.attestationAccount.attestationPermissionAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.AttestationPermissionAccountData} stored in this account.
   */
  public async loadData(): Promise<types.AttestationPermissionAccountData> {
    const data = await types.AttestationPermissionAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError(
      "Permissions (Attestation)",
      this.publicKey
    );
  }

  /**
   *  Produces the instruction to set the permission in the AttestationPermissionAccount
   */
  public setInstruction(
    payer: PublicKey,
    params: AttestationPermissionSetParams,
    options?: TransactionObjectOptions
  ): TransactionObject {
    // const data = await this.loadData();
    return new TransactionObject(
      payer,
      [
        types.attestationPermissionSet(
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
            attestationQueue: params.queue,
            node: params.node,
          }
        ),
      ],
      params.authority ? [params.authority] : [],
      options
    );
  }

  /**
   *  Sets the permission in the AttestationPermissionAccount
   */
  public async set(
    params: AttestationPermissionSetParams,
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
