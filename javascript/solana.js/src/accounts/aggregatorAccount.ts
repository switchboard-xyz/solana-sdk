import * as types from '../generated';
import * as anchor from '@project-serum/anchor';
import { Account, OnAccountChangeCallback } from './account';
import * as errors from '../errors';
import Big from 'big.js';
import { SwitchboardProgram } from '../program';
import {
  AccountInfo,
  AccountMeta,
  Commitment,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { OracleAccount } from './oracleAccount';
import { OracleJob } from '@switchboard-xyz/common';
import crypto from 'crypto';
import { JobAccount } from './jobAccount';
import { QueueAccount } from './queueAccount';
import { LeaseAccount } from './leaseAccount';
import { PermissionAccount } from './permissionAccount';
import * as spl from '@solana/spl-token';
import { TransactionObject } from '../transaction';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AggregatorHistoryBuffer } from './aggregatorHistoryBuffer';

/**
 * Account type holding a data feed's update configuration, job accounts, and its current result.
 *
 * Data: {@linkcode types.AggregatorAccountData}
 * HistoryBuffer?: Array<{@linkcode types.AggregatorHistoryRow}>
 *
 * An aggregator account belongs to a single {@linkcode QueueAccount} but can later be transferred by the aggregator's authority. In order for an {@linkcode OracleAccount} to respond to an aggregator's update request, the aggregator must initialize a {@linkcode PermissionAccount} and {@linkcode LeaseAccount}. These will need to be recreated when transferring queues.
 *
 * Optionally, An aggregator can be pushed onto a {@linkcode CrankAccount} in order to be updated
 *
 * Optionally, an aggregator can add a history buffer to store the last N historical samples along with their update timestamp.
 */
export class AggregatorAccount extends Account<types.AggregatorAccountData> {
  static accountName = 'AggregatorAccountData';

  public history?: AggregatorHistoryBuffer;

  /**
   * Returns the aggregator's name buffer in a stringified format.
   */
  public static getName = (aggregator: types.AggregatorAccountData) =>
    Buffer.from(aggregator.name).toString('utf8').replace(/u0000/g, '');

  /**
   * Returns the aggregator's metadata buffer in a stringified format.
   */
  public static getMetadata = (aggregator: types.AggregatorAccountData) =>
    Buffer.from(aggregator.metadata).toString('utf8').replace(/u0000/g, '');

  /**
   * Get the size of an {@linkcode AggregatorAccount} on-chain.
   */
  public size = this.program.account.aggregatorAccountData.size;

  public decode(data: Buffer): types.AggregatorAccountData {
    try {
      return types.AggregatorAccountData.decode(data);
    } catch {
      return this.program.coder.decode<types.AggregatorAccountData>(
        AggregatorAccount.accountName,
        data
      );
    }
  }

  /**
   * Invoke a callback each time an AggregatorAccount's data has changed on-chain.
   * @param callback - the callback invoked when the aggregator state changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  public onChange(
    callback: OnAccountChangeCallback<types.AggregatorAccountData>,
    commitment: Commitment = 'confirmed'
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => {
        callback(this.decode(accountInfo.data));
      },
      commitment
    );
  }

  /**
   * Retrieve and decode the {@linkcode types.AggregatorAccountData} stored in this account.
   */
  public async loadData(): Promise<types.AggregatorAccountData> {
    const data = await types.AggregatorAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    this.history = AggregatorHistoryBuffer.fromAggregator(this.program, data);
    return data;
  }

