---
sidebar_label: Oraclequeue
title: switchboardpy.oraclequeue
---

## OracleQueueInitParams Objects

```python
@dataclass
class OracleQueueInitParams()
```

Rewards to provide oracles and round openers on this queue.

#### reward

The minimum amount of stake oracles must present to remain on the queue.

#### min_stake

The account to delegate authority to for creating permissions targeted
at the queue.

#### authority

Time period we should remove an oracle after if no response.

#### oracle_timeout

The tolerated variance amount oracle results can have from the
accepted round result before being slashed.
slashBound = varianceToleranceMultiplier \* stdDeviation
Default: 2

#### variance_tolerance_multiplier

Consecutive failure limit for a feed before feed permission is revoked.

#### consecutive_feed_failure_limit

Consecutive failure limit for an oracle before oracle permission is revoked.

#### consecutive_oracle_failure_limit

the minimum update delay time for Aggregators

#### minimum_delay_seconds

Optionally set the size of the queue.

#### queue_size

Enabling this setting means data feeds do not need explicit permission
to join the queue.

#### unpermissioned_feeds

Whether slashing is enabled on this queue

#### slashing_enabled

After a feed lease is funded or re-funded, it must consecutively succeed
N amount of times or its authorization to use the queue is auto-revoked.

#### feed_probation_period

A name to assign to this OracleQueue.

#### name

Buffer for queue metadata.

## OracleQueueAccount Objects

```python
class OracleQueueAccount()
```

A Switchboard account representing a queue for distributing oracles to
permitted data feeds.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This OracleQueueAccount&#x27;s public key
- `keypair` _Keypair | None_ - this OracleQueueAccount&#x27;s keypair
