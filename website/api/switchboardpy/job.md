---
sidebar_label: Job
title: switchboardpy.job
---

## JobInitParams Objects

```python
@dataclass
class JobInitParams()
```

A serialized protocol buffer holding the schema of the job.

#### data

An optional name to apply to the job account.

#### name

unix_timestamp of when funds can be withdrawn from this account.

#### expiration

A required variables oracles must fill to complete the job.

#### variables

A pre-generated keypair to use.

#### keypair

An optional wallet for receiving kickbacks from job usage in feeds.
Defaults to token vault.

## JobAccount Objects

```python
class JobAccount()
```

A Switchboard account representing a job for an oracle to perform, stored as
a protocol buffer.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This aggregator&#x27;s public key
- `keypair` _Keypair | None_ - this aggregator&#x27;s keypair
