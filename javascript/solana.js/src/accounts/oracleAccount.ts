import * as anchor from '@coral-xyz/anchor';
import * as spl from '@solana/spl-token';
import {
  AccountInfo,
  Commitment,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common';
import * as errors from '../errors';
import * as types from '../generated';
import { SwitchboardProgram } from '../SwitchboardProgram';
import {
  TransactionObject,
  TransactionObjectOptions,
} from '../TransactionObject';
import { Account, OnAccountChangeCallback } from './account';
import { PermissionAccount } from './permissionAccount';
import { QueueAccount } from './queueAccount';

/**
 * Account type holding an oracle's configuration including the authority and the reward/slashing wallet along with a set of metrics tracking its reliability.
 *
 * An oracle is a server that sits between the internet and a blockchain and facilitates the flow of information and is rewarded for responding with the honest majority.
 *
 * Data: {@linkcode types.OracleAccountData}
 */
export class OracleAccount extends Account<types.OracleAccountData> {
  static accountName = 'OracleAccountData';

  public static size = 636;

  /**
   * Get the size of an {@linkcode OracleAccount} on-chain.
   */
  public size = this.program.account.oracleAccountData.size;

  /**
   * Return an oracle account state initialized to the default values.
   */
  public static default(): types.OracleAccountData {
    const buffer = Buffer.alloc(OracleAccount.size, 0);
    types.OracleAccountData.discriminator.copy(buffer, 0);
    return types.OracleAccountData.decode(buffer);
  }

  /**
   * Create a mock account info for a given oracle config. Useful for test integrations.
   */
  public static createMock(
    programId: PublicKey,
    data: Partial<types.OracleAccountData>,
    options?: {
      lamports?: number;
      rentEpoch?: number;
    }
  ): AccountInfo<Buffer> {
    const fields: types.OracleAccountDataFields = {
      ...OracleAccount.default(),
      ...data,
      // any cleanup actions here
    };
    const state = new types.OracleAccountData(fields);

    const buffer = Buffer.alloc(OracleAccount.size, 0);
    types.OracleAccountData.discriminator.copy(buffer, 0);
    types.OracleAccountData.layout.encode(state, buffer, 8);

    return {
      executable: false,
      owner: programId,
      lamports: options?.lamports ?? 1 * LAMPORTS_PER_SOL,
      data: buffer,
      rentEpoch: options?.rentEpoch ?? 0,
    };
  }

  /** Load an existing OracleAccount with its current on-chain state */
  public static async load(
    program: SwitchboardProgram,
    publicKey: PublicKey | string
  ): Promise<[OracleAccount, types.OracleAccountData]> {
    const account = new OracleAccount(
      program,
      typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey
    );
    const state = await account.loadData();
    return [account, state];
  }

  decode(data: Buffer): types.OracleAccountData {
    try {
      return types.OracleAccountData.decode(data);
    } catch {
      return this.program.coder.decode<types.OracleAccountData>(
        OracleAccount.accountName,
        data
      );
    }
  }

  /**
   * Invoke a callback each time an OracleAccount's data has changed on-chain.
   * @param callback - the callback invoked when the oracle state changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  onChange(
    callback: OnAccountChangeCallback<types.OracleAccountData>,
    commitment: Commitment = 'confirmed'
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => callback(this.decode(accountInfo.data)),
      commitment
    );
  }

  async fetchBalance(stakingWallet?: PublicKey): Promise<number> {
    const tokenAccount = stakingWallet ?? (await this.loadData()).tokenAccount;
    const amount = await this.program.mint.fetchBalance(tokenAccount);
    if (amount === null) {
      throw new Error(`Failed to fetch oracle staking wallet balance`);
    }
    return amount;
  }

  async fetchBalanceBN(stakingWallet?: PublicKey): Promise<BN> {
    const tokenAccount = stakingWallet ?? (await this.loadData()).tokenAccount;
    const amount = await this.program.mint.fetchBalanceBN(tokenAccount);
    if (amount === null) {
      throw new Error(`Failed to fetch oracle staking wallet balance`);
    }
    return amount;
  }

  /**
   * Retrieve and decode the {@linkcode types.OracleAccountData} stored in this account.
   */
  public async loadData(): Promise<types.OracleAccountData> {
    const data = await types.OracleAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null)
      throw new errors.AccountNotFoundError('Oracle', this.publicKey);
    return data;
  }

  /**
   * Loads an OracleAccount from the expected PDA seed format.
   * @param program The Switchboard program for the current connection.
   * @param queue The queue pubkey to be incorporated into the account seed.
   * @param wallet The oracles token wallet to be incorporated into the account seed.
   * @return OracleAccount and PDA bump.
   */
  public static fromSeed(
    program: SwitchboardProgram,
    queue: PublicKey,
    wallet: PublicKey
  ): [OracleAccount, number] {
    const [publicKey, bump] = anchor.utils.publicKey.findProgramAddressSync(
      [Buffer.from('OracleAccountData'), queue.toBuffer(), wallet.toBuffer()],
      program.programId
    );
    return [new OracleAccount(program, publicKey), bump];
  }

  public async getPermissions(
    _oracle?: types.OracleAccountData,
    _queueAccount?: QueueAccount,
    _queue?: types.OracleQueueAccountData
  ): Promise<[PermissionAccount, number, types.PermissionAccountData]> {
    const oracle = _oracle ?? (await this.loadData());
    const queueAccount =
      _queueAccount ?? new QueueAccount(this.program, oracle.queuePubkey);
    const queue = _queue ?? (await queueAccount.loadData());
    const [permissionAccount, permissionBump] = this.getPermissionAccount(
      queueAccount.publicKey,
      queue.authority
    );
    const permission = await permissionAccount.loadData();
    return [permissionAccount, permissionBump, permission];
  }

  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: {
      queueAccount: QueueAccount;
    } & OracleInitParams &
      Partial<OracleStakeParams>
  ): Promise<[OracleAccount, Array<TransactionObject>]> {
    const txns: Array<TransactionObject> = [];

    const tokenWallet = params.stakingWalletKeypair ?? Keypair.generate();

    const authority = params.authority?.publicKey ?? payer;

    const [oracleAccount, oracleBump] = OracleAccount.fromSeed(
      program,
      params.queueAccount.publicKey,
      tokenWallet.publicKey
    );

    const oracleInit = new TransactionObject(
      payer,
      [
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: tokenWallet.publicKey,
          space: spl.ACCOUNT_SIZE,
          lamports: await program.connection.getMinimumBalanceForRentExemption(
            spl.ACCOUNT_SIZE
          ),
          programId: spl.TOKEN_PROGRAM_ID,
        }),
        spl.createInitializeAccountInstruction(
          tokenWallet.publicKey,
          program.mint.address,
          authority
        ),
        spl.createSetAuthorityInstruction(
          tokenWallet.publicKey,
          authority,
          spl.AuthorityType.AccountOwner,
          program.programState.publicKey
        ),
        types.oracleInit(
          program,
          {
            params: {
              name: new Uint8Array(
                Buffer.from(params.name ?? '', 'utf8').slice(0, 32)
              ),
              metadata: new Uint8Array(
                Buffer.from(params.metadata ?? '', 'utf8').slice(0, 128)
              ),
              oracleBump,
              stateBump: program.programState.bump,
            },
          },
          {
            oracle: oracleAccount.publicKey,
            oracleAuthority: authority,
            wallet: tokenWallet.publicKey,
            programState: program.programState.publicKey,
            queue: params.queueAccount.publicKey,
            payer,
            systemProgram: SystemProgram.programId,
          }
        ),
      ],
      params.authority ? [params.authority, tokenWallet] : [tokenWallet]
    );

    txns.push(oracleInit);

    if (params.stakeAmount && params.stakeAmount > 0) {
      const depositTxn = await oracleAccount.stakeInstructions(payer, {
        ...params,
        tokenAccount: tokenWallet.publicKey,
        stakeAmount: params.stakeAmount ?? 0,
      });
      txns.push(depositTxn);
    }

    return [oracleAccount, TransactionObject.pack(txns)];
  }

  public static async create(
    program: SwitchboardProgram,
    params: {
      queueAccount: QueueAccount;
    } & OracleInitParams &
      Partial<OracleStakeParams>
  ): Promise<[OracleAccount, Array<TransactionSignature>]> {
    const [oracleAccount, txns] = await OracleAccount.createInstructions(
      program,
      program.walletPubkey,
      params
    );

    const signatures = await program.signAndSendAll(txns);

    return [oracleAccount, signatures];
  }

  stakeInstruction(
    stakeAmount: number,
    oracleStakingWallet: PublicKey,
    funderTokenWallet: PublicKey,
    funderAuthority: PublicKey
  ) {
    if (stakeAmount <= 0) {
      throw new Error(`stake amount should be greater than 0`);
    }
    return spl.createTransferInstruction(
      funderTokenWallet,
      oracleStakingWallet,
      funderAuthority,
      this.program.mint.toTokenAmount(stakeAmount)
    );
  }

  async stakeInstructions(
    payer: PublicKey,
    params: OracleStakeParams & { tokenAccount?: PublicKey }
  ): Promise<TransactionObject> {
    const txns: Array<TransactionObject> = [];

    if (!params.stakeAmount || params.stakeAmount <= 0) {
      throw new Error(`stake amount should be greater than 0`);
    }

    const tokenWallet =
      params.tokenAccount ?? (await this.loadData()).tokenAccount;

    const owner = params.funderAuthority
      ? params.funderAuthority.publicKey
      : payer;

    let funderTokenWallet: PublicKey;
    if (params.disableWrap) {
      funderTokenWallet =
        params.funderTokenWallet ??
        this.program.mint.getAssociatedAddress(owner);
    } else {
      let tokenTxn: TransactionObject | undefined;
      // now we need to wrap some funds
      if (params.funderTokenWallet) {
        funderTokenWallet = params.funderTokenWallet;
        tokenTxn = await this.program.mint.wrapInstructions(
          payer,
          {
            fundUpTo: params.stakeAmount ?? 0,
          },
          params.funderAuthority
        );
      } else {
        [funderTokenWallet, tokenTxn] =
          await this.program.mint.getOrCreateWrappedUserInstructions(
            payer,
            { fundUpTo: params.stakeAmount ?? 0 },
            params.funderAuthority
          );
      }

      if (tokenTxn) {
        txns.push(tokenTxn);
      }
    }

    const transferTxn = new TransactionObject(
      payer,
      [
        spl.createTransferInstruction(
          funderTokenWallet,
          tokenWallet,
          params.funderAuthority ? params.funderAuthority.publicKey : payer,
          this.program.mint.toTokenAmount(params.stakeAmount)
        ),
      ],
      params.funderAuthority ? [params.funderAuthority] : []
    );
    txns.push(transferTxn);

    const packed = TransactionObject.pack(txns);
    if (packed.length > 1) {
      throw new Error(`Failed to pack transactions into a single transactions`);
    }

    return packed[0];
  }

  async stake(
    params: OracleStakeParams & { tokenAccount?: PublicKey }
  ): Promise<TransactionSignature> {
    const stakeTxn = await this.stakeInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(stakeTxn);
    return txnSignature;
  }

  heartbeatInstruction(
    payer: PublicKey,
    params: {
      tokenWallet: PublicKey;
      gcOracle: PublicKey;
      oracleQueue: PublicKey;
      dataBuffer: PublicKey;
      permission: [PermissionAccount, number];
      authority?: PublicKey;
    }
  ): anchor.web3.TransactionInstruction {
    const [permissionAccount, permissionBump] = params.permission;

    return types.oracleHeartbeat(
      this.program,
      { params: { permissionBump } },
      {
        oracle: this.publicKey,
        oracleAuthority: params.authority ?? payer,
        tokenAccount: params.tokenWallet,
        gcOracle: params.gcOracle,
        oracleQueue: params.oracleQueue,
        permission: permissionAccount.publicKey,
        dataBuffer: params.dataBuffer,
      }
    );
  }

  async heartbeat(
    params?: {
      queueAccount: QueueAccount;
      tokenWallet?: PublicKey;
      queueAuthority?: PublicKey;
      queue?: types.OracleQueueAccountData;
      permission?: [PermissionAccount, number];
      authority?: Keypair;
    },
    opts?: TransactionObjectOptions
  ): Promise<TransactionSignature> {
    const oracle = await this.loadData();
    const tokenWallet = params?.tokenWallet ?? oracle.tokenAccount;

    const queueAccount =
      params?.queueAccount ??
      new QueueAccount(this.program, oracle.queuePubkey);

    const queue = params?.queue ?? (await queueAccount.loadData());
    const oracles = await queueAccount.loadOracles();

    let lastPubkey = this.publicKey;
    if (oracles.length !== 0) {
      lastPubkey = oracles[queue.gcIdx];
    }

    const [permissionAccount, permissionBump] =
      params?.permission ??
      this.getPermissionAccount(queueAccount.publicKey, queue.authority);

    try {
      await permissionAccount.loadData();
    } catch (_) {
      throw new Error(
        'A requested oracle permission pda account has not been initialized.'
      );
    }

    if (
      params?.authority &&
      !oracle.oracleAuthority.equals(params.authority.publicKey)
    ) {
      throw new errors.IncorrectAuthority(
        oracle.oracleAuthority,
        params.authority.publicKey
      );
    }

    const heartbeatTxn = new TransactionObject(
      this.program.walletPubkey,
      [
        this.heartbeatInstruction(this.program.walletPubkey, {
          tokenWallet: tokenWallet,
          gcOracle: lastPubkey,
          oracleQueue: queueAccount.publicKey,
          dataBuffer: queue.dataBuffer,
          permission: [permissionAccount, permissionBump],
          authority: oracle.oracleAuthority,
        }),
      ],
      params?.authority ? [params.authority] : [],
      opts
    );

    const txnSignature = await this.program.signAndSend(heartbeatTxn);
    return txnSignature;
  }

  async withdrawInstruction(
    payer: PublicKey,
    params: OracleWithdrawParams,
    opts?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const tokenAmount = this.program.mint.toTokenAmountBN(params.amount);

    const oracle = await this.loadData();
    const queueAccount = new QueueAccount(this.program, oracle.queuePubkey);
    const queue = await queueAccount.loadData();

    const [permissionAccount, permissionBump] = await this.getPermissions(
      oracle,
      queueAccount,
      queue
    );

    if (params.unwrap) {
      const ephemeralWallet = Keypair.generate();

      const ixns = [
        // initialize space for ephemeral token account
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: ephemeralWallet.publicKey,
          lamports:
            await this.program.connection.getMinimumBalanceForRentExemption(
              spl.ACCOUNT_SIZE
            ),
          space: spl.ACCOUNT_SIZE,
          programId: spl.TOKEN_PROGRAM_ID,
        }),
        // initialize ephemeral token account
        spl.createInitializeAccountInstruction(
          ephemeralWallet.publicKey,
          this.program.mint.address,
          payer,
          spl.TOKEN_PROGRAM_ID
        ),
        types.oracleWithdraw(
          this.program,
          {
            params: {
              stateBump: this.program.programState.bump,
              permissionBump,
              amount: tokenAmount,
            },
          },
          {
            oracle: this.publicKey,
            oracleAuthority: oracle.oracleAuthority,
            tokenAccount: oracle.tokenAccount,
            withdrawAccount: ephemeralWallet.publicKey,
            oracleQueue: queueAccount.publicKey,
            permission: permissionAccount.publicKey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            programState: this.program.programState.publicKey,
            payer: payer,
            systemProgram: SystemProgram.programId,
          }
        ),
        spl.createCloseAccountInstruction(
          ephemeralWallet.publicKey,
          oracle.oracleAuthority,
          payer
        ),
      ];

      const txn = new TransactionObject(
        payer,
        ixns,
        params.authority
          ? [params.authority, ephemeralWallet]
          : [ephemeralWallet],
        opts
      );
      return txn;
    }

    const withdrawAccount =
      params.withdrawAccount ?? this.program.mint.getAssociatedAddress(payer);

    const withdrawIxn = types.oracleWithdraw(
      this.program,
      {
        params: {
          stateBump: this.program.programState.bump,
          permissionBump,
          amount: tokenAmount,
        },
      },
      {
        oracle: this.publicKey,
        oracleAuthority: oracle.oracleAuthority,
        tokenAccount: oracle.tokenAccount,
        withdrawAccount: withdrawAccount,
        oracleQueue: queueAccount.publicKey,
        permission: permissionAccount.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        programState: this.program.programState.publicKey,
        payer: payer,
        systemProgram: SystemProgram.programId,
      }
    );

    return new TransactionObject(
      payer,
      [withdrawIxn],
      params.authority ? [params.authority] : [],
      opts
    );
  }

  async withdraw(
    params: OracleWithdrawParams,
    opts?: TransactionObjectOptions
  ): Promise<TransactionSignature> {
    const withdrawTxn = await this.withdrawInstruction(
      this.program.walletPubkey,
      params,
      opts
    );
    const txnSignature = await this.program.signAndSend(withdrawTxn);
    return txnSignature;
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

  public async toAccountsJSON(
    _oracle?: types.OracleAccountData & { balance: number },
    _permissionAccount?: PermissionAccount,
    _permission?: types.PermissionAccountData
  ): Promise<OracleAccountsJSON> {
    const oracle = _oracle ?? (await this.loadData());
    let permissionAccount = _permissionAccount;
    let permission = _permission;
    if (!permissionAccount || !permission) {
      const queueAccount = new QueueAccount(this.program, oracle.queuePubkey);
      const queue = await queueAccount.loadData();
      [permissionAccount] = this.getPermissionAccount(
        queueAccount.publicKey,
        queue.authority
      );
      permission = await permissionAccount.loadData();
    }

    const oracleBalance =
      (await this.program.mint.fetchBalance(oracle.tokenAccount)) ?? 0;

    return {
      publicKey: this.publicKey,
      balance: oracleBalance,
      ...oracle.toJSON(),
      permission: {
        publicKey: permissionAccount.publicKey,
        ...permission.toJSON(),
      },
    };
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    publicKeys: Array<PublicKey>,
    commitment: Commitment = 'confirmed'
  ): Promise<
    Array<{
      account: OracleAccount;
      data: types.OracleAccountData;
    }>
  > {
    const oracles: Array<{
      account: OracleAccount;
      data: types.OracleAccountData;
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
        const account = new OracleAccount(program, accountInfo.publicKey);
        const data = types.OracleAccountData.decode(accountInfo.account.data);
        oracles.push({ account, data });
        // eslint-disable-next-line no-empty
      } catch {}
    }

    return oracles;
  }
}

