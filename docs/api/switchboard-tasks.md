---
sidebar_position: 8
slug: /tasks
title: switchboard-tasks
---

# Switchboard Tasks

![Page Last Updated](./task-page-last-updated.svg)

| Field                  | Type                                                  | Description                                                                                                                                                                                                                |
| ---------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| http_task              | [OracleJob.HttpTask](#httptask)                       | The adapter will report the text body of a successful HTTP request to the specified url, or return an error if the response status code is greater than or equal to 400. @return string representation of it&#39;s output. |
| websocket_task         | [OracleJob.WebsocketTask](#websockettask)             | Opens and maintains a websocket for light speed data retrieval.                                                                                                                                                            |
| json_parse_task        | [OracleJob.JsonParseTask](#jsonparsetask)             | The adapter walks the path specified and returns the value found at that result. If returning JSON data from the HttpGet or HttpPost adapters, you must use this adapter to parse the response.                            |
| regex_extract_task     | [OracleJob.RegexExtractTask](#regexextracttask)       | Find a pattern within a string of a previous task and extract a group number.                                                                                                                                              |
| conditional_task       | [OracleJob.ConditionalTask](#conditionaltask)         | This task will run the `attempt` subtasks in an effort to produce a valid numerical result. If `attempt` fails to produce an acceptable result, `on_failure` subtasks will be run instead.                                 |
| oracle_task            | [OracleJob.OracleTask](#oracletask)                   | Fetch the current price of a Solana oracle protocol.                                                                                                                                                                       |
| lending_rate_task      | [OracleJob.LendingRateTask](#lendingratetask)         | Return the lending rates for various Solana protocols.                                                                                                                                                                     |
| mango_perp_market_task | [OracleJob.MangoPerpMarketTask](#mangoperpmarkettask) | Return the current price for any Mango perpetual market.                                                                                                                                                                   |
| lp_exchange_rate_task  | [OracleJob.LpExchangeRateTask](#lpexchangeratetask)   | Fetch the current swap price for a given liquidity pool.                                                                                                                                                                   |
| lp_token_price_task    | [OracleJob.LpTokenPriceTask](#lptokenpricetask)       | Fetch LP token price info from a number of supported exchanges.                                                                                                                                                            |
| serum_swap_task        | [OracleJob.SerumSwapTask](#serumswaptask)             | Fetch the latest swap price on Serum's orderbook.                                                                                                                                                                          |
| jupiter_swap_task      | [OracleJob.JupiterSwapTask](#jupiterswaptask)         | Fetch the Jupiter swap price for a given input and output token.                                                                                                                                                           |
| max_task               | [OracleJob.MaxTask](#maxtask)                         | Returns the maximum value of all the results returned by the provided subtasks and subjobs.                                                                                                                                |
| mean_task              | [OracleJob.MeanTask](#meantask)                       | Returns the mean of all the results returned by the provided subtasks and subjobs.                                                                                                                                         |
| median_task            | [OracleJob.MedianTask](#mediantask)                   | Returns the median of all the results returned by the provided subtasks and subjobs. Nested tasks must return a Number.                                                                                                    |
| multiply_task          | [OracleJob.MultiplyTask](#multiplytask)               | This task will multiply a numerical input by a scalar value or by another aggregate.                                                                                                                                       |
| divide_task            | [OracleJob.DivideTask](#dividetask)                   | This task will divide a numerical input by a scalar value or by another aggregate.                                                                                                                                         |
| add_task               | [OracleJob.AddTask](#addtask)                         | This task will add a numerical input by a scalar value or by another aggregate.                                                                                                                                            |
| subtract_task          | [OracleJob.SubtractTask](#subtracttask)               | This task will subtract a numerical input by a scalar value or by another aggregate.                                                                                                                                       |
| twap_task              | [OracleJob.TwapTask](#twaptask)                       | Takes a twap over a set period for a certain aggregator.                                                                                                                                                                   |
| value_task             | [OracleJob.ValueTask](#valuetask)                     | Returns a specified value.                                                                                                                                                                                                 |

## 📦OracleJob

Represents a list of tasks to be performed by a switchboard oracle.

| Field | Type                | Label    | Description                                       |
| ----- | ------------------- | -------- | ------------------------------------------------- |
| tasks | [OracleJob.Task](#) | repeated | The chain of tasks to perform for this OracleJob. |

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

## 🛠OracleTask

Fetch the current price of a Solana oracle protocol

| Field               | Type              | Label    | Description                                                                                                                                                                                   |
| ------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| switchboard_address | [string](#string) | optional | Mainnet address of a Switchboard V2 feed. Switchboard is decentralized and allows anyone to build their own feed. A small subset of feeds is available here: https://switchboard.xyz/explorer |
| pyth_address        | [string](#string) | optional | Mainnet address for a Pyth feed. A full list can be found here: https://pyth.network/markets/                                                                                                 |
| chainlink_address   | [string](#string) | optional | Devnet address for a Chainlink feed. A full list can be found here: https://docs.chain.link/docs/solana/data-feeds-solana                                                                     |

## 🛠LendingRateTask

| Field      | Type                                           | Label    | Description                                                   |
| ---------- | ---------------------------------------------- | -------- | ------------------------------------------------------------- |
| protocol   | [string](#string)                              | optional | 01, apricot, francium, jet, larix, mango, port, solend, tulip |
| asset_mint | [string](#string)                              | optional | A token mint address supported by the chosen protocol.        |
| field      | [LendingRateTask.Field](#lendingratetaskfield) | optional |                                                               |

### LendingRateTask.Field

| Name               | Number | Description |
| ------------------ | ------ | ----------- |
| FIELD_DEPOSIT_RATE | 0      |             |
| FIELD_BORROW_RATE  | 1      |             |

## 🛠MangoPerpMarketTask

| Field               | Type              | Label    | Description                                                                                                                                                  |
| ------------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| perp_market_address | [string](#string) | optional | Mainnet address for a mango perpetual market. A full list can be found here: https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/ids.json |

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
| value | double | optional | The value that will be returned from this task. |
