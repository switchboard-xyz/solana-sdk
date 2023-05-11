import * as FunctionStatus from './FunctionStatus';
import * as SwitchboardPermission from './SwitchboardPermission';
import * as VerificationStatus from './VerificationStatus';

export type {
  FunctionFundParamsFields,
  FunctionFundParamsJSON,
} from './FunctionFundParams';
export { FunctionFundParams } from './FunctionFundParams';
export type {
  FunctionInitParamsFields,
  FunctionInitParamsJSON,
} from './FunctionInitParams';
export { FunctionInitParams } from './FunctionInitParams';
export type {
  FunctionVerifyParamsFields,
  FunctionVerifyParamsJSON,
} from './FunctionVerifyParams';
export { FunctionVerifyParams } from './FunctionVerifyParams';
export type {
  FunctionWithdrawParamsFields,
  FunctionWithdrawParamsJSON,
} from './FunctionWithdrawParams';
export { FunctionWithdrawParams } from './FunctionWithdrawParams';
export type {
  PermissionInitParamsFields,
  PermissionInitParamsJSON,
} from './PermissionInitParams';
export { PermissionInitParams } from './PermissionInitParams';
export type {
  PermissionSetParamsFields,
  PermissionSetParamsJSON,
} from './PermissionSetParams';
export { PermissionSetParams } from './PermissionSetParams';
export type {
  QueueAddMrEnclaveParamsFields,
  QueueAddMrEnclaveParamsJSON,
} from './QueueAddMrEnclaveParams';
export { QueueAddMrEnclaveParams } from './QueueAddMrEnclaveParams';
export type {
  QueueInitParamsFields,
  QueueInitParamsJSON,
} from './QueueInitParams';
export { QueueInitParams } from './QueueInitParams';
export type {
  QueueRemoveMrEnclaveParamsFields,
  QueueRemoveMrEnclaveParamsJSON,
} from './QueueRemoveMrEnclaveParams';
export { QueueRemoveMrEnclaveParams } from './QueueRemoveMrEnclaveParams';
export type {
  QuoteHeartbeatParamsFields,
  QuoteHeartbeatParamsJSON,
} from './QuoteHeartbeatParams';
export { QuoteHeartbeatParams } from './QuoteHeartbeatParams';
export type {
  QuoteInitParamsFields,
  QuoteInitParamsJSON,
} from './QuoteInitParams';
export { QuoteInitParams } from './QuoteInitParams';
export type {
  QuoteVerifyParamsFields,
  QuoteVerifyParamsJSON,
} from './QuoteVerifyParams';
export { QuoteVerifyParams } from './QuoteVerifyParams';
export type {
  StateInitParamsFields,
  StateInitParamsJSON,
} from './StateInitParams';
export { StateInitParams } from './StateInitParams';
export { FunctionStatus };

export type FunctionStatusKind =
  | FunctionStatus.None
  | FunctionStatus.Active
  | FunctionStatus.NonExecutable
  | FunctionStatus.Expired
  | FunctionStatus.OutOfFunds
  | FunctionStatus.InvalidPermissions;
export type FunctionStatusJSON =
  | FunctionStatus.NoneJSON
  | FunctionStatus.ActiveJSON
  | FunctionStatus.NonExecutableJSON
  | FunctionStatus.ExpiredJSON
  | FunctionStatus.OutOfFundsJSON
  | FunctionStatus.InvalidPermissionsJSON;

export { VerificationStatus };

export type VerificationStatusKind =
  | VerificationStatus.None
  | VerificationStatus.VerificationPending
  | VerificationStatus.VerificationFailure
  | VerificationStatus.VerificationSuccess
  | VerificationStatus.VerificationOverride;
export type VerificationStatusJSON =
  | VerificationStatus.NoneJSON
  | VerificationStatus.VerificationPendingJSON
  | VerificationStatus.VerificationFailureJSON
  | VerificationStatus.VerificationSuccessJSON
  | VerificationStatus.VerificationOverrideJSON;

export { SwitchboardPermission };

export type SwitchboardPermissionKind =
  | SwitchboardPermission.PermitNodeheartbeat
  | SwitchboardPermission.PermitQueueUsage;
export type SwitchboardPermissionJSON =
  | SwitchboardPermission.PermitNodeheartbeatJSON
  | SwitchboardPermission.PermitQueueUsageJSON;
