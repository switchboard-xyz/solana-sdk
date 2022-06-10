export type CustomError =
  | ArrayOperationError
  | QueueOperationError
  | IncorrectProgramOwnerError
  | InvalidAggregatorRound
  | TooManyAggregatorJobs
  | AggregatorCurrentRoundClosed
  | AggregatorInvalidSaveResult
  | InvalidStrDecimalConversion
  | AccountLoaderMissingSignature
  | MissingRequiredSignature
  | ArrayOverflowError
  | ArrayUnderflowError
  | PubkeyNotFoundError
  | AggregatorIllegalRoundOpenCall
  | AggregatorIllegalRoundCloseCall
  | AggregatorClosedError
  | IllegalOracleIdxError
  | OracleAlreadyRespondedError
  | ProtoDeserializeError
  | UnauthorizedStateUpdateError
  | MissingOracleAccountsError
  | OracleMismatchError
  | CrankMaxCapacityError
  | AggregatorLeaseInsufficientFunds
  | IncorrectTokenAccountMint
  | InvalidEscrowAccount
  | CrankEmptyError
  | PdaDeriveError
  | AggregatorAccountNotFound
  | PermissionAccountNotFound
  | LeaseAccountDeriveFailure
  | PermissionAccountDeriveFailure
  | EscrowAccountNotFound
  | LeaseAccountNotFound
  | DecimalConversionError
  | PermissionDenied
  | QueueAtCapacity
  | ExcessiveCrankRowsError
  | AggregatorLockedError
  | AggregatorInvalidBatchSizeError
  | AggregatorJobChecksumMismatch
  | IntegerOverflowError
  | InvalidUpdatePeriodError
  | NoResultsError
  | InvalidExpirationError
  | InsufficientStakeError
  | LeaseInactiveError
  | NoAggregatorJobsFound
  | IntegerUnderflowError
  | OracleQueueMismatch
  | OracleWalletMismatchError
  | InvalidBufferAccountError
  | InsufficientOracleQueueError
  | InvalidAuthorityError
  | InvalidTokenAccountMintError
  | ExcessiveLeaseWithdrawlError
  | InvalideHistoryAccountError
  | InvalidLeaseAccountEscrowError
  | InvalidCrankAccountError
  | CrankNoElementsReadyError
  | IndexOutOfBoundsError
  | VrfInvalidRequestError
  | VrfInvalidProofSubmissionError
  | VrfVerifyError
  | VrfCallbackError
  | VrfCallbackParamsError
  | VrfCallbackAlreadyCalledError
  | VrfInvalidPubkeyError
  | VrfTooManyVerifyCallsError
  | VrfRequestAlreadyLaunchedError
  | VrfInsufficientVerificationError
  | InvalidVrfProducerError
  | NoopError

export class ArrayOperationError extends Error {
  readonly code = 6000
  readonly name = "ArrayOperationError"
  readonly msg = "Illegal operation on a Switchboard array."

  constructor() {
    super("6000: Illegal operation on a Switchboard array.")
  }
}

export class QueueOperationError extends Error {
  readonly code = 6001
  readonly name = "QueueOperationError"
  readonly msg = "Illegal operation on a Switchboard queue."

  constructor() {
    super("6001: Illegal operation on a Switchboard queue.")
  }
}

export class IncorrectProgramOwnerError extends Error {
  readonly code = 6002
  readonly name = "IncorrectProgramOwnerError"
  readonly msg =
    "An account required to be owned by the program has a different owner."

  constructor() {
    super(
      "6002: An account required to be owned by the program has a different owner."
    )
  }
}

export class InvalidAggregatorRound extends Error {
  readonly code = 6003
  readonly name = "InvalidAggregatorRound"
  readonly msg = "Aggregator is not currently populated with a valid round."

  constructor() {
    super("6003: Aggregator is not currently populated with a valid round.")
  }
}

export class TooManyAggregatorJobs extends Error {
  readonly code = 6004
  readonly name = "TooManyAggregatorJobs"
  readonly msg = "Aggregator cannot fit any more jobs."

  constructor() {
    super("6004: Aggregator cannot fit any more jobs.")
  }
}

export class AggregatorCurrentRoundClosed extends Error {
  readonly code = 6005
  readonly name = "AggregatorCurrentRoundClosed"
  readonly msg =
    "Aggregator's current round is closed. No results are being accepted."

  constructor() {
    super(
      "6005: Aggregator's current round is closed. No results are being accepted."
    )
  }
}

