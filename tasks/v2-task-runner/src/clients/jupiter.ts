/* eslint-disable unicorn/no-await-expression-member */
import { Jupiter, TOKEN_LIST_URL } from "@jup-ag/core";
import type { Token } from "@saberhq/token-utils";
import { Connection, PublicKey } from "@solana/web3.js";
import Big from "big.js";
import fetch from "node-fetch";
import * as BigUtil from "../utils/big";

export class JupiterSwap {
  // Used by mercurial when simulating a txn to calc if any new token accounts are needed
  static simulatedUser = new PublicKey(
    "D8d7xsLgV3sHxXQacA1vQfCharFXQzVmSeyMcHEenP52"
  );

  public connection: Connection;

  public jupiter: Promise<Jupiter>;

  public tokens: Promise<Token[]>;

  static create = async (
    mainnetConnection: Connection
  ): Promise<JupiterSwap> => {
    const jupiterSwap = new JupiterSwap(mainnetConnection);
    await jupiterSwap.loadJupiterTokens();
    return jupiterSwap;
  };

  private constructor(mainnetConnection: Connection) {
    this.connection = mainnetConnection;
    this.jupiter = Jupiter.load({
      connection: mainnetConnection,
      cluster: "mainnet-beta",
      user: JupiterSwap.simulatedUser,
    });
    this.loadJupiterTokens();
  }

  async loadJupiterTokens() {
    this.tokens = <Promise<Token[]>>(
      (await fetch(TOKEN_LIST_URL["mainnet-beta"])).json()
    );
  }

  /** Calculate the jupiter swap price for a given input and output token */
  public async calculateSwapPrice(
    inTokenAddress: string,
    outTokenAddress: string
  ): Promise<Big> {
    const tokens = await this.tokens;

    const inputToken = tokens.find((t) => t.address === inTokenAddress);
    if (!inputToken) {
      throw new Error(`failed to find jupiter input token ${inTokenAddress}`);
    }

    const outputToken = tokens.find((t) => t.address === outTokenAddress);
    if (!outputToken) {
      throw new Error(`failed to find jupiter output token ${outTokenAddress}`);
    }

    const inputUiAmount = new Big(1);
    const inputAmount = BigUtil.safeMul(
      inputUiAmount,
      BigUtil.safePow(new Big(10), inputToken.decimals)
    );

    // all of the routes to swap token A for token B
    const routes = await (
      await this.jupiter
    ).computeRoutes({
      inputMint: new PublicKey(inputToken.address),
      outputMint: new PublicKey(outputToken.address),
      inputAmount: inputAmount.toNumber(),
      slippage: 1,
      forceFetch: true, // TODO: Cache routes, maybe too big to store?
    });

    const bestRouteOutputAmount = Math.max(
      ...routes.routesInfos.map((item) => item.outAmountWithSlippage)
    );

    const outputUiAmount = BigUtil.safeDiv(
      new Big(bestRouteOutputAmount),
      BigUtil.safePow(new Big(10), outputToken.decimals)
    );
    return outputUiAmount;
  }
}
