[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/blob/master/javascript/solana.js/src/json/oracle.ts)

The `OracleJson` class in this code is responsible for handling the creation and management of oracle objects within the `sbv2-solana` project. An oracle is a data provider that supplies external information to the blockchain, such as price feeds or other real-world data. The class implements the `CreateQueueOracleParams` interface, which defines the required parameters for creating a new oracle.

The class has properties for the oracle's name, metadata, stake amount, enable status, authority keypair, and staking wallet keypair. The constructor takes an object with these properties and initializes the class instance using utility functions like `parseString`, `parseNumber`, and `parseBoolean` to ensure the correct data types are used.

The `loadKeypair` function is used to load keypairs for the authority and staking wallet from file paths provided in the input object. If no file path is provided for the staking wallet, a new keypair is generated using `Keypair.generate()`.

The `OracleJson` class also provides a static method `loadMultiple` that takes an object containing an array of oracle objects and returns an array of `OracleJson` instances. This method is useful for loading multiple oracles at once from a configuration file or other data source.

Finally, the `toJSON` method returns a JSON representation of the oracle object, including the keypairs converted to strings using the `keypairToString` utility function. This method can be used to serialize the oracle object for storage or transmission.

Example usage of the `OracleJson` class might include creating a new oracle object, loading multiple oracles from a configuration file, and serializing an oracle object to JSON for storage or transmission:

```javascript
const oracleData = {
  name: 'Example Oracle',
  metadata: 'https://example.com/metadata',
  stakeAmount: 100,
  enable: true,
  authority: 'path/to/authority/keypair.json',
  stakingWalletKeypair: 'path/to/staking/keypair.json',
};

const oracle = new OracleJson(oracleData);
const oracleJsonArray = OracleJson.loadMultiple({ oracles: [oracleData] });
const serializedOracle = oracle.toJSON();
```
## Questions: 
 1. **What is the purpose of the `OracleJson` class and how does it relate to the `CreateQueueOracleParams` interface?**

   The `OracleJson` class is used to represent and manipulate oracle data in JSON format. It implements the `CreateQueueOracleParams` interface, which means it must have the properties and methods defined in that interface.

2. **How does the `loadMultiple` static method work and when should it be used?**

   The `loadMultiple` static method takes an object as input and returns an array of `OracleJson` instances. It is used to create multiple `OracleJson` instances from an object containing an array of oracle data.

3. **What is the purpose of the `toJSON` method in the `OracleJson` class?**

   The `toJSON` method is used to convert an `OracleJson` instance back into a plain JavaScript object with the same properties. This is useful for serialization purposes, such as when sending the data over a network or saving it to a file.