export class AggregatorInvalidSaveResult extends Error {
  readonly code = 6006
  readonly name = "AggregatorInvalidSaveResult"
  readonly msg = "Aggregator received an invalid save result instruction."

  constructor() {
    super("6006: Aggregator received an invalid save result instruction.")
  }
}

export class InvalidStrDecimalConversion extends Error {
  readonly code = 6007
  readonly name = "InvalidStrDecimalConversion"
  readonly msg = "Failed to convert string to decimal format."

  constructor() {
    super("6007: Failed to convert string to decimal format.")
  }
}

export class AccountLoaderMissingSignature extends Error {
  readonly code = 6008
  readonly name = "AccountLoaderMissingSignature"
  readonly msg = "AccountLoader account is missing a required signature."

  constructor() {
    super("6008: AccountLoader account is missing a required signature.")
  }
}

export class MissingRequiredSignature extends Error {
  readonly code = 6009
  readonly name = "MissingRequiredSignature"
  readonly msg = "Account is missing a required signature."

  constructor() {
    super("6009: Account is missing a required signature.")
  }
}

export class ArrayOverflowError extends Error {
  readonly code = 6010
  readonly name = "ArrayOverflowError"
  readonly msg = "The attempted action will overflow a zero-copy account array."

  constructor() {
    super("6010: The attempted action will overflow a zero-copy account array.")
  }
}

export class ArrayUnderflowError extends Error {
  readonly code = 6011
  readonly name = "ArrayUnderflowError"
  readonly msg =
    "The attempted action will underflow a zero-copy account array."

  constructor() {
    super(
      "6011: The attempted action will underflow a zero-copy account array."
    )
  }
}

export class PubkeyNotFoundError extends Error {
  readonly code = 6012
  readonly name = "PubkeyNotFoundError"
  readonly msg = "The queried public key was not found."

  constructor() {
    super("6012: The queried public key was not found.")
  }
}

export class AggregatorIllegalRoundOpenCall extends Error {
  readonly code = 6013
  readonly name = "AggregatorIllegalRoundOpenCall"
  readonly msg = "Aggregator round open called too early."

  constructor() {
    super("6013: Aggregator round open called too early.")
  }
}

export class AggregatorIllegalRoundCloseCall extends Error {
  readonly code = 6014
  readonly name = "AggregatorIllegalRoundCloseCall"
  readonly msg = "Aggregator round close called too early."

  constructor() {
    super("6014: Aggregator round close called too early.")
  }
}

export class AggregatorClosedError extends Error {
  readonly code = 6015
  readonly name = "AggregatorClosedError"
  readonly msg = "Aggregator is closed. Illegal action."

  constructor() {
    super("6015: Aggregator is closed. Illegal action.")
  }
}

export class IllegalOracleIdxError extends Error {
  readonly code = 6016
  readonly name = "IllegalOracleIdxError"
  readonly msg = "Illegal oracle index."

  constructor() {
    super("6016: Illegal oracle index.")
  }
}

export class OracleAlreadyRespondedError extends Error {
  readonly code = 6017
  readonly name = "OracleAlreadyRespondedError"
  readonly msg = "The provided oracle has already responded this round."

  constructor() {
    super("6017: The provided oracle has already responded this round.")
  }
}

export class ProtoDeserializeError extends Error {
  readonly code = 6018
  readonly name = "ProtoDeserializeError"
  readonly msg = "Failed to deserialize protocol buffer."

  constructor() {
    super("6018: Failed to deserialize protocol buffer.")
  }
}

export class UnauthorizedStateUpdateError extends Error {
  readonly code = 6019
  readonly name = "UnauthorizedStateUpdateError"
  readonly msg = "Unauthorized program state modification attempted."

  constructor() {
    super("6019: Unauthorized program state modification attempted.")
  }
}

export class MissingOracleAccountsError extends Error {
  readonly code = 6020
  readonly name = "MissingOracleAccountsError"
  readonly msg = "Not enough oracle accounts provided to closeRounds."

  constructor() {
    super("6020: Not enough oracle accounts provided to closeRounds.")
  }
}

export class OracleMismatchError extends Error {
  readonly code = 6021
  readonly name = "OracleMismatchError"
  readonly msg =
    "An unexpected oracle account was provided for the transaction."

  constructor() {
    super(
      "6021: An unexpected oracle account was provided for the transaction."
    )
  }
}

export class CrankMaxCapacityError extends Error {
  readonly code = 6022
  readonly name = "CrankMaxCapacityError"
  readonly msg = "Attempted to push to a Crank that's at capacity"

