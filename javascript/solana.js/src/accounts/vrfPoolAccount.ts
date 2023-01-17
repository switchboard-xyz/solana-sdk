import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  AccountMeta,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
} from '@solana/web3.js';
import { TransactionObject } from '../TransactionObject';
import { SwitchboardProgram } from '../SwitchboardProgram';
import { Account } from './account';
import * as types from '../generated';
import * as errors from '../errors';
import _ from 'lodash';
import { QueueAccount } from './queueAccount';
import { PermissionAccount } from './permissionAccount';
import { VrfLiteAccount } from './vrfLiteAccount';
import { Callback } from './vrfAccount';

// export type VrfPoolRow = {
//   timestamp: number;
//   pubkey: PublicKey;
// };

export interface VrfPoolInitParams {
  maxRows: number;
  minInterval: number;
  authority?: PublicKey;
  keypair?: Keypair;
}

export interface VrfPoolPushParams {
  authority?: Keypair;
  vrf: VrfLiteAccount;
  permission?: PermissionAccount;
}

export interface VrfPoolPopParams {
  authority?: Keypair;
}

export interface VrfPoolRequestParams {
  authority?: Keypair;
  callback?: Callback;
}

export type VrfPoolDepositParams = {
  tokenWallet?: PublicKey;
  tokenAuthority?: Keypair;
  amount: number;
};

// export type VrfPoolAccountData = types.VrfPoolAccountData & {
//   pool: Array<VrfPoolRow>;
// };

export class VrfPoolAccount extends Account<types.VrfPoolAccountData> {
  public size = this.program.account.vrfPoolAccountData.size;

