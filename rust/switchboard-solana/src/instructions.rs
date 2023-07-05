pub use crate::oracle_program::instructions::{
    PermissionSet, VrfClose, VrfLiteClose, VrfLiteRequestRandomness, VrfPoolRemove,
    VrfPoolRequestRandomness, VrfRequestRandomness, VrfSetCallback,
};

pub use crate::attestation_program::instructions::{
    FunctionClose, FunctionInit, FunctionRequestClose, FunctionRequestInit,
    FunctionRequestInitAndTrigger, FunctionRequestVerify, FunctionSetEscrow, FunctionTrigger,
    FunctionVerify, WalletFund, WalletInit,
};