  constructor() {
    super("6022: Attempted to push to a Crank that's at capacity")
  }
}

export class AggregatorLeaseInsufficientFunds extends Error {
  readonly code = 6023
  readonly name = "AggregatorLeaseInsufficientFunds"
  readonly msg =
    "Aggregator update call attempted but attached lease has insufficient funds."

  constructor() {
    super(
      "6023: Aggregator update call attempted but attached lease has insufficient funds."
    )
  }
}

export class IncorrectTokenAccountMint extends Error {
  readonly code = 6024
  readonly name = "IncorrectTokenAccountMint"
  readonly msg =
    "The provided token account does not point to the Switchboard token mint."

  constructor() {
    super(
      "6024: The provided token account does not point to the Switchboard token mint."
    )
  }
}

export class InvalidEscrowAccount extends Error {
  readonly code = 6025
  readonly name = "InvalidEscrowAccount"
  readonly msg = "An invalid escrow account was provided."

  constructor() {
    super("6025: An invalid escrow account was provided.")
  }
}

export class CrankEmptyError extends Error {
  readonly code = 6026
  readonly name = "CrankEmptyError"
  readonly msg = "Crank empty. Pop failed."

  constructor() {
    super("6026: Crank empty. Pop failed.")
  }
}

export class PdaDeriveError extends Error {
  readonly code = 6027
  readonly name = "PdaDeriveError"
  readonly msg = "Failed to derive a PDA from the provided seed."

  constructor() {
    super("6027: Failed to derive a PDA from the provided seed.")
  }
}

export class AggregatorAccountNotFound extends Error {
  readonly code = 6028
  readonly name = "AggregatorAccountNotFound"
  readonly msg = "Aggregator account missing from provided account list."

  constructor() {
    super("6028: Aggregator account missing from provided account list.")
  }
}

export class PermissionAccountNotFound extends Error {
  readonly code = 6029
  readonly name = "PermissionAccountNotFound"
  readonly msg = "Permission account missing from provided account list."

  constructor() {
    super("6029: Permission account missing from provided account list.")
  }
}

export class LeaseAccountDeriveFailure extends Error {
  readonly code = 6030
  readonly name = "LeaseAccountDeriveFailure"
  readonly msg = "Failed to derive a lease account."

  constructor() {
    super("6030: Failed to derive a lease account.")
  }
}

export class PermissionAccountDeriveFailure extends Error {
  readonly code = 6031
  readonly name = "PermissionAccountDeriveFailure"
  readonly msg = "Failed to derive a permission account."

  constructor() {
    super("6031: Failed to derive a permission account.")
  }
}

export class EscrowAccountNotFound extends Error {
  readonly code = 6032
  readonly name = "EscrowAccountNotFound"
  readonly msg = "Escrow account missing from provided account list."

  constructor() {
    super("6032: Escrow account missing from provided account list.")
  }
}

export class LeaseAccountNotFound extends Error {
  readonly code = 6033
  readonly name = "LeaseAccountNotFound"
  readonly msg = "Lease account missing from provided account list."

  constructor() {
    super("6033: Lease account missing from provided account list.")
  }
}

export class DecimalConversionError extends Error {
  readonly code = 6034
  readonly name = "DecimalConversionError"
  readonly msg = "Decimal conversion method failed."

  constructor() {
    super("6034: Decimal conversion method failed.")
  }
}

export class PermissionDenied extends Error {
  readonly code = 6035
  readonly name = "PermissionDenied"
  readonly msg =
    "Permission account is missing required flags for the given action."

  constructor() {
    super(
      "6035: Permission account is missing required flags for the given action."
    )
  }
}

export class QueueAtCapacity extends Error {
  readonly code = 6036
  readonly name = "QueueAtCapacity"
  readonly msg = "Oracle queue is at lease capacity."

  constructor() {
    super("6036: Oracle queue is at lease capacity.")
  }
}

export class ExcessiveCrankRowsError extends Error {
  readonly code = 6037
  readonly name = "ExcessiveCrankRowsError"
  readonly msg = "Data feed is already pushed on a crank."

  constructor() {
    super("6037: Data feed is already pushed on a crank.")
  }
}

export class AggregatorLockedError extends Error {
  readonly code = 6038
  readonly name = "AggregatorLockedError"
  readonly msg =
    "Aggregator is locked, no setting modifications or job additions allowed."

  constructor() {
    super(
      "6038: Aggregator is locked, no setting modifications or job additions allowed."
    )
  }
}

