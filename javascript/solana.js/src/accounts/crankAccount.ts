import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  AccountInfo,
  AccountMeta,
  Commitment,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';
import * as errors from '../errors';
import * as types from '../generated';
import { SwitchboardProgram } from '../program';
import { TransactionObject } from '../transaction';
import { Account, OnAccountChangeCallback } from './account';
import { AggregatorAccount } from './aggregatorAccount';
import { QueueAccount } from './queueAccount';

/**
 * A Switchboard account representing a crank of aggregators ordered by next update time.
 */
export class CrankAccount extends Account<types.CrankAccountData> {
  static accountName = 'CrankAccountData';

  /** The public key of the crank's data buffer storing a priority queue of {@linkcode AggregatorAccount}'s and their next available update timestamp */
  dataBuffer?: PublicKey;

  /**
   * Get the size of an {@linkcode CrankAccount} on-chain.
   */
  public size = this.program.account.crankAccountData.size;

  onChange(
    callback: OnAccountChangeCallback<types.CrankAccountData>,
    commitment: Commitment = 'confirmed'
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => callback(types.CrankAccountData.decode(accountInfo.data)),
      commitment
    );
  }

  onBufferChange(
    callback: OnAccountChangeCallback<Array<types.CrankRow>>,
    _dataBuffer?: PublicKey,
    commitment: Commitment = 'confirmed'
  ): number {
    const buffer = this.dataBuffer ?? _dataBuffer;
    if (!buffer) {
      throw new Error(
        `No crank dataBuffer provided. Call crankAccount.loadData() or pass it to this function in order to watch the account for changes`
      );
    }
    return this.program.connection.onAccountChange(
      buffer,
      accountInfo => callback(CrankAccount.decodeBuffer(accountInfo)),
      commitment
    );
  }

  /**
   * Retrieve and decode the {@linkcode types.CrankAccountData} stored in this account.
   */
  public async loadData(): Promise<types.CrankAccountData> {
    const data = await types.CrankAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    this.dataBuffer = data.dataBuffer;
    return data;
  }

  public static decodeBuffer(
    bufferAccountInfo: AccountInfo<Buffer>
  ): Array<types.CrankRow> {
    const buffer = bufferAccountInfo.data.slice(8) ?? Buffer.from('');
    const maxRows = Math.floor(buffer.byteLength / 40);

    const pqData: Array<types.CrankRow> = [];

    for (let i = 0; i < maxRows * 40; i += 40) {
      if (buffer.byteLength - i < 40) {
        break;
      }

      const rowBuf = buffer.slice(i, i + 40);
      const pubkey = new PublicKey(rowBuf.slice(0, 32));
      if (pubkey.equals(PublicKey.default)) {
        break;
      }

      const nextTimestamp = new anchor.BN(rowBuf.slice(32, 40), 'le');
      pqData.push(new types.CrankRow({ pubkey, nextTimestamp }));
    }

    return pqData;
  }

  public async loadCrank(
    sorted = false,
    commitment: Commitment = 'confirmed'
  ): Promise<Array<types.CrankRow>> {
    // Can we do this in a single RPC call? Do we need pqSize?
    const dataBuffer = this.dataBuffer ?? (await this.loadData()).dataBuffer;
    const bufferAccountInfo = await this.program.connection.getAccountInfo(
      dataBuffer,
      { commitment }
    );
    if (bufferAccountInfo === null) {
      throw new errors.AccountNotFoundError(dataBuffer);
    }

    const pqData = CrankAccount.decodeBuffer(bufferAccountInfo);

    if (sorted) {
      return pqData.sort((a, b) => a.nextTimestamp.cmp(b.nextTimestamp));
    }

    return pqData;
  }

  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: CrankInitParams
  ): Promise<[TransactionObject, CrankAccount]> {
    const crankAccount = params.keypair ?? Keypair.generate();
    const buffer = anchor.web3.Keypair.generate();
    const maxRows = params.maxRows ?? 500;
    const crankSize = maxRows * 40 + 8;

    const crankInit = new TransactionObject(
      payer,
      [
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: buffer.publicKey,
          space: crankSize,
          lamports: await program.connection.getMinimumBalanceForRentExemption(
            crankSize
          ),
          programId: program.programId,
        }),
        types.crankInit(
          program,
          {
            params: {
              name: Buffer.from(params.name ?? '').slice(0, 32),
              metadata: Buffer.from(params.metadata ?? '').slice(0, 64),
              crankSize: maxRows,
            },
          },
          {
            crank: crankAccount.publicKey,
            queue: params.queueAccount.publicKey,
            buffer: buffer.publicKey,
            systemProgram: SystemProgram.programId,
            payer: payer,
          }
        ),
      ],
      [crankAccount, buffer]
    );

    return [crankInit, new CrankAccount(program, crankAccount.publicKey)];
  }

  public static async create(
    program: SwitchboardProgram,
    params: CrankInitParams
  ): Promise<[TransactionSignature, CrankAccount]> {
    const [crankInit, crankAccount] = await CrankAccount.createInstructions(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(crankInit);
    return [txnSignature, crankAccount];
  }

  public async popInstruction(
    payer: PublicKey,
    params: CrankPopParams
  ): Promise<TransactionObject> {
    const next = params.readyPubkeys ?? (await this.peakNextReady(5));
    if (next.length === 0) throw new Error('Crank is not ready to be turned.');

    const remainingAccounts: PublicKey[] = [];
    const leaseBumpsMap: Map<string, number> = new Map();
    const permissionBumpsMap: Map<string, number> = new Map();
    const queueAccount = new QueueAccount(this.program, params.queuePubkey);

    for (const row of next) {
      const aggregatorAccount = new AggregatorAccount(this.program, row);

      const {
        leaseAccount,
        leaseBump,
        permissionAccount,
        permissionBump,
        leaseEscrow,
      } = aggregatorAccount.getAccounts({
        queueAccount: queueAccount,
        queueAuthority: params.queueAuthority,
      });

      remainingAccounts.push(aggregatorAccount.publicKey);
      remainingAccounts.push(leaseAccount.publicKey);
      remainingAccounts.push(leaseEscrow);
      remainingAccounts.push(permissionAccount.publicKey);

      leaseBumpsMap.set(row.toBase58(), leaseBump);
      permissionBumpsMap.set(row.toBase58(), permissionBump);
    }
    remainingAccounts.sort((a: PublicKey, b: PublicKey) =>
      a.toBuffer().compare(b.toBuffer())
    );

    const toBumps = (bumpMap: Map<string, number>): Uint8Array => {
      return new Uint8Array(Array.from(bumpMap.values()));
    };

    const ixn = types.crankPop(
      this.program,
      {
        params: {
          stateBump: this.program.programState.bump,
          leaseBumps: toBumps(leaseBumpsMap),
          permissionBumps: toBumps(permissionBumpsMap),
          nonce: params.nonce ?? null,
          failOpenOnAccountMismatch: null,
        },
      },
      {
        crank: this.publicKey,
        oracleQueue: params.queuePubkey,
        queueAuthority: params.queueAuthority,
        programState: this.program.programState.publicKey,
        payoutWallet: params.payoutWallet,
        tokenProgram: TOKEN_PROGRAM_ID,
        crankDataBuffer: params.crank.dataBuffer,
        queueDataBuffer: params.queue.dataBuffer,
        mint: this.program.mint.address,
      }
    );
    ixn.keys.push(
      ...remainingAccounts.map((pubkey): AccountMeta => {
        return { isSigner: false, isWritable: true, pubkey };
      })
    );

    const crankPop = new TransactionObject(payer, [ixn], []);

    return crankPop;
  }

  public async pop(params: CrankPopParams): Promise<TransactionSignature> {
    const popTxn = await this.popInstruction(this.program.walletPubkey, params);
    const txnSignature = await this.program.signAndSend(popTxn);
    return txnSignature;
  }

  /**
   * Pushes a new aggregator onto the crank.
   * @param params The crank push parameters.
   * @return TransactionSignature
   */
  async pushInstruction(
    payer: PublicKey,
    params: CrankPushParams
  ): Promise<TransactionObject> {
    const queueAccount =
      params.queueAccount ??
      new QueueAccount(this.program, (await this.loadData()).queuePubkey);
    const queue = params.queue ?? (await queueAccount.loadData());

    const { permissionAccount, permissionBump, leaseAccount, leaseEscrow } =
      params.aggregatorAccount.getAccounts({
        queueAccount: queueAccount,
        queueAuthority: queue.authority,
      });

    return new TransactionObject(
      payer,
      [
        types.crankPush(
          this.program,
          {
            params: {
              stateBump: this.program.programState.bump,
              permissionBump: permissionBump,
              notifiRef: null,
            },
          },
          {
            crank: this.publicKey,
            aggregator: params.aggregatorAccount.publicKey,
            oracleQueue: queueAccount.publicKey,
            queueAuthority: queue.authority,
            permission: permissionAccount.publicKey,
            lease: leaseAccount.publicKey,
            escrow: leaseEscrow,
            programState: this.program.programState.publicKey,
            dataBuffer: queue.dataBuffer,
          }
        ),
      ],
      []
    );
  }

  /**
   * Pushes a new aggregator onto the crank.
   * @param params The crank push parameters.
   * @return TransactionSignature
   */
  async push(params: CrankPushParams): Promise<TransactionSignature> {
    const pushTxn = await this.pushInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(pushTxn);
    return txnSignature;
  }

  /**
   * Get an array of the next aggregator pubkeys to be popped from the crank, limited by n
   * @param num The limit of pubkeys to return.
   * @return List of {@linkcode types.CrankRow}, ordered by timestamp.
   */
  async peakNextWithTime(num?: number): Promise<types.CrankRow[]> {
    const crankRows = await this.loadCrank(true);
    return crankRows.slice(0, num ?? crankRows.length);
  }

  /**
   * Get an array of the next readily updateable aggregator pubkeys to be popped
   * from the crank, limited by n
   * @param num The limit of pubkeys to return.
   * @return Pubkey list of Aggregator pubkeys.
   */
  async peakNextReady(num?: number): Promise<PublicKey[]> {
    const now = Math.floor(Date.now() / 1000);
    const crankRows = await this.peakNextWithTime(num);
    return crankRows
      .filter(row => now >= row.nextTimestamp.toNumber())
      .map(row => row.pubkey);
  }

  /**
   * Get an array of the next aggregator pubkeys to be popped from the crank, limited by n
   * @param num The limit of pubkeys to return.
   * @return Pubkey list of Aggregators next up to be popped.
   */
  async peakNext(num?: number): Promise<PublicKey[]> {
    const crankRows = await this.peakNextWithTime(num);
    return crankRows.map(row => row.pubkey);
  }

  /** Whether an aggregator pubkey is active on a Crank */
  async isOnCrank(
    pubkey: PublicKey,
    crankRows?: Array<types.CrankRow>
  ): Promise<boolean> {
    const rows = crankRows ?? (await this.loadCrank());

    const idx = rows.findIndex(r => r.pubkey.equals(pubkey));
    if (idx === -1) {
      return false;
    }

    return true;
  }
}

