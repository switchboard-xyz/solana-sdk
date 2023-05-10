import { QueueAccount } from "@switchboard-xyz/solana.js";
import { OracleJob } from "@switchboard-xyz/common";

const queueAccount = new QueueAccount(program, queuePubkey);

const [aggregatorAccount, aggregatorInitSignatures] =
  await queueAccount.createFeed({
    batchSize: 1,
    minRequiredOracleResults: 1,
    minRequiredJobResults: 1,
    minUpdateDelaySeconds: 60,
    fundAmount: 2.5, // deposit 2.5 wSOL into the leaseAccount escrow
    jobs: [
      { pubkey: jobAccount.publicKey },
      {
        weight: 2,
        data: OracleJob.encodeDelimited(
          OracleJob.fromObject({
            tasks: [
              {
                valueTask: {
                  value: 1,
                },
              },
            ],
          })
        ).finish(),
      },
    ],
  });
const aggregator = await aggregatorAccount.loadData();