export interface OracleInitParams {
  /** Name of the oracle for easier identification. */
  name?: string;
  /** Metadata of the oracle for easier identification. */
  metadata?: string;
  /** Alternative keypair that will be the authority for the oracle. If not set the payer will be used. */
  authority?: Keypair;
  /**
   * Optional,
   */
  stakingWalletKeypair?: Keypair;
}

export interface OracleStakeParams {
  /** The amount of funds to deposit into the oracle's staking wallet. The oracle must have the {@linkcode QueueAccount} minStake before being permitted to heartbeat and join the queue. */
  stakeAmount: number;
  /** The tokenAccount for the account funding the staking wallet. Will default to the payer's associatedTokenAccount if not provided. */
  funderTokenWallet?: PublicKey;
  /** The funderTokenWallet authority for approving the transfer of funds from the funderTokenWallet into the oracle staking wallet. Will default to the payer if not provided. */
  funderAuthority?: Keypair;

  /** Do not wrap funds if funderTokenWallet is missing funds */
  disableWrap?: boolean;
}

// export interface OracleWithdrawParams {
//   /** The amount of tokens to withdraw from the oracle staking wallet. Ex: 1.25 would withdraw 1250000000 wSOL tokens from the staking wallet */
//   amount: number;
//   /** SPL token account where the tokens will be sent. Defaults to the payers associated token account. */
//   withdrawAccount?: PublicKey;
//   /** Alternative keypair that is the oracle authority and required to withdraw from the staking wallet. */
//   authority?: Keypair;
// }

export type OracleAccountsJSON = types.OracleAccountDataJSON & {
  publicKey: PublicKey;
  balance: number;
  permission: types.PermissionAccountDataJSON & { publicKey: PublicKey };
};

export interface OracleWithdrawBaseParams {
  /** The amount of tokens to withdraw from the oracle staking wallet. Ex: 1.25 would withdraw 1250000000 wSOL tokens from the staking wallet */
  amount: number;
  /** Unwrap funds directly to oracle authority */
  unwrap: boolean;
  /** Alternative keypair that is the oracle authority and required to withdraw from the staking wallet. */
  authority?: Keypair;
}

export interface OracleWithdrawUnwrapParams extends OracleWithdrawBaseParams {
  unwrap: true;
}

export interface OracleWithdrawWalletParams extends OracleWithdrawBaseParams {
  unwrap: false;
  /** SPL token account where the tokens will be sent. Defaults to the payers associated token account. */
  withdrawAccount?: PublicKey;
}

export type OracleWithdrawParams =
  | OracleWithdrawUnwrapParams
  | OracleWithdrawWalletParams;
