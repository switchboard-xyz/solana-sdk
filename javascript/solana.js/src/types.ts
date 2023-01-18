import { OracleJob } from '@switchboard-xyz/common';
import {
  AggregatorAccount,
  BufferRelayerAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleAccount,
  PermissionAccount,
  ProgramStateAccount,
  QueueAccount,
  SwitchboardAccount,
  SwitchboardAccountData,
  VrfAccount,
} from './accounts';
import {
  AggregatorAccountData,
  BufferRelayerAccountData,
  CrankAccountData,
  JobAccountData,
  LeaseAccountData,
  OracleAccountData,
  OracleQueueAccountData,
  PermissionAccountData,
  SbState,
  VrfAccountData,
} from './generated';

export interface AccountDefinition<T extends SwitchboardAccount> {
  account: T;
}

export interface PdaAccountDefinition<T extends SwitchboardAccount> {
  account: T;
  bump: number;
}

export interface LoadedAccountDefinition<
  T extends SwitchboardAccount,
  U extends SwitchboardAccountData
> extends AccountDefinition<T> {
  state: U;
}

export interface LoadedPdaAccountDefinition<
  T extends SwitchboardAccount,
  U extends SwitchboardAccountData
> extends PdaAccountDefinition<T> {
  state: U;
}

export type ProgramStateDefinition = PdaAccountDefinition<ProgramStateAccount>;
export type QueueDefinition = AccountDefinition<QueueAccount>;
export type CrankDefinition = AccountDefinition<CrankAccount>;
export type PermissionDefinition = PdaAccountDefinition<PermissionAccount>;
export type LeaseDefinition = PdaAccountDefinition<LeaseAccount>;
export type OracleDefinition = AccountDefinition<OracleAccount> & {
  permission: PermissionDefinition;
};
export type AggregatorDefinition = AccountDefinition<AggregatorAccount> & {
  permission: PermissionDefinition;
  lease: LeaseDefinition;
};
export type VrfDefinition = AccountDefinition<VrfAccount> & {
  permission: PdaAccountDefinition<PermissionAccount>;
};
export type BufferRelayerDefinition =
  AccountDefinition<BufferRelayerAccount> & {
    permission: PdaAccountDefinition<PermissionAccount>;
  };

export type LoadedProgramStateDefinition = LoadedPdaAccountDefinition<
  ProgramStateAccount,
  SbState
>;
export type LoadedQueueDefinition = LoadedAccountDefinition<
  QueueAccount,
  OracleQueueAccountData
>;
export type LoadedCrankDefinition = LoadedAccountDefinition<
  CrankAccount,
  CrankAccountData
>;
export type LoadedPermissionDefinition = LoadedPdaAccountDefinition<
  PermissionAccount,
  PermissionAccountData
>;
export type LoadedLeaseDefinition = LoadedPdaAccountDefinition<
  LeaseAccount,
  LeaseAccountData
>;
export type LoadedOracleDefinition = LoadedAccountDefinition<
  OracleAccount,
  OracleAccountData
> & {
  permission: LoadedPermissionDefinition;
};
export type LoadedAggregatorDefinition = LoadedAccountDefinition<
  AggregatorAccount,
  AggregatorAccountData
> & {
  permission: LoadedPermissionDefinition;
  lease: LoadedLeaseDefinition;
};
export type LoadedVrfDefinition = LoadedAccountDefinition<
  VrfAccount,
  VrfAccountData
> & {
  permission: LoadedPermissionDefinition;
};
export type LoadedBufferRelayerDefinition = LoadedAccountDefinition<
  BufferRelayerAccount,
  BufferRelayerAccountData
> & {
  permission: LoadedPermissionDefinition;
};
export type LoadedJobDefinition = LoadedAccountDefinition<
  JobAccount,
  JobAccountData
> & {
  job: OracleJob;
};
