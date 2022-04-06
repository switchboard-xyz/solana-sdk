/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonRpcProvider } from "@ethersproject/providers";
import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import JSBI from "jsbi";
import {
  ChainId,
  Fetcher,
  Route,
  Token,
  TokenAmount,
  Trade,
} from "../../submodules/defikingdoms-sdk/dist";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class UnexpectedDefiKingdomsError extends SwitchboardTaskError {
  constructor() {
    super("UnexpectedDefiKingdomsError", "DefiKingdoms");
  }
}

export class DefiKingdomsTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    iTask: OracleJob.IDefiKingdomsTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const task = OracleJob.DefiKingdomsTask.create(iTask);

    const provider = new JsonRpcProvider(task.provider, {
      chainId: ChainId.HARMONY_MAINNET,
      name: "",
    });

    const inToken = new Token(
      ChainId.HARMONY_MAINNET,
      task.inToken?.address,
      task.inToken?.decimals,
      "",
      ""
    );
    const outToken = new Token(
      ChainId.HARMONY_MAINNET,
      task.outToken?.address,
      task.outToken?.decimals,
      "",
      ""
    );

    // const pAddr = Pair.getAddress(inToken, outToken);
    // console.log(pAddr, "0xA1221A5BBEa699f507CC00bDedeA05b5d2e32Eba");
    const pair = [await Fetcher.fetchPairData(inToken, outToken, provider)];
    const route = new Route(pair, inToken, outToken);
    const trade = Trade.exactIn(
      route,
      new TokenAmount(
        inToken,
        String(
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inToken.decimals))
        )
      )
    );

    return new Big(trade.outputAmount.toFixed());
  }
}
