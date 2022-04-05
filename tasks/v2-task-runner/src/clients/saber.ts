/* eslint-disable unicorn/no-await-expression-member */
import {
  calculateSwapPrice,
  calculateVirtualPrice,
  IExchangeInfo,
  loadExchangeInfo,
  makeExchange,
  StableSwap,
} from "@saberhq/stableswap-sdk";
import type { Token } from "@saberhq/token-utils";
import { Connection, PublicKey } from "@solana/web3.js";
import type Big from "big.js";
import fetch, { Response } from "node-fetch";
import { default as localSaberPoolList } from "../data/saber.pools-info.mainnet.json";
import { default as localSaberTokenList } from "../data/saber.token-list.mainnet.json";
import * as BigUtil from "../utils/big";

export class SaberSwap {
  public saberPoolMap: Promise<Map<string, any>>;

  public saberTokenMap: Promise<Map<string, Token>>;

  public connection: Connection;

  private poolLastUpdated: number | undefined = undefined;

  private tokenLastUpdated: number | undefined = undefined;

  constructor(mainnetConnection: Connection) {
    this.saberPoolMap = this.getSaberPools();
    this.saberTokenMap = this.getSaberTokenMap();
    this.connection = mainnetConnection;
  }

  /** Load a map from sabers github repo that maps a pools PublicKey to its metadata
   * When successfully updated from a remote source, update the last updated timestamp
   * 1st Pri - githubusercontent
   * 2nd Pri - cdn
   * 3rd Pri - local json file
   */
  async getSaberPools(): Promise<Map<string, any>> {
    let response: Response;
    let saberPoolList: any;
    try {
      const saberPoolListUrl =
        "https://raw.githubusercontent.com/saber-hq/saber-registry-dist/master/data/pools-info.mainnet.json";
      response = await fetch(saberPoolListUrl);
      if (!response.ok) {
        throw new Error("failed to load saber pools from githubusercontent");
      }
    } catch {
      try {
        const saberPoolListUrl =
          "https://cdn.jsdelivr.net/gh/saber-hq/saber-registry-dist@master/data/pools-info.mainnet.json";
        response = await fetch(saberPoolListUrl);
        if (!response.ok) {
          throw new Error("failed to load saber pools from cdn");
        }
      } catch {
        console.log(
          "failed to load saber pools from external host, parsing json file"
        );
      }
    } finally {
      // load poolMap from a local JSON file as a last resort
      if (response.ok) {
        saberPoolList = await response.json();
        this.poolLastUpdated = Date.now();
      } else {
        console.log(`using local saber pools`);
        saberPoolList = localSaberPoolList;
      }
    }

    const saberPools = saberPoolList.pools;
    const saberPoolMap = new Map();
    for (const pool of saberPools) {
      saberPoolMap.set(pool.swap.config.swapAccount, pool);
    }

    return saberPoolMap;
  }

  /** Load a map from sabers github repo that maps a tokens PublicKey to its Token struct
   * When successfully updated from a remote source, update the last updated timestamp
   * 1st Pri - githubusercontent
   * 2nd Pri - cdn
   * 3rd Pri - local json file
   */
  async getSaberTokenMap(): Promise<Map<string, Token>> {
    let response: Response;
    let saberTokenList: any;
    try {
      const saberPoolListUrl =
        "https://raw.githubusercontent.com/saber-hq/saber-registry-dist/master/data/token-list.mainnet.json";
      response = await fetch(saberPoolListUrl);
      if (!response.ok) {
        throw new Error("failed to load saber tokens from githubusercontent");
      }
    } catch {
      try {
        const saberPoolListUrl =
          "https://cdn.jsdelivr.net/gh/saber-hq/saber-registry-dist@master/data/token-list.mainnet.json";
        response = await fetch(saberPoolListUrl);
        if (!response.ok) {
          throw new Error("failed to load saber tokens from cdn");
        }
      } catch {
        console.log(
          "failed to load saber tokens from external host, parsing json file"
        );
      }
    } finally {
      // load tokenMap from a local JSON file as a last resort
      if (response.ok) {
        saberTokenList = await response.json();
        this.tokenLastUpdated = Date.now();
      } else {
        saberTokenList = localSaberTokenList;
      }
    }

    const saberTokenMap = new Map<string, Token>();
    for (const token of saberTokenList.tokens) {
      saberTokenMap.set(token.address, token);
    }

    return saberTokenMap;
  }

