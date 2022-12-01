import * as errors from '../errors';
import * as types from '../generated';
import { Account, OnAccountChangeCallback } from './account';
import * as anchor from '@project-serum/anchor';
import { SwitchboardProgram } from '../program';
import {
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
 * @class OracleAccount
 * Account type holding an oracle's configuration including the authority and the reward/slashing wallet along with a set of metrics tracking its reliability.
 *
 * An oracle is a server that sits between the internet and a blockchain and facilitates the flow of information and is rewarded for responding with the honest majority.
 */
export class OracleAccount extends Account<types.OracleAccountData> {
  static accountName = 'OracleAccountData';

  /**
   * Get the size of an {@linkcode OracleAccount} on-chain.
   */
  public size = this.program.account.oracleAccountData.size;

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

  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: {
      queuePubkey: PublicKey;
    } & Partial<{
      mint: PublicKey;
      name: string;
      metadata: string;
      authority: Keypair; // defaults to payer
    }>
  ): Promise<[TransactionObject, OracleAccount]> {
    const tokenWallet = Keypair.generate();
    // console.log(`tokenWallet`, tokenWallet.publicKey.toBase58());

    const authority = params.authority?.publicKey ?? payer;

    const [oracleAccount, oracleBump] = OracleAccount.fromSeed(
      program,
      params.queuePubkey,
      tokenWallet.publicKey
    );

    const ixns = [
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
          queue: params.queuePubkey,
          payer,
          systemProgram: SystemProgram.programId,
        }
      ),
    ];

    return [
      new TransactionObject(
        payer,
        ixns,
        params.authority ? [tokenWallet, params.authority] : [tokenWallet]
      ),
      new OracleAccount(program, oracleAccount.publicKey),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: {
      queueAccount: QueueAccount;
    } & Partial<{
      name: string;
      metadata: string;
      mint: PublicKey;
      authority: Keypair; // defaults to payer
    }>
  ): Promise<[TransactionSignature, OracleAccount]> {
    let mint = params.mint;
    if (!mint) {
      const queue = await params.queueAccount.loadData();
      mint = queue.mint.equals(PublicKey.default)
        ? spl.NATIVE_MINT
        : queue.mint;
    }

    const [txnObject, oracleAccount] = await OracleAccount.createInstructions(
      program,
      program.walletPubkey,
      {
        queuePubkey: params.queueAccount.publicKey,
        mint: mint,
        name: params.name,
        metadata: params.metadata,
        authority: params.authority,
      }
    );

    const txnSignature = await program.signAndSend(txnObject);

    return [txnSignature, oracleAccount];
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

  onChange(callback: OnAccountChangeCallback<types.OracleAccountData>): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => {
        callback(this.decode(accountInfo.data));
      }
    );
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

  async heartbeat(params: {
    queueAccount: QueueAccount;
    tokenWallet?: PublicKey;
    queueAuthority?: PublicKey;
    queue?: types.OracleQueueAccountData;
    permission?: [PermissionAccount, number];
    authority?: Keypair;
  }): Promise<TransactionSignature> {
    const tokenWallet =
      params.tokenWallet ?? (await this.loadData()).tokenAccount;

    const queue = params.queue ?? (await params.queueAccount.loadData());
    const oracles = await params.queueAccount.loadOracles(queue);

    let lastPubkey = this.publicKey;
    if (queue.size !== 0) {
      lastPubkey = oracles[queue.gcIdx];
    }

    const [permissionAccount, permissionBump] =
      params.permission ??
      PermissionAccount.fromSeed(
        this.program,
        params.queueAuthority ?? queue.authority,
        params.queueAccount.publicKey,
        this.publicKey
      );
    try {
      await permissionAccount.loadData();
    } catch (_) {
      throw new Error(
        'A requested oracle permission pda account has not been initialized.'
      );
    }

    const heartbeatTxn = new TransactionObject(
      this.program.walletPubkey,
      [
        this.heartbeatInstruction(this.program.walletPubkey, {
          tokenWallet: tokenWallet,
          gcOracle: lastPubkey,
          oracleQueue: params.queueAccount.publicKey,
          dataBuffer: queue.dataBuffer,
          permission: [permissionAccount, permissionBump],
          authority: params.authority ? params.authority.publicKey : undefined,
        }),
      ],
      params.authority ? [params.authority] : []
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
