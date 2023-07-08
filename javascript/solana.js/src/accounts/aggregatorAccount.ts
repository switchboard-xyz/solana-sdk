import * as errors from "../errors.js";
import {
  AggregatorAccountData,
  AggregatorAccountDataFields,
  AggregatorAccountDataJSON,
} from "../generated/oracle-program/accounts/AggregatorAccountData.js";
import {
  JobAccountData,
  JobAccountDataJSON,
} from "../generated/oracle-program/accounts/JobAccountData.js";
import {
  LeaseAccountData,
  LeaseAccountDataJSON,
} from "../generated/oracle-program/accounts/LeaseAccountData.js";
import { OracleAccountData } from "../generated/oracle-program/accounts/OracleAccountData.js";
import {
  OracleQueueAccountData,
  OracleQueueAccountDataJSON,
} from "../generated/oracle-program/accounts/OracleQueueAccountData.js";
import {
  PermissionAccountData,
  PermissionAccountDataJSON,
} from "../generated/oracle-program/accounts/PermissionAccountData.js";
import * as ix from "../generated/oracle-program/instructions/index.js";
import {
  AggregatorHistoryRow,
  AggregatorResolutionMode,
  AggregatorResolutionModeKind,
  BorshDecimal,
} from "../generated/oracle-program/types/index.js";
import { SwitchboardDecimal } from "../generated/oracle-program/types/SwitchboardDecimal.js";
import { PermitOracleQueueUsage } from "../generated/oracle-program/types/SwitchboardPermission.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
  TransactionPackOptions,
} from "../TransactionObject.js";

import { Account, OnAccountChangeCallback } from "./account.js";
import { AggregatorHistoryBuffer } from "./aggregatorHistoryBuffer.js";
import { CrankAccount } from "./crankAccount.js";
import { JobAccount } from "./jobAccount.js";
import { LeaseAccount, LeaseExtendParams } from "./leaseAccount.js";
import { OracleAccount } from "./oracleAccount.js";
import { PermissionAccount } from "./permissionAccount.js";
import { QueueAccount } from "./queueAccount.js";

import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  AccountInfo,
  AccountMeta,
  Commitment,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import {
  Big,
  BN,
  OracleJob,
  promiseWithTimeout,
  toUtf8,
} from "@switchboard-xyz/common";
import assert from "assert";
import crypto, { createHash } from "crypto";

/**
 * Account type holding a data feed's update configuration, job accounts, and its current result.
 *
 * Data: {@linkcode AggregatorAccountData}
 *
 * Result: {@linkcode SwitchboardDecimal}
 *
 * HistoryBuffer?: Array<{@linkcode AggregatorHistoryRow}>
 *
 * An aggregator account belongs to a single {@linkcode QueueAccount} but can later be transferred by the aggregator's authority. In order for an {@linkcode OracleAccount} to respond to an aggregator's update request, the aggregator must initialize a {@linkcode PermissionAccount} and {@linkcode LeaseAccount}. These will need to be recreated when transferring queues.
 *
 * Optionally, An aggregator can be pushed onto a {@linkcode CrankAccount} in order to be updated
 *
 * Optionally, an aggregator can add a history buffer to store the last N historical samples along with their update timestamp.
 */
export class AggregatorAccount extends Account<AggregatorAccountData> {
  static accountName = "AggregatorAccountData";

  public history?: AggregatorHistoryBuffer;

  /**
   * Returns the aggregator's name buffer in a stringified format.
   */
  public static getName = (aggregator: AggregatorAccountData) =>
    toUtf8(aggregator.name);
  /**
   * Returns the aggregator's metadata buffer in a stringified format.
   */
  public static getMetadata = (aggregator: AggregatorAccountData) =>
    toUtf8(aggregator.metadata);

  public static size = 3851;

  /**
   * Get the size of an {@linkcode AggregatorAccount} on-chain.
   */
  public size = this.program.account.aggregatorAccountData.size;

  public decode(data: Buffer): AggregatorAccountData {
    try {
      return AggregatorAccountData.decode(data);
    } catch {
      return this.program.coder.decode<AggregatorAccountData>(
        AggregatorAccount.accountName,
        data
      );
    }
  }

  /**
   * Return an aggregator account state initialized to the default values.
   */
  public static default(): AggregatorAccountData {
    const buffer = Buffer.alloc(AggregatorAccount.size, 0);
    AggregatorAccountData.discriminator.copy(buffer, 0);
    return AggregatorAccountData.decode(buffer);
  }

  /**
   * Create a mock account info for a given aggregator config. Useful for test integrations.
   */
  public static createMock(
    programId: PublicKey,
    data: Partial<AggregatorAccountData>,
    options?: {
      lamports?: number;
      rentEpoch?: number;
    }
  ): AccountInfo<Buffer> {
    const fields: AggregatorAccountDataFields = {
      ...AggregatorAccount.default(),
      ...data,
      // any cleanup actions here
    };
    const state = new AggregatorAccountData(fields);

    const buffer = Buffer.alloc(AggregatorAccount.size, 0);
    AggregatorAccountData.discriminator.copy(buffer, 0);
    AggregatorAccountData.layout.encode(state, buffer, 8);

    return {
      executable: false,
      owner: programId,
      lamports: options?.lamports ?? 1 * LAMPORTS_PER_SOL,
      data: buffer,
      rentEpoch: options?.rentEpoch ?? 0,
    };
  }