export class AggregatorInvalidBatchSizeError extends Error {
  readonly code = 6039
  readonly name = "AggregatorInvalidBatchSizeError"
  readonly msg = "Aggregator invalid batch size."

  constructor() {
    super("6039: Aggregator invalid batch size.")
  }
}

export class AggregatorJobChecksumMismatch extends Error {
  readonly code = 6040
  readonly name = "AggregatorJobChecksumMismatch"
  readonly msg = "Oracle provided an incorrect aggregator job checksum."

  constructor() {
    super("6040: Oracle provided an incorrect aggregator job checksum.")
  }
}

export class IntegerOverflowError extends Error {
  readonly code = 6041
  readonly name = "IntegerOverflowError"
  readonly msg = "An integer overflow occurred."

  constructor() {
    super("6041: An integer overflow occurred.")
  }
}

export class InvalidUpdatePeriodError extends Error {
  readonly code = 6042
  readonly name = "InvalidUpdatePeriodError"
  readonly msg = "Minimum update period is 5 seconds."

  constructor() {
    super("6042: Minimum update period is 5 seconds.")
  }
}

export class NoResultsError extends Error {
  readonly code = 6043
  readonly name = "NoResultsError"
  readonly msg = "Aggregator round evaluation attempted with no results."

  constructor() {
    super("6043: Aggregator round evaluation attempted with no results.")
  }
}

export class InvalidExpirationError extends Error {
  readonly code = 6044
  readonly name = "InvalidExpirationError"
  readonly msg = "An expiration constraint was broken."

  constructor() {
    super("6044: An expiration constraint was broken.")
  }
}

export class InsufficientStakeError extends Error {
  readonly code = 6045
  readonly name = "InsufficientStakeError"
  readonly msg = "An account provided insufficient stake for action."

  constructor() {
    super("6045: An account provided insufficient stake for action.")
  }
}

export class LeaseInactiveError extends Error {
  readonly code = 6046
  readonly name = "LeaseInactiveError"
  readonly msg = "The provided lease account is not active."

  constructor() {
    super("6046: The provided lease account is not active.")
  }
}

export class NoAggregatorJobsFound extends Error {
  readonly code = 6047
  readonly name = "NoAggregatorJobsFound"
  readonly msg = "No jobs are currently included in the aggregator."

  constructor() {
    super("6047: No jobs are currently included in the aggregator.")
  }
}

export class IntegerUnderflowError extends Error {
  readonly code = 6048
  readonly name = "IntegerUnderflowError"
  readonly msg = "An integer underflow occurred."

  constructor() {
    super("6048: An integer underflow occurred.")
  }
}

export class OracleQueueMismatch extends Error {
  readonly code = 6049
  readonly name = "OracleQueueMismatch"
  readonly msg = "An invalid oracle queue account was provided."

  constructor() {
    super("6049: An invalid oracle queue account was provided.")
  }
}

export class OracleWalletMismatchError extends Error {
  readonly code = 6050
  readonly name = "OracleWalletMismatchError"
  readonly msg =
    "An unexpected oracle wallet account was provided for the transaction."

  constructor() {
    super(
      "6050: An unexpected oracle wallet account was provided for the transaction."
    )
  }
}

export class InvalidBufferAccountError extends Error {
  readonly code = 6051
  readonly name = "InvalidBufferAccountError"
  readonly msg = "An invalid buffer account was provided."

  constructor() {
    super("6051: An invalid buffer account was provided.")
  }
}

export class InsufficientOracleQueueError extends Error {
  readonly code = 6052
  readonly name = "InsufficientOracleQueueError"
  readonly msg = "Insufficient oracle queue size."

  constructor() {
    super("6052: Insufficient oracle queue size.")
  }
}

export class InvalidAuthorityError extends Error {
  readonly code = 6053
  readonly name = "InvalidAuthorityError"
  readonly msg = "Invalid authority account provided."

  constructor() {
    super("6053: Invalid authority account provided.")
  }
}

export class InvalidTokenAccountMintError extends Error {
  readonly code = 6054
  readonly name = "InvalidTokenAccountMintError"
  readonly msg = "A provided token wallet is associated with an incorrect mint."

  constructor() {
    super("6054: A provided token wallet is associated with an incorrect mint.")
  }
}

export class ExcessiveLeaseWithdrawlError extends Error {
  readonly code = 6055
  readonly name = "ExcessiveLeaseWithdrawlError"
  readonly msg =
    "You must leave enough funds to perform at least 1 update in the lease."

