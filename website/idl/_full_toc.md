- [Accounts](/program/accounts/)
  - [AggregatorAccountData](/idl/accounts/AggregatorAccountData)
  - [CrankAccountData](/idl/accounts/CrankAccountData)
  - [JobAccountData](/idl/accounts/JobAccountData)
  - [LeaseAccountData](/idl/accounts/LeaseAccountData)
  - [OracleAccountData](/idl/accounts/OracleAccountData)
  - [OracleQueueAccountData](/idl/accounts/OracleQueueAccountData)
  - [PermissionAccountData](/idl/accounts/PermissionAccountData)
  - [SbState](/idl/accounts/SbState)
  - [VrfAccountData](/idl/accounts/VrfAccountData)
- [Instructions](/program/instructions)
  - [aggregatorAddJob](/idl/instructions/aggregatorAddJob)
  - [aggregatorInit](/idl/instructions/aggregatorInit)
  - [aggregatorLock](/idl/instructions/aggregatorLock)
  - [aggregatorOpenRound](/idl/instructions/aggregatorOpenRound)
  - [aggregatorRemoveJob](/idl/instructions/aggregatorRemoveJob)
  - [aggregatorSaveResult](/idl/instructions/aggregatorSaveResult)
  - [aggregatorSetAuthority](/idl/instructions/aggregatorSetAuthority)
  - [aggregatorSetBatchSize](/idl/instructions/aggregatorSetBatchSize)
  - [aggregatorSetHistoryBuffer](/idl/instructions/aggregatorSetHistoryBuffer)
  - [aggregatorSetMinJobs](/idl/instructions/aggregatorSetMinJobs)
  - [aggregatorSetMinOracles](/idl/instructions/aggregatorSetMinOracles)
  - [aggregatorSetQueue](/idl/instructions/aggregatorSetQueue)
  - [aggregatorSetUpdateInterval](/idl/instructions/aggregatorSetUpdateInterval)
  - [aggregatorSetVarianceThreshold](/idl/instructions/aggregatorSetVarianceThreshold)
  - [crankInit](/idl/instructions/crankInit)
  - [crankPop](/idl/instructions/crankPop)
  - [crankPush](/idl/instructions/crankPush)
  - [jobInit](/idl/instructions/jobInit)
  - [leaseExtend](/idl/instructions/leaseExtend)
  - [leaseInit](/idl/instructions/leaseInit)
  - [leaseSetAuthority](/idl/instructions/leaseSetAuthority)
  - [leaseWithdraw](/idl/instructions/leaseWithdraw)
  - [oracleHeartbeat](/idl/instructions/oracleHeartbeat)
  - [oracleInit](/idl/instructions/oracleInit)
  - [oracleQueueInit](/idl/instructions/oracleQueueInit)
  - [oracleQueueSetRewards](/idl/instructions/oracleQueueSetRewards)
  - [oracleQueueVrfConfig](/idl/instructions/oracleQueueVrfConfig)
  - [oracleWithdraw](/idl/instructions/oracleWithdraw)
  - [permissionInit](/idl/instructions/permissionInit)
  - [permissionSet](/idl/instructions/permissionSet)
  - [programConfig](/idl/instructions/programConfig)
  - [programInit](/idl/instructions/programInit)
  - [vaultTransfer](/idl/instructions/vaultTransfer)
  - [vrfInit](/idl/instructions/vrfInit)
  - [vrfProve](/idl/instructions/vrfProve)
  - [vrfProveAndVerify](/idl/instructions/vrfProveAndVerify)
  - [vrfRequestRandomness](/idl/instructions/vrfRequestRandomness)
  - [vrfVerify](/idl/instructions/vrfVerify)