  /**
   * Invoke a callback each time an AggregatorAccount's data has changed on-chain.
   * @param callback - the callback invoked when the aggregator state changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  public onChange(
    callback: OnAccountChangeCallback<AggregatorAccountData>,
    commitment: Commitment = "confirmed"
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      (accountInfo) => {
        callback(this.decode(accountInfo.data));
      },
      commitment
    );
  }

  /**
   * Retrieve and decode the {@linkcode AggregatorAccountData} stored in this account.
   */
  public async loadData(): Promise<AggregatorAccountData> {
    const data = await AggregatorAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null)
      throw new errors.AccountNotFoundError("Aggregator", this.publicKey);
    this.history = AggregatorHistoryBuffer.fromAggregator(this.program, data);
    return data;
  }

  public get slidingWindowKey(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("SlidingResultAccountData"), this.publicKey.toBytes()],
      this.program.programId
    )[0];
  }

  /** Load an existing AggregatorAccount with its current on-chain state */
  public static async load(
    program: SwitchboardProgram,
    publicKey: PublicKey | string
  ): Promise<[AggregatorAccount, AggregatorAccountData]> {
    const account = new AggregatorAccount(
      program,
      typeof publicKey === "string" ? new PublicKey(publicKey) : publicKey
    );
    const state = await account.loadData();
    return [account, state];
  }

  /**
   * Creates a transaction object with aggregatorInit instructions.
   * @param program The SwitchboardProgram.
   * @param payer The account that will pay for the new accounts.
   * @param params aggregator configuration parameters.
   * @return {@linkcode TransactionObject} that will create the aggregatorAccount.
   *
   * Basic usage example:
   *
   * ```ts
   * import {AggregatorAccount} from '@switchboard-xyz/solana.js';
   * const [aggregatorAccount, aggregatorInit ] = await AggregatorAccount.createInstruction(program, payer, {
   *    queueAccount,
   *    queueAuthority,
   *    batchSize: 5,
   *    minRequiredOracleResults: 3,
   *    minRequiredJobResults: 1,
   *    minUpdateDelaySeconds: 30,
   * });
   * const txnSignature = await program.signAndSend(aggregatorInit);
   * ```
   */
  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: AggregatorInitParams,
    options?: TransactionObjectOptions
  ): Promise<[AggregatorAccount, TransactionObject]> {
    if (params.batchSize > 8) {
      throw new errors.AggregatorConfigError(
        "oracleRequestBatchSize",
        "must be less than or equal to 8"
      );
    }

    if (params.minUpdateDelaySeconds < 5) {
      throw new errors.AggregatorConfigError(
        "minUpdateDelaySeconds",
        "must be greater than 5 seconds"
      );
    }

    const keypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(keypair);

    const ixns: TransactionInstruction[] = [];
    const signers: Keypair[] = [keypair];

    ixns.push(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: keypair.publicKey,
        space: program.account.aggregatorAccountData.size,
        lamports: await program.connection.getMinimumBalanceForRentExemption(
          program.account.aggregatorAccountData.size
        ),
        programId: program.programId,
      })
    );

    ixns.push(
      ix.aggregatorInit(
        program,
        {
          params: {
            name: [...Buffer.from(params.name ?? "", "utf8").slice(0, 32)],
            metadata: [
              ...Buffer.from(params.metadata ?? "", "utf8").slice(0, 128),
            ],
            batchSize: params.batchSize,
            minOracleResults: params.minRequiredOracleResults,
            minJobResults: params.minRequiredJobResults,
            minUpdateDelaySeconds: params.minUpdateDelaySeconds,
            startAfter: new BN(params.startAfter ?? 0),
            varianceThreshold: SwitchboardDecimal.fromBig(
              new Big(params.varianceThreshold ?? 0)
            ).borsh,
            forceReportPeriod: new BN(params.forceReportPeriod ?? 0),
            expiration: new BN(params.expiration ?? 0),
            stateBump: program.programState.bump,
            disableCrank: params.disableCrank ?? false,
          },
        },
        {
          aggregator: keypair.publicKey,
          authority: params.authority ?? payer,
          queue: params.queueAccount.publicKey,
          programState: program.programState.publicKey,
        }
      )
    );

    const aggregatorInitTxn = new TransactionObject(
      payer,
      ixns,
      signers,
      options
    );
    const aggregatorAccount = new AggregatorAccount(program, keypair.publicKey);

    return [aggregatorAccount, aggregatorInitTxn];
  }

  /**
   * Creates an aggregator on-chain and return the transaction signature and created account resource.
   * @param program The SwitchboardProgram.
   * @param params aggregator configuration parameters.
   * @return Transaction signature and the newly created aggregatorAccount.
   *
   * Basic usage example:
   *
   * ```ts
   * import {AggregatorAccount} from '@switchboard-xyz/solana.js';
   * const [aggregatorAccount, txnSignature] = await AggregatorAccount.create(program, {
   *    queueAccount,
   *    queueAuthority,
   *    batchSize: 5,
   *    minRequiredOracleResults: 3,
   *    minRequiredJobResults: 1,
   *    minUpdateDelaySeconds: 30,
   * });
   * const aggregator = await aggregatorAccount.loadData();
   * ```
   */
  public static async create(
    program: SwitchboardProgram,
    params: AggregatorInitParams,
    options?: SendTransactionObjectOptions
  ): Promise<[AggregatorAccount, TransactionSignature]> {
    const [account, transaction] = await AggregatorAccount.createInstruction(
      program,
      program.walletPubkey,
      params,
      options
    );
    const txnSignature = await program.signAndSend(transaction, options);
    return [account, txnSignature];
  }

  /**
   * Create the {@linkcode PermissionAccount} and {@linkcode LeaseAccount} for a new oracle queue without affecting the feed's rhythm. This does not evict a feed from the current queue.
   */
  async transferQueuePart1Instructions(
    payer: PublicKey,
    params: {
      newQueue: QueueAccount;
    } & LeaseExtendParams
  ): Promise<[TransactionObject, PermissionAccount, LeaseAccount]> {
    const txns: Array<TransactionObject> = [];

    const aggregator = await this.loadData();
    const newQueue = await params.newQueue.loadData();

    const jobs = await this.loadJobs(aggregator);
    const jobAuthorities = jobs.map((job) => job.state.authority);

    const [newPermissionAccount] = this.getPermissionAccount(
      params.newQueue.publicKey,
      newQueue.authority
    );

    const newPermissionAccountInfo =
      await this.program.connection.getAccountInfo(
        newPermissionAccount.publicKey
      );
    if (newPermissionAccountInfo === null) {
      const [_newPermissionAccount, permissionInitTxn] =
        PermissionAccount.createInstruction(this.program, payer, {
          authority: newQueue.authority,
          granter: params.newQueue.publicKey,
          grantee: this.publicKey,
        });
      assert(
        newPermissionAccount.publicKey.equals(_newPermissionAccount.publicKey)
      );
      txns.push(permissionInitTxn);
    }

    const [newLeaseAccount] = this.getLeaseAccount(params.newQueue.publicKey);
    const newLeaseAccountInfo = await this.program.connection.getAccountInfo(
      newLeaseAccount.publicKey
    );
    if (newLeaseAccountInfo === null) {
      const [userTokenWallet, userWrap] =
        params.fundAmount && params.fundAmount > 0 && !params.funderTokenWallet
          ? await this.program.mint.getOrCreateWrappedUserInstructions(payer, {
              fundUpTo: params.fundAmount ?? 0,
            })
          : [undefined, undefined];
      if (userWrap) {
        txns.push(userWrap);
      }

      // create lease for the new queue but dont transfer any balance
      const [_newLeaseAccount, leaseInit] =
        await LeaseAccount.createInstructions(this.program, payer, {
          aggregatorAccount: this,
          queueAccount: params.newQueue,
          funderTokenWallet:
            params.funderTokenWallet ?? userTokenWallet ?? undefined,
          funderAuthority: params.funderAuthority ?? undefined,
          jobAuthorities,
          fundAmount: params.fundAmount ?? 0,
          withdrawAuthority: aggregator.authority, // set to current authority
          jobPubkeys: aggregator.jobPubkeysData.slice(
            0,
            aggregator.jobPubkeysSize
          ),
        });
      assert(newLeaseAccount.publicKey.equals(_newLeaseAccount.publicKey));
      txns.push(leaseInit);
    }

    const packed = TransactionObject.pack(txns);
    if (packed.length !== 1) {
      throw new Error(
        `QueueTransfer-Part1: Expected a single TransactionObject`
      );
    }

    return [packed[0], newPermissionAccount, newLeaseAccount];
  }

  /**
   * Create the {@linkcode PermissionAccount} and {@linkcode LeaseAccount} for a new oracle queue without affecting the feed's rhythm. This does not evict a feed from the current queue.
   */
  async transferQueuePart1(
    params: {
      newQueue: QueueAccount;
    } & LeaseExtendParams
  ): Promise<[PermissionAccount, LeaseAccount, TransactionSignature]> {
    const [txn, permissionAccount, leaseAccount] =
      await this.transferQueuePart1Instructions(
        this.program.walletPubkey,
        params
      );
    const signature = await this.program.signAndSend(txn);
    return [permissionAccount, leaseAccount, signature];
  }

  /**
   * Approve the feed to use the new queue. Must be signed by the {@linkcode QueueAccount} authority.
   *
   * This does not affect the feed's rhythm nor evict it from the current queue. The Aggregator authority is still required to sign a transaction to move the feed.
   */
  async transferQueuePart2Instructions(
    payer: PublicKey,
    params: {
      newQueue: QueueAccount;
      enable: boolean;
      queueAuthority?: Keypair;
      // dont check if new accounts have been created yet
      force?: boolean;
    }
  ): Promise<[TransactionObject | undefined, PermissionAccount]> {
    const newQueue = await params.newQueue.loadData();
    const [permissionAccount] = this.getPermissionAccount(
      params.newQueue.publicKey,
      newQueue.authority
    );

    if (!params.enable) {
      return [undefined, permissionAccount];
    }

    if (
      params.queueAuthority &&
      !params.queueAuthority.publicKey.equals(newQueue.authority)
    ) {
      throw new errors.IncorrectAuthority(
        newQueue.authority,
        params.queueAuthority.publicKey
      );
    }

    if (!params.force) {
      await permissionAccount.loadData().catch(() => {
        throw new Error(`Expected permissionAccount to be created already`);
      });
    }

    const permissionSet = permissionAccount.setInstruction(payer, {
      enable: params.enable,
      queueAuthority: params.queueAuthority,
      permission: new PermitOracleQueueUsage(),
    });

    return [permissionSet, permissionAccount];
  }

  /**
   * Approve the feed to use the new queue. Must be signed by the {@linkcode QueueAccount} authority.
   *
   * This does not affect the feed's rhythm nor evict it from the current queue. The Aggregator authority is still required to sign a transaction to move the feed.
   */
  async transferQueuePart2(params: {
    newQueue: QueueAccount;
    enable: boolean;
    queueAuthority?: Keypair;
    // dont check if new accounts have been created yet
    force?: boolean;
  }): Promise<[PermissionAccount, TransactionSignature | undefined]> {
    const [txn, permissionAccount] = await this.transferQueuePart2Instructions(
      this.program.walletPubkey,
      params
    );
    if (!txn) {
      return [permissionAccount, undefined];
    }
    const signature = await this.program.signAndSend(txn);
    return [permissionAccount, signature];
  }

  /**
   * Transfer the feed to the new {@linkcode QueueAccount} and optionally push it on a crank. Must be signed by the Aggregator authority to approve the transfer.
   *
   * This will evict a feed from the previous queue and crank.
   */
  async transferQueuePart3Instructions(
    payer: PublicKey,
    params: {
      newQueue: QueueAccount;
      authority?: Keypair;
      newCrank?: CrankAccount;
      // dont check if new accounts have been created yet
      force?: boolean;
    }
  ): Promise<Array<TransactionObject>> {
    const txns: Array<TransactionObject> = [];

    const newQueue = await params.newQueue.loadData();
    const aggregator = await this.loadData();

    // new permission account needs to be created and approved
    const [permissionAccount] = this.getPermissionAccount(
      params.newQueue.publicKey,
      newQueue.authority
    );

    if (!params.force) {
      await permissionAccount
        .loadData()
        .catch(() => {
          throw new Error(`Expected permissionAccount to be created already`);
        })
        .then((permission) => {
          if (
            !newQueue.unpermissionedFeedsEnabled &&
            permission.permissions !== 2
          ) {
            throw new Error(
              `PermissionAccount missing required permissions to enable this queue`
            );
          }
        });
    }

    // check the new lease has been created
    const [newLeaseAccount] = this.getLeaseAccount(params.newQueue.publicKey);
    if (!params.force) {
      await newLeaseAccount.loadData().catch(() => {
        throw new Error(`Expected leaseAccount to be created already`);
      });
    }

    // set the feeds queue
    const setQueueTxn = new TransactionObject(
      payer,
      [
        ix.aggregatorSetQueue(
          this.program,
          { params: {} },
          {
            aggregator: this.publicKey,
            authority: aggregator.authority,
            queue: params.newQueue.publicKey,
          }
        ),
      ],
      params.authority ? [params.authority] : []
    );
    txns.push(setQueueTxn);

    // push to crank
    if (params.newCrank) {
      const newCrank = await params.newCrank.loadData();
      if (!newCrank.queuePubkey.equals(params.newQueue.publicKey)) {
        throw new Error(`Crank is owned by the wrong queue`);
      }
      const crankPush = params.newCrank.pushInstructionSync(payer, {
        aggregatorAccount: this,
        queue: newQueue,
        crank: newCrank,
      });
      txns.push(crankPush);
    }

    // remove any funds from the old lease account
    const [oldLeaseAccount] = this.getLeaseAccount(aggregator.queuePubkey);
    const oldLease = await oldLeaseAccount.loadData();
    const oldLeaseBalance = await oldLeaseAccount.fetchBalance(oldLease.escrow);
    if (oldLease.withdrawAuthority.equals(payer) && oldLeaseBalance > 0) {
      const withdrawTxn = await oldLeaseAccount.withdrawInstruction(payer, {
        amount: oldLeaseBalance,
        unwrap: false,
        // withdraw old lease funds into the new lease
        withdrawWallet: this.program.mint.getAssociatedAddress(
          newLeaseAccount.publicKey
        ),
      });
      txns.push(withdrawTxn);
    }

    return TransactionObject.pack(txns);
  }

  /**
   * Transfer the feed to the new {@linkcode QueueAccount} and optionally push it on a crank. Must be signed by the Aggregator authority to approve the transfer.
   *
   * This will evict a feed from the previous queue and crank.
   */
  async transferQueuePart3(params: {
    newQueue: QueueAccount;
    authority?: Keypair;
    newCrank?: CrankAccount;
    // dont check if new accounts have been created yet
    force?: boolean;
  }): Promise<Array<TransactionSignature>> {
    const txns = await this.transferQueuePart3Instructions(
      this.program.walletPubkey,
      params
    );
    const signatures = await this.program.signAndSendAll(txns, {
      skipPreflight: true,
    });
    return signatures;
  }

  async transferQueueInstructions(
    payer: PublicKey,
    params: {
      authority?: Keypair;
      newQueue: QueueAccount;
      newCrank?: CrankAccount;
      enable: boolean;
      queueAuthority?: Keypair;
    } & LeaseExtendParams,
    opts?: TransactionObjectOptions
  ): Promise<[Array<TransactionObject>, PermissionAccount, LeaseAccount]> {
    const txns: Array<TransactionObject> = [];

    const [part1, permissionAccount, leaseAccount] =
      await this.transferQueuePart1Instructions(payer, {
        newQueue: params.newQueue,
        fundAmount: params.fundAmount,
        funderTokenWallet: params.funderTokenWallet,
        funderAuthority: params.funderAuthority,
      });
    txns.push(part1);

    const [part2] = await this.transferQueuePart2Instructions(payer, {
      newQueue: params.newQueue,
      enable: params.enable,
      queueAuthority: params.queueAuthority,
      force: true,
    });
    if (part2) {
      txns.push(part2);
    }
    const part3 = await this.transferQueuePart3Instructions(payer, {
      newQueue: params.newQueue,
      authority: params.authority,
      newCrank: params.newCrank,
      force: true,
    });
    txns.push(...part3);

    return [
      TransactionObject.pack(txns, opts),
      permissionAccount,
      leaseAccount,
    ];
  }

  async transferQueue(
    params: {
      authority?: Keypair;
      newQueue: QueueAccount;
      newCrank?: CrankAccount;
      enable: boolean;
      queueAuthority?: Keypair;
    } & LeaseExtendParams
  ): Promise<[PermissionAccount, LeaseAccount, Array<TransactionSignature>]> {
    const [txns, permissionAccount, leaseAccount] =
      await this.transferQueueInstructions(this.program.walletPubkey, params);
    const signatures = await this.program.signAndSendAll(txns, {
      skipPreflight: true,
    });
    return [permissionAccount, leaseAccount, signatures];
  }

  public getPermissionAccount(
    queuePubkey: PublicKey,
    queueAuthority: PublicKey
  ): [PermissionAccount, number] {
    return PermissionAccount.fromSeed(
      this.program,
      queueAuthority,
      queuePubkey,
      this.publicKey
    );
  }

  public getLeaseAccount(
    queuePubkey: PublicKey
  ): [LeaseAccount, PublicKey, number] {
    const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
      this.program,
      queuePubkey,
      this.publicKey
    );
    const leaseEscrow = this.program.mint.getAssociatedAddress(
      leaseAccount.publicKey
    );

    return [leaseAccount, leaseEscrow, leaseBump];
  }

  /**
   * Derives the Program Derived Accounts (PDAs) for the Aggregator, based on its currently assigned oracle queue.
   *
   * @param queueAccount The QueueAccount associated with the Aggregator.
   * @param queueAuthority The PublicKey of the oracle queue authority.
   *
   * @return An object containing the Aggregator PDA accounts, including:
   *   - permissionAccount: The permission account.
   *   - permissionBump: The nonce value used to generate the permission account.
   *   - leaseAccount: The lease account.
   *   - leaseBump: The nonce value used to generate the lease account.
   *   - leaseEscrow: The lease escrow account.
   *
   * Basic usage example:
   *
   * ```ts
   * const aggregatorPdaAccounts = aggregator.getAccounts(queueAccount, queueAuthority);
   * console.log("Aggregator PDA accounts:", aggregatorPdaAccounts);
   * ```
   */
  public getAccounts(
    queueAccount: QueueAccount,
    queueAuthority: PublicKey
  ): AggregatorPdaAccounts {
    const [permissionAccount, permissionBump] = this.getPermissionAccount(
      queueAccount.publicKey,
      queueAuthority
    );

    const [leaseAccount, leaseEscrow, leaseBump] = this.getLeaseAccount(
      queueAccount.publicKey
    );

    return {
      permissionAccount,
      permissionBump,
      leaseAccount,
      leaseBump,
      leaseEscrow,
    };
  }

  /**
   * Retrieves the latest confirmed value stored in the aggregator account from a pre-fetched account state.
   *
   * @param aggregator The pre-fetched aggregator account data.
   *
   * @return The latest feed value as a Big instance, or null if no successful rounds have been confirmed yet.
   *
   * Basic usage example:
   *
   * ```ts
   * const latestValue = AggregatorAccount.decodeLatestValue(aggregatorAccountData);
   * console.log("Latest confirmed value:", latestValue?.toString() ?? "No successful rounds yet");
   * ```
   */
  public static decodeLatestValue(
    aggregator: AggregatorAccountData
  ): Big | null {
    if ((aggregator.latestConfirmedRound?.numSuccess ?? 0) === 0) {
      return null;
    }
    const result = aggregator.latestConfirmedRound.result.toBig();
    return result;
  }

  /**
   * Retrieves the latest confirmed value stored in the aggregator account.
   *
   * @return A Promise that resolves to the latest feed value as a Big instance, or null if the value is not populated or no successful rounds have been confirmed yet.
   *
   * Basic usage example:
   *
   * ```ts
   * const latestValue = await aggregatorAccount.fetchLatestValue();
   * console.log("Latest confirmed value:", latestValue?.toString() ?? "No successful rounds yet");
   * ```
   */
  public async fetchLatestValue(): Promise<Big | null> {
    const aggregator = await this.loadData();
    return AggregatorAccount.decodeLatestValue(aggregator);
  }

  /**
   * Retrieves the timestamp of the latest confirmed round stored in the aggregator account from a pre-fetched account state.
   *
   * @param aggregator The pre-fetched aggregator account data.
   *
   * @return The latest feed timestamp as an BN instance.
   *
   * @throws Error if the aggregator currently holds no value or no successful rounds have been confirmed yet.
   *
   * Basic usage example:
   *
   * ```ts
   * const latestTimestamp = AggregatorAccount.decodeLatestTimestamp(aggregatorAccountData);
   * console.log("Latest confirmed round timestamp:", latestTimestamp.toString());
   * ```
   */
  public static decodeLatestTimestamp(aggregator: AggregatorAccountData): BN {
    if ((aggregator.latestConfirmedRound?.numSuccess ?? 0) === 0) {
      throw new Error("Aggregator currently holds no value.");
    }
    return aggregator.latestConfirmedRound.roundOpenTimestamp;
  }

  /**
   * Decodes the confirmed round results of the aggregator account from a pre-fetched account state.
   *
   * @param aggregator The pre-fetched aggregator account data.
   *
   * @return An array of objects containing the oracle public keys and their respective reported values as Big instances.
   *
   * @throws Error if the aggregator currently holds no value or no successful rounds have been confirmed yet.
   *
   * Basic usage example:
   *
   * ```ts
   * const confirmedRoundResults = AggregatorAccount.decodeConfirmedRoundResults(aggregatorAccountData);
   * console.log("Confirmed round results:", confirmedRoundResults);
   * ```
   */
  public static decodeConfirmedRoundResults(
    aggregator: AggregatorAccountData
  ): Array<{ oraclePubkeys: PublicKey; value: Big }> {
    if ((aggregator.latestConfirmedRound?.numSuccess ?? 0) === 0) {
      throw new Error("Aggregator currently holds no value.");
    }
    const results: Array<{ oraclePubkeys: PublicKey; value: Big }> = [];
    for (let i = 0; i < aggregator.oracleRequestBatchSize; ++i) {
      if (aggregator.latestConfirmedRound.mediansFulfilled[i] === true) {
        results.push({
          oraclePubkeys: aggregator.latestConfirmedRound.oraclePubkeysData[i],
          value: aggregator.latestConfirmedRound.mediansData[i].toBig(),
        });
      }
    }
    return results;
  }

  /**
   * Retrieves the individual oracle results of the latest confirmed round from a pre-fetched account state.
   *
   * @param aggregator The pre-fetched aggregator account data.
   *
   * @return An array of objects containing the oracle account instances and their respective reported values as Big instances.
   *
   * Basic usage example:
   *
   * ```ts
   * const aggregatorAccountData = await aggregatorAccount.loadData();
   * const confirmedRoundResults = aggregatorAccount.getConfirmedRoundResults(aggregatorAccountData);
   * console.log("Confirmed round results by oracle account:", confirmedRoundResults);
   * ```
   */
  public getConfirmedRoundResults(
    aggregator: AggregatorAccountData
  ): Array<{ oracleAccount: OracleAccount; value: Big }> {
    return AggregatorAccount.decodeConfirmedRoundResults(aggregator).map(
      (o) => {
        return {
          oracleAccount: new OracleAccount(this.program, o.oraclePubkeys),
          value: o.value,
        };
      }
    );
  }

  /**
   * Generates a SHA-256 hash of all the oracle jobs currently in the aggregator.
   *
   * @param jobs An array of OracleJob instances representing the jobs in the aggregator.
   *
   * @return A crypto.Hash object representing the hash of all the feed jobs.
   *
   * Basic usage example:
   *
   * ```ts
   * const jobs = [job1, job2, job3];
   * const jobsHash = aggregatorAccount.produceJobsHash(jobs);
   * console.log("Hash of all the feed jobs:", jobsHash);
   * ```
   */
  public produceJobsHash(jobs: Array<OracleJob>): crypto.Hash {
    const hash = crypto.createHash("sha256");
    for (const job of jobs) {
      const jobHasher = crypto.createHash("sha256");
      jobHasher.update(OracleJob.encodeDelimited(job).finish());
      hash.update(jobHasher.digest());
    }
    return hash;
  }

  public static decodeCurrentRoundOracles(
    aggregator: AggregatorAccountData
  ): Array<PublicKey> {
    return aggregator.currentRound.oraclePubkeysData.slice(
      0,
      aggregator.oracleRequestBatchSize
    );
  }

  public async loadCurrentRoundOracles(
    aggregator: AggregatorAccountData
  ): Promise<Array<{ account: OracleAccount; state: OracleAccountData }>> {
    return await Promise.all(
      AggregatorAccount.decodeCurrentRoundOracles(aggregator).map(async (o) => {
        const oracleAccount = new OracleAccount(this.program, o);
        return {
          account: oracleAccount,
          state: await oracleAccount.loadData(),
        };
      })
    );
  }

  public static decodeJobPubkeys(
    aggregator: AggregatorAccountData
  ): Array<PublicKey> {
    return aggregator.jobPubkeysData.slice(0, aggregator.jobPubkeysSize);
  }

  public async loadJobs(aggregator: AggregatorAccountData): Promise<
    Array<{
      account: JobAccount;
      state: JobAccountData;
      job: OracleJob;
      weight: number;
    }>
  > {
    const jobAccountDatas = await anchor.utils.rpc.getMultipleAccounts(
      this.program.connection,
      AggregatorAccount.decodeJobPubkeys(aggregator)
    );

    return await Promise.all(
      jobAccountDatas.map(async (j) => {
        if (!j?.account) {
          throw new Error(
            `Failed to fetch account data for job ${j?.publicKey}`
          );
        }
        if (!j.account.owner.equals(this.program.programId)) {
          throw new errors.IncorrectOwner(
            this.program.programId,
            j.account.owner
          );
        }
        const jobAccount = new JobAccount(this.program, j.publicKey);
        const jobState: JobAccountData = this.program.coder.decode(
          "JobAccountData",
          j.account.data
        );
        return {
          account: jobAccount,
          state: jobState,
          job: OracleJob.decodeDelimited(jobState.data),
          weight: Math.max(
            aggregator.jobWeights[
              aggregator.jobPubkeysData.findIndex((x: PublicKey) =>
                x.equals(j.publicKey)
              )
            ] ?? 1,
            1
          ),
        };
      })
    );
  }

  public getJobHashes(
    jobs: Array<{
      account: JobAccount;
      state: JobAccountData;
    }>
  ): Array<Buffer> {
    return jobs.map((j) => Buffer.from(new Uint8Array(j.state.hash)));
  }

  /**
   * Validates an aggregator's configuration.
   *
   * @param aggregator An object containing the aggregator's account data or a partial configuration.
   * @param queue An object containing the OracleQueueAccountData.
   * @param target An object containing the target configuration values to be verified.
   *
   * @throws {AggregatorConfigError} If any of the following conditions are met:
   * - minUpdateDelaySeconds is less than 5 seconds
   * - batchSize is greater than 8
   * - batchSize is greater than the queue size
   * - minOracleResults is greater than batchSize
   * - minJobResults is equal to 0
   *
   * Basic usage example:
   *
   * ```ts
   * AggregatorAccount.verifyConfig(
   *   aggregatorData,
   *   queueData,
   *   {
   *     batchSize: 8,
   *     minOracleResults: 5,
   *     minJobResults: 4,
   *     minUpdateDelaySeconds: 10,
   *   }
   * );
   * ```
   */
  public static verifyConfig(
    aggregator:
      | AggregatorAccountData
      | {
          oracleRequestBatchSize: number;
          minOracleResults: number;
          minJobResults: number;
          minUpdateDelaySeconds: number;
          jobPubkeysSize: number;
        },
    queue: OracleQueueAccountData,
    target: {
      batchSize?: number;
      minOracleResults?: number;
      minJobResults?: number;
      minUpdateDelaySeconds?: number;
    }
  ): void {
    const numberOfOracles = queue.size;

    const endState = {
      batchSize: target.batchSize ?? aggregator.oracleRequestBatchSize,
      minOracleResults: target.minOracleResults ?? aggregator.minOracleResults,
      minJobResults: target.minJobResults ?? aggregator.minJobResults,
      minUpdateDelaySeconds:
        target.minUpdateDelaySeconds ?? aggregator.minUpdateDelaySeconds,
    };

    if (endState.batchSize > 8) {
      throw new errors.AggregatorConfigError(
        "oracleRequestBatchSize",
        "must be less than or equal to 8"
      );
    }

    if (endState.minUpdateDelaySeconds < 5) {
      throw new errors.AggregatorConfigError(
        "minUpdateDelaySeconds",
        "must be greater than 5 seconds"
      );
    }

    if (endState.minJobResults === 0 || endState.minJobResults > 16) {
      throw new errors.AggregatorConfigError(
        "minJobResults",
        "must be a value between 1 and 16"
      );
    }

    if (endState.minJobResults > aggregator.jobPubkeysSize) {
      console.warn(
        `The aggregator's minJobResults (${endState.minJobResults}) is less than the current number of jobs (${aggregator.jobPubkeysSize})`
      );
    }

    if (endState.batchSize > numberOfOracles) {
      throw new errors.AggregatorConfigError(
        "oracleRequestBatchSize",
        `must be less than the number of oracles actively heartbeating on the queue (${numberOfOracles})`
      );
    }

    if (endState.minOracleResults > endState.batchSize) {
      throw new errors.AggregatorConfigError(
        "minOracleResults",
        `must be less than the oracleRequestBatchSize (${endState.batchSize})`
      );
    }
  }

  /**
   * Validates an aggregator's configuration.
   *
   * @param aggregator An object containing the aggregator's account data or a partial configuration.
   * @param queue An object containing the OracleQueueAccountData.
   * @param target An object containing the target configuration values to be verified.
   *
   * @throws {AggregatorConfigError} If any of the following conditions are met:
   * - minUpdateDelaySeconds is less than 5 seconds
   * - batchSize is greater than 8
   * - batchSize is greater than the queue size
   * - minOracleResults is greater than batchSize
   * - minJobResults is greater than the aggregator's jobPubkeysSize
   *
   * Basic usage example:
   *
   * ```ts
   * aggregatorAccount.verifyConfig(
   *   aggregatorData,
   *   queueData,
   *   {
   *     batchSize: 8,
   *     minOracleResults: 5,
   *     minJobResults: 4,
   *     minUpdateDelaySeconds: 10,
   *   }
   * );
   * ```
   */
  public verifyConfig(
    aggregator:
      | AggregatorAccountData
      | {
          oracleRequestBatchSize: number;
          minOracleResults: number;
          minJobResults: number;
          minUpdateDelaySeconds: number;
          jobPubkeysSize: number;
        },
    queue: OracleQueueAccountData,
    target: {
      batchSize?: number;
      minOracleResults?: number;
      minJobResults?: number;
      minUpdateDelaySeconds?: number;
    }
  ): void {
    AggregatorAccount.verifyConfig(aggregator, queue, target);
  }

  /**
   * Creates a transaction object to set aggregator configuration parameters.
   *
   * @param payer The public key of the payer account.
   * @param params An object containing partial configuration parameters to be set.
   * @param options Optional transaction object options.
   *
   * @return A promise that resolves to a transaction object containing the setConfig instruction.
   *
   * Basic usage example:
   *
   * ```ts
   * const transactionObject = await aggregatorAccount.setConfigInstruction(
   *   payerPublicKey,
   *   {
   *     name: 'New Aggregator Name',
   *     metadata: 'New Aggregator Metadata',
   *     batchSize: 8,
   *     minOracleResults: 5,
   *     minJobResults: 4,
   *     minUpdateDelaySeconds: 10,
   *     forceReportPeriod: 20,
   *     varianceThreshold: 0.01,
   *     basePriorityFee: 1,
   *     priorityFeeBump: 0.1,
   *     priorityFeeBumpPeriod: 60,
   *     maxPriorityFeeMultiplier: 5,
   *     force: false,
   *   }
   * );
   * ```
   */
  public async setConfigInstruction(
    payer: PublicKey,
    params: Partial<{
      name: string;
      metadata: string;
      batchSize: number;
      minOracleResults: number;
      minJobResults: number;
      minUpdateDelaySeconds: number;
      forceReportPeriod: number;
      varianceThreshold: number;
      authority: Keypair;
      basePriorityFee: number;
      priorityFeeBump: number;
      priorityFeeBumpPeriod: number;
      maxPriorityFeeMultiplier: number;
      force: boolean;
      disableCrank: boolean;
    }>,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    if (!(params.force ?? false)) {
      const aggregator = await this.loadData();
      const queueAccount = new QueueAccount(
        this.program,
        aggregator.queuePubkey
      );
      const queue = await queueAccount.loadData();
      this.verifyConfig(aggregator, queue, {
        batchSize: params.batchSize,
        minOracleResults: params.minOracleResults,
        minJobResults: params.minJobResults,
        minUpdateDelaySeconds: params.minUpdateDelaySeconds,
      });
    }

    const varianceThreshold = params.varianceThreshold ?? 0;
    const setConfigIxn = ix.aggregatorSetConfig(
      this.program,
      {
        params: {
          name: params.name
            ? ([
                ...Buffer.from(params.name, "utf-8").slice(0, 32),
              ] as Array<number>)
            : null,
          metadata: params.metadata
            ? ([
                ...Buffer.from(params.metadata, "utf-8").slice(0, 128),
              ] as Array<number>)
            : null,
          batchSize: params.batchSize ?? null,
          minOracleResults: params.minOracleResults ?? null,
          minUpdateDelaySeconds: params.minUpdateDelaySeconds ?? null,
          minJobResults: params.minJobResults ?? null,
          forceReportPeriod: params.forceReportPeriod ?? null,
          varianceThreshold:
            varianceThreshold >= 0
              ? new BorshDecimal(
                  SwitchboardDecimal.fromBig(new Big(varianceThreshold))
                )
              : null,
          basePriorityFee: params.basePriorityFee ?? null,
          priorityFeeBump: params.priorityFeeBump ?? null,
          priorityFeeBumpPeriod: params.priorityFeeBumpPeriod ?? null,
          maxPriorityFeeMultiplier: params.maxPriorityFeeMultiplier ?? null,
          disableCrank: params.disableCrank ?? null,
        },
      },
      {
        aggregator: this.publicKey,
        authority: params.authority ? params.authority.publicKey : payer,
      }
    );

    return new TransactionObject(
      payer,
      [setConfigIxn],
      params.authority ? [params.authority] : [],
      options
    );
  }

  /**
   * Sets an aggregator configuration parameters.
   *
   * @param params An object containing partial configuration parameters to be set.
   * @param options Optional transaction object options.
   *
   * @return A promise that resolves to a transaction object containing the setConfig instruction.
   *
   * Basic usage example:
   *
   * ```ts
   * const transactionObject = await aggregatorAccount.setConfig(
   *   {
   *     name: 'New Aggregator Name',
   *     metadata: 'New Aggregator Metadata',
   *     batchSize: 8,
   *     minOracleResults: 5,
   *     minJobResults: 4,
   *     minUpdateDelaySeconds: 10,
   *     forceReportPeriod: 20,
   *     varianceThreshold: 0.01,
   *     basePriorityFee: 1,
   *     priorityFeeBump: 0.1,
   *     priorityFeeBumpPeriod: 60,
   *     maxPriorityFeeMultiplier: 5,
   *     force: false,
   *   }
   * );
   * ```
   */
  public async setConfig(
    params: Partial<{
      name: string;
      metadata: string;
      batchSize: number;
      minOracleResults: number;
      minJobResults: number;
      minUpdateDelaySeconds: number;
      forceReportPeriod: number;
      varianceThreshold: number;
      authority?: Keypair;
      basePriorityFee?: number;
      priorityFeeBump?: number;
      priorityFeeBumpPeriod?: number;
      maxPriorityFeeMultiplier?: number;
      force: boolean;
      disableCrank: boolean;
    }>,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const setConfigTxn = await this.setConfigInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(setConfigTxn);
    return txnSignature;
  }

  public setQueueInstruction(
    payer: PublicKey,
    params: {
      queueAccount: QueueAccount;
      authority?: Keypair;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    const setQueueIxn = ix.aggregatorSetQueue(
      this.program,
      {
        params: {},
      },
      {
        aggregator: this.publicKey,
        authority: params.authority ? params.authority.publicKey : payer,
        queue: params.queueAccount.publicKey,
      }
    );
    return new TransactionObject(
      payer,
      [setQueueIxn],
      params.authority ? [params.authority] : [],
      options
    );
  }

  public async setQueue(
    params: {
      queueAccount: QueueAccount;
      authority?: Keypair;
    },
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const setQueueTxn = this.setQueueInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(setQueueTxn, options);
    return txnSignature;
  }

  public addJobInstruction(
    payer: PublicKey,
    params: {
      job: JobAccount;
      weight?: number;
      authority?: Keypair;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    const authority = params.authority ? params.authority.publicKey : payer;
    const addJobIxn = ix.aggregatorAddJob(
      this.program,
      { params: { weight: params.weight ?? 1 } },
      {
        aggregator: this.publicKey,
        authority: authority,
        job: params.job.publicKey,
      }
    );
    return new TransactionObject(
      payer,
      [addJobIxn],
      params.authority ? [params.authority] : [],
      options
    );
  }

  public async addJob(
    params: {
      job: JobAccount;
      weight?: number;
      authority?: Keypair;
    },
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const txn = this.addJobInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(txn, options);
    return txnSignature;
  }

  public lockInstruction(
    payer: PublicKey,
    params: {
      authority?: Keypair;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    return new TransactionObject(
      payer,
      [
        ix.aggregatorLock(
          this.program,
          { params: {} },
          {
            aggregator: this.publicKey,
            authority: params.authority ? params.authority.publicKey : payer,
          }
        ),
      ],
      params.authority ? [params.authority] : [],
      options
    );
  }

  public async lock(
    params: {
      authority?: Keypair;
    },
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const lockTxn = this.lockInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(lockTxn, options);
    return txnSignature;
  }

  public setAuthorityInstruction(
    payer: PublicKey,
    params: {
      newAuthority: PublicKey;
      authority?: Keypair;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    return new TransactionObject(
      payer,
      [
        ix.aggregatorSetAuthority(
          this.program,
          { params: {} },
          {
            aggregator: this.publicKey,
            authority: params.authority ? params.authority.publicKey : payer,
            newAuthority: params.newAuthority,
          }
        ),
      ],
      params.authority ? [params.authority] : [],
      options
    );
  }

  public async setAuthority(
    params: {
      newAuthority: PublicKey;
      authority?: Keypair;
    },
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const setAuthorityTxn = this.setAuthorityInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(
      setAuthorityTxn,
      options
    );
    return txnSignature;
  }

  public updateJobWeightInstruction(
    payer: PublicKey,
    params: {
      job: JobAccount;
      jobIdx: number;
      weight: number;
      authority?: Keypair;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    const removeJob = this.removeJobInstruction(
      payer,
      {
        job: params.job,
        jobIdx: params.jobIdx,
        authority: params.authority,
      },
      options
    );
    const addJob = this.addJobInstruction(payer, {
      job: params.job,
      weight: params.weight,
      authority: params.authority,
    });
    return removeJob.combine(addJob);
  }

  public async updateJobWeight(
    params: {
      job: JobAccount;
      jobIdx: number;
      weight: number;
      authority?: Keypair;
    },
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const transaction = this.updateJobWeightInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const signature = await this.program.signAndSend(transaction, options);
    return signature;
  }

  public removeJobInstruction(
    payer: PublicKey,
    params: {
      job: JobAccount;
      jobIdx: number;
      authority?: Keypair;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    const authority = params.authority ? params.authority.publicKey : payer;
    const removeJobIxn = ix.aggregatorRemoveJob(
      this.program,
      { params: { jobIdx: params.jobIdx } },
      {
        aggregator: this.publicKey,
        authority: authority,
        job: params.job.publicKey,
      }
    );
    return new TransactionObject(
      payer,
      [removeJobIxn],
      params.authority ? [params.authority] : [],
      options
    );
  }

  public async removeJob(
    params: {
      job: JobAccount;
      jobIdx: number;
      authority?: Keypair;
    },
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const removeJobTxn = this.removeJobInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(removeJobTxn, options);
    return txnSignature;
  }

  public async openRoundInstruction(
    payer: PublicKey,
    params?: { payoutWallet?: PublicKey },
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const aggregatorData = await this.loadData();
    const queueAccount = new QueueAccount(
      this.program,
      aggregatorData.queuePubkey
    );
    const queue = await queueAccount.loadData();

    const {
      permissionAccount,
      permissionBump,
      leaseAccount,
      leaseBump,
      leaseEscrow,
    } = this.getAccounts(queueAccount, queue.authority);

    const ixns: Array<TransactionInstruction> = [];

    const payoutWallet =
      params?.payoutWallet ?? this.program.mint.getAssociatedAddress(payer);
    const payoutWalletAccountInfo =
      await this.program.connection.getAccountInfo(payoutWallet);
    if (payoutWalletAccountInfo === null) {
      const [createTokenAccountTxn] =
        this.program.mint.createAssocatedUserInstruction(payer);
      ixns.push(...createTokenAccountTxn.ixns);
    }

    ixns.push(
      ix.aggregatorOpenRound(
        this.program,
        {
          params: {
            stateBump: this.program.programState.bump,
            leaseBump,
            permissionBump,
            jitter: 0,
          },
        },
        {
          aggregator: this.publicKey,
          lease: leaseAccount.publicKey,
          oracleQueue: queueAccount.publicKey,
          queueAuthority: queue.authority,
          permission: permissionAccount.publicKey,
          escrow: leaseEscrow,
          programState: this.program.programState.publicKey,
          payoutWallet: payoutWallet,
          tokenProgram: TOKEN_PROGRAM_ID,
          dataBuffer: queue.dataBuffer,
          mint: this.program.mint.address,
        }
      )
    );

    return new TransactionObject(payer, ixns, [], options);
  }

  public async openRound(
    params?: {
      payoutWallet?: PublicKey;
    },
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const openRoundTxn = await this.openRoundInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(openRoundTxn, options);
    return txnSignature;
  }

  public quoteKeypairFromSeed(seed: PublicKey): Keypair {
    const hash = createHash("sha256");
    hash.update(Buffer.from("EnclaveAccountData"));
    hash.update(seed.toBuffer());
    const kp = Keypair.fromSeed(hash.digest());
    return kp;
  }

  public teeSaveResultInstructionSync(
    payer: PublicKey,
    params: AggregatorSaveResultSyncParams & {
      quotePubkey?: PublicKey;
      authority: Keypair;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    const [oraclePermissionAccount, oraclePermissionBump] =
      params.oraclePermission;

    const quote =
      params.quotePubkey ??
      this.quoteKeypairFromSeed(
        params.oracles[params.oracleIdx].state.oracleAuthority
      ).publicKey;

    const saveResultIxn = ix.aggregatorTeeSaveResult(
      this.program,
      {
        params: {
          // oracleIdx: params.oracleIdx,
          // error: params.error ?? false,
          value: SwitchboardDecimal.fromBig(params.value).borsh,
          jobsChecksum: [...this.produceJobsHash(params.jobs).digest()],
          minResponse: SwitchboardDecimal.fromBig(params.minResponse).borsh,
          maxResponse: SwitchboardDecimal.fromBig(params.maxResponse).borsh,
          feedPermissionBump: params.permissionBump,
          oraclePermissionBump: oraclePermissionBump,
          leaseBump: params.leaseBump,
          stateBump: this.program.programState.bump,
        },
      },
      {
        aggregator: this.publicKey,
        oracle: params.oracles[params.oracleIdx].account.publicKey,
        oracleAuthority: params.oracles[params.oracleIdx].state.oracleAuthority,
        oracleQueue: params.queueAccount.publicKey,
        queueAuthority: params.queueAuthority,
        feedPermission: params.permissionAccount.publicKey,
        oraclePermission: oraclePermissionAccount.publicKey,
        lease: params.leaseAccount.publicKey,
        escrow: params.leaseEscrow,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        programState: this.program.programState.publicKey,
        historyBuffer: params.historyBuffer ?? this.publicKey,
        mint: this.program.mint.address,
        slider: this.slidingWindowKey,
        quote: quote,
        rewardWallet: this.program.mint.getAssociatedAddress(payer),
        payer: payer,
        systemProgram: SystemProgram.programId,
      }
    );

    const remainingAccounts: Array<PublicKey> = [];
    params.oracles.forEach((oracle) =>
      remainingAccounts.push(oracle.account.publicKey)
    );
    params.oracles.forEach((oracle) =>
      remainingAccounts.push(oracle.state.tokenAccount)
    );
    remainingAccounts.push(this.slidingWindowKey);

    saveResultIxn.keys.push(
      ...remainingAccounts.map((pubkey): AccountMeta => {
        return { isSigner: false, isWritable: true, pubkey };
      })
    );

    return new TransactionObject(
      payer,
      [saveResultIxn],
      [params.authority],
      options
    );
  }

  public saveResultInstructionSync(
    payer: PublicKey,
    params: AggregatorSaveResultSyncParams,
    options?: TransactionObjectOptions
  ): TransactionObject {
    const [oraclePermissionAccount, oraclePermissionBump] =
      params.oraclePermission;

    if (params.oracleIdx < 0 || params.oracleIdx > params.oracles.length - 1) {
      throw new Error("Failed to find oracle in current round");
    }

    const saveResultIxn = ix.aggregatorSaveResult(
      this.program,
      {
        params: {
          oracleIdx: params.oracleIdx,
          error: params.error ?? false,
          value: SwitchboardDecimal.fromBig(params.value).borsh,
          jobsChecksum: [...this.produceJobsHash(params.jobs).digest()],
          minResponse: SwitchboardDecimal.fromBig(params.minResponse).borsh,
          maxResponse: SwitchboardDecimal.fromBig(params.maxResponse).borsh,
          feedPermissionBump: params.permissionBump,
          oraclePermissionBump: oraclePermissionBump,
          leaseBump: params.leaseBump,
          stateBump: this.program.programState.bump,
        },
      },
      {
        aggregator: this.publicKey,
        oracle: params.oracles[params.oracleIdx].account.publicKey,
        oracleAuthority: params.oracles[params.oracleIdx].state.oracleAuthority,
        oracleQueue: params.queueAccount.publicKey,
        queueAuthority: params.queueAuthority,
        feedPermission: params.permissionAccount.publicKey,
        oraclePermission: oraclePermissionAccount.publicKey,
        lease: params.leaseAccount.publicKey,
        escrow: params.leaseEscrow,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        programState: this.program.programState.publicKey,
        historyBuffer: params.historyBuffer ?? this.publicKey,
        mint: this.program.mint.address,
      }
    );

    const remainingAccounts: Array<PublicKey> = [];
    params.oracles.forEach((oracle) =>
      remainingAccounts.push(oracle.account.publicKey)
    );
    params.oracles.forEach((oracle) =>
      remainingAccounts.push(oracle.state.tokenAccount)
    );
    remainingAccounts.push(this.slidingWindowKey);

    saveResultIxn.keys.push(
      ...remainingAccounts.map((pubkey): AccountMeta => {
        return { isSigner: false, isWritable: true, pubkey };
      })
    );

    return new TransactionObject(payer, [saveResultIxn], [], options);
  }

  public async saveResultInstruction(
    payer: PublicKey,
    params: AggregatorSaveResultAsyncParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const aggregator = params.aggregator ?? (await this.loadData());

    const oracles =
      params.oracles ?? (await this.loadCurrentRoundOracles(aggregator));

    const oracleIdx =
      params.oracleIdx ??
      oracles.findIndex((o) =>
        o.account.publicKey.equals(params.oracleAccount.publicKey)
      );

    if (oracleIdx < 0 || oracleIdx > oracles.length - 1) {
      throw new Error("Failed to find oracle in current round");
    }

    const queueAccount =
      params.queueAccount ??
      new QueueAccount(this.program, aggregator.queuePubkey);

    const queueAuthority =
      params.queueAuthority ?? (await queueAccount.loadData()).authority;

    const [oraclePermissionAccount, oraclePermissionBump] =
      params.oraclePermission ??
      params.oracleAccount.getPermissionAccount(
        queueAccount.publicKey,
        queueAuthority
      );

    const accounts: AggregatorPdaAccounts =
      params.permissionAccount === undefined ||
      params.leaseAccount === undefined ||
      params.leaseEscrow === undefined ||
      params.permissionBump === undefined ||
      params.leaseBump === undefined
        ? this.getAccounts(queueAccount, queueAuthority)
        : {
            permissionAccount: params.permissionAccount,
            permissionBump: params.permissionBump,
            leaseAccount: params.leaseAccount,
            leaseBump: params.leaseBump,
            leaseEscrow: params.leaseEscrow,
          };

    const saveResultTxn = this.saveResultInstructionSync(
      payer,
      {
        ...accounts,
        queueAccount,
        queueAuthority,
        jobs: params.jobs,
        historyBuffer: aggregator.historyBuffer.equals(PublicKey.default)
          ? undefined
          : aggregator.historyBuffer,
        oracleIdx,
        oraclePermission: [oraclePermissionAccount, oraclePermissionBump],
        value: params.value,
        minResponse: params.minResponse,
        maxResponse: params.maxResponse,
        error: params.error ?? false,
        aggregator: aggregator,
        oracles: oracles,
      },
      options
    );
    return saveResultTxn;
  }

  public async saveResult(
    params: AggregatorSaveResultAsyncParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const saveResultTxn = await this.saveResultInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(saveResultTxn, options);
    return txnSignature;
  }

  public async fetchAccounts(
    _aggregator?: AggregatorAccountData,
    _queueAccount?: QueueAccount,
    _queue?: OracleQueueAccountData,
    commitment: Commitment = "confirmed"
  ): Promise<AggregatorAccounts> {
    const aggregator = _aggregator ?? (await this.loadData());
    const queueAccount =
      _queueAccount ?? new QueueAccount(this.program, aggregator.queuePubkey);
    const queue = _queue ?? (await queueAccount.loadData());

    const {
      permissionAccount,
      permissionBump,
      leaseAccount,
      leaseEscrow,
      leaseBump,
    } = this.getAccounts(queueAccount, queue.authority);

    const jobPubkeys = aggregator.jobPubkeysData.slice(
      0,
      aggregator.jobPubkeysSize
    );

    const accountInfos = await anchor.utils.rpc.getMultipleAccounts(
      this.program.connection,
      [
        permissionAccount.publicKey,
        leaseAccount.publicKey,
        leaseEscrow,
        ...jobPubkeys,
      ],
      commitment
    );

    const permissionAccountInfo = accountInfos.shift();
    if (!permissionAccountInfo || !permissionAccountInfo.account) {
      throw new Error(
        `PermissionAccount has not been created yet for this aggregator`
      );
    }
    const permission = PermissionAccountData.decode(
      permissionAccountInfo.account.data
    );

    const leaseAccountInfo = accountInfos.shift();
    if (!leaseAccountInfo || !leaseAccountInfo.account) {
      throw new Error(
        `LeaseAccount has not been created yet for this aggregator`
      );
    }
    const lease = LeaseAccountData.decode(leaseAccountInfo.account.data);

    const leaseEscrowAccountInfo = accountInfos.shift();
    if (!leaseEscrowAccountInfo || !leaseEscrowAccountInfo.account) {
      throw new Error(
        `LeaseAccount escrow has not been created yet for this aggregator`
      );
    }
    const leaseEscrowAccount = spl.unpackAccount(
      leaseEscrow,
      leaseEscrowAccountInfo.account
    );

    const jobs: Array<{
      publicKey: PublicKey;
      data: JobAccountData;
      tasks: Array<OracleJob.ITask>;
    }> = [];
    accountInfos.map((accountInfo) => {
      if (!accountInfo || !accountInfo.account) {
        throw new Error(`Failed to fetch JobAccount`);
      }
      const job = JobAccountData.decode(accountInfo.account.data);
      const oracleJob = OracleJob.decodeDelimited(job.data);
      jobs.push({
        publicKey: accountInfo.publicKey,
        data: job,
        tasks: oracleJob.tasks,
      });
    });

    return {
      aggregator: {
        publicKey: this.publicKey,
        data: aggregator,
      },
      queue: {
        publicKey: queueAccount.publicKey,
        data: queue,
      },
      permission: {
        publicKey: permissionAccount.publicKey,
        bump: permissionBump,
        data: permission,
      },
      lease: {
        publicKey: leaseAccount.publicKey,
        bump: leaseBump,
        data: lease,
        balance: this.program.mint.fromTokenAmount(leaseEscrowAccount.amount),
      },
      jobs: jobs,
    };
  }

  public async toAccountsJSON(
    _aggregator?: AggregatorAccountData,
    _queueAccount?: QueueAccount,
    _queue?: OracleQueueAccountData
  ): Promise<AggregatorAccountsJSON> {
    const accounts = await this.fetchAccounts(
      _aggregator,
      _queueAccount,
      _queue
    );

    return {
      publicKey: this.publicKey,
      ...accounts.aggregator.data.toJSON(),
      queue: {
        publicKey: accounts.queue.publicKey,
        ...accounts.queue.data.toJSON(),
      },
      permission: {
        publicKey: accounts.permission.publicKey,
        ...accounts.permission.data.toJSON(),
        bump: accounts.permission.bump,
      },
      lease: {
        publicKey: accounts.lease.publicKey,
        ...accounts.lease.data.toJSON(),
        bump: accounts.lease.bump,
        balance: accounts.lease.balance,
      },
      jobs: accounts.jobs.map((j) => {
        return {
          publicKey: j.publicKey,
          ...j.data.toJSON(),
          tasks: j.tasks,
        };
      }),
    };
  }

  setResolutionModeInstruction(
    payer: PublicKey,
    params: {
      authority?: Keypair;
      mode: AggregatorResolutionModeKind;
    },
    options?: TransactionObjectOptions
  ): TransactionObject {
    return new TransactionObject(
      payer,
      [
        ix.aggregatorSetResolutionMode(
          this.program,
          {
            params: { mode: params.mode.discriminator },
          },
          {
            aggregator: this.publicKey,
            authority: params.authority ? params.authority.publicKey : payer,
            slidingWindow: this.slidingWindowKey,
            payer: payer,
            systemProgram: SystemProgram.programId,
          }
        ),
      ],
      params.authority ? [params.authority] : [],
      options
    );
  }

  async setResolutionMode(
    params: {
      authority?: Keypair;
      mode: AggregatorResolutionModeKind;
    },
    options?: TransactionObjectOptions
  ): Promise<TransactionSignature> {
    const setResolutionModeTxn = this.setResolutionModeInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(setResolutionModeTxn);
    return txnSignature;
  }

  async openRoundAndAwaitResult(
    params?: { payoutWallet?: PublicKey } & {
      aggregator?: AggregatorAccountData;
    },
    timeout = 30000,
    options?: TransactionObjectOptions
  ): Promise<[AggregatorAccountData, TransactionSignature | undefined]> {
    const aggregator = params?.aggregator ?? (await this.loadData());
    const currentRoundOpenSlot = aggregator.latestConfirmedRound.roundOpenSlot;

    let ws: number | undefined = undefined;

    const closeWebsocket = async () => {
      if (ws !== undefined) {
        await this.program.connection.removeAccountChangeListener(ws);
        ws = undefined;
      }
    };

    const statePromise: Promise<AggregatorAccountData> = promiseWithTimeout(
      timeout,
      new Promise((resolve: (result: AggregatorAccountData) => void) => {
        ws = this.onChange((aggregator) => {
          // if confirmed round slot larger than last open slot
          // AND sliding window mode or sufficient oracle results
          if (
            aggregator.latestConfirmedRound.roundOpenSlot.gt(
              currentRoundOpenSlot
            ) &&
            (aggregator.resolutionMode.kind ===
              AggregatorResolutionMode.ModeSlidingResolution.kind ||
              (aggregator.latestConfirmedRound.numSuccess ?? 0) >=
                aggregator.minOracleResults)
          ) {
            resolve(aggregator);
          }
        });
      })
    ).finally(async () => {
      await closeWebsocket();
    });

    const openRoundSignature = await this.openRound(params, options).catch(
      async (error) => {
        await closeWebsocket();
        throw new Error(`Failed to call openRound, ${error}`);
      }
    );

    const state = await statePromise;

    await closeWebsocket();

    return [state, openRoundSignature];
  }

  /**
   * Await for the next round to close and return the aggregator round result
   *
   * @param roundOpenSlot - optional, the slot when the current round was opened. if not provided then it will be loaded.
   * @param timeout - the number of milliseconds to wait for the round to close
   *
   * @throws {string} when the timeout interval is exceeded or when the latestConfirmedRound.roundOpenSlot exceeds the target roundOpenSlot
   */
  async nextRound(
    roundOpenSlot?: BN,
    timeout = 30000
  ): Promise<AggregatorAccountData> {
    const slot =
      roundOpenSlot ?? (await this.loadData()).currentRound.roundOpenSlot;
    let ws: number | undefined;

    let result: AggregatorAccountData;
    try {
      result = await promiseWithTimeout(
        timeout,
        new Promise((resolve: (result: AggregatorAccountData) => void) => {
          ws = this.onChange((aggregator) => {
            if (aggregator.latestConfirmedRound.roundOpenSlot.eq(slot)) {
              resolve(aggregator);
            }
          });
        })
      );
    } finally {
      if (ws) {
        await this.program.connection.removeAccountChangeListener(ws);
      }
    }

    return result;
  }

  /**
   * Load an aggregators {@linkcode AggregatorHistoryBuffer}.
   * @return the list of historical samples attached to the aggregator.
   */
  async loadHistory(
    startTimestamp?: number,
    endTimestamp?: number
  ): Promise<Array<AggregatorHistoryRow>> {
    if (!this.history) {
      this.history = new AggregatorHistoryBuffer(
        this.program,
        (await this.loadData()).historyBuffer
      );
    }

    const history = await this.history.loadData(startTimestamp, endTimestamp);

    return history;
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    publicKeys: Array<PublicKey>,
    commitment: Commitment = "confirmed"
  ): Promise<
    Array<{
      account: AggregatorAccount;
      data: AggregatorAccountData;
    }>
  > {
    const aggregators: Array<{
      account: AggregatorAccount;
      data: AggregatorAccountData;
    }> = [];

    const accountInfos = await anchor.utils.rpc.getMultipleAccounts(
      program.connection,
      publicKeys,
      commitment
    );

    for (const accountInfo of accountInfos) {
      if (!accountInfo?.publicKey) {
        continue;
      }
      try {
        const account = new AggregatorAccount(program, accountInfo.publicKey);
        const data = AggregatorAccountData.decode(accountInfo.account.data);
        aggregators.push({ account, data });
        // eslint-disable-next-line no-empty
      } catch {}
    }

    return aggregators;
  }

  /**
   * Calculates the required priority fee for a given aggregator
   *
   * Multiplier = the minimum of maxPriorityFeeMultiplier and (timestamp - lastUpdatedTimestamp) / priorityFeeBumpPeriod
   * Fee = baseFee + basePriorityFee + priorityFeeBump * multiplier
   *
   * @param aggregator - the current aggregator state including its last updated timestamp and priority fee config
   * @param timestamp - optional, the current unix timestamp. can provide the SolanaClock timestamp for better accuracy
   * @param baseFee - optional, the Solana compute unit base fee
   *
   * @returns the solana priority fee to include in the save_result action
   */
  public static calculatePriorityFee(
    aggregator: AggregatorAccountData,
    timestamp = Math.round(Date.now() / 1000),
    baseFee = 0 // base compute unit price
  ): number {
    // parse defaults
    const lastUpdateTimestamp =
      aggregator.latestConfirmedRound.roundOpenTimestamp.gt(new BN(0))
        ? aggregator.latestConfirmedRound.roundOpenTimestamp.toNumber()
        : timestamp; // on first update this would cause max multiplier
    const priorityFeeBumpPeriod = Math.max(1, aggregator.priorityFeeBumpPeriod); // cant divide by 0
    const maxPriorityFeeMultiplier = Math.max(
      1,
      aggregator.maxPriorityFeeMultiplier
    );

    // calculate staleness multiplier
    const multiplier = Math.min(
      (timestamp - lastUpdateTimestamp) / priorityFeeBumpPeriod,
      maxPriorityFeeMultiplier
    );

    const feeBump = aggregator.priorityFeeBump * multiplier;
    const fee = baseFee + aggregator.basePriorityFee + feeBump;
    if (Number.isNaN(fee)) {
      return 0;
    }

    // Should we enforce some upper limit? Like 1 SOL?
    // Probably not, gives MEV bots a floor
    return Math.round(fee);
  }

  /** Fetch the balance of an aggregator's lease */
  public async fetchBalance(
    leaseEscrow?: PublicKey,
    queuePubkey?: PublicKey
  ): Promise<number> {
    const escrowPubkey =
      leaseEscrow ??
      this.getLeaseAccount(
        queuePubkey ?? (await this.loadData()).queuePubkey
      )[1];
    const escrowBalance = await this.program.mint.fetchBalance(escrowPubkey);
    if (escrowBalance === null) {
      throw new errors.AccountNotFoundError("Lease Escrow", escrowPubkey);
    }
    return escrowBalance;
  }

  /** Create a transaction object that will fund an aggregator's lease up to a given balance */
  public async fundUpToInstruction(
    payer: PublicKey,
    fundUpTo: number,
    disableWrap = false
  ): Promise<[TransactionObject | undefined, number | undefined]> {
    const [leaseAccount, leaseEscrow] = this.getLeaseAccount(
      (await this.loadData()).queuePubkey
    );
    const balance = await this.fetchBalance(leaseEscrow);
    if (balance >= fundUpTo) {
      return [undefined, undefined];
    }

    const fundAmount = fundUpTo - balance;

    const leaseExtend = await leaseAccount.extendInstruction(payer, {
      fundAmount,
      disableWrap,
    });
    return [leaseExtend, fundAmount];
  }

  /** Fund an aggregator's lease up to a given balance */
  public async fundUpTo(
    payer: PublicKey,
    fundUpTo: number,
    disableWrap = false
  ): Promise<[TransactionSignature | undefined, number | undefined]> {
    const [fundUpToTxn, fundAmount] = await this.fundUpToInstruction(
      payer,
      fundUpTo,
      disableWrap
    );
    if (!fundUpToTxn) {
      return [undefined, undefined];
    }

    const txnSignature = await this.program.signAndSend(fundUpToTxn);
    return [txnSignature, fundAmount!];
  }

  /** Create a set of transactions that will fund an aggregator's lease up to a given balance */
  public static async fundMultipleUpToInstructions(
    payer: PublicKey,
    fundUpTo: number,
    aggregators: Array<AggregatorAccount>,
    options?: TransactionPackOptions | undefined
  ): Promise<Array<TransactionObject>> {
    if (aggregators.length === 0) {
      throw new Error(`No aggregator accounts provided`);
    }
    const program = aggregators[0].program;

    const txns: Array<TransactionObject> = [];
    let wrapAmount = 0;

    for (const aggregator of aggregators) {
      const [depositTxn, depositAmount] = await aggregator.fundUpToInstruction(
        payer,
        fundUpTo,
        true
      );
      if (depositTxn && depositAmount) {
        txns.push(depositTxn);
        wrapAmount = wrapAmount + depositAmount;
      }
    }

    const [_, wrapTxn] = await program.mint.getOrCreateWrappedUserInstructions(
      payer,
      {
        fundUpTo: wrapAmount,
      }
    );
    if (wrapTxn) {
      txns.unshift(wrapTxn);
    }

    return TransactionObject.pack(txns, options);
  }

  /** Fund multiple aggregator account lease's up to a given balance */
  public static async fundMultipleUpTo(
    fundUpTo: number,
    aggregators: Array<AggregatorAccount>,
    options?: TransactionPackOptions | undefined
  ): Promise<Array<TransactionSignature>> {
    if (aggregators.length === 0) {
      throw new Error(`No aggregator accounts provided`);
    }
    const program = aggregators[0].program;

    const txns = await AggregatorAccount.fundMultipleUpToInstructions(
      program.walletPubkey,
      fundUpTo,
      aggregators,
      options
    );
    const txnSignatures = await program.signAndSendAll(txns);
    return txnSignatures;
  }

  public async closeInstructions(
    payer: PublicKey,
    params?: {
      authority?: Keypair;
      tokenWallet?: PublicKey;
    },
    opts?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    if (this.program.cluster === "mainnet-beta") {
      throw new Error(
        `Aggregators can only be closed with the devnet version of Switchboard`
      );
    }
    const [tokenWallet, tokenWalletInit] = params?.tokenWallet
      ? [params.tokenWallet, undefined]
      : await this.program.mint.getOrCreateWrappedUserInstructions(payer, {
          fundUpTo: 0,
        });

    const aggregator = await this.loadData();
    const [queueAccount, queue] = await QueueAccount.load(
      this.program,
      aggregator.queuePubkey
    );

    const slidingWindowKey = this.slidingWindowKey;
    const slidingWindowAccountInfo =
      await this.program.connection.getAccountInfo(slidingWindowKey);

    const {
      permissionAccount,
      permissionBump,
      leaseAccount,
      leaseBump,
      leaseEscrow,
    } = this.getAccounts(queueAccount, queue.authority);

    const crankPubkey: PublicKey | null = aggregator.crankPubkey.equals(
      PublicKey.default
    )
      ? null
      : aggregator.crankPubkey;
    let dataBuffer: PublicKey | null = null;
    if (crankPubkey !== null) {
      const [crankAccount, crank] = await CrankAccount.load(
        this.program,
        crankPubkey
      );
      dataBuffer = crank.dataBuffer;
    }

    const accounts = {
      authority: aggregator.authority,
      aggregator: this.publicKey,
      permission: permissionAccount.publicKey,
      lease: leaseAccount.publicKey,
      escrow: leaseEscrow,
      oracleQueue: queueAccount.publicKey,
      queueAuthority: queue.authority,
      programState: queueAccount.program.programState.publicKey,
      solDest: payer,
      escrowDest: tokenWallet,
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    if (crankPubkey !== null && dataBuffer !== null) {
      accounts["crank"] = crankPubkey;
      accounts["dataBuffer"] = dataBuffer;
    } else {
      accounts["crank"] = null;
      accounts["dataBuffer"] = null;
    }

    if (slidingWindowAccountInfo !== null) {
      accounts["slidingWindow"] = slidingWindowKey;
    } else {
      accounts["slidingWindow"] = null;
    }

    const closeIxn = await (
      (this.program as any)._program as anchor.Program
    ).methods
      .aggregatorClose({
        stateBump: this.program.programState.bump,
        permissionBump: permissionBump,
        leaseBump: leaseBump,
      })
      .accounts(
        accounts as any // compiler expects all types to be pubkeys
      )
      .instruction();

    const closeTxn = tokenWalletInit
      ? tokenWalletInit.add(
          closeIxn,
          params?.authority ? [params.authority] : undefined
        )
      : new TransactionObject(
          payer,
          [closeIxn],
          params?.authority ? [params.authority] : []
        );

    // add txn options
    return new TransactionObject(
      closeTxn.payer,
      closeTxn.ixns,
      closeTxn.signers,
      opts
    );
  }

  public async close(
    params?: {
      authority?: Keypair;
      tokenWallet?: PublicKey;
    },
    opts?: TransactionObjectOptions
  ): Promise<TransactionSignature> {
    const closeTxn = await this.closeInstructions(
      this.program.walletPubkey,
      params,
      opts
    );
    const txnSignature = await this.program.signAndSend(closeTxn);
    return txnSignature;
  }
}

/**
 * Parameters to initialize an aggregator account.
 */
export interface AggregatorInitParams {
  /**
   *  Name of the aggregator to store on-chain.
   */
  name?: string;
  /**
   *  Metadata of the aggregator to store on-chain.
   */
  metadata?: string;
  /**
   *  Number of oracles to request on aggregator update.
   */
  batchSize: number;
  /**
   *  Minimum number of oracle responses required before a round is validated.
   */
  minRequiredOracleResults: number;
  /**
   *  Minimum number of feed jobs suggested to be successful before an oracle
   *  sends a response.
   */
  minRequiredJobResults: number;
  /**
   *  Minimum number of seconds required between aggregator rounds.
   */
  minUpdateDelaySeconds: number;
  /**
   *  unix_timestamp for which no feed update will occur before.
   */
  startAfter?: number;
  /**
   *  Change percentage required between a previous round and the current round.
   *  If variance percentage is not met, reject new oracle responses.
   */
  varianceThreshold?: number;
  /**
   *  Number of seconds for which, even if the variance threshold is not passed,
   *  accept new responses from oracles.
   */
  forceReportPeriod?: number;
  /**
   *  unix_timestamp after which funds may be withdrawn from the aggregator.
   *  null/undefined/0 means the feed has no expiration.
   */
  expiration?: number;
  /**
   *  If true, this aggregator is disallowed from being updated by a crank on the queue.
   */
  disableCrank?: boolean;
  /**
   *  Optional pre-existing keypair to use for aggregator initialization.
   */
  keypair?: Keypair;
  /**
   *  If included, this keypair will be the aggregator authority rather than
   *  the aggregator keypair.
   */
  authority?: PublicKey;
  /**
   *  The queue to which this aggregator will be linked
   */
  queueAccount: QueueAccount;
  /**
   * The authority of the queue.
   */
  queueAuthority: PublicKey;
}

export interface AggregatorSetQueueParams {
  queueAccount: QueueAccount;
  authority?: Keypair;
}

/**
 * Parameters required to open an aggregator round
 */
export interface AggregatorOpenRoundParams {
  /**
   *  The oracle queue from which oracles are assigned this update.
   */
  oracleQueueAccount: QueueAccount;
  /**
   *  The token wallet which will receive rewards for calling update on this feed.
   */
  payoutWallet: PublicKey;
}

/**
 * Parameters for creating and setting a history buffer for an aggregator
 */
export interface AggregatorSetHistoryBufferParams {
  /**
   * Authority keypair for the aggregator.
   */
  authority?: Keypair;
  /**
   * Number of elements for the history buffer to fit.
   */
  size: number;
}

/**
 * Parameters for which oracles must submit for responding to update requests.
 */
export interface AggregatorSaveResultParams {
  /**
   *  Index in the list of oracles in the aggregator assigned to this round update.
   */
  oracleIdx: number;
  /**
   *  Reports that an error occured and the oracle could not send a value.
   */
  error: boolean;
  /**
   *  Value the oracle is responding with for this update.
   */
  value: Big;
  /**
   *  The minimum value this oracle has seen this round for the jobs listed in the
   *  aggregator.
   */
  minResponse: Big;
  /**
   *  The maximum value this oracle has seen this round for the jobs listed in the
   *  aggregator.
   */
  maxResponse: Big;
  /**
   *  List of OracleJobs that were performed to produce this result.
   */
  jobs: Array<OracleJob>;
  /**
   *  Authority of the queue the aggregator is attached to.
   */
  queueAuthority: PublicKey;
  /**
   *  Program token mint.
   */
  tokenMint: PublicKey;
  /**
   *  List of parsed oracles.
   */
  oracles: Array<OracleAccountData>;
}

export type AggregatorAccountsJSON = AggregatorAccountDataJSON & {
  publicKey: PublicKey;
  queue: OracleQueueAccountDataJSON & { publicKey: PublicKey };
  permission: PermissionAccountDataJSON & {
    bump: number;
    publicKey: PublicKey;
  };
  lease: LeaseAccountDataJSON & { bump: number; publicKey: PublicKey } & {
    balance: number;
  };
  jobs: Array<
    JobAccountDataJSON & {
      publicKey: PublicKey;
      tasks: Array<OracleJob.ITask>;
    }
  >;
};
export type AggregatorAccounts = {
  aggregator: {
    publicKey: PublicKey;
    data: AggregatorAccountData;
  };
  queue: {
    publicKey: PublicKey;
    data: OracleQueueAccountData;
  };
  permission: {
    publicKey: PublicKey;
    bump: number;
    data: PermissionAccountData;
  };
  lease: {
    publicKey: PublicKey;
    bump: number;
    balance: number;
    data: LeaseAccountData;
  };
  jobs: Array<{
    publicKey: PublicKey;
    data: JobAccountData;
    tasks: Array<OracleJob.ITask>;
  }>;
};

export type AggregatorPdaAccounts = {
  permissionAccount: PermissionAccount;
  permissionBump: number;
  leaseAccount: LeaseAccount;
  leaseBump: number;
  leaseEscrow: PublicKey;
};

export type SaveResultResponse = {
  jobs: Array<OracleJob>;
  // oracleAccount: OracleAccount;
  value: Big;
  minResponse: Big;
  maxResponse: Big;
  error?: boolean;
};

export type SaveResultAccounts = AggregatorPdaAccounts & {
  aggregator: AggregatorAccountData;
  // queue
  queueAccount: QueueAccount;
  queueAuthority: PublicKey;
  // oracle
  oraclePermission: [PermissionAccount, number];
  oracles: Array<{ account: OracleAccount; state: OracleAccountData }>;
  oracleIdx: number;
  // history
  historyBuffer?: PublicKey;
};

export type AggregatorSaveResultSyncParams = SaveResultResponse &
  SaveResultAccounts;
export type AggregatorSaveResultAsyncParams = SaveResultResponse &
  (Partial<SaveResultAccounts> & { oracleAccount: OracleAccount });
