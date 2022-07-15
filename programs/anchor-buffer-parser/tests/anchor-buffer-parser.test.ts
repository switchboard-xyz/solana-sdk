import * as anchor from "@project-serum/anchor";
import {
  promiseWithTimeout,
  SwitchboardTestContext,
} from "@switchboard-xyz/sbv2-utils";
import {
  AnchorWallet,
  BufferRelayerAccount,
  JobAccount,
  OracleJob,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2";
import fetch from "node-fetch";
import {
  AnchorBufferParser,
  IDL,
} from "../../../target/types/anchor_buffer_parser";
import { PROGRAM_ID } from "../client/programId";

const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

// Anchor.toml will copy this to localnet when we start our tests

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
  let localnet = false;

  before(async () => {
    // First, attempt to load the switchboard devnet PID
    try {
      switchboard = await SwitchboardTestContext.loadDevnetQueue(
        provider,
        "9e8rQPoyVZeGA1mD2BBVqDthbFwircnfLTB5JE6yUFQR"
      );
      console.log("devnet detected");
      return;
    } catch (error: any) {
      console.log(`Error: SBV2 Devnet - ${error.message}`);
    }
    // If fails, fallback to looking for a local env file
    try {
      switchboard = await SwitchboardTestContext.loadFromEnv(provider);
      localnet = true;
      console.log("localnet detected");
      return;
    } catch (error: any) {
      console.log(`Error: SBV2 Localnet - ${error.message}`);
    }
    // If fails, throw error
    throw new Error(
      `Failed to load the SwitchboardTestContext from devnet or from a switchboard.env file`
    );
  });

  it("Create and read buffer account", async () => {
    const queue = await switchboard.queue.loadData();
    if (!queue.enableBufferRelayers) {
      throw new Error(`Queue has buffer relayers disabled!`);
    }

    const url = "https://jsonplaceholder.typicode.com/todos/1";
    const expectedResult = Buffer.from(await (await fetch(url)).text());

    const jobData = Buffer.from(
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
    );
    const jobKeypair = anchor.web3.Keypair.generate();
    const jobAccount = await JobAccount.create(switchboard.program, {
      data: jobData,
      keypair: jobKeypair,
      authority: payer.publicKey,
    });

    const bufferAccount = await BufferRelayerAccount.create(
      switchboard.program,
      {
        name: Buffer.from("My Buffer").slice(0, 32),
        minUpdateDelaySeconds: 30,
        queueAccount: switchboard.queue,
        authority: payer.publicKey,
        jobAccount,
      }
    );

    console.log(`BufferRelayer ${bufferAccount.publicKey}`);

    const permissionAccount = await PermissionAccount.create(
      switchboard.program,
      {
        granter: switchboard.queue.publicKey,
        grantee: bufferAccount.publicKey,
        authority: queue.authority,
      }
    );

    // call openRound
    bufferAccount
      .openRound()
      .then((sig) => console.log(`OpenRound Txn: ${sig}`));

    const buf = await awaitCallback(bufferAccount, 30_000);

    console.log(`Current Buffer Result: [${new Uint8Array(buf).toString()}]`);

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

async function awaitCallback(
  bufferAccount: BufferRelayerAccount,
  timeoutInterval: number,
  errorMsg = "Timed out waiting for Buffer Relayer open round."
) {
  const acctCoder = new anchor.BorshAccountsCoder(bufferAccount.program.idl);
  let ws: number | undefined = undefined;
  const result: Buffer = await promiseWithTimeout(
    timeoutInterval,
    new Promise(
      (resolve: (result: Buffer) => void, reject: (reason: string) => void) => {
        ws = bufferAccount.program.provider.connection.onAccountChange(
          bufferAccount.publicKey,
          async (
            accountInfo: anchor.web3.AccountInfo<Buffer>,
            context: anchor.web3.Context
          ) => {
            const buf = acctCoder.decode(
              "BufferRelayerAccountData",
              accountInfo.data
            );
            const bufResult = buf.result as Buffer;
            if (bufResult.byteLength > 0) {
              resolve(bufResult);
            }
          }
        );
      }
    ).finally(async () => {
      if (ws) {
        await bufferAccount.program.provider.connection.removeAccountChangeListener(
          ws
        );
      }
      ws = undefined;
    }),
    new Error(errorMsg)
  ).finally(async () => {
    if (ws) {
      await bufferAccount.program.provider.connection.removeAccountChangeListener(
        ws
      );
    }
    ws = undefined;
  });

  return result;
}
