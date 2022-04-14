[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / AggregatorAccount

# Class: AggregatorAccount

Account type representing an aggregator (data feed).

## Table of contents

### Constructors

- [constructor](AggregatorAccount.md#constructor)

### Properties

- [keypair](AggregatorAccount.md#keypair)
- [program](AggregatorAccount.md#program)
- [publicKey](AggregatorAccount.md#publickey)

### Methods

- [addJob](AggregatorAccount.md#addjob)
- [getConfirmedRoundResults](AggregatorAccount.md#getconfirmedroundresults)
- [getLatestFeedTimestamp](AggregatorAccount.md#getlatestfeedtimestamp)
- [getLatestValue](AggregatorAccount.md#getlatestvalue)
- [getOracleIndex](AggregatorAccount.md#getoracleindex)
- [loadData](AggregatorAccount.md#loaddata)
- [loadHashes](AggregatorAccount.md#loadhashes)
- [loadHistory](AggregatorAccount.md#loadhistory)
- [loadJobs](AggregatorAccount.md#loadjobs)
- [lock](AggregatorAccount.md#lock)
- [openRound](AggregatorAccount.md#openround)
- [produceJobsHash](AggregatorAccount.md#producejobshash)
- [removeJob](AggregatorAccount.md#removejob)
- [saveResult](AggregatorAccount.md#saveresult)
- [saveResultTxn](AggregatorAccount.md#saveresulttxn)
- [setAuthority](AggregatorAccount.md#setauthority)
- [setBatchSize](AggregatorAccount.md#setbatchsize)
- [setHistoryBuffer](AggregatorAccount.md#sethistorybuffer)
- [setMinJobs](AggregatorAccount.md#setminjobs)
- [setMinOracles](AggregatorAccount.md#setminoracles)
- [size](AggregatorAccount.md#size)
- [create](AggregatorAccount.md#create)
- [decode](AggregatorAccount.md#decode)
- [getName](AggregatorAccount.md#getname)
- [shouldReportValue](AggregatorAccount.md#shouldreportvalue)

## Constructors

### constructor

• **new AggregatorAccount**(`params`)

AggregatorAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:585](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L585)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:579](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L579)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:577](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L577)

---

### publicKey

• `Optional` **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:578](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L578)

## Methods

### addJob

▸ **addJob**(`job`, `authority?`): `Promise`<`string`\>

RPC to add a new job to an aggregtor to be performed on feed updates.

#### Parameters

| Name         | Type                          | Description                                                                |
| :----------- | :---------------------------- | :------------------------------------------------------------------------- |
| `job`        | [`JobAccount`](JobAccount.md) | JobAccount specifying another job for this aggregator to fulfill on update |
| `authority?` | `Keypair`                     | -                                                                          |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:1000](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1000)

---

### getConfirmedRoundResults

▸ **getConfirmedRoundResults**(`aggregator?`): `Promise`<{ `oracleAccount`: [`OracleAccount`](OracleAccount.md) ; `value`: `Big` }[]\>

Get the individual oracle results of the latest confirmed round.

#### Parameters

| Name          | Type  | Description                                                         |
| :------------ | :---- | :------------------------------------------------------------------ |
| `aggregator?` | `any` | Optional parameter representing the already loaded aggregator info. |

#### Returns

`Promise`<{ `oracleAccount`: [`OracleAccount`](OracleAccount.md) ; `value`: `Big` }[]\>

latest results by oracle pubkey

#### Defined in

[sbv2.ts:755](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L755)

---

### getLatestFeedTimestamp

▸ **getLatestFeedTimestamp**(`aggregator?`): `Promise`<`BN`\>

Get the timestamp latest confirmed round stored in the aggregator account.

#### Parameters

| Name          | Type  | Description                                                         |
| :------------ | :---- | :------------------------------------------------------------------ |
| `aggregator?` | `any` | Optional parameter representing the already loaded aggregator info. |

#### Returns

`Promise`<`BN`\>

latest feed timestamp

#### Defined in

[sbv2.ts:703](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L703)

---

### getLatestValue

▸ **getLatestValue**(`aggregator?`, `decimals?`): `Promise`<`Big`\>

Get the latest confirmed value stored in the aggregator account.

#### Parameters

| Name          | Type     | Default value | Description                                                         |
| :------------ | :------- | :------------ | :------------------------------------------------------------------ |
| `aggregator?` | `any`    | `undefined`   | Optional parameter representing the already loaded aggregator info. |
| `decimals`    | `number` | `20`          | -                                                                   |

#### Returns

`Promise`<`Big`\>

latest feed value

#### Defined in

[sbv2.ts:678](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L678)

---

### getOracleIndex

▸ **getOracleIndex**(`oraclePubkey`): `Promise`<`number`\>

#### Parameters

| Name           | Type        |
| :------------- | :---------- |
| `oraclePubkey` | `PublicKey` |

#### Returns

`Promise`<`number`\>

#### Defined in

[sbv2.ts:1151](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1151)

---

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse AggregatorAccount state based on the program IDL.

#### Returns

`Promise`<`any`\>

AggregatorAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:628](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L628)

---

### loadHashes

▸ **loadHashes**(`aggregator?`): `Promise`<`Buffer`[]\>

#### Parameters

| Name          | Type  |
| :------------ | :---- |
| `aggregator?` | `any` |

#### Returns

`Promise`<`Buffer`[]\>

#### Defined in

[sbv2.ts:816](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L816)

---

### loadHistory

▸ **loadHistory**(`aggregator?`): `Promise`<[`AggregatorHistoryRow`](AggregatorHistoryRow.md)[]\>

#### Parameters

| Name          | Type  |
| :------------ | :---- |
| `aggregator?` | `any` |

#### Returns

`Promise`<[`AggregatorHistoryRow`](AggregatorHistoryRow.md)[]\>

#### Defined in

[sbv2.ts:635](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L635)

---

### loadJobs

▸ **loadJobs**(`aggregator?`): `Promise`<`OracleJob`[]\>

Load and deserialize all jobs stored in this aggregator

#### Parameters

| Name          | Type  |
| :------------ | :---- |
| `aggregator?` | `any` |

#### Returns

`Promise<OracleJob[]>`

`Array<OracleJob>`

#### Defined in

[sbv2.ts:797](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L797)

---

### lock

▸ **lock**(`authority?`): `Promise`<`string`\>

Prevent new jobs from being added to the feed.

#### Parameters

| Name         | Type      | Description                   |
| :----------- | :-------- | :---------------------------- |
| `authority?` | `Keypair` | The current authroity keypair |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:1023](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1023)

---

### openRound

▸ **openRound**(`params`): `Promise`<`string`\>

Opens a new round for the aggregator and will provide an incentivize reward
to the caller

#### Parameters

| Name     | Type                                                                      |
| :------- | :------------------------------------------------------------------------ |
| `params` | [`AggregatorOpenRoundParams`](../interfaces/AggregatorOpenRoundParams.md) |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:1090](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1090)

---

### produceJobsHash

▸ **produceJobsHash**(`jobs`): `Hash`

Produces a hash of all the jobs currently in the aggregator

#### Parameters

| Name   | Type          |
| :----- | :------------ |
| `jobs` | `OracleJob`[] |

#### Returns

`Hash`

hash of all the feed jobs.

#### Defined in

[sbv2.ts:783](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L783)

---

### removeJob

▸ **removeJob**(`job`, `authority?`): `Promise`<`string`\>

RPC to remove a job from an aggregtor.

#### Parameters

| Name         | Type                          | Description                                  |
| :----------- | :---------------------------- | :------------------------------------------- |
| `job`        | [`JobAccount`](JobAccount.md) | JobAccount to be removed from the aggregator |
| `authority?` | `Keypair`                     | -                                            |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:1066](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1066)

---

### saveResult

▸ **saveResult**(`aggregator`, `oracleAccount`, `params`): `Promise`<`string`\>

#### Parameters

| Name            | Type                                                                        |
| :-------------- | :-------------------------------------------------------------------------- |
| `aggregator`    | `any`                                                                       |
| `oracleAccount` | [`OracleAccount`](OracleAccount.md)                                         |
| `params`        | [`AggregatorSaveResultParams`](../interfaces/AggregatorSaveResultParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:1161](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1161)

---

### saveResultTxn

▸ **saveResultTxn**(`aggregator`, `oracleAccount`, `params`): `Promise`<`Transaction`\>

RPC for an oracle to save a result to an aggregator round.

#### Parameters

| Name            | Type                                                                        | Description                             |
| :-------------- | :-------------------------------------------------------------------------- | :-------------------------------------- |
| `aggregator`    | `any`                                                                       | -                                       |
| `oracleAccount` | [`OracleAccount`](OracleAccount.md)                                         | The oracle account submitting a result. |
| `params`        | [`AggregatorSaveResultParams`](../interfaces/AggregatorSaveResultParams.md) |                                         |

#### Returns

`Promise`<`Transaction`\>

TransactionSignature

#### Defined in

[sbv2.ts:1177](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1177)

---

### setAuthority

▸ **setAuthority**(`newAuthority`, `currentAuthority?`): `Promise`<`string`\>

Change the aggregator authority.

#### Parameters

| Name                | Type        | Description                   |
| :------------------ | :---------- | :---------------------------- |
| `newAuthority`      | `PublicKey` | The new authority to set.     |
| `currentAuthority?` | `Keypair`   | The current authroity keypair |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:1043](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1043)

---

### setBatchSize

▸ **setBatchSize**(`params`): `Promise`<`string`\>

#### Parameters

| Name     | Type                                                                            |
| :------- | :------------------------------------------------------------------------------ |
| `params` | [`AggregatorSetBatchSizeParams`](../interfaces/AggregatorSetBatchSizeParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:902](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L902)

---

### setHistoryBuffer

▸ **setHistoryBuffer**(`params`): `Promise`<`string`\>

#### Parameters

| Name     | Type                                                                                    |
| :------- | :-------------------------------------------------------------------------------------- |
| `params` | [`AggregatorSetHistoryBufferParams`](../interfaces/AggregatorSetHistoryBufferParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:959](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L959)

---

### setMinJobs

▸ **setMinJobs**(`params`): `Promise`<`string`\>

#### Parameters

| Name     | Type                                                                        |
| :------- | :-------------------------------------------------------------------------- |
| `params` | [`AggregatorSetMinJobsParams`](../interfaces/AggregatorSetMinJobsParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:921](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L921)

---

### setMinOracles

▸ **setMinOracles**(`params`): `Promise`<`string`\>

#### Parameters

| Name     | Type                                                                              |
| :------- | :-------------------------------------------------------------------------------- |
| `params` | [`AggregatorSetMinOraclesParams`](../interfaces/AggregatorSetMinOraclesParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:940](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L940)

---

### size

▸ **size**(): `number`

Get the size of an AggregatorAccount on chain.

#### Returns

`number`

size.

#### Defined in

[sbv2.ts:839](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L839)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`AggregatorAccount`](AggregatorAccount.md)\>

Create and initialize the AggregatorAccount.

#### Parameters

| Name      | Type                                                            | Description                                                    |
| :-------- | :-------------------------------------------------------------- | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                               | Switchboard program representation holding connection and IDL. |
| `params`  | [`AggregatorInitParams`](../interfaces/AggregatorInitParams.md) | -                                                              |

#### Returns

`Promise`<[`AggregatorAccount`](AggregatorAccount.md)\>

newly generated AggregatorAccount.

#### Defined in

[sbv2.ts:849](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L849)

---

### decode

▸ `Static` **decode**(`program`, `accountInfo`): `any`

#### Parameters

| Name          | Type                     |
| :------------ | :----------------------- |
| `program`     | `Program`<`Idl`\>        |
| `accountInfo` | `AccountInfo`<`Buffer`\> |

#### Returns

`any`

#### Defined in

[sbv2.ts:603](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L603)

---

### getName

▸ `Static` **getName**(`aggregator`): `string`

Returns the aggregator's ID buffer in a stringified format.

#### Parameters

| Name         | Type  | Description                    |
| :----------- | :---- | :----------------------------- |
| `aggregator` | `any` | A preloaded aggregator object. |

#### Returns

`string`

The name of the aggregator.

#### Defined in

[sbv2.ts:618](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L618)

---

### shouldReportValue

▸ `Static` **shouldReportValue**(`value`, `aggregator`): `Promise`<`boolean`\>

Speciifies if the aggregator settings recommend reporting a new value

#### Parameters

| Name         | Type  | Description                       |
| :----------- | :---- | :-------------------------------- |
| `value`      | `Big` | The value which we are evaluating |
| `aggregator` | `any` | The loaded aggegator schema       |

#### Returns

`Promise`<`boolean`\>

boolean

#### Defined in

[sbv2.ts:717](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L717)
