import * as anchor from "@project-serum/anchor";
import { OracleJob, sleep } from "@switchboard-xyz/common";
import {
  AnchorWallet,
  SwitchboardTestContext,
} from "@switchboard-xyz/solana.js";
import fetch from "node-fetch";
import { PROGRAM_ID } from "../client/programId";
import { AnchorBufferParser, IDL } from "../target/types/anchor_buffer_parser";

describe("anchor-buffer-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // const bufferParserProgram = anchor.workspace
  //   .AnchorBufferParser as Program<AnchorBufferParser>;

  const bufferParserProgram = new anchor.Program(
    IDL,
    PROGRAM_ID,
    provider,
    new anchor.BorshCoder(IDL)
  ) as anchor.Program<AnchorBufferParser>;

  const payer = (provider.wallet as AnchorWallet).payer;

  let switchboard: SwitchboardTestContext;

  before(async () => {
    // Attempt to load the env from a local file
    try {
      switchboard = await SwitchboardTestContext.loadFromEnv(provider);
      console.log("local env file detected");
      return;
    } catch (error: any) {
      console.log(`Error: SBV2 Localnet - ${error.message}`);
      console.error(error);
    }
    // If fails, throw error
    throw new Error(
      `Failed to load the SwitchboardTestContext from a switchboard.env file`
    );
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

    const [buffer, openRoundSignature] =
      await bufferAccount.openRoundAndAwaitResult(
        {
          tokenWallet: switchboard.payerTokenWallet,
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
