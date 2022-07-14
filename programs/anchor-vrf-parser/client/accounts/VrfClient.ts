import * as borsh from "@project-serum/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface VrfClientFields {
  bump: number;
  maxResult: BN;
  resultBuffer: Array<number>;
  result: BN;
  lastTimestamp: BN;
  authority: PublicKey;
  vrf: PublicKey;
}

export interface VrfClientJSON {
  bump: number;
  maxResult: string;
  resultBuffer: Array<number>;
  result: string;
  lastTimestamp: string;
  authority: string;
  vrf: string;
}

export class VrfClient {
  readonly bump: number;

  readonly maxResult: BN;

  readonly resultBuffer: Array<number>;

  readonly result: BN;

  readonly lastTimestamp: BN;

  readonly authority: PublicKey;

  readonly vrf: PublicKey;

  static readonly discriminator = Buffer.from([
    230, 174, 157, 153, 51, 18, 230, 163,
  ]);

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.u64("maxResult"),
    borsh.array(borsh.u8(), 32, "resultBuffer"),
    borsh.u128("result"),
    borsh.i64("lastTimestamp"),
    borsh.publicKey("authority"),
    borsh.publicKey("vrf"),
  ]);

  constructor(fields: VrfClientFields) {
    this.bump = fields.bump;
    this.maxResult = fields.maxResult;
    this.resultBuffer = fields.resultBuffer;
    this.result = fields.result;
    this.lastTimestamp = fields.lastTimestamp;
    this.authority = fields.authority;
    this.vrf = fields.vrf;
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<VrfClient | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<VrfClient | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): VrfClient {
    if (!data.slice(0, 8).equals(VrfClient.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = VrfClient.layout.decode(data.slice(8));

    return new VrfClient({
      bump: dec.bump,
      maxResult: dec.maxResult,
      resultBuffer: dec.resultBuffer,
      result: dec.result,
      lastTimestamp: dec.lastTimestamp,
      authority: dec.authority,
      vrf: dec.vrf,
    });
  }

  toJSON(): VrfClientJSON {
    return {
      bump: this.bump,
      maxResult: this.maxResult.toString(),
      resultBuffer: this.resultBuffer,
      result: this.result.toString(),
      lastTimestamp: this.lastTimestamp.toString(),
      authority: this.authority.toString(),
      vrf: this.vrf.toString(),
    };
  }

  static fromJSON(obj: VrfClientJSON): VrfClient {
    return new VrfClient({
      bump: obj.bump,
      maxResult: new BN(obj.maxResult),
      resultBuffer: obj.resultBuffer,
      result: new BN(obj.result),
      lastTimestamp: new BN(obj.lastTimestamp),
      authority: new PublicKey(obj.authority),
      vrf: new PublicKey(obj.vrf),
    });
  }
}
