---
sidebar_label: Lease
title: switchboardpy.lease
---

## LeaseInitParams Objects

```python
@dataclass
class LeaseInitParams()
```

Token amount to load into the lease escrow

#### load_amount

The funding wallet of the lease

#### funder

The authority of the funding wallet

#### funder_authority

The target to which this lease is applied

#### oracle_queue_account

The feed which the lease grants permission

#### aggregator_account

This authority will be permitted to withdraw funds from this lease

## LeaseExtendParams Objects

```python
@dataclass
class LeaseExtendParams()
```

Token amount to load into the lease escrow

#### load_amount

The funding wallet of the lease

#### funder

The authority of the funding wallet

## LeaseWithdrawParams Objects

```python
@dataclass
class LeaseWithdrawParams()
```

Token amount to withdraw from the lease escrow

#### amount

The wallet of to withdraw to

#### withdraw_wallet

The withdraw authority of the lease

## LeaseAccount Objects

```python
class LeaseAccount()
```

A Switchboard account representing a lease for managing funds for oracle payouts
for fulfilling feed updates.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This lease&#x27;s public key
- `keypair` _Keypair | None_ - this lease&#x27;s keypair
