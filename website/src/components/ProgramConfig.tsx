import { CircularProgress, Typography } from "@mui/material";
import * as anchor from "@project-serum/anchor";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  CrankAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2";
import React, { useEffect, useState } from "react";

const DEFAULT_KEYPAIR = Keypair.fromSeed(new Uint8Array(32).fill(1));
const DEFAULT_PUBKEY = new PublicKey("11111111111111111111111111111111");

const MAINNET_PID = new PublicKey(
  "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f"
);
const MAINNET_PERMISSIONLESS_QUEUE = new PublicKey(
  "5JYwqvKkqp35w8Nq3ba4z1WYUeJQ1rB36V8XvaGp6zn1"
);
const MAINNET_PERMISSIONLESS_CRANK = new PublicKey(
  "BKtF8yyQsj3Ft6jb2nkfpEKzARZVdGgdEPs6mFmZNmbA"
);
const MAINNET_PERMISSIONED_QUEUE = new PublicKey(
  "3HBb2DQqDfuMdzWxNk1Eo9RTMkFYmuEAd32RiLKn9pAn"
);
const MAINNET_PERMISSIONED_CRANK = new PublicKey(
  "GdNVLWzcE6h9SPuSbmu69YzxAj8enim9t6mjzuqTXgLd"
);

const DEVNET_PID = new PublicKey(
  "2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG"
);
const DEVNET_PERMISSIONLESS_QUEUE = new PublicKey(
  "F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy"
);
const DEVNET_PERMISSIONLESS_CRANK = new PublicKey(
  "GN9jjCy2THzZxhYqZETmPM3my8vg4R5JyNkgULddUMa5"
);
const DEVNET_PERMISSIONED_QUEUE = new PublicKey(
  "GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U"
);
const DEVNET_PERMISSIONED_CRANK = new PublicKey(
  "GdNVLWzcE6h9SPuSbmu69YzxAj8enim9t6mjzuqTXgLd"
);

interface QueueData {
  queueKey: PublicKey;
  crankKey: PublicKey;
  queueData: any;
  crankData: any;
}

interface SwitchboardData {
  pid: PublicKey;
  permissionQueue: QueueData;
  permissionlessQueue: QueueData;
}

interface AnchorData {
  mainnet: SwitchboardData;
  devnet?: SwitchboardData;
}

async function getAnchorData(): Promise<AnchorData> {
  // mainnet program
  const provider = new anchor.AnchorProvider(
    new Connection(clusterApiUrl("mainnet-beta")),
    new anchor.Wallet(DEFAULT_KEYPAIR),
    {}
  );
  const anchorIdl = await anchor.Program.fetchIdl(MAINNET_PID, provider);
  console.log(anchorIdl);
  if (!anchorIdl) throw new Error(`failed to read idl for ${MAINNET_PID}`);
  const mainnetProgram = new anchor.Program(anchorIdl, MAINNET_PID, provider);

  const permissionedQueue = new OracleQueueAccount({
    program: mainnetProgram,
    publicKey: MAINNET_PERMISSIONED_QUEUE,
  });
  const permissionedCrank = new CrankAccount({
    program: mainnetProgram,
    publicKey: MAINNET_PERMISSIONED_CRANK,
  });

  const permissionlessQueue = new OracleQueueAccount({
    program: mainnetProgram,
    publicKey: MAINNET_PERMISSIONLESS_QUEUE,
  });
  const permissionlessCrank = new CrankAccount({
    program: mainnetProgram,
    publicKey: MAINNET_PERMISSIONLESS_CRANK,
  });

  // get mainnet data
  const mainnet = {
    pid: MAINNET_PID,
    permissionQueue: {
      queueKey: MAINNET_PERMISSIONED_QUEUE,
      crankKey: MAINNET_PERMISSIONED_CRANK,
      queueData: await permissionedQueue.loadData(),
      crankData: await permissionedCrank.loadData(),
    },
    permissionlessQueue: {
      queueKey: MAINNET_PERMISSIONLESS_QUEUE,
      crankKey: MAINNET_PERMISSIONLESS_CRANK,
      queueData: await permissionlessQueue.loadData(),
      crankData: await permissionlessCrank.loadData(),
    },
  };

  // const devnetProgram = new anchor.Program(
  //   anchorIdl,
  //   MAINNET_PID,
  //   new anchor.AnchorProvider(
  //     new Connection(clusterApiUrl("devnet")),
  //     new anchor.Wallet(DEFAULT_KEYPAIR),
  //     {}
  //   )
  // );

  // const devnetPermissionedQueue = new OracleQueueAccount({
  //   program: devnetProgram,
  //   publicKey: DEVNET_PERMISSIONED_QUEUE,
  // });
  // const devnetPermissionedCrank = new CrankAccount({
  //   program: devnetProgram,
  //   publicKey: DEVNET_PERMISSIONED_CRANK,
  // });

  // const devnetPermissionlessQueue = new OracleQueueAccount({
  //   program: devnetProgram,
  //   publicKey: DEVNET_PERMISSIONLESS_QUEUE,
  // });
  // const devnetPermissionlessCrank = new CrankAccount({
  //   program: devnetProgram,
  //   publicKey: DEVNET_PERMISSIONLESS_CRANK,
  // });

  // // get mainnet data
  // const devnet = {
  //   pid: DEVNET_PID,
  //   permissionQueue: {
  //     queueKey: DEVNET_PERMISSIONED_QUEUE,
  //     crankKey: DEVNET_PERMISSIONED_CRANK,
  //     queueData: await permissionedQueue.loadData(),
  //     crankData: await permissionedCrank.loadData(),
  //   },
  //   permissionlessQueue: {
  //     queueKey: DEVNET_PERMISSIONLESS_QUEUE,
  //     crankKey: DEVNET_PERMISSIONLESS_CRANK,
  //     queueData: await permissionlessQueue.loadData(),
  //     crankData: await permissionlessCrank.loadData(),
  //   },
  // };

  return {
    mainnet,
  };
}

interface ProgramConfigProps {
  cluster?: "mainnet-beta" | "devnet";
}

const LABELS = [""];

const ProgramConfig = (props: ProgramConfigProps) => {
  const [anchorData, setAnchorData] = useState<AnchorData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnchorData().then((anchorData) => {
      setAnchorData(anchorData);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Typography variant="h5">TEST</Typography>
      {loading === true ? (
        <CircularProgress />
      ) : (
        <Typography>
          {JSON.stringify(anchorData.mainnet, undefined, 2)}
        </Typography>
      )}
    </>
  );
};

export default ProgramConfig;
