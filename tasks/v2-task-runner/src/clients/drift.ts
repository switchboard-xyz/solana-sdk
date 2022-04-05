import {
  calculatePrice,
  getClearingHouseStateAccountPublicKey,
  Market,
  Markets,
  MARK_PRICE_PRECISION,
  StateAccount,
} from "@drift-labs/sdk";
import clearingHouseIdl from "@drift-labs/sdk/lib/idl/clearing_house.json";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import type Big from "big.js";
import { getDefaultProvider } from "../utils";
import * as BigUtil from "../utils/big";

export class DriftClient {
  public static programId = new PublicKey(
    "dammHkt7jmytvbS3nHTxQNEcP59aE57nxwV21YdqEDN"
  );

  public connection: Connection;

  public program: anchor.Program;

  public accountCoder: anchor.BorshAccountsCoder;

  public clearingHouseState: StateAccount | undefined;

  public markets?: Market[];

  public marketsLastFetched = 0;

  constructor(mainnetConnection: Connection) {
    this.connection = mainnetConnection;

    this.program = new anchor.Program(
      clearingHouseIdl as anchor.Idl,
      DriftClient.programId,
      getDefaultProvider(this.connection)
    );

    this.accountCoder = new anchor.BorshAccountsCoder(this.program.idl);

    this.initialize();
  }

  public async initialize(): Promise<void> {
    if (this.clearingHouseState === undefined) {
      const clearingHouseAccount = await this.connection.getAccountInfo(
        await getClearingHouseStateAccountPublicKey(this.program.programId)
      );
      this.clearingHouseState = this.accountCoder.decode(
        "State",
        clearingHouseAccount.data
      );
    }

    if (
      this.marketsLastFetched === 0 ||
      Date.now() - this.marketsLastFetched >= 5000 // 5 sec timeout
    ) {
      await this.fetchMarkets();
    }
  }

  // we could setup a subscription here with anchor
  public async fetchMarkets(): Promise<void> {
    const marketsAccount = await this.connection.getAccountInfo(
      this.clearingHouseState.markets
    );
    const allMarkets = this.accountCoder.decode("Markets", marketsAccount.data);
    // eslint-disable-next-line array-callback-return
    this.markets = (allMarkets.markets as any[]).filter((market) => {
      if (market?.initialized && market.initialized === true) {
        return market as Market;
      }
      return;
    });

    this.marketsLastFetched = Date.now();
  }

  public async getPerpPrice(marketName: string): Promise<Big> {
    await this.initialize();

    const marketMeta = Markets.find((market) => market.symbol === marketName);
    if (
      !marketMeta ||
      marketMeta.marketIndex.gt(new anchor.BN(this.markets.length))
    ) {
      throw new Error(`failed to find drift perp market`);
    }

    const market = this.markets[marketMeta.marketIndex.toNumber()];

    const markPrice = calculatePrice(
      market.amm.baseAssetReserve,
      market.amm.quoteAssetReserve,
      market.amm.pegMultiplier
    );

    return BigUtil.safeDiv(
      BigUtil.fromBN(markPrice),
      BigUtil.fromBN(MARK_PRICE_PRECISION)
    );
  }
}
