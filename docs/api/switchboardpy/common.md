---
sidebar_label: Common
title: switchboardpy.common
---

## AccountParams Objects

```python
@dataclass
class AccountParams()
```

program referencing the Switchboard program and IDL.

#### program

Public key of the account being referenced. This will always be populated
within the account wrapper.

#### public_key

Keypair of the account being referenced. This may not always be populated.

## SwitchboardDecimal Objects

```python
@dataclass
class SwitchboardDecimal()
```

#### scale

Convert BN.js style num and return SwitchboardDecimal

**Arguments**:

- `obj` _Any_ - Object with integer fields scale and mantissa (hex val)

**Returns**:

- `sbd` _SwitchboardDecimal_ - SwitchboardDecimal
