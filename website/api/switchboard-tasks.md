---
sidebar_position: 8
slug: /tasks
title: switchboard-tasks
---

# Switchboard Tasks

![Page Last Updated](./task-page-last-updated.svg)

Switchboard oracles read on-chain job accounts to determine how to fetch and respond to update request. An OracleJob is a collection of tasks that are chained together to arrive at a single numerical value.

| Field | Type                             | Label    | Description                                       |
| ----- | -------------------------------- | -------- | ------------------------------------------------- |
| tasks | [OracleJob.Task](#oraclejobtask) | repeated | The chain of tasks to perform for this OracleJob. |

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

The adapter will report the text body of a successful HTTP request to the specified url,
or return an error if the response status code is greater than or equal to 400.
@return string representation of it&#39;s output.

| Field   | Type                                 | Label    | Description                                                 |
| ------- | ------------------------------------ | -------- | ----------------------------------------------------------- |
| url     | string                               | optional | A string containing the URL to direct this HTTP request to. |
| method  | [OracleJob.HttpTask.Method](#Method) | optional | The type of HTTP request to make.                           |
| headers | [OracleJob.HttpTask.Header](#Header) | repeated | A list of headers to add to this HttpTask.                  |
| body    | string                               | optional | A stringified body (if any) to add to this HttpTask.        |

#### Header

An object that represents a header to add to an HTTP request.

| Field | Type   | Label    | Description |
| ----- | ------ | -------- | ----------- |
| key   | string | optional |             |
| value | string | optional |             |

#### Method

An enumeration representing the types of HTTP requests available to make.

| Name           | Number | Description                                  |
| -------------- | ------ | -------------------------------------------- |
| METHOD_UNKNOWN | 0      | Unset HTTP method will default to METHOD_GET |
| METHOD_GET     | 1      | Perform an HTTP &#39;GET&#39; request.       |
| METHOD_POST    | 2      | Perform an HTTP &#39;POST&#39; request.      |

### 🛠WebsocketTask

Opens and maintains a websocket for light speed data retrieval.

| Field                | Type   | Label    | Description                                                                                                                       |
| -------------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| url                  | string | optional | The websocket url.                                                                                                                |
| subscription         | string | optional | The websocket message to notify of a new subscription.                                                                            |
| max_data_age_seconds | int32  | optional | Minimum amount of time required between when the horses are taking out.                                                           |
| filter               | string | optional | Incoming message JSONPath filter. Example: &#34;$[?(@.channel == &#39;ticker&#39; &amp;&amp; @.market == &#39;BTC/USD&#39;)]&#34; |

## 📦Web3 Fetch

### 🛠AnchorFetchTask

Load a parse an Anchor based solana account.

| Field           | Type   | Label    | Description                             |
| --------------- | ------ | -------- | --------------------------------------- |
| program_id      | string | optional | Owning program of the account to parse. |
| account_address | string | optional | The account to parse.                   |

### 🛠OracleTask

Fetch the current price of a Solana oracle protocol

| Field                            | Type   | Label    | Description                                                                                                                                                                                   |
| -------------------------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| switchboard_address              | string | optional | Mainnet address of a Switchboard V2 feed. Switchboard is decentralized and allows anyone to build their own feed. A small subset of feeds is available here: https://switchboard.xyz/explorer |
| pyth_address                     | string | optional | Mainnet address for a Pyth feed. A full list can be found here: https://pyth.network/markets/                                                                                                 |
| chainlink_address                | string | optional | Devnet address for a Chainlink feed. A full list can be found here: https://docs.chain.link/docs/solana/data-feeds-solana                                                                     |
| pyth_allowed_confidence_interval | double | optional | Value (as a percentage) that the lower bound confidence interval is of the actual value. Confidence intervals that are larger that this threshold are rejected.                               |

### 🛠JupiterSwapTask

Fetch the Jupiter swap price for a given input and output token.

| Field             | Type   | Label    | Description                               |
| ----------------- | ------ | -------- | ----------------------------------------- |
| in_token_address  | string | optional | The input token mint address.             |
| out_token_address | string | optional | The output token mint address.            |
| base_amount       | double | optional | The base token input amount for the swap. |

### 🛠SerumSwapTask

Fetch the latest swap price on Serum&#39;s orderbook

| Field              | Type   | Label    | Description                            |
| ------------------ | ------ | -------- | -------------------------------------- |
| serum_pool_address | string | optional | The serum pool to fetch swap price for |

### 🛠UniswapExchangeRateTask

| Field             | Type   | Label    | Description |
| ----------------- | ------ | -------- | ----------- |
| in_token_address  | string | optional |             |
| out_token_address | string | optional |             |
| in_token_amount   | uint32 | optional |             |
| slippage          | double | optional |             |
| provider          | string | optional |             |

### 🛠SushiSwapExchangeRateTask

| Field             | Type   | Label    | Description |
| ----------------- | ------ | -------- | ----------- |
| in_token_address  | string | optional |             |
| out_token_address | string | optional |             |
| in_token_amount   | uint32 | optional |             |
| slippage          | double | optional |             |
| provider          | string | optional |             |

### 🛠DefiKingdomsTask

| Field     | Type                                       | Label    | Description |
| --------- | ------------------------------------------ | -------- | ----------- |
| provider  | string                                     | optional |             |
| in_token  | [OracleJob.DefiKingdomsTask.Token](#Token) | optional |             |
| out_token | [OracleJob.DefiKingdomsTask.Token](#Token) | optional |             |

#### Token

| Field    | Type   | Label    | Description |
| -------- | ------ | -------- | ----------- |
| address  | string | optional |             |
| decimals | int32  | optional |             |

### 🛠MangoPerpTask

Fetch the current price for a Mango perpetual market

| Field               | Type   | Label    | Description                                                                                                                                                  |
| ------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| perp_market_address | string | optional | Mainnet address for a mango perpetual market. A full list can be found here: https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/ids.json |

### 🛠LendingRateTask

Fetch the lending rates for various Solana protocols

| Field      | Type                                      | Label    | Description                                                   |
| ---------- | ----------------------------------------- | -------- | ------------------------------------------------------------- |
| protocol   | string                                    | optional | 01, apricot, francium, jet, larix, mango, port, solend, tulip |
| asset_mint | string                                    | optional | A token mint address supported by the chosen protocol         |
| field      | [OracleJob.LendingRateTask.Field](#Field) | optional |                                                               |

#### Field

| Name               | Number | Description          |
| ------------------ | ------ | -------------------- |
| FIELD_DEPOSIT_RATE | 0      | deposit lending rate |
| FIELD_BORROW_RATE  | 1      | borrow lending rate  |

### 🛠XStepPriceTask

| Field                  | Type                                | Label    | Description                                                            |
| ---------------------- | ----------------------------------- | -------- | ---------------------------------------------------------------------- |
| step_job               | [OracleJob.MedianTask](#MedianTask) | optional | median task containing the job definitions to fetch the STEP/USD price |
| step_aggregator_pubkey | string                              | optional | existing aggregator pubkey for STEP/USD                                |

### 🛠SplTokenParseTask

| Field                 | Type   | Label    | Description |
| --------------------- | ------ | -------- | ----------- |
| token_account_address | string | optional |             |
| mint_address          | string | optional |             |

### 🛠SplStakePoolTask

| Field  | Type   | Label    | Description                       |
| ------ | ------ | -------- | --------------------------------- |
| pubkey | string | optional | The pubkey of the SPL Stake Pool. |

### 🛠LpExchangeRateTask

Fetch the current swap price for a given liquidity pool

| Field                        | Type   | Label    | Description                                                                                                               |
| ---------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| in_token_address             | string | optional | Not Used                                                                                                                  |
| out_token_address            | string | optional | Not Used                                                                                                                  |
| mercurial_pool_address       | string | optional | Mercurial finance pool address. A full list can be found here: https://github.com/mercurial-finance/stable-swap-n-pool-js |
| saber_pool_address           | string | optional | Saber pool address. A full list can be found here: https://github.com/saber-hq/saber-registry-dist                        |
| orca_pool_token_mint_address | string | optional | Orca pool address. A full list can be found here: https://www.orca.so/pools                                               |
| raydium_pool_address         | string | optional | The Raydium liquidity pool ammId. A full list can be found here: https://sdk.raydium.io/liquidity/mainnet.json            |

### 🛠LpTokenPriceTask

Fetch LP token price info from a number of supported exchanges.

| Field                  | Type                    | Label    | Description                                                                                                                                                                                                                                  |
| ---------------------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mercurial_pool_address | string                  | optional | Mercurial finance pool address. A full list can be found here: https://github.com/mercurial-finance/stable-swap-n-pool-js                                                                                                                    |
| saber_pool_address     | string                  | optional | Saber pool address. A full list can be found here: https://github.com/saber-hq/saber-registry-dist                                                                                                                                           |
| orca_pool_address      | string                  | optional | Orca pool address. A full list can be found here: https://www.orca.so/pools                                                                                                                                                                  |
| raydium_pool_address   | string                  | optional | The Raydium liquidity pool ammId. A full list can be found here: https://sdk.raydium.io/liquidity/mainnet.json                                                                                                                               |
| price_feed_addresses   | string                  | repeated | A list of Switchboard aggregator accounts used to calculate the fair LP price. This ensures the price is based on the previous round to mitigate flash loan price manipulation.                                                              |
| price_feed_jobs        | [OracleJob](#OracleJob) | repeated |                                                                                                                                                                                                                                              |
| use_fair_price         | [bool](#bool)           | optional | If enabled and price_feed_addresses provided, the oracle will calculate the fair LP price based on the liquidity pool reserves. See our blog post for more information: https://switchboardxyz.medium.com/fair-lp-token-oracles-94a457c50239 |

## 📦Parse

### 🛠JsonParseTask

The adapter walks the path specified and returns the value found at that result. If returning
JSON data from the HttpGet or HttpPost adapters, you must use this adapter to parse the
response.

| Field              | Type                                                            | Label    | Description                                                                                                                |
| ------------------ | --------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| path               | string                                                          | optional | JSONPath formatted path to the element. https://t.ly/uLtw https://www.npmjs.com/package/jsonpath-plus                      |
| aggregation_method | [OracleJob.JsonParseTask.AggregationMethod](#AggregationMethod) | optional | The technique that will be used to aggregate the results if walking the specified path returns multiple numerical results. |

#### AggregationMethod

The methods of combining a list of numerical results.

| Name | Number | Description                            |
| ---- | ------ | -------------------------------------- |
| NONE | 0      |                                        |
| MIN  | 1      | Grab the minimum value of the results. |
| MAX  | 2      | Grab the maximum value of the results. |
| SUM  | 3      | Sum up all of the results.             |

### 🛠RegexExtractTask

Find a pattern within a string of a previous task and extract a group number.

| Field        | Type   | Label    | Description              |
| ------------ | ------ | -------- | ------------------------ |
| pattern      | string | optional | Regex pattern to find.   |
| group_number | int32  | optional | Group number to extract. |

## 📦Logic

### 🛠ConditionalTask

This task will run the `attempt` subtasks in an effort to produce a valid numerical result. If
`attempt` fails to produce an acceptable result, `on_failure` subtasks will be run instead.

| Field      | Type                              | Label    | Description                                                                                           |
| ---------- | --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| attempt    | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process in an attempt to produce a valid numerical result.                      |
| on_failure | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks that will be run if `attempt` subtasks are unable to produce an acceptable result. |

## 📦Math

### 🛠TwapTask

Takes a twap over a set period for a certain aggregator.

| Field                      | Type          | Label    | Description                                                          |
| -------------------------- | ------------- | -------- | -------------------------------------------------------------------- |
| aggregator_pubkey          | string        | optional | The target aggregator for the TWAP.                                  |
| period                     | int32         | optional | Period, in seconds, the twap should account for                      |
| weight_by_propagation_time | [bool](#bool) | optional | Weight samples by their propagation time                             |
| min_samples                | uint32        | optional | Minimum number of samples in the history to calculate a valid result |
| ending_unix_timestamp      | int32         | optional | Ending unix timestamp to collect values up to                        |

### 🛠MaxTask

Returns the maximum value of all the results returned by the provided subtasks and subjobs.

| Field | Type                              | Label    | Description                                                        |
| ----- | --------------------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#OracleJob)           | repeated | A list of subjobs to process and produce a list of result values.  |

### 🛠MeanTask

Returns the mean of all the results returned by the provided subtasks and subjobs.

| Field | Type                              | Label    | Description                                                        |
| ----- | --------------------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#OracleJob)           | repeated | A list of subjobs to process and produce a list of result values.  |

### 🛠MedianTask

Returns the median of all the results returned by the provided subtasks and subjobs. Nested
tasks must return a Number.

| Field                   | Type                              | Label    | Description                                                        |
| ----------------------- | --------------------------------- | -------- | ------------------------------------------------------------------ |
| tasks                   | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process and produce a list of result values. |
| jobs                    | [OracleJob](#OracleJob)           | repeated | A list of subjobs to process and produce a list of result values.  |
| min_successful_required | int32                             | optional |                                                                    |

### 🛠AddTask

This task will add a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                      |
| ----------------- | ----------------------- | -------- | -------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a scalar to add by.                                                    |
| aggregator_pubkey | string                  | optional | Specifies an aggregator to add by.                                               |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before adding our numerical input by that result. |

### 🛠SubtractTask

This task will subtract a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                           |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a scalar to subtract by.                                                    |
| aggregator_pubkey | string                  | optional | Specifies an aggregator to subtract by.                                               |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before subtracting our numerical input by that result. |

### 🛠MultiplyTask

This task will multiply a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                           |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a scalar to multiply by.                                                    |
| aggregator_pubkey | string                  | optional | Specifies an aggregator to multiply by.                                               |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before multiplying our numerical input by that result. |

### 🛠DivideTask

This task will divide a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                        |
| ----------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a basic scalar denominator to divide by.                                 |
| aggregator_pubkey | string                  | optional | Specifies another aggregator result to divide by.                                  |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before dividing our numerical input by that result. |

### 🛠PowTask

Take the power of the working value.

| Field             | Type   | Label    | Description                                                      |
| ----------------- | ------ | -------- | ---------------------------------------------------------------- |
| scalar            | double | optional | Take the working value to the exponent of value.                 |
| aggregator_pubkey | string | optional | Take the working value to the exponent of the aggregators value. |

### 🛠ValueTask

Returns a specified value.

| Field             | Type   | Label    | Description                                     |
| ----------------- | ------ | -------- | ----------------------------------------------- |
| value             | double | optional | The value that will be returned from this task. |
| aggregator_pubkey | string | optional | Specifies an aggregator to pull the value of.   |

<!-- ## 📦OracleJob.Task

| Field                        | Type                                                                        | Label    | Description |
| ---------------------------- | --------------------------------------------------------------------------- | -------- | ----------- |
| http_task                    | [OracleJob.HttpTask](#OracleJob.HttpTask)                                   | optional |             |
| json_parse_task              | [OracleJob.JsonParseTask](#OracleJob.JsonParseTask)                         | optional |             |
| median_task                  | [OracleJob.MedianTask](#OracleJob.MedianTask)                               | optional |             |
| mean_task                    | [OracleJob.MeanTask](#OracleJob.MeanTask)                                   | optional |             |
| websocket_task               | [OracleJob.WebsocketTask](#OracleJob.WebsocketTask)                         | optional |             |
| divide_task                  | [OracleJob.DivideTask](#OracleJob.DivideTask)                               | optional |             |
| multiply_task                | [OracleJob.MultiplyTask](#OracleJob.MultiplyTask)                           | optional |             |
| lp_token_price_task          | [OracleJob.LpTokenPriceTask](#OracleJob.LpTokenPriceTask)                   | optional |             |
| lp_exchange_rate_task        | [OracleJob.LpExchangeRateTask](#OracleJob.LpExchangeRateTask)               | optional |             |
| conditional_task             | [OracleJob.ConditionalTask](#OracleJob.ConditionalTask)                     | optional |             |
| value_task                   | [OracleJob.ValueTask](#OracleJob.ValueTask)                                 | optional |             |
| max_task                     | [OracleJob.MaxTask](#OracleJob.MaxTask)                                     | optional |             |
| regex_extract_task           | [OracleJob.RegexExtractTask](#OracleJob.RegexExtractTask)                   | optional |             |
| xstep_price_task             | [OracleJob.XStepPriceTask](#OracleJob.XStepPriceTask)                       | optional |             |
| add_task                     | [OracleJob.AddTask](#OracleJob.AddTask)                                     | optional |             |
| subtract_task                | [OracleJob.SubtractTask](#OracleJob.SubtractTask)                           | optional |             |
| twap_task                    | [OracleJob.TwapTask](#OracleJob.TwapTask)                                   | optional |             |
| serum_swap_task              | [OracleJob.SerumSwapTask](#OracleJob.SerumSwapTask)                         | optional |             |
| pow_task                     | [OracleJob.PowTask](#OracleJob.PowTask)                                     | optional |             |
| lending_rate_task            | [OracleJob.LendingRateTask](#OracleJob.LendingRateTask)                     | optional |             |
| mango_perp_market_task       | [OracleJob.MangoPerpMarketTask](#OracleJob.MangoPerpMarketTask)             | optional |             |
| jupiter_swap_task            | [OracleJob.JupiterSwapTask](#OracleJob.JupiterSwapTask)                     | optional |             |
| perp_market_task             | [OracleJob.PerpMarketTask](#OracleJob.PerpMarketTask)                       | optional |             |
| oracle_task                  | [OracleJob.OracleTask](#OracleJob.OracleTask)                               | optional |             |
| anchor_fetch_task            | [OracleJob.AnchorFetchTask](#OracleJob.AnchorFetchTask)                     | optional |             |
| defi_kingdoms_task           | [OracleJob.DefiKingdomsTask](#OracleJob.DefiKingdomsTask)                   | optional |             |
| tps_task                     | [OracleJob.TpsTask](#OracleJob.TpsTask)                                     | optional |             |
| spl_stake_pool_task          | [OracleJob.SplStakePoolTask](#OracleJob.SplStakePoolTask)                   | optional |             |
| spl_token_parse_task         | [OracleJob.SplTokenParseTask](#OracleJob.SplTokenParseTask)                 | optional |             |
| uniswap_exchange_rate_task   | [OracleJob.UniswapExchangeRateTask](#OracleJob.UniswapExchangeRateTask)     | optional |             |
| sushiswap_exchange_rate_task | [OracleJob.SushiswapExchangeRateTask](#OracleJob.SushiswapExchangeRateTask) | optional |             | -->

<!--

## 🛠HttpTask

The adapter will report the text body of a successful HTTP request to the specified url,
or return an error if the response status code is greater than or equal to 400.
@return string representation of it&#39;s output.

| Field   | Type                                 | Label    | Description                                                 |
| ------- | ------------------------------------ | -------- | ----------------------------------------------------------- |
| url     | string                               | optional | A string containing the URL to direct this HTTP request to. |
| method  | [OracleJob.HttpTask.Method](#method) | optional | The type of HTTP request to make.                           |
| headers | [OracleJob.HttpTask.Header](#header) | repeated | A list of headers to add to this HttpTask.                  |
| body    | string                               | optional | A stringified body (if any) to add to this HttpTask.        |

### Header

An object that represents a header to add to an HTTP request.

| Field | Type   | Label    | Description |
| ----- | ------ | -------- | ----------- |
| key   | string | optional |             |
| value | string | optional |             |

### Method

An enumeration representing the types of HTTP requests available to make.

| Name           | Number | Description                                  |
| -------------- | ------ | -------------------------------------------- |
| METHOD_UNKNOWN | 0      | Unset HTTP method will default to METHOD_GET |
| METHOD_GET     | 1      | Perform an HTTP &#39;GET&#39; request.       |
| METHOD_POST    | 2      | Perform an HTTP &#39;POST&#39; request.      |

## 🛠WebsocketTask

Opens and maintains a websocket for light speed data retrieval.

| Field                | Type   | Label    | Description                                                                                                                       |
| -------------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| url                  | string | optional | The websocket url.                                                                                                                |
| subscription         | string | optional | The websocket message to notify of a new subscription.                                                                            |
| max_data_age_seconds | int32  | optional | Minimum amount of time required between when the horses are taking out.                                                           |
| filter               | string | optional | Incoming message JSONPath filter. Example: &#34;$[?(@.channel == &#39;ticker&#39; &amp;&amp; @.market == &#39;BTC/USD&#39;)]&#34; |

## 🛠AnchorFetchTask

Load a parse an Anchor based solana account.

| Field           | Type   | Label    | Description                             |
| --------------- | ------ | -------- | --------------------------------------- |
| program_id      | string | optional | Owning program of the account to parse. |
| account_address | string | optional | The account to parse.                   |

## 🛠OracleTask

Fetch the current price of a Solana oracle protocol

| Field                            | Type              | Label    | Description                                                                                                                                                                                   |
| -------------------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| switchboard_address              | string            | optional | Mainnet address of a Switchboard V2 feed. Switchboard is decentralized and allows anyone to build their own feed. A small subset of feeds is available here: https://switchboard.xyz/explorer |
| pyth_address                     | string            | optional | Mainnet address for a Pyth feed. A full list can be found here: https://pyth.network/markets/                                                                                                 |
| chainlink_address                | string            | optional | Devnet address for a Chainlink feed. A full list can be found here: https://docs.chain.link/docs/solana/data-feeds-solana                                                                     |
| pyth_allowed_confidence_interval | [double](#double) | optional | Value (as a percentage) that the lower bound confidence interval is of the actual value. Confidence intervals that are larger that this threshold are rejected.                                |

## 🛠JsonParseTask

The adapter walks the path specified and returns the value found at that result. If returning JSON data from the HttpGet or HttpPost adapters, you must use this adapter to parse the response.

| Field              | Type                                    | Label    | Description                                                                                                                |
| ------------------ | --------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| path               | string                                  | optional | JSONPath formatted path to the element. https://t.ly/uLtw https://www.npmjs.com/package/jsonpath-plus                      |
| aggregation_method | [AggregationMethod](#aggregationmethod) | optional | The technique that will be used to aggregate the results if walking the specified path returns multiple numerical results. |

### AggregationMethod

The methods of combining a list of numerical results.

| Name | Number | Description                            |
| ---- | ------ | -------------------------------------- |
| NONE | 0      |                                        |
| MIN  | 1      | Grab the minimum value of the results. |
| MAX  | 2      | Grab the maximum value of the results. |
| SUM  | 3      | Sum up all of the results.             |

## 🛠RegexExtractTask

Find a pattern within a string of a previous task and extract a group number.

| Field        | Type   | Label    | Description              |
| ------------ | ------ | -------- | ------------------------ |
| pattern      | string | optional | Regex pattern to find.   |
| group_number | int32  | optional | Group number to extract. |

## 🛠ConditionalTask

This task will run the `attempt` subtasks in an effort to produce a valid numerical result. If
`attempt` fails to produce an acceptable result, `on_failure` subtasks will be run instead.

| Field      | Type                | Label    | Description                                                                                           |
| ---------- | ------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| attempt    | [OracleJob.Task](#) | repeated | A list of subtasks to process in an attempt to produce a valid numerical result.                      |
| on_failure | [OracleJob.Task](#) | repeated | A list of subtasks that will be run if `attempt` subtasks are unable to produce an acceptable result. |

## 🛠LendingRateTask

| Field      | Type                            | Label    | Description                                                   |
| ---------- | ------------------------------- | -------- | ------------------------------------------------------------- |
| protocol   | string                          | optional | 01, apricot, francium, jet, larix, mango, port, solend, tulip |
| asset_mint | string                          | optional | A token mint address supported by the chosen protocol.        |
| field      | [LendingRateTask.Field](#field) | optional |                                                               |

### Field

| Name               | Number | Description |
| ------------------ | ------ | ----------- |
| FIELD_DEPOSIT_RATE | 0      |             |
| FIELD_BORROW_RATE  | 1      |             |

## 🛠MangoPerpMarketTask

| Field               | Type   | Label    | Description                                                                                                                                                  |
| ------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| perp_market_address | string | optional | Mainnet address for a mango perpetual market. A full list can be found here: https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/ids.json |

## 🛠LpExchangeRateTask

| Field                        | Type   | Label    | Description                                                                                                               |
| ---------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| in_token_address             | string | optional | Not Used.                                                                                                                 |
| out_token_address            | string | optional | Not Used.                                                                                                                 |
| mercurial_pool_address       | string | optional | Mercurial finance pool address. A full list can be found here: https://github.com/mercurial-finance/stable-swap-n-pool-js |
| saber_pool_address           | string | optional | Saber pool address. A full list can be found here: https://github.com/saber-hq/saber-registry-dist                        |
| orca_pool_token_mint_address | string | optional | Orca pool address. A full list can be found here: https://www.orca.so/pools                                               |
| raydium_pool_address         | string | optional | The Raydium liquidity pool ammId. A full list can be found here: https://sdk.raydium.io/liquidity/mainnet.json            |

## 🛠LpTokenPriceTask

Fetch LP token price info from a number of supported exchanges.

| Field                  | Type     | Label    | Description                                                                                                                                                                                                                                  |
| ---------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mercurial_pool_address | string   | optional | Mercurial finance pool address. A full list can be found here: https://github.com/mercurial-finance/stable-swap-n-pool-js                                                                                                                    |
| saber_pool_address     | string   | optional | Saber pool address. A full list can be found here: https://github.com/saber-hq/saber-registry-dist                                                                                                                                           |
| orca_pool_address      | string   | optional | Orca pool address. A full list can be found here: https://www.orca.so/pools                                                                                                                                                                  |
| raydium_pool_address   | string   | optional | The Raydium liquidity pool ammId. A full list can be found here: https://sdk.raydium.io/liquidity/mainnet.json                                                                                                                               |
| use_fair_price         | boolean  | optional | If enabled and price_feed_addresses provided, the oracle will calculate the fair LP price based on the liquidity pool reserves. See our blog post for more information: https://switchboardxyz.medium.com/fair-lp-token-oracles-94a457c50239 |
| price_feed_addresses   | string[] | repeated | A list of Switchboard aggregator accounts used to calculate the fair LP price. This ensures the price is based on the previous round to mitigate flash loan price manipulation.                                                              |

## 🛠SerumSwapTask

Fetch the latest swap price on Serum&#39;s orderbook

| Field              | Type   | Label    | Description                            |
| ------------------ | ------ | -------- | -------------------------------------- |
| serum_pool_address | string | optional | The serum pool to fetch swap price for |

## 🛠JupiterSwapTask

Fetch the Jupiter swap price for a given input and output token.

| Field             | Type   | Label    | Description                    |
| ----------------- | ------ | -------- | ------------------------------ |
| in_token_address  | string | optional | The input token mint address.  |
| out_token_address | string | optional | The output token mint address. |

## 🛠DefiKingdomTask

| Field     | Type                                       | Label    | Description |
| --------- | ------------------------------------------ | -------- | ----------- |
| provider  | string                                     | optional |             |
| in_token  | [OracleJob.DefiKingdomsTask.Token](#token) | optional |             |
| out_token | [OracleJob.DefiKingdomsTask.Token](#token) | optional |             |

### Token

| Field    | Type            | Label    | Description |
| -------- | --------------- | -------- | ----------- |
| address  | string          | optional |             |
| decimals | [int32](#int32) | optional |             |

## 🛠MaxTask

Returns the maximum value of all the results returned by the provided subtasks and subjobs.

| Field | Type                    | Label    | Description                                                        |
| ----- | ----------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#)     | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#oraclejob) | repeated | A list of subjobs to process and produce a list of result values.  |

## 🛠MeanTask

Returns the mean of all the results returned by the provided subtasks and subjobs.

| Field | Type                    | Label    | Description                                                        |
| ----- | ----------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#)     | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#oraclejob) | repeated | A list of subjobs to process and produce a list of result values.  |

## 🛠MedianTask

Returns the median of all the results returned by the provided subtasks and subjobs. Nested
tasks must return a Number.

| Field | Type                    | Label    | Description                                                        |
| ----- | ----------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#)     | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#oraclejob) | repeated | A list of subjobs to process and produce a list of result values.  |

## 🛠MultiplyTask

This task will multiply a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                           |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a scalar to multiply by.                                                    |
| aggregator_pubkey | string                  | optional | Specifies an aggregator to multiply by.                                               |
| job               | [OracleJob](#oraclejob) | optional | A job whose result is computed before multiplying our numerical input by that result. |

## 🛠DivideTask

This task will divide a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                        |
| ----------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a basic scalar denominator to divide by.                                 |
| aggregator_pubkey | string                  | optional | Specifies another aggregator result to divide by.                                  |
| job               | [OracleJob](#oraclejob) | optional | A job whose result is computed before dividing our numerical input by that result. |

## 🛠AddTask

This task will add a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                      |
| ----------------- | ----------------------- | -------- | -------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a scalar to add by.                                                    |
| aggregator_pubkey | string                  | optional | Specifies an aggregator to add by.                                               |
| job               | [OracleJob](#oraclejob) | optional | A job whose result is computed before adding our numerical input by that result. |

## 🛠SubtractTask

This task will subtract a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                           |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | double                  | optional | Specifies a scalar to subtract by.                                                    |
| aggregator_pubkey | string                  | optional | Specifies an aggregator to subtract by.                                               |
| job               | [OracleJob](#oraclejob) | optional | A job whose result is computed before subtracting our numerical input by that result. |

## 🛠TwapTask

Takes a twap over a set period for a certain aggregator.

| Field             | Type   | Label    | Description                                     |
| ----------------- | ------ | -------- | ----------------------------------------------- |
| aggregator_pubkey | string | optional | The target aggregator for the TWAP.             |
| period            | int32  | optional | Period, in seconds, the twap should account for |

## 🛠ValueTask

Returns a specified value.

| Field | Type   | Label    | Description                                     |
| ----- | ------ | -------- | ----------------------------------------------- |
| value | double | optional | The value that will be returned from this task. | -->
