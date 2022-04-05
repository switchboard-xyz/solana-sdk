/* eslint-disable unicorn/no-await-expression-member */
import * as MangoClient from "@blockworks-foundation/mango-client";
import type { Connection } from "@solana/web3.js";
import Big from "big.js";
import { median } from "../utils";

export class MangoPerps {
  public connection: Connection;

  public config: MangoClient.Config;

  public group: MangoClient.GroupConfig;

  public client: MangoClient.MangoClient;

  public mangoGroup: Promise<MangoClient.MangoGroup>;

  constructor(mainnetConnection: Connection) {
    this.connection = mainnetConnection;
    this.config = new MangoClient.Config(MangoClient.Config.ids());
    this.group = this.config.getGroupWithName(
      "mainnet.1"
    ) as MangoClient.GroupConfig;
    this.client = new MangoClient.MangoClient(
      this.connection,
      this.group.mangoProgramId
    );
    this.mangoGroup = this.client.getMangoGroup(this.group.publicKey);
  }

  /** Calculate the perp price for a given Mango market */
  public async calculatePerpPrice(perpMarketAddress: string): Promise<Big> {
    const marketConfig = MangoClient.getMarketByPublicKey(
      this.group,
      perpMarketAddress
    ) as MangoClient.PerpMarketConfig;
    const market = await (
      await this.mangoGroup
    ).loadPerpMarket(
      this.connection,
      marketConfig.marketIndex,
      marketConfig.baseDecimals,
      marketConfig.quoteDecimals
    );

    const lastBid = this.getLastBid(market);
    const lastAsk = this.getLastAsk(market);
    const lastFill = this.getLastFill(market);

    const bigArray = (await Promise.all([lastBid, lastAsk, lastFill])).filter(
      Boolean // TODO: Verify this filters undefined values
    );

    const result = median(bigArray);
    return result;
  }

  private async getLastBid(market: MangoClient.PerpMarket): Promise<Big> {
    const bids = await market.loadBids(this.connection);
    const bestBid = bids.getBest();
    return new Big(bestBid.price);
  }

  private async getLastAsk(market: MangoClient.PerpMarket): Promise<Big> {
    const asks = await market.loadAsks(this.connection);
    const bestAsk = asks.getBest();
    return new Big(bestAsk.price);
  }

  private async getLastFill(
    market: MangoClient.PerpMarket
  ): Promise<Big | undefined> {
    const fills = await market.loadFills(this.connection);
    if (fills && fills.length > 0) {
      return new Big(fills[0].price);
    }

    return undefined;
  }
}
