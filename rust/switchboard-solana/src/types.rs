use crate::cfg_client;

pub use crate::decimal::SwitchboardDecimal;

pub use crate::oracle_program::{
    AccountMetaBorsh, AccountMetaZC, AggregatorHistoryRow, AggregatorResolutionMode,
    AggregatorRound, BufferRelayerRound, Callback, CallbackZC, CrankRow, OracleMetrics,
    OracleResponseType, PermissionSetParams, SlidingWindowElement, SwitchboardPermission,
    VrfBuilder, VrfCloseParams, VrfLiteCloseParams, VrfLiteRequestRandomnessParams,
    VrfPoolRemoveParams, VrfPoolRequestRandomnessParams, VrfPoolRow, VrfRequestRandomnessParams,
    VrfRound, VrfSetCallbackParams, VrfStatus,
};

pub use crate::attestation_program::{
    AttestationPermissionInitParams, AttestationPermissionSetParams,
    AttestationQueueAddMrEnclaveParams, AttestationQueueInitParams, FunctionCloseParams,
    FunctionInitParams, FunctionRequestCloseParams, FunctionRequestInitAndTriggerParams,
    FunctionRequestInitParams, FunctionRequestSetConfigParams, FunctionRequestTriggerRound,
    FunctionRequestVerifyParams, FunctionRoutineInitParams, FunctionRoutineVerifyParams,
    FunctionSetEscrowParams, FunctionStatus, FunctionTriggerParams, FunctionVerifyParams,
    MrEnclave, Quote, RequestStatus, ResourceLevel, SwitchboardAttestationPermission,
    VerificationStatus, VerifierQuoteVerifyParams, WalletFundParams, WalletInitParams,
    WalletWithdrawParams,
};

cfg_client! {
    pub use crate::attestation_program::{
        AttestationPermissionInitAccounts, AttestationPermissionSetAccounts,
        FunctionRequestInitAndTriggerAccounts, FunctionRequestVerifyAccounts,
        FunctionRoutineVerifyAccounts, FunctionVerifyAccounts,
        SwitchboardWalletInitAccounts, VerifierHeartbeatAccounts, VerifierHeartbeatArgs,
        VerifierInitAccounts, VerifierQuoteRotateAccounts, VerifierQuoteVerifyAccounts,
        VerifierQuoteVerifyArgs,
    };
}
