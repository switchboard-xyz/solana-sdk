---
sidebar_position: 8
slug: /tasks
title: switchboard-tasks
---

# Switchboard Tasks

![Page Last Updated](./task-page-last-updated.svg)

Switchboard oracles read on-chain job accounts to determine how to fetch and respond to update request. An OracleJob is a collection of tasks that are chained together to arrive at a single numerical value.

| Field | Type | Label    | Description                                       |
| ----- | ---- | -------- | ------------------------------------------------- |
| tasks | Task | repeated | The chain of tasks to perform for this OracleJob. |

Switchboard tasks can be divided into the following categories:

- [**Web2 Fetch**](#web2-fetch): Retrieve data from the web
- [**Web3 Fetch**](#web3-fetch): Retrieve on-chain data
- [**Parse**](#parse): Extract a value from a response
- [**Logic**](#logic): Perform some logical operation like if..else clauses
- [**Math**](#math): Perform a mathematical operation like taking the maximum value of a list or raising a value to an exponent.

:::tip

Check out the [**Job Directory**](/feed/directory) for examples!

:::

## 📦Web2 Fetch

### 🛠HttpTask

The adapter will report the text body of a successful HTTP request to the specified url, or return an error if the response status code is greater than or equal to 400. @return string representation of it&#39;s output.

| Field   | Type              | Label    | Description                                                 |
| ------- | ----------------- | -------- | ----------------------------------------------------------- |
| url     | [string](#string) | optional | A string containing the URL to direct this HTTP request to. |
| method  | [Method](#method) | optional | The type of HTTP request to make.                           |
| headers | [Header](#header) | repeated | A list of headers to add to this HttpTask.                  |
| body    | [string](#string) | optional | A stringified body (if any) to add to this HttpTask.        |

#### Header

An object that represents a header to add to an HTTP request.

| Field | Type   | Label    | Description |
| ----- | ------ | -------- | ----------- |
| key   | string | optional |             |
| value | string | optional |             |

#### Method

An enumeration representing the types of HTTP requests available to make.

| Name          | Number | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| METHOD_UNKOWN | 0      | Unset HTTP method will default to METHOD_GET |
| METHOD_GET    | 1      | Perform an HTTP &#39;GET&#39; request.       |
| METHOD_POST   | 2      | Perform an HTTP &#39;POST&#39; request.      |

### 🛠WebsocketTask

Opens and maintains a websocket for light speed data retrieval.

| Field                | Type              | Label    | Description                                                                                                                       |
| -------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| url                  | [string](#string) | optional | The websocket url.                                                                                                                |
| subscription         | [string](#string) | optional | The websocket message to notify of a new subscription.                                                                            |
| max_data_age_seconds | [int32](#int32)   | optional | Minimum amount of time required between when the horses are taking out.                                                           |
| filter               | [string](#string) | optional | Incoming message JSONPath filter. Example: &#34;$[?(@.channel == &#39;ticker&#39; &amp;&amp; @.market == &#39;BTC/USD&#39;)]&#34; |

## 📦Web3 Fetch

### 🛠AnchorFetchTask

Load a parse an Anchor based solana account.

| Field           | Type              | Label    | Description                             |
| --------------- | ----------------- | -------- | --------------------------------------- |
| program_id      | [string](#string) | optional | Owning program of the account to parse. |
| account_address | [string](#string) | optional | The account to parse.                   |

### 🛠OracleTask

Fetch the current price of a Solana oracle protocol.

| Field                            | Type              | Label    | Description                                                                                                                                                                                   |
| -------------------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| switchboard_address              | [string](#string) | optional | Mainnet address of a Switchboard V2 feed. Switchboard is decentralized and allows anyone to build their own feed. A small subset of feeds is available here: https://switchboard.xyz/explorer |
| pyth_address                     | [string](#string) | optional | Mainnet address for a Pyth feed. A full list can be found here: https://pyth.network/price-feeds/                                                                                             |
| chainlink_address                | [string](#string) | optional | Mainnet address for a Chainlink feed. A full list can be found here: https://docs.chain.link/docs/solana/data-feeds-solana                                                                    |
| pyth_allowed_confidence_interval | [double](#double) | optional | Value (as a percentage) that the lower bound confidence interval is of the actual value. Confidence intervals that are larger that this treshold are rejected.                                |

### 🛠SolanaAccountDataFetchTask

Fetch the account data in a stringified buffer format.

| Field  | Type              | Label    | Description                                          |
| ------ | ----------------- | -------- | ---------------------------------------------------- |
| pubkey | [string](#string) | optional | The on-chain account to fetch the account data from. |

### 🛠JupiterSwapTask

Fetch the simulated price for a swap on JupiterSwap.

| Field             | Type              | Label    | Description                   |
| ----------------- | ----------------- | -------- | ----------------------------- |
| in_token_address  | [string](#string) | optional | The input token address.      |
| out_token_address | [string](#string) | optional | The output token address.     |
| base_amount       | [double](#double) | optional | The amount of tokens to swap. |

### 🛠SerumSwapTask

Fetch the latest swap price on Serum&#39;s orderbook

| Field              | Type              | Label    | Description                            |
| ------------------ | ----------------- | -------- | -------------------------------------- |
| serum_pool_address | [string](#string) | optional | The serum pool to fetch swap price for |

### 🛠UniswapExchangeRateTask

Fetch the swap price from UniSwap.

| Field             | Type              | Label    | Description                                     |
| ----------------- | ----------------- | -------- | ----------------------------------------------- |
| in_token_address  | [string](#string) | optional | The input token address.                        |
| out_token_address | [string](#string) | optional | The output token address.                       |
| in_token_amount   | [double](#double) | optional | The amount of tokens to swap.                   |
| slippage          | [double](#double) | optional | The allowable slippage in percent for the swap. |
| provider          | [string](#string) | optional | The RPC provider to use for the swap.           |

### 🛠SushiSwapExchangeRateTask

Fetch the swap price from SushiSwap.

| Field             | Type              | Label    | Description                                     |
| ----------------- | ----------------- | -------- | ----------------------------------------------- |
| in_token_address  | [string](#string) | optional | The input token address.                        |
| out_token_address | [string](#string) | optional | The output token address.                       |
| in_token_amount   | [double](#double) | optional | The amount of tokens to swap.                   |
| slippage          | [double](#double) | optional | The allowable slippage in percent for the swap. |
| provider          | [string](#string) | optional | The RPC provider to use for the swap.           |

### 🛠PancakeswapExchangeRateTask

Fetch the swap price from PancakeSwap.

| Field             | Type              | Label    | Description                                     |
| ----------------- | ----------------- | -------- | ----------------------------------------------- |
| in_token_address  | [string](#string) | optional | The input token address.                        |
| out_token_address | [string](#string) | optional | The output token address.                       |
| in_token_amount   | [double](#double) | optional | The amount of tokens to swap.                   |
| slippage          | [double](#double) | optional | The allowable slippage in percent for the swap. |
| provider          | [string](#string) | optional | The RPC provider to use for the swap.           |

### 🛠DefiKingdomsTask

Fetch the swap price from DefiKingdoms.

| Field     | Type              | Label    | Description                           |
| --------- | ----------------- | -------- | ------------------------------------- |
| provider  | [string](#string) | optional | The RPC provider to use for the swap. |
| in_token  | [Token](#token)   | optional | The input token of the swap.          |
| out_token | [Token](#token)   | optional | The output token of the swap.         |

#### Token

| Field    | Type              | Label    | Description                               |
| -------- | ----------------- | -------- | ----------------------------------------- |
| address  | [string](#string) | optional | The address of the token.                 |
| decimals | [int32](#int32)   | optional | The number of decimal places for a token. |

### 🛠MangoPerpTask

Fetch the current price for a Mango perpetual market

| Field               | Type   | Label    | Description                                                                                                                                                  |
| ------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| perp_market_address | string | optional | Mainnet address for a mango perpetual market. A full list can be found here: https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/ids.json |

### 🛠LendingRateTask

Fetch the lending rates for various Solana protocols

| Field      | Type              | Label    | Description                                                   |
| ---------- | ----------------- | -------- | ------------------------------------------------------------- |
| protocol   | [string](#string) | optional | 01, apricot, francium, jet, larix, mango, port, solend, tulip |
| asset_mint | [string](#string) | optional | A token mint address supported by the chosen protocol         |
| field      | [Field](#field)   | optional |                                                               |

#### Field

| Name               | Number | Description          |
| ------------------ | ------ | -------------------- |
| FIELD_DEPOSIT_RATE | 0      | deposit lending rate |
| FIELD_BORROW_RATE  | 1      | borrow lending rate  |

### 🛠XStepPriceTask

| Field                  | Type                      | Label    | Description                                                            |
| ---------------------- | ------------------------- | -------- | ---------------------------------------------------------------------- |
| step_job               | [MedianTask](#mediantask) | optional | median task containing the job definitions to fetch the STEP/USD price |
| step_aggregator_pubkey | string                    | optional | existing aggregator pubkey for STEP/USD                                |

### 🛠SplTokenParseTask

Fetch the JSON representation of an SPL token mint.

| Field                 | Type              | Label    | Description                                                 |
| --------------------- | ----------------- | -------- | ----------------------------------------------------------- |
| token_account_address | [string](#string) | optional | The publicKey of a token account to fetch the mintInfo for. |
| mint_address          | [string](#string) | optional | The publicKey of the token mint address.                    |

### 🛠SplStakePoolTask

Fetch the JSON representation of an SPL Stake Pool account.

| Field  | Type              | Label    | Description                       |
| ------ | ----------------- | -------- | --------------------------------- |
| pubkey | [string](#string) | optional | The pubkey of the SPL Stake Pool. |

### 🛠LpExchangeRateTask

Fetch the current swap price for a given liquidity pool

| Field                        | Type              | Label    | Description                                                                                                               |
| ---------------------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| in_token_address             | [string](#string) | optional | Used alongside mercurial_pool_address to specify the input token for a swap.                                              |
| out_token_address            | [string](#string) | optional | Used alongside mercurial_pool_address to specify the output token for a swap.                                             |
| mercurial_pool_address       | [string](#string) | optional | Mercurial finance pool address. A full list can be found here: https://github.com/mercurial-finance/stable-swap-n-pool-js |
| saber_pool_address           | [string](#string) | optional | Saber pool address. A full list can be found here: https://github.com/saber-hq/saber-registry-dist                        |
| orca_pool_token_mint_address | [string](#string) | optional | **Deprecated.** Orca pool address.                                                                                        |
| raydium_pool_address         | [string](#string) | optional | The Raydium liquidity pool ammId. A full list can be found here: https://sdk.raydium.io/liquidity/mainnet.json            |
| orca_pool_address            | [string](#string) | optional | Pool address for an Orca LP pool or whirlpool. A full list of Orca LP pools can be found here: https://www.orca.so/pools  |

### 🛠LpTokenPriceTask

Fetch LP token price info from a number of supported exchanges.

| Field                  | Type              | Label    | Description                                                                                                                                                                                                                                  |
| ---------------------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mercurial_pool_address | [string](#string) | optional | Mercurial finance pool address. A full list can be found here: https://github.com/mercurial-finance/stable-swap-n-pool-js                                                                                                                    |
| saber_pool_address     | [string](#string) | optional | Saber pool address. A full list can be found here: https://github.com/saber-hq/saber-registry-dist                                                                                                                                           |
| orca_pool_address      | [string](#string) | optional | Orca pool address. A full list can be found here: https://www.orca.so/pools                                                                                                                                                                  |
| raydium_pool_address   | [string](#string) | optional | The Raydium liquidity pool ammId. A full list can be found here: https://sdk.raydium.io/liquidity/mainnet.json                                                                                                                               |
| price_feed_addresses   | [string](#string) | repeated | A list of Switchboard aggregator accounts used to calculate the fair LP price. This ensures the price is based on the previous round to mitigate flash loan price manipulation.                                                              |
| price_feed_jobs        | [OracleJob](#)    | repeated |                                                                                                                                                                                                                                              |
| use_fair_price         | [bool](#bool)     | optional | If enabled and price_feed_addresses provided, the oracle will calculate the fair LP price based on the liquidity pool reserves. See our blog post for more information: https://switchboardxyz.medium.com/fair-lp-token-oracles-94a457c50239 |

## 📦Parse

### 🛠JsonParseTask

The adapter walks the path specified and returns the value found at that result. If returning
JSON data from the HttpGet or HttpPost adapters, you must use this adapter to parse the
response.

| Field              | Type                                    | Label    | Description                                                                                                                |
| ------------------ | --------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| path               | string                                  | optional | JSONPath formatted path to the element. https://t.ly/uLtw https://www.npmjs.com/package/jsonpath-plus                      |
| aggregation_method | [AggregationMethod](#aggregationmethod) | optional | The technique that will be used to aggregate the results if walking the specified path returns multiple numerical results. |

#### AggregationMethod

The methods of combining a list of numerical results.

| Name   | Number | Description                            |
| ------ | ------ | -------------------------------------- |
| NONE   | 0      |                                        |
| MIN    | 1      | Grab the minimum value of the results. |
| MAX    | 2      | Grab the maximum value of the results. |
| SUM    | 3      | Sum up all of the results.             |
| MEAN   | 4      | Average all of the results.            |
| MEDIAN | 5      | Grab the median of the results.        |

### 🛠RegexExtractTask

Find a pattern within a string of a previous task and extract a group number.

| Field        | Type   | Label    | Description              |
| ------------ | ------ | -------- | ------------------------ |
| pattern      | string | optional | Regex pattern to find.   |
| group_number | int32  | optional | Group number to extract. |

### 🛠BufferLayoutParseTask

Return the deserialized value from a stringified buffer.

| Field  | Type                                | Label    | Description                                    |
| ------ | ----------------------------------- | -------- | ---------------------------------------------- |
| offset | [uint32](#uint32)                   | optional | The buffer offset to start deserializing from. |
| endian | [Endian](#endian)                   | optional | The endianness of the stored value.            |
| type   | [BufferParseType](#bufferparsetype) | optional | The type of value to deserialize.              |

#### BufferParseType

| Name   | Number | Description                         |
| ------ | ------ | ----------------------------------- |
| pubkey | 1      | A public key.                       |
| bool   | 2      | A boolean.                          |
| u8     | 3      | An 8-bit unsigned value.            |
| i8     | 4      | An 8-bit signed value.              |
| u16    | 5      | A 16-bit unsigned value.            |
| i16    | 6      | A 16-bit signed value.              |
| u32    | 7      | A 32-bit unsigned value.            |
| i32    | 8      | A 32-bit signed value.              |
| f32    | 9      | A 32-bit IEEE floating point value. |
| u64    | 10     | A 64-bit unsigned value.            |
| i64    | 11     | A 64-bit signed value.              |
| f64    | 12     | A 64-bit IEEE floating point value. |
| u128   | 13     | A 128-bit unsigned value.           |
| i128   | 14     | A 128-bit signed value.             |

#### Endian

| Name          | Number | Description |
| ------------- | ------ | ----------- |
| LITTLE_ENDIAN | 0      |             |
| BIG_ENDIAN    | 1      |             |

## 📦Logic

### 🛠ConditionalTask

This task will run the `attempt` subtasks in an effort to produce a valid numerical result. If
`attempt` fails to produce an acceptable result, `on_failure` subtasks will be run instead.

| Field      | Type | Label    | Description                                                                                           |
| ---------- | ---- | -------- | ----------------------------------------------------------------------------------------------------- |
| attempt    | Task | repeated | A list of subtasks to process in an attempt to produce a valid numerical result.                      |
| on_failure | Task | repeated | A list of subtasks that will be run if `attempt` subtasks are unable to produce an acceptable result. |

## 📦Utils

### 🛠CacheTask

Execute a job and store the result in a variable to reference later.

| Field       | Type                    | Label    | Description                                                                 |
| ----------- | ----------------------- | -------- | --------------------------------------------------------------------------- |
| cache_items | [CacheItem](#cacheitem) | repeated | A list of cached variables to reference in the job with `${VARIABLE_NAME}`. |

#### CacheItem

| Field         | Type              | Label    | Description                                                                            |
| ------------- | ----------------- | -------- | -------------------------------------------------------------------------------------- |
| variable_name | [string](#string) | optional | The name of the variable to store in cache to reference later with `${VARIABLE_NAME}`. |
| job           | [OracleJob](#)    | optional | The OracleJob to execute to yield the value to store in cache.                         |

### 🛠SysclockOffsetTask

Return the difference between an oracle&#39;s clock and the current timestamp at `SYSVAR_CLOCK_PUBKEY`.

### CronParseTask

Return a timestamp from a crontab instruction.

| Field        | Type                    | Label    | Description                                                      |
| ------------ | ----------------------- | -------- | ---------------------------------------------------------------- |
| cron_pattern | [string](#string)       | optional | The cron pattern to parse                                        |
| clock_offset | [int32](#int32)         | optional | The timestamp offset to calculate the next run                   |
| clock        | [ClockType](#ClockType) | optional | The type of clock to use, oracle or the solana cluster sysclock. |

#### ClockType

The type of clock.

| Name     | Number | Description                    |
| -------- | ------ | ------------------------------ |
| ORACLE   | 0      | The oracles current clock.     |
| SYSCLOCK | 1      | The solana cluster's sysclock. |

### 🛠TpsTask

Fetch the current transactions per second.

## 📦Math

### 🛠TwapTask

Takes a twap over a set period for a certain aggregator.

| Field                      | Type                            | Label    | Description                                                          |
| -------------------------- | ------------------------------- | -------- | -------------------------------------------------------------------- |
| aggregator_pubkey          | [string](#string)               | optional | The target aggregator for the TWAP.                                  |
| period                     | [int32](#int32)                 | optional | Period, in seconds, the twap should account for                      |
| weight_by_propagation_time | [bool](#bool)                   | optional | Weight samples by their propagation time                             |
| min_samples                | [uint32](#uint32)               | optional | Minimum number of samples in the history to calculate a valid result |
| ending_unix_timestamp      | [int32](#int32)                 | optional | Ending unix timestamp to collect values up to                        |
| ending_unix_timestamp_task | [CronParseTask](#CronParseTask) | optional | Execute the task to get the ending unix timestamp                    |

### 🛠MaxTask

Returns the maximum value of all the results returned by the provided subtasks and subjobs.

| Field | Type           | Label    | Description                                                        |
| ----- | -------------- | -------- | ------------------------------------------------------------------ |
| tasks | Task           | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#) | repeated | A list of subjobs to process and produce a list of result values.  |

### 🛠MeanTask

Returns the mean of all the results returned by the provided subtasks and subjobs.

| Field | Type           | Label    | Description                                                        |
| ----- | -------------- | -------- | ------------------------------------------------------------------ |
| tasks | Task           | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#) | repeated | A list of subjobs to process and produce a list of result values.  |

### 🛠MedianTask

Returns the median of all the results returned by the provided subtasks and subjobs. Nested tasks must return a Number.

| Field                   | Type            | Label    | Description                                                        |
| ----------------------- | --------------- | -------- | ------------------------------------------------------------------ |
| tasks                   | Task            | repeated | A list of subtasks to process and produce a list of result values. |
| jobs                    | [OracleJob](#)  | repeated | A list of subjobs to process and produce a list of result values.  |
| min_successful_required | [int32](#int32) | optional |                                                                    |

### 🛠AddTask

This task will add a numerical input by a scalar value or by another
aggregate.

| Field             | Type              | Label    | Description                                                                      |
| ----------------- | ----------------- | -------- | -------------------------------------------------------------------------------- |
| scalar            | [double](#double) | optional | Specifies a scalar to add by.                                                    |
| aggregator_pubkey | [string](#string) | optional | Specifies an aggregator to add by.                                               |
| job               | [OracleJob](#)    | optional | A job whose result is computed before adding our numerical input by that result. |
| big               | [string](#string) | optional | A stringified big.js. `Accepts variable expansion syntax.`                       |

### 🛠SubtractTask

This task will subtract a numerical input by a scalar value or by another
aggregate.

| Field             | Type              | Label    | Description                                                                           |
| ----------------- | ----------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | [double](#double) | optional | Specifies a scalar to subtract by.                                                    |
| aggregator_pubkey | [string](#string) | optional | Specifies an aggregator to subtract by.                                               |
| job               | [OracleJob](#)    | optional | A job whose result is computed before subtracting our numerical input by that result. |
| big               | [string](#string) | optional | A stringified big.js. `Accepts variable expansion syntax.`                            |

### 🛠MultiplyTask

This task will multiply a numerical input by a scalar value or by another aggregator.

| Field             | Type              | Label    | Description                                                                           |
| ----------------- | ----------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | [double](#double) | optional | Specifies a scalar to multiply by.                                                    |
| aggregator_pubkey | [string](#string) | optional | Specifies an aggregator to multiply by.                                               |
| job               | [OracleJob](#)    | optional | A job whose result is computed before multiplying our numerical input by that result. |
| big               | [string](#string) | optional | A stringified big.js. `Accepts variable expansion syntax.`                            |

### 🛠DivideTask

This task will divide a numerical input by a scalar value or by another
aggregate.

| Field             | Type              | Label    | Description                                                                        |
| ----------------- | ----------------- | -------- | ---------------------------------------------------------------------------------- |
| scalar            | [double](#double) | optional | Specifies a basic scalar denominator to divide by.                                 |
| aggregator_pubkey | [string](#string) | optional | Specifies another aggregator resut to divide by.                                   |
| job               | [OracleJob](#)    | optional | A job whose result is computed before dividing our numerical input by that result. |
| big               | [string](#string) | optional | A stringified big.js. `Accepts variable expansion syntax.`                         |

### 🛠PowTask

Take the power of the working value.

| Field             | Type              | Label    | Description                                                      |
| ----------------- | ----------------- | -------- | ---------------------------------------------------------------- |
| scalar            | [double](#double) | optional | Take the working value to the exponent of value.                 |
| aggregator_pubkey | [string](#string) | optional | Take the working value to the exponent of the aggregators value. |
| big               | [string](#string) | optional | A stringified big.js. `Accepts variable expansion syntax.`       |

### 🛠ValueTask

Returns a specified value.

| Field             | Type              | Label    | Description                                                |
| ----------------- | ----------------- | -------- | ---------------------------------------------------------- |
| value             | [double](#double) | optional | The value that will be returned from this task.            |
| aggregator_pubkey | [string](#string) | optional | Specifies an aggregatorr to pull the value of.             |
| big               | [string](#string) | optional | A stringified big.js. `Accepts variable expansion syntax.` |
