import { AttestationQueueAccountData } from "../generated/attestation-program/accounts/AttestationQueueAccountData.js";
import { FunctionAccountData } from "../generated/attestation-program/accounts/FunctionAccountData.js";
import { FunctionRequestAccountData } from "../generated/attestation-program/accounts/FunctionRequestAccountData.js";
import { VerifierAccountData } from "../generated/attestation-program/accounts/VerifierAccountData.js";
import { functionRequestVerify } from "../generated/attestation-program/instructions/functionRequestVerify.js";
import { functionVerify } from "../generated/attestation-program/instructions/functionVerify.js";
import { AttestationPermissionAccount } from "../index.js";
import {
  SB_ATTESTATION_PID,
  SwitchboardProgram,
} from "../SwitchboardProgram.js";

import { getEnv } from "./env.js";
import type { FunctionResult } from "./functionResult.js";

import type { AnchorProvider } from "@coral-xyz/anchor";
import { utils } from "@coral-xyz/anchor";
import type {
  Cluster,
  Commitment,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { BN, isBase58, isHex } from "@switchboard-xyz/common";
import fetch from "cross-fetch";
import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export interface SolanaFunctionEnvironment {
  isSimulation?: boolean;
  cluster: Omit<Cluster, "testnet"> | "localnet";
  switchboard: PublicKey;
  // Required
  functionKey: PublicKey;
  // Required
  payer: PublicKey;
  // Required
  verifier: PublicKey;
  // Required
  rewardReceiver: PublicKey;

  // optional, but may not be needed until ixn building
  queueAuthority?: PublicKey;
  verifierEnclaveSigner?: PublicKey;

  // optional, may need to async fetch
  functionData?: Promise<FunctionAccountData>;

  functionRequestKey?: PublicKey;
  functionRequestData?: Promise<FunctionRequestAccountData>;
}

function unixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export class FunctionRunner {
  private readonly enclaveSigner: Keypair = Keypair.generate();
  private readonly start: number = unixTimestamp();

  private constructor(
    public readonly program: SwitchboardProgram,
    private env: SolanaFunctionEnvironment
  ) {}

  public isSimulation(): boolean {
    return this.env.isSimulation ?? false;
  }

  public get signer(): PublicKey {
    return this.enclaveSigner.publicKey;
  }

  public get connection(): Connection {
    return this.program.provider.connection;
  }

  // Required
  public get payer(): PublicKey {
    return this.env.payer;
  }

  // Required
  public get verifier(): PublicKey {
    return this.env.verifier;
  }

  // Required
  public get rewardReceiver(): PublicKey {
    return this.env.rewardReceiver;
  }

  public get provider(): AnchorProvider {
    return this.program.provider;
  }

  // Required
  public get functionKey(): PublicKey {
    return this.env.functionKey;
  }

  public get functionData(): Promise<FunctionAccountData> {
    // return this.env.functionData;
    if (!this.env.functionData) {
      this.env.functionData = FunctionAccountData.fetch(
        this.program,
        this.env.functionKey
      )
        .then((data) => {
          if (!data) {
            throw new Error("Function data not found!");
          }
          return data;
        })
        .catch((err) => {
          this.env.functionData = undefined;
          throw err;
        });
    }
    return this.env.functionData;
  }

  public get functionRequestKey(): PublicKey {
    if (!this.env.functionRequestKey) {
      throw new Error("Function request key not found!");
    }
    return this.env.functionRequestKey;
  }

  public get functionRequestData(): Promise<FunctionRequestAccountData> {
    if (!this.env.functionRequestData) {
      this.env.functionRequestData = FunctionRequestAccountData.fetch(
        this.program,
        this.functionRequestKey
      )
        .then((data) => {
          if (!data) {
            throw new Error("Function request data not found!");
          }
          return data;
        })
        .catch((err) => {
          this.env.functionRequestData = undefined;
          throw err;
        });
    }

    return this.env.functionRequestData;
  }

  // public get verifierPermission(): PublicKey {
  //   return PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from("PermissionAccountData"),
  //       this.env.queueAuthority.toBytes(),
  //       this.env.functionData.attestationQueue.toBytes(),
  //       this.env.verifier.toBytes(),
  //     ],
  //     this.program.attestationProgramId
  //   )[0];
  // }

  public static create(
    rpcEndpoint?: string,
    commitment: Commitment = "confirmed"
  ): FunctionRunner {
    const env = getEnv();

    if (env.IS_SIMULATION) {
      console.debug(`IS_SIMULATION: true`);
    }

    const cluster = env.CLUSTER;
    const connection = new Connection(
      rpcEndpoint ?? cluster === "localnet"
        ? "http://localhost:8899"
        : clusterApiUrl(cluster),
      {
        commitment,
        fetch: fetch,
      }
    );

    const switchboard = env.SWITCHBOARD
      ? new PublicKey(env.SWITCHBOARD)
      : SB_ATTESTATION_PID;

    // TODO: make sync version using local IDLs
    const program = SwitchboardProgram.from(
      connection,
      undefined,
      undefined,
      switchboard
    );

    // verifier provided env keys
    const payer = new PublicKey(env.PAYER);
    const verifier = new PublicKey(env.VERIFIER);
    const rewardReceiver = new PublicKey(env.REWARD_RECEIVER);

    // load function data
    const functionKey = new PublicKey(env.FUNCTION_KEY);
    const functionData =
      env.FUNCTION_DATA && isHex(env.FUNCTION_DATA)
        ? Promise.resolve(
            FunctionAccountData.decode(
              Buffer.concat([
                FunctionAccountData.discriminator,
                Buffer.from(
                  env.FUNCTION_DATA.startsWith("0x")
                    ? env.FUNCTION_DATA.slice(2)
                    : env.FUNCTION_DATA,
                  "hex"
                ),
              ])
            )
          )
        : undefined;

    // load verifier enclave signer
    const verifierEnclaveSigner =
      env.VERIFIER_ENCLAVE_SIGNER && isBase58(env.VERIFIER_ENCLAVE_SIGNER)
        ? new PublicKey(env.VERIFIER_ENCLAVE_SIGNER)
        : undefined;

    const queueAuthority =
      env.QUEUE_AUTHORITY && isBase58(env.QUEUE_AUTHORITY)
        ? new PublicKey(env.QUEUE_AUTHORITY)
        : undefined;

    // load function request info if provided
    const functionRequestKey =
      env.FUNCTION_REQUEST_KEY && isBase58(env.FUNCTION_REQUEST_KEY)
        ? new PublicKey(env.FUNCTION_REQUEST_KEY)
        : undefined;

    const functionRequestData = !functionRequestKey
      ? undefined
      : env.FUNCTION_REQUEST_DATA && isHex(env.FUNCTION_REQUEST_DATA)
      ? Promise.resolve(
          FunctionRequestAccountData.decode(
            Buffer.concat([
              FunctionRequestAccountData.discriminator,
              Buffer.from(
                env.FUNCTION_REQUEST_DATA.startsWith("0x")
                  ? env.FUNCTION_REQUEST_DATA.slice(2)
                  : env.FUNCTION_REQUEST_DATA,
                "hex"
              ),
            ])
          )
        )
      : undefined;

    return new FunctionRunner(program, {
      isSimulation: env.IS_SIMULATION ?? false,
      cluster,
      switchboard,
      functionKey,
      payer,
      verifier,
      rewardReceiver,
      functionData,
      verifierEnclaveSigner,
      queueAuthority,
      functionRequestKey,
      functionRequestData,
    });
  }

  private async loadQueueAuthority(): Promise<PublicKey> {
    if (!this.env.queueAuthority) {
      this.env.queueAuthority = await (async () => {
        const attestationQueueAccountData =
          await AttestationQueueAccountData.fetch(
            this.program,
            (
              await this.functionData
            ).attestationQueue
          );
        if (!attestationQueueAccountData) {
          throw new Error("AttestationQueue data not found!");
        }
        return attestationQueueAccountData.authority;
      })();
    }

    return this.env.queueAuthority;
  }

  private async loadVerifierEnclaveSigner(): Promise<PublicKey> {
    if (!this.env.verifierEnclaveSigner) {
      this.env.verifierEnclaveSigner = await (async () => {
        const verifierAccountData = await VerifierAccountData.fetch(
          this.program,
          this.verifier
        );
        if (!verifierAccountData) {
          throw new Error("Verifier data not found!");
        }
        return verifierAccountData.enclave.enclaveSigner;
      })();
    }

    return this.env.verifierEnclaveSigner;
  }

  public async getResult(
    ixs: TransactionInstruction[] = [],
    errorCode = 0
  ): Promise<FunctionResult> {
    const quote = this.generateQuote();
    // @TODO: check this - will be the source of problems if wrong
    const mrEnclave = quote.slice(432, 432 + 32);
    console.log(`MR ENCLAVE: 0x${quote.slice(432, 432 + 32).toString("hex")}`);

    // TODO: verify this mrEnclave value is present in the function/request config

    const verifyIxn: TransactionInstruction = this.env.functionRequestKey
      ? await this.buildFnRequestVerifyIxn(mrEnclave, errorCode)
      : await this.buildFnVerifyIxn(mrEnclave, errorCode);

    const { blockhash } = await this.connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: this.payer,
      recentBlockhash: blockhash,
    }).add(verifyIxn, ...ixs);
    transaction.partialSign(this.enclaveSigner);

    return {
      version: 1,
      quote: Array.from(quote),
      fn_key: Array.from(this.env.functionKey.toBytes()),
      signer: Array.from(this.signer.toBytes()),
      fn_request_key: this.env.functionRequestKey
        ? Array.from(this.env.functionRequestKey.toBytes())
        : [],
      fn_request_hash: [], // TODO: hash should be checked against
      chain_result_info: {
        serialized_tx: Array.from(
          transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          })
        ),
      },
    };
  }

  public async emit(
    ixs: TransactionInstruction[] = [],
    errorCode = 0
  ): Promise<void> {
    try {
      const functionResult = await this.getResult(ixs, errorCode);
      console.info(
        `FN_OUT: ${Buffer.from(JSON.stringify(functionResult)).toString("hex")}`
      );
    } catch (error) {
      throw new Error(`failed to get verify ixn: ${error}`);
    }
  }

  public async emitError(errorCode: 0): Promise<void> {
    try {
      const functionResult = await this.getResult([], errorCode);
      console.info(
        `FN_OUT: ${Buffer.from(JSON.stringify(functionResult)).toString("hex")}`
      );
    } catch (error) {
      throw new Error(`failed to get verify ixn: ${error}`);
    }
  }

  private generateQuote(): Buffer {
    // get sgx quote
    try {
      fs.accessSync("/dev/attestation/quote");
    } catch (err) {
      if (this.env.isSimulation) {
        console.log("WARNING: NOT IN TEE / NO QUOTE GENERATED");
      } else {
        throw new Error(`NOT IN TEE / FAILED TO GENERATE QUOTE`);
      }
    }

    const hash = crypto.createHash("sha256");
    hash.update(this.signer.toBytes());
    const data = Array.from(hash.digest());
    data.length = 64;

    fs.writeFileSync("/dev/attestation/user_report_data", Buffer.from(data));
    const quote = fs.readFileSync("/dev/attestation/quote");

    return quote;
  }

  private async buildFnVerifyIxn(
    mrEnclave: Buffer,
    errorCode = 0
  ): Promise<TransactionInstruction> {
    const functionData = await this.functionData;

    const queueAuthority = await this.loadQueueAuthority();
    const verifierPermission = AttestationPermissionAccount.fromSeed(
      this.program,
      queueAuthority,
      functionData.attestationQueue,
      this.verifier
    );

    const verifierEnclaveSigner = await this.loadVerifierEnclaveSigner();

    return functionVerify(
      this.program,
      {
        params: {
          observedTime: new BN(unixTimestamp()),
          nextAllowedTimestamp: new BN(unixTimestamp() + 100),
          errorCode: errorCode,
          mrEnclave: Array.from(mrEnclave),
        },
      },
      {
        function: this.env.functionKey,
        functionEnclaveSigner: this.signer,
        verifier: this.env.verifier,
        verifierSigner: verifierEnclaveSigner,
        verifierPermission: verifierPermission.publicKey,
        escrowWallet: functionData.escrowWallet,
        escrowTokenWallet: functionData.escrowTokenWallet,
        attestationQueue: functionData.attestationQueue,
        receiver: this.env.rewardReceiver,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      }
    );
  }

  private async buildFnRequestVerifyIxn(
    mrEnclave: Buffer,
    errorCode = 0
  ): Promise<TransactionInstruction> {
    if (!this.env.functionRequestData) {
      throw new Error(
        `Need to provide the function request data to build this instruction`
      );
    }

    const functionData = await this.functionData;
    const functionRequestData = await this.functionRequestData;

    const queueAuthority = await this.loadQueueAuthority();
    const verifierPermission = AttestationPermissionAccount.fromSeed(
      this.program,
      queueAuthority,
      functionData.attestationQueue,
      this.verifier
    );

    const verifierEnclaveSigner = await this.loadVerifierEnclaveSigner();

    return functionRequestVerify(
      this.program,
      {
        params: {
          observedTime: new BN(unixTimestamp()),
          errorCode: errorCode,
          mrEnclave: Array.from(mrEnclave),
          requestSlot: functionRequestData.activeRequest.requestSlot,
          containerParamsHash: functionRequestData.containerParamsHash,
        },
      },
      {
        request: this.env.functionRequestKey!,
        functionEnclaveSigner: this.signer,
        escrow: functionRequestData.escrow,
        function: this.env.functionKey,
        functionEscrow: functionData.escrowTokenWallet,
        verifierQuote: this.env.verifier,
        verifierEnclaveSigner: verifierEnclaveSigner,
        verifierPermission: verifierPermission.publicKey,
        state: this.program.attestationProgramState.publicKey,
        attestationQueue: functionData.attestationQueue,
        receiver: this.env.rewardReceiver,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      }
    );
  }
}
