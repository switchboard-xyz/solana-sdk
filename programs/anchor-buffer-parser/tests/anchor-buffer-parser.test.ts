import * as anchor from "@project-serum/anchor";
import { OracleJob, sleep } from "@switchboard-xyz/common";
import { SwitchboardTestContextV2 } from "@switchboard-xyz/solana.js";
import fetch from "node-fetch";
import { AnchorBufferParser } from "../target/types/anchor_buffer_parser";

describe("anchor-buffer-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const bufferParserProgram = anchor.workspace
    .AnchorBufferParser as anchor.Program<AnchorBufferParser>;

  // const bufferParserProgram = new anchor.Program(
  //   IDL,
  //   PROGRAM_ID,
  //   provider,
  //   new anchor.BorshCoder(IDL)
  // ) as anchor.Program<AnchorBufferParser>;

  let switchboard: SwitchboardTestContextV2;

  before(async () => {
    switchboard = await SwitchboardTestContextV2.loadFromProvider(provider, {
      // You can provide a keypair to so the PDA schemes dont change between test runs
      name: "Test Queue",
      // keypair: Keypair.generate(),
      queueSize: 10,
      reward: 0,
      minStake: 0,
      oracleTimeout: 900,
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: true,
      oracle: {
        name: "Test Oracle",
        enable: true,
        // stakingWalletKeypair: Keypair.generate(),
      },
    });
    await switchboard.start("dev-v2-RC_01_17_23_16_22", undefined);
  });

  after(async () => {
    if (switchboard) {
      switchboard.stop();
    }
  });

  it("Create and read buffer account", async () => {
    const queue = await switchboard.queue.loadData();
    if (!queue.enableBufferRelayers) {
      throw new Error(`Queue has buffer relayers disabled!`);
    }

    const url = "https://jsonplaceholder.typicode.com/todos/1";
    const expectedResult = Buffer.from(await (await fetch(url)).text());

    const [bufferAccount] = await switchboard.queue.createBufferRelayer({
      name: "My Buffer",
      minUpdateDelaySeconds: 30,
      enable: true,
      queueAuthorityPubkey: switchboard.program.walletPubkey,
      job: {
        name: "Buffer Job",
        data: Buffer.from(
          OracleJob.encodeDelimited(
            OracleJob.create({
              tasks: [
                OracleJob.Task.create({
                  httpTask: OracleJob.HttpTask.create({
                    url,
                  }),
                }),
              ],
            })
          ).finish()
        ),
      },
    });

    console.log(`BufferRelayer ${bufferAccount.publicKey}`);

    const [payerTokenWallet] =
      await switchboard.program.mint.getOrCreateWrappedUser(
        provider.publicKey,
        { fundUpTo: 0.01 }
      );

    const [buffer, openRoundSignature] =
      await bufferAccount.openRoundAndAwaitResult(
        {
          tokenWallet: payerTokenWallet,
        },
        30_000
      );

    console.log(
      `Current Buffer Result: [${new Uint8Array(buffer.result).toString()}]`
    );

    const signature = await bufferParserProgram.methods
      .readResult({ expectedResult: expectedResult })
      .accounts({ buffer: bufferAccount.publicKey })
      .rpc()
      .catch((error) => {
        console.error(error);
        throw error;
      });

    await sleep(2000);

    const logs = await provider.connection.getParsedTransaction(
      signature,
      "confirmed"
    );

    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
  });
});
