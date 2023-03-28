[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/javascript)

The `.autodoc/docs/json/javascript` folder contains essential code for the `sbv2-solana` project, focusing on creating and managing data feeds, simulating Oracle jobs, and working with Solana keypairs and account strings.

In `feed-walkthrough/devnet.ts`, a new data feed is created on the devnet permissionless queue. The script loads the existing devnet queue and crank, creates a new data feed, and calls open round on the feed. This can be used to create a new data feed with specific configurations, such as name, batchSize, minRequiredOracleResults, and more.

```javascript
const [aggregatorAccount] = await queueAccount.createFeed({
  name: "SOL_USD",
  batchSize: 1,
  minRequiredOracleResults: 1,
  minRequiredJobResults: 1,
  minUpdateDelaySeconds: 10,
  fundAmount: 0.1,
  enable: false,
  crankPubkey: crankAccount.publicKey,
  jobs: [
    {
      weight: 2,
      data: OracleJob.encodeDelimited(
        OracleJob.fromObject(OracleJobJson)
      ).finish(),
    },
  ],
});
```

`feed-walkthrough/oracle-job.json` represents a configuration for an Oracle job, storing and managing task-related data, such as task values, priorities, or other task-specific attributes.

```javascript
const taskData = {
  "tasks": [
    {
      "valueTask": {
        "value": 10
      }
    }
  ]
};
```

`feed-walkthrough/private-queue.ts` demonstrates how to create a private Switchboard oracle queue and fulfill an open round request. This can be used to set up a private network, create a data feed, start an oracle, and call open round on the feed.

`feed-walkthrough/simulate.ts` is responsible for simulating the execution of an Oracle job, testing and validating the Oracle job's behavior before deploying it to the Solana network. This can be used to ensure the Oracle job behaves as expected.

```javascript
const response = await simulateOracleJobs(OracleJobJson, "devnet");
```

`feed-walkthrough/utils.ts` provides helper functions for handling Solana keypairs and account strings. The `toAccountString` function formats a string with a label and publicKey, while the `getKeypair` function loads a keypair from a file and returns a `Keypair` object.

```javascript
const accountString = toAccountString("Account 1", somePublicKey);
const walletKeypair = getKeypair("path/to/keypair.json");
```

These files and functions can be used throughout the project to create and manage data feeds, simulate Oracle jobs, and work with Solana accounts and keypairs. For example, developers can create new data feeds with specific configurations, simulate Oracle jobs to ensure they behave as expected, and use utility functions to handle Solana keypairs and account strings.
