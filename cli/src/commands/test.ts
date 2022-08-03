import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token-v2";
import {
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { verifyProgramHasPayer } from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import BaseCommand from "../BaseCommand";
import { sleep } from "../utils";

function fromBN(n: anchor.BN, decimals = 0): Big {
  const big = new SwitchboardDecimal(n, decimals).toBig();
  // assert(n.cmp(new anchor.BN(big.toFixed())) === 0);
  return big;
}

export default class TestCommand extends BaseCommand {
  static description = "sandbox";

  static flags = {
    ...BaseCommand.flags,
    // name: Flags.string({
    //   char: "n",
    //   description: "name of the job account for easier identification",
    //   default: "",
    // }),
  };

  static args = [
    {
      name: "oracleKey",
      description: "public key of the oracle to deposit funds into",
    },
  ];

  async run() {
    const { args, flags } = await this.parse(TestCommand);
    verifyProgramHasPayer(this.program);

    const oracleAuthority = programWallet(this.program);

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: new PublicKey(args.oracleKey),
    });

    /// //////////////////////////////////////////////////
    const oracle = await oracleAccount.loadData();
    const queueAccount = new OracleQueueAccount({
      program: oracleAccount.program,
      publicKey: oracle.queuePubkey,
    });
    const queue = await queueAccount.loadData();
    const mint = await queueAccount.loadMint();
    const [programState, stateBump] = ProgramStateAccount.fromSeed(
      oracleAccount.program
    );
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      oracleAccount.program,
      queue.authority,
      queueAccount.publicKey,
      oracleAccount.publicKey
    );
    const balanceNeeded = await spl.getMinimumBalanceForRentExemptAccount(
      oracleAccount.program.provider.connection
    );

    const minimumStakingWalletAmount = queue.minStake.isZero()
      ? // 0.1 wSOL
        new anchor.BN(0.1 * LAMPORTS_PER_SOL)
      : // 1.10x queue's minStake
        queue.minStake.add(queue.minStake.div(new anchor.BN(10)));

    // Check and create nonce account here
    const nonceSeed = "UnwrapStakingWallet";
    const noncePubkey = anchor.utils.publicKey.createWithSeedSync(
      oracleAuthority.publicKey,
      nonceSeed,
      SystemProgram.programId
    );
    try {
      const nonceAccount =
        await oracleAccount.program.provider.connection.getNonce(noncePubkey);
      if (!nonceAccount) {
        throw new Error("NonceAccount has not been created");
      }
    } catch (error) {
      if (error.message !== "NonceAccount has not been created") {
        throw error;
      }

      const nonceRentExemption =
        await oracleAccount.program.provider.connection.getMinimumBalanceForRentExemption(
          NONCE_ACCOUNT_LENGTH
        );
      const nonceTxn = new Transaction({ feePayer: oracleAuthority.publicKey });
      nonceTxn.add(
        SystemProgram.createAccountWithSeed({
          fromPubkey: oracleAuthority.publicKey,
          newAccountPubkey: noncePubkey,
          basePubkey: oracleAuthority.publicKey,
          seed: nonceSeed,
          lamports: nonceRentExemption,
          space: NONCE_ACCOUNT_LENGTH,
          programId: SystemProgram.programId,
        }), // init nonce account
        SystemProgram.nonceInitialize({
          noncePubkey: noncePubkey,
          authorizedPubkey: oracleAuthority.publicKey,
        })
      );

      const nonceSignature =
        await oracleAccount.program.provider.sendAndConfirm(nonceTxn, [
          oracleAuthority,
        ]);
      this.logger.info(
        `Created oracle nonce account to automatically unwrap oracle staking wallet, ${noncePubkey}, ${nonceSignature}`
      );
    }

    oracleAccount.program.provider.connection.onAccountChange(
      oracleAuthority.publicKey,
      async (accountInfo, slot) => {
        const nodeBalance = accountInfo.lamports / LAMPORTS_PER_SOL;

        if (nodeBalance < 0.5) {
          const stakingWalletAmount = (
            await oracleAccount.program.provider.connection.getTokenAccountBalance(
              oracle.tokenAccount
            )
          ).value;
          const unwrapAmountBN = new anchor.BN(stakingWalletAmount.amount).sub(
            minimumStakingWalletAmount
          );
          if (unwrapAmountBN.isNeg()) {
            this.logger.warn(
              `Oracle Authority is low on funds and not enough funds in the staking wallet to cover`
            );
          }

          const unwrapAmountUi = fromBN(unwrapAmountBN).div(LAMPORTS_PER_SOL);
          this.logger.info(
            `NodeBalance: ${nodeBalance}, unwrapping ${unwrapAmountUi} SOL`
          );

          // Load nonce
          const nonceAccount =
            await oracleAccount.program.provider.connection.getNonce(
              noncePubkey
            );
          if (!nonceAccount) {
            throw new Error("Failed to create and load nonceAccount");
          }

          // Create transaction
          const newAccount = anchor.web3.Keypair.generate();
          const txn = new Transaction({
            feePayer: oracleAuthority.publicKey,
            recentBlockhash: undefined,
            nonceInfo: {
              nonce: nonceAccount.nonce,
              nonceInstruction: SystemProgram.nonceAdvance({
                noncePubkey: noncePubkey,
                authorizedPubkey: oracleAuthority.publicKey,
              }),
            },
          });
          // create new wSOL account
          txn.add(
            SystemProgram.createAccount({
              fromPubkey: oracleAuthority.publicKey,
              newAccountPubkey: newAccount.publicKey,
              lamports: balanceNeeded,
              space: spl.AccountLayout.span,
              programId: spl.TOKEN_PROGRAM_ID,
            }),
            spl.createInitializeAccountInstruction(
              newAccount.publicKey,
              mint.address,
              oracleAuthority.publicKey,
              spl.TOKEN_PROGRAM_ID
            ),
            await oracleAccount.program.methods
              .oracleWithdraw({
                permissionBump,
                stateBump,
                amount: new anchor.BN(1), // only 1 token
              })
              .accounts({
                oracle: oracleAccount.publicKey,
                oracleAuthority: oracleAuthority.publicKey,
                tokenAccount: oracle.tokenAccount,
                withdrawAccount: newAccount.publicKey,
                oracleQueue: queueAccount.publicKey,
                permission: permissionAccount.publicKey,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                programState: programState.publicKey,
                systemProgram: SystemProgram.programId,
                payer: oracleAuthority.publicKey,
              })
              .instruction(),
            spl.createCloseAccountInstruction(
              newAccount.publicKey,
              oracleAuthority.publicKey,
              oracleAuthority.publicKey,
              [newAccount],
              spl.TOKEN_PROGRAM_ID
            )
          );

          const signature = await oracleAccount.program.provider.sendAndConfirm(
            txn,
            [oracleAuthority, newAccount]
          );
          this.logger.info(
            `Successfully unwrapped ${1} wSOL from oracles staking wallet: ${signature}`
          );
        }
      }
    );

    this.logger.info("Finished command");

    await sleep(5 * 60 * 1000);
  }

  async catch(error) {
    super.catch(error, "test command failed");
  }
}
