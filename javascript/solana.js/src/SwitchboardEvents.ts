import type * as types from "./generated/index.js";

import type * as anchor from "@coral-xyz/anchor";
import type { BN } from "@switchboard-xyz/common";

export type AggregatorAddJobEvent = {
  feedPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
};

export type AggregatorCrankEvictionEvent = {
  crankPubkey: anchor.web3.PublicKey;
  aggregatorPubkey: anchor.web3.PublicKey;
  reason?: number;
  timestamp: BN;
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
  remainingFunds: BN;
  queueAuthority: anchor.web3.PublicKey;
};

export type AggregatorRemoveJobEvent = {
  feedPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
};

export type AggregatorSaveResultEvent = {
  feedPubkey: anchor.web3.PublicKey;
  value: types.BorshDecimal;
  slot: BN;
  timestamp: BN;
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
  slot: BN;
  timestamp: BN;
  oraclePubkeys: anchor.web3.PublicKey[];
  oracleValues: types.SwitchboardDecimalFields[];
};

export type BufferRelayerOpenRoundEvent = {
  relayerPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
  remainingFunds: BN;
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
  timestamp: BN;
};

export type GarbageCollectFailureEvent = {
  queuePubkey: anchor.web3.PublicKey;
};

export type LeaseFundEvent = {
  leasePubkey: anchor.web3.PublicKey;
  funder: anchor.web3.PublicKey;
  amount: BN;
  timestamp: BN;
};

export type LeaseWithdrawEvent = {
  leasePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  previousAmount: BN;
  newAmount: BN;
  timestamp: BN;
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
  amount: BN;
  roundSlot: BN;
  timestamp: BN;
};

export type OracleSlashEvent = {
  feedPubkey: anchor.web3.PublicKey;
  leasePubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  amount: BN;
  roundSlot: BN;
  timestamp: BN;
};

export type OracleWithdrawEvent = {
  oraclePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  destinationWallet: anchor.web3.PublicKey;
  previousAmount: BN;
  newAmount: BN;
  timestamp: BN;
};

export type PermissionSetEvent = {
  permissionKey: anchor.web3.PublicKey;
  permission: types.SwitchboardPermissionKind;
  enable: boolean;
};

export type PriorityFeeReimburseEvent = {
  feedPubkey: anchor.web3.PublicKey;
  slot: BN;
  timestamp: BN;
  fee: BN;
};

export type ProbationBrokenEvent = {
  feedPubkey: anchor.web3.PublicKey;
  queuePubkey: anchor.web3.PublicKey;
  timestamp: BN;
};

export type VrfCallbackPerformedEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  amount: BN;
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
  loadAmount: BN;
  existingAmount: BN;
  alpha: Buffer;
  counter: BN;
};

export type VrfVerifyEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  authorityPubkey: anchor.web3.PublicKey;
  amount: BN;
};

export type VrfPoolUpdateEvent = {
  queuePubkey: anchor.web3.PublicKey;
  vrfPoolPubkey: anchor.web3.PublicKey;
  vrfPubkey: anchor.web3.PublicKey;
  newSize: number;
  minInterval: number;
};

export type VrfPoolRequestEvent = {
  queuePubkey: anchor.web3.PublicKey;
  vrfPoolPubkey: anchor.web3.PublicKey;
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  slot: BN;
  timestamp: BN;
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

  VrfPoolUpdateEvent: VrfPoolUpdateEvent;
  VrfPoolRequestEvent: VrfPoolRequestEvent;
};
