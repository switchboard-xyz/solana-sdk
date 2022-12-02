import * as errors from '../errors';
import * as types from '../generated';
import { Account, OnAccountChangeCallback } from './account';
import * as anchor from '@project-serum/anchor';
import { SwitchboardProgram } from '../program';
import {
  Commitment,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { PermissionAccount } from './permissionAccount';
import { QueueAccount } from './queueAccount';
import * as spl from '@solana/spl-token';
import { TransactionObject } from '../transaction';

/**
 * Account type holding an oracle's configuration including the authority and the reward/slashing wallet along with a set of metrics tracking its reliability.
 *
 * An oracle is a server that sits between the internet and a blockchain and facilitates the flow of information and is rewarded for responding with the honest majority.
 *
 * Data: {@linkcode types.OracleAccountData}
 */
export class OracleAccount extends Account<types.OracleAccountData> {
  static accountName = 'OracleAccountData';

  /**
   * Get the size of an {@linkcode OracleAccount} on-chain.
   */
  public size = this.program.account.oracleAccountData.size;

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

  /**
   * Retrieve and decode the {@linkcode types.OracleAccountData} stored in this account.
   */
  public async loadData(): Promise<types.OracleAccountData> {
    const data = await types.OracleAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
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

  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: {
      queueAccount: QueueAccount;
    } & OracleInitParams &
      OracleStakeParams
  ): Promise<[OracleAccount, TransactionObject]> {
    const tokenWallet = Keypair.generate();

    const authority = params.authority?.publicKey ?? payer;

    const txns: TransactionObject[] = [];

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
        stakeAmount: params.stakeAmount,
        funderAuthority: params.funderAuthority,
        funderTokenAccount: params.funderTokenAccount,
        tokenAccount: tokenWallet.publicKey,
      });
      txns.push(depositTxn);
    }

    const packed = TransactionObject.pack(txns);
    if (packed.length > 1) {
      throw new Error(`Expected a single TransactionObject`);
    }

    return [oracleAccount, packed[0]];
  }

  public static async create(
    program: SwitchboardProgram,
    params: {
      queueAccount: QueueAccount;
    } & OracleInitParams &
      OracleStakeParams
  ): Promise<[OracleAccount, TransactionSignature]> {
    const [oracleAccount, txnObject] = await OracleAccount.createInstructions(
      program,
      program.walletPubkey,
      params
    );

    const txnSignature = await program.signAndSend(txnObject);

    return [oracleAccount, txnSignature];
  }

  async stakeInstructions(
    payer: PublicKey,
    params: OracleStakeParams & { tokenAccount?: PublicKey }
  ): Promise<TransactionObject> {
    if (!params.stakeAmount || params.stakeAmount <= 0) {
      throw new Error(`stake amount should be greater than 0`);
    }

    const tokenWallet =
      params.tokenAccount ?? (await this.loadData()).tokenAccount;

    const funderAuthority = params.funderAuthority?.publicKey ?? payer;
    // const funderTokenAccount =
    //   this.program.mint.getAssociatedAddress(funderAuthority);
    // const funderTokenAccountInfo = await this.program.connection.getAccountInfo(
    //   funderTokenAccount
    // );

    const [funderTokenAccount, wrapFundsTxn] =
      await this.program.mint.getOrCreateWrappedUserInstructions(
        payer,
        { fundUpTo: params.stakeAmount },
        params.funderAuthority
      );

    // if (!funderTokenAccountInfo) {
    //   let userTokenAccount: PublicKey;
    //   [userTokenAccount, wrapFundsTxn] =
    //     await this.program.mint.createWrappedUserInstructions(
    //       payer,
    //       params.stakeAmount,
    //       params.funderAuthority
    //     );
    // } else {
    //   wrapFundsTxn = await this.program.mint.wrapInstructions(
    //     payer,
    //     { amount: params.stakeAmount },
    //     params.funderAuthority
    //   );
    // }

    wrapFundsTxn.add(
      spl.createTransferInstruction(
        funderTokenAccount,
        tokenWallet,
        funderAuthority,
        this.program.mint.toTokenAmount(params.stakeAmount)
      )
    );

    return wrapFundsTxn;
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

  async heartbeat(params?: {
    queueAccount: QueueAccount;
    tokenWallet?: PublicKey;
    queueAuthority?: PublicKey;
    queue?: types.OracleQueueAccountData;
    permission?: [PermissionAccount, number];
    authority?: Keypair;
  }): Promise<TransactionSignature> {
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
      PermissionAccount.fromSeed(
        this.program,
        queue.authority,
        queueAccount.publicKey,
        this.publicKey
      );
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
      params?.authority ? [params.authority] : []
    );

    const txnSignature = await this.program.signAndSend(heartbeatTxn);
    return txnSignature;
  }

  withdrawInstruction(
    payer: PublicKey,
    params: {
      amount: anchor.BN;
      oracle: types.OracleAccountData;
      withdrawAccount: PublicKey;
      permission: [PermissionAccount, number];
      authority?: Keypair;
    }
  ): TransactionInstruction {
    const [permissionAccount, permissionBump] = params.permission;

    return types.oracleWithdraw(
      this.program,
      {
        params: {
          stateBump: this.program.programState.bump,
          permissionBump,
          amount: params.amount,
        },
      },
      {
        oracle: this.publicKey,
        oracleAuthority: params.oracle.oracleAuthority,
        tokenAccount: params.oracle.tokenAccount,
        withdrawAccount: params.withdrawAccount,
        oracleQueue: params.oracle.queuePubkey,
        permission: permissionAccount.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        programState: this.program.programState.publicKey,
        payer: payer,
        systemProgram: SystemProgram.programId,
      }
    );
  }

  async withdraw(
    params: {
      amount: anchor.BN;
      withdrawAccount: PublicKey;
    } & Partial<{
      oracle: types.OracleAccountData;
      permission: [PermissionAccount, number];
      queue: types.OracleQueueAccountData;
      authority?: Keypair;
    }>
  ): Promise<TransactionSignature> {
    const oracle = params.oracle ?? (await this.loadData());

    let permissionAccount: PermissionAccount;
    let permissionBump: number;

    if (params.permission) {
      [permissionAccount, permissionBump] = params.permission;
    } else {
      const queue =
        params.queue ??
        (await new QueueAccount(this.program, oracle.queuePubkey).loadData());
      const permission = PermissionAccount.fromSeed(
        this.program,
        queue.authority,
        oracle.queuePubkey,
        this.publicKey
      );
      try {
        await permission[0].loadData();
      } catch (_) {
        throw new Error(
          'A requested oracle permission pda account has not been initialized.'
        );
      }
      permissionAccount = permission[0];
      permissionBump = permission[1];
    }

    const withdrawTxn = new TransactionObject(
      this.program.walletPubkey,
      [
        this.withdrawInstruction(this.program.walletPubkey, {
          amount: params.amount,
          withdrawAccount: params.withdrawAccount,
          oracle,
          permission: [permissionAccount, permissionBump],
          authority: params.authority,
        }),
      ],
      params.authority ? [params.authority] : []
    );

    const txnSignature = await this.program.signAndSend(withdrawTxn);
    return txnSignature;
  }
}

export interface OracleInitParams {
  /** Name of the oracle for easier identification. */
  name?: string;
  /** Metadata of the oracle for easier identification. */
  metadata?: string;
  /** Alternative keypair that will be the authority for the oracle. If not set the payer will be used. */
  authority?: Keypair;
}

export interface OracleStakeParams {
  /** The amount of funds to deposit into the oracle's staking wallet. The oracle must have the {@linkcode QueueAccount} minStake before being permitted to heartbeat and join the queue. */
  stakeAmount?: number;
  /** The tokenAccount for the account funding the staking wallet. Will default to the payer's associatedTokenAccount if not provided. */
  funderTokenAccount?: PublicKey;
  /** The funderTokenAccount authority for approving the transfer of funds from the funderTokenAccount into the oracle staking wallet. Will default to the payer if not provided. */
  funderAuthority?: Keypair;
}
