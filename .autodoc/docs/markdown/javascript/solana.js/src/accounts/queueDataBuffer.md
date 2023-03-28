[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/blob/master/javascript/solana.js/src/accounts/queueDataBuffer.ts)

The `QueueDataBuffer` class in this code is responsible for managing an account that holds a list of oracles actively heartbeating on the queue. The class extends the `Account` class and is parameterized by an array of `PublicKey` objects, representing the oracles.

The class provides several methods for working with the queue data buffer:

- `getAccountSize(size: number)`: Returns the account size based on the number of oracles.
- `default(size = 100)`: Returns a default buffer with the specified size.
- `createMock(...)`: Creates a mock account info for a given VRF (Verifiable Random Function) configuration, useful for testing purposes.
- `onChange(...)`: Registers a callback function to be invoked each time the oracle queue buffer changes on-chain.
- `loadData()`: Retrieves and decodes the data stored in the account.
- `decode(...)`: Decodes the buffer account info into an array of `PublicKey` objects.
- `fromQueue(...)`: Returns a queue data buffer from a given oracle queue account data.

For example, to create a mock account info with a custom size and list of oracles, you can use the `createMock` method:

```javascript
const programId = new PublicKey('...');
const data = { size: 50, oracles: [new PublicKey('...'), new PublicKey('...')] };
const mockAccountInfo = QueueDataBuffer.createMock(programId, data);
```

To watch for changes in the queue data buffer and invoke a callback function when the buffer changes, you can use the `onChange` method:

```javascript
const callback = (updatedOracles: Array<PublicKey>) => {
  console.log('Queue data buffer changed:', updatedOracles);
};
const commitment = 'confirmed';
const subscriptionId = queueDataBuffer.onChange(callback, commitment);
```

These functionalities allow the `sbv2-solana` project to manage and monitor the list of oracles participating in the network, ensuring that the data is up-to-date and accurate.
## Questions: 
 1. **Question**: What is the purpose of the `QueueDataBuffer` class and how does it relate to the oracles in the project?
   **Answer**: The `QueueDataBuffer` class represents an account holding a list of oracles that are actively heartbeating on the queue. It provides methods to create, load, and decode the data related to the oracles, as well as to watch for changes in the oracle queue buffer.

2. **Question**: How does the `onChange` method work and when should it be used?
   **Answer**: The `onChange` method is used to invoke a callback each time a QueueAccount's oracle queue buffer has changed on-chain. It takes a callback function and an optional commitment parameter (defaulting to 'confirmed'). This method is useful when you want to monitor changes in the oracle queue buffer and react to them in real-time.

3. **Question**: What is the purpose of the `createMock` method and in what scenarios would it be useful?
   **Answer**: The `createMock` method is used to create a mock account info for a given VRF (Verifiable Random Function) configuration. It is useful for test integrations, allowing developers to create test instances of the `QueueDataBuffer` without interacting with the actual blockchain.