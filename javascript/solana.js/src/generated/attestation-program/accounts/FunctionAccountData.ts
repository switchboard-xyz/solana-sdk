import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionAccountDataFields {
  /** Whether the function is invoked on a schedule or by request */
  isScheduled: number;
  /** Whether the function has been manually triggered with the function_trigger instruction */
  isTriggered: number;
  /** The function permissions granted by the attestation_queue.authority */
  permissions: number;
  status: types.FunctionStatusKind;
  /** PDA bump. */
  bump: number;
  /** The payer who originally created the function. Cannot change, used to derive PDA. */
  creatorSeed: Array<number>;
  /** The name of the function for easier identification. */
  name: Array<number>;
  /** The metadata of the function for easier identification. */
  metadata: Array<number>;
  /** The Solana slot when the function was created. (PDA) */
  createdAtSlot: BN;
  /** The unix timestamp when the function was created. */
  createdAt: BN;
  /** The unix timestamp when the function config (container, registry, version, or schedule) was changed. */
  updatedAt: BN;
  /** The enclave quote */
  enclave: types.QuoteFields;
  /** An array of permitted mr_enclave measurements for the function. */
  mrEnclaves: Array<Array<number>>;
  /** The off-chain registry to fetch the function container from. */
  containerRegistry: Array<number>;
  /** The identifier of the container in the given container_registry. */
  container: Array<number>;
  /** The version tag of the container to pull. */
  version: Array<number>;
  /** The expected schema for the container params. */
  paramsSchema: Array<number>;
  /** The default params passed to the container during scheduled execution. */
  defaultContainerParams: Array<number>;
  /** The authority of the function which is authorized to make account changes. */
  authority: PublicKey;
  /** The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements. */
  attestationQueue: PublicKey;
  /** An incrementer used to rotate through an AttestationQueue's verifiers. */
  queueIdx: number;
  /** The address_lookup_table of the function used to increase the number of accounts we can fit into a function result. */
  addressLookupTable: PublicKey;
  /** The cron schedule to run the function on. */
  schedule: Array<number>;
  /** The unix timestamp when the function was last run. */
  lastExecutionTimestamp: BN;
  /** The unix timestamp when the function is allowed to run next. */
  nextAllowedTimestamp: BN;
  /** The number of times to trigger the function upon the next invocation. */
  triggerCount: BN;
  /** Time this function has been sitting in an explicitly triggered state */
  triggeredSince: BN;
  /** UNUSED. The unix timestamp when the current permissions expire. */
  permissionExpiration: BN;
  /** Number of requests created for this function. Used to prevent closing when there are live requests. */
  numRequests: BN;
  /** Whether custom requests have been disabled for this function. */
  requestsDisabled: number;
  /**
   * Whether new requests need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to use CPIs to control request account creation.
   */
  requestsRequireAuthorization: number;
  /** DEPRECATED. */
  reserved1: Array<number>;
  /**
   * The dev fee that is paid out from the request's escrow to the function's escrow on each successful invocation.
   * This is used to reward the function maintainer for providing the function.
   * 0 = No Fee. Sender = requests's escrow_token_wallet. Receiver = function's reward_token_wallet.
   */
  requestsDevFee: BN;
  /** The SwitchboardWallet that will handle pre-funding rewards paid out to function verifiers. */
  escrowWallet: PublicKey;
  /** The escrow_wallet TokenAccount that handles pre-funding rewards paid out to function runners. */
  escrowTokenWallet: PublicKey;
  /**
   * The SwitchboardWallet that will handle acruing rewards from requests.
   * Defaults to the escrow_wallet.
   */
  rewardEscrowWallet: PublicKey;
  /** The reward_escrow_wallet TokenAccount used to acrue rewards from requests made with custom parameters. */
  rewardEscrowTokenWallet: PublicKey;
  /** The last reported error code if the most recent response was a failure */
  errorStatus: number;
  /** Number of routines created for this function. Used to prevent closing when there are live routines. */
  numRoutines: BN;
  /** Whether custom routines have been disabled for this function. */
  routinesDisabled: types.BoolWithLockKind;
  /**
   * Whether new routines need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to provide AccessControl and only allow certain parties to run routines.
   */
  routinesRequireAuthorization: number;
  /**
   * The fee that is paid out from the routine's escrow to the function's escrow on each successful invocation.
   * This is used to reward the function maintainer for providing the function.
   * 0 = No Fee. Sender = routine's escrow_token_wallet. Receiver = function's reward_token_wallet.
   */
  routinesDevFee: BN;
  /** The functions MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  verificationTimestamp: BN;
  /** The unix timestamp when the quotes verification status expires. */
  validUntil: BN;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface FunctionAccountDataJSON {
  /** Whether the function is invoked on a schedule or by request */
  isScheduled: number;
  /** Whether the function has been manually triggered with the function_trigger instruction */
  isTriggered: number;
  /** The function permissions granted by the attestation_queue.authority */
  permissions: number;
  status: types.FunctionStatusJSON;
  /** PDA bump. */
  bump: number;
  /** The payer who originally created the function. Cannot change, used to derive PDA. */
  creatorSeed: Array<number>;
  /** The name of the function for easier identification. */
  name: Array<number>;
  /** The metadata of the function for easier identification. */
  metadata: Array<number>;
  /** The Solana slot when the function was created. (PDA) */
  createdAtSlot: string;
  /** The unix timestamp when the function was created. */
  createdAt: string;
  /** The unix timestamp when the function config (container, registry, version, or schedule) was changed. */
  updatedAt: string;
  /** The enclave quote */
  enclave: types.QuoteJSON;
  /** An array of permitted mr_enclave measurements for the function. */
  mrEnclaves: Array<Array<number>>;
  /** The off-chain registry to fetch the function container from. */
  containerRegistry: Array<number>;
  /** The identifier of the container in the given container_registry. */
  container: Array<number>;
  /** The version tag of the container to pull. */
  version: Array<number>;
  /** The expected schema for the container params. */
  paramsSchema: Array<number>;
  /** The default params passed to the container during scheduled execution. */
  defaultContainerParams: Array<number>;
  /** The authority of the function which is authorized to make account changes. */
  authority: string;
  /** The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements. */
  attestationQueue: string;
  /** An incrementer used to rotate through an AttestationQueue's verifiers. */
  queueIdx: number;
  /** The address_lookup_table of the function used to increase the number of accounts we can fit into a function result. */
  addressLookupTable: string;
  /** The cron schedule to run the function on. */
  schedule: Array<number>;
  /** The unix timestamp when the function was last run. */
  lastExecutionTimestamp: string;
  /** The unix timestamp when the function is allowed to run next. */
  nextAllowedTimestamp: string;
  /** The number of times to trigger the function upon the next invocation. */
  triggerCount: string;
  /** Time this function has been sitting in an explicitly triggered state */
  triggeredSince: string;
  /** UNUSED. The unix timestamp when the current permissions expire. */
  permissionExpiration: string;
  /** Number of requests created for this function. Used to prevent closing when there are live requests. */
  numRequests: string;
  /** Whether custom requests have been disabled for this function. */
  requestsDisabled: number;
  /**
   * Whether new requests need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to use CPIs to control request account creation.
   */
  requestsRequireAuthorization: number;
  /** DEPRECATED. */
  reserved1: Array<number>;
  /**
   * The dev fee that is paid out from the request's escrow to the function's escrow on each successful invocation.
   * This is used to reward the function maintainer for providing the function.
   * 0 = No Fee. Sender = requests's escrow_token_wallet. Receiver = function's reward_token_wallet.
   */
  requestsDevFee: string;
  /** The SwitchboardWallet that will handle pre-funding rewards paid out to function verifiers. */
  escrowWallet: string;
  /** The escrow_wallet TokenAccount that handles pre-funding rewards paid out to function runners. */
  escrowTokenWallet: string;
  /**
   * The SwitchboardWallet that will handle acruing rewards from requests.
   * Defaults to the escrow_wallet.
   */
  rewardEscrowWallet: string;
  /** The reward_escrow_wallet TokenAccount used to acrue rewards from requests made with custom parameters. */
  rewardEscrowTokenWallet: string;
  /** The last reported error code if the most recent response was a failure */
  errorStatus: number;
  /** Number of routines created for this function. Used to prevent closing when there are live routines. */
  numRoutines: string;
  /** Whether custom routines have been disabled for this function. */
  routinesDisabled: types.BoolWithLockJSON;
  /**
   * Whether new routines need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to provide AccessControl and only allow certain parties to run routines.
   */
  routinesRequireAuthorization: number;
  /**
   * The fee that is paid out from the routine's escrow to the function's escrow on each successful invocation.
   * This is used to reward the function maintainer for providing the function.
   * 0 = No Fee. Sender = routine's escrow_token_wallet. Receiver = function's reward_token_wallet.
   */
  routinesDevFee: string;
  /** The functions MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  verificationTimestamp: string;
  /** The unix timestamp when the quotes verification status expires. */
  validUntil: string;
  /** Reserved. */
  ebuf: Array<number>;
}

export class FunctionAccountData {
  /** Whether the function is invoked on a schedule or by request */
  readonly isScheduled: number;
  /** Whether the function has been manually triggered with the function_trigger instruction */
  readonly isTriggered: number;
  /** The function permissions granted by the attestation_queue.authority */
  readonly permissions: number;
  readonly status: types.FunctionStatusKind;
  /** PDA bump. */
  readonly bump: number;
  /** The payer who originally created the function. Cannot change, used to derive PDA. */
  readonly creatorSeed: Array<number>;
  /** The name of the function for easier identification. */
  readonly name: Array<number>;
  /** The metadata of the function for easier identification. */
  readonly metadata: Array<number>;
  /** The Solana slot when the function was created. (PDA) */
  readonly createdAtSlot: BN;
  /** The unix timestamp when the function was created. */
  readonly createdAt: BN;
  /** The unix timestamp when the function config (container, registry, version, or schedule) was changed. */
  readonly updatedAt: BN;
  /** The enclave quote */
  readonly enclave: types.Quote;
  /** An array of permitted mr_enclave measurements for the function. */
  readonly mrEnclaves: Array<Array<number>>;
  /** The off-chain registry to fetch the function container from. */
  readonly containerRegistry: Array<number>;
  /** The identifier of the container in the given container_registry. */
  readonly container: Array<number>;
  /** The version tag of the container to pull. */
  readonly version: Array<number>;
  /** The expected schema for the container params. */
  readonly paramsSchema: Array<number>;
  /** The default params passed to the container during scheduled execution. */
  readonly defaultContainerParams: Array<number>;
  /** The authority of the function which is authorized to make account changes. */
  readonly authority: PublicKey;
  /** The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements. */
  readonly attestationQueue: PublicKey;
  /** An incrementer used to rotate through an AttestationQueue's verifiers. */
  readonly queueIdx: number;
  /** The address_lookup_table of the function used to increase the number of accounts we can fit into a function result. */
  readonly addressLookupTable: PublicKey;
  /** The cron schedule to run the function on. */
  readonly schedule: Array<number>;
  /** The unix timestamp when the function was last run. */
  readonly lastExecutionTimestamp: BN;
  /** The unix timestamp when the function is allowed to run next. */
  readonly nextAllowedTimestamp: BN;
  /** The number of times to trigger the function upon the next invocation. */
  readonly triggerCount: BN;
  /** Time this function has been sitting in an explicitly triggered state */
  readonly triggeredSince: BN;
  /** UNUSED. The unix timestamp when the current permissions expire. */
  readonly permissionExpiration: BN;
  /** Number of requests created for this function. Used to prevent closing when there are live requests. */
  readonly numRequests: BN;
  /** Whether custom requests have been disabled for this function. */
  readonly requestsDisabled: number;
  /**
   * Whether new requests need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to use CPIs to control request account creation.
   */
  readonly requestsRequireAuthorization: number;
  /** DEPRECATED. */
  readonly reserved1: Array<number>;
  /**
   * The dev fee that is paid out from the request's escrow to the function's escrow on each successful invocation.
   * This is used to reward the function maintainer for providing the function.
   * 0 = No Fee. Sender = requests's escrow_token_wallet. Receiver = function's reward_token_wallet.
   */
  readonly requestsDevFee: BN;
  /** The SwitchboardWallet that will handle pre-funding rewards paid out to function verifiers. */
  readonly escrowWallet: PublicKey;
  /** The escrow_wallet TokenAccount that handles pre-funding rewards paid out to function runners. */
  readonly escrowTokenWallet: PublicKey;
  /**
   * The SwitchboardWallet that will handle acruing rewards from requests.
   * Defaults to the escrow_wallet.
   */
  readonly rewardEscrowWallet: PublicKey;
  /** The reward_escrow_wallet TokenAccount used to acrue rewards from requests made with custom parameters. */
  readonly rewardEscrowTokenWallet: PublicKey;
  /** The last reported error code if the most recent response was a failure */
  readonly errorStatus: number;
  /** Number of routines created for this function. Used to prevent closing when there are live routines. */
  readonly numRoutines: BN;
  /** Whether custom routines have been disabled for this function. */
  readonly routinesDisabled: types.BoolWithLockKind;
  /**
   * Whether new routines need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to provide AccessControl and only allow certain parties to run routines.
   */
  readonly routinesRequireAuthorization: number;
  /**
   * The fee that is paid out from the routine's escrow to the function's escrow on each successful invocation.
   * This is used to reward the function maintainer for providing the function.
   * 0 = No Fee. Sender = routine's escrow_token_wallet. Receiver = function's reward_token_wallet.
   */
  readonly routinesDevFee: BN;
  /** The functions MRENCLAVE measurement dictating the contents of the secure enclave. */
  readonly mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  readonly verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  readonly verificationTimestamp: BN;
  /** The unix timestamp when the quotes verification status expires. */
  readonly validUntil: BN;
  /** Reserved. */
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    76, 139, 47, 44, 240, 182, 148, 200,
  ]);

  static readonly layout = borsh.struct([
    borsh.u8("isScheduled"),
    borsh.u8("isTriggered"),
    borsh.u32("permissions"),
    types.FunctionStatus.layout("status"),
    borsh.u8("bump"),
    borsh.array(borsh.u8(), 32, "creatorSeed"),
    borsh.array(borsh.u8(), 64, "name"),
    borsh.array(borsh.u8(), 256, "metadata"),
    borsh.u64("createdAtSlot"),
    borsh.i64("createdAt"),
    borsh.i64("updatedAt"),
    types.Quote.layout("enclave"),
    borsh.array(borsh.array(borsh.u8(), 32), 32, "mrEnclaves"),
    borsh.array(borsh.u8(), 64, "containerRegistry"),
    borsh.array(borsh.u8(), 64, "container"),
    borsh.array(borsh.u8(), 32, "version"),
    borsh.array(borsh.u8(), 256, "paramsSchema"),
    borsh.array(borsh.u8(), 256, "defaultContainerParams"),
    borsh.publicKey("authority"),
    borsh.publicKey("attestationQueue"),
    borsh.u32("queueIdx"),
    borsh.publicKey("addressLookupTable"),
    borsh.array(borsh.u8(), 64, "schedule"),
    borsh.i64("lastExecutionTimestamp"),
    borsh.i64("nextAllowedTimestamp"),
    borsh.u64("triggerCount"),
    borsh.i64("triggeredSince"),
    borsh.i64("permissionExpiration"),
    borsh.u64("numRequests"),
    borsh.u8("requestsDisabled"),
    borsh.u8("requestsRequireAuthorization"),
    borsh.array(borsh.u8(), 8, "reserved1"),
    borsh.u64("requestsDevFee"),
    borsh.publicKey("escrowWallet"),
    borsh.publicKey("escrowTokenWallet"),
    borsh.publicKey("rewardEscrowWallet"),
    borsh.publicKey("rewardEscrowTokenWallet"),
    borsh.u8("errorStatus"),
    borsh.u64("numRoutines"),
    types.BoolWithLock.layout("routinesDisabled"),
    borsh.u8("routinesRequireAuthorization"),
    borsh.u64("routinesDevFee"),
    borsh.array(borsh.u8(), 32, "mrEnclave"),
    borsh.u8("verificationStatus"),
    borsh.i64("verificationTimestamp"),
    borsh.i64("validUntil"),
    borsh.array(borsh.u8(), 956, "ebuf"),
  ]);

  constructor(fields: FunctionAccountDataFields) {
    this.isScheduled = fields.isScheduled;
    this.isTriggered = fields.isTriggered;
    this.permissions = fields.permissions;
    this.status = fields.status;
    this.bump = fields.bump;
    this.creatorSeed = fields.creatorSeed;
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.createdAtSlot = fields.createdAtSlot;
    this.createdAt = fields.createdAt;
    this.updatedAt = fields.updatedAt;
    this.enclave = new types.Quote({ ...fields.enclave });
    this.mrEnclaves = fields.mrEnclaves;
    this.containerRegistry = fields.containerRegistry;
    this.container = fields.container;
    this.version = fields.version;
    this.paramsSchema = fields.paramsSchema;
    this.defaultContainerParams = fields.defaultContainerParams;
    this.authority = fields.authority;
    this.attestationQueue = fields.attestationQueue;
    this.queueIdx = fields.queueIdx;
    this.addressLookupTable = fields.addressLookupTable;
    this.schedule = fields.schedule;
    this.lastExecutionTimestamp = fields.lastExecutionTimestamp;
    this.nextAllowedTimestamp = fields.nextAllowedTimestamp;
    this.triggerCount = fields.triggerCount;
    this.triggeredSince = fields.triggeredSince;
    this.permissionExpiration = fields.permissionExpiration;
    this.numRequests = fields.numRequests;
    this.requestsDisabled = fields.requestsDisabled;
    this.requestsRequireAuthorization = fields.requestsRequireAuthorization;
    this.reserved1 = fields.reserved1;
    this.requestsDevFee = fields.requestsDevFee;
    this.escrowWallet = fields.escrowWallet;
    this.escrowTokenWallet = fields.escrowTokenWallet;
    this.rewardEscrowWallet = fields.rewardEscrowWallet;
    this.rewardEscrowTokenWallet = fields.rewardEscrowTokenWallet;
    this.errorStatus = fields.errorStatus;
    this.numRoutines = fields.numRoutines;
    this.routinesDisabled = fields.routinesDisabled;
    this.routinesRequireAuthorization = fields.routinesRequireAuthorization;
    this.routinesDevFee = fields.routinesDevFee;
    this.mrEnclave = fields.mrEnclave;
    this.verificationStatus = fields.verificationStatus;
    this.verificationTimestamp = fields.verificationTimestamp;
    this.validUntil = fields.validUntil;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey,
    programId: PublicKey = program.attestationProgramId
  ): Promise<FunctionAccountData | null> {
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
  ): Promise<Array<FunctionAccountData | null>> {
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

  static decode(data: Buffer): FunctionAccountData {
    if (!data.slice(0, 8).equals(FunctionAccountData.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = FunctionAccountData.layout.decode(data.slice(8));

    return new FunctionAccountData({
      isScheduled: dec.isScheduled,
      isTriggered: dec.isTriggered,
      permissions: dec.permissions,
      status: types.FunctionStatus.fromDecoded(dec.status),
      bump: dec.bump,
      creatorSeed: dec.creatorSeed,
      name: dec.name,
      metadata: dec.metadata,
      createdAtSlot: dec.createdAtSlot,
      createdAt: dec.createdAt,
      updatedAt: dec.updatedAt,
      enclave: types.Quote.fromDecoded(dec.enclave),
      mrEnclaves: dec.mrEnclaves,
      containerRegistry: dec.containerRegistry,
      container: dec.container,
      version: dec.version,
      paramsSchema: dec.paramsSchema,
      defaultContainerParams: dec.defaultContainerParams,
      authority: dec.authority,
      attestationQueue: dec.attestationQueue,
      queueIdx: dec.queueIdx,
      addressLookupTable: dec.addressLookupTable,
      schedule: dec.schedule,
      lastExecutionTimestamp: dec.lastExecutionTimestamp,
      nextAllowedTimestamp: dec.nextAllowedTimestamp,
      triggerCount: dec.triggerCount,
      triggeredSince: dec.triggeredSince,
      permissionExpiration: dec.permissionExpiration,
      numRequests: dec.numRequests,
      requestsDisabled: dec.requestsDisabled,
      requestsRequireAuthorization: dec.requestsRequireAuthorization,
      reserved1: dec.reserved1,
      requestsDevFee: dec.requestsDevFee,
      escrowWallet: dec.escrowWallet,
      escrowTokenWallet: dec.escrowTokenWallet,
      rewardEscrowWallet: dec.rewardEscrowWallet,
      rewardEscrowTokenWallet: dec.rewardEscrowTokenWallet,
      errorStatus: dec.errorStatus,
      numRoutines: dec.numRoutines,
      routinesDisabled: types.BoolWithLock.fromDecoded(dec.routinesDisabled),
      routinesRequireAuthorization: dec.routinesRequireAuthorization,
      routinesDevFee: dec.routinesDevFee,
      mrEnclave: dec.mrEnclave,
      verificationStatus: dec.verificationStatus,
      verificationTimestamp: dec.verificationTimestamp,
      validUntil: dec.validUntil,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): FunctionAccountDataJSON {
    return {
      isScheduled: this.isScheduled,
      isTriggered: this.isTriggered,
      permissions: this.permissions,
      status: this.status.toJSON(),
      bump: this.bump,
      creatorSeed: this.creatorSeed,
      name: this.name,
      metadata: this.metadata,
      createdAtSlot: this.createdAtSlot.toString(),
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
      enclave: this.enclave.toJSON(),
      mrEnclaves: this.mrEnclaves,
      containerRegistry: this.containerRegistry,
      container: this.container,
      version: this.version,
      paramsSchema: this.paramsSchema,
      defaultContainerParams: this.defaultContainerParams,
      authority: this.authority.toString(),
      attestationQueue: this.attestationQueue.toString(),
      queueIdx: this.queueIdx,
      addressLookupTable: this.addressLookupTable.toString(),
      schedule: this.schedule,
      lastExecutionTimestamp: this.lastExecutionTimestamp.toString(),
      nextAllowedTimestamp: this.nextAllowedTimestamp.toString(),
      triggerCount: this.triggerCount.toString(),
      triggeredSince: this.triggeredSince.toString(),
      permissionExpiration: this.permissionExpiration.toString(),
      numRequests: this.numRequests.toString(),
      requestsDisabled: this.requestsDisabled,
      requestsRequireAuthorization: this.requestsRequireAuthorization,
      reserved1: this.reserved1,
      requestsDevFee: this.requestsDevFee.toString(),
      escrowWallet: this.escrowWallet.toString(),
      escrowTokenWallet: this.escrowTokenWallet.toString(),
      rewardEscrowWallet: this.rewardEscrowWallet.toString(),
      rewardEscrowTokenWallet: this.rewardEscrowTokenWallet.toString(),
      errorStatus: this.errorStatus,
      numRoutines: this.numRoutines.toString(),
      routinesDisabled: this.routinesDisabled.toJSON(),
      routinesRequireAuthorization: this.routinesRequireAuthorization,
      routinesDevFee: this.routinesDevFee.toString(),
      mrEnclave: this.mrEnclave,
      verificationStatus: this.verificationStatus,
      verificationTimestamp: this.verificationTimestamp.toString(),
      validUntil: this.validUntil.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: FunctionAccountDataJSON): FunctionAccountData {
    return new FunctionAccountData({
      isScheduled: obj.isScheduled,
      isTriggered: obj.isTriggered,
      permissions: obj.permissions,
      status: types.FunctionStatus.fromJSON(obj.status),
      bump: obj.bump,
      creatorSeed: obj.creatorSeed,
      name: obj.name,
      metadata: obj.metadata,
      createdAtSlot: new BN(obj.createdAtSlot),
      createdAt: new BN(obj.createdAt),
      updatedAt: new BN(obj.updatedAt),
      enclave: types.Quote.fromJSON(obj.enclave),
      mrEnclaves: obj.mrEnclaves,
      containerRegistry: obj.containerRegistry,
      container: obj.container,
      version: obj.version,
      paramsSchema: obj.paramsSchema,
      defaultContainerParams: obj.defaultContainerParams,
      authority: new PublicKey(obj.authority),
      attestationQueue: new PublicKey(obj.attestationQueue),
      queueIdx: obj.queueIdx,
      addressLookupTable: new PublicKey(obj.addressLookupTable),
      schedule: obj.schedule,
      lastExecutionTimestamp: new BN(obj.lastExecutionTimestamp),
      nextAllowedTimestamp: new BN(obj.nextAllowedTimestamp),
      triggerCount: new BN(obj.triggerCount),
      triggeredSince: new BN(obj.triggeredSince),
      permissionExpiration: new BN(obj.permissionExpiration),
      numRequests: new BN(obj.numRequests),
      requestsDisabled: obj.requestsDisabled,
      requestsRequireAuthorization: obj.requestsRequireAuthorization,
      reserved1: obj.reserved1,
      requestsDevFee: new BN(obj.requestsDevFee),
      escrowWallet: new PublicKey(obj.escrowWallet),
      escrowTokenWallet: new PublicKey(obj.escrowTokenWallet),
      rewardEscrowWallet: new PublicKey(obj.rewardEscrowWallet),
      rewardEscrowTokenWallet: new PublicKey(obj.rewardEscrowTokenWallet),
      errorStatus: obj.errorStatus,
      numRoutines: new BN(obj.numRoutines),
      routinesDisabled: types.BoolWithLock.fromJSON(obj.routinesDisabled),
      routinesRequireAuthorization: obj.routinesRequireAuthorization,
      routinesDevFee: new BN(obj.routinesDevFee),
      mrEnclave: obj.mrEnclave,
      verificationStatus: obj.verificationStatus,
      verificationTimestamp: new BN(obj.verificationTimestamp),
      validUntil: new BN(obj.validUntil),
      ebuf: obj.ebuf,
    });
  }
}
