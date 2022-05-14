/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/new-for-builtins */
import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import {
  AccountInfo,
  Keypair,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  chalkString,
  prettyPrintCrank,
  prettyPrintQueue,
  promiseWithTimeout,
} from "@switchboard-xyz/sbv2-utils";
import {
  CrankAccount,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import fs from "fs";
import path from "path";
import BaseCommand from "../../BaseCommand";
import { verifyProgramHasPayer } from "../../utils";
import { packAndSend } from "../../utils/transaction";

export default class CustomQueue extends BaseCommand {
  static description = "create a custom queue";

  static aliases = ["custom:queue"];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite output file if existing",
      default: false,
    }),
    authority: flags.string({
      char: "a",
      description:
        "keypair to delegate authority to for creating permissions targeted at the queue",
    }),
    name: flags.string({
      char: "n",
      description: "name of the queue for easier identification",
      default: "Custom Queue",
    }),
    minStake: flags.string({
      description: "minimum stake required by an oracle to join the queue",
      default: "0",
    }),
    reward: flags.string({
      char: "r",
      description:
        "oracle rewards for successfully responding to an update request",
      default: "0",
    }),
    crankSize: flags.integer({
      char: "c",
      description: "size of the crank",
      default: 100,
    }),
    oracleTimeout: flags.integer({
      char: "o",
      description: "number of oracles to add to the queue",
      default: 180,
    }),
    numOracles: flags.integer({
      char: "o",
      description: "number of oracles to add to the queue",
    }),
    queueSize: flags.integer({
      description: "maximum number of oracles the queue can support",
      default: 100,
    }),
    unpermissionedFeeds: flags.boolean({
      description: "permit unpermissioned feeds",
      default: false,
    }),
  };

  static args = [
    {
      name: "outputFile",
      required: true,
      description: "Output file to save accounts to",
    },
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { flags, args } = this.parse(CustomQueue);
    const payerKeypair = programWallet(this.program);

    const outputPath =
      args.outputFile.startsWith("/") || args.outputFile.startsWith("C:")
        ? args.outputFile
        : path.join(process.cwd(), args.outputFile);

    if (fs.existsSync(outputPath) && args.force === false) {
      throw new Error(`output json file already exists: ${outputPath}`);
    }

    const authorityKeypair = await this.loadAuthority(flags.authority);
    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );
    const tokenMint = new spl.Token(
      this.program.provider.connection,
      spl.NATIVE_MINT,
      spl.TOKEN_PROGRAM_ID,
      payerKeypair
    );

    const ixns: (TransactionInstruction | TransactionInstruction[])[] = [];
    const signers: Keypair[] = [payerKeypair, authorityKeypair];

    try {
      await programStateAccount.loadData();
    } catch {
      const vaultKeypair = anchor.web3.Keypair.generate();
      ixns.push([
        SystemProgram.createAccount({
          fromPubkey: payerKeypair.publicKey,
          newAccountPubkey: vaultKeypair.publicKey,
          lamports:
            await this.program.provider.connection.getMinimumBalanceForRentExemption(
              spl.AccountLayout.span
            ),
          space: spl.AccountLayout.span,
          programId: spl.TOKEN_PROGRAM_ID,
        }),
        spl.Token.createInitAccountInstruction(
          spl.TOKEN_PROGRAM_ID,
          tokenMint.publicKey,
          vaultKeypair.publicKey,
          payerKeypair.publicKey
        ),
        await this.program.methods
          .programInit({
            stateBump,
          })
          .accounts({
            state: programStateAccount.publicKey,
            authority: payerKeypair.publicKey,
            tokenMint: tokenMint.publicKey,
            vault: vaultKeypair.publicKey,
            payer: payerKeypair.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            daoMint: tokenMint.publicKey,
          })
          .instruction(),
      ]);
      signers.push(vaultKeypair);
    }

    const queueKeypair = anchor.web3.Keypair.generate();
    const queueBuffer = anchor.web3.Keypair.generate();
    const queueSize = flags.queueSize * 32 + 8;

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: queueKeypair.publicKey,
    });

    this.logger.info(chalkString("OracleQueue", queueKeypair.publicKey));
    this.logger.info(chalkString("OracleBuffer", queueBuffer.publicKey));

    const crankKeypair = anchor.web3.Keypair.generate();
    const crankBuffer = anchor.web3.Keypair.generate();
    const crankSize = flags.crankSize ? flags.crankSize * 40 + 8 : 0;

    this.logger.info(chalkString("CrankAccount", crankKeypair.publicKey));
    this.logger.info(chalkString("CrankBuffer", crankBuffer.publicKey));

    const crankAccount = new CrankAccount({
      program: this.program,
      publicKey: crankKeypair.publicKey,
    });

    ixns.push(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: queueBuffer.publicKey,
        space: queueSize,
        lamports:
          await this.program.provider.connection.getMinimumBalanceForRentExemption(
            queueSize
          ),
        programId: this.program.programId,
      }),
      await this.program.methods
        .oracleQueueInit({
          name: Buffer.from(flags.name).slice(0, 32),
          metadata: Buffer.from("").slice(0, 64),
          reward: flags.reward ? new anchor.BN(flags.reward) : new anchor.BN(0),
          minStake: flags.minStake
            ? new anchor.BN(flags.minStake)
            : new anchor.BN(0),
          feedProbationPeriod: 0,
          oracleTimeout: flags.oracleTimeout,
          slashingEnabled: false,
          varianceToleranceMultiplier: SwitchboardDecimal.fromBig(new Big(2)),
          authority: authorityKeypair.publicKey,
          consecutiveFeedFailureLimit: new anchor.BN(1000),
          consecutiveOracleFailureLimit: new anchor.BN(1000),
          minimumDelaySeconds: 5,
          queueSize: flags.queueSize,
          unpermissionedFeeds: flags.unpermissionedFeeds ?? false,
        })
        .accounts({
          oracleQueue: queueKeypair.publicKey,
          authority: authorityKeypair.publicKey,
          buffer: queueBuffer.publicKey,
          systemProgram: SystemProgram.programId,
          payer: payerKeypair.publicKey,
          mint: tokenMint.publicKey,
        })
        .instruction(),
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: crankBuffer.publicKey,
        space: crankSize,
        lamports:
          await this.program.provider.connection.getMinimumBalanceForRentExemption(
            crankSize
          ),
        programId: this.program.programId,
      }),
      await this.program.methods
        .crankInit({
          name: Buffer.from("Crank").slice(0, 32),
          metadata: Buffer.from("").slice(0, 64),
          crankSize: flags.crankSize,
        })
        .accounts({
          crank: crankKeypair.publicKey,
          queue: queueKeypair.publicKey,
          buffer: crankBuffer.publicKey,
          systemProgram: SystemProgram.programId,
          payer: payerKeypair.publicKey,
        })
        .instruction()
    );
    signers.push(queueKeypair, queueBuffer, crankKeypair, crankBuffer);

    const finalTransactions: (
      | TransactionInstruction
      | TransactionInstruction[]
    )[] = [];

    const oracleAccounts = await Promise.all(
      Array.from(Array(flags.numOracles).keys()).map(async (n) => {
        const name = `Oracle-${n + 1}`;
        const tokenWalletKeypair = anchor.web3.Keypair.generate();
        const [oracleAccount, oracleBump] = OracleAccount.fromSeed(
          this.program,
          queueAccount,
          tokenWalletKeypair.publicKey
        );

        this.logger.info(chalkString(name, oracleAccount.publicKey));

        const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
          this.program,
          authorityKeypair.publicKey,
          queueAccount.publicKey,
          oracleAccount.publicKey
        );
        this.logger.info(
          chalkString(`Permission-${n + 1}`, permissionAccount.publicKey)
        );

        finalTransactions.push([
          SystemProgram.createAccount({
            fromPubkey: payerKeypair.publicKey,
            newAccountPubkey: tokenWalletKeypair.publicKey,
            lamports:
              await this.program.provider.connection.getMinimumBalanceForRentExemption(
                spl.AccountLayout.span
              ),
            space: spl.AccountLayout.span,
            programId: spl.TOKEN_PROGRAM_ID,
          }),
          spl.Token.createInitAccountInstruction(
            spl.TOKEN_PROGRAM_ID,
            tokenMint.publicKey,
            tokenWalletKeypair.publicKey,
            programStateAccount.publicKey
          ),
          await this.program.methods
            .oracleInit({
              name: Buffer.from(name).slice(0, 32),
              metadata: Buffer.from("").slice(0, 128),
              stateBump,
              oracleBump,
            })
            .accounts({
              oracle: oracleAccount.publicKey,
              oracleAuthority: authorityKeypair.publicKey,
              queue: queueKeypair.publicKey,
              wallet: tokenWalletKeypair.publicKey,
              programState: programStateAccount.publicKey,
              systemProgram: SystemProgram.programId,
              payer: payerKeypair.publicKey,
            })
            .instruction(),
          await this.program.methods
            .permissionInit({})
            .accounts({
              permission: permissionAccount.publicKey,
              authority: authorityKeypair.publicKey,
              granter: queueAccount.publicKey,
              grantee: oracleAccount.publicKey,
              payer: payerKeypair.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .instruction(),
          await this.program.methods
            .permissionSet({
              permission: { permitOracleHeartbeat: null },
              enable: true,
            })
            .accounts({
              permission: permissionAccount.publicKey,
              authority: authorityKeypair.publicKey,
            })
            .instruction(),
        ]);
        signers.push(tokenWalletKeypair);
        return {
          oracleAccount,
          name,
          permissionAccount,
          tokenWalletKeypair,
        };
      })
    );

    const createAccountSignatures = packAndSend(
      this.program,
      ixns,
      finalTransactions,
      signers,
      payerKeypair.publicKey
    );

    let queueWs: number;
    const customQueuePromise = new Promise((resolve: (result: any) => void) => {
      queueWs = this.program.provider.connection.onAccountChange(
        queueAccount.publicKey,
        (accountInfo: AccountInfo<Buffer>, slot) => {
          const accountCoder = new anchor.BorshAccountsCoder(this.program.idl);
          resolve(
            accountCoder.decode("OracleQueueAccountData", accountInfo.data)
          );
        }
      );
    });

    const queueData = await promiseWithTimeout(
      22_000,
      customQueuePromise
    ).finally(() => {
      try {
        this.program.provider.connection.removeAccountChangeListener(queueWs);
      } catch {}
    });

    if (this.silent) {
      console.log(queueAccount.publicKey.toString());
      return;
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          name: flags.name,
          queueAccount: queueKeypair.publicKey.toString(),
          crankAccount: crankKeypair.publicKey.toString(),
          queueReward: flags.reward.toString(),
          minStake: flags.minStake.toString(),
          oracleTimeout: flags.oracleTimeout.toString(),
          oracleAccounts: [
            oracleAccounts.map((oracle) => {
              return {
                name: oracle.name,
                oracleAccount: oracle.oracleAccount.publicKey.toString(),
                tokenWallet: oracle.tokenWalletKeypair.publicKey.toString(),
                permissionAccount:
                  oracle.permissionAccount.publicKey.toString(),
              };
            }),
          ],
        },
        undefined,
        2
      )
    );

    this.logger.info(
      "\r\n" + (await prettyPrintQueue(queueAccount, queueData, false))
    );
    this.logger.info(
      await prettyPrintCrank(crankAccount, undefined, false, 30)
    );
  }

  async catch(error) {
    super.catch(error, "Failed to create custom queue");
  }
}
