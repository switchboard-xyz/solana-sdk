import * as types from '../generated';
import * as anchor from '@project-serum/anchor';
import { Account, OnAccountChangeCallback } from './account';
import * as errors from '../errors';
import Big from 'big.js';
import { SwitchboardProgram } from '../program';
import {
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

export class AggregatorAccount extends Account<types.AggregatorAccountData> {
  static accountName = 'AggregatorAccountData';

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

  /**
   * Retrieve and decode the {@linkcode types.AggregatorAccountData} stored in this account.
   */
  public async loadData(): Promise<types.AggregatorAccountData> {
    const data = await types.AggregatorAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }

  public static async load(
    program: SwitchboardProgram,
    publicKey: PublicKey
  ): Promise<AggregatorAccount> {
    const account = new AggregatorAccount(program, publicKey);
    await account.loadData();
    return account;
  }

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

  public onChange(
    callback: OnAccountChangeCallback<types.AggregatorAccountData>
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => {
        callback(this.decode(accountInfo.data));
      }
    );
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: {
      queueAccount: QueueAccount;
      queueAuthority: PublicKey;
      batchSize: number;
      minRequiredOracleResults: number;
      minRequiredJobResults: number;
      minUpdateDelaySeconds: number;
    } & Partial<{
      name: string;
      metadata: string;
      startAfter: number;
      varianceThreshold: number;
      forceReportPeriod: number;
      expiration: number;
      disableCrank: boolean;
      authorWallet: PublicKey;
      authority?: PublicKey;
      keypair?: Keypair;
    }>
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

    return [
      new TransactionObject(payer, ixns, signers),
      new AggregatorAccount(program, keypair.publicKey),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: {
      queueAccount: QueueAccount;
      queueAuthority: PublicKey;
      batchSize: number;
      minRequiredOracleResults: number;
      minRequiredJobResults: number;
      minUpdateDelaySeconds: number;
    } & Partial<{
      name: string;
      metadata: string;
      startAfter: number;
      varianceThreshold: number;
      forceReportPeriod: number;
      expiration: number;
      disableCrank: boolean;
      authorWallet: PublicKey;
      authority?: PublicKey;
      keypair: Keypair;
    }>
  ): Promise<[TransactionSignature, AggregatorAccount]> {
    const [transaction, account] = await AggregatorAccount.createInstruction(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(transaction);
    return [txnSignature, account];
  }

  public static decodeHistory(
    historyBuffer: Buffer
  ): Array<types.AggregatorHistoryRow> {
    const ROW_SIZE = 28;

    if (historyBuffer.length < 12) {
      return [];
    }

    const insertIdx = historyBuffer.readUInt32LE(8) * ROW_SIZE;
    const front: Array<types.AggregatorHistoryRow> = [];
    const tail: Array<types.AggregatorHistoryRow> = [];
    for (let i = 12; i < historyBuffer.length; i += ROW_SIZE) {
      if (i + ROW_SIZE > historyBuffer.length) {
        break;
      }
      const row = types.AggregatorHistoryRow.fromDecoded(
        types.AggregatorHistoryRow.layout().decode(historyBuffer, i)
      );
      if (row.timestamp.eq(new anchor.BN(0))) {
        break;
      }
      if (i <= insertIdx) {
        tail.push(row);
      } else {
        front.push(row);
      }
    }
    return front.concat(tail);
  }

  public async loadHistory(
    aggregator: types.AggregatorAccountData
  ): Promise<Array<types.AggregatorHistoryRow>> {
    if (PublicKey.default.equals(aggregator.historyBuffer)) {
      return [];
    }
    const historyBuffer =
      (await this.program.connection.getAccountInfo(aggregator.historyBuffer))
        ?.data ?? Buffer.from('');
    return AggregatorAccount.decodeHistory(historyBuffer);
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
   * @return latest feed value
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

  // decodeOracleIndex(aggregator: types.AggregatorAccountData): number {
  //   throw new Error('Not implemented yet');
  // }

  // shouldReportValue(
  //   value: Big,
  //   aggregator: types.AggregatorAccountData
  // ): boolean {
  //   throw new Error('Not implemented yet');
  // }

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
    }>
  ): Promise<TransactionSignature> {
    const setConfigTxn = this.setConfigInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(setConfigTxn);
    return txnSignature;
  }

  static getHistoryBufferSize(samples: number): number {
    return 8 + 4 + samples * 28;
  }

  public async setHistoryBufferInstruction(
    payer: PublicKey,
    params: {
      size: number;
      authority?: Keypair;
      buffer?: Keypair;
    }
  ): Promise<TransactionObject> {
    const buffer = params.buffer ?? Keypair.generate();
    const ixns: TransactionInstruction[] = [];
    const signers: Keypair[] = params.authority
      ? [params.authority, buffer]
      : [buffer];

    const size = AggregatorAccount.getHistoryBufferSize(params.size);

    ixns.push(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: buffer.publicKey,
        space: size,
        lamports:
          await this.program.connection.getMinimumBalanceForRentExemption(size),
        programId: this.program.programId,
      }),
      types.aggregatorSetHistoryBuffer(
        this.program,
        { params: {} },
        {
          aggregator: this.publicKey,
          authority: params.authority ? params.authority.publicKey : payer,
          buffer: buffer.publicKey,
        }
      )
    );

    return new TransactionObject(payer, ixns, signers);
  }

  public async setHistoryBuffer(params: {
    size: number;
    authority?: Keypair;
    buffer?: Keypair;
  }): Promise<TransactionSignature> {
    const setHistoryTxn = await this.setHistoryBufferInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(setHistoryTxn);
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

  public openRoundInstruction(
    payer: PublicKey,
    params: {
      queueAccount: QueueAccount;
      queueAuthority: PublicKey;
      queueDataBuffer: PublicKey;
      mint: PublicKey;
      payoutWallet: PublicKey;
      lease: [LeaseAccount, number];
      leaseEscrow: PublicKey;
      permission: [PermissionAccount, number];
    }
  ): TransactionInstruction {
    const [leaseAccount, leaseBump] = params.lease;
    const [permissionAccount, permissionBump] = params.permission;

    return types.aggregatorOpenRound(
      this.program,
      {
        params: {
          stateBump: this.program.programState.bump,
          leaseBump: leaseBump,
          permissionBump: permissionBump,
          jitter: 0, // what is this for?
        },
      },
      {
        aggregator: this.publicKey,
        lease: leaseAccount.publicKey,
        oracleQueue: params.queueAccount.publicKey,
        queueAuthority: params.queueAuthority,
        permission: permissionAccount.publicKey,
        escrow: params.leaseEscrow,
        programState: this.program.programState.publicKey,
        payoutWallet: params.payoutWallet,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        dataBuffer: params.queueDataBuffer,
        mint: params.mint,
      }
    );
  }

  public async openRound(
    params: Partial<{
      aggregator: types.AggregatorAccountData;
      queueAccount: QueueAccount;
      queueAuthority: PublicKey;
      queueDataBuffer: PublicKey;
      mint: PublicKey;
      payoutWallet: PublicKey;
      lease: [LeaseAccount, number];
      leaseEscrow: PublicKey;
      permission: [PermissionAccount, number];
    }>
  ): Promise<TransactionSignature> {
    const payer = this.program.walletPubkey;
    const aggregator = params.aggregator ?? (await this.loadData());
    const queueAccount =
      params.queueAccount ??
      new QueueAccount(this.program, aggregator.queuePubkey);

    let queueAuthority = params.queueAuthority;
    let queueDataBuffer = params.queueDataBuffer;
    let mint = params.mint;
    if (!queueAuthority || !queueDataBuffer || !mint) {
      const queue = await queueAccount.loadData();
      queueAuthority = queue.authority;
      queueDataBuffer = queue.dataBuffer;
      mint = mint ?? queue.mint ?? spl.NATIVE_MINT;
    }

    const [leaseAccount, leaseBump] =
      params.lease ??
      LeaseAccount.fromSeed(
        this.program,
        queueAccount.publicKey,
        this.publicKey
      );
    try {
      await leaseAccount.loadData();
    } catch (_) {
      throw new Error(
        'A requested lease pda account has not been initialized.'
      );
    }
    const leaseEscrow = spl.getAssociatedTokenAddressSync(
      mint,
      leaseAccount.publicKey,
      true
    );

    const [permissionAccount, permissionBump] =
      params.permission ??
      PermissionAccount.fromSeed(
        this.program,
        queueAuthority,
        queueAccount.publicKey,
        this.publicKey
      );
    try {
      await permissionAccount.loadData();
    } catch (_) {
      throw new Error(
        'A requested aggregator permission pda account has not been initialized.'
      );
    }

    const preInstructions: Array<TransactionInstruction> = [];

    const payoutWallet = spl.getAssociatedTokenAddressSync(mint, payer, true);
    try {
      await spl.getAccount(this.program.connection, payoutWallet);
    } catch (error) {
      // TODO: Catch error and make sure it matches account doesnt exist
      preInstructions.push(
        spl.createAssociatedTokenAccountInstruction(
          payer,
          payoutWallet,
          payer,
          mint
        )
      );
    }

    return await this.program.signAndSendTransaction([
      ...preInstructions,
      this.openRoundInstruction(this.program.walletPubkey, {
        queueAccount,
        queueAuthority,
        queueDataBuffer,
        mint,
        lease: [leaseAccount, leaseBump],
        permission: [permissionAccount, permissionBump],
        payoutWallet: payoutWallet,
        leaseEscrow: leaseEscrow,
      }),
    ]);
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
    }>
  ): Promise<TransactionSignature> {
    const payer = this.program.walletPubkey;
    const aggregator = params.aggregator ?? (await this.loadData());

    const oracleIdx =
      params.oracleIdx ??
      aggregator.currentRound.oraclePubkeysData
        .slice(0, aggregator.oracleRequestBatchSize)
        .findIndex(o => o.equals(params.oracleAccount.publicKey));

    if (oracleIdx < 0) {
      throw new Error('Failed to find oracle in current round');
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

    const [leaseAccount, leaseBump] =
      params.lease ??
      LeaseAccount.fromSeed(
        this.program,
        queueAccount.publicKey,
        this.publicKey
      );
    try {
      await leaseAccount.loadData();
    } catch (_) {
      throw new Error(
        'A requested lease pda account has not been initialized.'
      );
    }
    const leaseEscrow = spl.getAssociatedTokenAddressSync(
      mint,
      leaseAccount.publicKey,
      true
    );

    const [feedPermissionAccount, feedPermissionBump] =
      params.feedPermission ??
      PermissionAccount.fromSeed(
        this.program,
        queueAuthority,
        queueAccount.publicKey,
        this.publicKey
      );
    try {
      await feedPermissionAccount.loadData();
    } catch (_) {
      throw new Error(
        'A requested aggregator permission pda account has not been initialized.'
      );
    }

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

    const preInstructions: Array<TransactionInstruction> = [];

    const payoutWallet = spl.getAssociatedTokenAddressSync(mint, payer, true);
    try {
      await spl.getAccount(this.program.connection, payoutWallet);
    } catch (error) {
      // TODO: Catch error and make sure it matches account doesnt exist
      preInstructions.push(
        spl.createAssociatedTokenAccountInstruction(
          payer,
          payoutWallet,
          payer,
          mint
        )
      );
    }

    const historyBuffer = params.historyBuffer ?? aggregator.historyBuffer;

    // TODO: Add SlidingWindow account to remainingAccounts

    return await this.program.signAndSendTransaction([
      ...preInstructions,
      this.saveResultInstruction({
        queueAccount,
        queueAuthority,
        feedPermission: [feedPermissionAccount, feedPermissionBump],
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
      }),
    ]);
  }
}
