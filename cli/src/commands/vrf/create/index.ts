import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token-v2";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  prettyPrintVrf,
  sleep,
  verifyProgramHasPayer,
} from "@switchboard-xyz/sbv2-utils";
import {
  Callback,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import fs from "fs";
import BaseCommand from "../../../BaseCommand";
import { loadKeypair } from "../../../utils";

export default class VrfCreate extends BaseCommand {
  static description = "create a Switchboard VRF Account";

  static flags = {
    ...BaseCommand.flags,
    vrfKeypair: Flags.string({
      description: "filesystem path of existing keypair to use for VRF Account",
    }),
    enable: Flags.boolean({
      description: "enable vrf permissions",
    }),
    authority: Flags.string({
      description: "alternative keypair to use for VRF authority",
    }),
    queueAuthority: Flags.string({
      description: "alternative keypair to use for queue authority",
    }),
    callback: Flags.string({
      description: "filesystem path to callback json",
      exclusive: ["accountMeta", "callbackPid", "ixData"],
    }),
    accountMeta: Flags.string({
      description: "account metas for VRF callback",
      multiple: true,
      exclusive: ["callback"],
      dependsOn: ["callbackPid", "ixData"],
    }),
    callbackPid: Flags.string({
      description: "callback program ID",
      exclusive: ["callback"],
      dependsOn: ["accountMeta", "ixData"],
    }),
    ixData: Flags.string({
      description: "serialized instruction data in bytes",
      exclusive: ["callback"],
      dependsOn: ["accountMeta", "callbackPid"],
    }),
  };

  static args = [
    {
      name: "queueKey",

      description: "public key of the oracle queue to create VRF account for",
    },
  ];

  static examples = [
    'sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": false,"isWritable": false}"',
    'sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority oracle-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HYKi1grticLXPe5vqapUHhm976brwqRob8vqRnWMKWL5","isSigner": false,"isWritable": true}" -a "{"pubkey": "6vG9QLMgSvsfjvSpDxWfZ2MGPYGzEYoBxviLG7cr4go","isSigner": false,"isWritable": false}"',
    "sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority queue-authority-keypair.json --callback callback-example.json",
  ];

  async run() {
    const { args, flags } = await this.parse(VrfCreate);
    verifyProgramHasPayer(this.program);
    const payerKeypair = programWallet(this.program);

    let callback: Callback;
    if (flags.callback) {
      callback = JSON.parse(fs.readFileSync(flags.callback, "utf8"));
    } else if (flags.callbackPid && flags.accountMeta && flags.ixData) {
      const ixDataString =
        flags.ixData.startsWith("[") && flags.ixData.endsWith("]")
          ? flags.ixData.slice(1, -1)
          : flags.ixData;
      const ixDataArray = ixDataString.split(",");
      const ixData = ixDataArray.map((n) => Number.parseInt(n, 10));
      callback = {
        programId: new PublicKey(flags.callbackPid),
        accounts: flags.accountMeta.map((a) => {
          const parsedObject: {
            pubkey: string;
            isSigner: boolean;
            isWritable: boolean;
          } = JSON.parse(a);
          return {
            pubkey: new PublicKey(parsedObject.pubkey),
            isSigner: Boolean(parsedObject.isSigner),
            isWritable: Boolean(parsedObject.isWritable),
          };
        }),
        ixData: Buffer.from(ixData),
      };
    } else {
      throw new Error(`No callback provided`);
    }

    // load VRF params
    const vrfSecret = flags.vrfKeypair
      ? await loadKeypair(flags.vrfKeypair)
      : anchor.web3.Keypair.generate();
    const authority = flags.authority
      ? await loadKeypair(flags.authority)
      : payerKeypair;
    const queueAuthority: Keypair = flags.queueAuthority
      ? await loadKeypair(flags.queueAuthority)
      : payerKeypair;

    // load Switchboard accounts
    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: new PublicKey(args.queueKey),
    });
    const queue = await queueAccount.loadData();
    const mint = await queueAccount.loadMint();
    const vrfEscrowPubkey = await spl.getAssociatedTokenAddress(
      mint.address,
      vrfSecret.publicKey,
      true,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      vrfSecret.publicKey
    );

    // create account txns
    const createTxn = new Transaction();
    createTxn.add(
      spl.createAssociatedTokenAccountInstruction(
        payerKeypair.publicKey,
        vrfEscrowPubkey,
        vrfSecret.publicKey,
        mint.address,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      ),
      spl.createSetAuthorityInstruction(
        vrfEscrowPubkey,
        vrfSecret.publicKey,
        spl.AuthorityType.AccountOwner,
        programStateAccount.publicKey,
        [payerKeypair, vrfSecret],
        spl.TOKEN_PROGRAM_ID
      ),
      SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: vrfSecret.publicKey,
        space: this.program.account.vrfAccountData.size,
        lamports:
          await this.program.provider.connection.getMinimumBalanceForRentExemption(
            this.program.account.vrfAccountData.size
          ),
        programId: this.program.programId,
      }),
      await this.program.methods
        .vrfInit({
          stateBump,
          callback: callback,
        })
        .accounts({
          vrf: vrfSecret.publicKey,
          escrow: vrfEscrowPubkey,
          authority: authority.publicKey,
          oracleQueue: queueAccount.publicKey,
          programState: programStateAccount.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        })
        .instruction(),
      await this.program.methods
        .permissionInit({})
        .accounts({
          permission: permissionAccount.publicKey,
          authority: queue.authority,
          granter: queueAccount.publicKey,
          grantee: vrfSecret.publicKey,
          payer: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );
    // if flag, enable permissions
    if (flags.enable) {
      if (!queueAuthority.publicKey.equals(queue.authority)) {
        throw new Error(
          `Invalid queue authority, received ${queueAuthority.publicKey}, expected ${queue.authority}`
        );
      }

      createTxn.add(
        await this.program.methods
          .permissionSet({
            permission: { permitVrfRequests: undefined },
            enable: true,
          })
          .accounts({
            permission: permissionAccount.publicKey,
            authority: queue.authority,
          })
          .instruction()
      );
    }

    // send transaction
    const signature = await this.program.provider.sendAndConfirm(
      createTxn,
      [payerKeypair, vrfSecret, queueAuthority],
      { commitment: "finalized" }
    );

    if (this.silent) {
      console.log(vrfSecret.publicKey.toString());
      return;
    }

    await sleep(2000);

    this.logger.log(
      `https://explorer.solana.com/tx/${signature}?cluster=${this.cluster}`
    );
    this.logger.log(
      await prettyPrintVrf(
        new VrfAccount({
          program: this.program,
          publicKey: vrfSecret.publicKey,
        }),
        undefined,
        true
      )
    );
  }
}