/**
 * Parameters for initializing a CrankAccount
 */
export interface CrankInitParams {
  /**
   *  OracleQueueAccount for which this crank is associated
   */
  queueAccount: QueueAccount;
  /**
   *  String specifying crank name
   */
  name?: string;
  /**
   *  String specifying crank metadata
   */
  metadata?: String;
  /**
   * Optional max number of rows
   */
  maxRows?: number;
  /**
   * Optional
   */
  keypair?: Keypair;
}

/**
 * Parameters for pushing an element into a CrankAccount.
 */
export interface CrankPushParams {
  /**
   * Specifies the aggregator to push onto the crank.
   */
  aggregatorAccount: AggregatorAccount;
  aggregator?: types.AggregatorAccountData;
  queueAccount?: QueueAccount;
  queue?: types.OracleQueueAccountData;
}

/**
 * Parameters for popping an element from a CrankAccount.
 */
export interface CrankPopParams {
  /**
   * Specifies the wallet to reward for turning the crank.
   */
  payoutWallet: PublicKey;
  /**
   * The pubkey of the linked oracle queue.
   */
  queuePubkey: PublicKey;
  /**
   * The pubkey of the linked oracle queue authority.
   */
  queueAuthority: PublicKey;
  /**
   * Array of pubkeys to attempt to pop. If discluded, this will be loaded
   * from the crank upon calling.
   */
  readyPubkeys?: PublicKey[];
  /**
   * Nonce to allow consecutive crank pops with the same blockhash.
   */
  nonce?: number;
  crank: types.CrankAccountData;
  queue: types.OracleQueueAccountData;
  tokenMint: PublicKey;
  failOpenOnMismatch?: boolean;
  popIdx?: number;
}
