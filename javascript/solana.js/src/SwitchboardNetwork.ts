import * as anchor from '@project-serum/anchor';
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
  VrfAccountData,
} from './generated';
import {
  AggregatorAccount,
  BufferRelayerAccount,
  CrankAccount,
  LeaseAccount,
  OracleAccount,
  PermissionAccount,
  ProgramStateAccount,
  QueueAccount,
  VrfAccount,
  SwitchboardAccount,
  SwitchboardAccountData,
  JobAccount,
  QueueInitParams,
  CreateQueueCrankParams,
  CreateQueueOracleParams,
  CreateQueueFeedParams,
  CreateQueueVrfParams,
  CreateQueueBufferRelayerParams,
} from './accounts';
import {
  AccountInfo,
  Keypair,
  PublicKey,
  TransactionSignature,
} from '@solana/web3.js';
import { SwitchboardProgram } from './SwitchboardProgram';
import { OracleJob } from '@switchboard-xyz/common';
import { TransactionObject } from './TransactionObject';
import {
  AggregatorDefinition,
  BufferRelayerDefinition,
  CrankDefinition,
  LoadedAccountDefinition,
  LoadedAggregatorDefinition,
  LoadedBufferRelayerDefinition,
  LoadedCrankDefinition,
  LoadedJobDefinition,
  LoadedOracleDefinition,
  LoadedProgramStateDefinition,
  LoadedQueueDefinition,
  LoadedVrfDefinition,
  OracleDefinition,
  ProgramStateDefinition,
  QueueDefinition,
  VrfDefinition,
} from './types';

export const isKeypairString = (value: string): boolean =>
  /^\[(\s)?[0-9]+((\s)?,(\s)?[0-9]+){31,}\]/.test(value);

/** Parameters to create a new queue with a set of associated accounts */
export type NetworkInitParams = Omit<QueueInitParams, 'authority'> & {
  authority?: Keypair;
} & {
  /** The {@linkcode CrankAccount}s to add to the queue */
  cranks?: Array<CreateQueueCrankParams>;
  /** The {@linkcode OracleAccount}s to add to the queue */
  oracles?: Array<CreateQueueOracleParams>;
  /** The {@linkcode AggregatorAccount}s to add to the queue */
  aggregators?: Array<
    CreateQueueFeedParams & {
      /** The index of the crank to add the feed to */
      crankIndex?: number;
    }
  >;
  /** The {@linkcode VrfAccount}s to add to the queue */
  vrfs?: Array<CreateQueueVrfParams>;
  /** The {@linkcode BufferRelayerAccount}s to add to the queue */
  bufferRelayers?: Array<CreateQueueBufferRelayerParams>;
};

/** The queue and associated accounts for the newly created Switchboard network. */
export interface ISwitchboardNetwork {
  /** The {@linkcode ProgramStateAccount} and PDA bump. */
  programState: ProgramStateDefinition;
  /** The {@linkcode QueueAccount} for the newly created Switchboard network. */
  queue: QueueDefinition;
  /** The {@linkcode CrankAccount}s for the newly created Switchboard network. */
  cranks: Array<CrankDefinition>;
  oracles: Array<OracleDefinition>;
  aggregators: Array<AggregatorDefinition>;
  vrfs: Array<VrfDefinition>;
  bufferRelayers: Array<BufferRelayerDefinition>;
}

/** Wrapper to quickly create a Switchboard network including:
 *  - an oracle queue
 *  - a set of cranks
 *  - a set of oracles
 *  - a set of aggregators with job configs
 *  - a set of vrf accounts
 *  - a set of buffer relayers
 *
 */
export class SwitchboardNetwork implements ISwitchboardNetwork {
  programState: ProgramStateDefinition;
  queue: QueueDefinition;
  cranks: Array<CrankDefinition>;
  oracles: Array<OracleDefinition>;
  aggregators: Array<AggregatorDefinition>;
  vrfs: Array<VrfDefinition>;
  bufferRelayers: Array<BufferRelayerDefinition>;

  constructor(
    // readonly program: SwitchboardProgram,
    fields: ISwitchboardNetwork
  ) {
    this.programState = fields.programState;
    this.queue = fields.queue;
    this.cranks = fields.cranks;
    this.oracles = fields.oracles;
    this.aggregators = fields.aggregators;
    this.vrfs = fields.vrfs;
    this.bufferRelayers = fields.bufferRelayers;
  }

