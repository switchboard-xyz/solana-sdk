import type { AggregatorAccount, OracleAccount } from "./accounts/index.js";
import type {
  CreateQueueFeedParams,
  CreateQueueOracleParams,
} from "./accounts/index.js";
import { QueueAccount } from "./accounts/index.js";
import type { AggregatorAccountData } from "./generated/index.js";
import type {
  LoadedSwitchboardNetwork,
  NetworkInitParams,
} from "./SwitchboardNetwork.js";
import { SwitchboardNetwork } from "./SwitchboardNetwork.js";
import { SwitchboardProgram } from "./SwitchboardProgram.js";
import { createStaticFeed, loadKeypair, updateStaticFeed } from "./utils.js";

import type { AnchorProvider } from "@coral-xyz/anchor";
import type { Connection, PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import _ from "lodash";
import os from "os";
import path from "path";

// export type NodeConfig = IOracleConfig & Partial<ReleaseChannelVersion>;

export function findAnchorTomlWallet(workingDir = process.cwd()): string {
  let numDirs = 3;
  while (numDirs) {
    const filePath = path.join(workingDir, "Anchor.toml");
    if (fs.existsSync(filePath)) {
      const fileString = fs.readFileSync(filePath, "utf-8");
      const matches = Array.from(
        fileString.matchAll(new RegExp(/wallet\s?=\s?"(?<wallet_path>.*)"/g))
      );
      if (
        matches &&
        matches.length > 0 &&
        "groups" in matches[0] &&
        "wallet_path" in matches[0].groups! &&
        matches[0].groups["wallet_path"]
      ) {
        const walletPath = matches[0].groups["wallet_path"];
        return walletPath.startsWith("/") ||
          walletPath.startsWith("C:") ||
          walletPath.startsWith("D:")
          ? walletPath
          : walletPath.startsWith("~")
          ? path.join(os.homedir(), walletPath.slice(1))
          : path.join(process.cwd(), walletPath);
      }
    }

    workingDir = path.dirname(workingDir);
    --numDirs;
  }

  throw new Error(`Failed to find wallet path in Anchor.toml`);
}

export type SwitchboardTestContextInit = Omit<
  Omit<NetworkInitParams, "authority">,
  "oracles"
> & {
  oracle: Omit<CreateQueueOracleParams, "authority">;
};

// queuePubkey: ACzh7Ra83zyjyBn1yv4JLZ1jC41kxTcMyuoFN8z1BTPX
// oraclePubkey: Ei4HcqRQtf6TfwbuRXKRwCtt8PDXhmq9NhYLWpoh23xp

// TIP: Do NOT define an authority and defaul to Anchor.toml wallet
export const DEFAULT_LOCALNET_NETWORK: SwitchboardTestContextInit = {
  name: "Localnet Queue",
  metadata: "Localnet Metadata",
  keypair: Keypair.fromSecretKey(
    new Uint8Array([
      64, 119, 125, 66, 195, 41, 127, 56, 113, 141, 220, 226, 61, 141, 93, 213,
      149, 12, 201, 99, 225, 48, 92, 168, 203, 19, 197, 43, 186, 24, 189, 98,
      136, 203, 205, 164, 226, 1, 86, 171, 199, 229, 92, 106, 212, 230, 63, 3,
      160, 16, 181, 133, 19, 59, 42, 249, 213, 155, 187, 32, 198, 125, 3, 50,
    ])
  ),
  dataBufferKeypair: Keypair.fromSecretKey(
    new Uint8Array([
      28, 229, 235, 252, 212, 152, 240, 151, 230, 84, 57, 182, 211, 58, 109,
      232, 52, 111, 127, 47, 165, 186, 139, 73, 33, 156, 253, 250, 172, 188,
      119, 182, 87, 178, 229, 228, 101, 161, 161, 42, 44, 249, 82, 32, 94, 94,
      198, 20, 234, 19, 202, 242, 165, 35, 2, 231, 160, 10, 221, 45, 63, 3, 250,
      119,
    ])
  ),
  queueSize: 10,
  reward: 0,
  minStake: 0,
  oracleTimeout: 900,
  unpermissionedFeeds: true,
  unpermissionedVrf: true,
  enableBufferRelayers: true,
  oracle: {
    name: "Localnet Oracle",
    stakeAmount: 0,
    enable: true,
    stakingWalletKeypair: Keypair.fromSecretKey(
      new Uint8Array([
        67, 131, 239, 47, 118, 122, 163, 132, 42, 122, 203, 119, 213, 213, 100,
        75, 231, 52, 223, 48, 24, 210, 237, 170, 53, 148, 5, 156, 177, 174, 55,
        104, 150, 48, 4, 175, 217, 217, 90, 71, 189, 153, 51, 139, 210, 112,
        138, 167, 3, 190, 119, 20, 1, 68, 148, 4, 186, 96, 127, 24, 38, 128,
        189, 75,
      ])
    ),
  },
};

export class SwitchboardTestContext {
  // _oracle?: NodeOracle;

  constructor(
    readonly network: LoadedSwitchboardNetwork,
    readonly walletPath: string
  ) {}

  get queue(): QueueAccount {
    return this.network.queue.account;
  }

  get program(): SwitchboardProgram {
    return this.queue.program;
  }

  get oracle(): OracleAccount {
    return this.network.oracles[0].account;
  }

  static async load(
    connection: Connection,
    networkInitParams?: Partial<SwitchboardTestContextInit>,
    walletPath?: string,
    programId?: PublicKey
  ): Promise<SwitchboardTestContext> {
    const walletFsPath = walletPath ?? findAnchorTomlWallet();
    const wallet = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(walletFsPath, "utf-8")))
    );
    const walletBalance = await connection.getBalance(wallet.publicKey);
    if (walletBalance === 0) {
      throw new Error(
        `Wallet is empty, balance: ${walletBalance}, wallet: ${wallet.publicKey.toBase58()}`
      );
    }

    const program = await SwitchboardProgram.fromConnection(
      connection,
      wallet,
      programId
    );

    const networkInit = networkInitParams ?? DEFAULT_LOCALNET_NETWORK;
    // only allow creating a single oracle
    // ensure authority matches Anchor.toml wallet so we dont need to worry about transferring oracle funds
    const networkParams: NetworkInitParams = _.merge(
      { reward: 0, minStake: 0, size: 10 },
      networkInit,
      {
        authority: undefined,
        oracles: [
          networkInit.oracle
            ? _.merge(networkInit.oracle, {
                authority: undefined,
                enable: true,
              })
            : { authority: undefined, enable: true },
        ],
      }
    );

    // try to load existing network
    try {
      if ("keypair" in networkParams) {
        const queuePubkey = networkParams.keypair!.publicKey;
        const [queueAccount, queue] = await QueueAccount.load(
          program,
          queuePubkey
        );
        if (!queue.authority.equals(wallet.publicKey)) {
          throw new Error(`Anchor wallet pubkey mismatch`);
        }

        const network = await SwitchboardNetwork.fromQueue(queueAccount);
        return new SwitchboardTestContext(network, walletFsPath);
      }
      // eslint-disable-next-line no-empty
    } catch {}

    const [network] = await SwitchboardNetwork.create(program, networkParams);
    const loadedNetwork = await network.load();

    if (loadedNetwork.oracles.length !== 1) {
      throw new Error(`Failed to get oracle`);
    }

    for (const oracle of loadedNetwork.oracles) {
      if (!oracle.state.oracleAuthority.equals(wallet.publicKey)) {
        throw new Error(`Anchor wallet pubkey mismatch`);
      }
    }
    return new SwitchboardTestContext(loadedNetwork, walletFsPath);
  }

  static async loadFromProvider(
    provider: AnchorProvider,
    networkInitParams?: Partial<SwitchboardTestContextInit>,
    programId?: PublicKey
  ): Promise<SwitchboardTestContext> {
    const switchboard = await SwitchboardTestContext.load(
      provider.connection,
      networkInitParams,
      undefined,
      programId
    );
    return switchboard;
  }

  static async initFromProvider(
    provider: AnchorProvider,
    networkInitParams?: Partial<SwitchboardTestContextInit>,
    // oracleParams?: Partial<IOracleConfig>,
    programId?: PublicKey
  ): Promise<SwitchboardTestContext> {
    const switchboard = await SwitchboardTestContext.loadFromProvider(
      provider,
      networkInitParams,
      programId
    );
    // await switchboard.start(oracleParams);
    return switchboard;
  }

  static async init(
    connection: Connection,
    networkInitParams?: Partial<SwitchboardTestContextInit>,
    // oracleParams?: Partial<IOracleConfig>,
    walletPath?: string,
    programId?: PublicKey
  ): Promise<SwitchboardTestContext> {
    const switchboard = await SwitchboardTestContext.load(
      connection,
      networkInitParams,
      walletPath,
      programId
    );
    // await switchboard.start(oracleParams);
    return switchboard;
  }

  // async start(
  //   oracleParams?: Partial<NodeConfig> | ReleaseChannel,
  //   timeout = 60
  // ) {
  //   const releaseChannel: ReleaseChannel =
  //     typeof oracleParams === 'string' &&
  //     (oracleParams === 'testnet' ||
  //       oracleParams === 'mainnet' ||
  //       oracleParams === 'latest')
  //       ? oracleParams
  //       : 'testnet';

  //   const baseConfig: NodeConfig = {
  //     chain: 'solana',
  //     releaseChannel: releaseChannel,
  //     network:
  //       this.program.cluster === 'mainnet-beta'
  //         ? 'mainnet'
  //         : this.program.cluster,
  //     rpcUrl: this.program.connection.rpcEndpoint,
  //     oracleKey: this.oracle.publicKey.toBase58(),
  //     secretPath: this.walletPath,
  //     envVariables: {
  //       VERBOSE: '1',
  //       DEBUG: '1',
  //       DISABLE_NONE_QUEUE: '1',
  //       DISABLE_METRICS: '1',
  //     },
  //   };

  //   const config: NodeConfig =
  //     typeof oracleParams === 'string'
  //       ? baseConfig
  //       : _.merge(baseConfig, oracleParams);

  //   this._oracle = await NodeOracle.fromReleaseChannel({
  //     ...config,
  //     releaseChannel: releaseChannel,
  //     chain: 'solana',
  //   });

  //   console.log(`Starting Switchboard oracle ...`);

  //   await this._oracle.startAndAwait(timeout);
  // }

  // stop() {
  //   if (this._oracle) {
  //     const stopped = this._oracle.stop();
  //     if (!stopped) {
  //       console.error(`Failed to stop docker oracle`);

  //       this._oracle.kill();
  //     }
  //   }
  // }

  public static findAnchorTomlWallet(workingDir = process.cwd()): string {
    try {
      const walletPath = findAnchorTomlWallet(workingDir);
      return walletPath;
    } catch (error) {
      console.error(error);
    }

    throw new Error(`Failed to find wallet path in Anchor.toml`);
  }

  /** Load a keypair from a file path. If one doesn't exist, it will be created */
  public static loadKeypair(keypairPath: string): Keypair {
    return loadKeypair(keypairPath);
  }

  /**
   * Create a feed and wait for it to resolve to a static value
   * @param params - the aggregator init params and the static value to resolve the feed to
   * @param timeout - the number of milliseconds to wait before timing out
   *
   * Basic usage example:
   *
   * ```ts
   * let switchboard: SwitchboardTestContext;
   *
   * const [staticFeedAccount] = await switchboard.createStaticFeed({
   *    value: 10,
   * })
   * const staticFeedValue: Big = await staticFeedAccount.fetchLatestValue();
   * assert(staticFeedValue.toNumber() === 10, "StaticFeedValueMismatch");
   * ```
   */
  public async createStaticFeed(
    params: Partial<CreateQueueFeedParams> & { value: number },
    timeout = 30000
  ): Promise<[AggregatorAccount, AggregatorAccountData]> {
    const [aggregatorAccount, aggregatorState] = await createStaticFeed(
      this.network.queue.account,
      params,
      timeout
    );
    return [aggregatorAccount, aggregatorState];
  }

  /**
   * Update an existing aggregator that resolves to a new static value, then await the new result
   * @param aggregatorAccount - the aggregator account to modify
   * @param value - the static value the feed will resolve to
   * @param timeout - the number of milliseconds to wait before timing out
   *
   * Basic usage example:
   *
   * ```ts
   * let switchboard: SwitchboardTestContext;
   * let staticFeedAccount: AggregatorAccount;
   *
   * [staticFeedAccount] = await switchboard.createStaticFeed({
   *    value: 10,
   * });
   * const staticFeedValue: Big = await staticFeedAccount.fetchLatestValue();
   * assert(staticFeedValue.toNumber() === 10, "StaticFeedValueMismatch");
   *
   * await switchboard.updateStaticFeed(
   *    staticFeedAccount,
   *    25
   * );
   * staticFeedValue = await staticFeedAccount.fetchLatestValue();
   * assert(staticFeedValue.toNumber() === 25, "StaticFeedValueMismatch");
   * ```
   */
  public async updateStaticFeed(
    aggregatorAccount: AggregatorAccount,
    value: number,
    timeout = 30000
  ): Promise<AggregatorAccountData> {
    const state = await updateStaticFeed(aggregatorAccount, value, timeout);
    return state;
  }
}

export { SwitchboardTestContext as SwitchboardTestContextV2 };
