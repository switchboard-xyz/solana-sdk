import * as errors from "../errors.js";
import * as types from "../generated/index.js";
import { vrfLiteInit } from "../generated/index.js";
import { vrfLiteCloseAction } from "../generated/instructions/vrfLiteCloseAction.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import {
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";

import { Account, OnAccountChangeCallback } from "./account.js";
import { OracleAccount } from "./oracleAccount.js";
import { PermissionAccount } from "./permissionAccount.js";
import { QueueAccount } from "./queueAccount.js";
import { Callback, VrfResult } from "./vrfAccount.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Commitment,
  Keypair,
  ParsedTransactionWithMeta,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
} from "@solana/web3.js";
import { BN, promiseWithTimeout } from "@switchboard-xyz/common";

export interface VrfLiteInitParams {
  callback?: Callback;
  expiration?: number;
  keypair?: Keypair;
  authority?: PublicKey;
}

export type VrfLiteDepositParams = {
  tokenWallet?: PublicKey;
  tokenAuthority?: Keypair;
  amount: number;
};

export interface VrfLiteProveAndVerifyParams {
  vrfLite: types.VrfLiteAccountData;
  counter?: BN;
  proof: string;
  oraclePubkey: PublicKey;
  oracleTokenWallet: PublicKey;
  oracleAuthority: PublicKey;
}

export interface VrfLiteCloseParams {
  destination?: PublicKey;
  authority?: Keypair;
  queueAccount?: QueueAccount;
  queueAuthority?: PublicKey;
}

export class VrfLiteAccount extends Account<types.VrfLiteAccountData> {
  public size = this.program.account.vrfLiteAccountData.size;

