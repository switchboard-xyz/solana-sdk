import {
  getOrca,
  getTokenCount,
  Orca,
  OrcaPool,
  OrcaPoolConfig,
  OrcaPoolToken,
  OrcaToken,
} from "@orca-so/sdk";
import { orcaPoolConfigs } from "@orca-so/sdk/dist/constants/pools";
import { usdcToken } from "@orca-so/sdk/dist/constants/tokens";
import type { OrcaPoolParams } from "@orca-so/sdk/dist/model/orca/pool/pool-types";
import * as anchor from "@project-serum/anchor";
import type { Connection } from "@solana/web3.js";
import Big from "big.js";
import Decimal from "decimal.js";
import { calcFairLpPrice } from "../utils";
import * as BigUtil from "../utils/big";

export class OrcaExchange {
  private connection: Connection;

  private orca: Orca;

  private usdc: OrcaToken = usdcToken;

  constructor(connection: Connection) {
    this.connection = connection;
    this.orca = getOrca(this.connection);
  }

  /** Calculate the lp token price for a given mercurial pool */
  public async calculateFairLpTokenPrice(
    poolAddress: string,
    feedPrices: Promise<Big[]>
  ): Promise<Big> {
    // get public key of pool
    let poolConfig: OrcaPoolConfig;
    let pool: OrcaPool;
    let poolParameters: OrcaPoolParams;
    try {
      poolConfig = poolAddress as OrcaPoolConfig;
      pool = this.orca.getPool(poolConfig);
      poolParameters = orcaPoolConfigs[poolConfig];
    } catch {
      throw new Error(`No matching pool found for ${poolAddress}`);
    }

    const orcaSupply = await pool.getLPSupply();

    const tokenSupply = BigUtil.fromBN(
      new anchor.BN(orcaSupply.value),
      orcaSupply.scale
    );

    // get current amount of each token in the pool
    const tokenA = pool.getTokenA();
    const tokenB = pool.getTokenB();
    const tokenCount = await getTokenCount(
      this.connection,
      poolParameters,
      tokenA,
      tokenB
    );
    const r0 = BigUtil.fromBN(
      new anchor.BN(tokenCount.inputTokenCount),
      tokenA.scale
    );
    const r1 = BigUtil.fromBN(
      new anchor.BN(tokenCount.outputTokenCount),
      tokenB.scale
    );

    console.log(`r0 ${tokenCount.inputTokenCount}, decimals ${tokenA.scale}`);
    console.log(`r1 ${tokenCount.outputTokenCount}, decimals ${tokenB.scale}`);

    const result = calcFairLpPrice(tokenSupply, [r0, r1], await feedPrices);
    return result;
  }

  /** Calculate the lp token price for a given mercurial pool */
  public async calculateLpTokenPrice(poolAddress: string): Promise<Big> {
    // get public key of pool
    let poolConfig: OrcaPoolConfig;
    let pool: OrcaPool;
    let poolParameters: OrcaPoolParams;
    let tokenA: OrcaPoolToken;
    let tokenB: OrcaPoolToken;
    try {
      poolConfig = poolAddress as OrcaPoolConfig;
      pool = this.orca.getPool(poolConfig);
      poolParameters = orcaPoolConfigs[poolConfig];
      tokenA = pool.getTokenA();
      tokenB = pool.getTokenB();
    } catch {
      throw new Error(`No matching pool found for ${poolAddress}`);
    }

    // get current amount of each token in the pool
    const tokenCount = await getTokenCount(
      this.connection,
      poolParameters,
      tokenA,
      tokenB
    );

    const numberTokenA = BigUtil.fromBN(
      new anchor.BN(tokenCount.inputTokenCount),
      tokenA.scale
    );
    const numberTokenB = BigUtil.fromBN(
      new anchor.BN(tokenCount.outputTokenCount),
      tokenB.scale
    );

    // get current quote for each token
    const priceA = this.usdc.mint.equals(tokenA.mint)
      ? new Big(1)
      : await this.getOrcaTokenPrice(tokenA.mint.toString());

    const priceB = this.usdc.mint.equals(tokenB.mint)
      ? new Big(1)
      : await this.getOrcaTokenPrice(tokenB.mint.toString());

    // calculate LP token price
    const poolLiquidity = BigUtil.safeMul(numberTokenA, priceA).add(
      BigUtil.safeMul(numberTokenB, priceB)
    );
    const supply = BigUtil.fromOrcaU64(await pool.getLPSupply());

    return BigUtil.safeDiv(poolLiquidity, supply);
  }

  // Look in Orca configs for a given base and quote mint address
  public async findPool(
    baseMint: string,
    quoteMint: string
  ): Promise<OrcaPoolConfig> {
    for (const k in orcaPoolConfigs) {
      if (
        orcaPoolConfigs[k].tokenIds.length >= 2 &&
        orcaPoolConfigs[k].tokenIds.includes(baseMint) &&
        orcaPoolConfigs[k].tokenIds.includes(quoteMint)
      ) {
        return k as OrcaPoolConfig;
      }
    }

    throw new Error(`couldnt find pool for ${baseMint}/${quoteMint}`);
  }

  // Return the latest quote for a given USDC pool
  public async getOrcaTokenPrice(baseMint: string): Promise<Big> {
    const poolConfig = await this.findPool(baseMint, this.usdc.mint.toString());
    const pool = this.orca.getPool(poolConfig);
    const quote = await pool.getQuote(
      pool.getTokenA(),
      new Decimal(1),
      new Decimal(0.5) // low slippage
    );
    const rate = quote.getRate();
    return BigUtil.fromDecimal(rate);
  }
}
