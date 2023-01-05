import { AnchorProvider } from "@coral-xyz/anchor";
import { Cluster, clusterApiUrl, Keypair } from "@solana/web3.js";
import {
  ISwitchboardNetwork,
  SwitchboardNetwork,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import os from "os";
import path from "path";

export const DEFAULT_KEYPAIR_PATH = path.join(
  os.homedir(),
  ".config/solana/id.json"
);

export function getCluster(
  rpcEndpoint: string
): Cluster | "localnet" | undefined {
  switch (rpcEndpoint) {
    case "http://localhost:8899":
      return "localnet";
    case clusterApiUrl("devnet"):
      return "devnet";
    case clusterApiUrl("mainnet-beta"):
      return "mainnet-beta";
    default:
      return undefined;
  }
}

export class Switchboard extends SwitchboardNetwork {
  private static _instances: Map<string, Promise<Switchboard>> = new Map();

  private constructor(network: SwitchboardNetwork, readonly name: string) {
    super(network);
  }

  public static load(
    provider: AnchorProvider,
    name = "default"
  ): Promise<Switchboard> {
    if (!this._instances.has(name)) {
      this._instances.set(
        name,
        new Promise(async (resolve, reject) => {
          try {
            const program = await SwitchboardProgram.fromProvider(provider);
            const switchboardNetwork = SwitchboardNetwork.find(program, name);
            const switchboard = new Switchboard(switchboardNetwork, name);
            resolve(switchboard);
          } catch (error) {
            reject(error);
          }
        })
      );
    }

    return this._instances.get(name)!;
  }
}
