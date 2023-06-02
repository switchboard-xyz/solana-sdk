import * as FunctionStatus from "./FunctionStatus.js";
import * as SwitchboardAttestationPermission from "./SwitchboardAttestationPermission.js";
import * as VerificationStatus from "./VerificationStatus.js";

export type {
  AttestationPermissionInitParamsFields,
  AttestationPermissionInitParamsJSON,
} from "./AttestationPermissionInitParams.js";
export { AttestationPermissionInitParams } from "./AttestationPermissionInitParams.js";
export type {
  AttestationPermissionSetParamsFields,
  AttestationPermissionSetParamsJSON,
} from "./AttestationPermissionSetParams.js";
export { AttestationPermissionSetParams } from "./AttestationPermissionSetParams.js";
export type {
  AttestationQueueAddMrEnclaveParamsFields,
  AttestationQueueAddMrEnclaveParamsJSON,
} from "./AttestationQueueAddMrEnclaveParams.js";
export { AttestationQueueAddMrEnclaveParams } from "./AttestationQueueAddMrEnclaveParams.js";
export type {
  AttestationQueueInitParamsFields,
  AttestationQueueInitParamsJSON,
} from "./AttestationQueueInitParams.js";
export { AttestationQueueInitParams } from "./AttestationQueueInitParams.js";
export type {
  AttestationQueueRemoveMrEnclaveParamsFields,
  AttestationQueueRemoveMrEnclaveParamsJSON,
} from "./AttestationQueueRemoveMrEnclaveParams.js";
export { AttestationQueueRemoveMrEnclaveParams } from "./AttestationQueueRemoveMrEnclaveParams.js";
export type {
  FunctionFundParamsFields,
  FunctionFundParamsJSON,
} from "./FunctionFundParams.js";
export { FunctionFundParams } from "./FunctionFundParams.js";
export type {
  FunctionInitParamsFields,
  FunctionInitParamsJSON,
} from "./FunctionInitParams.js";
export { FunctionInitParams } from "./FunctionInitParams.js";
export type {
  FunctionVerifyParamsFields,
  FunctionVerifyParamsJSON,
} from "./FunctionVerifyParams.js";
export { FunctionVerifyParams } from "./FunctionVerifyParams.js";
export type {
  FunctionWithdrawParamsFields,
  FunctionWithdrawParamsJSON,
} from "./FunctionWithdrawParams.js";
export { FunctionWithdrawParams } from "./FunctionWithdrawParams.js";
export type {
  QuoteHeartbeatParamsFields,
  QuoteHeartbeatParamsJSON,
} from "./QuoteHeartbeatParams.js";
export { QuoteHeartbeatParams } from "./QuoteHeartbeatParams.js";
export type {
  QuoteInitParamsFields,
  QuoteInitParamsJSON,
} from "./QuoteInitParams.js";
export { QuoteInitParams } from "./QuoteInitParams.js";
export type {
  QuoteVerifyParamsFields,
  QuoteVerifyParamsJSON,
} from "./QuoteVerifyParams.js";
export { QuoteVerifyParams } from "./QuoteVerifyParams.js";
export type {
  StateInitParamsFields,
  StateInitParamsJSON,
} from "./StateInitParams.js";
export { StateInitParams } from "./StateInitParams.js";
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

export { SwitchboardAttestationPermission };

export type SwitchboardAttestationPermissionKind =
  | SwitchboardAttestationPermission.PermitNodeheartbeat
  | SwitchboardAttestationPermission.PermitQueueUsage;
export type SwitchboardAttestationPermissionJSON =
  | SwitchboardAttestationPermission.PermitNodeheartbeatJSON
  | SwitchboardAttestationPermission.PermitQueueUsageJSON;
