import * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import type Big from "big.js";

export const getFeedsLatestValue = async (
  program: anchor.Program,
  mainnet: Connection,
  ...pubkeys: string[]
): Promise<Big[]> => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const coder = new anchor.BorshAccountsCoder(program.idl);
  const accounts = await anchor.utils.rpc.getMultipleAccounts(
    connection,
    pubkeys.map((pubkey) => new PublicKey(pubkey))
  );
  const parsedAccounts: { publicKey: PublicKey; data: any }[] = [];
  for (const account of accounts) {
    try {
      const data = coder.decode("AggregatorAccountData", account.account.data);
      parsedAccounts.push({
        publicKey: account.publicKey,
        data,
      });
    } catch {
      throw new Error(
        `not a valid switchboard v2 aggregator acccount ${account.publicKey}`
      );
    }
  }

  return Promise.all(
    parsedAccounts.map(async (feed) => {
      // const lastUpdated = new anchor.BN(
      //   feed.data.latestConfirmedRound.roundOpenTimestamp
      // ).toNumber();
      // const ts = Date.now() / 1000;
      // const elapsed = ts - lastUpdated;
      // if (elapsed > 300) {
      //   throw new Error(
      //     `aggregator price stale for ${elapsed.toString()}sec ${
      //       feed.publicKey
      //     }`
      //   );
      // }

      const aggregator = new AggregatorAccount({
        program,
        publicKey: feed.publicKey,
      });

      return aggregator.getLatestValue(feed.data);
    })
  );
};
