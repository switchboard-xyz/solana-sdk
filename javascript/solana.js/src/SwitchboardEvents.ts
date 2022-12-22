import * as anchor from '@project-serum/anchor';
import * as types from './generated';

export type AggregatorAddJobEvent = {
  feedPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
};

export type AggregatorRemoveJobEvent = {
  feedPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
};

export type AggregatorLockEvent = {
  feedPubkey: anchor.web3.PublicKey;
};

export type AggregatorInitEvent = {
  feedPubkey: anchor.web3.PublicKey;
};

export type AggregatorSetAuthorityEvent = {
  feedPubkey: anchor.web3.PublicKey;
  oldAuthority: anchor.web3.PublicKey;
  newAuthority: anchor.web3.PublicKey;
};

export type AggregatorSetConfigsEvent = {
  feedPubkey: anchor.web3.PublicKey;
};

export type PermissionSetEvent = {
  permissionKey: anchor.web3.PublicKey;
  permission: types.SwitchboardPermissionKind;
  enable: boolean;
};

export type VrfRequestRandomnessEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
  loadAmount: anchor.BN;
  existingAmount: anchor.BN;
};

export type VrfRequestEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
};

export type VrfProveEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  authorityPubkey: anchor.web3.PublicKey;
};

export type VrfVerifyEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  authorityPubkey: anchor.web3.PublicKey;
  amount: anchor.BN;
};

export type VrfCallbackPerformedEvent = {
  vrfPubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
  amount: anchor.BN;
};

export type AggregatorOpenRoundEvent = {
  feedPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
  jobPubkeys: anchor.web3.PublicKey[];
  remainingFunds: anchor.BN;
  queueAuthority: anchor.web3.PublicKey;
};

export type AggregatorValueUpdateEvent = {
  feedPubkey: anchor.web3.PublicKey;
  value: types.SwitchboardDecimalFields;
  slot: anchor.BN;
  timestamp: anchor.BN;
  oraclePubkeys: anchor.web3.PublicKey[];
  oracleValues: types.SwitchboardDecimalFields[];
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

export type OracleWithdrawEvent = {
  oraclePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  destinationWallet: anchor.web3.PublicKey;
  previousAmount: anchor.BN;
  newAmount: anchor.BN;
  timestamp: anchor.BN;
};

export type LeaseWithdrawEvent = {
  leasePubkey: anchor.web3.PublicKey;
  walletPubkey: anchor.web3.PublicKey;
  previousAmount: anchor.BN;
  newAmount: anchor.BN;
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

export type LeaseFundEvent = {
  leasePubkey: anchor.web3.PublicKey;
  funder: anchor.web3.PublicKey;
  amount: anchor.BN;
  timestamp: anchor.BN;
};

export type ProbationBrokenEvent = {
  feedPubkey: anchor.web3.PublicKey;
  queuePubkey: anchor.web3.PublicKey;
  timestamp: anchor.BN;
};

export type FeedPermissionRevokedEvent = {
  feedPubkey: anchor.web3.PublicKey;
  timestamp: anchor.BN;
};

export type GarbageCollectFailureEvent = {
  queuePubkey: anchor.web3.PublicKey;
};

export type OracleBootedEvent = {
  queuePubkey: anchor.web3.PublicKey;
  oraclePubkey: anchor.web3.PublicKey;
};

export type CrankLeaseInsufficientFundsEvent = {
  feedPubkey: anchor.web3.PublicKey;
  leasePubkey: anchor.web3.PublicKey;
};

export type CrankPopExpectedFailureEvent = {
  feedPubkey: anchor.web3.PublicKey;
  leasePubkey: anchor.web3.PublicKey;
};

export type BufferRelayerOpenRoundEvent = {
  relayerPubkey: anchor.web3.PublicKey;
  jobPubkey: anchor.web3.PublicKey;
  oraclePubkeys: anchor.web3.PublicKey[];
  remainingFunds: anchor.BN;
  queue: anchor.web3.PublicKey;
};

export type SwitchboardEvents = {
  AggregatorAddJobEvent: AggregatorAddJobEvent;
  AggregatorRemoveJobEvent: AggregatorRemoveJobEvent;
  AggregatorLockEvent: AggregatorLockEvent;
  AggregatorInitEvent: AggregatorInitEvent;
  AggregatorSetAuthorityEvent: AggregatorSetAuthorityEvent;
  AggregatorSetConfigsEvent: AggregatorSetConfigsEvent;
  PermissionSetEvent: PermissionSetEvent;
  VrfRequestRandomnessEvent: VrfRequestRandomnessEvent;
  VrfRequestEvent: VrfRequestEvent;
  VrfProveEvent: VrfProveEvent;
  VrfVerifyEvent: VrfVerifyEvent;
  VrfCallbackPerformedEvent: VrfCallbackPerformedEvent;
  AggregatorOpenRoundEvent: AggregatorOpenRoundEvent;
  AggregatorValueUpdateEvent: AggregatorValueUpdateEvent;
  OracleRewardEvent: OracleRewardEvent;
  OracleWithdrawEvent: OracleWithdrawEvent;
  LeaseWithdrawEvent: LeaseWithdrawEvent;
  OracleSlashEvent: OracleSlashEvent;
  LeaseFundEvent: LeaseFundEvent;
  ProbationBrokenEvent: ProbationBrokenEvent;
  FeedPermissionRevokedEvent: FeedPermissionRevokedEvent;
  GarbageCollectFailureEvent: GarbageCollectFailureEvent;
  OracleBootedEvent: OracleBootedEvent;
  AggregatorCrankEvictionEvent: {};
  CrankLeaseInsufficientFundsEvent: CrankLeaseInsufficientFundsEvent;
  CrankPopExpectedFailureEvent: CrankPopExpectedFailureEvent;
  BufferRelayerOpenRoundEvent: BufferRelayerOpenRoundEvent;
};