  constructor() {
    super(
      "6055: You must leave enough funds to perform at least 1 update in the lease."
    )
  }
}

export class InvalideHistoryAccountError extends Error {
  readonly code = 6056
  readonly name = "InvalideHistoryAccountError"
  readonly msg = "Invalid history account provided."

  constructor() {
    super("6056: Invalid history account provided.")
  }
}

export class InvalidLeaseAccountEscrowError extends Error {
  readonly code = 6057
  readonly name = "InvalidLeaseAccountEscrowError"
  readonly msg = "Invalid lease account escrow."

  constructor() {
    super("6057: Invalid lease account escrow.")
  }
}

export class InvalidCrankAccountError extends Error {
  readonly code = 6058
  readonly name = "InvalidCrankAccountError"
  readonly msg = "Invalid crank provided."

  constructor() {
    super("6058: Invalid crank provided.")
  }
}

export class CrankNoElementsReadyError extends Error {
  readonly code = 6059
  readonly name = "CrankNoElementsReadyError"
  readonly msg = "No elements ready to be popped."

  constructor() {
    super("6059: No elements ready to be popped.")
  }
}

export class IndexOutOfBoundsError extends Error {
  readonly code = 6060
  readonly name = "IndexOutOfBoundsError"
  readonly msg = "Index out of bounds"

  constructor() {
    super("6060: Index out of bounds")
  }
}

export class VrfInvalidRequestError extends Error {
  readonly code = 6061
  readonly name = "VrfInvalidRequestError"
  readonly msg = "Invalid vrf request params"

  constructor() {
    super("6061: Invalid vrf request params")
  }
}

export class VrfInvalidProofSubmissionError extends Error {
  readonly code = 6062
  readonly name = "VrfInvalidProofSubmissionError"
  readonly msg = "Vrf proof failed to verify"

  constructor() {
    super("6062: Vrf proof failed to verify")
  }
}

export class VrfVerifyError extends Error {
  readonly code = 6063
  readonly name = "VrfVerifyError"
  readonly msg = "Error in verifying vrf proof."

  constructor() {
    super("6063: Error in verifying vrf proof.")
  }
}

export class VrfCallbackError extends Error {
  readonly code = 6064
  readonly name = "VrfCallbackError"
  readonly msg = "Vrf callback function failed."

  constructor() {
    super("6064: Vrf callback function failed.")
  }
}

export class VrfCallbackParamsError extends Error {
  readonly code = 6065
  readonly name = "VrfCallbackParamsError"
  readonly msg = "Invalid vrf callback params provided."

  constructor() {
    super("6065: Invalid vrf callback params provided.")
  }
}

export class VrfCallbackAlreadyCalledError extends Error {
  readonly code = 6066
  readonly name = "VrfCallbackAlreadyCalledError"
  readonly msg = "Vrf callback has already been triggered."

  constructor() {
    super("6066: Vrf callback has already been triggered.")
  }
}

export class VrfInvalidPubkeyError extends Error {
  readonly code = 6067
  readonly name = "VrfInvalidPubkeyError"
  readonly msg = "The provided pubkey is invalid to use in ecvrf proofs"

  constructor() {
    super("6067: The provided pubkey is invalid to use in ecvrf proofs")
  }
}

export class VrfTooManyVerifyCallsError extends Error {
  readonly code = 6068
  readonly name = "VrfTooManyVerifyCallsError"
  readonly msg = "Number of required verify calls exceeded"

  constructor() {
    super("6068: Number of required verify calls exceeded")
  }
}

export class VrfRequestAlreadyLaunchedError extends Error {
  readonly code = 6069
  readonly name = "VrfRequestAlreadyLaunchedError"
  readonly msg = "Vrf request is already pending"

  constructor() {
    super("6069: Vrf request is already pending")
  }
}

export class VrfInsufficientVerificationError extends Error {
  readonly code = 6070
  readonly name = "VrfInsufficientVerificationError"
  readonly msg = "Insufficient amount of proofs collected for VRF callback"

  constructor() {
    super("6070: Insufficient amount of proofs collected for VRF callback")
  }
}

export class InvalidVrfProducerError extends Error {
  readonly code = 6071
  readonly name = "InvalidVrfProducerError"
  readonly msg = "An incorrect oracle attempted to submit a proof"

  constructor() {
    super("6071: An incorrect oracle attempted to submit a proof")
  }
}

export class NoopError extends Error {
  readonly code = 6072
  readonly name = "NoopError"
  readonly msg = "Noop error"

