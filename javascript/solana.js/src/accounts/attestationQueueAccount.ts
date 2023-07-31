import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import type { SwitchboardProgram } from "../SwitchboardProgram.js";
import { SB_ATTESTATION_PID } from "../SwitchboardProgram.js";
import type {
  SendTransactionObjectOptions,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { TransactionObject } from "../TransactionObject.js";
import { parseRawBuffer } from "../utils.js";

import { Account } from "./account.js";
import type { AttestationPermissionSetParams } from "./attestationPermissionAccount.js";
import { AttestationPermissionAccount } from "./attestationPermissionAccount.js";
import type { FunctionAccountInitParams } from "./functionAccount.js";
import { FunctionAccount } from "./functionAccount.js";
import type { SwitchboardWallet } from "./switchboardWallet.js";
import type { VerifierAccountInitParams } from "./verifierAccount.js";
import { VerifierAccount } from "./verifierAccount.js";

import type {
  PublicKey,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { Keypair, SystemProgram } from "@solana/web3.js";
import {
  parseMrEnclave,
  parseRawMrEnclave,
  type RawBuffer,
} from "@switchboard-xyz/common";
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
  mrEnclave: RawBuffer;
  authority?: Keypair;
}
/**
 *  Parameters for an {@linkcode types.queueRemoveMrEnclave} instruction.
 */
export interface AttestationQueueRemoveMrEnclaveParams {
  mrEnclave: RawBuffer;
  authority?: Keypair;
}

export type CreateQueueQuoteParams = Omit<
  VerifierAccountInitParams,
  "queueAccount"
> &
  Partial<AttestationPermissionSetParams> & {
    queueAuthorityPubkey?: PublicKey;
  } & { createPermissions?: boolean };

export type CreateFunctionParams = Omit<
  FunctionAccountInitParams,
  "attestationQueue"
> &
  Partial<AttestationPermissionSetParams> & {
    queueAuthorityPubkey?: PublicKey;
  };

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
  static accountName = "AttestationQueueAccountData";

  /**
   * Get the size of an {@linkcode types.AttestationQueueAccountData} on-chain.
   */
  public readonly size =
    this.program.attestationAccount.attestationQueueAccountData.size;

  /**
   *  Retrieve and decode the {@linkcode types.AttestationQueueAccountData} stored in this account.
   */
  public async loadData(): Promise<types.AttestationQueueAccountData> {
    const data = await types.AttestationQueueAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data) return data;
    throw new errors.AccountNotFoundError("AttestationQueue", this.publicKey);
  }

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

  public async createVerifierInstruction(
    payer: PublicKey,
    params: CreateQueueQuoteParams,
    options?: TransactionObjectOptions
  ): Promise<[VerifierAccount, TransactionObject]> {
    const authority = params.authority ?? payer;

    const queueAuthority =
      params.queueAuthorityPubkey ?? (await this.loadData()).authority;

    const [verifierAccount, quoteInit] =
      await VerifierAccount.createInstruction(
        this.program,
        payer,
        { ...params, queueAccount: this, authority },
        options
      );

    if (!params.createPermissions && !params.enable) {
      return [verifierAccount, quoteInit];
    }

    const [permissionAccount, permissionInit] =
      AttestationPermissionAccount.createInstruction(
        this.program,
        payer,
        {
          granter: this.publicKey,
          grantee: verifierAccount.publicKey,
          authority: queueAuthority,
        },
        options
      );

    if (params.enable) {
      const permissionSet = permissionAccount.setInstruction(payer, {
        enable: true,
        permission:
          new types.SwitchboardAttestationPermission.PermitNodeheartbeat(),
        queue: this.publicKey,
        enclave: verifierAccount.publicKey,
      });
      permissionInit.combine(permissionSet);
    }

    return [verifierAccount, quoteInit.combine(permissionInit)];
  }

  public async createVerifier(
    params: CreateQueueQuoteParams,
    options?: SendTransactionObjectOptions
  ): Promise<[VerifierAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createVerifierInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    return [account, await this.program.signAndSend(txnObject, options)];
  }

  public async createFunctionInstruction(
    payer: PublicKey,
    params: CreateFunctionParams,
    wallet?: SwitchboardWallet,
    options?: TransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionObject]> {
    const queueAuthority =
      params.queueAuthorityPubkey ?? (await this.loadData()).authority;

    const [functionAccount, functionInit] =
      await FunctionAccount.createInstruction(
        this.program,
        payer,
        { ...params, attestationQueue: this },
        wallet,
        options
      );

    if (params.enable) {
      const permissionSet = types.attestationPermissionSet(
        this.program,
        {
          params: {
            permission:
              types.SwitchboardAttestationPermission.PermitQueueUsage
                .discriminator,
            enable: params.enable,
          },
        },
        {
          permission: SB_ATTESTATION_PID, // optional
          authority: queueAuthority,
          attestationQueue: this.publicKey,
          grantee: functionAccount.publicKey,
        }
      );

      functionInit.add(permissionSet);
    }

    return [functionAccount, functionInit];
  }

  public async createFunction(
    params: CreateFunctionParams,
    wallet?: SwitchboardWallet,
    options?: SendTransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createFunctionInstruction(
      this.program.walletPubkey,
      params,
      wallet,
      options
    );
    return [account, await this.program.signAndSend(txnObject, options)];
  }

  /**
   * Find the index of an enclave in an array and return -1 if not found
   */
  public static findEnclaveIdx(
    enclaves: Array<Uint8Array>,
    enclave: Uint8Array
  ): number {
    for (const [n, e] of enclaves.entries()) {
      if (Buffer.compare(e, enclave) === 0) {
        return n;
      }
    }
    return -1;
  }

  public async addMrEnclaveInstruction(
    payer: PublicKey,
    params: AttestationQueueAddMrEnclaveParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const instruction = types.attestationQueueAddMrEnclave(
      this.program,
      {
        params: { mrEnclave: Array.from(parseRawMrEnclave(params.mrEnclave)) },
      },
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
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async removeMrEnclaveInstruction(
    payer: PublicKey,
    params: AttestationQueueRemoveMrEnclaveParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const instruction = types.attestationQueueRemoveMrEnclave(
      this.program,
      {
        params: { mrEnclave: Array.from(parseRawMrEnclave(params.mrEnclave)) },
      },
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
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  /**
   * Create a new attestation queue for internal testing
   * - Creates AttestationQueue account
   * - Creates a Quote verifier
   * - Sets the quote verifier secured signer
   * - Adds Quote verifier to the queue
   */
  public static async bootstrapNewQueue(
    program: SwitchboardProgram,
    params?: CreateBootstrappedQueueParams,
    options?: SendTransactionObjectOptions
  ): Promise<
    BootstrappedAttestationQueue & { signatures?: Array<TransactionSignature> }
  > {
    const authority: Keypair = params?.authority ?? program.wallet.payer;

    const attestationQueueKeypair = params?.keypair ?? Keypair.generate();
    const verifierKeypair1 = Keypair.generate();
    const verifierSigner1 = params?.enclaveSigner ?? Keypair.generate();

    const ixns: Array<TransactionInstruction> = [];
    const signers: Array<Keypair> = [
      authority,
      attestationQueueKeypair,
      verifierKeypair1,
      verifierSigner1,
    ];

    // create attestation queue
    ixns.push(
      types.attestationQueueInit(
        program,
        {
          params: {
            reward: params?.reward ?? 0,
            allowAuthorityOverrideAfter:
              params?.allowAuthorityOverrideAfter ?? 300,
            maxQuoteVerificationAge: params?.maxQuoteVerificationAge ?? 604800,
            nodeTimeout: params?.nodeTimeout ?? 180,
            requireAuthorityHeartbeatPermission:
              params?.requireAuthorityHeartbeatPermission ?? false,
            requireUsagePermissions: params?.requireUsagePermissions ?? false,
          },
        },
        {
          queue: attestationQueueKeypair.publicKey,
          authority: authority.publicKey,
          payer: authority.publicKey,
          systemProgram: SystemProgram.programId,
        }
      )
    );

    // add mrEnclave
    ixns.push(
      types.attestationQueueAddMrEnclave(
        program,
        {
          params: {
            mrEnclave: Array.from(
              parseRawMrEnclave(params?.verifierrEnclave ?? "")
            ),
          },
        },
        {
          queue: attestationQueueKeypair.publicKey,
          authority: authority.publicKey,
        }
      )
    );

    // create quote #1
    ixns.push(
      types.verifierInit(
        program,
        {
          params: {
            registryKey: parseRawBuffer(params?.registryKey ?? "", 64),
          },
        },
        {
          verifier: verifierKeypair1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
          queueAuthority: authority.publicKey,
          authority: authority.publicKey,
          payer: authority.publicKey,
          systemProgram: SystemProgram.programId,
        }
      )
    );
    // create & set quote #1 permissions
    const verifierQuotePermissions1 = AttestationPermissionAccount.fromSeed(
      program,
      authority.publicKey,
      attestationQueueKeypair.publicKey,
      verifierKeypair1.publicKey
    );
    ixns.push(
      types.attestationPermissionInit(
        program,
        { params: {} },
        {
          permission: verifierQuotePermissions1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
          node: verifierKeypair1.publicKey,
          authority: authority.publicKey,
          payer: authority.publicKey,
          systemProgram: SystemProgram.programId,
        }
      )
    );
    ixns.push(
      types.attestationPermissionSet(
        program,
        {
          params: {
            permission: 1, // Permit_Node_Heartbeat
            enable: true,
          },
        },
        {
          permission: verifierQuotePermissions1.publicKey,
          authority: authority.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
          grantee: verifierKeypair1.publicKey,
        }
      )
    );

    // set quote #1 securedSigner
    ixns.push(
      types.verifierQuoteRotate(
        program,
        {
          params: {
            registryKey: Array.from(
              parseRawBuffer(params?.registryKey ?? "", 64)
            ),
          },
        },
        {
          verifier: verifierKeypair1.publicKey,
          authority: authority.publicKey,
          enclaveSigner: verifierSigner1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
        }
      )
    );

    // quote #1 heartbeat
    ixns.push(
      types.verifierHeartbeat(
        program,
        { params: {} },
        {
          verifier: verifierKeypair1.publicKey,
          verifierSigner: verifierSigner1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
          queueAuthority: authority.publicKey,
          gcNode: verifierKeypair1.publicKey,
          permission: verifierQuotePermissions1.publicKey,
        }
      )
    );

    const txns = TransactionObject.packIxns(
      program.walletPubkey,
      ixns,
      signers,
      options
    );

    const signatures = await program.signAndSendAll(txns, options);

    const attestationQueueAccount = new AttestationQueueAccount(
      program,
      attestationQueueKeypair.publicKey
    );

    return {
      program: program,
      attestationQueue: {
        account: attestationQueueAccount,
        publicKey: attestationQueueAccount.publicKey,
        authority: authority.publicKey,
      },
      verifier: {
        account: new VerifierAccount(program, verifierKeypair1.publicKey),
        publicKey: verifierKeypair1.publicKey,
        permissionAccount: verifierQuotePermissions1,
        signer: verifierSigner1,
      },
      signatures,
    };
  }
}

export type CreateBootstrappedQueueParams =
  AttestationQueueAccountInitParams & {
    verifierrEnclave: RawBuffer;
    registryKey?: RawBuffer;
    enclaveSigner?: Keypair;
  };

export type BootstrappedAttestationQueue = {
  program: SwitchboardProgram;
  attestationQueue: {
    account: AttestationQueueAccount;
    publicKey: PublicKey;
    authority: PublicKey;
  };
  verifier: {
    account: VerifierAccount;
    publicKey: PublicKey;
    permissionAccount: AttestationPermissionAccount;
    signer: Keypair;
  };
};
