[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/javascript/feed-walkthrough/src)

The `feed-walkthrough/src` folder contains code for creating and managing data feeds, simulating Oracle jobs, and working with Solana keypairs and account strings in the `sbv2-solana` project.

`devnet.ts` demonstrates how to create a new data feed on the devnet permissionless queue. The script loads the existing devnet queue and crank, creates a new data feed, and calls open round on the feed. For example:

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

`oracle-job.json` is a JSON object that represents a configuration for an Oracle job. It can be used to store and manage task-related data, such as task values, priorities, or other task-specific attributes.

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

`private-queue.ts` shows how to create a private Switchboard oracle queue and fulfill an open round request. The script sets up a private network, creates a data feed, starts an oracle, and calls open round on the feed.

`simulate.ts` is responsible for simulating the execution of an Oracle job. It tests and validates the Oracle job's behavior before deploying it to the Solana network. The script imports the `OracleJobJson` object and calls the `simulateOracleJobs` function to perform the simulation.

```javascript
const response = await simulateOracleJobs(OracleJobJson, "devnet");
```

`utils.ts` is a utility module that provides helper functions for handling Solana keypairs and account strings. The `toAccountString` function formats a string with a label and publicKey, while the `getKeypair` function loads a keypair from a file and returns a `Keypair` object.

```javascript
const accountString = toAccountString("Account 1", somePublicKey);
const walletKeypair = getKeypair("path/to/keypair.json");
```

These files and functions can be used throughout the `sbv2-solana` project to create and manage data feeds, simulate Oracle jobs, and work with Solana accounts and keypairs.
