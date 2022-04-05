---
sidebar_label: Permission
title: switchboardpy.permission
---

## PermissionInitParams Objects

```python
@dataclass
class PermissionInitParams()
```

Pubkey of the account granting the permission

#### granter

The receiving amount of a permission

#### grantee

The authority that is allowed to set permissions for this account

## PermissionSetParams Objects

```python
@dataclass
class PermissionSetParams()
```

The permission to set

#### permission

The authority controlling this permission

#### authority

Specifies whether to enable or disable the permission

## PermissionAccount Objects

```python
class PermissionAccount()
```

A Switchboard account representing a permission or privilege granted by one
account signer to another account.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This permission&#x27;s public key
- `keypair` _Keypair | None_ - this permission&#x27;s keypair
