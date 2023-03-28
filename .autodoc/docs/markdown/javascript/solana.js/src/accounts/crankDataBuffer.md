[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/blob/master/javascript/solana.js/src/accounts/crankDataBuffer.ts)

The `CrankDataBuffer` class in this code is responsible for managing a priority queue of aggregator accounts and their next available update times. The class is part of the `sbv2-solana` project and interacts with the Solana blockchain using the `@solana/web3.js` and `@coral-xyz/anchor` libraries.

The `CrankDataBuffer` class extends the `Account` class and holds an array of `types.CrankRow` objects. Each `CrankRow` object contains an aggregator account's public key and its next available update time. The class provides methods to interact with the priority queue, such as loading data from the blockchain, decoding the data, and sorting the queue.

The `onChange` method allows users to subscribe to changes in the crank's buffer on the blockchain. It takes a callback function as an argument, which is invoked whenever the buffer changes. The method also accepts an optional `commitment` parameter to specify the desired transaction finality.

The `loadData` method retrieves and decodes the `types.CrankAccountData` stored in the account. It returns an array of `types.CrankRow` objects representing the priority queue.

The `decode` method is a static method that takes an `AccountInfo<Buffer>` object and returns an array of `types.CrankRow` objects. It processes the buffer data and extracts the public keys and next available update times for each aggregator account.

The `getAccountSize` and `default` static methods are utility functions that help with buffer size calculations and creating default buffer data, respectively.

The `sort` method is a static method that takes an array of `types.CrankRow` objects and returns a sorted array based on the next available update times.

The `fromCrank` static method takes a `SwitchboardProgram` object and a `types.CrankAccountData` object, and returns a `CrankDataBuffer` object associated with the given crank account data.

The `pqPop` function is a utility function used internally by the `sort` method to sort the priority queue. It takes an array of `types.CrankRow` objects and returns the next item in the sorted order.
## Questions: 
 1. **Question:** What is the purpose of the `CrankDataBuffer` class and how does it relate to the `types.CrankRow` type?
   **Answer:** The `CrankDataBuffer` class represents an account holding a priority queue of aggregators and their next available update time. It is used to store, retrieve, and manipulate an array of `types.CrankRow` objects, which contain the public key of an aggregator and its next available update time.

2. **Question:** How does the `onChange` method work and when should it be used?
   **Answer:** The `onChange` method is used to invoke a callback each time a crank's buffer has changed on-chain. It takes a callback function as an argument, which is called when the crank's buffer changes, and an optional commitment level for transaction finality. This method is useful for monitoring changes to the crank's buffer in real-time.

3. **Question:** What is the purpose of the `pqPop` function and how does it relate to the `CrankDataBuffer` class?
   **Answer:** The `pqPop` function is a utility function used to remove and return the highest priority item (with the lowest nextTimestamp) from an array of `types.CrankRow` objects. It is used internally by the `CrankDataBuffer` class in the `sort` method to sort the crank rows based on their priority.