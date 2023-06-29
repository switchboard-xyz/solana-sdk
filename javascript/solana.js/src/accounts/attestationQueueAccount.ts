import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import {
  SB_ATTESTATION_PID,
  SwitchboardProgram,
} from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { RawBuffer } from "../types.js";
import { parseMrEnclave, parseRawBuffer } from "../utils.js";

import { Account } from "./account.js";
import {
  AttestationPermissionAccount,
  AttestationPermissionSetParams,
} from "./attestationPermissionAccount.js";
import { EnclaveAccount, EnclaveAccountInitParams } from "./enclaveAccount.js";
import {
  FunctionAccount,
  FunctionAccountInitParams,
} from "./functionAccount.js";

import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
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
  EnclaveAccountInitParams,
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
    this.program.verifyAttestation();

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
    program.verifyAttestation();

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
    program.verifyAttestation();

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

  public async createQuoteInstruction(
    payer: PublicKey,
    params: CreateQueueQuoteParams,
    options?: TransactionObjectOptions
  ): Promise<[EnclaveAccount, TransactionObject]> {
    this.program.verifyAttestation();

    const authority = params.authority ?? payer;

    const queueAuthority =
      params.queueAuthorityPubkey ?? (await this.loadData()).authority;

    const [enclaveAccount, quoteInit] = await EnclaveAccount.createInstruction(
      this.program,
      payer,
      { ...params, queueAccount: this, authority },
      options
    );

    if (!params.createPermissions && !params.enable) {
      return [enclaveAccount, quoteInit];
    }

    const [permissionAccount, permissionInit] =
      AttestationPermissionAccount.createInstruction(
        this.program,
        payer,
        {
          granter: this.publicKey,
          grantee: enclaveAccount.publicKey,
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
        enclave: enclaveAccount.publicKey,
      });
      permissionInit.combine(permissionSet);
    }

    return [enclaveAccount, quoteInit.combine(permissionInit)];
  }

  public async createQuote(
    params: CreateQueueQuoteParams,
    options?: SendTransactionObjectOptions
  ): Promise<[EnclaveAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createQuoteInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    return [account, await this.program.signAndSend(txnObject, options)];
  }

  public async createFunctionInstruction(
    payer: PublicKey,
    params: CreateFunctionParams,
    options?: TransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionObject]> {
    this.program.verifyAttestation();

    const queueAuthority =
      params.queueAuthorityPubkey ?? (await this.loadData()).authority;

    const [functionAccount, functionInit] =
      await FunctionAccount.createInstruction(
        this.program,
        payer,
        { ...params, attestationQueue: this },
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
          enclave: functionAccount.getEnclavePubkey(),
        }
      );

      functionInit.add(permissionSet);
    }

    return [functionAccount, functionInit];
  }

  public async createFunction(
    params: CreateFunctionParams,
    options?: SendTransactionObjectOptions
  ): Promise<[FunctionAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createFunctionInstruction(
      this.program.walletPubkey,
      params,
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
    this.program.verifyAttestation();

    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const instruction = types.attestationQueueAddMrEnclave(
      this.program,
      { params: { mrEnclave: Array.from(parseMrEnclave(params.mrEnclave)) } },
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
    this.program.verifyAttestation();

    const authority = params.authority?.publicKey ?? payer;
    const signers = params.authority ? [params.authority] : [];
    const instruction = types.attestationQueueRemoveMrEnclave(
      this.program,
      { params: { mrEnclave: Array.from(parseMrEnclave(params.mrEnclave)) } },
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
    const verifierQuoteKeypair1 = Keypair.generate();
    const verifierQuoteSigner1 = params?.securedSigner ?? Keypair.generate();

    const ixns: Array<TransactionInstruction> = [];
    const signers: Array<Keypair> = [
      authority,
      attestationQueueKeypair,
      verifierQuoteKeypair1,
      verifierQuoteSigner1,
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
              parseMrEnclave(params?.quoteVerifierMrEnclave ?? "")
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
      types.quoteInit(
        program,
        {
          params: {
            registryKey: parseRawBuffer(params?.registryKey ?? "", 64),
          },
        },
        {
          quote: verifierQuoteKeypair1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
          queueAuthority: authority.publicKey,
          authority: authority.publicKey,
          payer: authority.publicKey,
          systemProgram: SystemProgram.programId,
        }
      )
    );
    // create & set quote #1 permissions
    const [verifierQuotePermissions1] = AttestationPermissionAccount.fromSeed(
      program,
      authority.publicKey,
      attestationQueueKeypair.publicKey,
      verifierQuoteKeypair1.publicKey
    );
    ixns.push(
      types.attestationPermissionInit(
        program,
        { params: {} },
        {
          permission: verifierQuotePermissions1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
          node: verifierQuoteKeypair1.publicKey,
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
          enclave: verifierQuoteKeypair1.publicKey,
        }
      )
    );

    // set quote #1 securedSigner
    ixns.push(
      types.quoteRotate(
        program,
        {
          params: {
            registryKey: Array.from(
              parseRawBuffer(params?.registryKey ?? "", 64)
            ),
          },
        },
        {
          quote: verifierQuoteKeypair1.publicKey,
          authority: authority.publicKey,
          enclaveSigner: verifierQuoteSigner1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
        }
      )
    );

    // quote #1 heartbeat
    ixns.push(
      types.quoteHeartbeat(
        program,
        { params: {} },
        {
          quote: verifierQuoteKeypair1.publicKey,
          enclaveSigner: verifierQuoteSigner1.publicKey,
          attestationQueue: attestationQueueKeypair.publicKey,
          queueAuthority: authority.publicKey,
          gcNode: verifierQuoteKeypair1.publicKey,
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
      attestationQueueAccount,
      signatures,
      verifier: {
        quoteAccount: new EnclaveAccount(
          program,
          verifierQuoteKeypair1.publicKey
        ),
        permissionAccount: verifierQuotePermissions1,
        signer: verifierQuoteSigner1,
      },
    };
  }
}

export type CreateBootstrappedQueueParams =
  AttestationQueueAccountInitParams & {
    quoteVerifierMrEnclave: RawBuffer;
    registryKey: RawBuffer;
    securedSigner?: Keypair;
  };

export type BootstrappedAttestationQueue = {
  attestationQueueAccount: AttestationQueueAccount;
  verifier: {
    quoteAccount: EnclaveAccount;
    permissionAccount: AttestationPermissionAccount;
    signer: Keypair;
  };
};
