import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfLiteAccountDataFields {
  /** The bump used to derive the SbState account. */
  stateBump: number;
  /** The bump used to derive the permission account. */
  permissionBump: number;
  /** The VrfPool the account belongs to. */
  vrfPool: PublicKey;
  /** The current status of the VRF account. */
  status: types.VrfStatusKind;
  /** The VRF round result. Will be zeroized if still awaiting fulfillment. */
  result: Array<number>;
  /** Incremental counter for tracking VRF rounds. */
  counter: BN;
  /** The alpha bytes used to calculate the VRF proof. */
  alpha: Array<number>;
  /** The number of bytes in the alpha buffer. */
  alphaLen: number;
  /** The Slot when the VRF round was opened. */
  requestSlot: BN;
  /** The unix timestamp when the VRF round was opened. */
  requestTimestamp: BN;
  /** On-chain account delegated for making account changes. */
  authority: PublicKey;
  /** The OracleQueueAccountData that is assigned to fulfill VRF update request. */
  queue: PublicKey;
  /** The token account used to hold funds for VRF update request. */
  escrow: PublicKey;
  /** The callback that is invoked when an update request is successfully verified. */
  callback: types.CallbackZCFields;
  /** The incremental VRF proof calculation. */
  builder: types.VrfBuilderFields;
  expiration: BN;
  ebuf: Array<number>;
}

export interface VrfLiteAccountDataJSON {
  /** The bump used to derive the SbState account. */
  stateBump: number;
  /** The bump used to derive the permission account. */
  permissionBump: number;
  /** The VrfPool the account belongs to. */
  vrfPool: string;
  /** The current status of the VRF account. */
  status: types.VrfStatusJSON;
  /** The VRF round result. Will be zeroized if still awaiting fulfillment. */
  result: Array<number>;
  /** Incremental counter for tracking VRF rounds. */
  counter: string;
  /** The alpha bytes used to calculate the VRF proof. */
  alpha: Array<number>;
  /** The number of bytes in the alpha buffer. */
  alphaLen: number;
  /** The Slot when the VRF round was opened. */
  requestSlot: string;
  /** The unix timestamp when the VRF round was opened. */
  requestTimestamp: string;
  /** On-chain account delegated for making account changes. */
  authority: string;
  /** The OracleQueueAccountData that is assigned to fulfill VRF update request. */
  queue: string;
  /** The token account used to hold funds for VRF update request. */
  escrow: string;
  /** The callback that is invoked when an update request is successfully verified. */
  callback: types.CallbackZCJSON;
  /** The incremental VRF proof calculation. */
  builder: types.VrfBuilderJSON;
  expiration: string;
  ebuf: Array<number>;
}

