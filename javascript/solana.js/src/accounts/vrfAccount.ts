import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  AccountInfo,
  Commitment,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { promiseWithTimeout } from '@switchboard-xyz/common';
import * as errors from '../errors';
import * as types from '../generated';
import { SwitchboardProgram } from '../program';
import { TransactionObject } from '../transaction';
import { Account, OnAccountChangeCallback } from './account';
import { OracleAccount } from './oracleAccount';
import { PermissionAccount } from './permissionAccount';
import { QueueAccount } from './queueAccount';

/**
 * Account holding a Verifiable Random Function result with a callback instruction for consuming on-chain pseudo-randomness.
 *
 * Data: {@linkcode types.VrfAccountData}
 * Result: [u8;32]
 */
export class VrfAccount extends Account<types.VrfAccountData> {
  static accountName = 'VrfAccountData';

  /**
   * Returns the size of an on-chain {@linkcode VrfAccount}.
   */
  public readonly size = this.program.account.vrfAccountData.size;

  /**
   * Invoke a callback each time a VrfAccount's data has changed on-chain.
   * @param callback - the callback invoked when the vrf state changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  onChange(
    callback: OnAccountChangeCallback<types.VrfAccountData>,
    commitment: Commitment = 'confirmed'
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => callback(types.VrfAccountData.decode(accountInfo.data)),
      commitment
    );
  }

  /**
   * Retrieve and decode the {@linkcode types.VrfAccountData} stored in this account.
   */
  async loadData(): Promise<types.VrfAccountData> {
    const data = await types.VrfAccountData.fetch(this.program, this.publicKey);
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }

