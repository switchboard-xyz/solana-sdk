import * as borsh from "@project-serum/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../programId";

export interface FeedClientFields {}

export interface FeedClientJSON {}

export class FeedClient {
  static readonly discriminator = Buffer.from([
    30, 15, 152, 236, 85, 180, 84, 151,
  ]);

  static readonly layout = borsh.struct([]);

  constructor(fields: FeedClientFields) {}

  static async fetch(
    c: Connection,
    programId: PublicKey,
    address: PublicKey
  ): Promise<FeedClient | null> {
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
  ): Promise<Array<FeedClient | null>> {
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

  static decode(data: Buffer): FeedClient {
    if (!data.slice(0, 8).equals(FeedClient.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = FeedClient.layout.decode(data.slice(8));

    return new FeedClient({});
  }

  toJSON(): FeedClientJSON {
    return {};
  }

  static fromJSON(obj: FeedClientJSON): FeedClient {
    return new FeedClient({});
  }
}
