import * as borsh from "@project-serum/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../programId";

export interface BufferClientFields {}

export interface BufferClientJSON {}

export class BufferClient {
  static readonly discriminator = Buffer.from([
    142, 182, 89, 69, 9, 66, 10, 86,
  ]);

  static readonly layout = borsh.struct([]);

  constructor(fields: BufferClientFields) {}

  static async fetch(
    c: Connection,
    programId: PublicKey,
    address: PublicKey
  ): Promise<BufferClient | null> {
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
  ): Promise<Array<BufferClient | null>> {
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

  static decode(data: Buffer): BufferClient {
    if (!data.slice(0, 8).equals(BufferClient.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = BufferClient.layout.decode(data.slice(8));

    return new BufferClient({});
  }

  toJSON(): BufferClientJSON {
    return {};
  }

  static fromJSON(obj: BufferClientJSON): BufferClient {
    return new BufferClient({});
  }
}