  /**
   *  Creates a list of instructions that will produce a {@linkcode VrfAccount}.
   *
   *  _NOTE_: The transaction that includes these instructions should be signed by both
   *  payer and vrfKeypair.
   */
  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: VrfInitParams
  ): Promise<[TransactionObject, VrfAccount]> {
    program.verifyNewKeypair(params.vrfKeypair);
    const vrfAccount = new VrfAccount(program, params.vrfKeypair.publicKey);
    const size = program.account.vrfAccountData.size;

    const escrow = program.mint.getAssociatedAddress(vrfAccount.publicKey);

    const ixns = [
      spl.createAssociatedTokenAccountInstruction(
        program.wallet.payer.publicKey,
        escrow,
        params.vrfKeypair.publicKey,
        program.mint.address
      ),
      spl.createSetAuthorityInstruction(
        escrow,
        params.vrfKeypair.publicKey,
        spl.AuthorityType.AccountOwner,
        program.programState.publicKey,
        [program.wallet.payer, params.vrfKeypair]
      ),
      SystemProgram.createAccount({
        fromPubkey: program.wallet.payer.publicKey,
        newAccountPubkey: params.vrfKeypair.publicKey,
        space: size,
        lamports: await program.connection.getMinimumBalanceForRentExemption(
          size
        ),
        programId: program.programId,
      }),
      types.vrfInit(
        program,
        {
          params: {
            stateBump: program.programState.bump,
            callback: params.callback,
          },
        },
        {
          vrf: params.vrfKeypair.publicKey,
          authority: params.authority ?? payer,
          escrow,
          oracleQueue: params.queueAccount.publicKey,
          programState: program.programState.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        }
      ),
    ];

    const txn = new TransactionObject(payer, ixns, [params.vrfKeypair]);
    return [txn, vrfAccount];
  }

  /**
   *  Produces a Switchboard {@linkcode VrfAccount}.
   *
   *  _NOTE_: program wallet is used to sign the transaction.
   */
  public static async create(
    program: SwitchboardProgram,
    params: VrfInitParams
  ): Promise<[string, VrfAccount]> {
    const [createTxn, vrfAccount] = await VrfAccount.createInstructions(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(createTxn);
    return [txnSignature, vrfAccount];
  }

  public async requestRandomnessInstruction(
    payer: PublicKey,
    params: VrfRequestRandomnessParams
  ): Promise<TransactionObject> {
    const vrf = params.vrf ?? (await this.loadData());
    const queueAccount =
      params.queueAccount ?? new QueueAccount(this.program, vrf.oracleQueue);
    const queue = params.queue ?? (await queueAccount.loadData());

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      this.publicKey
    );

    const requestRandomness = new TransactionObject(
      payer,
      [
        types.vrfRequestRandomness(
          this.program,
          {
            params: {
              stateBump: this.program.programState.bump,
              permissionBump,
            },
          },
          {
            authority: params.authority?.publicKey ?? payer,
            vrf: this.publicKey,
            oracleQueue: queueAccount.publicKey,
            queueAuthority: queue.authority,
            dataBuffer: queue.dataBuffer,
            permission: permissionAccount.publicKey,
            escrow: vrf.escrow,
            payerWallet: payer,
            payerAuthority: PublicKey.default,
            recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
            programState: this.program.programState.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          }
        ),
      ],
      params.authority ? [params.authority] : []
    );

    return requestRandomness;
  }

  public async requestRandomness(
    params: VrfRequestRandomnessParams
  ): Promise<TransactionSignature> {
    const requestRandomness = await this.requestRandomnessInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(requestRandomness);
    return txnSignature;
  }

  public proveAndVerifyInstructions(
    params: VrfProveAndVerifyParams,
    tryCount = 278
  ): TransactionInstruction[] {
    const ixns: TransactionInstruction[] = [];

    const vrf = params.vrf;

    const idx = vrf.builders.findIndex(builder =>
      params.oraclePubkey.equals(builder.producer)
    );
    if (idx === -1) {
      throw new Error('OracleNotFoundError');
    }

    // only add proof in first ixn to optimally pack
    ixns.push(
      types.vrfProveAndVerify(
        this.program,
        {
          params: {
            nonce: 1,
            stateBump: this.program.programState.bump,
            idx: idx,
            proof: new Uint8Array(),
            proofEncoded: params.proof,
            counter: vrf.counter,
          },
        },
        {
          vrf: this.publicKey,
          callbackPid: vrf.callback.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          escrow: vrf.escrow,
          programState: this.program.programState.publicKey,
          oracle: params.oraclePubkey,
          oracleAuthority: params.oracleAuthority,
          oracleWallet: params.oracleTokenWallet,
          instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        }
      )
    );

    // add verify ixns
    for (let i = 0; i < tryCount; ++i) {
      ixns.push(
        types.vrfProveAndVerify(
          this.program,
          {
            params: {
              nonce: i,
              stateBump: this.program.programState.bump,
              idx: idx,
              proof: new Uint8Array(),
              proofEncoded: '',
              counter: vrf.counter,
            },
          },
          {
            vrf: this.publicKey,
            callbackPid: vrf.callback.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            escrow: vrf.escrow,
            programState: this.program.programState.publicKey,
            oracle: params.oraclePubkey,
            oracleAuthority: params.oracleAuthority,
            oracleWallet: params.oracleTokenWallet,
            instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          }
        )
      );
    }

    return ixns;
  }

  public async proveAndVerify(params: {
    vrf?: types.VrfAccountData;
    proof?: string;
    oraclePubkey?: PublicKey;
    oracleTokenWallet?: PublicKey;
    oracleAuthority?: PublicKey;
    skipPreflight?: boolean;
  }): Promise<Array<TransactionSignature>> {
    const vrf = params.vrf ?? (await this.loadData());
    const oraclePubkey = params.oraclePubkey ?? vrf.builders[0].producer;

    let oracleTokenWallet = params.oracleTokenWallet;
    let oracleAuthority = params.oracleAuthority;
    if (!oracleTokenWallet || !oracleAuthority) {
      const oracleAccount = new OracleAccount(this.program, oraclePubkey);
      const oracle = await oracleAccount.loadData();
      oracleTokenWallet = oracle.tokenAccount;
      oracleAuthority = oracle.oracleAuthority;
    }

    const ixns = this.proveAndVerifyInstructions({
      vrf,
      proof: params.proof ?? '',
      oraclePubkey,
      oracleTokenWallet,
      oracleAuthority,
    });

    const txns = TransactionObject.packIxns(this.program.walletPubkey, ixns);
    const txnSignatures = await this.program.signAndSendAll(txns, {
      skipPreflight: params.skipPreflight ?? true,
    });

    return txnSignatures;
  }

  public setCallbackInstruction(
    payer: PublicKey,
    params: {
      authority: Keypair | PublicKey;
      callback: Callback;
    }
  ): TransactionObject {
    const authorityPubkey =
      params.authority instanceof PublicKey
        ? params.authority
        : params.authority.publicKey;

    return new TransactionObject(
      payer,
      [
        types.vrfSetCallback(
          this.program,
          {
            params: {
              callback: params.callback,
            },
          },
          {
            vrf: this.publicKey,
            authority: authorityPubkey,
          }
        ),
      ],
      params.authority instanceof Keypair ? [params.authority] : []
    );
  }

  public async setCallback(params: {
    authority: Keypair | PublicKey;
    callback: Callback;
  }): Promise<TransactionSignature> {
    const setCallbackTxn = this.setCallbackInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(setCallbackTxn);
    return txnSignature;
  }

  /** Await the next vrf round */
  public async nextRound(
    roundId: anchor.BN,
    /** Number of milliseconds to await the next VRF round. */
    timeout: number
  ): Promise<VrfResult> {
    let ws: number | undefined = undefined;
    return await promiseWithTimeout(
      timeout,
      new Promise((resolve: (result: VrfResult) => void) => {
        ws = this.program.connection.onAccountChange(
          this.publicKey,
          (accountInfo: AccountInfo<Buffer>) => {
            const vrf = types.VrfAccountData.decode(accountInfo.data);
            if (!vrf.counter.eq(roundId)) {
              return;
            }
            if (
              vrf.status.kind === 'StatusCallbackSuccess' ||
              vrf.status.kind === 'StatusVerifyFailure'
            ) {
              resolve({
                success: vrf.status.kind === 'StatusCallbackSuccess',
                result: new Uint8Array(vrf.currentRound.result),
                status: vrf.status,
              });
            }
          }
        );
      })
    ).finally(async () => {
      if (ws) {
        await this.program.connection.removeAccountChangeListener(ws);
      }
      ws = undefined;
    });
  }
}

