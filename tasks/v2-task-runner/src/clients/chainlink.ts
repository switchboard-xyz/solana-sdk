/* eslint-disable array-callback-return */
/* eslint-disable unicorn/no-await-expression-member */
import * as anchor from "@project-serum/anchor";
import {
  AccountInfo,
  clusterApiUrl,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import Big from "big.js";
import { getDefaultProvider } from "../utils";
import * as BigUtil from "../utils/big";

interface TransmissionHeader {
  version: number;
  description: Buffer;
  decimals: number;
  flaggingThreshold: number;
  latestRoundId: number;
  granularity: number;
  liveLength: number;
  liveCursor: number;
  historicalCursor: number;
  store: PublicKey;
  writer: PublicKey;
}

interface CursorValue {
  timestamp: anchor.BN;
  value: anchor.BN;
}

export class ChainlinkClient {
  static devnetStoreProgramId = new PublicKey(
    "CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT"
  );

  public connection: Connection;

  public storeProgram: anchor.Program | undefined;

  public storeCoder: anchor.BorshAccountsCoder | undefined;

  constructor(devnetConnection?: Connection) {
    this.connection =
      devnetConnection ?? new Connection(clusterApiUrl("devnet"));

    this.load();
  }

  public async load() {
    const provider = getDefaultProvider(this.connection);

    const storeIdl = await anchor.Program.fetchIdl(
      ChainlinkClient.devnetStoreProgramId,
      provider
    );

    if (!storeIdl) {
      throw new Error(`failed to read chainlink store idl`);
    }

    this.storeProgram = new anchor.Program(
      storeIdl,
      ChainlinkClient.devnetStoreProgramId,
      provider
    );

    this.storeCoder = new anchor.BorshAccountsCoder(this.storeProgram.idl);
  }

  public parseCursor(cursor: Buffer): CursorValue {
    return {
      timestamp: new anchor.BN(cursor.slice(0, 8), "le"),
      value: new anchor.BN(cursor.slice(8, 24), "le"),
    };
  }

  public async getOraclePrice(feedAddress: string): Promise<Big> {
    const publicKey = new PublicKey(feedAddress);

    if (this.storeProgram === undefined) {
      await this.load();
    }

    if (this.storeCoder === undefined) {
      this.storeCoder = new anchor.BorshAccountsCoder(this.storeProgram.idl);
    }

    const accountInfo: AccountInfo<Buffer> =
      await this.connection.getAccountInfo(publicKey);

    const header: TransmissionHeader = this.storeCoder.decode(
      "Transmissions",
      accountInfo.data
    );

    // set transmission
    let cursorIdx = header.liveCursor;
    const liveLength = header.liveLength;
    if (cursorIdx === 0) {
      cursorIdx = liveLength;
    }

    cursorIdx -= 1;

    const transmissionLength = 24;
    const transmissionOffset = 8 + 128 + cursorIdx * 24;

    const cursor = this.parseCursor(
      accountInfo.data.slice(
        transmissionOffset,
        transmissionOffset + transmissionLength
      )
    );

    const result = BigUtil.safeDiv(
      BigUtil.fromBN(cursor.value),
      BigUtil.safePow(new Big(10), header.decimals)
    );

    return result;
  }
}
