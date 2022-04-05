import * as anchor from "@project-serum/anchor";
import * as raydium from "@raydium-io/raydium-sdk";
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import Big from "big.js";
import { calcFairLpPrice } from "../utils";
import * as BigUtil from "../utils/big";

export class RaydiumExchange {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async calculateSwapPrice(poolAddress: string): Promise<Big> {
    const poolInfoPromise = raydium.Liquidity.getMultipleInfo({
      connection: this.connection,
      pools: [await this.getPool(new PublicKey(poolAddress))],
      config: {},
    });

    const [poolInfo] = await poolInfoPromise;
    const { baseReserve, quoteReserve, baseDecimals, quoteDecimals } = poolInfo;

    // 1 Token
    const baseAmount = new anchor.BN(10).pow(new anchor.BN(baseDecimals));

    const quoteAmount = raydium.Liquidity.getQuote({
      amount: baseAmount,
      fixedSide: "base",
      baseReserve,
      quoteReserve,
    });

    const quote = BigUtil.safeDiv(
      BigUtil.fromBN(quoteAmount),
      BigUtil.safePow(new Big(10), quoteDecimals)
    );

    return quote;
  }

  public async calculateFairLpTokenPrice(
    poolKey: PublicKey,
    feedPrices: Promise<Big[]>
  ): Promise<Big> {
    const poolInfoPromise = raydium.Liquidity.getMultipleInfo({
      connection: this.connection,
      pools: [await this.getPool(poolKey)],
      config: {},
    });

    const [poolInfo] = await poolInfoPromise;
    const {
      baseReserve,
      quoteReserve,
      baseDecimals,
      quoteDecimals,
      lpSupply,
      lpDecimals,
    } = poolInfo;

    const r0 = BigUtil.fromBN(baseReserve, baseDecimals);
    const r1 = BigUtil.fromBN(quoteReserve, quoteDecimals);
    const tokenSupply = BigUtil.fromBN(lpSupply, lpDecimals);

    const result = calcFairLpPrice(tokenSupply, [r0, r1], await feedPrices);
    return result;
  }

  private async getPool(
    poolKey: PublicKey
  ): Promise<raydium.LiquidityPoolKeys> {
    const DEFAULT_ACCOUNT_INFO = {
      data: Buffer.from(""),
      executable: false,
      lamports: 0,
      owner: PublicKey.default,
    };
    const poolAccountInfo = [
      {
        account:
          (await this.connection.getAccountInfo(poolKey)) ??
          DEFAULT_ACCOUNT_INFO,
        pubkey: poolKey,
      },
    ];
    const batchRequest = undefined;
    const commitment = undefined;

    // supported versions
    const supported = Object.keys(
      raydium.LIQUIDITY_VERSION_TO_STATE_LAYOUT
    ).map((v) => {
      const version = Number(v);
      const serumVersion = raydium.Liquidity.getSerumVersion(version);
      const serumProgramId = raydium.Market.getProgramId(serumVersion);
      return {
        version,
        programId: raydium.Liquidity.getProgramId(version),
        serumVersion,
        serumProgramId,
        stateLayout: raydium.Liquidity.getStateLayout(version),
      };
    });

    let poolsAccountInfo: {
      pubkey: PublicKey;
      account: AccountInfo<Buffer>;

      version: number;
      programId: PublicKey;
      serumVersion: number;
      serumProgramId: PublicKey;
      stateLayout: raydium.LiquidityStateLayout;
    }[][] = [];
    poolsAccountInfo = await Promise.all(
      supported.map(
        ({ programId, version, serumVersion, serumProgramId, stateLayout }) => {
          return poolAccountInfo.map((info) => {
            return {
              ...info,
              version,
              programId,
              serumVersion,
              serumProgramId,
              stateLayout,
            };
          });
        }
      )
    );

    const flatPoolsAccountInfo = poolsAccountInfo.flat();
    // temp pool keys without market keys
    const temporaryPoolsKeys: Omit<
      raydium.LiquidityPoolKeys,
      | "marketBaseVault"
      | "marketQuoteVault"
      | "marketBids"
      | "marketAsks"
      | "marketEventQueue"
    >[] = [];

    for await (const {
      pubkey,
      account: accountInfo,
      version,
      programId,
      serumVersion,
      serumProgramId,
      stateLayout: LIQUIDITY_STATE_LAYOUT,
    } of flatPoolsAccountInfo) {
      if (!accountInfo) {
        throw new Error(
          `empty state account info pool.id ${pubkey.toBase58()}`
        );
      }

      const { data } = accountInfo;
      if (data.length !== LIQUIDITY_STATE_LAYOUT.span) {
        throw new Error(
          `invalid state data length pool.id ${pubkey.toBase58()}`
        );
      }

      const {
        status,
        baseMint,
        quoteMint,
        lpMint,
        openOrders,
        targetOrders,
        baseVault,
        quoteVault,
        withdrawQueue,
        lpVault,
        marketId,
      } = LIQUIDITY_STATE_LAYOUT.decode(data);

      // uninitialized
      if (status.isZero()) {
        continue;
      }

      const { publicKey: authority } =
        await raydium.Liquidity.getAssociatedAuthority({
          programId,
        });
      const { publicKey: marketAuthority } =
        await raydium.Market.getAssociatedAuthority({
          programId: serumProgramId,
          marketId,
        });

      temporaryPoolsKeys.push({
        id: pubkey,
        baseMint,
        quoteMint,
        lpMint,
        version,
        programId,

        authority,
        openOrders,
        targetOrders,
        baseVault,
        quoteVault,
        withdrawQueue,
        lpVault,
        marketVersion: serumVersion,
        marketProgramId: serumProgramId,
        marketId,
        marketAuthority,
      });
    }

    // fetch market keys
    let marketsInfo: (AccountInfo<Buffer> | null)[] = [];
    try {
      marketsInfo = await raydium.getMultipleAccountsInfo(
        this.connection,
        temporaryPoolsKeys.map(({ marketId }) => marketId),
        { batchRequest, commitment }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new TypeError(`failed to get markets ${error.message}`);
      }
    }

    if (marketsInfo.length !== temporaryPoolsKeys.length) {
      throw new Error(
        `markets count not equal to pools\n` +
          `markets.length: ${marketsInfo.length}`
      );
    }

    const poolsKeys: raydium.LiquidityPoolKeys[] = [];

    for await (const { index, value } of marketsInfo.map((v, i) => ({
      index: i,
      value: v,
    }))) {
      const poolKeys = temporaryPoolsKeys[index];
      const marketInfo = value;

      const { id, marketVersion } = poolKeys;

      if (!marketInfo) {
        throw new Error(`empty market account info pool.id  ${id.toBase58()}`);
      }

      const { data } = marketInfo;
      if (data.length !== raydium.MARKET_STATE_LAYOUT_V3.span) {
        throw new Error(`invalid market data length pool.id ${id.toBase58()}`);
      }

      const {
        baseVault: marketBaseVault,
        quoteVault: marketQuoteVault,
        bids: marketBids,
        asks: marketAsks,
        eventQueue: marketEventQueue,
      } = raydium.MARKET_STATE_LAYOUT_V3.decode(data);

      poolsKeys.push({
        ...poolKeys,

        marketBaseVault,
        marketQuoteVault,
        marketBids,
        marketAsks,
        marketEventQueue,
      });
    }

    return poolsKeys[0];
  }
}
