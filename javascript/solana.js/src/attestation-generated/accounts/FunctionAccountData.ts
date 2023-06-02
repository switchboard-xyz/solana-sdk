import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionAccountDataFields {
  name: Array<number>;
  metadata: Array<number>;
  authority: PublicKey;
  /** */
  containerRegistry: Array<number>;
  container: Array<number>;
  version: Array<number>;
  /** */
  attestationQueue: PublicKey;
  queueIdx: number;
  lastExecutionTimestamp: BN;
  nextAllowedTimestamp: BN;
  schedule: Array<number>;
  escrow: PublicKey;
  status: types.FunctionStatusKind;
  createdAt: BN;
  ebuf: Array<number>;
}

export interface FunctionAccountDataJSON {
  name: Array<number>;
  metadata: Array<number>;
  authority: string;
  /** */
  containerRegistry: Array<number>;
  container: Array<number>;
  version: Array<number>;
  /** */
  attestationQueue: string;
  queueIdx: number;
  lastExecutionTimestamp: string;
  nextAllowedTimestamp: string;
  schedule: Array<number>;
  escrow: string;
  status: types.FunctionStatusJSON;
  createdAt: string;
  ebuf: Array<number>;
}

export class FunctionAccountData {
  readonly name: Array<number>;
  readonly metadata: Array<number>;
  readonly authority: PublicKey;
  /** */
  readonly containerRegistry: Array<number>;
  readonly container: Array<number>;
  readonly version: Array<number>;
  /** */
  readonly attestationQueue: PublicKey;
  readonly queueIdx: number;
  readonly lastExecutionTimestamp: BN;
  readonly nextAllowedTimestamp: BN;
  readonly schedule: Array<number>;
  readonly escrow: PublicKey;
  readonly status: types.FunctionStatusKind;
  readonly createdAt: BN;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    76, 139, 47, 44, 240, 182, 148, 200,
  ]);

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 64, "name"),
    borsh.array(borsh.u8(), 256, "metadata"),
    borsh.publicKey("authority"),
    borsh.array(borsh.u8(), 64, "containerRegistry"),
    borsh.array(borsh.u8(), 64, "container"),
    borsh.array(borsh.u8(), 32, "version"),
    borsh.publicKey("attestationQueue"),
    borsh.u32("queueIdx"),
    borsh.i64("lastExecutionTimestamp"),
    borsh.i64("nextAllowedTimestamp"),
    borsh.array(borsh.u8(), 64, "schedule"),
    borsh.publicKey("escrow"),
    types.FunctionStatus.layout("status"),
    borsh.i64("createdAt"),
    borsh.array(borsh.u8(), 1024, "ebuf"),
  ]);

  constructor(fields: FunctionAccountDataFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.authority = fields.authority;
    this.containerRegistry = fields.containerRegistry;
    this.container = fields.container;
    this.version = fields.version;
    this.attestationQueue = fields.attestationQueue;
    this.queueIdx = fields.queueIdx;
    this.lastExecutionTimestamp = fields.lastExecutionTimestamp;
    this.nextAllowedTimestamp = fields.nextAllowedTimestamp;
    this.schedule = fields.schedule;
    this.escrow = fields.escrow;
    this.status = fields.status;
    this.createdAt = fields.createdAt;
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
      name: dec.name,
      metadata: dec.metadata,
      authority: dec.authority,
      containerRegistry: dec.containerRegistry,
      container: dec.container,
      version: dec.version,
      attestationQueue: dec.attestationQueue,
      queueIdx: dec.queueIdx,
      lastExecutionTimestamp: dec.lastExecutionTimestamp,
      nextAllowedTimestamp: dec.nextAllowedTimestamp,
      schedule: dec.schedule,
      escrow: dec.escrow,
      status: types.FunctionStatus.fromDecoded(dec.status),
      createdAt: dec.createdAt,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): FunctionAccountDataJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      authority: this.authority.toString(),
      containerRegistry: this.containerRegistry,
      container: this.container,
      version: this.version,
      attestationQueue: this.attestationQueue.toString(),
      queueIdx: this.queueIdx,
      lastExecutionTimestamp: this.lastExecutionTimestamp.toString(),
      nextAllowedTimestamp: this.nextAllowedTimestamp.toString(),
      schedule: this.schedule,
      escrow: this.escrow.toString(),
      status: this.status.toJSON(),
      createdAt: this.createdAt.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: FunctionAccountDataJSON): FunctionAccountData {
    return new FunctionAccountData({
      name: obj.name,
      metadata: obj.metadata,
      authority: new PublicKey(obj.authority),
      containerRegistry: obj.containerRegistry,
      container: obj.container,
      version: obj.version,
      attestationQueue: new PublicKey(obj.attestationQueue),
      queueIdx: obj.queueIdx,
      lastExecutionTimestamp: new BN(obj.lastExecutionTimestamp),
      nextAllowedTimestamp: new BN(obj.nextAllowedTimestamp),
      schedule: obj.schedule,
      escrow: new PublicKey(obj.escrow),
      status: types.FunctionStatus.fromJSON(obj.status),
      createdAt: new BN(obj.createdAt),
      ebuf: obj.ebuf,
    });
  }
}