  constructor() {
    super("6072: Noop error")
  }
}

export function fromCode(code: number): CustomError | null {
  switch (code) {
    case 6000:
      return new ArrayOperationError()
    case 6001:
      return new QueueOperationError()
    case 6002:
      return new IncorrectProgramOwnerError()
    case 6003:
      return new InvalidAggregatorRound()
    case 6004:
      return new TooManyAggregatorJobs()
    case 6005:
      return new AggregatorCurrentRoundClosed()
    case 6006:
      return new AggregatorInvalidSaveResult()
    case 6007:
      return new InvalidStrDecimalConversion()
    case 6008:
      return new AccountLoaderMissingSignature()
    case 6009:
      return new MissingRequiredSignature()
    case 6010:
      return new ArrayOverflowError()
    case 6011:
      return new ArrayUnderflowError()
    case 6012:
      return new PubkeyNotFoundError()
    case 6013:
      return new AggregatorIllegalRoundOpenCall()
    case 6014:
      return new AggregatorIllegalRoundCloseCall()
    case 6015:
      return new AggregatorClosedError()
    case 6016:
      return new IllegalOracleIdxError()
    case 6017:
      return new OracleAlreadyRespondedError()
    case 6018:
      return new ProtoDeserializeError()
    case 6019:
      return new UnauthorizedStateUpdateError()
    case 6020:
      return new MissingOracleAccountsError()
    case 6021:
      return new OracleMismatchError()
    case 6022:
      return new CrankMaxCapacityError()
    case 6023:
      return new AggregatorLeaseInsufficientFunds()
    case 6024:
      return new IncorrectTokenAccountMint()
    case 6025:
      return new InvalidEscrowAccount()
    case 6026:
      return new CrankEmptyError()
    case 6027:
      return new PdaDeriveError()
    case 6028:
      return new AggregatorAccountNotFound()
    case 6029:
      return new PermissionAccountNotFound()
    case 6030:
      return new LeaseAccountDeriveFailure()
    case 6031:
      return new PermissionAccountDeriveFailure()
    case 6032:
      return new EscrowAccountNotFound()
    case 6033:
      return new LeaseAccountNotFound()
    case 6034:
      return new DecimalConversionError()
    case 6035:
      return new PermissionDenied()
    case 6036:
      return new QueueAtCapacity()
    case 6037:
      return new ExcessiveCrankRowsError()
    case 6038:
      return new AggregatorLockedError()
    case 6039:
      return new AggregatorInvalidBatchSizeError()
    case 6040:
      return new AggregatorJobChecksumMismatch()
    case 6041:
      return new IntegerOverflowError()
    case 6042:
      return new InvalidUpdatePeriodError()
    case 6043:
      return new NoResultsError()
    case 6044:
      return new InvalidExpirationError()
    case 6045:
      return new InsufficientStakeError()
    case 6046:
      return new LeaseInactiveError()
    case 6047:
      return new NoAggregatorJobsFound()
    case 6048:
      return new IntegerUnderflowError()
    case 6049:
      return new OracleQueueMismatch()
    case 6050:
      return new OracleWalletMismatchError()
    case 6051:
      return new InvalidBufferAccountError()
    case 6052:
      return new InsufficientOracleQueueError()
    case 6053:
      return new InvalidAuthorityError()
    case 6054:
      return new InvalidTokenAccountMintError()
    case 6055:
      return new ExcessiveLeaseWithdrawlError()
    case 6056:
      return new InvalideHistoryAccountError()
    case 6057:
      return new InvalidLeaseAccountEscrowError()
    case 6058:
      return new InvalidCrankAccountError()
    case 6059:
      return new CrankNoElementsReadyError()
    case 6060:
      return new IndexOutOfBoundsError()
    case 6061:
      return new VrfInvalidRequestError()
    case 6062:
      return new VrfInvalidProofSubmissionError()
    case 6063:
      return new VrfVerifyError()
    case 6064:
      return new VrfCallbackError()
    case 6065:
      return new VrfCallbackParamsError()
    case 6066:
      return new VrfCallbackAlreadyCalledError()
    case 6067:
      return new VrfInvalidPubkeyError()
    case 6068:
      return new VrfTooManyVerifyCallsError()
    case 6069:
      return new VrfRequestAlreadyLaunchedError()
    case 6070:
      return new VrfInsufficientVerificationError()
    case 6071:
      return new InvalidVrfProducerError()
    case 6072:
      return new NoopError()
  }

  return null
}