export class VrfLiteAccountData {
  /** The bump used to derive the SbState account. */
  readonly stateBump: number;
  /** The bump used to derive the permission account. */
  readonly permissionBump: number;
  /** The VrfPool the account belongs to. */
  readonly vrfPool: PublicKey;
  /** The current status of the VRF account. */
  readonly status: types.VrfStatusKind;
  /** The VRF round result. Will be zeroized if still awaiting fulfillment. */
  readonly result: Array<number>;
  /** Incremental counter for tracking VRF rounds. */
  readonly counter: BN;
  /** The alpha bytes used to calculate the VRF proof. */
  readonly alpha: Array<number>;
  /** The number of bytes in the alpha buffer. */
  readonly alphaLen: number;
  /** The Slot when the VRF round was opened. */
  readonly requestSlot: BN;
  /** The unix timestamp when the VRF round was opened. */
  readonly requestTimestamp: BN;
  /** On-chain account delegated for making account changes. */
  readonly authority: PublicKey;
  /** The OracleQueueAccountData that is assigned to fulfill VRF update request. */
  readonly queue: PublicKey;
  /** The token account used to hold funds for VRF update request. */
  readonly escrow: PublicKey;
  /** The callback that is invoked when an update request is successfully verified. */
  readonly callback: types.CallbackZC;
  /** The incremental VRF proof calculation. */
  readonly builder: types.VrfBuilder;
  readonly expiration: BN;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    98, 127, 126, 124, 166, 81, 97, 100,
  ]);

  static readonly layout = borsh.struct([
    borsh.u8("stateBump"),
    borsh.u8("permissionBump"),
    borsh.publicKey("vrfPool"),
    types.VrfStatus.layout("status"),
    borsh.array(borsh.u8(), 32, "result"),
    borsh.u128("counter"),
    borsh.array(borsh.u8(), 256, "alpha"),
    borsh.u32("alphaLen"),
    borsh.u64("requestSlot"),
    borsh.i64("requestTimestamp"),
    borsh.publicKey("authority"),
    borsh.publicKey("queue"),
    borsh.publicKey("escrow"),
    types.CallbackZC.layout("callback"),
    types.VrfBuilder.layout("builder"),
    borsh.i64("expiration"),
    borsh.array(borsh.u8(), 1024, "ebuf"),
  ]);

  constructor(fields: VrfLiteAccountDataFields) {
    this.stateBump = fields.stateBump;
    this.permissionBump = fields.permissionBump;
    this.vrfPool = fields.vrfPool;
    this.status = fields.status;
    this.result = fields.result;
    this.counter = fields.counter;
    this.alpha = fields.alpha;
    this.alphaLen = fields.alphaLen;
    this.requestSlot = fields.requestSlot;
    this.requestTimestamp = fields.requestTimestamp;
    this.authority = fields.authority;
    this.queue = fields.queue;
    this.escrow = fields.escrow;
    this.callback = new types.CallbackZC({ ...fields.callback });
    this.builder = new types.VrfBuilder({ ...fields.builder });
    this.expiration = fields.expiration;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey,
    programId: PublicKey = program.oracleProgramId
  ): Promise<VrfLiteAccountData | null> {
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
    programId: PublicKey = program.oracleProgramId
  ): Promise<Array<VrfLiteAccountData | null>> {
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

  static decode(data: Buffer): VrfLiteAccountData {
    if (!data.slice(0, 8).equals(VrfLiteAccountData.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = VrfLiteAccountData.layout.decode(data.slice(8));

    return new VrfLiteAccountData({
      stateBump: dec.stateBump,
      permissionBump: dec.permissionBump,
      vrfPool: dec.vrfPool,
      status: types.VrfStatus.fromDecoded(dec.status),
      result: dec.result,
      counter: dec.counter,
      alpha: dec.alpha,
      alphaLen: dec.alphaLen,
      requestSlot: dec.requestSlot,
      requestTimestamp: dec.requestTimestamp,
      authority: dec.authority,
      queue: dec.queue,
      escrow: dec.escrow,
      callback: types.CallbackZC.fromDecoded(dec.callback),
      builder: types.VrfBuilder.fromDecoded(dec.builder),
      expiration: dec.expiration,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): VrfLiteAccountDataJSON {
    return {
      stateBump: this.stateBump,
      permissionBump: this.permissionBump,
      vrfPool: this.vrfPool.toString(),
      status: this.status.toJSON(),
      result: this.result,
      counter: this.counter.toString(),
      alpha: this.alpha,
      alphaLen: this.alphaLen,
      requestSlot: this.requestSlot.toString(),
      requestTimestamp: this.requestTimestamp.toString(),
      authority: this.authority.toString(),
      queue: this.queue.toString(),
      escrow: this.escrow.toString(),
      callback: this.callback.toJSON(),
      builder: this.builder.toJSON(),
      expiration: this.expiration.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: VrfLiteAccountDataJSON): VrfLiteAccountData {
    return new VrfLiteAccountData({
      stateBump: obj.stateBump,
      permissionBump: obj.permissionBump,
      vrfPool: new PublicKey(obj.vrfPool),
      status: types.VrfStatus.fromJSON(obj.status),
      result: obj.result,
      counter: new BN(obj.counter),
      alpha: obj.alpha,
      alphaLen: obj.alphaLen,
      requestSlot: new BN(obj.requestSlot),
      requestTimestamp: new BN(obj.requestTimestamp),
      authority: new PublicKey(obj.authority),
      queue: new PublicKey(obj.queue),
      escrow: new PublicKey(obj.escrow),
      callback: types.CallbackZC.fromJSON(obj.callback),
      builder: types.VrfBuilder.fromJSON(obj.builder),
      expiration: new BN(obj.expiration),
      ebuf: obj.ebuf,
    });
  }
}
