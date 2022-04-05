/* eslint-disable unicorn/no-await-expression-member */
import { Market } from "@project-serum/serum";
import type { Order } from "@project-serum/serum/lib/market";
import { Connection, PublicKey } from "@solana/web3.js";
import Big from "big.js";
import { median } from "../utils";

export class SerumSwap {
  public programAddress = new PublicKey(
    "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
  ); // serum mainnet PID

  public connection: Connection;

  constructor(mainnetConnection: Connection) {
    this.connection = mainnetConnection;
  }

  /** Calculate the swap price for a given serum pool */
  public async calculateSwapPrice(poolAddress: string): Promise<Big> {
    let market: Market;
    try {
      market = await Market.load(
        this.connection,
        new PublicKey(poolAddress),
        {},
        this.programAddress
      );
    } catch (error) {
      throw new Error(`failed to load serum market ${error}`);
    }

    const lastBid = this.getLastBid(market);
    const lastAsk = this.getLastAsk(market);
    const lastFill = this.getLastFill(market);

    const bigArray = (await Promise.all([lastBid, lastAsk, lastFill])).filter(
      Boolean
    );

    const result = median(bigArray);
    return result;
  }

  private async getLastBid(market: Market): Promise<Big> {
    try {
      const bids = await market.loadBids(this.connection);
      const lastBidIterator = bids.items(true).next();
      const lastBidOrder = lastBidIterator.value as Order;
      return new Big(lastBidOrder.price);
    } catch (error) {
      throw new Error(
        `failed to retrieve bids for serum market ${market.publicKey}, ${error}`
      );
    }
  }

  private async getLastAsk(market: Market): Promise<Big> {
    try {
      const asks = await market.loadAsks(this.connection);
      const lastAskIterator = asks.items(false).next();
      const lastAskOrder = lastAskIterator.value as Order;
      return new Big(lastAskOrder.price);
    } catch (error) {
      throw new Error(
        `failed to retrieve bids for serum market, ${market.publicKey}, ${error}`
      );
    }
  }

  private async getLastFill(market: Market): Promise<Big | undefined> {
    const fills = await market.loadFills(this.connection, 100);
    if (fills.length === 0) {
      console.log(
        `failed to retrieve fills for serum market ${market.publicKey}`
      );
      return undefined;
    }

    return new Big(fills[0].price);
  }
}
