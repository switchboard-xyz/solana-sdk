import { clusterApiUrl } from "@solana/web3.js";
import { toCluster } from "./utils";

export type ConfigParameter = "devnet-rpc" | "mainnet-rpc";
//   | "default-keypair"
//   | "default-payer"
//   | "devnet-keypair"
//   | "mainnet-keypair"
//   | "devnet-payer"
//   | "mainnet-payer";

/** Configuration parameters for a Solana cluster */
export interface ClusterConfig {
  /** URL of your custom devnet rpc pool */
  rpcUrl: string;
  //   /** default keypair to pay for all transactions. authority keypair used as fallback */
  //   defaultPayer?: string;
  //   /** default keypair to act as authority on new accounts */
  //   defaultKeypair?: string;
}

/**
 * Configuration parameters that apply to the CLI's runtime
 */
export interface CliConfig {
  // dataDir?: string; // TO DO: Allow custom directory
  /** default keypair to pay for all transactions. authority keypair used as fallback */
  //   defaultPayer?: string;
  /** default keypair for all transactions, if cluster specific settings not specified */
  //   defaultKeypair?: string;
  /** devnet specific parameters */
  devnet: ClusterConfig;
  /** mainnet-beta specific parameters */
  mainnet: ClusterConfig;
}

export const DEFAULT_CONFIG: CliConfig = {
  devnet: {
    rpcUrl: clusterApiUrl(toCluster("devnet")),
  },
  mainnet: {
    rpcUrl: clusterApiUrl(toCluster("mainnet-beta")),
  },
};
