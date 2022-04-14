---
sidebar_label: Crank
title: switchboardpy.crank
---

## CrankInitParams Objects

```python
@dataclass
class CrankInitParams()
```

OracleQueueAccount for which this crank is associated

#### queue_account

Buffer specifying crank name

#### name

Buffer specifying crank metadata

#### metadata

Optional max number of rows

## CrankPopParams Objects

```python
@dataclass
class CrankPopParams()
```

Specifies the wallet to reward for turning the crank.

#### payout_wallet

The pubkey of the linked oracle queue.

#### queue_pubkey

The pubkey of the linked oracle queue authority.

#### queue_authority

CrankAccount data

#### crank

QueueAccount data

#### queue

Token mint pubkey

#### token_mint

Array of pubkeys to attempt to pop. If discluded, this will be loaded
from the crank upon calling.

#### ready_pubkeys

Nonce to allow consecutive crank pops with the same blockhash.

## CrankRow Objects

```python
@dataclass
class CrankRow()
```

Aggregator account pubkey

#### pubkey

Next aggregator update timestamp to order the crank by

## CrankAccount Objects

```python
class CrankAccount()
```

A Switchboard account representing a crank of aggregators ordered by next update time.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This crank&#x27;s public key
- `keypair` _Keypair | None_ - this crank&#x27;s keypair
