# Protocol Documentation

<a name="top"></a>

## Table of Contents

- [job_schemas.proto](#job_schemas.proto)

  - [JobPosting](#.JobPosting)
  - [JobResult](#.JobResult)
  - [OracleJob](#.OracleJob)
  - [OracleJob.AddTask](#.OracleJob.AddTask)
  - [OracleJob.ConditionalTask](#.OracleJob.ConditionalTask)
  - [OracleJob.DivideTask](#.OracleJob.DivideTask)
  - [OracleJob.HttpTask](#.OracleJob.HttpTask)
  - [OracleJob.HttpTask.Header](#.OracleJob.HttpTask.Header)
  - [OracleJob.JsonParseTask](#.OracleJob.JsonParseTask)
  - [OracleJob.LpExchangeRateTask](#.OracleJob.LpExchangeRateTask)
  - [OracleJob.LpTokenPriceTask](#.OracleJob.LpTokenPriceTask)
  - [OracleJob.MaxTask](#.OracleJob.MaxTask)
  - [OracleJob.MeanTask](#.OracleJob.MeanTask)
  - [OracleJob.MedianTask](#.OracleJob.MedianTask)
  - [OracleJob.MultiplyTask](#.OracleJob.MultiplyTask)
  - [OracleJob.RegexExtractTask](#.OracleJob.RegexExtractTask)
  - [OracleJob.SerumSwapTask](#.OracleJob.SerumSwapTask)
  - [OracleJob.SubtractTask](#.OracleJob.SubtractTask)
  - [OracleJob.Task](#.OracleJob.Task)
  - [OracleJob.TwapTask](#.OracleJob.TwapTask)
  - [OracleJob.ValueTask](#.OracleJob.ValueTask)
  - [OracleJob.WebsocketTask](#.OracleJob.WebsocketTask)
  - [OracleJob.XStepPriceTask](#.OracleJob.XStepPriceTask)

  - [OracleJob.HttpTask.Method](#.OracleJob.HttpTask.Method)
  - [OracleJob.JsonParseTask.AggregationMethod](#.OracleJob.JsonParseTask.AggregationMethod)

- [Scalar Value Types](#scalar-value-types)

<a name="job_schemas.proto"></a>

<p align="right"><a href="#top">Top</a></p>

## job_schemas.proto

<a name=".JobPosting"></a>

### JobPosting

The schema Oracle nodes receive when they are notified to fulfill a job.

| Field                   | Type              | Label    | Description                                      |
| ----------------------- | ----------------- | -------- | ------------------------------------------------ |
| aggregator_state_pubkey | [bytes](#bytes)   | optional | Pubkey of the aggregator to fulfill the job for. |
| node_pubkeys            | [bytes](#bytes)   | repeated | The pubkey of the nodes this job is assigned to. |
| slot                    | [uint64](#uint64) | optional | Slot number of the job posting.                  |

<a name=".JobResult"></a>

### JobResult

This schema Oracle nodes respond with when fulfilling a job.

| Field       | Type              | Label    | Description                                                       |
| ----------- | ----------------- | -------- | ----------------------------------------------------------------- |
| node_pubkey | [bytes](#bytes)   | optional | The public key of the responding node.                            |
| result      | [double](#double) | optional | The median value of the jobs the node has fulfilled successfully. |
| error       | [bool](#bool)     | optional | True if the node failed to decide on an answer to the job.        |

<a name=".OracleJob"></a>

### OracleJob

Represents a list of tasks to be performed by a switchboard oracle.

| Field | Type                              | Label    | Description                                       |
| ----- | --------------------------------- | -------- | ------------------------------------------------- |
| tasks | [OracleJob.Task](#OracleJob.Task) | repeated | The chain of tasks to perform for this OracleJob. |

<a name=".OracleJob.AddTask"></a>

### OracleJob.AddTask

This task will add a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                      |
| ----------------- | ----------------------- | -------- | -------------------------------------------------------------------------------- |
| scalar            | [double](#double)       | optional | Specifies a scalar to add by.                                                    |
| aggregator_pubkey | [string](#string)       | optional | Specifies an aggregator to add by.                                               |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before adding our numerical input by that result. |

<a name=".OracleJob.ConditionalTask"></a>

### OracleJob.ConditionalTask

This task will run the `attempt` subtasks in an effort to produce a valid numerical result. If
`attempt` fails to produce an acceptable result, `on_failure` subtasks will be run instead.

| Field      | Type                              | Label    | Description                                                                                           |
| ---------- | --------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| attempt    | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process in an attempt to produce a valid numerical result.                      |
| on_failure | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks that will be run if `attempt` subtasks are unable to produce an acceptable result. |

<a name=".OracleJob.DivideTask"></a>

### OracleJob.DivideTask

This task will divide a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                        |
| ----------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------- |
| scalar            | [double](#double)       | optional | Specifies a basic scalar denominator to divide by.                                 |
| aggregator_pubkey | [string](#string)       | optional | Specifies another aggregator result to divide by.                                  |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before dividing our numerical input by that result. |

<a name=".OracleJob.HttpTask"></a>

### OracleJob.HttpTask

The adapter will report the text body of a successful HTTP request to the specified url,
or return an error if the response status code is greater than or equal to 400.
@return string representation of it&#39;s output.

| Field   | Type                                                    | Label    | Description                                                 |
| ------- | ------------------------------------------------------- | -------- | ----------------------------------------------------------- |
| url     | [string](#string)                                       | optional | A string containing the URL to direct this HTTP request to. |
| method  | [OracleJob.HttpTask.Method](#OracleJob.HttpTask.Method) | optional | The type of HTTP request to make.                           |
| headers | [OracleJob.HttpTask.Header](#OracleJob.HttpTask.Header) | repeated | A list of headers to add to this HttpTask.                  |
| body    | [string](#string)                                       | optional | A stringified body (if any) to add to this HttpTask.        |

<a name=".OracleJob.HttpTask.Header"></a>

### OracleJob.HttpTask.Header

An object that represents a header to add to an HTTP request.

| Field | Type              | Label    | Description |
| ----- | ----------------- | -------- | ----------- |
| key   | [string](#string) | optional |             |
| value | [string](#string) | optional |             |

<a name=".OracleJob.JsonParseTask"></a>

### OracleJob.JsonParseTask

The adapter walks the path specified and returns the value found at that result. If returning
JSON data from the HttpGet or HttpPost adapters, you must use this adapter to parse the
response.

| Field              | Type                                                                                    | Label    | Description                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| path               | [string](#string)                                                                       | optional | JSONPath formatted path to the element. https://t.ly/uLtw https://www.npmjs.com/package/jsonpath-plus                      |
| aggregation_method | [OracleJob.JsonParseTask.AggregationMethod](#OracleJob.JsonParseTask.AggregationMethod) | optional | The technique that will be used to aggregate the results if walking the specified path returns multiple numerical results. |

<a name=".OracleJob.LpExchangeRateTask"></a>

### OracleJob.LpExchangeRateTask

| Field                        | Type              | Label    | Description |
| ---------------------------- | ----------------- | -------- | ----------- |
| in_token_address             | [string](#string) | optional |             |
| out_token_address            | [string](#string) | optional |             |
| mercurial_pool_address       | [string](#string) | optional |             |
| saber_pool_address           | [string](#string) | optional |             |
| orca_pool_token_mint_address | [string](#string) | optional |             |
| raydium_pool_address         | [string](#string) | optional |             |

<a name=".OracleJob.LpTokenPriceTask"></a>

### OracleJob.LpTokenPriceTask

Fetch LP token price info from a number of supported exchanges.

| Field                  | Type              | Label    | Description |
| ---------------------- | ----------------- | -------- | ----------- |
| mercurial_pool_address | [string](#string) | optional |             |
| saber_pool_address     | [string](#string) | optional |             |
| orca_pool_address      | [string](#string) | optional |             |
| raydium_pool_address   | [string](#string) | optional |             |
| price_feed_addresses   | [string](#string) | repeated |             |

<a name=".OracleJob.MaxTask"></a>

### OracleJob.MaxTask

Returns the maximum value of all the results returned by the provided subtasks and subjobs.

| Field | Type                              | Label    | Description                                                        |
| ----- | --------------------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#OracleJob)           | repeated | A list of subjobs to process and produce a list of result values.  |

<a name=".OracleJob.MeanTask"></a>

### OracleJob.MeanTask

Returns the mean of all the results returned by the provided subtasks and subjobs.

| Field | Type                              | Label    | Description                                                        |
| ----- | --------------------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#OracleJob)           | repeated | A list of subjobs to process and produce a list of result values.  |

<a name=".OracleJob.MedianTask"></a>

### OracleJob.MedianTask

Returns the median of all the results returned by the provided subtasks and subjobs. Nested
tasks must return a Number.

| Field | Type                              | Label    | Description                                                        |
| ----- | --------------------------------- | -------- | ------------------------------------------------------------------ |
| tasks | [OracleJob.Task](#OracleJob.Task) | repeated | A list of subtasks to process and produce a list of result values. |
| jobs  | [OracleJob](#OracleJob)           | repeated | A list of subjobs to process and produce a list of result values.  |

<a name=".OracleJob.MultiplyTask"></a>

### OracleJob.MultiplyTask

This task will multiply a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                           |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | [double](#double)       | optional | Specifies a scalar to multiply by.                                                    |
| aggregator_pubkey | [string](#string)       | optional | Specifies an aggregator to multiply by.                                               |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before multiplying our numerical input by that result. |

<a name=".OracleJob.RegexExtractTask"></a>

### OracleJob.RegexExtractTask

Find a pattern within a string of a previous task and extract a group number.

| Field        | Type              | Label    | Description              |
| ------------ | ----------------- | -------- | ------------------------ |
| pattern      | [string](#string) | optional | Regex pattern to find.   |
| group_number | [int32](#int32)   | optional | Group number to extract. |

<a name=".OracleJob.SerumSwapTask"></a>

### OracleJob.SerumSwapTask

Fetch the latest swap price on Serum&#39;s orderbook

| Field              | Type              | Label    | Description                            |
| ------------------ | ----------------- | -------- | -------------------------------------- |
| serum_pool_address | [string](#string) | optional | The serum pool to fetch swap price for |

<a name=".OracleJob.SubtractTask"></a>

### OracleJob.SubtractTask

This task will subtract a numerical input by a scalar value or by another
aggregate.

| Field             | Type                    | Label    | Description                                                                           |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| scalar            | [double](#double)       | optional | Specifies a scalar to subtract by.                                                    |
| aggregator_pubkey | [string](#string)       | optional | Specifies an aggregator to subtract by.                                               |
| job               | [OracleJob](#OracleJob) | optional | A job whose result is computed before subtracting our numerical input by that result. |

<a name=".OracleJob.Task"></a>

### OracleJob.Task

| Field                 | Type                                                          | Label    | Description |
| --------------------- | ------------------------------------------------------------- | -------- | ----------- |
| http_task             | [OracleJob.HttpTask](#OracleJob.HttpTask)                     | optional |             |
| json_parse_task       | [OracleJob.JsonParseTask](#OracleJob.JsonParseTask)           | optional |             |
| median_task           | [OracleJob.MedianTask](#OracleJob.MedianTask)                 | optional |             |
| mean_task             | [OracleJob.MeanTask](#OracleJob.MeanTask)                     | optional |             |
| websocket_task        | [OracleJob.WebsocketTask](#OracleJob.WebsocketTask)           | optional |             |
| divide_task           | [OracleJob.DivideTask](#OracleJob.DivideTask)                 | optional |             |
| multiply_task         | [OracleJob.MultiplyTask](#OracleJob.MultiplyTask)             | optional |             |
| lp_token_price_task   | [OracleJob.LpTokenPriceTask](#OracleJob.LpTokenPriceTask)     | optional |             |
| lp_exchange_rate_task | [OracleJob.LpExchangeRateTask](#OracleJob.LpExchangeRateTask) | optional |             |
| conditional_task      | [OracleJob.ConditionalTask](#OracleJob.ConditionalTask)       | optional |             |
| value_task            | [OracleJob.ValueTask](#OracleJob.ValueTask)                   | optional |             |
| max_task              | [OracleJob.MaxTask](#OracleJob.MaxTask)                       | optional |             |
| regex_extract_task    | [OracleJob.RegexExtractTask](#OracleJob.RegexExtractTask)     | optional |             |
| xstep_price_task      | [OracleJob.XStepPriceTask](#OracleJob.XStepPriceTask)         | optional |             |
| add_task              | [OracleJob.AddTask](#OracleJob.AddTask)                       | optional |             |
| subtract_task         | [OracleJob.SubtractTask](#OracleJob.SubtractTask)             | optional |             |
| twap_task             | [OracleJob.TwapTask](#OracleJob.TwapTask)                     | optional |             |
| serum_swap_task       | [OracleJob.SerumSwapTask](#OracleJob.SerumSwapTask)           | optional |             |

<a name=".OracleJob.TwapTask"></a>

### OracleJob.TwapTask

Takes a twap over a set period for a certain aggregator.

| Field             | Type              | Label    | Description                                     |
| ----------------- | ----------------- | -------- | ----------------------------------------------- |
| aggregator_pubkey | [string](#string) | optional | The target aggregator for the TWAP.             |
| period            | [int32](#int32)   | optional | Period, in seconds, the twap should account for |

<a name=".OracleJob.ValueTask"></a>

### OracleJob.ValueTask

Returns a specified value.

| Field | Type              | Label    | Description                                     |
| ----- | ----------------- | -------- | ----------------------------------------------- |
| value | [double](#double) | optional | The value that will be returned from this task. |

<a name=".OracleJob.WebsocketTask"></a>

### OracleJob.WebsocketTask

Opens and maintains a websocket for light speed data retrieval.

| Field                | Type              | Label    | Description                                                                                                                       |
| -------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| url                  | [string](#string) | optional | The websocket url.                                                                                                                |
| subscription         | [string](#string) | optional | The websocket message to notify of a new subscription.                                                                            |
| max_data_age_seconds | [int32](#int32)   | optional | Minimum amount of time required between when the horses are taking out.                                                           |
| filter               | [string](#string) | optional | Incoming message JSONPath filter. Example: &#34;$[?(@.channel == &#39;ticker&#39; &amp;&amp; @.market == &#39;BTC/USD&#39;)]&#34; |

<a name=".OracleJob.XStepPriceTask"></a>

### OracleJob.XStepPriceTask

<a name=".OracleJob.HttpTask.Method"></a>

### OracleJob.HttpTask.Method

An enumeration representing the types of HTTP requests available to make.

| Name           | Number | Description                                  |
| -------------- | ------ | -------------------------------------------- |
| METHOD_UNKNOWN | 0      | Unset HTTP method will default to METHOD_GET |
| METHOD_GET     | 1      | Perform an HTTP &#39;GET&#39; request.       |
| METHOD_POST    | 2      | Perform an HTTP &#39;POST&#39; request.      |

<a name=".OracleJob.JsonParseTask.AggregationMethod"></a>

### OracleJob.JsonParseTask.AggregationMethod

The methods of combining a list of numerical results.

| Name | Number | Description                            |
| ---- | ------ | -------------------------------------- |
| NONE | 0      |                                        |
| MIN  | 1      | Grab the maximum value of the results. |
| MAX  | 2      | Grab the minimum value of the results. |
| SUM  | 3      | Sum up all of the results.             |

## Scalar Value Types

| .proto Type                    | Notes                                                                                                                                           | C++    | Java       | Python      | Go      | C#         | PHP            | Ruby                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | ----------- | ------- | ---------- | -------------- | ------------------------------ |
| <a name="double" /> double     |                                                                                                                                                 | double | double     | float       | float64 | double     | float          | Float                          |
| <a name="float" /> float       |                                                                                                                                                 | float  | float      | float       | float32 | float      | float          | Float                          |
| <a name="int32" /> int32       | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32  | int        | int         | int32   | int        | integer        | Bignum or Fixnum (as required) |
| <a name="int64" /> int64       | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64  | long       | int/long    | int64   | long       | integer/string | Bignum                         |
| <a name="uint32" /> uint32     | Uses variable-length encoding.                                                                                                                  | uint32 | int        | int/long    | uint32  | uint       | integer        | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64     | Uses variable-length encoding.                                                                                                                  | uint64 | long       | int/long    | uint64  | ulong      | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32     | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s.                            | int32  | int        | int         | int32   | int        | integer        | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64     | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s.                            | int64  | long       | int/long    | int64   | long       | integer/string | Bignum                         |
| <a name="fixed32" /> fixed32   | Always four bytes. More efficient than uint32 if values are often greater than 2^28.                                                            | uint32 | int        | int         | uint32  | uint       | integer        | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64   | Always eight bytes. More efficient than uint64 if values are often greater than 2^56.                                                           | uint64 | long       | int/long    | uint64  | ulong      | integer/string | Bignum                         |
| <a name="sfixed32" /> sfixed32 | Always four bytes.                                                                                                                              | int32  | int        | int         | int32   | int        | integer        | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes.                                                                                                                             | int64  | long       | int/long    | int64   | long       | integer/string | Bignum                         |
| <a name="bool" /> bool         |                                                                                                                                                 | bool   | boolean    | boolean     | bool    | bool       | boolean        | TrueClass/FalseClass           |
| <a name="string" /> string     | A string must always contain UTF-8 encoded or 7-bit ASCII text.                                                                                 | string | String     | str/unicode | string  | string     | string         | String (UTF-8)                 |
| <a name="bytes" /> bytes       | May contain any arbitrary sequence of bytes.                                                                                                    | string | ByteString | str         | []byte  | ByteString | string         | String (ASCII-8BIT)            |
