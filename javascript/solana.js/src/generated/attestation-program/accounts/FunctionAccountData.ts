import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
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
  /** The name of the function for easier identification. */
  name: Array<number>;
  /** The metadata of the function for easier identification. */
  metadata: Array<number>;
  /** The unix timestamp when the function was created. */
  createdAt: BN;
  /** The unix timestamp when the function config (container, registry, version, or schedule) was changed. */
  updatedAt: BN;
  /** The off-chain registry to fetch the function container from. */
  containerRegistry: Array<number>;
  /** The identifier of the container in the given container_registry. */
  container: Array<number>;
  /** The version tag of the container to pull. */
  version: Array<number>;
  /** The authority of the function which is authorized to make account changes. */
  authority: PublicKey;
  /** The wrapped SOL escrow of the function to pay for scheduled requests. */
  escrow: PublicKey;
  /** The address_lookup_table of the function used to increase the number of accounts we can fit into a function result. */
  addressLookupTable: PublicKey;
  /** The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements. */
  attestationQueue: PublicKey;
  /** An incrementer used to rotate through an AttestationQueue's verifiers. */
  queueIdx: number;
  /** The cron schedule to run the function on. */
  schedule: Array<number>;
  /** The unix timestamp when the function was last run. */
  lastExecutionTimestamp: BN;
  /** The unix timestamp when the function is allowed to run next. */
  nextAllowedTimestamp: BN;
  /** The number of times to trigger the function upon the next invocation. */
  triggerCount: BN;
  /** UNUSED. The unix timestamp when the current permissions expire. */
  permissionExpiration: BN;
  /** Number of users created for this function. Used to prevent closing when there are live users. */
  numUsers: BN;
  /** Whether custom requests have been disabled for this function. */
  usersDisabled: boolean;
  /**
   * Whether new users need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to use CPIs to control user account creation.
   */
  usersRequireAuthorization: boolean;
  /**
   * The number of slots after a request has been verified before allowing a non-authority account to close the account.
   * Useful if you want to submit multiple txns in your custom function and need the account to be kept alive for multiple slots.
   */
  usersDefaultSlotsUntilExpiration: BN;
  /** The lamports paid to the FunctionAccount escrow on each successful update request. */
  usersRequestFee: BN;
  /** An array of permitted mr_enclave measurements for the function. */
  mrEnclaves: Array<Array<number>>;
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
  /** The name of the function for easier identification. */
  name: Array<number>;
  /** The metadata of the function for easier identification. */
  metadata: Array<number>;
  /** The unix timestamp when the function was created. */
  createdAt: string;
  /** The unix timestamp when the function config (container, registry, version, or schedule) was changed. */
  updatedAt: string;
  /** The off-chain registry to fetch the function container from. */
  containerRegistry: Array<number>;
  /** The identifier of the container in the given container_registry. */
  container: Array<number>;
  /** The version tag of the container to pull. */
  version: Array<number>;
  /** The authority of the function which is authorized to make account changes. */
  authority: string;
  /** The wrapped SOL escrow of the function to pay for scheduled requests. */
  escrow: string;
  /** The address_lookup_table of the function used to increase the number of accounts we can fit into a function result. */
  addressLookupTable: string;
  /** The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements. */
  attestationQueue: string;
  /** An incrementer used to rotate through an AttestationQueue's verifiers. */
  queueIdx: number;
  /** The cron schedule to run the function on. */
  schedule: Array<number>;
  /** The unix timestamp when the function was last run. */
  lastExecutionTimestamp: string;
  /** The unix timestamp when the function is allowed to run next. */
  nextAllowedTimestamp: string;
  /** The number of times to trigger the function upon the next invocation. */
  triggerCount: string;
  /** UNUSED. The unix timestamp when the current permissions expire. */
  permissionExpiration: string;
  /** Number of users created for this function. Used to prevent closing when there are live users. */
  numUsers: string;
  /** Whether custom requests have been disabled for this function. */
  usersDisabled: boolean;
  /**
   * Whether new users need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to use CPIs to control user account creation.
   */
  usersRequireAuthorization: boolean;
  /**
   * The number of slots after a request has been verified before allowing a non-authority account to close the account.
   * Useful if you want to submit multiple txns in your custom function and need the account to be kept alive for multiple slots.
   */
  usersDefaultSlotsUntilExpiration: string;
  /** The lamports paid to the FunctionAccount escrow on each successful update request. */
  usersRequestFee: string;
  /** An array of permitted mr_enclave measurements for the function. */
  mrEnclaves: Array<Array<number>>;
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
  /** The name of the function for easier identification. */
  readonly name: Array<number>;
  /** The metadata of the function for easier identification. */
  readonly metadata: Array<number>;
  /** The unix timestamp when the function was created. */
  readonly createdAt: BN;
  /** The unix timestamp when the function config (container, registry, version, or schedule) was changed. */
  readonly updatedAt: BN;
  /** The off-chain registry to fetch the function container from. */
  readonly containerRegistry: Array<number>;
  /** The identifier of the container in the given container_registry. */
  readonly container: Array<number>;
  /** The version tag of the container to pull. */
  readonly version: Array<number>;
  /** The authority of the function which is authorized to make account changes. */
  readonly authority: PublicKey;
  /** The wrapped SOL escrow of the function to pay for scheduled requests. */
  readonly escrow: PublicKey;
  /** The address_lookup_table of the function used to increase the number of accounts we can fit into a function result. */
  readonly addressLookupTable: PublicKey;
  /** The address of the AttestationQueueAccountData that will be processing function requests and verifying the function measurements. */
  readonly attestationQueue: PublicKey;
  /** An incrementer used to rotate through an AttestationQueue's verifiers. */
  readonly queueIdx: number;
  /** The cron schedule to run the function on. */
  readonly schedule: Array<number>;
  /** The unix timestamp when the function was last run. */
  readonly lastExecutionTimestamp: BN;
  /** The unix timestamp when the function is allowed to run next. */
  readonly nextAllowedTimestamp: BN;
  /** The number of times to trigger the function upon the next invocation. */
  readonly triggerCount: BN;
  /** UNUSED. The unix timestamp when the current permissions expire. */
  readonly permissionExpiration: BN;
  /** Number of users created for this function. Used to prevent closing when there are live users. */
  readonly numUsers: BN;
  /** Whether custom requests have been disabled for this function. */
  readonly usersDisabled: boolean;
  /**
   * Whether new users need to be authorized by the FunctionAccount authority before being initialized.
   * Useful if you want to use CPIs to control user account creation.
   */
  readonly usersRequireAuthorization: boolean;
  /**
   * The number of slots after a request has been verified before allowing a non-authority account to close the account.
   * Useful if you want to submit multiple txns in your custom function and need the account to be kept alive for multiple slots.
   */
  readonly usersDefaultSlotsUntilExpiration: BN;
  /** The lamports paid to the FunctionAccount escrow on each successful update request. */
  readonly usersRequestFee: BN;
  /** An array of permitted mr_enclave measurements for the function. */
  readonly mrEnclaves: Array<Array<number>>;
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
    borsh.array(borsh.u8(), 64, "name"),
    borsh.array(borsh.u8(), 256, "metadata"),
    borsh.i64("createdAt"),
    borsh.i64("updatedAt"),
    borsh.array(borsh.u8(), 64, "containerRegistry"),
    borsh.array(borsh.u8(), 64, "container"),
    borsh.array(borsh.u8(), 32, "version"),
    borsh.publicKey("authority"),
    borsh.publicKey("escrow"),
    borsh.publicKey("addressLookupTable"),
    borsh.publicKey("attestationQueue"),
    borsh.u32("queueIdx"),
    borsh.array(borsh.u8(), 64, "schedule"),
    borsh.i64("lastExecutionTimestamp"),
    borsh.i64("nextAllowedTimestamp"),
    borsh.u64("triggerCount"),
    borsh.i64("permissionExpiration"),
    borsh.u64("numUsers"),
    borsh.bool("usersDisabled"),
    borsh.bool("usersRequireAuthorization"),
    borsh.u64("usersDefaultSlotsUntilExpiration"),
    borsh.u64("usersRequestFee"),
    borsh.array(borsh.array(borsh.u8(), 32), 32, "mrEnclaves"),
    borsh.array(borsh.u8(), 1024, "ebuf"),
  ]);

  constructor(fields: FunctionAccountDataFields) {
    this.isScheduled = fields.isScheduled;
    this.isTriggered = fields.isTriggered;
    this.permissions = fields.permissions;
    this.status = fields.status;
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.createdAt = fields.createdAt;
    this.updatedAt = fields.updatedAt;
    this.containerRegistry = fields.containerRegistry;
    this.container = fields.container;
    this.version = fields.version;
    this.authority = fields.authority;
    this.escrow = fields.escrow;
    this.addressLookupTable = fields.addressLookupTable;
    this.attestationQueue = fields.attestationQueue;
    this.queueIdx = fields.queueIdx;
    this.schedule = fields.schedule;
    this.lastExecutionTimestamp = fields.lastExecutionTimestamp;
    this.nextAllowedTimestamp = fields.nextAllowedTimestamp;
    this.triggerCount = fields.triggerCount;
    this.permissionExpiration = fields.permissionExpiration;
    this.numUsers = fields.numUsers;
    this.usersDisabled = fields.usersDisabled;
    this.usersRequireAuthorization = fields.usersRequireAuthorization;
    this.usersDefaultSlotsUntilExpiration =
      fields.usersDefaultSlotsUntilExpiration;
    this.usersRequestFee = fields.usersRequestFee;
    this.mrEnclaves = fields.mrEnclaves;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<FunctionAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(program.attestationProgramId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[]
  ): Promise<Array<FunctionAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.attestationProgramId)) {
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
      name: dec.name,
      metadata: dec.metadata,
      createdAt: dec.createdAt,
      updatedAt: dec.updatedAt,
      containerRegistry: dec.containerRegistry,
      container: dec.container,
      version: dec.version,
      authority: dec.authority,
      escrow: dec.escrow,
      addressLookupTable: dec.addressLookupTable,
      attestationQueue: dec.attestationQueue,
      queueIdx: dec.queueIdx,
      schedule: dec.schedule,
      lastExecutionTimestamp: dec.lastExecutionTimestamp,
      nextAllowedTimestamp: dec.nextAllowedTimestamp,
      triggerCount: dec.triggerCount,
      permissionExpiration: dec.permissionExpiration,
      numUsers: dec.numUsers,
      usersDisabled: dec.usersDisabled,
      usersRequireAuthorization: dec.usersRequireAuthorization,
      usersDefaultSlotsUntilExpiration: dec.usersDefaultSlotsUntilExpiration,
      usersRequestFee: dec.usersRequestFee,
      mrEnclaves: dec.mrEnclaves,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): FunctionAccountDataJSON {
    return {
      isScheduled: this.isScheduled,
      isTriggered: this.isTriggered,
      permissions: this.permissions,
      status: this.status.toJSON(),
      name: this.name,
      metadata: this.metadata,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
      containerRegistry: this.containerRegistry,
      container: this.container,
      version: this.version,
      authority: this.authority.toString(),
      escrow: this.escrow.toString(),
      addressLookupTable: this.addressLookupTable.toString(),
      attestationQueue: this.attestationQueue.toString(),
      queueIdx: this.queueIdx,
      schedule: this.schedule,
      lastExecutionTimestamp: this.lastExecutionTimestamp.toString(),
      nextAllowedTimestamp: this.nextAllowedTimestamp.toString(),
      triggerCount: this.triggerCount.toString(),
      permissionExpiration: this.permissionExpiration.toString(),
      numUsers: this.numUsers.toString(),
      usersDisabled: this.usersDisabled,
      usersRequireAuthorization: this.usersRequireAuthorization,
      usersDefaultSlotsUntilExpiration:
        this.usersDefaultSlotsUntilExpiration.toString(),
      usersRequestFee: this.usersRequestFee.toString(),
      mrEnclaves: this.mrEnclaves,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: FunctionAccountDataJSON): FunctionAccountData {
    return new FunctionAccountData({
      isScheduled: obj.isScheduled,
      isTriggered: obj.isTriggered,
      permissions: obj.permissions,
      status: types.FunctionStatus.fromJSON(obj.status),
      name: obj.name,
      metadata: obj.metadata,
      createdAt: new BN(obj.createdAt),
      updatedAt: new BN(obj.updatedAt),
      containerRegistry: obj.containerRegistry,
      container: obj.container,
      version: obj.version,
      authority: new PublicKey(obj.authority),
      escrow: new PublicKey(obj.escrow),
      addressLookupTable: new PublicKey(obj.addressLookupTable),
      attestationQueue: new PublicKey(obj.attestationQueue),
      queueIdx: obj.queueIdx,
      schedule: obj.schedule,
      lastExecutionTimestamp: new BN(obj.lastExecutionTimestamp),
      nextAllowedTimestamp: new BN(obj.nextAllowedTimestamp),
      triggerCount: new BN(obj.triggerCount),
      permissionExpiration: new BN(obj.permissionExpiration),
      numUsers: new BN(obj.numUsers),
      usersDisabled: obj.usersDisabled,
      usersRequireAuthorization: obj.usersRequireAuthorization,
      usersDefaultSlotsUntilExpiration: new BN(
        obj.usersDefaultSlotsUntilExpiration
      ),
      usersRequestFee: new BN(obj.usersRequestFee),
      mrEnclaves: obj.mrEnclaves,
      ebuf: obj.ebuf,
    });
  }
}
