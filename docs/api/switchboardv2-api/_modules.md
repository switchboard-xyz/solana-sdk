## Table of contents

### Enumerations

- [SwitchboardPermission](enums/SwitchboardPermission.md)
- [SwitchboardPermissionValue](enums/SwitchboardPermissionValue.md)

### Classes

- [AggregatorAccount](classes/AggregatorAccount.md)
- [AggregatorHistoryRow](classes/AggregatorHistoryRow.md)
- [CrankAccount](classes/CrankAccount.md)
- [CrankRow](classes/CrankRow.md)
- [JobAccount](classes/JobAccount.md)
- [LeaseAccount](classes/LeaseAccount.md)
- [OracleAccount](classes/OracleAccount.md)
- [OracleQueueAccount](classes/OracleQueueAccount.md)
- [PermissionAccount](classes/PermissionAccount.md)
- [ProgramStateAccount](classes/ProgramStateAccount.md)
- [SwitchboardDecimal](classes/SwitchboardDecimal.md)
- [SwitchboardError](classes/SwitchboardError.md)
- [VrfAccount](classes/VrfAccount.md)

### Interfaces

- [AccountParams](interfaces/AccountParams.md)
- [AggregatorInitParams](interfaces/AggregatorInitParams.md)
- [AggregatorOpenRoundParams](interfaces/AggregatorOpenRoundParams.md)
- [AggregatorSaveResultParams](interfaces/AggregatorSaveResultParams.md)
- [AggregatorSetBatchSizeParams](interfaces/AggregatorSetBatchSizeParams.md)
- [AggregatorSetHistoryBufferParams](interfaces/AggregatorSetHistoryBufferParams.md)
- [AggregatorSetMinJobsParams](interfaces/AggregatorSetMinJobsParams.md)
- [AggregatorSetMinOraclesParams](interfaces/AggregatorSetMinOraclesParams.md)
- [Callback](interfaces/Callback.md)
- [CrankInitParams](interfaces/CrankInitParams.md)
- [CrankPopParams](interfaces/CrankPopParams.md)
- [CrankPushParams](interfaces/CrankPushParams.md)
- [JobInitParams](interfaces/JobInitParams.md)
- [LeaseExtendParams](interfaces/LeaseExtendParams.md)
- [LeaseInitParams](interfaces/LeaseInitParams.md)
- [LeaseWithdrawParams](interfaces/LeaseWithdrawParams.md)
- [OracleInitParams](interfaces/OracleInitParams.md)
- [OracleQueueInitParams](interfaces/OracleQueueInitParams.md)
- [OracleQueueSetRewardsParams](interfaces/OracleQueueSetRewardsParams.md)
- [OracleQueueSetVrfSettingsParams](interfaces/OracleQueueSetVrfSettingsParams.md)
- [OracleWithdrawParams](interfaces/OracleWithdrawParams.md)
- [PermissionInitParams](interfaces/PermissionInitParams.md)
- [PermissionSetParams](interfaces/PermissionSetParams.md)
- [ProgramInitParams](interfaces/ProgramInitParams.md)
- [VaultTransferParams](interfaces/VaultTransferParams.md)
- [VrfInitParams](interfaces/VrfInitParams.md)
- [VrfProveAndVerifyParams](interfaces/VrfProveAndVerifyParams.md)
- [VrfProveParams](interfaces/VrfProveParams.md)
- [VrfRequestRandomnessParams](interfaces/VrfRequestRandomnessParams.md)
- [VrfSetCallbackParams](interfaces/VrfSetCallbackParams.md)

### Variables

- [SBV2_DEVNET_PID](modules.md#sbv2_devnet_pid)
- [SBV2_MAINNET_PID](modules.md#sbv2_mainnet_pid)

### Functions

- [getPayer](modules.md#getpayer)
- [packInstructions](modules.md#packinstructions)
- [packTransactions](modules.md#packtransactions)
- [signTransactions](modules.md#signtransactions)

## Variables

### SBV2_DEVNET_PID

• **SBV2_DEVNET_PID**: `PublicKey`

#### Defined in

[sbv2.ts:22](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L22)

---

### SBV2_MAINNET_PID

• **SBV2_MAINNET_PID**: `PublicKey`

#### Defined in

[sbv2.ts:25](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L25)

## Functions

### getPayer

▸ **getPayer**(`program`): `Keypair`

#### Parameters

| Name      | Type              |
| :-------- | :---------------- |
| `program` | `Program`<`Idl`\> |

#### Returns

`Keypair`

#### Defined in

[sbv2.ts:3464](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3464)

---

### packInstructions

▸ **packInstructions**(`instructions`, `feePayer?`, `recentBlockhash?`): `Transaction`[]

Pack instructions into transactions as tightly as possible

#### Parameters

| Name              | Type                       | Default value       | Description                                 |
| :---------------- | :------------------------- | :------------------ | :------------------------------------------ |
| `instructions`    | `TransactionInstruction`[] | `undefined`         | Instructions to pack down into transactions |
| `feePayer`        | `PublicKey`                | `PublicKey.default` | Optional feepayer                           |
| `recentBlockhash` | `string`                   | `undefined`         | Optional blockhash                          |

#### Returns

`Transaction`[]

Transaction[]

#### Defined in

[sbv2.ts:3477](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3477)

---

### packTransactions

▸ **packTransactions**(`connection`, `transactions`, `signers`, `feePayer`): `Promise`<`Transaction`[]\>

Repack Transactions and sign them

#### Parameters

| Name           | Type            | Description                  |
| :------------- | :-------------- | :--------------------------- |
| `connection`   | `Connection`    | Web3.js Connection           |
| `transactions` | `Transaction`[] | Transactions to repack       |
| `signers`      | `Keypair`[]     | Signers for each transaction |
| `feePayer`     | `PublicKey`     | -                            |

#### Returns

`Promise`<`Transaction`[]\>

#### Defined in

[sbv2.ts:3544](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3544)

---

### signTransactions

▸ **signTransactions**(`transactions`, `signers`): `Transaction`[]

Sign transactions with correct signers

#### Parameters

| Name           | Type            | Description                                              |
| :------------- | :-------------- | :------------------------------------------------------- |
| `transactions` | `Transaction`[] | array of transactions to sign                            |
| `signers`      | `Keypair`[]     | array of keypairs to sign the array of transactions with |

#### Returns

`Transaction`[]

transactions signed

#### Defined in

[sbv2.ts:3565](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3565)
