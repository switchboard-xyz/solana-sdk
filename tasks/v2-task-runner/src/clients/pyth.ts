/* eslint-disable unicorn/no-await-expression-member */
import {
  AccountType,
  parseBaseData,
  parsePriceData,
  PythConnection,
} from "@pythnetwork/client";
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import Big from "big.js";

export class PythClient {
  static programId = new PublicKey(
    "FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH"
  );

  public connection: Connection;

  public client: PythConnection;

  constructor(mainnetConnection: Connection) {
    this.connection = mainnetConnection;
    this.client = new PythConnection(mainnetConnection, PythClient.programId);
  }

  public async getOraclePrice(
    feedAddress: string,
    acceptedConfidence?: number
  ): Promise<Big> {
    const publicKey = new PublicKey(feedAddress);

    // check account is in our account list OR just check owner here
    const accountInfo: AccountInfo<Buffer> =
      await this.connection.getAccountInfo(publicKey);

    const base = parseBaseData(accountInfo.data);
    if (!base || base.type !== AccountType.Price) {
      throw new Error(`Not a valid Pyth price account`);
    }

    const priceData = parsePriceData(accountInfo.data);
    return new Big(priceData.price);
  }
}
