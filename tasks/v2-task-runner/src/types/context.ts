import type * as anchor from "@project-serum/anchor";
import type { Connection, PublicKey } from "@solana/web3.js";
import { RateObserver } from "@switchboard-xyz/defi-yield-ts";
import type Websocket from "ws-reconnect";
import type { OracleJob } from "@switchboard-xyz/v2-task-library";
import {
  ChainlinkClient,
  DriftClient,
  JupiterSwap,
  MangoPerps,
  MercurialSwap,
  OrcaExchange,
  PythClient,
  RaydiumExchange,
  SaberSwap,
  SerumSwap,
} from "../clients";

export interface CacheStrategy {
  // stores the websocket
  hasSocket(wsTask: OracleJob.IWebsocketTask): boolean;
  getSocket(wsTask: OracleJob.IWebsocketTask): Websocket | undefined;
  setSocket(
    wsTask: OracleJob.IWebsocketTask,
    ws: Websocket,
    maxAge?: number
  ): void;
  delSocket(wsTask: OracleJob.IWebsocketTask): void;

  // stores the websocket responses
  hasSocketResponse(wsTask: OracleJob.IWebsocketTask): boolean;
  getSocketResponse(wsTask: OracleJob.IWebsocketTask): string | undefined;
  setSocketResponse(
    wsTask: OracleJob.IWebsocketTask,
    value: string,
    maxAge?: number
  ): void;
  delSocketResponse(wsTask: OracleJob.IWebsocketTask): void;

  // stores a set of task for a given url for when a socket reconnects
  hasSocketTasks(wsTask: OracleJob.IWebsocketTask): boolean;
  getSocketTasks(wsTask: OracleJob.IWebsocketTask): Set<string> | undefined;
  setSocketTasks(wsTask: OracleJob.IWebsocketTask, value: Set<string>): void;
  delSocketTasks(wsTask: OracleJob.IWebsocketTask): void;

  // stores the aggregators loadData promise
  hasAggregatorPromise(aggregatorKey: PublicKey): boolean;
  getAggregatorPromise(aggregatorKey: PublicKey): Promise<any> | undefined;
  setAggregatorPromise(
    aggregatorKey: PublicKey,
    promise: Promise<any>,
    maxAge?: number
  ): void;
  delAggregatorPromise(aggregatorKey: PublicKey): void;

  // anchor IDLs
  hasIdl(programId: PublicKey): boolean;
  getIdl(programId: PublicKey): anchor.Idl;
  setIdl(programId: PublicKey, idl: anchor.Idl, maxAge?: number): void;
  delIdl(programId: PublicKey): void;
}

export interface LoggerStrategy {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}
export interface OracleContext {
  cache?: CacheStrategy;
  mainnetConnection: Connection;
  logger: LoggerStrategy;
  saber?: SaberSwap;
  orca?: OrcaExchange;
  serum?: SerumSwap;
  raydium?: RaydiumExchange;
  mercurial?: MercurialSwap;
  lendingRateObserver?: RateObserver;
  mango?: MangoPerps;
  jupiter?: JupiterSwap;
  pyth?: PythClient;
  chainlink?: ChainlinkClient;
  drift?: DriftClient;
}

export const buildContext = (
  mainnetConnection: Connection,
  logger?: LoggerStrategy,
  cache?: CacheStrategy
): OracleContext => {
  return {
    mainnetConnection,
    logger: logger,
    cache: cache,
    saber: new SaberSwap(mainnetConnection),
    orca: new OrcaExchange(mainnetConnection),
    serum: new SerumSwap(mainnetConnection),
    raydium: new RaydiumExchange(mainnetConnection),
    mercurial: new MercurialSwap(mainnetConnection),
    lendingRateObserver: new RateObserver(),
    mango: new MangoPerps(mainnetConnection),
    jupiter: new JupiterSwap(mainnetConnection),
    pyth: new PythClient(mainnetConnection),
    chainlink: new ChainlinkClient(),
    drift: new DriftClient(mainnetConnection),
  };
};
