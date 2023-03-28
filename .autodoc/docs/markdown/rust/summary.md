[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/rust)

The `switchboard-v2` folder contains the core components of the sbv2-solana project, designed to manage and interact with various data feeds, oracles, and aggregators on the Solana blockchain. The code defines data structures, methods, and instructions for handling different aspects of the project, such as managing aggregator accounts, oracle queues, VRF accounts, and permission systems.

For example, the `aggregator.rs` file defines the `AggregatorAccountData` struct and associated methods for managing an on-chain aggregator. This struct can be used to create a new aggregator instance, retrieve the latest result, and check various properties like confidence interval, variance, and staleness.

```rust
use switchboard_v2::AggregatorAccountData;
use std::convert::TryInto;

let feed_result = AggregatorAccountData::new(feed_account_info)?.get_result()?;
let decimal: f64 = feed_result.try_into()?;
```

The `buffer_relayer.rs` file defines the `BufferRelayerAccountData` struct, which represents the state of a buffer relayer account responsible for storing on-chain data and managing the update process. The struct provides methods to create a new instance, get the latest result, and check the staleness of the buffer.

```rust
use switchboard_v2::BufferRelayerAccountData;

let buffer_account = BufferRelayerAccountData::new(buffer_account_info)?;
```

The `crank.rs` file defines the `CrankAccountData` struct, which is used to store information about a crank and its associated aggregator accounts. Cranks are mechanisms that allow for efficient processing of data updates from multiple aggregators.

The `decimal.rs` file defines the `SwitchboardDecimal` struct, which represents a decimal number with a mantissa and a scale. This struct is used to handle decimal numbers in the project and provides methods for creating instances and converting between different numeric types.

```rust
let swb_decimal = SwitchboardDecimal::from_f64(1234.5678);
let dec: Decimal = swb_decimal.try_into().unwrap();
assert_eq!(dec.mantissa(), 12345678);
assert_eq!(dec.scale(), 4);
```

The `error.rs` file defines a custom error type called `SwitchboardError` to handle various error scenarios within the project, providing clear and concise error messages for developers.

The `vrf.rs` file defines the `VrfAccountData` struct, which represents a VRF account on the Solana blockchain. This account is used to manage the VRF process, including requesting randomness, setting callbacks, and closing the account.

```ignore
let vrf_request_randomness = VrfRequestRandomness {
    authority: authority_account_info,
    vrf: vrf_account_info,
    // other required account infos...
};
vrf_request_randomness.invoke(program_account_info, state_bump, permission_bump)?;
```

These components work together to provide a comprehensive solution for managing data feeds, oracles, and aggregators on the Solana blockchain, enabling developers to build powerful and efficient applications that rely on external data sources.