  /**
   * Invoke a callback each time a VrfAccount's data has changed on-chain.
   * @param callback - the callback invoked when the vrf state changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  onChange(
    callback: OnAccountChangeCallback<types.VrfLiteAccountData>,
    commitment: Commitment = "confirmed"
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      (accountInfo) =>
        callback(types.VrfLiteAccountData.decode(accountInfo.data)),
      commitment
    );
  }

  public async loadData(): Promise<types.VrfLiteAccountData> {
    const data = await types.VrfLiteAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null)
      throw new errors.AccountNotFoundError("VrfLite", this.publicKey);
    return data;
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: VrfLiteInitParams & { queueAccount: QueueAccount }
  ): Promise<[VrfLiteAccount, TransactionObject]> {
    const queue = await params.queueAccount.loadData();

    const vrfLiteKeypair = params.keypair ?? Keypair.generate();
    const vrfLiteAccount = new VrfLiteAccount(
      program,
      vrfLiteKeypair.publicKey
    );

    const vrfPoolEscrow = program.mint.getAssociatedAddress(
      vrfLiteKeypair.publicKey
    );

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      program,
      queue.authority,
      params.queueAccount.publicKey,
      vrfLiteKeypair.publicKey
    );

    const vrfLiteInitIxn = vrfLiteInit(
      program,
      {
        params: {
          callback: params.callback ?? null,
          stateBump: program.programState.bump,
          expiration: new BN(params.expiration ?? 0),
        },
      },
      {
        vrf: vrfLiteKeypair.publicKey,
        authority: params.authority ?? payer,
        mint: program.mint.address,
        escrow: vrfPoolEscrow,
        queueAuthority: queue.authority,
        queue: params.queueAccount.publicKey,
        permission: permissionAccount.publicKey,
        programState: program.programState.publicKey,
        payer: payer,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      }
    );

    const vrfLiteInitTxn = new TransactionObject(
      payer,
      [vrfLiteInitIxn],
      [vrfLiteKeypair]
    );

    return [vrfLiteAccount, vrfLiteInitTxn];
  }

  public static async create(
    program: SwitchboardProgram,
    params: VrfLiteInitParams & { queueAccount: QueueAccount }
  ): Promise<[VrfLiteAccount, TransactionSignature]> {
    const [account, transaction] = await VrfLiteAccount.createInstruction(
      program,
      program.walletPubkey,
      params
    );
    const txnSignature = await program.signAndSend(transaction);
    return [account, txnSignature];
  }

  public async depositInstructions(
    payer: PublicKey,
    params: VrfLiteDepositParams
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
    params: VrfLiteDepositParams
  ): Promise<TransactionSignature> {
    const transaction = await this.depositInstructions(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(transaction);
    return txnSignature;
  }

  async fetchBalance(escrow?: PublicKey): Promise<number> {
    const tokenAccount = escrow ?? (await this.loadData()).escrow;
    const amount = await this.program.mint.fetchBalance(tokenAccount);
    if (amount === null) {
      throw new Error(`Failed to fetch oracle staking wallet balance`);
    }
    return amount;
  }

  async fetchBalanceBN(escrow?: PublicKey): Promise<BN> {
    const tokenAccount = escrow ?? (await this.loadData()).escrow;
    const amount = await this.program.mint.fetchBalanceBN(tokenAccount);
    if (amount === null) {
      throw new Error(`Failed to fetch oracle staking wallet balance`);
    }
    return amount;
  }

  public proveAndVerifyInstructions(
    params: VrfLiteProveAndVerifyParams,
    options?: TransactionObjectOptions,
    numTxns = 40
  ): Array<TransactionObject> {
    const remainingAccounts = params.vrfLite.callback.accounts.slice(
      0,
      params.vrfLite.callback.accountsLen
    );

    const txns = Array.from(Array(numTxns).keys()).map((i) => {
      const proveIxn = types.vrfLiteProveAndVerify(
        this.program,
        {
          params: {
            nonce: i,
            proof: new Uint8Array(),
            proofEncoded: params.proof,
            counter: params.counter ?? params.vrfLite.counter,
          },
        },
        {
          vrfLite: this.publicKey,
          callbackPid: params.vrfLite.callback.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          escrow: params.vrfLite.escrow,
          programState: this.program.programState.publicKey,
          oracle: params.oraclePubkey,
          oracleAuthority: params.oracleAuthority,
          oracleWallet: params.oracleTokenWallet,
          instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        }
      );
      proveIxn.keys = proveIxn.keys.concat(remainingAccounts);

      return new TransactionObject(this.program.walletPubkey, [proveIxn], [], {
        computeUnitLimit: 1_400_000, // allow user to override
        ...options,
      });
    });

    return txns;
  }

  public async proveAndVerify(
    params: Partial<VrfLiteProveAndVerifyParams> & { skipPreflight?: boolean },
    options?: TransactionObjectOptions,
    numTxns = 40
  ): Promise<Array<TransactionSignature>> {
    const vrfLite = params.vrfLite ?? (await this.loadData());
    const oraclePubkey = params.oraclePubkey ?? vrfLite.builder.producer;

    let oracleTokenWallet = params.oracleTokenWallet;
    let oracleAuthority = params.oracleAuthority;
    if (!oracleTokenWallet || !oracleAuthority) {
      const oracleAccount = new OracleAccount(this.program, oraclePubkey);
      const oracle = await oracleAccount.loadData();
      oracleTokenWallet = oracle.tokenAccount;
      oracleAuthority = oracle.oracleAuthority;
    }

    const txns = this.proveAndVerifyInstructions(
      {
        vrfLite,
        proof: params.proof ?? "",
        oraclePubkey,
        oracleTokenWallet,
        oracleAuthority,
      },
      options,
      numTxns
    );

    const txnSignatures = await this.program.signAndSendAll(txns, {
      skipPreflight: params.skipPreflight ?? true,
    });

    return txnSignatures;
  }

  public async awaitRandomness(
    params: { requestSlot: BN },
    timeout = 30000
  ): Promise<types.VrfLiteAccountData> {
    let ws: number | undefined = undefined;

    const closeWebsocket = async () => {
      if (ws !== undefined) {
        await this.program.connection.removeAccountChangeListener(ws).catch();
        ws = undefined;
      }
    };

    // const vrfLite = await this.loadData();
    // if (vrfLite.requestSlot.gt(params.requestSlot)) {
    //   throw new Error(`VRF request expired`);
    // }

    const statePromise: Promise<types.VrfLiteAccountData> = promiseWithTimeout(
      timeout,
      new Promise(
        (
          resolve: (result: types.VrfLiteAccountData) => void,
          reject: (reason: string) => void
        ) => {
          ws = this.onChange((vrfLite) => {
            if (vrfLite.requestSlot.gt(params.requestSlot)) {
              reject(`VRF request expired`);
            }

            if (
              vrfLite.status.kind ===
                types.VrfStatus.StatusCallbackSuccess.kind ||
              vrfLite.status.kind === types.VrfStatus.StatusVerified.kind
            ) {
              resolve(vrfLite);
            }
            if (
              vrfLite.status.kind === types.VrfStatus.StatusVerifyFailure.kind
            ) {
              reject(
                `Vrf failed to verify with status ${vrfLite.status.kind} (${vrfLite.status.discriminator})`
              );
            }
          });
        }
      )
    ).finally(async () => {
      await closeWebsocket();
    });

    const state = await statePromise;
    // .catch(async e => {
    //   await closeWebsocket();
    //   throw e;
    // })
    // .finally(async () => {
    //   await closeWebsocket();
    // });

    await closeWebsocket();

    return state;
  }

  async closeAccountInstruction(
    payer: PublicKey,
    params?: VrfLiteCloseParams
  ): Promise<TransactionObject> {
    const vrfLite = await this.loadData();
    const queueAccount =
      params?.queueAccount ?? new QueueAccount(this.program, vrfLite.queue);
    const queueAuthority =
      params?.queueAuthority ?? (await queueAccount.loadData()).authority;
    const [permissionAccount] = this.getPermissionAccount(
      queueAccount.publicKey,
      queueAuthority
    );
    const [escrowDest, escrowInit] =
      await this.program.mint.getOrCreateWrappedUserInstructions(payer, {
        fundUpTo: 0,
      });
    const vrfLiteClose = new TransactionObject(
      payer,
      [
        vrfLiteCloseAction(
          this.program,
          { params: {} },
          {
            vrfLite: this.publicKey,
            permission: permissionAccount.publicKey,
            authority: vrfLite.authority,
            queue: queueAccount.publicKey,
            queueAuthority,
            programState: this.program.programState.publicKey,
            escrow: vrfLite.escrow,
            solDest: params?.destination ?? payer,
            escrowDest: escrowDest,
            tokenProgram: TOKEN_PROGRAM_ID,
          }
        ),
      ],
      params?.authority ? [params.authority] : []
    );

    if (escrowInit) {
      return escrowInit.combine(vrfLiteClose);
    }

    return vrfLiteClose;
  }

  async closeAccount(
    params?: VrfLiteCloseParams
  ): Promise<TransactionSignature> {
    const transaction = await this.closeAccountInstruction(
      this.program.walletPubkey,
      params
    );
    const txnSignature = await this.program.signAndSend(transaction, {
      skipPreflight: true,
    });
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

  public getEscrow(): PublicKey {
    return this.program.mint.getAssociatedAddress(this.publicKey);
  }

  /**
   * Await for the next vrf result
   *
   * @param roundId - optional, the id associated with the VRF round to watch. If not provided the current round Id will be used.
   * @param timeout - the number of milliseconds to wait for the round to close
   *
   * @throws {string} when the timeout interval is exceeded or when the latestConfirmedRound.roundOpenSlot exceeds the target roundOpenSlot
   */
  public async nextResult(roundId?: BN, timeout = 30000): Promise<VrfResult> {
    let id: BN;
    if (roundId) {
      id = roundId;
    } else {
      const vrf = await this.loadData();
      if (vrf.status.kind === "StatusVerifying") {
        id = vrf.counter;
      } else {
        // wait for the next round
        id = vrf.counter.add(new BN(1));
      }
    }
    let ws: number | undefined;

    const closeWebsocket = async () => {
      if (ws !== undefined) {
        await this.program.connection.removeAccountChangeListener(ws);
        ws = undefined;
      }
    };

    let result: VrfResult;
    try {
      result = await promiseWithTimeout(
        timeout,
        new Promise(
          (
            resolve: (result: VrfResult) => void,
            reject: (reason: string) => void
          ) => {
            ws = this.onChange((vrf) => {
              if (vrf.counter.gt(id)) {
                reject(`Current counter is higher than requested roundId`);
              }
              if (vrf.counter.eq(id)) {
                switch (vrf.status.kind) {
                  case "StatusCallbackSuccess": {
                    resolve({
                      success: true,
                      result: new Uint8Array(vrf.result),
                      status: vrf.status,
                    });
                    break;
                  }
                  case "StatusVerifyFailure": {
                    resolve({
                      success: false,
                      result: new Uint8Array(),
                      status: vrf.status,
                    });
                    break;
                  }
                }
              }
            });
          }
        )
      );
    } finally {
      await closeWebsocket();
    }

    await closeWebsocket();

    return result;
  }

  /** Return parsed transactions for a VRF request */
  public async getCallbackTransactions(
    requestSlot?: BN,
    txnLimit = 50
  ): Promise<Array<ParsedTransactionWithMeta>> {
    const slot = requestSlot ?? (await this.loadData()).requestSlot;
    // TODO: Add options and allow getting signatures by slot
    const transactions = await this.program.connection.getSignaturesForAddress(
      this.publicKey,
      { limit: txnLimit, minContextSlot: slot.toNumber() },
      "confirmed"
    );
    const signatures = transactions.map((txn) => txn.signature);
    const parsedTransactions =
      await this.program.connection.getParsedTransactions(
        signatures,
        "confirmed"
      );

    const callbackTransactions: ParsedTransactionWithMeta[] = [];

    for (const txn of parsedTransactions) {
      if (txn === null) {
        continue;
      }

      const logs = txn.meta?.logMessages?.join("\n") ?? "";
      if (logs.includes("Invoking callback")) {
        callbackTransactions.push(txn);
      }
    }

    return callbackTransactions;
  }
}
