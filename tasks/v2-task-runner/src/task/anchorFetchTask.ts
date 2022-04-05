/* eslint-disable new-cap */
/* eslint-disable unicorn/no-useless-undefined */
import * as anchor from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import { OracleContext, SwitchboardTask } from "../types";

export class AnchorFetchTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    iTask: OracleJob.IAnchorFetchTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<string> {
    const task = OracleJob.AnchorFetchTask.create(iTask);

    const connection =
      context?.mainnetConnection ??
      new Connection("https://solana-api.projectserum.com");
    const cache = context?.cache ?? undefined;
    const provider = new anchor.Provider(
      connection,
      new anchor.Wallet(Keypair.fromSeed(new Uint8Array(32).fill(1))),
      anchor.Provider.defaultOptions()
    );

    const accountInfo = await connection.getAccountInfo(
      new PublicKey(task.accountAddress)
    );

    const programId = new PublicKey(accountInfo?.owner); // could also use task definition

    if (!cache.hasIdl(programId)) {
      const anchorIdl = await anchor.Program.fetchIdl(programId, provider);
      if (!anchorIdl) {
        throw new Error(`failed to fetch Idl for ${iTask.programId}`);
      }

      cache.setIdl(programId, anchorIdl, 12 * 60 * 60 * 1000);
    }

    const idl = cache.getIdl(programId);
    const clientProgram = new anchor.Program(idl, programId, provider);
    const coder = new anchor.BorshAccountsCoder(clientProgram.idl);

    // find account type by discriminator
    const accountTypeDef = clientProgram.idl.accounts?.find((accountDef) =>
      anchor.BorshAccountsCoder.accountDiscriminator(accountDef.name).equals(
        accountInfo?.data.slice(0, 8)
      )
    );
    if (!accountTypeDef) {
      throw new Error(
        `failed to find account type for anchor account ${task.accountAddress}`
      );
    }

    const account = coder.decode(accountTypeDef.name, accountInfo?.data);

    return JSON.stringify(account);
  }
}
