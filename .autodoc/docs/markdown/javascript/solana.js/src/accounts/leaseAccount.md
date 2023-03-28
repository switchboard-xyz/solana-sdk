[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/blob/master/javascript/solana.js/src/accounts/leaseAccount.ts)

The `LeaseAccount` class in this code represents an account type for an AggregatorAccount's pre-funded escrow, which is used to reward OracleAccounts for responding to open round requests. The class provides methods to create, load, and manage LeaseAccounts, as well as to interact with associated accounts such as QueueAccount, AggregatorAccount, and JobAccount.

The `LeaseAccount` class has several methods for creating and initializing LeaseAccounts, such as `createInstructions`, `create`, and `load`. These methods allow users to create a LeaseAccount with specified parameters, fund it with wrapped tokens, and load an existing LeaseAccount with its current on-chain state.

The `extendInstruction` and `extend` methods allow users to extend a LeaseAccount by funding it with additional tokens. The `withdrawInstruction` and `withdraw` methods enable users to withdraw tokens from a LeaseAccount, either to a specified wallet or by unwrapping the tokens.

The `estimatedLeaseTimeRemaining` method estimates the time remaining on a given lease based on the oracleRequestBatchSize, minUpdateDelaySeconds, queueReward, and leaseBalance.

The `fetchAllAccounts` method fetches all associated accounts for a LeaseAccount, including the QueueAccount, AggregatorAccount, JobAccount, and wallets for job authorities.

Example usage:

```ts
import { LeaseAccount } from '@switchboard-xyz/solana.js';
const [leaseAccount, leaseInitSignature] = await LeaseAccount.create(program, {
  queueAccount,
  aggregatorAccount,
  fundAmount: 1,
  funderAuthority: null,
  funderTokenWallet: null,
  disableWrap: false,
  withdrawAuthority: null,
  jobPubkeys: null,
  jobAuthorities: null,
});
const lease = await leaseAccount.loadData();
```

This code is part of a larger project that interacts with the Switchboard decentralized oracle network on the Solana blockchain.
## Questions: 
 1. **Question:** What is the purpose of the `LeaseAccount` class and its methods?
   **Answer:** The `LeaseAccount` class represents an AggregatorAccount's pre-funded escrow used to reward OracleAccounts for responding to open round requests. It provides methods to create, load, extend, withdraw, and set authority for a LeaseAccount, as well as fetch account information and estimate the time remaining on a lease.

2. **Question:** How does the `createInstructions` method work and what are its parameters?
   **Answer:** The `createInstructions` method creates instructions to initialize a LeaseAccount and optionally funds it with wrapped tokens. It takes a SwitchboardProgram instance, a payer PublicKey, and a set of parameters including aggregatorAccount, queueAccount, jobAuthorities, jobPubkeys, withdrawAuthority, and others. It returns a tuple containing the LeaseAccount and the corresponding TransactionObject.

3. **Question:** How does the `estimatedLeaseTimeRemaining` method work and what does it return?
   **Answer:** The `estimatedLeaseTimeRemaining` method estimates the time remaining on a given lease based on the oracleRequestBatchSize, minUpdateDelaySeconds, queueReward, and leaseBalance. It returns a tuple containing the number of milliseconds left in the lease and the estimated end date.