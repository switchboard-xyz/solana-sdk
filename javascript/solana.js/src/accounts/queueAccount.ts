import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import {
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
import { Account } from './account';
import { AggregatorAccount } from './aggregatorAccount';
import { JobAccount } from './jobAccount';
import { LeaseAccount } from './leaseAccount';
import { OracleAccount } from './oracleAccount';
import { PermissionAccount } from './permissionAccount';

/**
 *  Parameters for initializing an {@linkcode OracleQueueAccount}
 */
export interface QueueInitParams {
  /**
   *  A name to assign to this {@linkcode QueueAccount}
   */
  name?: Buffer;
  /**
   *  Buffer for queue metadata
   */
  metadata?: Buffer;
  /**
   *  Rewards to provide oracles and round openers on this queue.
   */
  reward: anchor.BN;
  /**
   *  The minimum amount of stake oracles must present to remain on the queue.
   */
  minStake: anchor.BN;
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
  reward: anchor.BN;
  minStake: anchor.BN;
  consecutiveFeedFailureLimit: anchor.BN;
  consecutiveOracleFailureLimit: anchor.BN;
}>;

export class QueueAccount extends Account<types.OracleQueueAccountData> {
  oracles: Array<PublicKey> | undefined = undefined;

  static accountName = 'OracleQueueAccountData';
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

  /**
   * Retrieve and decode the {@linkcode types.OracleQueueAccountData} stored in this account.
   */
  public async loadData(): Promise<types.OracleQueueAccountData> {
    const data = await types.OracleQueueAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
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
                reward: new anchor.BN(params.reward ?? 0),
                minStake: new anchor.BN(params.minStake ?? 0),
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
    params: {
      // aggregator params
      batchSize: number;
      minRequiredOracleResults: number;
      minRequiredJobResults: number;
      minUpdateDelaySeconds: number;
      name?: string;
      metadata?: string;
      startAfter?: number;
      varianceThreshold?: number;
      forceReportPeriod?: number;
      expiration?: number;
      disableCrank?: boolean;
      authorWallet?: PublicKey;
      feedKeypair?: Keypair;
      authority?: Keypair;
    } & {
      // lease params
      loadAmount?: number;
      funderAuthority?: Keypair;
      funder?: PublicKey;
    } & {
      // permission params
      permission?: types.SwitchboardPermissionKind;
      enable?: boolean;
      queueAuthority?: Keypair;
    } & {
      // job params
      jobs?: Array<
        | { pubkey: PublicKey; weight?: number }
        | {
            data: Uint8Array;
            weight?: number;
            name?: string;
            authority?: PublicKey;
            expiration?: number;
            variables?: Array<string>;
            jobKeypair?: Keypair;
          }
      >;
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
    params: {
      // aggregator params
      batchSize: number;
      minRequiredOracleResults: number;
      minRequiredJobResults: number;
      minUpdateDelaySeconds: number;
      name?: string;
      metadata?: string;
      startAfter?: number;
      varianceThreshold?: number;
      forceReportPeriod?: number;
      expiration?: number;
      disableCrank?: boolean;
      authorWallet?: PublicKey;
      feedKeypair?: Keypair;
      authority?: Keypair;
    } & {
      // lease params
      loadAmount?: number;
      funderAuthority?: Keypair;
      funder?: PublicKey;
    } & {
      // permission params
      permission?: types.SwitchboardPermissionKind;
      enable?: boolean;
      queueAuthority?: Keypair;
    } & {
      // job params
      jobs?: Array<
        | { pubkey: PublicKey; weight?: number }
        | {
            data: Uint8Array;
            weight?: number;
            name?: string;
            authority?: PublicKey;
            expiration?: number;
            variables?: Array<string>;
            jobKeypair?: Keypair;
          }
      >;
    }
  ): Promise<[TransactionObject[], AggregatorAccount]> {
    const queue = await this.loadData();

    const txns: TransactionObject[] = [];

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
              jobKeypair: job.jobKeypair,
            }
          );
          txns.push(...jobInit);
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
    // getOrCreate token account for
    const userTokenAddress = this.program.mint.getAssociatedAddress(payer);
    const userTokenAccountInfo = await this.program.connection.getAccountInfo(
      userTokenAddress
    );
    if (userTokenAccountInfo === null) {
      const [createTokenAccount] =
        this.program.mint.createAssocatedUserInstruction(payer);
      txns.push(createTokenAccount);
    }

    const [aggregatorInit, aggregatorAccount] =
      await AggregatorAccount.createInstruction(this.program, payer, {
        ...params,
        queueAccount: this,
        queueAuthority: queue.authority,
        keypair: params.feedKeypair,
        authority: params.authority ? params.authority.publicKey : undefined,
      });

    txns.push(aggregatorInit);

    // create lease account
    const [leaseInit, leaseAccount] = await LeaseAccount.createInstructions(
      this.program,
      payer,
      {
        loadAmount: params.loadAmount,
        funder: params.funder,
        funderAuthority: params.funderAuthority,
        mint: this.program.mint.address,
        aggregatorPubkey: aggregatorAccount.publicKey,
        queuePubkey: this.publicKey,
        jobAuthorities: [],
      }
    );
    txns.push(leaseInit);
    // // create permission account
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
      txns.push(addJobTxn);
    }

    const packed = TransactionObject.pack(txns);

    return [packed, aggregatorAccount];
  }

  public async isReady(): Promise<boolean> {
    const queue = await this.loadData();
    const oracles = await this.loadOracleAccounts(queue);

    const timeout = queue.oracleTimeout;
    // TODO: Use SolanaClock
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const activeOracles = oracles.filter(o => {
      if (
        o.data &&
        o.data.lastHeartbeat.toNumber() >= unixTimestamp - timeout
      ) {
        return true;
      }
      return false;
    });

    return activeOracles.length > 0 ? true : false;
  }

  /**
   * Get the {@linkcode spl.Mint} associated with this {@linkcode OracleQueueAccount}.
   */
  public async loadMint(): Promise<spl.Mint> {
    const queue = await this.loadData();
    const mintKey = queue.mint.equals(PublicKey.default)
      ? spl.NATIVE_MINT
      : queue.mint;
    return spl.getMint(this.program.connection, mintKey);
  }

  /**
   * Get the size of an {@linkcode OracleQueueAccount} on-chain.
   */
  public readonly size = this.program.account.oracleQueueAccountData.size;

  public async loadOracles(
    queue?: types.OracleQueueAccountData
  ): Promise<Array<PublicKey>> {
    const queueData = queue ?? (await this.loadData());
    const accountInfo = await this.program.connection.getAccountInfo(
      queueData.dataBuffer
    );
    if (!accountInfo || accountInfo.data === null) {
      throw new Error('Failed to fetch oracle queue buffer');
    }
    const buffer = accountInfo.data.slice(8) ?? Buffer.from('');

    const oracles: PublicKey[] = [];

    for (let i = 0; i < buffer.byteLength * 32; i += 32) {
      if (buffer.length - i < 32) {
        break;
      }
      const pubkeyBuf = buffer.slice(i, i + 32);
      const pubkey = new PublicKey(pubkeyBuf);
      if (!PublicKey.default.equals(pubkey)) {
        oracles.push(pubkey);
      }
    }

    this.oracles = oracles;
    return oracles;
  }

  public async loadOracleAccounts(
    queue?: types.OracleQueueAccountData
  ): Promise<
    Array<{
      publicKey: PublicKey;
      data?: types.OracleAccountData;
    }>
  > {
    const oracles = await this.loadOracles(queue);
    const accountInfos = await this.program.connection.getMultipleAccountsInfo(
      oracles
    );

    const coder = this.program.coder;
    return await Promise.all(
      accountInfos.map(async (o, i) => {
        const publicKey: PublicKey = oracles[i];
        const data: types.OracleAccountData | undefined =
          o === null
            ? undefined
            : coder.decode(OracleAccount.accountName, o?.data);
        return { publicKey, data };
      })
    );
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
              reward: params.reward ?? null,
              minStake: params.minStake ?? null,
              oracleTimeout: params.oracleTimeout ?? null,
              consecutiveFeedFailureLimit:
                params.consecutiveFeedFailureLimit ?? null,
              consecutiveOracleFailureLimit:
                params.consecutiveOracleFailureLimit ?? null,
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
