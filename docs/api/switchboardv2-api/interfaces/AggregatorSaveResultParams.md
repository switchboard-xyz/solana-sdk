[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / AggregatorSaveResultParams

# Interface: AggregatorSaveResultParams

Parameters for which oracles must submit for responding to update requests.

## Table of contents

### Properties

- [error](AggregatorSaveResultParams.md#error)
- [jobs](AggregatorSaveResultParams.md#jobs)
- [maxResponse](AggregatorSaveResultParams.md#maxresponse)
- [minResponse](AggregatorSaveResultParams.md#minresponse)
- [oracleIdx](AggregatorSaveResultParams.md#oracleidx)
- [oracles](AggregatorSaveResultParams.md#oracles)
- [queueAuthority](AggregatorSaveResultParams.md#queueauthority)
- [tokenMint](AggregatorSaveResultParams.md#tokenmint)
- [value](AggregatorSaveResultParams.md#value)

## Properties

### error

• **error**: `boolean`

Reports that an error occured and the oracle could not send a value.

#### Defined in

[sbv2.ts:429](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L429)

---

### jobs

• **jobs**: `OracleJob`[]

List of OracleJobs that were performed to produce this result.

#### Defined in

[sbv2.ts:447](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L447)

---

### maxResponse

• **maxResponse**: `Big`

The maximum value this oracle has seen this round for the jobs listed in the
aggregator.

#### Defined in

[sbv2.ts:443](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L443)

---

### minResponse

• **minResponse**: `Big`

The minimum value this oracle has seen this round for the jobs listed in the
aggregator.

#### Defined in

[sbv2.ts:438](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L438)

---

### oracleIdx

• **oracleIdx**: `number`

Index in the list of oracles in the aggregator assigned to this round update.

#### Defined in

[sbv2.ts:425](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L425)

---

### oracles

• **oracles**: `any`[]

List of parsed oracles.

#### Defined in

[sbv2.ts:459](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L459)

---

### queueAuthority

• **queueAuthority**: `PublicKey`

Authority of the queue the aggregator is attached to.

#### Defined in

[sbv2.ts:451](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L451)

---

### tokenMint

• **tokenMint**: `PublicKey`

Program token mint.

#### Defined in

[sbv2.ts:455](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L455)

---

### value

• **value**: `Big`

Value the oracle is responding with for this update.

#### Defined in

[sbv2.ts:433](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L433)
