/* eslint-disable unicorn/no-await-expression-member */
import * as mercurial from "@mercurial-finance/stable-swap-n-pool";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import Big from "big.js";
import * as BigUtil from "../utils/big";

export class MercurialSwap {
  // Used by mercurial when simulating a txn to calc if any new token accounts are needed
  static simulatedUser = new PublicKey(
    "D8d7xsLgV3sHxXQacA1vQfCharFXQzVmSeyMcHEenP52"
  );

  public connection: Connection;

  constructor(mainnetConnection: Connection) {
    this.connection = mainnetConnection;
  }

  /** Calculate the lp token price for a given mercurial pool */
  public async calculateFairLpTokenPrice(
    poolAddress: string,
    feedPrices: Promise<Big[]>
  ): Promise<Big> {
    const hgPool = await mercurial.StableSwapNPool.load(
      this.connection,
      new PublicKey(poolAddress),
      MercurialSwap.simulatedUser
    );
    const pFactor = 10 ** hgPool.precisionFactor;
    const { virtualPrice } = await hgPool.getVirtualPrice();
    const vPrice = BigUtil.safeDiv(new Big(virtualPrice), new Big(pFactor));

    const prices = await feedPrices;
    if (prices.length !== hgPool.tokenAccounts.length) {
      throw new Error(
        `Incorrect number of prices. Expected ${hgPool.tokenAccounts.length}, Received ${prices.length}`
      );
    }

    const minPrice = prices.sort((a, b) => a.cmp(b)).shift();
    const result = minPrice.mul(vPrice);

    return result;
  }

  /** Calculate the lp token price for a given mercurial pool */
  public async calculateLpTokenPrice(poolAddress: string): Promise<Big> {
    const hgPool = await mercurial.StableSwapNPool.load(
      this.connection,
      new PublicKey(poolAddress),
      MercurialSwap.simulatedUser
    );

    const pFactor = 10 ** hgPool.precisionFactor;
    const { virtualPrice } = await hgPool.getVirtualPrice();

    return BigUtil.safeDiv(new Big(virtualPrice), new Big(pFactor));
  }

  /** Calculate the lp token price for a given mercurial pool */
  public async calculateSwapPrice(
    poolAddress: string,
    inKey: string,
    outKey: string
  ): Promise<Big> {
    const hgPool = await mercurial.StableSwapNPool.load(
      this.connection,
      new PublicKey(poolAddress),
      MercurialSwap.simulatedUser
    );
    const pFactor = 10 ** hgPool.precisionFactor;
    const value =
      (await hgPool.getOutAmount(
        new PublicKey(inKey),
        new PublicKey(outKey),
        new anchor.BN(pFactor)
      )) / pFactor;
    return new Big(value);
  }
}
