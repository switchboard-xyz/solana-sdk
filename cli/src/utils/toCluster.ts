import { Cluster } from "@solana/web3.js";

export const toCluster = (cluster: string): Cluster => {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta": {
      return cluster;
    }
  }

  throw new Error(`Invalid cluster provided ${cluster}`);
};
