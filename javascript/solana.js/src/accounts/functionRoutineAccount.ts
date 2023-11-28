import * as errors from "../errors.js";
import * as types from "../generated/attestation-program/index.js";
import { NativeMint } from "../mint.js";
import type { SwitchboardProgram } from "../SwitchboardProgram.js";
import type {
  SendTransactionObjectOptions,
  TransactionObjectOptions,
} from "../TransactionObject.js";
import { TransactionObject } from "../TransactionObject.js";
import { parseCronSchedule, parseRawBuffer } from "../utils.js";

import { Account } from "./account.js";
import type { FunctionAccount } from "./functionAccount.js";
import type { SwitchboardWalletFundParams } from "./switchboardWallet.js";
import { SwitchboardWallet } from "./switchboardWallet.js";

import * as anchor from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type {
  PublicKey,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { Keypair, SystemProgram } from "@solana/web3.js";
import type { RawBuffer } from "@switchboard-xyz/common";
import { BN, parseRawMrEnclave } from "@switchboard-xyz/common";

/**
 *  Parameters for initializing a {@linkcode FunctionRoutineAccount}
 */
export interface FunctionRoutineAccountInitParams {
  // Metadata Config
  name?: string;
  metadata?: string;

  bounty?: number;

  schedule: string;

  functionAccount: FunctionAccount;
  maxContainerParamsLen?: number;
  containerParams?: Buffer;

  /**
   *  A keypair to be used to address this account.
   *
   *  @default Keypair.generate()
   */
  keypair?: Keypair;

  authority?: PublicKey;
}

/**
 *  Parameters for setting a {@linkcode FunctionRoutineAccount} config
 */
export interface FunctionRoutineSetConfigParams {
  // Metadata Config
  name?: string;
  metadata?: string;

  bounty?: number;

  schedule?: string;

  containerParams?: string;
  appendContainerParams?: boolean;

  authority?: Keypair;
}

export interface FunctionRoutineVerifyParams {
  observedTime?: number;
  isFailure?: boolean;
  mrEnclave: RawBuffer;
  nextAllowedTimestamp: number | BN;
  containerParamsHash: RawBuffer;

  // accounts
  functionEnclaveSigner: PublicKey;
  function: PublicKey;
  functionEscrow: PublicKey;
  verifierQuote: PublicKey;
  verifierEnclaveSigner: PublicKey;
  verifierPermission: PublicKey;
  attestationQueue: PublicKey;
  receiver: PublicKey;

  escrowWallet: PublicKey;
}

/**
 * Account type representing a Switchboard Function.
 *
 * Data: {@linkcode types.FunctionRoutineAccountData}
 */
export class FunctionRoutineAccount extends Account<types.FunctionRoutineAccountData> {
  static accountName = "FunctionRoutineAccountData";

  private switchboardWallet?: SwitchboardWallet | undefined = undefined;

  /**
   *  Retrieve and decode the {@linkcode types.FunctionRoutineAccountData} stored in this account.
   */
  public async loadData(): Promise<types.FunctionRoutineAccountData> {
    const data = await types.FunctionRoutineAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (!data) {
      throw new errors.AccountNotFoundError("Routine", this.publicKey);
    }

    // cache this so we dont need to always re-fetch
    this.switchboardWallet = new SwitchboardWallet(
      this.program,
      data.escrowWallet
    );

    return data;
  }

  private async getSwitchboardWallet(): Promise<SwitchboardWallet> {
    if (this.switchboardWallet) {
      return this.switchboardWallet;
    }

    const data = await this.loadData();
    if (this.switchboardWallet) {
      return this.switchboardWallet;
    }

    return new SwitchboardWallet(this.program, data.escrowWallet);
  }

  public static async load(
    program: SwitchboardProgram,
    address: PublicKey | string
  ): Promise<[FunctionRoutineAccount, types.FunctionRoutineAccountData]> {
    const functionAccount = new FunctionRoutineAccount(program, address);
    const state = await functionAccount.loadData();
    return [functionAccount, state];
  }

  public static async createInstruction(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: FunctionRoutineAccountInitParams,
    wallet?: SwitchboardWallet,
    options?: TransactionObjectOptions
  ): Promise<[FunctionRoutineAccount, TransactionObject]> {
    // TODO: Calculate the max size of data we can support up front then split into multiple txns

    const authorityPubkey = params.authority ?? payer;

    const routineKeypair = params.keypair ?? Keypair.generate();
    await program.verifyNewKeypair(routineKeypair);

    const functionState = await params.functionAccount.loadData();

    const cronSchedule: Buffer = params.schedule
      ? Buffer.from(parseCronSchedule(params.schedule), "utf-8")
      : Buffer.from(Array(64).fill(0));

    let escrowWallet: SwitchboardWallet;
    let escrowWalletAuthority: PublicKey;
    if (wallet) {
      escrowWallet = wallet;
      escrowWalletAuthority = (await escrowWallet.loadData()).authority;
      if (
        !escrowWalletAuthority.equals(payer) &&
        !escrowWalletAuthority.equals(authorityPubkey)
      ) {
        throw new errors.IncorrectAuthority(
          escrowWalletAuthority,
          authorityPubkey
        );
      }
    } else {
      escrowWallet = SwitchboardWallet.fromSeed(
        program,
        functionState.attestationQueue,
        authorityPubkey,
        params.functionAccount.publicKey.toBytes()
      );
      escrowWalletAuthority = authorityPubkey;
    }

    const instruction = types.functionRoutineInit(
      program,
      {
        params: {
          // Metadata Config
          name: new Uint8Array(Buffer.from(params.name ?? "", "utf8")),
          metadata: new Uint8Array(Buffer.from(params.metadata ?? "", "utf8")),

          // Fees
          bounty: params?.bounty
            ? typeof params.bounty === "number"
              ? new BN(params.bounty)
              : params.bounty
            : null,

          // Execution Config
          schedule: cronSchedule,
          maxContainerParamsLen: null,
          containerParams: new Uint8Array(
            params.containerParams ?? Buffer.from("")
          ),
        },
      },
      {
        routine: routineKeypair.publicKey,
        authority: authorityPubkey,
        function: params.functionAccount.publicKey,
        functionAuthority: functionState.authority,
        escrowWallet: escrowWallet.publicKey,
        escrowWalletAuthority: escrowWalletAuthority,
        escrowTokenWallet: anchor.utils.token.associatedAddress({
          mint: program.mint.address,
          owner: escrowWallet.publicKey,
        }),
        mint: program.mint.address,
        attestationQueue: functionState.attestationQueue,
        payer,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      }
    );
    return [
      new FunctionRoutineAccount(program, routineKeypair.publicKey),
      new TransactionObject(payer, [instruction], [routineKeypair], options),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: FunctionRoutineAccountInitParams,
    wallet?: SwitchboardWallet,
    options?: SendTransactionObjectOptions
  ): Promise<[FunctionRoutineAccount, TransactionSignature]> {
    const [account, txnObject] = await this.createInstruction(
      program,
      program.walletPubkey,
      params,
      wallet,
      options
    );
    const txSignature = await program.signAndSend(txnObject, options);
    return [account, txSignature];
  }

  // public get wallet(): SwitchboardWallet {
  //   return new SwitchboardWallet(this.program, this.getEscrow());
  // }

  // public getEscrow(): PublicKey {
  //   return this.program.mint.getAssociatedAddress(this.publicKey);
  // }

  public async getBalance(): Promise<number> {
    const switchboardWallet = await this.getSwitchboardWallet();
    return switchboardWallet.getBalance();
  }

  public async getBalanceBN(): Promise<BN> {
    const switchboardWallet = await this.getSwitchboardWallet();
    return switchboardWallet.getBalanceBN();
  }

  public async setConfigInstruction(
    payer: PublicKey,
    params: FunctionRoutineSetConfigParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const routineState = await this.loadData();

    let name: any = null;
    if (params.name !== undefined) {
      name = new Uint8Array(Buffer.from(params.name ?? "", "utf8"));
    }
    let metadata: any = null;
    if (params.metadata !== undefined) {
      metadata = new Uint8Array(Buffer.from(params.metadata ?? "", "utf8"));
    }
    let containerParams: any = null;
    if (params.containerParams !== undefined) {
      containerParams = new Uint8Array(
        Buffer.from(params.containerParams ?? "", "utf8")
      );
    }
    const setConfigIxn = types.functionRoutineSetConfig(
      this.program,
      {
        params: {
          name,
          metadata,

          // Fees
          bounty: params?.bounty
            ? typeof params.bounty === "number"
              ? new BN(params.bounty)
              : params.bounty
            : null,

          schedule: params?.schedule
            ? Buffer.from(parseCronSchedule(params.schedule), "utf-8")
            : null,

          containerParams,
          appendContainerParams: params.appendContainerParams ?? false,
        },
      },
      {
        routine: this.publicKey,
        authority: routineState.authority,
      }
    );

    return new TransactionObject(
      payer,
      [setConfigIxn],
      params?.authority ? [params.authority] : [],
      options
    );
  }

  public async setConfig(
    params: FunctionRoutineSetConfigParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.setConfigInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public async fundInstruction(
    payer: PublicKey,
    params: SwitchboardWalletFundParams,
    options?: TransactionObjectOptions
  ): Promise<TransactionObject> {
    const switchboardWallet = await this.getSwitchboardWallet();
    return await switchboardWallet.fundInstruction(payer, params, options);
  }

  public async fund(
    params: SwitchboardWalletFundParams,
    options?: SendTransactionObjectOptions
  ): Promise<TransactionSignature> {
    return await this.fundInstruction(
      this.program.walletPubkey,
      params,
      options
    ).then((txn) => this.program.signAndSend(txn, options));
  }

  public verifyIxn(
    params: FunctionRoutineVerifyParams
  ): TransactionInstruction {
    const ixn = types.functionRoutineVerify(
      this.program,
      {
        params: {
          observedTime: new BN(
            params.observedTime
              ? params.observedTime
              : Math.floor(Date.now() / 1000)
          ),
          nextAllowedTimestamp: new BN(params.nextAllowedTimestamp),
          errorCode: params.isFailure ? 1 : 0,
          mrEnclave: Array.from(parseRawMrEnclave(params.mrEnclave)),

          containerParamsHash: Array.from(
            parseRawBuffer(params.containerParamsHash)
          ),
        },
      },
      {
        routine: this.publicKey,
        functionEnclaveSigner: params.functionEnclaveSigner,
        escrowWallet: params.escrowWallet,
        escrowTokenWallet: anchor.utils.token.associatedAddress({
          mint: NativeMint.address,
          owner: params.escrowWallet,
        }),
        function: params.function,
        functionEscrowTokenWallet: params.functionEscrow,
        verifierQuote: params.verifierQuote,
        verifierEnclaveSigner: params.verifierEnclaveSigner,
        verifierPermission: params.verifierPermission,
        attestationQueue: params.attestationQueue,
        receiver: params.receiver,
        tokenProgram: TOKEN_PROGRAM_ID,
      }
    );

    return ixn;
  }
}
