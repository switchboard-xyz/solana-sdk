import * as anchor from "@project-serum/anchor";
import { MintInfo, Token } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { ProgramStateAccount } from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import { DEFAULT_CONTEXT } from "../../types/context/context";
import { LogProvider } from "../../types/context/logging";
import { chalkString, pubKeyConverter } from "../utils";
import { IProgramStateClass, ProgramStateData } from "./types";

export class ProgramStateClass implements IProgramStateClass {
  account: ProgramStateAccount;
  logger: LogProvider;

  publicKey: PublicKey;
  authorityPublicKey: PublicKey;
  tokenMintPublicKey: PublicKey;
  tokenVaultPublicKey: PublicKey;

  token: Token;
  mintInfo: MintInfo;

  private constructor() {}

  static async build(
    program: anchor.Program,
    context = DEFAULT_CONTEXT
  ): Promise<ProgramStateClass> {
    const state = new ProgramStateClass();
    state.logger = context.logger;

    // eslint-disable-next-line unicorn/prefer-ternary
    [state.account] = ProgramStateAccount.fromSeed(program);

    await state.loadData();
    return state;
  }

  // loads anchor idl and parses response
  async loadData() {
    const data: ProgramStateData = await this.account.loadData();

    this.publicKey = this.account.publicKey;

    this.authorityPublicKey = data.authority;
    this.tokenMintPublicKey = data.tokenMint;
    this.tokenVaultPublicKey = data.tokenVault;

    this.token = await this.account.getTokenMint();
    this.mintInfo = await this.token.getMintInfo();
  }

  static async getAssociatedTokenAddress(
    program: anchor.Program,
    publicKey: PublicKey,
    context = DEFAULT_CONTEXT
  ): Promise<PublicKey> {
    const state = await ProgramStateClass.build(program, context);
    const account = await state.token.getOrCreateAssociatedAccountInfo(
      publicKey
    );
    return account.address;
  }

  static async getProgramTokenAddress(
    program: anchor.Program,
    context = DEFAULT_CONTEXT
  ): Promise<PublicKey> {
    const state = await ProgramStateClass.build(program, context);
    const account = await state.token.getOrCreateAssociatedAccountInfo(
      program.provider.wallet.publicKey
    );
    return account.address;
  }

  toJSON(): IProgramStateClass {
    return {
      publicKey: this.account.publicKey,
      authorityPublicKey: this.authorityPublicKey,
      tokenMintPublicKey: this.tokenMintPublicKey,
      tokenVaultPublicKey: this.tokenVaultPublicKey,
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Program State", this.publicKey) + "\r\n"
    );
    outputString +=
      chalkString("programId", this.account.program.programId) + "\r\n";
    outputString += chalkString("authority", this.authorityPublicKey) + "\r\n";
    outputString += chalkString("tokenMint", this.tokenMintPublicKey) + "\r\n";
    outputString +=
      chalkString("tokenVault", this.tokenVaultPublicKey) + "\r\n";

    return outputString;
  }

  prettyPrintTokenMint(): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Token Mint", this.token.publicKey) + "\r\n"
    );
    outputString += chalkString("decimals", this.mintInfo.decimals) + "\r\n";
    outputString +=
      chalkString("supply", this.mintInfo.supply.toString()) + "\r\n";

    return outputString;
  }
  static async print(program: anchor.Program): Promise<string> {
    const accountClass = await ProgramStateClass.build(program);
    return accountClass.prettyPrint() + accountClass.prettyPrintTokenMint();
  }
}
