import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import {
  AccountInfo,
  Commitment,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';
import { SwitchboardDecimal } from '@switchboard-xyz/common';
import Big from 'big.js';
import * as errors from '../errors';
import * as types from '../generated';
import {
  PermitOracleHeartbeat,
  PermitOracleQueueUsage,
} from '../generated/types/SwitchboardPermission';
import { SwitchboardProgram } from '../program';
import { TransactionObject } from '../transaction';
import { Account, OnAccountChangeCallback } from './account';
import { AggregatorAccount, AggregatorInitParams } from './aggregatorAccount';
import { BufferRelayerAccount, BufferRelayerInit } from './bufferRelayAccount';
import { CrankAccount, CrankInitParams } from './crankAccount';
import { JobAccount, JobInitParams } from './jobAccount';
import { LeaseAccount } from './leaseAccount';
import { OracleAccount } from './oracleAccount';
import { PermissionAccount } from './permissionAccount';
import { VrfAccount, VrfInitParams } from './vrfAccount';

export class QueueAccount extends Account<types.OracleQueueAccountData> {
  static accountName = 'OracleQueueAccountData';

  /** The public key of the queue's data buffer storing a list of oracle's that are actively heartbeating */
  dataBuffer?: PublicKey;

  /**
   * Get the size of an {@linkcode QueueAccount} on-chain.
   */
  public readonly size = this.program.account.oracleQueueAccountData.size;

  /**
   * Returns the queue's name buffer in a stringified format.
   */
  public static getName = (queue: types.OracleQueueAccountData) =>
    Buffer.from(queue.name).toString('utf8').replace(/u0000/g, '');

  /**
   * Returns the queue's metadata buffer in a stringified format.
   */
  public static getMetadata = (queue: types.OracleQueueAccountData) =>
    Buffer.from(queue.metadata).toString('utf8').replace(/u0000/g, '');

  onChange(
    callback: OnAccountChangeCallback<types.OracleQueueAccountData>,
    commitment: Commitment = 'confirmed'
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo =>
        callback(types.OracleQueueAccountData.decode(accountInfo.data)),
      commitment
    );
  }

  onBufferChange(
    callback: OnAccountChangeCallback<Array<PublicKey>>,
    _dataBuffer?: PublicKey,
    commitment: Commitment = 'confirmed'
  ): number {
    const buffer = this.dataBuffer ?? _dataBuffer;
    if (!buffer) {
      throw new Error(
        `No queue dataBuffer provided. Call queueAccount.loadData() or pass it to this function in order to watch the account for changes`
      );
    }
    return this.program.connection.onAccountChange(
      buffer,
      accountInfo => callback(QueueAccount.decodeBuffer(accountInfo)),
      commitment
    );
  }

  /**
   * Retrieve and decode the {@linkcode types.OracleQueueAccountData} stored in this account.
   */
  public async loadData(): Promise<types.OracleQueueAccountData> {
    const data = await types.OracleQueueAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    this.dataBuffer = data.dataBuffer;
    return data;
  }

  /**
   * Get the spl Mint associated with this {@linkcode QueueAccount}.
   */
  public async loadMint(): Promise<spl.Mint> {
    return this.program.mint.mint;
  }

  public static async create(
    program: SwitchboardProgram,
    params: QueueInitParams
  ): Promise<[string, QueueAccount]> {
    const [txnObject, account] = await this.createInstructions(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(txnObject);
    return [txnSignature, account];
  }

  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: QueueInitParams
  ): Promise<[TransactionObject, QueueAccount]> {
    const queueKeypair = Keypair.generate();
    const dataBuffer = Keypair.generate();

    const account = new QueueAccount(program, queueKeypair.publicKey);
    const queueSize = params.queueSize ?? 500;
    const queueDataSize = queueSize * 32 + 8;

    const reward = program.mint.toTokenAmountBN(params.reward);
    const minStake = program.mint.toTokenAmountBN(params.minStake);

    return [
      new TransactionObject(
        payer,
        [
          SystemProgram.createAccount({
            fromPubkey: program.wallet.publicKey,
            newAccountPubkey: dataBuffer.publicKey,
            space: queueDataSize,
            lamports:
              await program.connection.getMinimumBalanceForRentExemption(
                queueDataSize
              ),
            programId: program.programId,
          }),
          types.oracleQueueInit(
            program,
            {
              params: {
                name: Array.from(
                  new Uint8Array(Buffer.from(params.name ?? '').slice(0, 32))
                ),
                metadata: [
                  ...new Uint8Array(
                    Buffer.from(params.metadata ?? '').slice(0, 64)
                  ),
                ],
                reward: reward,
                minStake: minStake,
                feedProbationPeriod: params.feedProbationPeriod ?? 0,
                oracleTimeout: params.oracleTimeout ?? 180,
                slashingEnabled: params.slashingEnabled ?? false,
                varianceToleranceMultiplier: SwitchboardDecimal.fromBig(
                  new Big(params.varianceToleranceMultiplier ?? 2)
                ),
                consecutiveFeedFailureLimit: new anchor.BN(
                  params.consecutiveFeedFailureLimit ?? 1000
                ),
                consecutiveOracleFailureLimit: new anchor.BN(
                  params.consecutiveOracleFailureLimit ?? 1000
                ),
                queueSize: queueSize,
                unpermissionedFeeds: params.unpermissionedFeeds ?? false,
                unpermissionedVrf: params.unpermissionedVrf ?? false,
                enableBufferRelayers: params.enableBufferRelayers ?? false,
              },
            },
            {
              oracleQueue: account.publicKey,
              authority: params.authority ?? payer,
              buffer: dataBuffer.publicKey,
              systemProgram: SystemProgram.programId,
              payer,
              mint: params.mint,
            }
          ),
        ],
        [dataBuffer, queueKeypair]
      ),
      account,
    ];
  }

  public async createOracle(params: {
    name?: string;
    metadata?: string;
    enable?: boolean;
    queueAuthority?: Keypair;
    authority?: Keypair; // defaults to payer
  }): Promise<[TransactionSignature, OracleAccount]> {
    const signers: Keypair[] = [];

    const queue = await this.loadData();

    if (
      params.queueAuthority &&
      params.queueAuthority.publicKey.equals(queue.authority)
    ) {
      signers.push(params.queueAuthority);
    }

    const [txn, oracleAccount] = await this.createOracleInstructions(
      this.program.walletPubkey,
      params
    );

    const signature = await this.program.signAndSend(txn);

    return [signature, oracleAccount];
  }

  public async createOracleInstructions(
    payer: PublicKey,
    params: {
      name?: string;
      metadata?: string;
      enable?: boolean;
      queueAuthority?: Keypair;
      authority?: Keypair; // defaults to payer
    }
  ): Promise<[TransactionObject, OracleAccount]> {
    const queue = await this.loadData();

    const [createOracleTxnObject, oracleAccount] =
      await OracleAccount.createInstructions(this.program, payer, {
        ...params,
        queuePubkey: this.publicKey,
      });

    const [createPermissionTxnObject, permissionAccount] =
      PermissionAccount.createInstruction(this.program, payer, {
        granter: this.publicKey,
        grantee: oracleAccount.publicKey,
        authority: queue.authority,
      });

    if (params.enable && params.queueAuthority) {
      const permissionSetTxn = permissionAccount.setInstruction(payer, {
        permission: new PermitOracleHeartbeat(),
        enable: true,
        authority: params.queueAuthority,
      });
      createPermissionTxnObject.combine(permissionSetTxn);
    }

    return [
      createOracleTxnObject.combine(createPermissionTxnObject),
      oracleAccount,
    ];
  }

  public async createFeed(
    params: Omit<
      Omit<Omit<AggregatorInitParams, 'queueAccount'>, 'queueAuthority'>,
      'authority'
    > & {
      authority?: Keypair;
      crankPubkey?: PublicKey;
      historyLimit?: number;
    } & {
      // lease params
      fundAmount?: number;
      funderAuthority?: Keypair;
      funderTokenAccount?: PublicKey;
    } & {
      // permission params
      enable?: boolean;
      queueAuthority?: Keypair;
    } & {
      // job params
      jobs?: Array<{ pubkey: PublicKey; weight?: number } | JobInitParams>;
    }
  ): Promise<[Array<TransactionSignature>, AggregatorAccount]> {
    const signers: Keypair[] = [];

    const queue = await this.loadData();

    if (
      params.queueAuthority &&
      params.queueAuthority.publicKey.equals(queue.authority)
    ) {
      signers.push(params.queueAuthority);
    }

    const [txns, aggregatorAccount] = await this.createFeedInstructions(
      this.program.walletPubkey,
      params
    );

    const signatures = await this.program.signAndSendAll(txns);

    return [signatures, aggregatorAccount];
  }

  public async createFeedInstructions(
    payer: PublicKey,
    params: Omit<
      Omit<Omit<AggregatorInitParams, 'queueAccount'>, 'queueAuthority'>,
      'authority'
    > & {
      authority?: Keypair;
      crankPubkey?: PublicKey;
      historyLimit?: number;
    } & {
      // lease params
      fundAmount?: number;
      funderAuthority?: Keypair;
      funderTokenAccount?: PublicKey;
    } & {
      // permission params
      enable?: boolean;
      queueAuthority?: Keypair;
    } & {
      // job params
      jobs?: Array<{ pubkey: PublicKey; weight?: number } | JobInitParams>;
    }
  ): Promise<[TransactionObject[], AggregatorAccount]> {
    const queue = await this.loadData();

    const pre: TransactionObject[] = [];
    const txns: TransactionObject[] = [];
    const post: TransactionObject[] = [];

    // getOrCreate token account for
    const userTokenAddress = this.program.mint.getAssociatedAddress(payer);
    const userTokenAccountInfo = await this.program.connection.getAccountInfo(
      userTokenAddress
    );
    if (userTokenAccountInfo === null) {
      const [createTokenAccount] =
        this.program.mint.createAssocatedUserInstruction(payer);
      pre.push(createTokenAccount);
    }

    // create / load jobs
    const jobs: { job: JobAccount; weight: number }[] = [];
    if (params.jobs && Array.isArray(params.jobs)) {
      for await (const job of params.jobs) {
        if ('data' in job) {
          const [jobInit, jobAccount] = JobAccount.createInstructions(
            this.program,
            payer,
            {
              data: job.data,
              name: job.name ?? '',
              authority: job.authority ?? payer,
              expiration: job.expiration,
              variables: job.variables,
              keypair: job.keypair,
            }
          );
          pre.push(...jobInit);
          jobs.push({ job: jobAccount, weight: job.weight ?? 1 });
        } else if ('pubkey' in job) {
          const jobAccount = new JobAccount(this.program, job.pubkey);
          // should we verify its a valid job account?
          jobs.push({ job: jobAccount, weight: job.weight ?? 1 });
        } else {
          throw new Error(`Failed to create job account ${job}`);
        }
      }
    }

    const [aggregatorInit, aggregatorAccount] =
      await AggregatorAccount.createInstruction(this.program, payer, {
        ...params,
        queueAccount: this,
        queueAuthority: queue.authority,
        keypair: params.keypair,
        authority: params.authority ? params.authority.publicKey : undefined,
      });

    txns.push(aggregatorInit);

    const [leaseInit] = await LeaseAccount.createInstructions(
      this.program,
      payer,
      {
        loadAmount: params.fundAmount,
        funder: params.funderTokenAccount,
        funderAuthority: params.funderAuthority,
        aggregatorPubkey: aggregatorAccount.publicKey,
        queuePubkey: this.publicKey,
        jobAuthorities: [],
      }
    );
    txns.push(leaseInit);

    // create permission account
    const [permissionInit, permissionAccount] =
      PermissionAccount.createInstruction(this.program, payer, {
        granter: this.publicKey,
        authority: queue.authority,
        grantee: aggregatorAccount.publicKey,
      });

    // // set permissions if needed
    if (params.enable && params.queueAuthority) {
      const permissionSetTxn = permissionAccount.setInstruction(payer, {
        permission: new PermitOracleQueueUsage(),
        enable: true,
        authority: params.queueAuthority,
      });
      permissionInit.combine(permissionSetTxn);
    }

    txns.push(permissionInit);

    for await (const { job, weight } of jobs) {
      const addJobTxn = aggregatorAccount.addJobInstruction(payer, {
        job: job,
        weight: weight,
        authority: params.authority,
      });
      post.push(addJobTxn);
    }

    if (params.crankPubkey) {
      const crankAccount = new CrankAccount(this.program, params.crankPubkey);
      post.push(
        await crankAccount.pushInstruction(this.program.walletPubkey, {
          aggregatorAccount: aggregatorAccount,
          queueAccount: this,
          queue,
        })
      );
    }

    if (params.historyLimit && params.historyLimit > 0) {
      post.push(
        await aggregatorAccount.setHistoryBufferInstruction(
          this.program.walletPubkey,
          { size: params.historyLimit, authority: params.authority }
        )
      );
    }

    const packed = TransactionObject.pack([
      ...TransactionObject.pack(pre),
      ...TransactionObject.pack(txns),
      ...TransactionObject.pack(post),
    ]);

    return [packed, aggregatorAccount];
  }

  public async createCrankInstructions(
    payer: PublicKey,
    params: Omit<CrankInitParams, 'queueAccount'>
  ): Promise<[TransactionObject, CrankAccount]> {
    return await CrankAccount.createInstructions(this.program, payer, {
      ...params,
      queueAccount: this,
    });
  }

  public async createCrank(
    params: Omit<CrankInitParams, 'queueAccount'>
  ): Promise<[TransactionSignature, CrankAccount]> {
    const [txn, crankAccount] = await this.createCrankInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(txn);
    return [txnSignature, crankAccount];
  }

  public async createBufferRelayerInstructions(
    payer: PublicKey,
    params: Omit<BufferRelayerInit, 'queueAccount'> & {
      // permission params
      enable?: boolean;
      queueAuthority?: Keypair;
    }
  ): Promise<[TransactionObject, BufferRelayerAccount]> {
    const queue = await this.loadData();

    const [bufferInit, bufferAccount] =
      await BufferRelayerAccount.createInstructions(this.program, payer, {
        name: params.name,
        minUpdateDelaySeconds: params.minUpdateDelaySeconds,
        queueAccount: this,
        authority: params.authority,
        jobAccount: params.jobAccount,
        keypair: params.keypair,
      });

    // eslint-disable-next-line prefer-const
    let [permissionInit, permissionAccount] =
      PermissionAccount.createInstruction(this.program, payer, {
        granter: this.publicKey,
        grantee: bufferAccount.publicKey,
        authority: queue.authority,
      });

    if (params.enable) {
      if (params.queueAuthority || queue.authority.equals(payer)) {
        const permissionSet = permissionAccount.setInstruction(payer, {
          permission: new PermitOracleQueueUsage(),
          enable: true,
          authority: params.queueAuthority,
        });
        permissionInit = permissionInit.combine(permissionSet);
      }
    }

    return [bufferInit.combine(permissionInit), bufferAccount];
  }

  public async createBufferRelayer(
    params: Omit<BufferRelayerInit, 'queueAccount'> & {
      // permission params
      enable?: boolean;
      queueAuthority?: Keypair;
    }
  ): Promise<[TransactionSignature, BufferRelayerAccount]> {
    const [txn, bufferRelayerAccount] =
      await this.createBufferRelayerInstructions(
        this.program.walletPubkey,
        params
      );
    const txnSignature = await this.program.signAndSend(txn);
    return [txnSignature, bufferRelayerAccount];
  }

  public async createVrfInstructions(
    payer: PublicKey,
    params: Omit<VrfInitParams, 'queueAccount'> & {
      // permission params
      enable?: boolean;
      queueAuthority?: Keypair;
    }
  ): Promise<[TransactionObject, VrfAccount]> {
    const queue = await this.loadData();

    const [vrfInit, vrfAccount] = await VrfAccount.createInstructions(
      this.program,
      payer,
      {
        vrfKeypair: params.vrfKeypair,
        queueAccount: this,
        callback: params.callback,
        authority: params.authority,
      }
    );

    // eslint-disable-next-line prefer-const
    let [permissionInit, permissionAccount] =
      PermissionAccount.createInstruction(this.program, payer, {
        granter: this.publicKey,
        grantee: vrfAccount.publicKey,
        authority: queue.authority,
      });

    if (params.enable) {
      if (params.queueAuthority || queue.authority.equals(payer)) {
        const permissionSet = permissionAccount.setInstruction(payer, {
          permission: new PermitOracleQueueUsage(),
          enable: true,
          authority: params.queueAuthority,
        });
        permissionInit = permissionInit.combine(permissionSet);
      }
    }

    return [vrfInit.combine(permissionInit), vrfAccount];
  }

  public async createVrf(
    params: Omit<VrfInitParams, 'queueAccount'> & {
      // permission params
      enable?: boolean;
      queueAuthority?: Keypair;
    }
  ): Promise<[TransactionSignature, VrfAccount]> {
    const [txn, vrfAccount] = await this.createVrfInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(txn);
    return [txnSignature, vrfAccount];
  }

  public static decodeBuffer(
    bufferAccountInfo: AccountInfo<Buffer>
  ): Array<PublicKey> {
    const buffer = bufferAccountInfo.data.slice(8) ?? Buffer.from('');

    const oracles: PublicKey[] = [];

    for (let i = 0; i < buffer.byteLength * 32; i += 32) {
      if (buffer.byteLength - i < 32) {
        break;
      }

      const pubkeyBuf = buffer.slice(i, i + 32);
      const pubkey = new PublicKey(pubkeyBuf);
      if (PublicKey.default.equals(pubkey)) {
        break;
      }
      oracles.push(pubkey);
    }

    return oracles;
  }

  /** Load the list of oracles that are currently stored in the buffer */
  public async loadOracles(
    queue?: types.OracleQueueAccountData,
    commitment: Commitment = 'confirmed'
  ): Promise<Array<PublicKey>> {
    const dataBuffer =
      this.dataBuffer ??
      queue?.dataBuffer ??
      (await this.loadData()).dataBuffer;
    const accountInfo = await this.program.connection.getAccountInfo(
      dataBuffer,
      { commitment }
    );
    if (!accountInfo || accountInfo.data === null) {
      throw new errors.AccountNotFoundError(dataBuffer);
    }

    return QueueAccount.decodeBuffer(accountInfo);
  }

  /** Loads the oracle states for the oracles currently on the queue's dataBuffer */
  public async loadOracleAccounts(
    queue?: types.OracleQueueAccountData
  ): Promise<
    Array<{
      publicKey: PublicKey;
      data: types.OracleAccountData;
    }>
  > {
    const coder = this.program.coder;

    const oraclePubkeys = await this.loadOracles(queue);
    const accountInfos = await anchor.utils.rpc.getMultipleAccounts(
      this.program.connection,
      oraclePubkeys
    );

    function accountExists<
      T = {
        publicKey: PublicKey;
        data: types.OracleAccountData;
      }
    >(value: T | null | undefined): value is T {
      return value !== null && value !== undefined;
    }

    const oracles = await Promise.all(
      accountInfos.map(async o => {
        if (!o || !o.account) {
          return undefined;
        }
        const data: types.OracleAccountData = coder.decode(
          OracleAccount.accountName,
          o.account.data
        );
        return { publicKey: o.publicKey, data };
      })
    );

    return oracles.filter(accountExists);
  }

  public async loadActiveOracleAccounts(
    _queue?: types.OracleQueueAccountData
  ): Promise<
    Array<{
      publicKey: PublicKey;
      data: types.OracleAccountData;
    }>
  > {
    const queue = _queue ?? (await this.loadData());
    const oracles = await this.loadOracleAccounts(queue);

    const timeout = queue.oracleTimeout;
    // TODO: Use SolanaClock
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const activeOracles = oracles.filter(
      o => o.data && o.data.lastHeartbeat.toNumber() >= unixTimestamp - timeout
    );
    return activeOracles;
  }

  /** Returns a flag dictating whether enough oracles are actively heartbeating on an oracle queue and ready for on-chain update requests */
  public async isReady(
    _queue?: types.OracleQueueAccountData,
    oraclesNeeded = 1
  ): Promise<boolean> {
    const activeOracles = await this.loadActiveOracleAccounts(_queue);
    return activeOracles.length >= oraclesNeeded ? true : false;
  }

  public async setConfig(
    params: QueueSetConfigParams & { authority?: Keypair }
  ): Promise<TransactionSignature> {
    const setConfigTxn = this.setConfigInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(setConfigTxn);
    return txnSignature;
  }

  public setConfigInstruction(
    payer: PublicKey,
    params: QueueSetConfigParams & { authority?: Keypair }
  ): TransactionObject {
    const multiplier =
      params.varianceToleranceMultiplier &&
      Number.isFinite(params.varianceToleranceMultiplier)
        ? SwitchboardDecimal.fromBig(
            new Big(params.varianceToleranceMultiplier)
          )
        : null;

    const reward = params.reward
      ? this.program.mint.toTokenAmountBN(params.reward)
      : null;
    const minStake = params.minStake
      ? this.program.mint.toTokenAmountBN(params.minStake)
      : null;

    return new TransactionObject(
      payer,
      [
        types.oracleQueueSetConfig(
          this.program,
          {
            params: {
              name: params.name
                ? [
                    ...new Uint8Array(
                      Buffer.from(params.name ?? '').slice(0, 32)
                    ),
                  ]
                : null,
              metadata: params.metadata
                ? [
                    ...new Uint8Array(
                      Buffer.from(params.metadata ?? '').slice(0, 64)
                    ),
                  ]
                : null,
              unpermissionedFeedsEnabled:
                params.unpermissionedFeedsEnabled ?? null,
              unpermissionedVrfEnabled: params.unpermissionedVrfEnabled ?? null,
              enableBufferRelayers: params.enableBufferRelayers ?? null,
              slashingEnabled: params.slashingEnabled ?? null,
              reward: reward,
              minStake: minStake,
              oracleTimeout: params.oracleTimeout ?? null,
              consecutiveFeedFailureLimit: params.consecutiveFeedFailureLimit
                ? new anchor.BN(params.consecutiveFeedFailureLimit)
                : null,
              consecutiveOracleFailureLimit:
                params.consecutiveOracleFailureLimit
                  ? new anchor.BN(params.consecutiveOracleFailureLimit)
                  : null,
              varianceToleranceMultiplier: multiplier,
            },
          },
          {
            authority: params.authority ? params.authority.publicKey : payer,
            queue: this.publicKey,
          }
        ),
      ],
      params.authority ? [params.authority] : []
    );
  }
}

