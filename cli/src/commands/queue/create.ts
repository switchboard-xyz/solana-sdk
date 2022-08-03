/* eslint-disable complexity */
/* eslint-disable unicorn/new-for-builtins */
import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token-v2";
import {
  AccountInfo,
  Keypair,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  chalkString,
  packAndSend,
  prettyPrintCrank,
  prettyPrintOracle,
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

export default class QueueCreate extends BaseCommand {
  static description = "create a custom queue";

  static aliases = ["custom:queue"];

  static flags = {
    ...BaseCommand.flags,
    force: Flags.boolean({
      description: "overwrite output file if existing",
      default: false,
    }),
    authority: Flags.string({
      char: "a",
      description:
        "keypair to delegate authority to for creating permissions targeted at the queue",
    }),
    name: Flags.string({
      char: "n",
      description: "name of the queue for easier identification",
      default: "Custom Queue",
    }),
    minStake: Flags.string({
      description: "minimum stake required by an oracle to join the queue",
      default: "0",
    }),
    reward: Flags.string({
      char: "r",
      description:
        "oracle rewards for successfully responding to an update request",
      default: "0",
    }),
    crankSize: Flags.integer({
      char: "c",
      description: "size of the crank",
      default: 100,
    }),
    oracleTimeout: Flags.integer({
      description: "number of oracles to add to the queue",
      default: 180,
    }),
    numOracles: Flags.integer({
      char: "o",
      description: "number of oracles to add to the queue",
    }),
    queueSize: Flags.integer({
      description: "maximum number of oracles the queue can support",
      default: 100,
    }),
    unpermissionedFeeds: Flags.boolean({
      description: "permit unpermissioned feeds",
      default: false,
    }),
    unpermissionedVrf: Flags.boolean({
      description: "permit unpermissioned VRF accounts",
      default: false,
    }),
    enableBufferRelayers: Flags.boolean({
      description: "enable oracles to fulfill buffer relayer requests",
      default: false,
    }),
    outputFile: Flags.string({
      char: "f",
      description: "output queue schema to a json file",
      required: false,
    }),
  };

  async run() {
    verifyProgramHasPayer(this.program);
    const { flags, args } = await this.parse(QueueCreate);
    const payerKeypair = programWallet(this.program);
    const signers: Keypair[] = [payerKeypair];

    const outputPath =
      flags.outputFile === undefined
        ? undefined
        : flags.outputFile.startsWith("/") || flags.outputFile.startsWith("C:")
        ? flags.outputFile
        : path.join(process.cwd(), flags.outputFile);

    if (outputPath && fs.existsSync(outputPath) && flags.force === false) {
      throw new Error(`output json file already exists: ${outputPath}`);
    }

    const authorityKeypair = await this.loadAuthority(flags.authority);
    if (!authorityKeypair.publicKey.equals(payerKeypair.publicKey)) {
      signers.push(authorityKeypair);
    }

    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );

    const mint = await spl.getMint(
      this.program.provider.connection,
      spl.NATIVE_MINT,
      undefined,
      spl.TOKEN_PROGRAM_ID
    );

    const createQueueTxns: (
      | TransactionInstruction
      | TransactionInstruction[]
    )[] = [];

    // create program state account if it doesnt exist
    try {
      await programStateAccount.loadData();
    } catch {
      const vaultKeypair = anchor.web3.Keypair.generate();
      createQueueTxns.push([
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
        spl.createInitializeAccountInstruction(
          vaultKeypair.publicKey,
          mint.address,
          payerKeypair.publicKey,
          spl.TOKEN_PROGRAM_ID
        ),
        await this.program.methods
          .programInit({
            stateBump,
          })
          .accounts({
            state: programStateAccount.publicKey,
            authority: payerKeypair.publicKey,
            tokenMint: mint.address,
            vault: vaultKeypair.publicKey,
            payer: payerKeypair.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            daoMint: mint.address,
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

    this.logger.debug(chalkString("OracleQueue", queueKeypair.publicKey));
    this.logger.debug(chalkString("OracleBuffer", queueBuffer.publicKey));

    createQueueTxns.push(
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
          unpermissionedVrf: flags.unpermissionedVrf ?? false,
          enableBufferRelayers: flags.enableBufferRelayers ?? false,
        })
        .accounts({
          oracleQueue: queueKeypair.publicKey,
          authority: authorityKeypair.publicKey,
          buffer: queueBuffer.publicKey,
          systemProgram: SystemProgram.programId,
          payer: payerKeypair.publicKey,
          mint: mint.address,
        })
        .instruction()
    );
    signers.push(queueKeypair, queueBuffer);

    // add crank txns
    const setupQueueTxns: (
      | TransactionInstruction
      | TransactionInstruction[]
    )[] = [];

    let crankAccount: CrankAccount | undefined;
    if (flags.crankSize) {
      const crankKeypair = anchor.web3.Keypair.generate();
      const crankBuffer = anchor.web3.Keypair.generate();
      const crankSize = flags.crankSize ? flags.crankSize * 40 + 8 : 0;

      this.logger.debug(chalkString("CrankAccount", crankKeypair.publicKey));
      this.logger.debug(chalkString("CrankBuffer", crankBuffer.publicKey));
      crankAccount = new CrankAccount({
        program: this.program,
        publicKey: crankKeypair.publicKey,
      });
      signers.push(crankKeypair, crankBuffer);

      setupQueueTxns.push(
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
    }

    // create any oracles
    const createOracleIxns: (
      | TransactionInstruction
      | TransactionInstruction[]
    )[] = [];

    const oracleAccounts = await Promise.all(
      [...Array(flags.numOracles).keys()].map(async (n) => {
        const name = `Oracle-${n + 1}`;
        const tokenWalletKeypair = anchor.web3.Keypair.generate();
        const [oracleAccount, oracleBump] = OracleAccount.fromSeed(
          this.program,
          queueAccount,
          tokenWalletKeypair.publicKey
        );

        this.logger.debug(chalkString(name, oracleAccount.publicKey));

        const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
          this.program,
          authorityKeypair.publicKey,
          queueAccount.publicKey,
          oracleAccount.publicKey
        );
        this.logger.debug(
          chalkString(`Permission-${n + 1}`, permissionAccount.publicKey)
        );

        createOracleIxns.push([
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
          spl.createInitializeAccountInstruction(
            tokenWalletKeypair.publicKey,
            mint.address,
            programStateAccount.publicKey,
            spl.TOKEN_PROGRAM_ID
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
              // eslint-disable-next-line unicorn/no-null
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

    const ixnBatches = [createQueueTxns];
    if (setupQueueTxns.length > 0) {
      ixnBatches.push(setupQueueTxns);
    }

    if (createOracleIxns.length > 0) {
      ixnBatches.push(createOracleIxns);
    }

    const createAccountSignatures = packAndSend(
      this.program,
      ixnBatches,
      signers,
      payerKeypair.publicKey
    ).catch((error) => {
      this.logger.error(error);
      throw error;
    });

    let queueWs: number;
    const queueInitPromise = new Promise((resolve: (result: any) => void) => {
      queueWs = this.program.provider.connection.onAccountChange(
        queueKeypair.publicKey,
        (accountInfo: AccountInfo<Buffer>, slot) => {
          const queueData = new anchor.BorshAccountsCoder(
            this.program.idl
          ).decode("OracleQueueAccountData", accountInfo.data);
          resolve(queueData);
        }
      );
    });

    const result = await promiseWithTimeout(45_000, queueInitPromise).finally(
      () => {
        try {
          this.program.provider.connection.removeAccountChangeListener(queueWs);
        } catch {}
      }
    );

    let queueData: any;
    try {
      queueData = await queueAccount.loadData();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }

    if (outputPath) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(
        outputPath,
        JSON.stringify(
          {
            name: flags.name,
            queueAccount: queueKeypair.publicKey.toString(),
            queueSize: flags.queueSize,
            queueReward: Number.parseInt(flags.reward, 10),
            minStake: Number.parseInt(flags.minStake, 10),
            oracleTimeout: flags.oracleTimeout,
            // crankAccount === undefined ? undefined :
            crankAccounts:
              crankAccount === undefined
                ? undefined
                : [
                    {
                      name: "Crank",
                      crankAccount: crankAccount.publicKey.toString(),
                      maxRows: flags.crankSize,
                    },
                  ],
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
    }

    if (this.silent) {
      console.log(queueAccount.publicKey.toString());
      return;
    }

    try {
      this.logger.info(
        "\r\n" + (await prettyPrintQueue(queueAccount, queueData, false))
      );
    } catch {}

    try {
      this.logger.info(
        await prettyPrintCrank(crankAccount, undefined, false, 30)
      );
    } catch {}

    for await (const oracle of oracleAccounts) {
      try {
        this.logger.info(
          await prettyPrintOracle(oracle.oracleAccount, undefined, true, 30)
        );
      } catch {}
    }
  }

  async catch(error) {
    super.catch(error, "Failed to create custom queue");
  }
}