- [Events](/program/events)
  - [AggregatorInitEvent](/idl/events/AggregatorInitEvent)
  - [AggregatorOpenRoundEvent](/idl/events/AggregatorOpenRoundEvent)
  - [AggregatorValueUpdateEvent](/idl/events/AggregatorValueUpdateEvent)
  - [CrankLeaseInsufficientFundsEvent](/idl/events/CrankLeaseInsufficientFundsEvent)
  - [CrankPopExpectedFailureEvent](/idl/events/CrankPopExpectedFailureEvent)
  - [FeedPermissionRevokedEvent](/idl/events/FeedPermissionRevokedEvent)
  - [GarbageCollectFailureEvent](/idl/events/GarbageCollectFailureEvent)
  - [LeaseFundEvent](/idl/events/LeaseFundEvent)
  - [LeaseWithdrawEvent](/idl/events/LeaseWithdrawEvent)
  - [OracleBootedEvent](/idl/events/OracleBootedEvent)
  - [OracleRewardEvent](/idl/events/OracleRewardEvent)
  - [OracleSlashEvent](/idl/events/OracleSlashEvent)
  - [OracleWithdrawEvent](/idl/events/OracleWithdrawEvent)
  - [ProbationBrokenEvent](/idl/events/ProbationBrokenEvent)
  - [VrfCallbackPerformedEvent](/idl/events/VrfCallbackPerformedEvent)
  - [VrfProveEvent](/idl/events/VrfProveEvent)
  - [VrfRequestEvent](/idl/events/VrfRequestEvent)
  - [VrfRequestRandomnessEvent](/idl/events/VrfRequestRandomnessEvent)
  - [VrfVerifyEvent](/idl/events/VrfVerifyEvent)
- [Types](/program/types)
  - [AccountMetaBorsh](/idl/types/AccountMetaBorsh)
  - [AccountMetaZC](/idl/types/AccountMetaZC)
  - AggregatorAddJobParams
  - [AggregatorHistoryRow](/idl/types/AggregatorHistoryRow)
  - AggregatorInitParams
  - AggregatorLockParams
  - AggregatorOpenRoundParams
  - AggregatorRemoveJobParams
  - [AggregatorRound](/idl/types/AggregatorRound)
  - AggregatorSaveResultParams
  - AggregatorSetAuthorityParams
  - AggregatorSetBatchSizeParams
  - AggregatorSetHistoryBufferParams
  - AggregatorSetMinJobsParams
  - AggregatorSetMinOraclesParams
  - AggregatorSetQueueParams
  - AggregatorSetUpdateIntervalParams
  - AggregatorSetVarianceThresholdParams
  - [BorshDecimal](/idl/types/BorshDecimal)
  - [Callback](/idl/types/Callback)
  - [CallbackZC](/idl/types/CallbackZC)
  - [CompletedPointZC](/idl/types/CompletedPointZC)
  - CrankInitParams
  - CrankPopParams
  - CrankPushParams
  - [CrankRow](/idl/types/CrankRow)
  - [EcvrfIntermediate](/idl/types/EcvrfIntermediate)
  - [EcvrfProofZC](/idl/types/EcvrfProofZC)
  - [EdwardsPointZC](/idl/types/EdwardsPointZC)
  - [Error](/idl/types/Error)
  - [FieldElementZC](/idl/types/FieldElementZC)
  - [Hash](/idl/types/Hash)
  - JobInitParams
  - [Lanes](/idl/types/Lanes)
  - [Lanes](/idl/types/Lanes)
  - LeaseExtendParams
  - LeaseInitParams
  - LeaseSetAuthorityParams
  - LeaseWithdrawParams
  - OracleHeartbeatParams
  - OracleInitParams
  - [OracleMetrics](/idl/types/OracleMetrics)
  - OracleQueueInitParams
  - OracleQueueSetRewardsParams
  - OracleQueueVrfConfigParams
  - [OracleResponseType](/idl/types/OracleResponseType)
  - OracleWithdrawParams
  - PermissionInitParams
  - PermissionSetParams
  - ProgramConfigParams
  - ProgramInitParams
  - [ProjectivePointZC](/idl/types/ProjectivePointZC)
  - [Scalar](/idl/types/Scalar)
  - [Shuffle](/idl/types/Shuffle)
  - [Shuffle](/idl/types/Shuffle)
  - [SwitchboardDecimal](/idl/types/SwitchboardDecimal)
  - [SwitchboardPermission](/idl/types/SwitchboardPermission)
  - VaultTransferParams
  - [VrfBuilder](/idl/types/VrfBuilder)
  - VrfInitParams
  - VrfProveAndVerifyParams
  - VrfProveParams
  - VrfRequestRandomnessParams
  - [VrfRound](/idl/types/VrfRound)
  - [VrfStatus](/idl/types/VrfStatus)
  - VrfVerifyParams
- [Errors](/program/errors)