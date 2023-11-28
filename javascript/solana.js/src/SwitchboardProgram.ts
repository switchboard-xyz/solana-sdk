import type {
  CrankAccount,
  QueueAccount,
  SwitchboardAccountData,
  SwitchboardAccountType,
} from "./accounts/index.js";
import {
  AttestationProgramStateAccount,
  BUFFER_DISCRIMINATOR,
  DISCRIMINATOR_MAP,
  JobAccount,
  ProgramStateAccount,
} from "./accounts/index.js";
import { viewVersion as viewAttestationProgramVersion } from "./generated/attestation-program/instructions/viewVersion.js";
import {
  AggregatorAccountData,
  BufferRelayerAccountData,
  CrankAccountData,
  JobAccountData,
  LeaseAccountData,
  OracleAccountData,
  OracleQueueAccountData,
  PermissionAccountData,
  SbState,
  SlidingResultAccountData,
  VrfAccountData,
} from "./generated/index.js";
import { viewVersion as viewOracleProgramVersion } from "./generated/oracle-program/instructions/viewVersion.js";
import {
  DEVNET_GENESIS_HASH,
  MAINNET_GENESIS_HASH,
  SWITCHBOARD_LABS_DEVNET_PERMISSIONED_CRANK,
  SWITCHBOARD_LABS_DEVNET_PERMISSIONED_QUEUE,
  SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_CRANK,
  SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_QUEUE,
  SWITCHBOARD_LABS_MAINNET_PERMISSIONED_CRANK,
  SWITCHBOARD_LABS_MAINNET_PERMISSIONED_QUEUE,
  SWITCHBOARD_LABS_MAINNET_PERMISSIONLESS_CRANK,
  SWITCHBOARD_LABS_MAINNET_PERMISSIONLESS_QUEUE,
} from "./const.js";
import * as errors from "./errors.js";
import { NativeMint } from "./mint.js";
import type { SwitchboardEvents } from "./SwitchboardEvents.js";
import type { TransactionOptions } from "./TransactionObject.js";
import { TransactionObject } from "./TransactionObject.js";
import type { LoadedJobDefinition } from "./types.js";

