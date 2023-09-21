#![allow(non_snake_case)]

use crate::prelude::*;
use bytemuck::{Pod, Zeroable};

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct AccountMetaZC {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}

#[zero_copy(unsafe)]
#[repr(packed)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AccountMetaBorsh {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct CallbackZC {
    /// The program ID of the callback program being invoked.
    pub program_id: Pubkey,
    /// The accounts being used in the callback instruction.
    pub accounts: [AccountMetaZC; 32],
    /// The number of accounts used in the callback
    pub accounts_len: u32,
    /// The serialized instruction data.
    pub ix_data: [u8; 1024],
    /// The number of serialized bytes in the instruction data.
    pub ix_data_len: u32,
}
impl Default for CallbackZC {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Callback {
    /// The program ID of the callback program being invoked.
    pub program_id: Pubkey,
    /// The accounts being used in the callback instruction.
    pub accounts: Vec<AccountMetaBorsh>,
    /// The serialized instruction data.
    pub ix_data: Vec<u8>,
}

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct VrfRound {
    /// The alpha bytes used to calculate the VRF proof.
    pub alpha: [u8; 256],
    /// The number of bytes in the alpha buffer.
    pub alpha_len: u32,
    /// The Slot when the VRF round was opened.
    pub request_slot: u64,
    /// The unix timestamp when the VRF round was opened.
    pub request_timestamp: i64,
    /// The VRF round result. Will be zeroized if still awaiting fulfillment.
    pub result: [u8; 32],
    /// The number of builders who verified the VRF proof.
    pub num_verified: u32,
    /// Reserved for future info.
    pub _ebuf: [u8; 256],
}
impl Default for VrfRound {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub enum VrfStatus {
    /// VRF Account has not requested randomness yet.
    StatusNone,
    /// VRF Account has requested randomness but has yet to receive an oracle response.
    StatusRequesting,
    /// VRF Account has received a VRF proof that has yet to be verified on-chain.
    StatusVerifying,
    /// VRF Account has successfully requested and verified randomness on-chain.
    StatusVerified,
    /// VRF Account's callback was invoked successfully.
    StatusCallbackSuccess,
    /// Failed to verify VRF proof.
    StatusVerifyFailure,
}
impl std::fmt::Display for VrfStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            VrfStatus::StatusNone => write!(f, "StatusNone"),
            VrfStatus::StatusRequesting => write!(f, "StatusRequesting"),
            VrfStatus::StatusVerifying => write!(f, "StatusVerifying"),
            VrfStatus::StatusVerified => write!(f, "StatusVerified"),
            VrfStatus::StatusCallbackSuccess => write!(f, "StatusCallbackSuccess"),
            VrfStatus::StatusVerifyFailure => write!(f, "StatusVerifyFailure"),
        }
    }
}

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct EcvrfProofZC {
    pub Gamma: EdwardsPointZC, // RistrettoPoint
    pub c: Scalar,
    pub s: Scalar,
}
impl Default for EcvrfProofZC {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

/// The `Scalar` struct holds an integer \\(s < 2\^{255} \\) which
/// represents an element of \\(\mathbb Z / \ell\\).
#[allow(dead_code)]
#[zero_copy(unsafe)]
#[repr(packed)]
pub struct Scalar {
    /// `bytes` is a little-endian byte encoding of an integer representing a scalar modulo the
    /// group order.
    ///
    /// # Invariant
    ///
    /// The integer representing this scalar must be bounded above by \\(2\^{255}\\), or
    /// equivalently the high bit of `bytes[31]` must be zero.
    ///
    /// This ensures that there is room for a carry bit when computing a NAF representation.
    //
    // XXX This is pub(crate) so we can write literal constants.  If const fns were stable, we could
    //     make the Scalar constructors const fns and use those instead.
    pub(crate) bytes: [u8; 32],
}
unsafe impl Pod for Scalar {}
unsafe impl Zeroable for Scalar {}

/// A `FieldElement51` represents an element of the field
/// \\( \mathbb Z / (2\^{255} - 19)\\).
///
/// In the 64-bit implementation, a `FieldElement` is represented in
/// radix \\(2\^{51}\\) as five `u64`s; the coefficients are allowed to
/// grow up to \\(2\^{54}\\) between reductions modulo \\(p\\).
///
/// # Note
///
/// The `curve25519_dalek::field` module provides a type alias
/// `curve25519_dalek::field::FieldElement` to either `FieldElement51`
/// or `FieldElement2625`.
///
/// The backend-specific type `FieldElement51` should not be used
/// outside of the `curve25519_dalek::field` module.
#[derive(Copy, Clone, Default)]
#[repr(C)]
pub struct FieldElement51(pub(crate) [u64; 5]);
unsafe impl Pod for FieldElement51 {}
unsafe impl Zeroable for FieldElement51 {}

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct FieldElementZC {
    pub(crate) bytes: [u64; 5],
}
impl Default for FieldElementZC {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
unsafe impl Pod for FieldElementZC {}
unsafe impl Zeroable for FieldElementZC {}
impl From<FieldElement51> for FieldElementZC {
    fn from(val: FieldElement51) -> Self {
        FieldElementZC { bytes: val.0 }
    }
}
impl From<FieldElementZC> for FieldElement51 {
    fn from(val: FieldElementZC) -> Self {
        FieldElement51(val.bytes)
    }
}

/// A `CompletedPoint` is a point \\(((X:Z), (Y:T))\\) on the \\(\mathbb
/// P\^1 \times \mathbb P\^1 \\) model of the curve.
/// A point (x,y) in the affine model corresponds to \\( ((x:1),(y:1))
/// \\).
///
/// More details on the relationships between the different curve models
/// can be found in the module-level documentation.
#[allow(missing_docs)]
#[derive(Copy, Clone)]
#[repr(C)]
pub struct CompletedPoint {
    pub X: FieldElement51,
    pub Y: FieldElement51,
    pub Z: FieldElement51,
    pub T: FieldElement51,
}
#[zero_copy(unsafe)]
#[repr(packed)]
pub struct CompletedPointZC {
    pub X: FieldElementZC,
    pub Y: FieldElementZC,
    pub Z: FieldElementZC,
    pub T: FieldElementZC,
}
impl Default for CompletedPointZC {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
unsafe impl Pod for CompletedPoint {}
unsafe impl Zeroable for CompletedPoint {}
impl From<CompletedPoint> for CompletedPointZC {
    fn from(val: CompletedPoint) -> Self {
        CompletedPointZC {
            X: val.X.into(),
            Y: val.Y.into(),
            Z: val.Z.into(),
            T: val.T.into(),
        }
    }
}
impl From<CompletedPointZC> for CompletedPoint {
    fn from(val: CompletedPointZC) -> Self {
        CompletedPoint {
            X: val.X.into(),
            Y: val.Y.into(),
            Z: val.Z.into(),
            T: val.T.into(),
        }
    }
}

/// An `EdwardsPoint` represents a point on the Edwards form of Curve25519.
#[derive(Copy, Clone)]
#[repr(C)]
pub struct EdwardsPoint {
    pub(crate) X: FieldElement51,
    pub(crate) Y: FieldElement51,
    pub(crate) Z: FieldElement51,
    pub(crate) T: FieldElement51,
}
#[allow(dead_code)]
#[zero_copy(unsafe)]
#[repr(packed)]
pub struct EdwardsPointZC {
    pub(crate) X: FieldElementZC,
    pub(crate) Y: FieldElementZC,
    pub(crate) Z: FieldElementZC,
    pub(crate) T: FieldElementZC,
}
impl Default for EdwardsPointZC {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}

/// A `ProjectivePoint` is a point \\((X:Y:Z)\\) on the \\(\mathbb
/// P\^2\\) model of the curve.
/// A point \\((x,y)\\) in the affine model corresponds to
/// \\((x:y:1)\\).
///
/// More details on the relationships between the different curve models
/// can be found in the module-level documentation.
#[derive(Copy, Clone, Default)]
#[repr(C)]
pub struct ProjectivePoint {
    pub X: FieldElement51,
    pub Y: FieldElement51,
    pub Z: FieldElement51,
}
#[zero_copy(unsafe)]
#[repr(packed)]
pub struct ProjectivePointZC {
    pub(crate) X: FieldElementZC,
    pub(crate) Y: FieldElementZC,
    pub(crate) Z: FieldElementZC,
}
impl Default for ProjectivePointZC {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
unsafe impl Pod for ProjectivePoint {}
unsafe impl Zeroable for ProjectivePoint {}
impl From<ProjectivePoint> for ProjectivePointZC {
    fn from(val: ProjectivePoint) -> Self {
        ProjectivePointZC {
            X: val.X.into(),
            Y: val.Y.into(),
            Z: val.Z.into(),
        }
    }
}
impl From<ProjectivePointZC> for ProjectivePoint {
    fn from(val: ProjectivePointZC) -> Self {
        ProjectivePoint {
            X: val.X.into(),
            Y: val.Y.into(),
            Z: val.Z.into(),
        }
    }
}

#[zero_copy(unsafe)]
#[repr(packed)]
pub struct EcvrfIntermediate {
    pub r: FieldElementZC,
    pub N_s: FieldElementZC,
    pub D: FieldElementZC,
    pub t13: FieldElementZC,
    pub t15: FieldElementZC,
}
unsafe impl Pod for EcvrfIntermediate {}
unsafe impl Zeroable for EcvrfIntermediate {}

#[allow(non_snake_case)]
#[zero_copy(unsafe)]
#[repr(packed)]
pub struct VrfBuilder {
    /// The OracleAccountData that is producing the randomness.
    pub producer: Pubkey,
    /// The current status of the VRF verification.
    pub status: VrfStatus,
    /// The VRF proof sourced from the producer.
    pub repr_proof: [u8; 80],
    pub proof: EcvrfProofZC,
    pub Y_point: Pubkey,
    pub stage: u32,
    pub stage1_out: EcvrfIntermediate,
    pub R_1: EdwardsPointZC, // Ristretto
    pub R_2: EdwardsPointZC, // Ristretto
    pub stage3_out: EcvrfIntermediate,
    pub H_point: EdwardsPointZC, // Ristretto
    pub s_reduced: Scalar,
    pub Y_point_builder: [FieldElementZC; 3],
    pub Y_ristretto_point: EdwardsPointZC, // Ristretto
    pub mul_round: u8,
    pub hash_points_round: u8,
    pub mul_tmp1: CompletedPointZC,
    pub U_point1: EdwardsPointZC, // Ristretto
    pub U_point2: EdwardsPointZC, // Ristretto
    pub V_point1: EdwardsPointZC, // Ristretto
    pub V_point2: EdwardsPointZC, // Ristretto
    pub U_point: EdwardsPointZC,  // Ristretto
    pub V_point: EdwardsPointZC,  // Ristretto
    pub u1: FieldElementZC,
    pub u2: FieldElementZC,
    pub invertee: FieldElementZC,
    pub y: FieldElementZC,
    pub z: FieldElementZC,
    pub p1_bytes: [u8; 32],
    pub p2_bytes: [u8; 32],
    pub p3_bytes: [u8; 32],
    pub p4_bytes: [u8; 32],
    pub c_prime_hashbuf: [u8; 16],
    pub m1: FieldElementZC,
    pub m2: FieldElementZC,
    /// The number of transactions remaining to verify the VRF proof.
    pub tx_remaining: u32,
    /// Whether the VRF proof has been verified on-chain.
    pub verified: bool,
    /// The VRF proof verification result. Will be zeroized if still awaiting fulfillment.
    pub result: [u8; 32],
}
impl Default for VrfBuilder {
    fn default() -> Self {
        unsafe { std::mem::zeroed() }
    }
}