  public async loadData(): Promise<types.VrfPoolAccountData> {
    const data = await types.VrfPoolAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null)
      throw new errors.AccountNotFoundError('VrfPool', this.publicKey);
    return data;
    // const info = await this.program.connection.getAccountInfo(this.publicKey);
    // if (info === null) {
    //   throw new AccountNotFoundError("VrfPool", this.publicKey);
    // }
    // if (!info.owner.equals(this.program.programId)) {
    //   throw new Error("account doesn't belong to this program");
    // }
    // const data = types.VrfPoolAccountData.decode(info.data);
    // const remainingData = info.data.slice(125);
    // const pool: Array<VrfPoolRow> = [];
    // for (let i = 0; i <= remainingData.byteLength; i += 40) {
    //   const timestamp = new BN(remainingData.slice(i, i + 8));
    //   const pubkey = new PublicKey(remainingData.slice(i + 8, i + 40));
    //   pool.push({ timestamp: timestamp.toNumber(), pubkey });
    // }
    // return { ...data, pool };
  }

  public static getSize(program: SwitchboardProgram, maxRows: number) {
    return program.account.vrfPoolAccountData.size + 4 + maxRows * 40;
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: VrfPoolInitParams & { queueAccount: QueueAccount }
  ): Promise<[VrfPoolAccount, TransactionObject]> {
    const vrfPoolKeypair = params.keypair ?? Keypair.generate();
    const size = VrfPoolAccount.getSize(program, params.maxRows);

    const vrfPoolAccount = new VrfPoolAccount(
      program,
      vrfPoolKeypair.publicKey
    );

    const vrfPoolEscrow = program.mint.getAssociatedAddress(
      vrfPoolKeypair.publicKey
    );

    const vrfPoolInitTxn = new TransactionObject(
      payer,
      [
        types.vrfPoolInit(
          program,
          {
            params: {
              maxRows: params.maxRows,
              minInterval: params.minInterval,
              stateBump: program.programState.bump,
            },
          },
          {
            vrfPool: vrfPoolKeypair.publicKey,
            authority: params.authority ?? payer,
            queue: params.queueAccount.publicKey,
            mint: program.mint.address,
            escrow: vrfPoolEscrow,
            programState: program.programState.publicKey,
            payer: payer,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          }
        ),
      ],
      [vrfPoolKeypair]
    );

    return [vrfPoolAccount, vrfPoolInitTxn];
  }

  public static async create(
    program: SwitchboardProgram,
    params: VrfPoolInitParams & { queueAccount: QueueAccount }
  ): Promise<[VrfPoolAccount, TransactionSignature]> {
    const [account, transaction] = await VrfPoolAccount.createInstruction(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(transaction, {
      skipPreflight: true,
    });
    return [account, txnSignature];
  }

  public async pushInstruction(
    payer: PublicKey,
    params: VrfPoolPushParams
  ): Promise<TransactionObject> {
    const vrfPool = await this.loadData();
    const [queueAccount, queue] = await QueueAccount.load(
      this.program,
      vrfPool.queue
    );

    const [permissionAccount] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      params.vrf.publicKey
    );
    const permission = await permissionAccount.loadData();

    // verify permissions

    const pushIxn = types.vrfPoolAdd(
      this.program,
      { params: {} },
      {
        vrfPool: this.publicKey,
        authority: vrfPool.authority,
        vrfLite: params.vrf.publicKey,
        queue: queueAccount.publicKey,
        permission: permissionAccount.publicKey,
      }
    );

    return new TransactionObject(
      payer,
      [pushIxn],
      params.authority ? [params.authority] : []
    );
  }

  public async push(params: VrfPoolPushParams): Promise<TransactionSignature> {
    const transaction = await this.pushInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(transaction, {
      skipPreflight: true,
    });
    return txnSignature;
  }

  public async popInstructions(
    payer: PublicKey,
    params?: VrfPoolPopParams
  ): Promise<TransactionObject> {
    const vrfPool = await this.loadData();
    const [queueAccount, queue] = await QueueAccount.load(
      this.program,
      vrfPool.queue
    );
    const vrfs = vrfPool.pool.slice(-5);

    const popIxn = types.vrfPoolRemove(
      this.program,
      { params: {} },
      {
        vrfPool: this.publicKey,
        authority: vrfPool.authority,
        queue: queueAccount.publicKey,
      }
    );
    popIxn.keys = popIxn.keys.concat(
      vrfs.map((v): AccountMeta => {
        return {
          pubkey: v.pubkey,
          isSigner: false,
          isWritable: true,
        };
      })
    );

    return new TransactionObject(
      payer,
      [popIxn],
      params?.authority ? [params.authority] : []
    );
  }

  public async pop(params?: VrfPoolPopParams): Promise<TransactionSignature> {
    const transaction = await this.popInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(transaction, {
      skipPreflight: true,
    });
    return txnSignature;
  }

  public async requestInstructions(
    payer: PublicKey,
    params?: VrfPoolRequestParams
  ): Promise<TransactionObject> {
    const vrfPool = await this.loadData();

    const [queueAccount, queue] = await QueueAccount.load(
      this.program,
      vrfPool.queue
    );

    const permissionBumpsMap: Map<string, number> = new Map();

    const vrfRows = vrfPool.pool.slice(vrfPool.idx, vrfPool.idx + 1); // TODO: handle round-robin
    const vrfs = vrfRows.map((row): Array<AccountMeta> => {
      const escrow = this.program.mint.getAssociatedAddress(row.pubkey);
      const [permission, bump] = PermissionAccount.fromSeed(
        this.program,
        queue.authority,
        queueAccount.publicKey,
        row.pubkey
      );
      permissionBumpsMap.set(row.pubkey.toBase58(), bump);
      return [
        {
          pubkey: row.pubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: permission.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: escrow,
          isSigner: false,
          isWritable: true,
        },
      ];
    });

    const remainingAccounts: Array<AccountMeta> = _.flatten(vrfs).sort((a, b) =>
      Buffer.compare(a.pubkey.toBuffer(), b.pubkey.toBuffer())
    );
    const permissionBumps: Array<number> = [];
    for (const remainingAccount of remainingAccounts) {
      permissionBumps.push(
        permissionBumpsMap.get(remainingAccount.pubkey.toBase58()) ?? 0
      );
    }

    const requestIxn = types.vrfPoolRequest(
      this.program,
      {
        params: {
          permissionBumps: new Uint8Array(permissionBumps),
          callback: params?.callback ?? null,
        },
      },
      {
        vrfPool: this.publicKey,
        authority: vrfPool.authority,
        escrow: vrfPool.escrow,
        mint: this.program.mint.address,
        queue: queueAccount.publicKey,
        queueAuthority: queue.authority,
        dataBuffer: queue.dataBuffer,
        recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        programState: this.program.programState.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      }
    );
    requestIxn.keys = requestIxn.keys.concat(remainingAccounts);

    return new TransactionObject(
      payer,
      [requestIxn],
      params?.authority ? [params.authority] : []
    );
  }

  public async request(
    params?: VrfPoolRequestParams
  ): Promise<TransactionSignature> {
    const transaction = await this.requestInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(transaction, {
      skipPreflight: true,
    });
    return txnSignature;
  }

  public async depositInstructions(
    payer: PublicKey,
    params: VrfPoolDepositParams
  ): Promise<TransactionObject> {
    const userTokenAddress =
      params.tokenWallet ??
      this.program.mint.getAssociatedAddress(
        params.tokenAuthority?.publicKey ?? payer
      );
    const transferTxn = new TransactionObject(
      payer,
      [
        createTransferInstruction(
          userTokenAddress,
          this.program.mint.getAssociatedAddress(this.publicKey),
          params.tokenAuthority?.publicKey ?? payer,
          this.program.mint.toTokenAmount(params.amount)
        ),
      ],
      params.tokenAuthority ? [params.tokenAuthority] : []
    );
    return transferTxn;
  }

  public async deposit(
    params: VrfPoolDepositParams
  ): Promise<TransactionSignature> {
    const transaction = await this.depositInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(transaction);
    return txnSignature;
  }
}
