import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineAccountDataFields {
  /** The name of the function routine for easier identification. */
  name: Array<number>;
  /** The metadata of the function routine for easier identification. */
  metadata: Array<number>;
  /** The unix timestamp when the function routine was created. */
  createdAt: BN;
  /** The unix timestamp when the function routine config was changed. */
  updatedAt: BN;
  /** Flag to disable the function and prevent new verification requests. */
  isDisabled: types.ResourceLevelKind;
  /** The type of resource that disabled the routine. */
  status: types.RoutineStatusKind;
  /** The last reported error code if the most recent response was a failure */
  errorStatus: number;
  /** The enclave generated signer for this routine. */
  enclaveSigner: PublicKey;
  /** The verifier oracle who signed this verification. */
  verifier: PublicKey;
  /** The SOL bounty in lamports used to incentivize a verifier to expedite the request. 0 = no bounty. Receiver = verifier oracle. */
  bounty: BN;
  /** Signer allowed to manage the routine. */
  authority: PublicKey;
  /** The default destination for rent exemption when the account is closed. */
  payer: PublicKey;
  /** The function that manages the mr_enclave set for this routine. */
  function: PublicKey;
  /** The Attestation Queue for this request. */
  attestationQueue: PublicKey;
  /** The tokenAccount escrow */
  escrowWallet: PublicKey;
  /** The TokenAccount with funds for the escrow. */
  escrowTokenWallet: PublicKey;
  /**
   * The index of the verifier on the queue that is assigned to process the next invocation.
   * This is incremented after each invocation in a round-robin fashion.
   */
  queueIdx: number;
  /** The cron schedule to run the function on. */
  schedule: Array<number>;
  /** The maximum number of bytes to pass to the container params. */
  maxContainerParamsLen: number;
  /**
   * Hash of the serialized container_params to prevent RPC tampering.
   * Should be verified within your function to ensure you are using the correct parameters.
   */
  containerParamsHash: Array<number>;
  /** The stringified container params to pass to the function. */
  containerParams: Uint8Array;
  /** The unix timestamp when the function was last run. */
  lastExecutionTimestamp: BN;
  /** The unix timestamp when the function was last run successfully. */
  lastSuccessfulExecutionTimestamp: BN;
  /** The unix timestamp when the function is allowed to run next. */
  nextAllowedTimestamp: BN;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface FunctionRoutineAccountDataJSON {
  /** The name of the function routine for easier identification. */
  name: Array<number>;
  /** The metadata of the function routine for easier identification. */
  metadata: Array<number>;
  /** The unix timestamp when the function routine was created. */
  createdAt: string;
  /** The unix timestamp when the function routine config was changed. */
  updatedAt: string;
  /** Flag to disable the function and prevent new verification requests. */
  isDisabled: types.ResourceLevelJSON;
  /** The type of resource that disabled the routine. */
  status: types.RoutineStatusJSON;
  /** The last reported error code if the most recent response was a failure */
  errorStatus: number;
  /** The enclave generated signer for this routine. */
  enclaveSigner: string;
  /** The verifier oracle who signed this verification. */
  verifier: string;
  /** The SOL bounty in lamports used to incentivize a verifier to expedite the request. 0 = no bounty. Receiver = verifier oracle. */
  bounty: string;
  /** Signer allowed to manage the routine. */
  authority: string;
  /** The default destination for rent exemption when the account is closed. */
  payer: string;
  /** The function that manages the mr_enclave set for this routine. */
  function: string;
  /** The Attestation Queue for this request. */
  attestationQueue: string;
  /** The tokenAccount escrow */
  escrowWallet: string;
  /** The TokenAccount with funds for the escrow. */
  escrowTokenWallet: string;
  /**
   * The index of the verifier on the queue that is assigned to process the next invocation.
   * This is incremented after each invocation in a round-robin fashion.
   */
  queueIdx: number;
  /** The cron schedule to run the function on. */
  schedule: Array<number>;
  /** The maximum number of bytes to pass to the container params. */
  maxContainerParamsLen: number;
  /**
   * Hash of the serialized container_params to prevent RPC tampering.
   * Should be verified within your function to ensure you are using the correct parameters.
   */
  containerParamsHash: Array<number>;
  /** The stringified container params to pass to the function. */
  containerParams: Array<number>;
  /** The unix timestamp when the function was last run. */
  lastExecutionTimestamp: string;
  /** The unix timestamp when the function was last run successfully. */
  lastSuccessfulExecutionTimestamp: string;
  /** The unix timestamp when the function is allowed to run next. */
  nextAllowedTimestamp: string;
  /** Reserved. */
  ebuf: Array<number>;
}

/**
 * The function routine account provides scheduled execution of Switchboard Functions
 * with a configurable cron-based schedule and container parameters.
 *
 * Function routines maintain their own queue_idx to provide round-robin assignment of
 * verifiers for each settled execution. This is incremented after each invocation.
 *
 * Function routines can share a SwitchboardWallet as long as the escrow authority has
 * signed the transaction.
 */
export class FunctionRoutineAccountData {
  /** The name of the function routine for easier identification. */
  readonly name: Array<number>;
  /** The metadata of the function routine for easier identification. */
  readonly metadata: Array<number>;
  /** The unix timestamp when the function routine was created. */
  readonly createdAt: BN;
  /** The unix timestamp when the function routine config was changed. */
  readonly updatedAt: BN;
  /** Flag to disable the function and prevent new verification requests. */
  readonly isDisabled: types.ResourceLevelKind;
  /** The type of resource that disabled the routine. */
  readonly status: types.RoutineStatusKind;
  /** The last reported error code if the most recent response was a failure */
  readonly errorStatus: number;
  /** The enclave generated signer for this routine. */
  readonly enclaveSigner: PublicKey;
  /** The verifier oracle who signed this verification. */
  readonly verifier: PublicKey;
  /** The SOL bounty in lamports used to incentivize a verifier to expedite the request. 0 = no bounty. Receiver = verifier oracle. */
  readonly bounty: BN;
  /** Signer allowed to manage the routine. */
  readonly authority: PublicKey;
  /** The default destination for rent exemption when the account is closed. */
  readonly payer: PublicKey;
  /** The function that manages the mr_enclave set for this routine. */
  readonly function: PublicKey;
  /** The Attestation Queue for this request. */
  readonly attestationQueue: PublicKey;
  /** The tokenAccount escrow */
  readonly escrowWallet: PublicKey;
  /** The TokenAccount with funds for the escrow. */
  readonly escrowTokenWallet: PublicKey;
  /**
   * The index of the verifier on the queue that is assigned to process the next invocation.
   * This is incremented after each invocation in a round-robin fashion.
   */
  readonly queueIdx: number;
  /** The cron schedule to run the function on. */
  readonly schedule: Array<number>;
  /** The maximum number of bytes to pass to the container params. */
  readonly maxContainerParamsLen: number;
  /**
   * Hash of the serialized container_params to prevent RPC tampering.
   * Should be verified within your function to ensure you are using the correct parameters.
   */
  readonly containerParamsHash: Array<number>;
  /** The stringified container params to pass to the function. */
  readonly containerParams: Uint8Array;
  /** The unix timestamp when the function was last run. */
  readonly lastExecutionTimestamp: BN;
  /** The unix timestamp when the function was last run successfully. */
  readonly lastSuccessfulExecutionTimestamp: BN;
  /** The unix timestamp when the function is allowed to run next. */
  readonly nextAllowedTimestamp: BN;
  /** Reserved. */
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    93, 99, 13, 119, 129, 127, 168, 18,
  ]);

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 64, "name"),
    borsh.array(borsh.u8(), 256, "metadata"),
    borsh.i64("createdAt"),
    borsh.i64("updatedAt"),
    types.ResourceLevel.layout("isDisabled"),
    types.RoutineStatus.layout("status"),
    borsh.u8("errorStatus"),
    borsh.publicKey("enclaveSigner"),
    borsh.publicKey("verifier"),
    borsh.u64("bounty"),
    borsh.publicKey("authority"),
    borsh.publicKey("payer"),
    borsh.publicKey("function"),
    borsh.publicKey("attestationQueue"),
    borsh.publicKey("escrowWallet"),
    borsh.publicKey("escrowTokenWallet"),
    borsh.u32("queueIdx"),
    borsh.array(borsh.u8(), 64, "schedule"),
    borsh.u32("maxContainerParamsLen"),
    borsh.array(borsh.u8(), 32, "containerParamsHash"),
    borsh.vecU8("containerParams"),
    borsh.i64("lastExecutionTimestamp"),
    borsh.i64("lastSuccessfulExecutionTimestamp"),
    borsh.i64("nextAllowedTimestamp"),
    borsh.array(borsh.u8(), 512, "ebuf"),
  ]);

  constructor(fields: FunctionRoutineAccountDataFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.createdAt = fields.createdAt;
    this.updatedAt = fields.updatedAt;
    this.isDisabled = fields.isDisabled;
    this.status = fields.status;
    this.errorStatus = fields.errorStatus;
    this.enclaveSigner = fields.enclaveSigner;
    this.verifier = fields.verifier;
    this.bounty = fields.bounty;
    this.authority = fields.authority;
    this.payer = fields.payer;
    this.function = fields.function;
    this.attestationQueue = fields.attestationQueue;
    this.escrowWallet = fields.escrowWallet;
    this.escrowTokenWallet = fields.escrowTokenWallet;
    this.queueIdx = fields.queueIdx;
    this.schedule = fields.schedule;
    this.maxContainerParamsLen = fields.maxContainerParamsLen;
    this.containerParamsHash = fields.containerParamsHash;
    this.containerParams = fields.containerParams;
    this.lastExecutionTimestamp = fields.lastExecutionTimestamp;
    this.lastSuccessfulExecutionTimestamp =
      fields.lastSuccessfulExecutionTimestamp;
    this.nextAllowedTimestamp = fields.nextAllowedTimestamp;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey,
    programId: PublicKey = program.attestationProgramId
  ): Promise<FunctionRoutineAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[],
    programId: PublicKey = program.attestationProgramId
  ): Promise<Array<FunctionRoutineAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): FunctionRoutineAccountData {
    if (!data.slice(0, 8).equals(FunctionRoutineAccountData.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = FunctionRoutineAccountData.layout.decode(data.slice(8));

    return new FunctionRoutineAccountData({
      name: dec.name,
      metadata: dec.metadata,
      createdAt: dec.createdAt,
      updatedAt: dec.updatedAt,
      isDisabled: types.ResourceLevel.fromDecoded(dec.isDisabled),
      status: types.RoutineStatus.fromDecoded(dec.status),
      errorStatus: dec.errorStatus,
      enclaveSigner: dec.enclaveSigner,
      verifier: dec.verifier,
      bounty: dec.bounty,
      authority: dec.authority,
      payer: dec.payer,
      function: dec.function,
      attestationQueue: dec.attestationQueue,
      escrowWallet: dec.escrowWallet,
      escrowTokenWallet: dec.escrowTokenWallet,
      queueIdx: dec.queueIdx,
      schedule: dec.schedule,
      maxContainerParamsLen: dec.maxContainerParamsLen,
      containerParamsHash: dec.containerParamsHash,
      containerParams: new Uint8Array(
        dec.containerParams.buffer,
        dec.containerParams.byteOffset,
        dec.containerParams.length
      ),
      lastExecutionTimestamp: dec.lastExecutionTimestamp,
      lastSuccessfulExecutionTimestamp: dec.lastSuccessfulExecutionTimestamp,
      nextAllowedTimestamp: dec.nextAllowedTimestamp,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): FunctionRoutineAccountDataJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
      isDisabled: this.isDisabled.toJSON(),
      status: this.status.toJSON(),
      errorStatus: this.errorStatus,
      enclaveSigner: this.enclaveSigner.toString(),
      verifier: this.verifier.toString(),
      bounty: this.bounty.toString(),
      authority: this.authority.toString(),
      payer: this.payer.toString(),
      function: this.function.toString(),
      attestationQueue: this.attestationQueue.toString(),
      escrowWallet: this.escrowWallet.toString(),
      escrowTokenWallet: this.escrowTokenWallet.toString(),
      queueIdx: this.queueIdx,
      schedule: this.schedule,
      maxContainerParamsLen: this.maxContainerParamsLen,
      containerParamsHash: this.containerParamsHash,
      containerParams: Array.from(this.containerParams.values()),
      lastExecutionTimestamp: this.lastExecutionTimestamp.toString(),
      lastSuccessfulExecutionTimestamp:
        this.lastSuccessfulExecutionTimestamp.toString(),
      nextAllowedTimestamp: this.nextAllowedTimestamp.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(
    obj: FunctionRoutineAccountDataJSON
  ): FunctionRoutineAccountData {
    return new FunctionRoutineAccountData({
      name: obj.name,
      metadata: obj.metadata,
      createdAt: new BN(obj.createdAt),
      updatedAt: new BN(obj.updatedAt),
      isDisabled: types.ResourceLevel.fromJSON(obj.isDisabled),
      status: types.RoutineStatus.fromJSON(obj.status),
      errorStatus: obj.errorStatus,
      enclaveSigner: new PublicKey(obj.enclaveSigner),
      verifier: new PublicKey(obj.verifier),
      bounty: new BN(obj.bounty),
      authority: new PublicKey(obj.authority),
      payer: new PublicKey(obj.payer),
      function: new PublicKey(obj.function),
      attestationQueue: new PublicKey(obj.attestationQueue),
      escrowWallet: new PublicKey(obj.escrowWallet),
      escrowTokenWallet: new PublicKey(obj.escrowTokenWallet),
      queueIdx: obj.queueIdx,
      schedule: obj.schedule,
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParamsHash: obj.containerParamsHash,
      containerParams: Uint8Array.from(obj.containerParams),
      lastExecutionTimestamp: new BN(obj.lastExecutionTimestamp),
      lastSuccessfulExecutionTimestamp: new BN(
        obj.lastSuccessfulExecutionTimestamp
      ),
      nextAllowedTimestamp: new BN(obj.nextAllowedTimestamp),
      ebuf: obj.ebuf,
    });
  }
}
