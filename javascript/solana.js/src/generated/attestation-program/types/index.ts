import * as FunctionStatus from "./FunctionStatus.js";
import * as FundingStatus from "./FundingStatus.js";
import * as RequestStatus from "./RequestStatus.js";
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
  FunctionCloseParamsFields,
  FunctionCloseParamsJSON,
} from "./FunctionCloseParams.js";
export { FunctionCloseParams } from "./FunctionCloseParams.js";
export type {
  FunctionExtendLookupParamsFields,
  FunctionExtendLookupParamsJSON,
} from "./FunctionExtendLookupParams.js";
export { FunctionExtendLookupParams } from "./FunctionExtendLookupParams.js";
export type {
  FunctionInitParamsFields,
  FunctionInitParamsJSON,
} from "./FunctionInitParams.js";
export { FunctionInitParams } from "./FunctionInitParams.js";
export type {
  FunctionRequestCloseParamsFields,
  FunctionRequestCloseParamsJSON,
} from "./FunctionRequestCloseParams.js";
export { FunctionRequestCloseParams } from "./FunctionRequestCloseParams.js";
export type {
  FunctionRequestInitAndTriggerParamsFields,
  FunctionRequestInitAndTriggerParamsJSON,
} from "./FunctionRequestInitAndTriggerParams.js";
export { FunctionRequestInitAndTriggerParams } from "./FunctionRequestInitAndTriggerParams.js";
export type {
  FunctionRequestInitParamsFields,
  FunctionRequestInitParamsJSON,
} from "./FunctionRequestInitParams.js";
export { FunctionRequestInitParams } from "./FunctionRequestInitParams.js";
export type {
  FunctionRequestSetConfigParamsFields,
  FunctionRequestSetConfigParamsJSON,
} from "./FunctionRequestSetConfigParams.js";
export { FunctionRequestSetConfigParams } from "./FunctionRequestSetConfigParams.js";
export type {
  FunctionRequestTriggerParamsFields,
  FunctionRequestTriggerParamsJSON,
} from "./FunctionRequestTriggerParams.js";
export { FunctionRequestTriggerParams } from "./FunctionRequestTriggerParams.js";
export type {
  FunctionRequestTriggerRoundFields,
  FunctionRequestTriggerRoundJSON,
} from "./FunctionRequestTriggerRound.js";
export { FunctionRequestTriggerRound } from "./FunctionRequestTriggerRound.js";
export type {
  FunctionRequestVerifyParamsFields,
  FunctionRequestVerifyParamsJSON,
} from "./FunctionRequestVerifyParams.js";
export { FunctionRequestVerifyParams } from "./FunctionRequestVerifyParams.js";
export type {
  FunctionResetEscrowParamsFields,
  FunctionResetEscrowParamsJSON,
} from "./FunctionResetEscrowParams.js";
export { FunctionResetEscrowParams } from "./FunctionResetEscrowParams.js";
export type {
  FunctionSetAuthorityParamsFields,
  FunctionSetAuthorityParamsJSON,
} from "./FunctionSetAuthorityParams.js";
export { FunctionSetAuthorityParams } from "./FunctionSetAuthorityParams.js";
export type {
  FunctionSetConfigParamsFields,
  FunctionSetConfigParamsJSON,
} from "./FunctionSetConfigParams.js";
export { FunctionSetConfigParams } from "./FunctionSetConfigParams.js";
export type {
  FunctionSetEscrowParamsFields,
  FunctionSetEscrowParamsJSON,
} from "./FunctionSetEscrowParams.js";
export { FunctionSetEscrowParams } from "./FunctionSetEscrowParams.js";
export type {
  FunctionTriggerParamsFields,
  FunctionTriggerParamsJSON,
} from "./FunctionTriggerParams.js";
export { FunctionTriggerParams } from "./FunctionTriggerParams.js";
export type {
  FunctionVerifyParamsFields,
  FunctionVerifyParamsJSON,
} from "./FunctionVerifyParams.js";
export { FunctionVerifyParams } from "./FunctionVerifyParams.js";
export type { QuoteFields, QuoteJSON } from "./Quote.js";
export { Quote } from "./Quote.js";
export type {
  StateInitParamsFields,
  StateInitParamsJSON,
} from "./StateInitParams.js";
export { StateInitParams } from "./StateInitParams.js";
export type {
  VerifierHeartbeatParamsFields,
  VerifierHeartbeatParamsJSON,
} from "./VerifierHeartbeatParams.js";
export { VerifierHeartbeatParams } from "./VerifierHeartbeatParams.js";
export type {
  VerifierInitParamsFields,
  VerifierInitParamsJSON,
} from "./VerifierInitParams.js";
export { VerifierInitParams } from "./VerifierInitParams.js";
export type {
  VerifierQuoteRotateParamsFields,
  VerifierQuoteRotateParamsJSON,
} from "./VerifierQuoteRotateParams.js";
export { VerifierQuoteRotateParams } from "./VerifierQuoteRotateParams.js";
export type {
  VerifierQuoteVerifyParamsFields,
  VerifierQuoteVerifyParamsJSON,
} from "./VerifierQuoteVerifyParams.js";
export { VerifierQuoteVerifyParams } from "./VerifierQuoteVerifyParams.js";
export type {
  WalletCloseParamsFields,
  WalletCloseParamsJSON,
} from "./WalletCloseParams.js";
export { WalletCloseParams } from "./WalletCloseParams.js";
export type {
  WalletFundParamsFields,
  WalletFundParamsJSON,
} from "./WalletFundParams.js";
export { WalletFundParams } from "./WalletFundParams.js";
export type {
  WalletInitParamsFields,
  WalletInitParamsJSON,
} from "./WalletInitParams.js";
export { WalletInitParams } from "./WalletInitParams.js";
export type {
  WalletWithdrawParamsFields,
  WalletWithdrawParamsJSON,
} from "./WalletWithdrawParams.js";
export { WalletWithdrawParams } from "./WalletWithdrawParams.js";
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

export { FundingStatus };

export type FundingStatusKind = FundingStatus.Inactive | FundingStatus.Active;
export type FundingStatusJSON =
  | FundingStatus.InactiveJSON
  | FundingStatus.ActiveJSON;

export { RequestStatus };

export type RequestStatusKind =
  | RequestStatus.None
  | RequestStatus.RequestPending
  | RequestStatus.RequestCancelled
  | RequestStatus.RequestFailure
  | RequestStatus.RequestExpired
  | RequestStatus.RequestSuccess;
export type RequestStatusJSON =
  | RequestStatus.NoneJSON
  | RequestStatus.RequestPendingJSON
  | RequestStatus.RequestCancelledJSON
  | RequestStatus.RequestFailureJSON
  | RequestStatus.RequestExpiredJSON
  | RequestStatus.RequestSuccessJSON;

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
  | SwitchboardAttestationPermission.None
  | SwitchboardAttestationPermission.PermitNodeheartbeat
  | SwitchboardAttestationPermission.PermitQueueUsage;
export type SwitchboardAttestationPermissionJSON =
  | SwitchboardAttestationPermission.NoneJSON
  | SwitchboardAttestationPermission.PermitNodeheartbeatJSON
  | SwitchboardAttestationPermission.PermitQueueUsageJSON;
