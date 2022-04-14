---
sidebar_label: Oracle
title: switchboardpy.oracle
---

## OracleInitParams Objects

```python
@dataclass
class OracleInitParams()
```

Specifies the oracle queue to associate with this OracleAccount.

#### queue_account

Buffer specifying oracle name

#### name

Buffer specifying oracle metadata

## OracleWithdrawParams Objects

```python
@dataclass
class OracleWithdrawParams()
```

Amount to withdraw

#### amount

Token Account to withdraw to

#### withdraw_account

Oracle authority keypair

## OracleAccount Objects

```python
class OracleAccount()
```

A Switchboard account representing an oracle account and its associated queue
and escrow account.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This aggregator&#x27;s public key
- `keypair` _Keypair | None_ - this aggregator&#x27;s keypair