  /** Search in the poolMap for a given pool address
   * If an address is not found in the cache and the cache is
   * more than 12hours old, attempt to refresh the cache and find the address
   */
  private async findPool(poolAddress: string): Promise<any | undefined> {
    const poolMap = await this.saberPoolMap;
    const lpPool = poolMap.get(poolAddress);
    if (lpPool) {
      return lpPool;
    }

    // If pool is not in cache but cache was refreshed less than 12 hours ago, return undefined
    if (
      this.poolLastUpdated &&
      Date.now() - this.poolLastUpdated < 12 * 60 * 60 * 1000
    ) {
      return undefined;
    }

    try {
      const newPoolMap = this.getSaberPools();
      if ((await newPoolMap).has(poolAddress)) {
        this.saberPoolMap = newPoolMap;
        return (await newPoolMap).get(poolAddress);
      }
    } catch {
      return undefined;
    }

    return undefined;
  }

  /** Search in the tokenMap for a given token address
   * If an address is not found in the cache and the cache is
   * more than 12hours old, attempt to refresh the cache and find the address
   */
  private async findToken(tokenAddress: string): Promise<Token | undefined> {
    const tokenMap = await this.saberTokenMap;
    const token = tokenMap.get(tokenAddress);
    if (token) {
      return token;
    }

    // If token is not in cache but cache was refreshed less than 12 hours ago, return undefined
    if (
      this.tokenLastUpdated &&
      Date.now() - this.tokenLastUpdated < 12 * 60 * 60 * 1000
    ) {
      return undefined;
    }

    try {
      const newTokenMap = this.getSaberTokenMap();
      if ((await newTokenMap).has(tokenAddress)) {
        this.saberTokenMap = newTokenMap;
        return (await newTokenMap).get(tokenAddress);
      }
    } catch {
      return undefined;
    }

    return undefined;
  }

  /** Load the exchange info for a given LP pool */
  private async loadSaberExchangeInfo(
    poolAddress: string
  ): Promise<IExchangeInfo> {
    const lpPool = await this.findPool(poolAddress);
    if (!lpPool) throw new Error("UnknownSaberPool");

    const programID = new PublicKey(lpPool.swap.config.swapProgramID);
    const lpToken = new PublicKey(lpPool.lpToken.address);
    const swapAccount = new PublicKey(lpPool.swap.config.swapAccount);
    const swap = await StableSwap.load(this.connection, swapAccount, programID);

    const tokenAddressA = lpPool.swap.state.tokenA.mint;
    const tokenA = await this.findToken(tokenAddressA);
    if (!tokenA) throw new Error("UnknownSaberToken");

    const tokenAddressB = lpPool.swap.state.tokenB.mint;
    const tokenB = await this.findToken(tokenAddressB);
    if (!tokenB) throw new Error("UnknownSaberToken");

    const exchange = makeExchange({ swapAccount, lpToken, tokenA, tokenB });
    if (!exchange) throw new Error("FailedToFetchSaberExchange");
    const exchangeInfo = await loadExchangeInfo(
      this.connection,
      exchange,
      swap
    );

    return exchangeInfo;
  }

  /** Calculate the LP token's price for a given LP pool */
  public async calculateFairLpTokenPrice(
    poolAddress: PublicKey,
    feedPrices: Promise<Big[]>
  ): Promise<Big> {
    const exchangeInfo = await this.loadSaberExchangeInfo(
      poolAddress.toBase58()
    );
    const price = calculateVirtualPrice(exchangeInfo);
    if (!price) throw new Error("FailedToCalculateSaberLpPrice");
    const vPrice = BigUtil.fromPrice(price);

    const prices = await feedPrices;
    if (prices.length !== exchangeInfo.reserves.length) {
      throw new Error(
        `Incorrect number of prices. Expected ${exchangeInfo.reserves.length}, Received ${prices.length}`
      );
    }

    const minPrice = prices.sort((a, b) => a.cmp(b)).shift();
    const result = minPrice.mul(vPrice);

    return result;
  }

  /** Calculate the LP token's price for a given LP pool */
  public async calculateLpTokenPrice(poolAddress: string): Promise<Big> {
    const exchangeInfo = await this.loadSaberExchangeInfo(poolAddress);

    const price = calculateVirtualPrice(exchangeInfo);
    if (!price) throw new Error("FailedToCalculateSaberLpPrice");
    return BigUtil.fromPrice(price);
  }

  /** Calculate the price to swap between two members of an LP pool */
  public async calculateSwapPrice(poolAddress: string): Promise<Big> {
    const exchangeInfo = await this.loadSaberExchangeInfo(poolAddress);

    const swapPrice = calculateSwapPrice(exchangeInfo);
    if (!swapPrice) throw new Error("FailedToCalculateSaberSwapPrice");
    return BigUtil.fromPrice(swapPrice);
  }
}