  /**
 *
 * Creates a transaction object to initialize a SwitchboardNetwork.
 *
 * Basic usage example:
 *
 * ```ts
 *     const [accounts, signatures] = await SwitchboardNetwork.createInstructions(
      program,
      progam.walletPubkey,
      {
        name: 'Queue-1',
        reward: 0,
        minStake: 1,
        unpermissionedFeeds: false,
        unpermissionedVrf: false,
        authority: origQueueAuthority,
        oracles: [
          {
            name: 'Oracle-1',
            enable: true,
            stakeAmount: 1,
          },
        ],
        cranks: [{ name: 'Crank-1', maxRows: 100 }],
        aggregators: [{
          name: "Aggregator-1",
          crankIndex: 0,
          enable: true,
          fundAmount: 2.5,
          "minUpdateDelaySeconds": 15,
          "batchSize": 3,
          "minRequiredOracleResults": 2,
          "jobs": [
            {
              "weight": 1,
              "name": "Job #1",
              "tasks": [
                {
                  "valueTask": {
                    "value": "1"
                  }
                }
              ]
            }
          ]
        }]
      }
    );
 * ```
 */
  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: NetworkInitParams
  ): Promise<[Array<TransactionObject>, SwitchboardNetwork]> {
    const txns: Array<TransactionObject> = [];

    // const userTokenAddress = this.mint.getAssociatedAddress(payer);

    // calculate the total amount of funds we'll need to wrap
    let neededWrappedFunds = 0;
    (params.oracles ?? []).forEach(o => {
      if (o.stakeAmount) {
        neededWrappedFunds = neededWrappedFunds + o.stakeAmount;
      }
    });
    (params.aggregators ?? []).forEach(a => {
      if (a.fundAmount) {
        neededWrappedFunds = neededWrappedFunds + a.fundAmount;
      }
    });

    const [userTokenAddress, wrapFundsTxn] =
      await program.mint.getOrCreateWrappedUserInstructions(payer, {
        fundUpTo: neededWrappedFunds,
      });

    const queueAuthorityPubkey = params.authority
      ? params.authority.publicKey
      : payer;

    // get or create the program state
    const [programState, stateBump, programInit] =
      await ProgramStateAccount.getOrCreateInstructions(program, payer);
    if (programInit) {
      txns.push(programInit);
    }

    // create a new queue
    const [queueAccount, queueInit] = await QueueAccount.createInstructions(
      program,
      payer,
      { ...params, authority: queueAuthorityPubkey }
    );
    txns.push(queueInit);

    // create the cranks
    const cranks: Array<[TransactionObject, CrankDefinition]> =
      await Promise.all(
        (params.cranks ?? []).map(async crankInitParams => {
          const [crankAccount, crankInit] =
            await queueAccount.createCrankInstructions(payer, crankInitParams);

          return [
            crankInit,
            {
              account: crankAccount,
              dataBuffer: crankAccount.dataBuffer!.publicKey,
            },
          ];
        })
      );
    txns.push(...cranks.map(crank => crank[0]));

    // create the oracles
    const oracles: Array<[Array<TransactionObject>, OracleDefinition]> =
      await Promise.all(
        (params.oracles ?? []).map(async oracleInitParams => {
          const [oracleAccount, oracleInit] =
            await queueAccount.createOracleInstructions(payer, {
              ...oracleInitParams,
              queueAuthority: params.authority,
              queueAuthorityPubkey: queueAuthorityPubkey,
              funderTokenWallet: userTokenAddress,
              disableWrap: true,
              enable: true,
            });

          const [oraclePermissionAccount, oraclePermissionBump] =
            PermissionAccount.fromSeed(
              program,
              queueAuthorityPubkey,
              queueAccount.publicKey,
              oracleAccount.publicKey
            );

          return [
            oracleInit,
            {
              account: oracleAccount,
              permission: {
                account: oraclePermissionAccount,
                bump: oraclePermissionBump,
              },
            },
          ];
        })
      );
    txns.push(...oracles.map(oracle => oracle[0]).flat());

    // create the feeds
    const aggregators: Array<[Array<TransactionObject>, AggregatorDefinition]> =
      await Promise.all(
        (params.aggregators ?? []).map(async feedInitParams => {
          const crank = feedInitParams.crankPubkey
            ? new CrankAccount(program, feedInitParams.crankPubkey)
            : feedInitParams.crankIndex !== undefined &&
              feedInitParams.crankIndex >= 0 &&
              cranks.length > feedInitParams.crankIndex
            ? cranks[feedInitParams.crankIndex][1].account
            : undefined;

          const crankPubkey = crank?.publicKey ?? undefined;
          const crankDataBuffer =
            feedInitParams.crankDataBuffer ??
            crank?.dataBuffer?.publicKey ??
            (await crank?.loadData())?.dataBuffer;

          const [aggregatorAccount, aggregatorInit] =
            await queueAccount.createFeedInstructions(payer, {
              ...feedInitParams,
              queueAuthority: params.authority,
              queueAuthorityPubkey,
              funderTokenWallet: userTokenAddress,
              disableWrap: true,
              crankPubkey: crankPubkey,
              crankDataBuffer: crankDataBuffer,
            });

          const [aggregatorPermissionAccount, aggregatorPermissionBump] =
            PermissionAccount.fromSeed(
              program,
              queueAuthorityPubkey,
              queueAccount.publicKey,
              aggregatorAccount.publicKey
            );

          const [aggregatorLeaseAccount, aggregatorLeaseBump] =
            LeaseAccount.fromSeed(
              program,
              queueAccount.publicKey,
              aggregatorAccount.publicKey
            );

          return [
            aggregatorInit,
            {
              account: aggregatorAccount,
              permission: {
                account: aggregatorPermissionAccount,
                bump: aggregatorPermissionBump,
              },
              lease: {
                account: aggregatorLeaseAccount,
                bump: aggregatorLeaseBump,
              },
            },
          ];
        })
      );
    txns.push(...aggregators.map(aggregator => aggregator[0]).flat());

    // create the vrfs
    const vrfs: Array<[TransactionObject, VrfDefinition]> = await Promise.all(
      (params.vrfs ?? []).map(async vrfInitParams => {
        const [vrfAccount, vrfInit] = await queueAccount.createVrfInstructions(
          payer,
          {
            ...vrfInitParams,
            queueAuthority: params.authority,
            queueAuthorityPubkey,
          }
        );

        const [vrfPermissionAccount, vrfPermissionBump] =
          PermissionAccount.fromSeed(
            program,
            queueAuthorityPubkey,
            queueAccount.publicKey,
            vrfAccount.publicKey
          );

        return [
          vrfInit,
          {
            account: vrfAccount,
            permission: {
              account: vrfPermissionAccount,
              bump: vrfPermissionBump,
            },
          },
        ];
      })
    );
    txns.push(...vrfs.map(vrf => vrf[0]));

    // create the buffer relayers
    const bufferRelayers: Array<[TransactionObject, BufferRelayerDefinition]> =
      await Promise.all(
        (params.bufferRelayers ?? []).map(async bufferRelayerInitParams => {
          const [bufferRelayerAccount, bufferRelayerInit] =
            await queueAccount.createBufferRelayerInstructions(payer, {
              ...bufferRelayerInitParams,
              queueAuthority: params.authority,
              queueAuthorityPubkey,
            });

          const [bufferRelayerPermissionAccount, bufferRelayerPermissionBump] =
            PermissionAccount.fromSeed(
              program,
              queueAuthorityPubkey,
              queueAccount.publicKey,
              bufferRelayerAccount.publicKey
            );

          return [
            bufferRelayerInit,
            {
              account: bufferRelayerAccount,
              permission: {
                account: bufferRelayerPermissionAccount,
                bump: bufferRelayerPermissionBump,
              },
            },
          ];
        })
      );
    txns.push(...bufferRelayers.map(bufferRelayer => bufferRelayer[0]));

    const accounts: ISwitchboardNetwork = {
      programState: {
        account: programState,
        bump: stateBump,
      },
      queue: {
        account: queueAccount,
      },
      cranks: cranks.map(c => c[1]),
      oracles: oracles.map(o => o[1]),
      aggregators: aggregators.map(a => a[1]),
      vrfs: vrfs.map(v => v[1]),
      bufferRelayers: bufferRelayers.map(b => b[1]),
    };

    return [
      TransactionObject.pack(wrapFundsTxn ? [wrapFundsTxn, ...txns] : txns),
      new SwitchboardNetwork(accounts),
    ];
  }

  /**
 *
 * Create a new SwitchboardNetwork.
 *
 * Basic usage example:
 *
 * ```ts
 *     const [accounts, signatures] = await SwitchboardNetwork.create(
      program,
      {
        name: 'Queue-1',
        reward: 0,
        minStake: 1,
        unpermissionedFeeds: false,
        unpermissionedVrf: false,
        authority: origQueueAuthority,
        oracles: [
          {
            name: 'Oracle-1',
            enable: true,
            stakeAmount: 1,
          },
        ],
        cranks: [{ name: 'Crank-1', maxRows: 100 }],
        aggregators: [{
          name: "Aggregator-1",
          crankIndex: 0,
          enable: true,
          fundAmount: 2.5,
          "minUpdateDelaySeconds": 15,
          "batchSize": 3,
          "minRequiredOracleResults": 2,
          "jobs": [
            {
              "weight": 1,
              "name": "Job #1",
              "tasks": [
                {
                  "valueTask": {
                    "value": "1"
                  }
                }
              ]
            }
          ]
        }]
      }
    );
 * ```
 */
  public static async create(
    program: SwitchboardProgram,
    params: NetworkInitParams
  ): Promise<[SwitchboardNetwork, Array<TransactionSignature>]> {
    const [networkInit, accounts] = await SwitchboardNetwork.createInstructions(
      program,
      program.walletPubkey,
      params
    );
    const txnSignatures = await program.signAndSendAll(networkInit, {
      skipPreflight: true,
    });
    return [accounts, txnSignatures];
  }

  /**
   * Load the account states for a {@linkcode SwitchboardNetwork}.
   *
   * @returns LoadedSwitchboardNetwork
   */
  async load(): Promise<LoadedSwitchboardNetwork> {
    const program = this.queue.account.program;

    // load the accounts
    const publicKeys: Array<PublicKey> = [
      this.programState.account.publicKey,
      this.queue.account.publicKey,
      // cranks
      ...this.cranks.map(c => c.account.publicKey),
      // oracles
      ...this.oracles
        .map(o => [o.account.publicKey, o.permission.account.publicKey])
        .flat(),
      // aggregators
      ...this.aggregators
        .map(a => [
          a.account.publicKey,
          a.permission.account.publicKey,
          a.lease.account.publicKey,
        ])
        .flat(),
      // vrfs
      ...this.vrfs
        .map(v => [v.account.publicKey, v.permission.account.publicKey])
        .flat(),
      // buffer relayers
      ...this.bufferRelayers
        .map(b => [b.account.publicKey, b.permission.account.publicKey])
        .flat(),
    ];

    const accountInfos: Map<
      string,
      AccountInfo<Buffer>
    > = await anchor.utils.rpc
      .getMultipleAccounts(program.connection, publicKeys)
      .then(
        (
          values: ({
            publicKey: anchor.web3.PublicKey;
            account: anchor.web3.AccountInfo<Buffer>;
          } | null)[]
        ) => {
          return values.reduce((map, account) => {
            if (account && account.account.data) {
              map.set(account.publicKey.toBase58(), account.account);
            }

            return map;
          }, new Map<string, AccountInfo<Buffer>>());
        }
      );

    // build tree
    const programState: LoadedProgramStateDefinition = {
      ...this.programState,
      state: SbState.decode(
        accountInfos.get(this.programState.account.publicKey.toBase58())
          ?.data ?? Buffer.from('')
      ),
    };

    const queue: LoadedQueueDefinition = {
      ...this.queue,
      state: OracleQueueAccountData.decode(
        accountInfos.get(this.queue.account.publicKey.toBase58())?.data ??
          Buffer.from('')
      ),
    };

    const cranks: Array<LoadedCrankDefinition> = this.cranks.map(crank => {
      return {
        ...crank,
        state: CrankAccountData.decode(
          accountInfos.get(crank.account.publicKey.toBase58())?.data ??
            Buffer.from('')
        ),
      };
    });

    const oracles: Array<LoadedOracleDefinition> = this.oracles.map(oracle => {
      return {
        ...oracle,
        state: OracleAccountData.decode(
          accountInfos.get(oracle.account.publicKey.toBase58())?.data ??
            Buffer.from('')
        ),
        permission: {
          ...oracle.permission,
          state: PermissionAccountData.decode(
            accountInfos.get(oracle.permission.account.publicKey.toBase58())
              ?.data ?? Buffer.from('')
          ),
        },
      };
    });

    const aggregators: Array<LoadedAggregatorDefinition> = this.aggregators.map(
      aggregator => {
        return {
          ...aggregator,
          state: AggregatorAccountData.decode(
            accountInfos.get(aggregator.account.publicKey.toBase58())?.data ??
              Buffer.from('')
          ),
          permission: {
            ...aggregator.permission,
            state: PermissionAccountData.decode(
              accountInfos.get(
                aggregator.permission.account.publicKey.toBase58()
              )?.data ?? Buffer.from('')
            ),
          },
          lease: {
            ...aggregator.lease,
            state: LeaseAccountData.decode(
              accountInfos.get(aggregator.lease.account.publicKey.toBase58())
                ?.data ?? Buffer.from('')
            ),
          },
        };
      }
    );

    const vrfs: Array<LoadedVrfDefinition> = this.vrfs.map(vrf => {
      return {
        ...vrf,
        state: VrfAccountData.decode(
          accountInfos.get(vrf.account.publicKey.toBase58())?.data ??
            Buffer.from('')
        ),
        permission: {
          ...vrf.permission,
          state: PermissionAccountData.decode(
            accountInfos.get(vrf.permission.account.publicKey.toBase58())
              ?.data ?? Buffer.from('')
          ),
        },
      };
    });

    const bufferRelayers: Array<LoadedBufferRelayerDefinition> =
      this.bufferRelayers.map(bufferRelayer => {
        return {
          ...bufferRelayer,
          state: BufferRelayerAccountData.decode(
            accountInfos.get(bufferRelayer.account.publicKey.toBase58())
              ?.data ?? Buffer.from('')
          ),
          permission: {
            ...bufferRelayer.permission,
            state: PermissionAccountData.decode(
              accountInfos.get(
                bufferRelayer.permission.account.publicKey.toBase58()
              )?.data ?? Buffer.from('')
            ),
          },
        };
      });

    const jobPublicKeys: Array<PublicKey> = [];
    aggregators.forEach(aggregator => {
      const jobs = aggregator.state.jobPubkeysData.slice(
        0,
        aggregator.state.jobPubkeysSize
      );
      jobPublicKeys.push(...jobs);
    });
    bufferRelayers.forEach(bufferRelayer => {
      jobPublicKeys.push(bufferRelayer.state.jobPubkey);
    });

    const jobs: Array<LoadedJobDefinition> = (
      await anchor.utils.rpc
        .getMultipleAccounts(program.connection, jobPublicKeys)
        .then(
          (
            values: ({
              publicKey: anchor.web3.PublicKey;
              account: anchor.web3.AccountInfo<Buffer>;
            } | null)[]
          ) => {
            return values.map(account => {
              if (account === null) {
                return undefined;
              }

              const jobAccount = new JobAccount(program, account.publicKey);
              const state = JobAccountData.decode(account.account.data);
              let job: OracleJob;
              try {
                job = OracleJob.decodeDelimited(state.data);
              } catch {
                job = OracleJob.fromObject({ tasks: [] });
              }

              const loadedJob: LoadedJobDefinition = {
                account: jobAccount,
                state: state,
                job,
              };

              return loadedJob;
            });
          }
        )
    ).filter(Boolean) as Array<
      LoadedAccountDefinition<JobAccount, JobAccountData> & { job: OracleJob }
    >;

    return new LoadedSwitchboardNetwork({
      programState,
      queue,
      cranks,
      oracles,
      aggregators,
      vrfs,
      bufferRelayers,
      jobs,
    });
  }

  // static from(
  //   program: SwitchboardProgram,
  //   obj: Record<string, any>
  // ): SwitchboardNetwork {
  //   if (!('queue' in obj) || typeof obj.queue !== 'object') {
  //     throw new Error(`SwitchboardNetwork requires a queue object`);
  //   }

  //   let queueAccount: QueueAccount;
  //   if ('publicKey' in obj.queue) {
  //     queueAccount = new QueueAccount(program, obj.queue.publicKey);
  //   } else if (
  //     'keypair' in obj.queue &&
  //     typeof obj.queue.keypair === 'string' &&
  //     isKeypairString(obj.queue.keypair)
  //   ) {
  //     const queueKeypair = Keypair.fromSecretKey(
  //       new Uint8Array(JSON.parse(obj.queue.keypair))
  //     );
  //     queueAccount = new QueueAccount(program, queueKeypair.publicKey);
  //   } else {
  //     throw new Error(`Failed to load queue`);
  //   }

  //   const cranks: Array<CrankDefinition> = [];
  //   if ('cranks' in obj && Array.isArray(obj.cranks)) {
  //     for (const crank of obj.cranks ?? []) {
  //       if ('publicKey' in crank) {
  //         const account = new CrankAccount(program, crank.publicKey);
  //         cranks.push({
  //           account,
  //         });
  //       } else if (
  //         'keypair' in crank &&
  //         typeof crank.keypair === 'string' &&
  //         isKeypairString(crank.keypair)
  //       ) {
  //         const keypair = Keypair.fromSecretKey(
  //           new Uint8Array(JSON.parse(crank.keypair))
  //         );
  //         const account = new CrankAccount(program, keypair.publicKey);
  //         cranks.push({
  //           account,
  //         });
  //       }
  //     }
  //   }

  //   const oracles: Array<OracleDefinition> = [];
  //   if ('oracles' in obj && Array.isArray(obj.oracles)) {
  //     for (const oracle of obj.oracles ?? []) {
  //       let account: OracleAccount | undefined = undefined;
  //       if ('publicKey' in oracle) {
  //         account = new OracleAccount(program, oracle.publicKey);
  //       } else if (
  //         'keypair' in oracle &&
  //         typeof oracle.keypair === 'string' &&
  //         isKeypairString(oracle.keypair)
  //       ) {
  //         const keypair = Keypair.fromSecretKey(
  //           new Uint8Array(JSON.parse(oracle.keypair))
  //         );
  //         account = new OracleAccount(program, keypair.publicKey);
  //       } else if (
  //         'stakingWalletKeypair' in oracle &&
  //         typeof oracle.stakingWalletKeypair === 'string' &&
  //         isKeypairString(oracle.stakingWalletKeypair)
  //       ) {
  //         const keypair = Keypair.fromSecretKey(
  //           new Uint8Array(JSON.parse(oracle.stakingWalletKeypair))
  //         );
  //         [account] = OracleAccount.fromSeed(
  //           program,
  //           queueAccount.publicKey,
  //           keypair.publicKey
  //         );
  //       }

  //       if (account) {
  //         // const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(program, queue.a)
  //       }
  //     }
  //   }

  //   throw new Error(`Not finished yet`);
  // }

  /**
   * Load the associated accounts and states for a given {@linkcode QueueAccount}.
   *
   * Basic usage example:
   *
   * ```ts
   * const network = await SwitchboardNetwork.fromQueue(queueAccount);
   * fs.writeFileSync("MyQueue.json", JSON.stringify(network.toJSON(), undefined, 2));
   * ```
   */
  static async fromQueue(
    queueAccount: QueueAccount
  ): Promise<LoadedSwitchboardNetwork> {
    const program = queueAccount.program;

    const accounts = await program.getProgramAccounts();

    const programStateAccounts = Array.from(accounts.programState);
    if (programStateAccounts.length < 1) {
      throw new Error(`Failed to find programState account`);
    }
    const [programStateAccount, programStateBump] =
      ProgramStateAccount.fromSeed(program);
    const programStateAccountDefinition: LoadedProgramStateDefinition = {
      account: programStateAccount,
      bump: programStateBump,
      state: programStateAccounts[0][1],
    };

    const queue = accounts.queues.get(queueAccount.publicKey.toBase58());
    if (!queue) {
      throw new Error(`Failed to find queue in program accounts`);
    }

    const queueDefinition: LoadedQueueDefinition = {
      account: queueAccount,
      state: queue,
    };

    const jobPublicKeys: Array<PublicKey> = [];

    // filter cranks
    const cranks: Array<LoadedCrankDefinition> = Array.from(accounts.cranks)
      .filter(([crankKey, crank]) =>
        crank.queuePubkey.equals(queueAccount.publicKey)
      )
      .map(([crankKey, crank]) => {
        return {
          account: new CrankAccount(program, crankKey),
          state: crank,
          dataBuffer: crank.dataBuffer,
        };
      });

    // filter oracles
    const oracles: Array<LoadedOracleDefinition> = Array.from(accounts.oracles)
      .filter(([oracleKey, oracle]) =>
        oracle.queuePubkey.equals(queueAccount.publicKey)
      )
      .map(([oracleKey, oracle]): LoadedOracleDefinition | undefined => {
        const oracleAccount = new OracleAccount(program, oracleKey);
        const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
          program,
          queue.authority,
          queueAccount.publicKey,
          oracleAccount.publicKey
        );
        const permission = accounts.permissions.get(
          permissionAccount.publicKey.toBase58()
        );
        if (!permission) {
          return undefined;
        }
        return {
          account: oracleAccount,
          state: oracle,
          permission: {
            account: permissionAccount,
            bump: permissionBump,
            state: permission,
          },
        };
      })
      .filter(Boolean) as Array<LoadedOracleDefinition>;

    const aggregators: Array<LoadedAggregatorDefinition> = Array.from(
      accounts.aggregators
    )
      .filter(([aggregatorKey, aggregator]) =>
        aggregator.queuePubkey.equals(queueAccount.publicKey)
      )
      .map(
        ([aggregatorKey, aggregator]):
          | LoadedAggregatorDefinition
          | undefined => {
          const aggregatorAccount = new AggregatorAccount(
            program,
            aggregatorKey
          );
          const [permissionAccount, permissionBump] =
            PermissionAccount.fromSeed(
              program,
              queue.authority,
              queueAccount.publicKey,
              aggregatorAccount.publicKey
            );
          const permission = accounts.permissions.get(
            permissionAccount.publicKey.toBase58()
          );
          if (!permission) {
            return undefined;
          }
          const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
            program,
            queueAccount.publicKey,
            aggregatorAccount.publicKey
          );
          const lease = accounts.leases.get(leaseAccount.publicKey.toBase58());
          if (!lease) {
            return undefined;
          }
          // push jobs to filter job definitions
          jobPublicKeys.push(
            ...aggregator.jobPubkeysData.slice(0, aggregator.jobPubkeysSize)
          );
          return {
            account: aggregatorAccount,
            state: aggregator,
            permission: {
              account: permissionAccount,
              bump: permissionBump,
              state: permission,
            },
            lease: {
              account: leaseAccount,
              bump: leaseBump,
              state: lease,
            },
          };
        }
      )
      .filter(Boolean) as Array<LoadedAggregatorDefinition>;

    // filter vrfs
    const vrfs: Array<LoadedVrfDefinition> = Array.from(accounts.vrfs)
      .filter(([vrfKey, vrf]) => vrf.oracleQueue.equals(queueAccount.publicKey))
      .map(([vrfKey, vrf]): LoadedVrfDefinition | undefined => {
        const vrfAccount = new VrfAccount(program, vrfKey);
        const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
          program,
          queue.authority,
          queueAccount.publicKey,
          vrfAccount.publicKey
        );
        const permission = accounts.permissions.get(
          permissionAccount.publicKey.toBase58()
        );
        if (!permission) {
          return undefined;
        }
        return {
          account: vrfAccount,
          state: vrf,
          permission: {
            account: permissionAccount,
            bump: permissionBump,
            state: permission,
          },
        };
      })
      .filter(Boolean) as Array<LoadedVrfDefinition>;

    // filter buffer relayers
    const bufferRelayers: Array<LoadedBufferRelayerDefinition> = Array.from(
      accounts.bufferRelayers
    )
      .filter(([bufferRelayerKey, bufferRelayer]) =>
        bufferRelayer.queuePubkey.equals(queueAccount.publicKey)
      )
      .map(
        ([bufferRelayerKey, bufferRelayer]):
          | LoadedBufferRelayerDefinition
          | undefined => {
          const bufferRelayerAccount = new BufferRelayerAccount(
            program,
            bufferRelayerKey
          );
          const [permissionAccount, permissionBump] =
            PermissionAccount.fromSeed(
              program,
              queue.authority,
              queueAccount.publicKey,
              bufferRelayerAccount.publicKey
            );
          const permission = accounts.permissions.get(
            permissionAccount.publicKey.toBase58()
          );
          if (!permission) {
            return undefined;
          }
          jobPublicKeys.push(bufferRelayer.jobPubkey);
          return {
            account: bufferRelayerAccount,
            state: bufferRelayer,
            permission: {
              account: permissionAccount,
              bump: permissionBump,
              state: permission,
            },
          };
        }
      )
      .filter(Boolean) as Array<LoadedBufferRelayerDefinition>;

    const jobs: Array<LoadedJobDefinition> = Array.from(accounts.jobs)
      .filter(
        ([jobKey]) =>
          jobPublicKeys.findIndex(j => j.equals(new PublicKey(jobKey))) !== -1
      )
      .map(([jobKey, job]): LoadedJobDefinition | undefined => {
        const jobAccount = new JobAccount(program, jobKey);
        let oracleJob: OracleJob;
        try {
          oracleJob = OracleJob.decodeDelimited(job.data);
        } catch {
          oracleJob = OracleJob.fromObject({ tasks: [] });
        }

        return {
          account: jobAccount,
          state: job,
          job: oracleJob,
        };
      })
      .filter(Boolean) as Array<LoadedJobDefinition>;

    return new LoadedSwitchboardNetwork({
      programState: programStateAccountDefinition,
      queue: queueDefinition,
      cranks,
      oracles,
      aggregators,
      vrfs,
      bufferRelayers,
      jobs,
    });
  }
}