export interface VrfResult {
  success: boolean;
  result: Uint8Array;
  status: types.VrfStatusKind;
}

/**
 * Interface for a VRF callback.
 */
export interface Callback {
  programId: PublicKey;
  accounts: Array<anchor.web3.AccountMeta>;
  ixData: Buffer;
}

/**
 * Parameters for a VrfInit request.
 */
export interface VrfInitParams {
  /**
   *  Keypair to use for the vrf account
   */
  vrfKeypair: anchor.web3.Keypair;
  queueAccount: QueueAccount;
  /**
   * Callback function that is invoked when a new randomness value is produced.
   */
  callback: Callback;
  /**
   *  Optional authority for the resulting {@linkcode VrfAccount}. If not provided,
   *  the payer will default to the VRF authority.
   */
  authority?: PublicKey;
}

/**
 * Parameters for a VrfSetCallback request.
 */
export interface VrfSetCallbackParams {
  authority?: Keypair;
  callback: Callback;
  vrf: types.VrfAccountData;
}

export interface VrfProveAndVerifyParams {
  vrf: types.VrfAccountData;
  proof: string;
  oraclePubkey: PublicKey;
  oracleTokenWallet: PublicKey;
  oracleAuthority: PublicKey;
}

export interface VrfRequestRandomnessParams {
  authority?: Keypair;
  payerTokenWallet: PublicKey;
  payerAuthority?: Keypair;
  queue?: types.OracleQueueAccountData;
  queueAccount?: QueueAccount;
  vrf?: types.VrfAccountData;
}