  public static async load(
    program: SwitchboardProgram,
    publicKey: PublicKey
  ): Promise<[AggregatorAccount, types.AggregatorAccountData]> {
    const account = new AggregatorAccount(program, publicKey);
    const aggregator = await account.loadData();
    return [account, aggregator];
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
   * const [aggregatorInit, aggregatorAccount] = await AggregatorAccount.createInstruction(program, payer, {
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
    params: AggregatorInitParams
  ): Promise<[TransactionObject, AggregatorAccount]> {
    const keypair = params.keypair ?? Keypair.generate();

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
      types.aggregatorInit(
        program,
        {
          params: {
            name: [...Buffer.from(params.name ?? '', 'utf8').slice(0, 32)],
            metadata: [
              ...Buffer.from(params.metadata ?? '', 'utf8').slice(0, 128),
            ],
            batchSize: params.batchSize,
            minOracleResults: params.minRequiredOracleResults,
            minJobResults: params.minRequiredJobResults,
            minUpdateDelaySeconds: params.minUpdateDelaySeconds,
            startAfter: new anchor.BN(params.startAfter ?? 0),
            varianceThreshold: types.SwitchboardDecimal.fromBig(
              new Big(params.varianceThreshold ?? 0)
            ).borsh,
            forceReportPeriod: new anchor.BN(params.forceReportPeriod ?? 0),
            expiration: new anchor.BN(params.expiration ?? 0),
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

    const aggregatorInit = new TransactionObject(payer, ixns, signers);
    const aggregatorAccount = new AggregatorAccount(program, keypair.publicKey);

    return [aggregatorInit, aggregatorAccount];
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
   * const [txnSignature, aggregatorAccount] = await AggregatorAccount(program, {
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
    params: AggregatorInitParams
  ): Promise<[TransactionSignature, AggregatorAccount]> {
    const [transaction, account] = await AggregatorAccount.createInstruction(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(transaction);
    return [txnSignature, account];
  }

  public getAccounts(params: {
    queueAccount: QueueAccount;
    queueAuthority: PublicKey;
  }): {
    queueAccount: QueueAccount;
    permissionAccount: PermissionAccount;
    permissionBump: number;
    leaseAccount: LeaseAccount;
    leaseBump: number;
    leaseEscrow: PublicKey;
  } {
    const queueAccount = params.queueAccount;

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      params.queueAuthority,
      queueAccount.publicKey,
      this.publicKey
    );

    const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
      this.program,
      queueAccount.publicKey,
      this.publicKey
    );

    const leaseEscrow = this.program.mint.getAssociatedAddress(
      leaseAccount.publicKey
    );

    return {
      queueAccount,
      permissionAccount,
      permissionBump,
      leaseAccount,
      leaseBump,
      leaseEscrow,
    };
  }

  /**
   * Get the latest confirmed value stored in the aggregator account.
   * @param aggregator Optional parameter representing the already loaded
   * aggregator info.
   * @return latest feed value
   */
  public static decodeLatestValue(
    aggregator: types.AggregatorAccountData
  ): Big | null {
    if ((aggregator.latestConfirmedRound?.numSuccess ?? 0) === 0) {
      return null;
    }
    const result = aggregator.latestConfirmedRound.result.toBig();
    return result;
  }

  /**
   * Get the latest confirmed value stored in the aggregator account.
   * @return latest feed value or null if not populated
   */
  public async fetchLatestValue(): Promise<Big | null> {
    const aggregator = await this.loadData();
    return AggregatorAccount.decodeLatestValue(aggregator);
  }

  /**
   * Get the timestamp latest confirmed round stored in the aggregator account.
   * @param aggregator Optional parameter representing the already loaded
   * aggregator info.
   * @return latest feed timestamp
   */
  public static decodeLatestTimestamp(
    aggregator: types.AggregatorAccountData
  ): anchor.BN {
    if ((aggregator.latestConfirmedRound?.numSuccess ?? 0) === 0) {
      throw new Error('Aggregator currently holds no value.');
    }
    return aggregator.latestConfirmedRound.roundOpenTimestamp;
  }

  public static decodeConfirmedRoundResults(
    aggregator: types.AggregatorAccountData
  ): Array<{ oraclePubkeys: PublicKey; value: Big }> {
    if ((aggregator.latestConfirmedRound?.numSuccess ?? 0) === 0) {
      throw new Error('Aggregator currently holds no value.');
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
   * Get the individual oracle results of the latest confirmed round.
   * @param aggregator Optional parameter representing the already loaded
   * aggregator info.
   * @return latest results by oracle pubkey
   */
  public getConfirmedRoundResults(
    aggregator: types.AggregatorAccountData
  ): Array<{ oracleAccount: OracleAccount; value: Big }> {
    return AggregatorAccount.decodeConfirmedRoundResults(aggregator).map(o => {
      return {
        oracleAccount: new OracleAccount(this.program, o.oraclePubkeys),
        value: o.value,
      };
    });
  }

  /**
   * Produces a hash of all the jobs currently in the aggregator
   * @return hash of all the feed jobs.
   */
  public produceJobsHash(jobs: Array<OracleJob>): crypto.Hash {
    const hash = crypto.createHash('sha256');
    for (const job of jobs) {
      const jobHasher = crypto.createHash('sha256');
      jobHasher.update(OracleJob.encodeDelimited(job).finish());
      hash.update(jobHasher.digest());
    }
    return hash;
  }

  public static decodeCurrentRoundOracles(
    aggregator: types.AggregatorAccountData
  ): Array<PublicKey> {
    return aggregator.currentRound.oraclePubkeysData.slice(
      0,
      aggregator.oracleRequestBatchSize
    );
  }

  public async loadCurrentRoundOracles(
    aggregator: types.AggregatorAccountData
  ): Promise<
    Array<{ account: OracleAccount; state: types.OracleAccountData }>
  > {
    return await Promise.all(
      AggregatorAccount.decodeCurrentRoundOracles(aggregator).map(async o => {
        const oracleAccount = new OracleAccount(this.program, o);
        return {
          account: oracleAccount,
          state: await oracleAccount.loadData(),
        };
      })
    );
  }

  public static decodeJobPubkeys(
    aggregator: types.AggregatorAccountData
  ): Array<PublicKey> {
    return aggregator.jobPubkeysData.slice(0, aggregator.jobPubkeysSize);
  }

  public async loadJobs(
    aggregator: types.AggregatorAccountData
  ): Promise<
    Array<{ account: JobAccount; state: types.JobAccountData; job: OracleJob }>
  > {
    const jobAccountDatas = await anchor.utils.rpc.getMultipleAccounts(
      this.program.connection,
      AggregatorAccount.decodeJobPubkeys(aggregator)
    );

    return await Promise.all(
      jobAccountDatas.map(async j => {
        if (!j?.account) {
          throw new Error(
            `Failed to fetch account data for job ${j?.publicKey}`
          );
        }
        const jobAccount = new JobAccount(this.program, j.publicKey);
        const jobState: types.JobAccountData = this.program.coder.decode(
          'JobAccountData',
          j.account.data
        );
        return {
          account: jobAccount,
          state: jobState,
          job: OracleJob.decodeDelimited(jobState.data),
        };
      })
    );
  }

  public getJobHashes(
    jobs: Array<{
      account: JobAccount;
      state: types.JobAccountData;
    }>
  ): Array<Buffer> {
    return jobs.map(j => Buffer.from(new Uint8Array(j.state.hash)));
  }

  public setConfigInstruction(
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
      authority?: Keypair;
      basePriorityFee?: number;
      priorityFeeBump?: number;
      priorityFeeBumpPeriod?: number;
      maxPriorityFeeMultiplier?: number;
    }>
  ): TransactionObject {
    const setConfigIxn = types.aggregatorSetConfig(
      this.program,
      {
        params: {
          name: params.name
            ? ([
                ...Buffer.from(params.name, 'utf-8').slice(0, 32),
              ] as Array<number>)
            : null,
          metadata: params.metadata
            ? ([
                ...Buffer.from(params.metadata, 'utf-8').slice(0, 128),
              ] as Array<number>)
            : null,
          batchSize: params.batchSize ?? null,
          minOracleResults: params.minOracleResults ?? null,
          minUpdateDelaySeconds: params.minUpdateDelaySeconds ?? null,
          minJobResults: params.minJobResults ?? null,
          forceReportPeriod: params.forceReportPeriod ?? null,
          varianceThreshold:
            params.varianceThreshold && params.varianceThreshold >= 0
              ? new types.BorshDecimal(
                  types.SwitchboardDecimal.fromBig(
                    new Big(params.varianceThreshold)
                  )
                )
              : null,
          basePriorityFee: params.basePriorityFee ?? 0,
          priorityFeeBump: params.priorityFeeBump ?? 0,
          priorityFeeBumpPeriod: params.priorityFeeBumpPeriod ?? 0,
          maxPriorityFeeMultiplier: params.maxPriorityFeeMultiplier ?? 0,
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
      params.authority ? [params.authority] : []
    );
  }

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
    }>
  ): Promise<TransactionSignature> {
    const setConfigTxn = this.setConfigInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(setConfigTxn);
    return txnSignature;
  }

  public setQueueInstruction(
    payer: PublicKey,
    params: {
      queueAccount: QueueAccount;
      authority?: Keypair;
    }
  ): TransactionObject {
    const setQueueIxn = types.aggregatorSetQueue(
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
      params.authority ? [params.authority] : []
    );
  }

  public async setQueue(params: {
    queueAccount: QueueAccount;
    authority?: Keypair;
  }): Promise<TransactionSignature> {
    const setQueueTxn = this.setQueueInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(setQueueTxn);
    return txnSignature;
  }

  public addJobInstruction(
    payer: PublicKey,
    params: {
      job: JobAccount;
      weight?: number;
      authority?: Keypair;
    }
  ): TransactionObject {
    const authority = params.authority ? params.authority.publicKey : payer;
    const addJobIxn = types.aggregatorAddJob(
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
      params.authority ? [params.authority] : []
    );
  }

  public async addJob(params: {
    job: JobAccount;
    weight?: number;
    authority?: Keypair;
  }): Promise<TransactionSignature> {
    const txn = this.addJobInstruction(this.program.walletPubkey, params);
    const txnSignature = await this.program.signAndSend(txn);
    return txnSignature;
  }

  public lockInstruction(
    payer: PublicKey,
    params: {
      authority?: Keypair;
    }
  ): TransactionObject {
    return new TransactionObject(
      payer,
      [
        types.aggregatorLock(
          this.program,
          { params: {} },
          {
            aggregator: this.publicKey,
            authority: params.authority ? params.authority.publicKey : payer,
          }
        ),
      ],
      params.authority ? [params.authority] : []
    );
  }

  public async lock(params: {
    authority?: Keypair;
  }): Promise<TransactionSignature> {
    const lockTxn = this.lockInstruction(this.program.walletPubkey, params);
    const txnSignature = await this.program.signAndSend(lockTxn);
    return txnSignature;
  }

  public setAuthorityInstruction(
    payer: PublicKey,
    params: {
      newAuthority: PublicKey;
      authority?: Keypair;
    }
  ): TransactionObject {
    return new TransactionObject(
      payer,
      [
        types.aggregatorSetAuthority(
          this.program,
          { params: {} },
          {
            aggregator: this.publicKey,
            authority: params.authority ? params.authority.publicKey : payer,
            newAuthority: params.newAuthority,
          }
        ),
      ],
      params.authority ? [params.authority] : []
    );
  }

  public async setAuthority(params: {
    newAuthority: PublicKey;
    authority?: Keypair;
  }): Promise<TransactionSignature> {
    const setAuthorityTxn = this.setAuthorityInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(setAuthorityTxn);
    return txnSignature;
  }

  public removeJobInstruction(
    payer: PublicKey,
    params: {
      job: JobAccount;
      jobIdx: number;
      authority?: Keypair;
    }
  ): TransactionObject {
    const authority = params.authority ? params.authority.publicKey : payer;
    const removeJobIxn = types.aggregatorRemoveJob(
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
      params.authority ? [params.authority] : []
    );
  }

  public async removeJob(params: {
    job: JobAccount;
    jobIdx: number;
    authority?: Keypair;
  }): Promise<TransactionSignature> {
    const removeJobTxn = this.removeJobInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(removeJobTxn);
    return txnSignature;
  }

  public async openRoundInstruction(
    payer: PublicKey,
    params: Partial<{ payoutWallet: PublicKey }>
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
    } = this.getAccounts({
      queueAccount: queueAccount,
      queueAuthority: queue.authority,
    });

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
      types.aggregatorOpenRound(
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

    return new TransactionObject(payer, ixns, []);
  }

  public async openRound(
    params: Partial<{ payoutWallet: PublicKey }>
  ): Promise<TransactionSignature> {
    const openRoundTxn = await this.openRoundInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(openRoundTxn);
    return txnSignature;
  }

  public saveResultInstruction(
    params: {
      queueAccount: QueueAccount;
      queueAuthority: PublicKey;
      feedPermission: [PermissionAccount, number];
      jobs: Array<OracleJob>;
      // oracle
      oracleAccount: OracleAccount;
      oracleIdx: number;
      oraclePermission: [PermissionAccount, number];
      // response
      value: Big;
      minResponse: Big;
      maxResponse: Big;
      // token
      mint: PublicKey;
      payoutWallet: PublicKey;
      lease: [LeaseAccount, number];
      leaseEscrow: PublicKey;
    } & Partial<{
      error?: boolean;
      historyBuffer?: PublicKey;
      oracles: Array<types.OracleAccountData>;
    }>
  ): TransactionInstruction {
    const [leaseAccount, leaseBump] = params.lease;
    const [feedPermissionAccount, feedPermissionBump] = params.feedPermission;
    const [oraclePermissionAccount, oraclePermissionBump] =
      params.oraclePermission;

    if (params.oracleIdx < 0) {
      throw new Error('Failed to find oracle in current round');
    }

    return types.aggregatorSaveResult(
      this.program,
      {
        params: {
          oracleIdx: params.oracleIdx,
          error: params.error ?? false,
          value: types.SwitchboardDecimal.fromBig(params.value).borsh,
          jobsChecksum: [...this.produceJobsHash(params.jobs).digest()],
          minResponse: types.SwitchboardDecimal.fromBig(params.minResponse)
            .borsh,
          maxResponse: types.SwitchboardDecimal.fromBig(params.maxResponse)
            .borsh,
          feedPermissionBump: feedPermissionBump,
          oraclePermissionBump: oraclePermissionBump,
          leaseBump: leaseBump,
          stateBump: this.program.programState.bump,
        },
      },
      {
        aggregator: this.publicKey,
        oracle: params.oracleAccount.publicKey,
        oracleAuthority: params.queueAuthority,
        oracleQueue: params.queueAccount.publicKey,
        queueAuthority: params.queueAuthority,
        feedPermission: feedPermissionAccount.publicKey,
        oraclePermission: oraclePermissionAccount.publicKey,
        lease: leaseAccount.publicKey,
        escrow: params.leaseEscrow,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        programState: this.program.programState.publicKey,
        historyBuffer: params.historyBuffer ?? this.publicKey,
        mint: params.mint,
      }
    );
  }

  public async saveResult(
    params: {
      jobs: Array<OracleJob>;
      oracleAccount: OracleAccount;
      value: Big;
      minResponse: Big;
      maxResponse: Big;
    } & Partial<{
      queueAccount: QueueAccount;
      queueAuthority: PublicKey;
      aggregator: types.AggregatorAccountData;
      feedPermission: [PermissionAccount, number];
      historyBuffer: PublicKey;
      oracleIdx: number;
      oraclePermission: [PermissionAccount, number];
      error: boolean;
      mint: PublicKey;
      payoutWallet: PublicKey;
      lease: [LeaseAccount, number];
      leaseEscrow: PublicKey;
      oracles: Array<types.OracleAccountData>;
    }>
  ): Promise<TransactionSignature> {
    const payer = this.program.walletPubkey;
    const aggregator = params.aggregator ?? (await this.loadData());

    const remainingAccounts: Array<PublicKey> = [];
    for (let i = 0; i < aggregator.oracleRequestBatchSize; ++i) {
      remainingAccounts.push(aggregator.currentRound.oraclePubkeysData[i]);
    }
    for (const oracle of params?.oracles ??
      (await this.loadCurrentRoundOracles(aggregator)).map(a => a.state)) {
      remainingAccounts.push(oracle.tokenAccount);
    }
    remainingAccounts.push(
      anchor.utils.publicKey.findProgramAddressSync(
        [Buffer.from('SlidingResultAccountData'), this.publicKey.toBytes()],
        this.program.programId
      )[0]
    );

    const oracleIdx =
      params.oracleIdx ??
      aggregator.currentRound.oraclePubkeysData
        .slice(0, aggregator.oracleRequestBatchSize)
        .findIndex(o => o.equals(params.oracleAccount.publicKey));

    if (oracleIdx < 0) {
      throw new Error('Failed to find oracle in current round');
    }

    const ixns: Array<TransactionInstruction> = [];

    const payoutWallet =
      params.payoutWallet ?? this.program.mint.getAssociatedAddress(payer);
    const payoutWalletAccountInfo =
      await this.program.connection.getAccountInfo(payoutWallet);
    if (payoutWalletAccountInfo === null) {
      const [createTokenAccountTxn] =
        this.program.mint.createAssocatedUserInstruction(payer);
      ixns.push(...createTokenAccountTxn.ixns);
    }

    const queueAccount =
      params.queueAccount ??
      new QueueAccount(this.program, aggregator.queuePubkey);

    let queueAuthority = params.queueAuthority;
    let mint = params.mint;
    if (!queueAuthority || !mint) {
      const queue = await queueAccount.loadData();
      queueAuthority = queue.authority;
      mint = mint ?? queue.mint ?? spl.NATIVE_MINT;
    }

    const {
      permissionAccount,
      permissionBump,
      leaseAccount,
      leaseBump,
      leaseEscrow,
    } = this.getAccounts({
      queueAccount: queueAccount,
      queueAuthority: queueAuthority,
    });

    const [oraclePermissionAccount, oraclePermissionBump] =
      params.oraclePermission ??
      PermissionAccount.fromSeed(
        this.program,
        queueAuthority,
        queueAccount.publicKey,
        params.oracleAccount.publicKey
      );
    try {
      await oraclePermissionAccount.loadData();
    } catch (_) {
      throw new Error(
        'A requested oracle permission pda account has not been initialized.'
      );
    }

    const historyBuffer = params.historyBuffer ?? aggregator.historyBuffer;

    const saveResultIxn = this.saveResultInstruction({
      queueAccount,
      queueAuthority,
      feedPermission: [permissionAccount, permissionBump],
      jobs: params.jobs,
      historyBuffer: historyBuffer.equals(PublicKey.default)
        ? undefined
        : historyBuffer,
      oracleAccount: params.oracleAccount,
      oracleIdx,
      oraclePermission: [oraclePermissionAccount, oraclePermissionBump],
      value: params.value,
      minResponse: params.minResponse,
      maxResponse: params.maxResponse,
      error: params.error ?? false,
      mint,
      payoutWallet: payoutWallet,
      lease: [leaseAccount, leaseBump],
      leaseEscrow: leaseEscrow,
    });

    // add remaining accounts
    saveResultIxn.keys.push(
      ...remainingAccounts.map((pubkey): AccountMeta => {
        return { isSigner: false, isWritable: true, pubkey };
      })
    );

    ixns.push(saveResultIxn);
    const saveResultTxn = new TransactionObject(
      this.program.walletPubkey,
      ixns,
      []
    );
    const txnSignature = await this.program.signAndSend(saveResultTxn);
    return txnSignature;
  }

  public async loadAllAccounts(
    _aggregator?: types.AggregatorAccountData,
    _queueAccount?: QueueAccount,
    _queue?: types.OracleQueueAccountData
  ): Promise<
    types.AggregatorAccountDataJSON & {
      publicKey: PublicKey;
      queue: types.OracleQueueAccountDataJSON;
      permission: types.PermissionAccountDataJSON;
      lease: types.LeaseAccountDataJSON & { balance: number };
      jobs: Array<
        types.JobAccountDataJSON & {
          publicKey: PublicKey;
          tasks: Array<OracleJob.ITask>;
        }
      >;
    }
  > {
    const aggregator = _aggregator ?? (await this.loadData());
    const queueAccount =
      _queueAccount ?? new QueueAccount(this.program, aggregator.queuePubkey);
    const queue = _queue ?? (await queueAccount.loadData());

    const { permissionAccount, leaseAccount, leaseEscrow } = this.getAccounts({
      queueAccount,
      queueAuthority: queue.authority,
    });

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
      ]
    );

    const permissionAccountInfo = accountInfos.shift();
    if (!permissionAccountInfo || !permissionAccountInfo.account) {
      throw new Error(
        `PermissionAccount has not been created yet for this aggregator`
      );
    }
    const permission = types.PermissionAccountData.decode(
      permissionAccountInfo.account.data
    );

    const leaseAccountInfo = accountInfos.shift();
    if (!leaseAccountInfo || !leaseAccountInfo.account) {
      throw new Error(
        `LeaseAccount has not been created yet for this aggregator`
      );
    }
    const lease = types.LeaseAccountData.decode(leaseAccountInfo.account.data);

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

    const jobs: (types.JobAccountDataJSON & {
      publicKey: PublicKey;
      tasks: Array<OracleJob.ITask>;
    })[] = [];
    accountInfos.map(accountInfo => {
      if (!accountInfo || !accountInfo.account) {
        throw new Error(`Failed to fetch JobAccount`);
      }
      const job = types.JobAccountData.decode(accountInfo.account.data);
      const oracleJob = OracleJob.decodeDelimited(job.data);
      jobs.push({
        publicKey: accountInfo.publicKey,
        ...job.toJSON(),
        tasks: oracleJob.tasks,
      });
    });

    return {
      publicKey: this.publicKey,
      ...aggregator.toJSON(),
      queue: queue.toJSON(),
      permission: permission.toJSON(),
      lease: {
        ...lease.toJSON(),
        balance: this.program.mint.fromTokenAmount(leaseEscrowAccount.amount),
      },
      jobs: jobs,
    };
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

export type AggregatorSetConfigParams = Partial<{
  /**
   *  Name of the aggregator to store on-chain.
   */
  name: string;
  /**
   *  Metadata of the aggregator to store on-chain.
   */
  metadata: string;
  /**
   *  Number of oracles to request on aggregator update.
   */
  batchSize: number;
  /**
   *  Minimum number of oracle responses required before a round is validated.
   */
  minOracleResults: number;
  /**
   *  Minimum number of feed jobs suggested to be successful before an oracle
   *  sends a response.
   */
  minJobResults: number;
  /**
   *  Minimum number of seconds required between aggregator rounds.
   */
  minUpdateDelaySeconds: number;
  /**
   *  Number of seconds for which, even if the variance threshold is not passed,
   *  accept new responses from oracles.
   */
  forceReportPeriod: number;
  /**
   *  Change percentage required between a previous round and the current round.
   *  If variance percentage is not met, reject new oracle responses.
   */
  varianceThreshold: number;
}>;

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
  oracles: Array<types.OracleAccountData>;
}