import type { AccountNamespace, Idl, Wallet } from "@coral-xyz/anchor";
import {
  ACCOUNT_DISCRIMINATOR_SIZE,
  AnchorError,
  AnchorProvider,
  BorshAccountsCoder,
  Program,
  utils as AnchorUtils,
} from "@coral-xyz/anchor";
import type {
  AccountInfo,
  Cluster,
  ConfirmOptions,
  Connection,
  GetProgramAccountsResponse,
  SendOptions,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { VersionedTransaction } from "@solana/web3.js";
import { Keypair, PublicKey, TransactionMessage } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/common";

export type SendTransactionOptions = (ConfirmOptions | SendOptions) & {
  skipConfrimation?: boolean;
};
export const DEFAULT_SEND_TRANSACTION_OPTIONS: SendTransactionOptions = {
  skipPreflight: false,
  maxRetries: 10,
  skipConfrimation: false,
};

/**
 * Switchboard's V2 Program ID
 */
export const SB_V2_PID = new PublicKey(
  "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f"
);

/**
 * Switchboard's Attestation Program ID
 */
export const SB_ATTESTATION_PID = new PublicKey(
  "sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx"
);

/**
 *  A generated keypair that is assigned as the _payerKeypair_ when in read-only mode.
 */
export const READ_ONLY_KEYPAIR = Keypair.generate();
/**
 * Returns the Switchboard Program ID for the specified Cluster.
 */
export const getSwitchboardProgramId = (
  cluster: Cluster | "localnet"
): PublicKey => {
  switch (cluster) {
    case "localnet":
    case "devnet":
    case "mainnet-beta":
      return SB_V2_PID;
    case "testnet":
    default:
      throw new Error(`Switchboard PID not found for cluster (${cluster})`);
  }
};
/**
 * Returns the Program ID for the Switchboard Attestation Program for the specified Cluster.
 */
export const getSwitchboardAttestationProgramId = (
  cluster: Cluster | "localnet"
): PublicKey => {
  switch (cluster) {
    case "localnet":
    case "devnet":
    case "mainnet-beta":
      return SB_ATTESTATION_PID;
    case "testnet":
    default:
      throw new Error(
        `Switchboard Attestation PID not found for cluster (${cluster})`
      );
  }
};

/**
 * Wrapper class for the Switchboard anchor Program.
 *
 * This class provides an interface to interact with the Switchboard program on the Solana network.
 * It allows you to load the program, create and initialize connection objects, and interact with
 * Switchboard accounts.
 *
 * Basic usage example:
 *
 * ```ts
 * import { Connection } from "@solana/web3.js";
 * import { SwitchboardProgram, TransactionObject } from '@switchboard-xyz/solana.js';
 *
 * const program = await SwitchboardProgram.load(
 *    "mainnet-beta",
 *    new Connection("https://api.mainnet-beta.solana.com"),
 *    payerKeypair
 * );
 *
 * const txn = new TransactionObject(program.walletPubkey, [], []);
 * const txnSignature = await program.signAndSend(txn);
 * ```
 */
export class SwitchboardProgram {
  // The read-only keypair for the Switchboard program.
  private static readonly _readOnlyKeypair = READ_ONLY_KEYPAIR;

  // // The anchor program instance.
  // private readonly _program: Program;

  // // The anchor program instance for Switchboard's attestation program.
  // private readonly _attestationProgram: Program;

  /** Lazy load */
  private _oracleProgram: Promise<Program> | undefined = undefined;

  /** Lazy load */
  private _attestationProgram: Promise<Program> | undefined = undefined;

  /** The Solana cluster to load the Switchboard program for. */
  private _cluster: Promise<Cluster | "localnet"> | undefined = undefined;

  /**
   * The anchor Provider used by this program to connect with the Solana cluster.
   * @return The AnchorProvider instance for the Switchboard Program.
   */
  public readonly provider: AnchorProvider;

  // The pubkey and bump of the Switchboard program state account.
  readonly programState: {
    publicKey: PublicKey;
    bump: number;
  };

  // The pubkey and bump of the Switchboard quote verifier program state account.
  readonly attestationProgramState: {
    publicKey: PublicKey;
    bump: number;
  };

  // The native mint for the Switchboard program.
  readonly mint: NativeMint;

  /**
   * Retrieves the Switchboard V2 Program ID for the currently connected cluster.
   * @return The PublicKey of the Switchboard V2 Program ID.
   */
  public readonly oracleProgramId: PublicKey;

  /**
   * Retrieves the Switchboard Attestation Program ID for the currently connected cluster.
   * @return The PublicKey of the Switchboard Attestation Program ID.
   */
  public readonly attestationProgramId: PublicKey;
  /**
   * Constructor for the SwitchboardProgram class.
   *
   * @param provider - The AnchorProvider containing the RPC and wallet connection.
   * @param mint - The native mint for the Switchboard program.
   * @param oracleProgramId - The Switchboard V2 Oracle Program ID.
   * @param attestationProgramId - The Switchboard Attestation Program ID.
   */
  constructor(
    provider: AnchorProvider,
    mint: NativeMint = new NativeMint(provider),
    oracleProgramId: PublicKey = SB_V2_PID,
    attestationProgramId: PublicKey = SB_ATTESTATION_PID,
    /** Lazy loading parameters to pass-through */
    oracleProgram?: Promise<Program>,
    attestationProgram?: Promise<Program>
  ) {
    this.provider = provider;
    this.mint = mint;
    this.oracleProgramId = oracleProgramId;
    this.attestationProgramId = attestationProgramId;
    if (oracleProgram) {
      this._oracleProgram = oracleProgram;
    }
    if (attestationProgram) {
      this._attestationProgram = attestationProgram;
    }

    // Derive the state account from the seed.
    const [programStatePubkey, programStateBump] =
      PublicKey.findProgramAddressSync([Buffer.from("STATE")], oracleProgramId);
    this.programState = {
      publicKey: programStatePubkey,
      bump: programStateBump,
    };

    const [attestationProgramStatePubkey, attestationProgramStateBump] =
      PublicKey.findProgramAddressSync(
        [Buffer.from("STATE")],
        attestationProgramId
      );
    this.attestationProgramState = {
      publicKey: attestationProgramStatePubkey,
      bump: attestationProgramStateBump,
    };
  }

  /**
   * Create and initialize a {@linkcode SwitchboardProgram} connection object.
   *
   * @dev This method is synchronous but will return a promise for consistency with past be.
   *
   * @param connection - the Solana connection object used to connect to an RPC node.
   *
   * @param payerKeypair - optional, payer keypair used to pay for on-chain transactions.
   *
   * @param oracleProgramId - optional, override the default oracleProgramId.
   *
   * @param attestationProgramId - optional, override the default attestationProgramId.
   *
   * @return the {@linkcode SwitchboardProgram} used to create and interact with Switchboard accounts.
   *
   * Basic usage example:
   *
   * ```ts
   * import { Connection } from "@solana/web3.js";
   * import { SwitchboardProgram, TransactionObject } from '@switchboard-xyz/solana.js';
   *
   * const program = SwitchboardProgram.from(
   *    new Connection("https://api.mainnet-beta.solana.com"),
   *    payerKeypair
   * );
   *
   * const txn = new TransactionObject(program.walletPubkey, [], []);
   * const txnSignature = await program.signAndSend(txn);
   * ```
   */
  public static from(
    connection: Connection,
    payerKeypair = READ_ONLY_KEYPAIR,
    oracleProgramId = SB_V2_PID,
    attestationProgramId = SB_ATTESTATION_PID
  ): SwitchboardProgram {
    const provider = new AnchorProvider(
      connection,
      new AnchorWallet(payerKeypair),
      {}
    );
    const mint = new NativeMint(provider);
    return new SwitchboardProgram(
      provider,
      mint,
      oracleProgramId,
      attestationProgramId
    );
  }

  /**
   * Load the anchor program for the Switchboard.
   *
   * This method fetches the IDL for the Switchboard program, and initializes an anchor program
   * instance using the fetched IDL, provided program ID, and provider.
   *
   * @param connection - The Solana connection object used to connect to an RPC node.
   * @param programId - The programID to load the Anchor program for. The program must have an IDL deployed.
   * @param payerKeypair - Optional payer keypair used to pay for on-chain transactions.
   *
   * @returns The initialized anchor program instance.
   */
  static async loadAnchorProgram(
    connection: Connection,
    programId: PublicKey,
    payerKeypair: Keypair = READ_ONLY_KEYPAIR
  ): Promise<Program> {
    const provider = new AnchorProvider(
      connection,
      // If no keypair is provided, default to dummy keypair
      new AnchorWallet(payerKeypair ?? SwitchboardProgram._readOnlyKeypair),
      { commitment: "confirmed" }
    );
    const anchorIdl = await Program.fetchIdl(programId, provider);
    if (!anchorIdl) {
      throw new Error(`Failed to find IDL for ${programId.toBase58()}`);
    }
    const program = new Program(anchorIdl, programId, provider);

    return program;
  }

  /**
   * Create and initialize a {@linkcode SwitchboardProgram} connection object.
   *
   * @dev This method is synchronous but will return a promise for consistency with past be.
   *
   * @param connection - the Solana connection object used to connect to an RPC node.
   * @param payerKeypair - optional, payer keypair used to pay for on-chain transactions.
   * @param oracleProgramId - optional, override the cluster's default oracleProgramId.
   *
   * @return the {@linkcode SwitchboardProgram} used to create and interact with Switchboard accounts.
   *
   * Basic usage example:
   *
   * ```ts
   * import { Connection } from "@solana/web3.js";
   * import { SwitchboardProgram, TransactionObject } from '@switchboard-xyz/solana.js';
   *
   * const program = await SwitchboardProgram.load(
   *    new Connection("https://api.mainnet-beta.solana.com"),
   *    payerKeypair
   * );
   *
   * const txn = new TransactionObject(program.walletPubkey, [], []);
   * const txnSignature = await program.signAndSend(txn);
   * ```
   */
  static load = async (
    connection: Connection,
    payerKeypair = READ_ONLY_KEYPAIR,
    oracleProgramId = SB_V2_PID,
    attestationProgramId = SB_ATTESTATION_PID
  ): Promise<SwitchboardProgram> => {
    const provider = new AnchorProvider(
      connection,
      new AnchorWallet(payerKeypair),
      {}
    );
    const mint = new NativeMint(provider);
    return new SwitchboardProgram(
      provider,
      mint,
      oracleProgramId,
      attestationProgramId
    );
  };

  /**
   * Create and initialize a {@linkcode SwitchboardProgram} connection object.
   *
   * @dev This method is synchronous but will return a promise for consistency with past behavior.
   *
   * @param provider - The anchor provider containing the RPC and wallet connection.
   *
   * @return The {@linkcode SwitchboardProgram} used to create and interact with Switchboard accounts.
   *
   * Basic usage example:
   *
   * ```ts
   * import * as anchor from "@coral-xyz/anchor";
   * import { Connection } from "@solana/web3.js";
   * import { AnchorWallet, SwitchboardProgram, TransactionObject } from '@switchboard-xyz/solana.js';
   *
   * const connection = new Connection("https://api.mainnet-beta.solana.com");
   * const provider = new AnchorProvider(
      connection,
      new AnchorWallet(payerKeypair ?? SwitchboardProgram._readOnlyKeypair),
      { commitment: 'confirmed' }
    );
   * const program = await SwitchboardProgram.fromProvider(provider);
   *
   * const txn = new TransactionObject(program.walletPubkey, [], []);
   * const txnSignature = await program.signAndSend(txn);
   * ```
   */
  static fromProvider = async (
    provider: AnchorProvider,
    oracleProgramId: PublicKey = SB_V2_PID,
    attestationProgramId: PublicKey = SB_ATTESTATION_PID
  ): Promise<SwitchboardProgram> => {
    const mint = new NativeMint(provider);
    return new SwitchboardProgram(
      provider,
      mint,
      oracleProgramId,
      attestationProgramId
    );
  };

  /**
   * Create and initialize a {@linkcode SwitchboardProgram} connection object.
   *
   * @dev This method is synchronous but will return a promise for consistency with past behavior.
   *
   * @param connection - The Solana connection object used to connect to an RPC node.
   * @param payer - Optional, payer keypair used to pay for on-chain transactions (defaults to READ_ONLY_KEYPAIR).
   * @param oracleProgramId - Optional, override the cluster's default oracleProgramId.
   *
   * @return The {@linkcode SwitchboardProgram} instance used to create and interact with Switchboard accounts.
   *
   * Basic usage example:
   *
   * ```ts
   * import * as anchor from "@coral-xyz/anchor";
   * import { Connection } from "@solana/web3.js";
   * import { AnchorWallet, SwitchboardProgram, TransactionObject } from '@switchboard-xyz/solana.js';
   *
   * const connection = new Connection("https://api.mainnet-beta.solana.com");
   * const program = await SwitchboardProgram.fromConnection(connection);
   * ```
   */
  static fromConnection = async (
    connection: Connection,
    payer = READ_ONLY_KEYPAIR,
    oracleProgramId: PublicKey = SB_V2_PID,
    attestationProgramId: PublicKey = SB_ATTESTATION_PID
  ): Promise<SwitchboardProgram> => {
    const program = await SwitchboardProgram.load(
      connection,
      payer,
      oracleProgramId,
      attestationProgramId
    );
    return program;
  };

  public get cluster(): Promise<Omit<Cluster, "testnet"> | "localnet"> {
    if (!this._cluster) {
      this._cluster = this.connection
        .getGenesisHash()
        .then((genesisHash) => {
          switch (genesisHash) {
            case MAINNET_GENESIS_HASH:
              return "mainnet-beta";
            case DEVNET_GENESIS_HASH:
              return "devnet";
            default:
              return "localnet";
          }
        })
        .catch((err) => {
          console.error(err);
          this._cluster = undefined;
          throw err;
        });
    }

    return this._cluster;
  }

  public get oracleProgram(): Promise<Program> {
    if (!this._oracleProgram) {
      this._oracleProgram = this.getOracleProgram().catch((err) => {
        console.error(err);
        this._oracleProgram = undefined;
        throw err;
      });
    }
    return this._oracleProgram;
  }

  private async getOracleProgram(retryCount = 3): Promise<Program> {
    const anchorIdl = await Program.fetchIdl(
      this.oracleProgramId,
      this.provider
    );
    if (!anchorIdl) {
      throw new Error(
        `Failed to find IDL for ${this.oracleProgramId.toBase58()}`
      );
    }
    return new Program(anchorIdl, this.oracleProgramId, this.provider);
  }

  public get attestationProgram(): Promise<Program> {
    if (!this._attestationProgram) {
      this._attestationProgram = this.getAttestationProgram().catch((err) => {
        console.error(err);
        this._attestationProgram = undefined;
        throw err;
      });
    }
    return this._attestationProgram;
  }

  private async getAttestationProgram(retryCount = 3): Promise<Program> {
    try {
      const anchorIdl = await Program.fetchIdl(
        this.attestationProgramId,
        this.provider
      );
      if (!anchorIdl) {
        throw new Error(
          `Failed to find IDL for ${this.attestationProgramId.toBase58()}`
        );
      }
      return new Program(anchorIdl, this.attestationProgramId, this.provider);
    } catch (error) {
      if (0 >= retryCount) {
        throw error;
      }
      return this.getAttestationProgram(retryCount - 1);
    }
  }

  public async getGitVersion(): Promise<string> {
    const messageV0 = new TransactionMessage({
      payerKey: this.walletPubkey,
      instructions: [
        await (await this.oracleProgram).methods
          .viewVersion()
          .accounts({})
          .instruction(),
      ],
      recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash,
    }).compileToLegacyMessage();
    const simulationResult = await this.connection.simulateTransaction(
      new VersionedTransaction(messageV0),
      { sigVerify: false }
    );
    const logs = (simulationResult.value?.logs ?? []).join("\n");
    const version = extractVersion(logs);
    if (version) {
      return version;
    }
    console.error(logs);
    throw new Error(
      `Failed to yield the git version in the view_version simulation result`
    );
  }

  public async getAttestationGitVersion(): Promise<string> {
    const messageV0 = new TransactionMessage({
      payerKey: this.walletPubkey,
      instructions: [
        await (await this.attestationProgram).methods
          .viewVersion()
          .accounts({})
          .instruction(),
      ],
      recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash,
    }).compileToLegacyMessage();
    const simulationResult = await this.connection.simulateTransaction(
      new VersionedTransaction(messageV0),
      { sigVerify: false }
    );
    console.error(simulationResult);
    const logs = (simulationResult.value?.logs ?? []).join("\n");
    const version = extractVersion(logs);
    if (version) {
      return version;
    }
    console.error(logs);
    throw new Error(
      `Failed to yield the git version in the view_version simulation result`
    );
  }

  /**
   * Retrieves the Switchboard V2 Program IDL.
   * @return A promise that resolves to the IDL of the Switchboard V2 Program.
   */
  public get oracleProgramIdl(): Promise<Idl> {
    return this.oracleProgram.then((program) => program.idl);
  }

  /**
   * Retrieves the Switchboard Attestation Program IDL.
   * @return A promise that resolves to the IDL of the Switchboard Attestation Program.
   */
  public get attestationIdl(): Promise<Idl> {
    return this.attestationProgram.then((program) => program.idl);
  }

  /**
   * Retrieves the Connection used by this program to connect with the Solana cluster.
   * @return The Connection instance for the Switchboard Program.
   */
  public get connection(): Connection {
    return this.provider.connection;
  }

  /**
   * Retrieves the Wallet used by this program.
   * @return The AnchorWallet instance for the Switchboard Program.
   */
  public get wallet(): AnchorWallet {
    return this.provider.wallet as AnchorWallet;
  }

  /**
   * Retrieves the wallet's PublicKey.
   * @return The PublicKey of the wallet.
   */
  public get walletPubkey(): PublicKey {
    return this.wallet.payer.publicKey;
  }

  /**
   * Returns a new instance of the SwitchboardProgram class for a new payer keypair
   * @return A new instance of the SwitchboardProgram class
   */
  public newWithPayer(payer: Keypair): SwitchboardProgram {
    const newProvider: AnchorProvider = new AnchorProvider(
      this.connection,
      new AnchorWallet(payer),
      this.provider.opts
    );
    return new SwitchboardProgram(
      newProvider,
      this.mint,
      this.oracleProgramId,
      this.attestationProgramId,
      this._oracleProgram,
      this._attestationProgram
    );
  }

  /**
   * Checks if the program is read-only.
   * @return A boolean indicating if the SwitchboardProgram instance is read-only.
   */
  public get isReadOnly(): boolean {
    return (
      this.provider.publicKey.toBase58() ===
      SwitchboardProgram._readOnlyKeypair.publicKey.toBase58()
    );
  }

  /**
   * Verifies that a payer keypair has been supplied to the {@linkcode SwitchboardProgram}.
   * Throws an error if the program is read-only.
   */
  public verifyPayer(): void {
    if (this.isReadOnly) {
      throw new errors.SwitchboardProgramReadOnlyError();
    }
  }

  /**
   * Verifies that a new keypair has been provided and the corresponding account does not already exist.
   *
   * **NOTE:** Creating new accounts without this check may prevent the ability to withdraw any existing funds.
   *
   * @param keypair - The Keypair to be verified.
   * @throws Will throw an error if the account for the keypair already exists.
   */
  public async verifyNewKeypair(keypair: Keypair): Promise<void> {
    const accountInfo = await this.connection.getAccountInfo(keypair.publicKey);
    if (accountInfo) {
      throw new errors.ExistingKeypair();
    }
  }

  /**
   * Verifies that a new keypair has been provided and the corresponding account does not already exist.
   *
   * **NOTE:** Creating new accounts without this check may prevent the ability to withdraw any existing funds.
   *
   * @param keypair - The Keypair to be verified.
   * @throws Will throw an error if the account for the keypair already exists.
   */
  public async verifyNewKeypairs(...keypairs: Keypair[]): Promise<void> {
    const accounts = await this.connection.getMultipleAccountsInfo(
      keypairs.map((k) => k.publicKey)
    );
    for (const [n, account] of accounts.entries()) {
      if (account) {
        throw new errors.ExistingKeypair();
      }
    }
  }

  /**
   * Retrieves the account namespace for the Switchboard V2 Program.
   * @return The AccountNamespace instance for the Switchboard V2 Program.
   */
  public get oracleProgramAccount(): Promise<AccountNamespace> {
    return this.oracleProgram.then((program) => program.account);
  }

  /**
   * Retrieves the account namespace for the Switchboard Attestation Program.
   * @return The AccountNamespace instance for the Switchboard Attestation Program.
   */
  public get attestationAccount(): Promise<AccountNamespace> {
    return this.attestationProgram.then((program) => program.account);
  }

  /**
   * Load the Switchboard Labs permissionless Queue for either devnet or mainnet. The permissionless queue has the following permissions:
   *  - unpermissionedFeedsEnabled: True
   *  - unpermissionedVrfEnabled: True
   *  - enableBufferRelayers: False
   *
   * **Note:** {@linkcode AggregatorAccount}s and {@linkcode VrfAccount}s do not require permissions to join this queue. {@linkcode BufferRelayerAccount}s are disabled.
   */
  async loadPermissionless(): Promise<{
    queueAccount: QueueAccount;
    queue: OracleQueueAccountData;
    crankAccount: CrankAccount;
    crank: CrankAccountData;
  }> {
    // TODO: make this load from common network configs
    throw new Error(`Not implemented yet`);
  }

  /**
   * Load the Switchboard Labs permissionled Queue for either devnet or mainnet. The permissioned queue has the following permissions:
   *  - unpermissionedFeedsEnabled: False
   *  - unpermissionedVrfEnabled: False
   *  - enableBufferRelayers: False
   *
   * **Note:** The queue authority must grant {@linkcode AggregatorAccount}s PERMIT_ORACLE_QUEUE_USAGE and {@linkcode VrfAccount}s PERMIT_VRF_REQUESTS permissions before joining the queue and requesting oracle updates. {@linkcode BufferRelayerAccount}s are disabled.
   */
  async loadPermissioned(): Promise<{
    queueAccount: QueueAccount;
    queue: OracleQueueAccountData;
    crankAccount: CrankAccount;
    crank: CrankAccountData;
  }> {
    // TODO: make this load from common network configs
    throw new Error(`Not implemented yet`);
  }

  /**
   * Adds an event listener for the specified AnchorEvent, allowing consumers to monitor the chain for events
   * such as AggregatorOpenRound, VrfRequestRandomness, and AggregatorSaveResult.
   *
   * @param eventName - The name of the event to listen for.
   * @param callback - A callback function to handle the event data, slot, and signature.
   * @return A unique listener ID that can be used to remove the event listener.
   */
  public async addEventListener<EventName extends keyof SwitchboardEvents>(
    eventName: EventName,
    callback: (
      data: SwitchboardEvents[EventName],
      slot: number,
      signature: string
    ) => void | Promise<void>
  ): Promise<number> {
    return (await this.oracleProgram).addEventListener(
      eventName as string,
      callback
    );
  }

  /**
   * Removes the event listener with the specified listener ID.
   *
   * @param listenerId - The unique ID of the event listener to be removed.
   */
  public async removeEventListener(listenerId: number) {
    return await (await this.oracleProgram).removeEventListener(listenerId);
  }

  /**
   * Adds an event listener for the specified AnchorEvent, allowing consumers to monitor the chain for events
   * emitted from Switchboard's attestation program.
   *
   * @param eventName - The name of the event to listen for.
   * @param callback - A callback function to handle the event data, slot, and signature.
   * @return A unique listener ID that can be used to remove the event listener.
   */
  public async addAttestationEventListener<
    EventName extends keyof SwitchboardEvents
  >(
    eventName: EventName,
    callback: (
      data: SwitchboardEvents[EventName],
      slot: number,
      signature: string
    ) => void | Promise<void>
  ): Promise<number> {
    return (await this.attestationProgram).addEventListener(
      eventName as string,
      callback
    );
  }

  /**
   * Removes the event listener with the specified listener ID.
   *
   * @param listenerId - The unique ID of the event listener to be removed.
   */
  public async removeAttestationEventListener(listenerId: number) {
    return await (
      await this.attestationProgram
    ).removeEventListener(listenerId);
  }

  public async signAndSendAll(
    txns: Array<TransactionObject>,
    opts: SendTransactionOptions = DEFAULT_SEND_TRANSACTION_OPTIONS,
    txnOptions?: TransactionOptions,
    delay = 0
  ): Promise<Array<TransactionSignature>> {
    const txnSignatures = await TransactionObject.signAndSendAll(
      this.provider,
      txns,
      opts,
      txnOptions,
      delay
    );
    return txnSignatures;
  }

  public async signAndSend(
    txn: TransactionObject,
    opts: SendTransactionOptions = DEFAULT_SEND_TRANSACTION_OPTIONS,
    txnOptions?: TransactionOptions
  ): Promise<TransactionSignature> {
    const txnSignature = await txn.signAndSend(this.provider, opts, txnOptions);
    return txnSignature;
  }

  async getProgramJobAccounts(): Promise<Map<Uint8Array, LoadedJobDefinition>> {
    const accountInfos = await this.connection
      .getProgramAccounts(this.oracleProgramId, {
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: AnchorUtils.bytes.bs58.encode(
                JobAccountData.discriminator
              ),
            },
          },
        ],
      })
      .then((values: GetProgramAccountsResponse) => {
        return values.filter(Boolean) as Array<AccountInfoResponse>;
      });

    const jobs: Array<LoadedJobDefinition> = accountInfos
      .map((job): LoadedJobDefinition | undefined => {
        const jobAccount = new JobAccount(this, job.pubkey);
        const state = JobAccountData.decode(job.account.data);
        let oracleJob: OracleJob;
        try {
          oracleJob = OracleJob.decodeDelimited(state.data);
        } catch {
          return undefined;
        }

        return {
          account: jobAccount,
          state: state,
          job: oracleJob,
        };
      })
      .filter(Boolean) as Array<LoadedJobDefinition>;

    return new Map(jobs.map((job) => [job.state.data, job]));
  }

  async getProgramAccounts(): Promise<{
    aggregators: Map<string, AggregatorAccountData>;
    buffers: Map<string, Buffer>;
    bufferRelayers: Map<string, BufferRelayerAccountData>;
    cranks: Map<string, CrankAccountData>;
    jobs: Map<string, JobAccountData>;
    leases: Map<string, LeaseAccountData>;
    oracles: Map<string, OracleAccountData>;
    permissions: Map<string, PermissionAccountData>;
    programState: Map<string, SbState>;
    queues: Map<string, OracleQueueAccountData>;
    slidingResult: Map<string, SlidingResultAccountData>;
    vrfs: Map<string, VrfAccountData>;
  }> {
    const accountInfos: GetProgramAccountsResponse =
      await this.connection.getProgramAccounts(this.oracleProgramId);

    // buffer - [42, 55, 46, 46, 45, 52, 78, 78]
    // bufferRelayer - [50, 35, 51, 115, 169, 219, 158, 52]
    // lease - [55, 254, 208, 251, 164, 44, 150, 50]
    // permissions - [77, 37, 177, 164, 38, 39, 34, 109]
    // slidingResult - [91, 4, 83, 187, 102, 216, 153, 254]
    // vrf - [101, 35, 62, 239, 103, 151, 6, 18]
    // crank - [111, 81, 146, 73, 172, 180, 134, 209]
    // job - [124, 69, 101, 195, 229, 218, 144, 63]
    // oracles - [128, 30, 16, 241, 170, 73, 55, 54]
    // sbState - [159, 42, 192, 191, 139, 62, 168, 28]
    // queue - [164, 207, 200, 51, 199, 113, 35, 109]
    // aggregator - [217, 230, 65, 101, 201, 162, 27, 125]

    const discriminatorMap: Map<
      string,
      Array<AccountInfoResponse>
    > = accountInfos.reduce((map, account) => {
      const discriminator = account.account.data
        .slice(0, ACCOUNT_DISCRIMINATOR_SIZE)
        .toString("utf-8");

      const accounts = map.get(discriminator) ?? [];
      accounts.push(account);
      map.set(discriminator, accounts);

      return map;
    }, new Map<string, Array<AccountInfoResponse>>());

    function decodeAccounts<T extends SwitchboardAccountData>(
      accounts: Array<AccountInfoResponse>,
      decode: (data: Buffer) => T
    ): Map<string, T> {
      return accounts.reduce((map, account) => {
        try {
          const decoded = decode(account.account.data);
          map.set(account.pubkey.toBase58(), decoded);
          // eslint-disable-next-line no-empty
        } catch {}

        return map;
      }, new Map<string, T>());
    }

    const aggregators: Map<string, AggregatorAccountData> = decodeAccounts(
      discriminatorMap.get(
        AggregatorAccountData.discriminator.toString("utf-8")
      ) ?? [],
      AggregatorAccountData.decode
    );

    // TODO: Use aggregator.historyBuffer, crank.dataBuffer, queue.dataBuffer to filter these down and decode
    const buffers: Map<string, Buffer> = (
      discriminatorMap.get(BUFFER_DISCRIMINATOR.toString("utf-8")) ?? []
    ).reduce((map, buffer) => {
      map.set(buffer.pubkey.toBase58(), buffer.account.data);
      return map;
    }, new Map<string, Buffer>());

    const bufferRelayers: Map<string, BufferRelayerAccountData> =
      decodeAccounts(
        discriminatorMap.get(
          BufferRelayerAccountData.discriminator.toString("utf-8")
        ) ?? [],
        BufferRelayerAccountData.decode
      );

    const cranks: Map<string, CrankAccountData> = decodeAccounts(
      discriminatorMap.get(CrankAccountData.discriminator.toString("utf-8")) ??
        [],
      CrankAccountData.decode
    );

    const jobs: Map<string, JobAccountData> = decodeAccounts(
      discriminatorMap.get(JobAccountData.discriminator.toString("utf-8")) ??
        [],
      JobAccountData.decode
    );

    const leases: Map<string, LeaseAccountData> = decodeAccounts(
      discriminatorMap.get(LeaseAccountData.discriminator.toString("utf-8")) ??
        [],
      LeaseAccountData.decode
    );

    const oracles: Map<string, OracleAccountData> = decodeAccounts(
      discriminatorMap.get(OracleAccountData.discriminator.toString("utf-8")) ??
        [],
      OracleAccountData.decode
    );

    const permissions: Map<string, PermissionAccountData> = decodeAccounts(
      discriminatorMap.get(
        PermissionAccountData.discriminator.toString("utf-8")
      ) ?? [],
      PermissionAccountData.decode
    );

    const programState: Map<string, SbState> = decodeAccounts(
      discriminatorMap.get(SbState.discriminator.toString("utf-8")) ?? [],
      SbState.decode
    );

    const queues: Map<string, OracleQueueAccountData> = decodeAccounts(
      discriminatorMap.get(
        OracleQueueAccountData.discriminator.toString("utf-8")
      ) ?? [],
      OracleQueueAccountData.decode
    );

    const slidingResult: Map<string, SlidingResultAccountData> = decodeAccounts(
      discriminatorMap.get(
        SlidingResultAccountData.discriminator.toString("utf-8")
      ) ?? [],
      SlidingResultAccountData.decode
    );

    const vrfs: Map<string, VrfAccountData> = decodeAccounts(
      discriminatorMap.get(VrfAccountData.discriminator.toString("utf-8")) ??
        [],
      VrfAccountData.decode
    );

    return {
      aggregators,
      buffers,
      bufferRelayers,
      cranks,
      jobs,
      leases,
      oracles,
      permissions,
      programState,
      slidingResult,
      queues,
      vrfs,
    };
  }

  static getAccountType(
    accountInfo: AccountInfo<Buffer>
  ): SwitchboardAccountType | null {
    const discriminator = accountInfo.data
      .slice(0, ACCOUNT_DISCRIMINATOR_SIZE)
      .toString("utf-8");
    const accountType = DISCRIMINATOR_MAP.get(discriminator);
    if (accountType) {
      return accountType;
    }

    return null;
  }
}

/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
export const isVersionedTransaction = (tx): tx is VersionedTransaction => {
  return "version" in tx;
};

export class AnchorWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T
  ): Promise<T> {
    if (isVersionedTransaction(tx)) {
      tx.sign([this.payer]);
    } else {
      tx.partialSign(this.payer);
    }

    return tx;
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[]
  ): Promise<T[]> {
    return txs.map((t) => {
      if (isVersionedTransaction(t)) {
        t.sign([this.payer]);
      } else {
        t.partialSign(this.payer);
      }
      return t;
    });
  }
}

interface AccountInfoResponse {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
}

function extractVersion(input: string): string | null {
  const regex = /VERSION: (\S+)/;
  const match = input.match(regex);
  return match ? match[1] : null;
}
