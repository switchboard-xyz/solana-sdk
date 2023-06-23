import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestAccountDataFields {
  /** Whether the request is ready to be processed. */
  isTriggered: number;
  /** The status of the current request. */
  status: types.RequestStatusKind;
  /** Signer allowed to cancel the request. */
  authority: PublicKey;
  /** The default destination for rent exemption when the account is closed. */
  payer: PublicKey;
  /** The function that can process this request */
  function: PublicKey;
  /** The tokenAccount escrow */
  escrow: PublicKey;
  /** The current active request. */
  activeRequest: types.FunctionRequestTriggerRoundFields;
  /** The previous request. */
  previousRequest: types.FunctionRequestTriggerRoundFields;
  /** The maximum number of bytes to pass to the container params. */
  maxContainerParamsLen: number;
  /** Hash of the serialized container_params to prevent RPC tampering. */
  hash: Array<number>;
  /** The stringified container params to pass\ */
  containerParams: Uint8Array;
  /** The unix timestamp when the function was created. */
  createdAt: BN;
  /** The slot when the account can be garbage collected and closed by anyone for a portion of the rent. */
  garbageCollectionSlot: BN | null;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface FunctionRequestAccountDataJSON {
  /** Whether the request is ready to be processed. */
  isTriggered: number;
  /** The status of the current request. */
  status: types.RequestStatusJSON;
  /** Signer allowed to cancel the request. */
  authority: string;
  /** The default destination for rent exemption when the account is closed. */
  payer: string;
  /** The function that can process this request */
  function: string;
  /** The tokenAccount escrow */
  escrow: string;
  /** The current active request. */
  activeRequest: types.FunctionRequestTriggerRoundJSON;
  /** The previous request. */
  previousRequest: types.FunctionRequestTriggerRoundJSON;
  /** The maximum number of bytes to pass to the container params. */
  maxContainerParamsLen: number;
  /** Hash of the serialized container_params to prevent RPC tampering. */
  hash: Array<number>;
  /** The stringified container params to pass\ */
  containerParams: Array<number>;
  /** The unix timestamp when the function was created. */
  createdAt: string;
  /** The slot when the account can be garbage collected and closed by anyone for a portion of the rent. */
  garbageCollectionSlot: string | null;
  /** Reserved. */
  ebuf: Array<number>;
}

export class FunctionRequestAccountData {
  /** Whether the request is ready to be processed. */
  readonly isTriggered: number;
  /** The status of the current request. */
  readonly status: types.RequestStatusKind;
  /** Signer allowed to cancel the request. */
  readonly authority: PublicKey;
  /** The default destination for rent exemption when the account is closed. */
  readonly payer: PublicKey;
  /** The function that can process this request */
  readonly function: PublicKey;
  /** The tokenAccount escrow */
  readonly escrow: PublicKey;
  /** The current active request. */
  readonly activeRequest: types.FunctionRequestTriggerRound;
  /** The previous request. */
  readonly previousRequest: types.FunctionRequestTriggerRound;
  /** The maximum number of bytes to pass to the container params. */
  readonly maxContainerParamsLen: number;
  /** Hash of the serialized container_params to prevent RPC tampering. */
  readonly hash: Array<number>;
  /** The stringified container params to pass\ */
  readonly containerParams: Uint8Array;
  /** The unix timestamp when the function was created. */
  readonly createdAt: BN;
  /** The slot when the account can be garbage collected and closed by anyone for a portion of the rent. */
  readonly garbageCollectionSlot: BN | null;
  /** Reserved. */
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    8, 14, 177, 85, 144, 65, 148, 246,
  ]);

  static readonly layout = borsh.struct([
    borsh.u8("isTriggered"),
    types.RequestStatus.layout("status"),
    borsh.publicKey("authority"),
    borsh.publicKey("payer"),
    borsh.publicKey("function"),
    borsh.publicKey("escrow"),
    types.FunctionRequestTriggerRound.layout("activeRequest"),
    types.FunctionRequestTriggerRound.layout("previousRequest"),
    borsh.u32("maxContainerParamsLen"),
    borsh.array(borsh.u8(), 32, "hash"),
    borsh.vecU8("containerParams"),
    borsh.i64("createdAt"),
    borsh.option(borsh.u64(), "garbageCollectionSlot"),
    borsh.array(borsh.u8(), 256, "ebuf"),
  ]);

  constructor(fields: FunctionRequestAccountDataFields) {
    this.isTriggered = fields.isTriggered;
    this.status = fields.status;
    this.authority = fields.authority;
    this.payer = fields.payer;
    this.function = fields.function;
    this.escrow = fields.escrow;
    this.activeRequest = new types.FunctionRequestTriggerRound({
      ...fields.activeRequest,
    });
    this.previousRequest = new types.FunctionRequestTriggerRound({
      ...fields.previousRequest,
    });
    this.maxContainerParamsLen = fields.maxContainerParamsLen;
    this.hash = fields.hash;
    this.containerParams = fields.containerParams;
    this.createdAt = fields.createdAt;
    this.garbageCollectionSlot = fields.garbageCollectionSlot;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<FunctionRequestAccountData | null> {
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
  ): Promise<Array<FunctionRequestAccountData | null>> {
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

  static decode(data: Buffer): FunctionRequestAccountData {
    if (!data.slice(0, 8).equals(FunctionRequestAccountData.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = FunctionRequestAccountData.layout.decode(data.slice(8));

    return new FunctionRequestAccountData({
      isTriggered: dec.isTriggered,
      status: types.RequestStatus.fromDecoded(dec.status),
      authority: dec.authority,
      payer: dec.payer,
      function: dec.function,
      escrow: dec.escrow,
      activeRequest: types.FunctionRequestTriggerRound.fromDecoded(
        dec.activeRequest
      ),
      previousRequest: types.FunctionRequestTriggerRound.fromDecoded(
        dec.previousRequest
      ),
      maxContainerParamsLen: dec.maxContainerParamsLen,
      hash: dec.hash,
      containerParams: new Uint8Array(
        dec.containerParams.buffer,
        dec.containerParams.byteOffset,
        dec.containerParams.length
      ),
      createdAt: dec.createdAt,
      garbageCollectionSlot: dec.garbageCollectionSlot,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): FunctionRequestAccountDataJSON {
    return {
      isTriggered: this.isTriggered,
      status: this.status.toJSON(),
      authority: this.authority.toString(),
      payer: this.payer.toString(),
      function: this.function.toString(),
      escrow: this.escrow.toString(),
      activeRequest: this.activeRequest.toJSON(),
      previousRequest: this.previousRequest.toJSON(),
      maxContainerParamsLen: this.maxContainerParamsLen,
      hash: this.hash,
      containerParams: Array.from(this.containerParams.values()),
      createdAt: this.createdAt.toString(),
      garbageCollectionSlot:
        (this.garbageCollectionSlot && this.garbageCollectionSlot.toString()) ||
        null,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(
    obj: FunctionRequestAccountDataJSON
  ): FunctionRequestAccountData {
    return new FunctionRequestAccountData({
      isTriggered: obj.isTriggered,
      status: types.RequestStatus.fromJSON(obj.status),
      authority: new PublicKey(obj.authority),
      payer: new PublicKey(obj.payer),
      function: new PublicKey(obj.function),
      escrow: new PublicKey(obj.escrow),
      activeRequest: types.FunctionRequestTriggerRound.fromJSON(
        obj.activeRequest
      ),
      previousRequest: types.FunctionRequestTriggerRound.fromJSON(
        obj.previousRequest
      ),
      maxContainerParamsLen: obj.maxContainerParamsLen,
      hash: obj.hash,
      containerParams: Uint8Array.from(obj.containerParams),
      createdAt: new BN(obj.createdAt),
      garbageCollectionSlot:
        (obj.garbageCollectionSlot && new BN(obj.garbageCollectionSlot)) ||
        null,
      ebuf: obj.ebuf,
    });
  }
}