/**
 *  Parameters for initializing an {@linkcode QueueAccount}
 */
export interface QueueInitParams {
  /**
   *  A name to assign to this {@linkcode QueueAccount}
   */
  name?: string;
  /**
   *  Buffer for queue metadata
   */
  metadata?: string;
  /**
   *  Rewards to provide oracles and round openers on this queue.
   */
  reward: number;
  /**
   *  The minimum amount of stake oracles must present to remain on the queue.
   */
  minStake: number;
  /**
   *  After a feed lease is funded or re-funded, it must consecutively succeed
   *  N amount of times or its authorization to use the queue is auto-revoked.
   */
  feedProbationPeriod?: number;
  /**
   *  Time period (in seconds) we should remove an oracle after if no response.
   */
  oracleTimeout?: number;
  /**
   *  Whether slashing is enabled on this queue.
   */
  slashingEnabled?: boolean;
  /**
   *  The tolerated variance amount oracle results can have from the accepted round result
   *  before being slashed.
   *  slashBound = varianceToleranceMultiplier * stdDeviation
   *  Default: 2
   */
  varianceToleranceMultiplier?: number;
  /**
   *  Consecutive failure limit for a feed before feed permission is revoked.
   */
  consecutiveFeedFailureLimit?: number;
  /**
   *  Consecutive failure limit for an oracle before oracle permission is revoked.
   */
  consecutiveOracleFailureLimit?: number;
  /**
   *  Optionally set the size of the queue.
   */
  queueSize?: number;
  /**
   *  Enabling this setting means data feeds do not need explicit permission to join the queue.
   */
  unpermissionedFeeds?: boolean;
  /**
   *  Enabling this setting means data feeds do not need explicit permission
   *  to request VRF proofs and verifications from this queue.
   */
  unpermissionedVrf?: boolean;
  /**
   *  Enabling this setting will allow buffer relayer accounts to call openRound.
   */
  enableBufferRelayers?: boolean;
  /**
   *  The account to delegate authority to for creating permissions targeted at the queue.
   *
   *  Defaults to the payer.
   */
  authority?: PublicKey;
  mint: PublicKey;
}

export type QueueSetConfigParams = Partial<{
  authority?: anchor.web3.Keypair;
  name: string;
  metadata: string;
  unpermissionedFeedsEnabled: boolean;
  unpermissionedVrfEnabled: boolean;
  enableBufferRelayers: boolean;
  slashingEnabled: boolean;
  varianceToleranceMultiplier: number;
  oracleTimeout: number;
  reward: number;
  minStake: number;
  consecutiveFeedFailureLimit: number;
  consecutiveOracleFailureLimit: number;
}>;
