---
sidebar_label: Program
title: switchboardpy.program
---

## ProgramInitParams Objects

```python
@dataclass
class ProgramInitParams()
```

Optional token mint

## VaultTransferParams Objects

```python
@dataclass
class VaultTransferParams()
```

Amount being transferred

## ProgramStateAccount Objects

```python
class ProgramStateAccount()
```

Account type representing Switchboard global program state.

**Attributes**:

- `program` _anchor.Program_ - The anchor program ref
- `public_key` _PublicKey | None_ - This program&#x27;s public key
- `keypair` _Keypair | None_ - this program&#x27;s keypair