/** LOADED ACCOUNTS */

/** The queue and associated accounts for the newly created Switchboard network. */
export interface ILoadedSwitchboardNetwork extends ISwitchboardNetwork {
  /** The {@linkcode ProgramStateAccount} and PDA bump. */
  programState: LoadedProgramStateDefinition;
  /** The {@linkcode QueueAccount} for the newly created Switchboard network. */
  queue: LoadedQueueDefinition;
  /** The {@linkcode CrankAccount}s for the newly created Switchboard network. */
  cranks: Array<LoadedCrankDefinition>;
  oracles: Array<LoadedOracleDefinition>;
  aggregators: Array<LoadedAggregatorDefinition>;
  vrfs: Array<LoadedVrfDefinition>;
  bufferRelayers: Array<LoadedBufferRelayerDefinition>;
  jobs: Array<LoadedJobDefinition>;
}

export class LoadedSwitchboardNetwork implements ILoadedSwitchboardNetwork {
  programState: LoadedProgramStateDefinition;
  queue: LoadedQueueDefinition;
  /** The {@linkcode CrankAccount}s for the newly created Switchboard network. */
  cranks: Array<LoadedCrankDefinition>;
  oracles: Array<LoadedOracleDefinition>;
  aggregators: Array<LoadedAggregatorDefinition>;
  vrfs: Array<LoadedVrfDefinition>;
  bufferRelayers: Array<LoadedBufferRelayerDefinition>;
  jobs: Array<LoadedJobDefinition>;

