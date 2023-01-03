import * as anchor from '@project-serum/anchor';
import * as types from './generated';

export type AggregatorAddJobEvent = {
  feedPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
};

export type AggregatorCrankEvictionEvent = {
  crankPubkey: anchor.web3.PublicKey;
  aggregatorPubkey: anchor.web3.PublicKey;
  reason?: number;
  timestamp: anchor.BN;
};

export type AggregatorInitEvent = {
  feedPubkey: anchor.web3.PublicKey;
};

export type AggregatorLockEvent = {
  feedPubkey: anchor.web3.PublicKey;
};

export type AggregatorOpenRoundEvent = {
  feedPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
  jobPubkeys: anchor.web3.PublicKey[];
  remainingFunds: anchor.BN;
  queueAuthority: anchor.web3.PublicKey;
};

export type AggregatorRemoveJobEvent = {
  feedPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
};

export type AggregatorSaveResultEvent = {
  feedPubkey: anchor.web3.PublicKey;
  value: types.BorshDecimal;
  slot: anchor.BN;
  timestamp: anchor.BN;
  oraclePubkey: anchor.web3.PublicKey;
  jobValues: Array<types.BorshDecimal>;
};

export type AggregatorSetAuthorityEvent = {
  feedPubkey: anchor.web3.PublicKey;
  oldAuthority: anchor.web3.PublicKey;
  newAuthority: anchor.web3.PublicKey;
};

export type AggregatorSetConfigsEvent = {
  feedPubkey: anchor.web3.PublicKey;
};

export type AggregatorValueUpdateEvent = {
  feedPubkey: anchor.web3.PublicKey;
  value: types.SwitchboardDecimalFields;
  slot: anchor.BN;
  timestamp: anchor.BN;
  oraclePubkeys: anchor.web3.PublicKey[];
  oracleValues: types.SwitchboardDecimalFields[];
};

export type BufferRelayerOpenRoundEvent = {
  relayerPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
  remainingFunds: anchor.BN;
  queue: anchor.web3.PublicKey;
};

export type CrankLeaseInsufficientFundsEvent = {
  feedPubkey: anchor.web3.PublicKey;
  leasePubkey: anchor.web3.PublicKey;
};

export type CrankPopExpectedFailureEvent = {
  feedPubkey: anchor.web3.PublicKey;
  leasePubkey: anchor.web3.PublicKey;
};

export type FeedPermissionRevokedEvent = {
  feedPubkey: anchor.web3.PublicKey;
  timestamp: anchor.BN;
};

export type GarbageCollectFailureEvent = {
  queuePubkey: anchor.web3.PublicKey;
};

export type LeaseFundEvent = {
  leasePubkey: anchor.web3.PublicKey;
  funder: anchor.web3.PublicKey;
  amount: anchor.BN;
  timestamp: anchor.BN;
};

export type LeaseWithdrawEvent = {
  leasePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  previousAmount: anchor.BN;
  newAmount: anchor.BN;
  timestamp: anchor.BN;
};

export type OracleBootedEvent = {
  queuePubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
};

export type OracleRewardEvent = {
  feedPubkey: anchor.web3.PublicKey;
  leasePubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  amount: anchor.BN;
  roundSlot: anchor.BN;
  timestamp: anchor.BN;
};

export type OracleSlashEvent = {
  feedPubkey: anchor.web3.PublicKey;
  leasePubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  amount: anchor.BN;
  roundSlot: anchor.BN;
  timestamp: anchor.BN;
};

export type OracleWithdrawEvent = {
  oraclePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  destinationWallet: anchor.web3.PublicKey;
  previousAmount: anchor.BN;
  newAmount: anchor.BN;
  timestamp: anchor.BN;
};

export type PermissionSetEvent = {
  permissionKey: anchor.web3.PublicKey;
  permission: types.SwitchboardPermissionKind;
  enable: boolean;
};

export type PriorityFeeReimburseEvent = {
  feedPubkey: anchor.web3.PublicKey;
  slot: anchor.BN;
  timestamp: anchor.BN;
  fee: anchor.BN;
};

export type ProbationBrokenEvent = {
  feedPubkey: anchor.web3.PublicKey;
  queuePubkey: anchor.web3.PublicKey;
  timestamp: anchor.BN;
};

export type VrfCallbackPerformedEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  amount: anchor.BN;
};

export type VrfProveEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  authorityPubkey: anchor.web3.PublicKey;
};

export type VrfRequestEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
};

export type VrfRequestRandomnessEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
  loadAmount: anchor.BN;
  existingAmount: anchor.BN;
  alpha: Buffer;
  counter: anchor.BN;
};

export type VrfVerifyEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  authorityPubkey: anchor.web3.PublicKey;
  amount: anchor.BN;
};

export type SwitchboardEvents = {
  AggregatorAddJobEvent: AggregatorAddJobEvent;
  AggregatorCrankEvictionEvent: AggregatorCrankEvictionEvent;
  AggregatorInitEvent: AggregatorInitEvent;
  AggregatorLockEvent: AggregatorLockEvent;
  AggregatorOpenRoundEvent: AggregatorOpenRoundEvent;
  AggregatorRemoveJobEvent: AggregatorRemoveJobEvent;
  AggregatorSaveResultEvent: AggregatorSaveResultEvent;
  AggregatorSetAuthorityEvent: AggregatorSetAuthorityEvent;
  AggregatorSetConfigsEvent: AggregatorSetConfigsEvent;
  AggregatorValueUpdateEvent: AggregatorValueUpdateEvent;

  BufferRelayerOpenRoundEvent: BufferRelayerOpenRoundEvent;

  CrankLeaseInsufficientFundsEvent: CrankLeaseInsufficientFundsEvent;
  CrankPopExpectedFailureEvent: CrankPopExpectedFailureEvent;

  FeedPermissionRevokedEvent: FeedPermissionRevokedEvent;

  GarbageCollectFailureEvent: GarbageCollectFailureEvent;

  LeaseFundEvent: LeaseFundEvent;
  LeaseWithdrawEvent: LeaseWithdrawEvent;

  OracleBootedEvent: OracleBootedEvent;
  OracleRewardEvent: OracleRewardEvent;
  OracleSlashEvent: OracleSlashEvent;
  OracleWithdrawEvent: OracleWithdrawEvent;

  PermissionSetEvent: PermissionSetEvent;

  PriorityFeeReimburseEvent: PriorityFeeReimburseEvent;

  ProbationBrokenEvent: ProbationBrokenEvent;

  VrfCallbackPerformedEvent: VrfCallbackPerformedEvent;
  VrfProveEvent: VrfProveEvent;
  VrfRequestEvent: VrfRequestEvent;
  VrfRequestRandomnessEvent: VrfRequestRandomnessEvent;
  VrfVerifyEvent: VrfVerifyEvent;
};
