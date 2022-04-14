---
sidebar_label: Aggregator
title: switchboardpy.aggregator
---

## AggregatorSaveResultParams Objects

```python
@dataclass
class AggregatorSaveResultParams()
```

Index in the list of oracles in the aggregator assigned to this round update.

#### oracle_idx

Reports that an error occurred and the oracle could not send a value.

#### error

Value the oracle is responding with for this update.

#### value

The minimum value this oracle has seen this round for the jobs listed in the
aggregator.

#### min_response

The maximum value this oracle has seen this round for the jobs listed in the
aggregator.

#### max_response

List of OracleJobs that were performed to produce this result

#### jobs

Authority of the queue the aggregator is attached to

#### queue_authority

Program token mint

#### token_mint

List of parsed oracles

## AggregatorSetHistoryBufferParams Objects

```python
@dataclass
class AggregatorSetHistoryBufferParams()
```

Number of elements for the history buffer to fit

#### size

Authority keypair for the aggregator

## AggregatorOpenRoundParams Objects

```python
@dataclass
class AggregatorOpenRoundParams()
```

The oracle queue from which oracles are assigned this update.

#### oracle_queue_account

The token wallet which will receive rewards for calling update on this feed.

## AggregatorInitParams Objects

```python
@dataclass
class AggregatorInitParams()
```

Number of oracles to request on aggregator update.

#### batch_size

Minimum number of oracle responses required before a round is validated.

#### min_required_oracle_results

Minimum number of seconds required between aggregator rounds.

#### min_required_job_results

Minimum number of seconds required between aggregator rounds.

#### min_update_delay_seconds

The queue to which this aggregator will be linked

#### queue_account

Name of the aggregator to store on-chain.

#### name

Metadata of the aggregator to store on-chain.

#### metadata

unix_timestamp for which no feed update will occur before.

#### start_after

Change percentage required between a previous round and the current round.
If variance percentage is not met, reject new oracle responses.

#### variance_threshold

Number of seconds for which, even if the variance threshold is not passed,
accept new responses from oracles.

#### force_report_period

unix_timestamp after which funds may be withdrawn from the aggregator.
null/undefined/0 means the feed has no expiration.

#### expiration

An optional wallet for receiving kickbacks from job usage in feeds.
Defaults to token vault.

#### keypair

An optional wallet for receiving kickbacks from job usage in feeds.
Defaults to token vault.

#### author_wallet

If included, this keypair will be the aggregator authority rather than
the aggregator keypair.

## AggregatorHistoryRow Objects

```python
@dataclass
class AggregatorHistoryRow()
```

AggregatorHistoryRow is a wrapper for the row structure of elements in the aggregator history buffer.

**Attributes**:

- `timestamp` _int_ - timestamp of the aggregator result
- `value` _Decimal_ - Aggregator value at the timestamp

#### value

Generate an AggregatorHistoryRow from a retrieved buffer representation

**Arguments**:

- `buf` _list_ - Anchor-loaded buffer representation of AggregatorHistoryRow

**Returns**:

AggregatorHistoryRow

## AggregatorAccount Objects

```python
class AggregatorAccount()
```

AggregatorAccount is the wrapper for an Aggregator, the structure for that keeps aggregated feed data / metadata.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This aggregator&#x27;s public key
- `keypair` _Keypair | None_ - this aggregator&#x27;s keypair