  get program(): SwitchboardProgram {
    return this.queue.account.program;
  }

  constructor(fields: ILoadedSwitchboardNetwork) {
    this.programState = fields.programState;
    this.queue = fields.queue;
    this.cranks = fields.cranks;
    this.oracles = fields.oracles;
    this.aggregators = fields.aggregators;
    this.vrfs = fields.vrfs;
    this.bufferRelayers = fields.bufferRelayers;
    this.jobs = fields.jobs;
  }

  getJob(jobPubkey: PublicKey): LoadedJobDefinition | undefined {
    return this.jobs.find(job => job.account.publicKey.equals(jobPubkey));
  }

  getJobs(jobPubkeys: Array<PublicKey>): Array<LoadedJobDefinition> {
    return jobPubkeys
      .map(jobPubkey => this.getJob(jobPubkey))
      .filter(Boolean) as Array<LoadedJobDefinition>;
  }

  toJSON() {
    return {
      programState: {
        publicKey: this.programState.account.publicKey.toBase58(),
        authority: this.programState.state.authority.toBase58(),
        state: this.programState.state.toJSON(),
      },
      queue: {
        publicKey: this.queue.account.publicKey.toBase58(),
        authority: this.queue.state.authority.toBase58(),
        state: this.queue.state.toJSON(),
      },
      cranks: this.cranks.map(crank => {
        return {
          publicKey: crank.account.publicKey.toBase58(),
          state: crank.state.toJSON(),
        };
      }),
      oracles: this.oracles.map(oracle => {
        return {
          publicKey: oracle.account.publicKey.toBase58(),
          authority: oracle.state.oracleAuthority.toBase58(),
          state: oracle.state.toJSON(),
          permission: {
            publicKey: oracle.permission.account.publicKey.toBase58(),
            bump: oracle.permission.bump,
            state: oracle.permission.state.toJSON(),
          },
        };
      }),
      aggregators: this.aggregators.map(aggregator => {
        return {
          publicKey: aggregator.account.publicKey.toBase58(),
          authority: aggregator.state.authority.toBase58(),
          state: {
            ...aggregator.state.toJSON(),
            reserved1: undefined,
            previousConfirmedRoundResult:
              aggregator.state.previousConfirmedRoundResult.toBig(),
            jobPubkeysData: aggregator.state.jobPubkeysData.slice(
              0,
              aggregator.state.jobPubkeysSize
            ),
            jobHashes: aggregator.state.jobHashes.slice(
              0,
              aggregator.state.jobPubkeysSize
            ),
            currentRound: undefined,
            latestConfirmedRound: undefined,
            ebuf: undefined,
          },
          permission: {
            publicKey: aggregator.permission.account.publicKey.toBase58(),
            bump: aggregator.permission.bump,
            state: aggregator.permission.state.toJSON(),
          },
          lease: {
            publicKey: aggregator.lease.account.publicKey.toBase58(),
            bump: aggregator.lease.bump,
            state: aggregator.lease.state.toJSON(),
          },
          jobs: this.getJobs(
            aggregator.state.jobPubkeysData.slice(
              0,
              aggregator.state.jobPubkeysSize
            )
          ).map(job => {
            return {
              publicKey: job.account.publicKey.toBase58(),
              authority: job.state.authority.toBase58(),
              state: job.state,
              data: job.job.toJSON(),
            };
          }),
        };
      }),
      vrfs: this.vrfs.map(vrf => {
        return {
          publicKey: vrf.account.publicKey.toBase58(),
          authority: vrf.state.authority.toBase58(),
          state: {
            ...vrf.state.toJSON(),
            ebuf: undefined,
            builders: undefined,
          },
          permission: {
            publicKey: vrf.permission.account.publicKey.toBase58(),
            bump: vrf.permission.bump,
            state: vrf.permission.state.toJSON(),
          },
        };
      }),
      bufferRelayers: this.bufferRelayers.map(bufferRelayer => {
        const job = this.getJob(bufferRelayer.state.jobPubkey);
        return {
          publicKey: bufferRelayer.account.publicKey.toBase58(),
          authority: bufferRelayer.state.authority.toBase58(),
          state: {
            ...bufferRelayer.state.toJSON(),
            currentRound: undefined,
            latestConfirmedRound: undefined,
          },
          permission: {
            publicKey: bufferRelayer.permission.account.publicKey.toBase58(),
            bump: bufferRelayer.permission.bump,
            state: bufferRelayer.permission.state.toJSON(),
          },
          job: {
            publicKey: job?.account.publicKey.toBase58(),
            authority: job?.state.authority.toBase58(),
            state: job?.state,
            data: job?.job.toJSON(),
          },
        };
      }),
    };
  }
}
