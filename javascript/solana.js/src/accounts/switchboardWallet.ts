import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { parseRawBuffer } from "../utils.js";

import { Account } from "./account.js";

import * as spl from "@solana/spl-token";
import {
  AccountMeta,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common";
import assert from "assert";

export interface SwitchboardWalletTransferParams {
  funderTokenWallet?: PublicKey; // defaults to payer tokenWallet
  funderAuthority?: Keypair; // defaults to payer
  transferAmount?: number;
}

export interface SwitchboardWalletWrapParams {
  funderAuthority?: Keypair; // defaults to payer
  wrapAmount?: number;
}

export type SwitchboardWalletFundParams = SwitchboardWalletTransferParams &
  SwitchboardWalletWrapParams;

export interface SwitchboardWalletState {
  bump: number;
  initialized: number;
  mint: PublicKey;
  attestationQueue: PublicKey;
  authority: PublicKey;
  name: Array<number>;
  resourceCount: number;
  withdrawAuthority: PublicKey;
  tokenWallet: PublicKey;
  resources: Array<PublicKey>;
  resourcesMaxLen: number;
  ebuf: Array<number>;
}

export type SwitchboardWalletWithEscrow = SwitchboardWalletState & {
  tokenWalletAccount: spl.Account;
};

/**
 * Account holding a Verifiable Random Function result with a callback instruction for consuming on-chain pseudo-randomness.
 *
 * Data: {@linkcode types.SwitchboardWalletData}
 * Result: [u8;32]
 */
export class SwitchboardWallet extends Account<SwitchboardWalletWithEscrow> {
  static accountName = "SwitchboardWallet";

  private _tokenWallet: PublicKey | undefined = undefined;

  /**
   * Returns the size of an on-chain {@linkcode SwitchboardWallet}.
   */
  public readonly size = this.program.attestationAccount.switchboardWallet.size;

  public get tokenWallet(): PublicKey {
    if (!this._tokenWallet) {
      this._tokenWallet = this.program.mint.getAssociatedAddress(
        this.publicKey
      );
    }
    return this._tokenWallet;
  }

  public static parseName(name: string | PublicKey | Uint8Array): Uint8Array {
    let nameSeed: Uint8Array;
    if (typeof name === "string") {
      nameSeed = new Uint8Array(Buffer.from(name, "utf-8")).slice(0, 32);
    } else if (name instanceof Uint8Array) {
      nameSeed = name;
    } else {
      nameSeed = name.toBytes();
    }

    return parseRawBuffer(nameSeed, 32);
  }

  public static fromSeed(
    program: SwitchboardProgram,
    attestationQueue: PublicKey,
    authority: PublicKey,
    name: string | PublicKey | Uint8Array
  ): SwitchboardWallet {
    const nameSeed = SwitchboardWallet.parseName(name);
    const walletPubkey = PublicKey.findProgramAddressSync(
      [
        program.mint.address.toBytes(),
        attestationQueue.toBytes(),
        authority.toBytes(),
        nameSeed,
      ],
      program.attestationProgramId
    )[0];
    return new SwitchboardWallet(program, walletPubkey);
  }

  public async loadData(): Promise<SwitchboardWalletWithEscrow> {
    const accountInfos = await this.program.connection.getMultipleAccountsInfo([
      this.publicKey,
      this.tokenWallet,
    ]);
    const walletAccountInfo = accountInfos.shift();
    if (!walletAccountInfo) {
      throw new errors.AccountNotFoundError(
        "SwitchboardWallet",
        this.publicKey
      );
    }
    const tokenAccountInfo = accountInfos.shift();
    if (!tokenAccountInfo) {
      throw new errors.AccountNotFoundError(
        "SwitchboardWallet tokenWallet",
        this.tokenWallet
      );
    }
    assert(accountInfos.length === 0);

    if (!this.program.attestationProgramId.equals(walletAccountInfo.owner)) {
      throw new errors.IncorrectOwner(
        this.program.attestationProgramId,
        walletAccountInfo.owner
      );
    }

    const data = types.SwitchboardWallet.decode(walletAccountInfo.data);
    if (data === null) {
      throw new errors.AccountNotFoundError(
        "SwitchboardWallet",
        this.publicKey
      );
    }

    const tokenWalletAccount = spl.unpackAccount(
      this.tokenWallet,
      tokenAccountInfo
    );

    return { ...data, tokenWalletAccount };
  }

  public static async load(
    program: SwitchboardProgram,
    attestationQueue: PublicKey,
    authority: PublicKey,
    name: string | PublicKey
  ): Promise<[SwitchboardWallet, SwitchboardWalletWithEscrow | undefined]> {
    const wallet = SwitchboardWallet.fromSeed(
      program,
      attestationQueue,
      authority,
      name
    );

    try {
      const walletState = await wallet.loadData();
      return [wallet, walletState];
    } catch {}
    return [wallet, undefined];
  }

  public async getBalance(): Promise<number> {
    const balance = await this.program.mint.fetchBalance(this.tokenWallet);
    if (balance === null) {
      throw new errors.AccountNotFoundError(
        "SwitchboardWallet Escrow",
        this.tokenWallet
      );
    }
    return balance;
  }

  public async getBalanceBN(): Promise<BN> {
    const balance = await this.program.mint.fetchBalanceBN(this.tokenWallet);
    if (balance === null) {
      throw new errors.AccountNotFoundError(
        "SwitchboardWallet Escrow",
        this.tokenWallet
      );
    }
    return balance;
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    attestationQueue: PublicKey,
    authority: PublicKey,
    name: string | PublicKey,
    maxLen?: number,
    options?: TransactionObjectOptions
  ): Promise<[SwitchboardWallet, TransactionObject]> {
    const nameSeed = SwitchboardWallet.parseName(name);

    const switchboardWallet = SwitchboardWallet.fromSeed(
      program,
      attestationQueue,
      authority,
      nameSeed
    );

    const walletInitIxn = types.walletInit(
      program,
      { params: { name: Buffer.from(nameSeed), maxLen: maxLen ?? null } },
      {
        wallet: switchboardWallet.publicKey,
        mint: program.mint.address,
        authority: payer,
        attestationQueue: attestationQueue,
        tokenWallet: switchboardWallet.tokenWallet,
        payer: payer,
        state: program.attestationProgramState.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }
    );

    return [
      switchboardWallet,
      new TransactionObject(payer, [walletInitIxn], [], options),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    attestationQueue: PublicKey,
    authority: PublicKey,
    name: string | PublicKey,
    maxLen?: number,
    options?: SendTransactionObjectOptions
  ): Promise<[SwitchboardWallet, TransactionSignature]> {
    const [account, transaction] = await SwitchboardWallet.createInstruction(
      program,
      program.walletPubkey,
      attestationQueue,
      authority,
      name,
      maxLen,
      options
    );
    const txnSignature = await program.signAndSend(transaction, options);
    return [account, txnSignature];
  }

  public async fundInstruction(
    payer: PublicKey,
    params: SwitchboardWalletFundParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    let funderPubkey = payer;
    if (params.funderAuthority) {
      funderPubkey = params.funderAuthority.publicKey;
    }

    let funderTokenWallet: PublicKey;
    if (params.funderTokenWallet) {
      funderTokenWallet = params.funderTokenWallet;
    } else {
      funderTokenWallet = this.program.mint.getAssociatedAddress(funderPubkey);
    }

    let transferAmount: BN | null = null;
    if (params.transferAmount) {
      transferAmount = this.program.mint.toTokenAmountBN(params.transferAmount);
    }

    let wrapAmount: BN | null = null;
    if (params.wrapAmount) {
      wrapAmount = this.program.mint.toTokenAmountBN(params.wrapAmount);
    }

    const walletState = await this.loadData();

    const ixn = types.walletFund(
      this.program,
      { params: { transferAmount, wrapAmount } },
      {
        wallet: this.publicKey,
        mint: this.program.mint.address,
        authority: walletState.authority,
        attestationQueue: walletState.attestationQueue,
        tokenWallet: this.tokenWallet,
        funderWallet: funderTokenWallet,
        funder: funderPubkey,
        state: this.program.attestationProgramState.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }
    );

    ixn.keys.push(
      ...walletState.resources
        .filter((r) => !PublicKey.default.equals(r))
        .map((r): AccountMeta => {
          return {
            pubkey: r,
            isSigner: false,
            isWritable: true,
          };
        })
    );

    return new TransactionObject(
      this.program.wallet.payer.publicKey,
      [ixn],
      params.funderAuthority ? [params.funderAuthority] : [],
      options
    );
  }

  public async fund(
    params: SwitchboardWalletFundParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const transaction = await this.fundInstruction(
      this.program.walletPubkey,
      params,
      options
    );
    const txnSignature = await this.program.signAndSend(transaction, options);
    return txnSignature;
  }

  public async wrapInstruction(
    payer: PublicKey,
    amount: number,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const walletState = await this.loadData();

    const ixn = types.walletFund(
      this.program,
      {
        params: {
          transferAmount: null,
          wrapAmount: this.program.mint.toTokenAmountBN(amount),
        },
      },
      {
        wallet: this.publicKey,
        mint: walletState.mint,
        authority: walletState.authority,
        attestationQueue: walletState.attestationQueue,
        tokenWallet: this.tokenWallet,
        funderWallet: this.program.attestationProgramId, // null
        funder: payer,
        state: this.program.attestationProgramState.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }
    );

    ixn.keys.push(
      ...walletState.resources
        .filter((r) => !PublicKey.default.equals(r))
        .map((r): AccountMeta => {
          return {
            pubkey: r,
            isSigner: false,
            isWritable: true,
          };
        })
    );

    return new TransactionObject(payer, [ixn], [], options);
  }

  public async wrap(
    amount: number,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const transaction = await this.wrapInstruction(
      this.program.walletPubkey,
      amount,
      options
    );
    const txnSignature = await this.program.signAndSend(transaction, options);
    return txnSignature;
  }

  public async withdrawInstruction(
    payer: PublicKey,
    amount: number,
    destinationWallet?: PublicKey,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const walletState = await this.loadData();

    const destinationTokenWallet =
      destinationWallet ??
      (await this.program.mint.getOrCreateAssociatedUser(payer));

    const ixn = types.walletWithdraw(
      this.program,
      { params: { amount: this.program.mint.toTokenAmountBN(amount) } },
      {
        wallet: this.publicKey,
        mint: walletState.mint,
        authority: walletState.authority,
        attestationQueue: walletState.attestationQueue,
        tokenWallet: this.tokenWallet,
        destinationWallet: destinationTokenWallet,
        state: this.program.attestationProgramState.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      }
    );

    ixn.keys.push(
      ...walletState.resources
        .filter((r) => !PublicKey.default.equals(r))
        .map((r): AccountMeta => {
          return {
            pubkey: r,
            isSigner: false,
            isWritable: true,
          };
        })
    );

    return new TransactionObject(payer, [ixn], [], options);
  }

  public async withdraw(
    amount: number,
    destinationWallet?: PublicKey,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    const transaction = await this.withdrawInstruction(
      this.program.walletPubkey,
      amount,
      destinationWallet,
      options
    );
    const txnSignature = await this.program.signAndSend(transaction, options);
    return txnSignature;
  }
}
