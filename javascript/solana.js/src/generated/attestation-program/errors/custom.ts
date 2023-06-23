import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
export type CustomError =
  | GenericError
  | InvalidQuote
  | QuoteExpired
  | InvalidNode
  | InsufficientQueue
  | QueueFull
  | InvalidEnclaveSigner
  | InvalidSigner
  | MrEnclavesEmpty
  | MrEnclaveAlreadyExists
  | MrEnclaveDoesntExist
  | MrEnclaveAtCapacity
  | PermissionDenied
  | InvalidConstraint
  | InvalidTimestamp
  | InvalidMrEnclave
  | InvalidReportData
  | InsufficientLoadAmount
  | IncorrectObservedTime
  | InvalidQuoteMode
  | InvalidVerifierIdx
  | InvalidSelfVerifyRequest
  | IncorrectMrEnclave
  | InvalidResponder
  | InvalidAddressLookupAddress
  | InvalidQueue
  | IllegalVerifier
  | InvalidEscrow
  | InvalidAuthority
  | IllegalExecuteAttempt
  | RequestExpired
  | InsufficientFunds
  | MissingFunctionEscrow
  | InvalidRequest
  | FunctionNotReady
  | UserRequestsDisabled
  | MissingFunctionAuthority
  | FunctionCloseNotReady
  | RequestAlreadyInitialized
  | AccountCloseNotPermitted
  | AccountCloseNotReady;

export class GenericError extends Error {
  static readonly code = 6000;
  readonly code = 6000;
  readonly name = "GenericError";

  constructor(readonly logs?: string[]) {
    super("6000: ");
  }
}

export class InvalidQuote extends Error {
  static readonly code = 6001;
  readonly code = 6001;
  readonly name = "InvalidQuote";

  constructor(readonly logs?: string[]) {
    super("6001: ");
  }
}

export class QuoteExpired extends Error {
  static readonly code = 6002;
  readonly code = 6002;
  readonly name = "QuoteExpired";
  readonly msg = "The EnclaveAccount has expired and needs to be reverified";

  constructor(readonly logs?: string[]) {
    super("6002: The EnclaveAccount has expired and needs to be reverified");
  }
}

export class InvalidNode extends Error {
  static readonly code = 6003;
  readonly code = 6003;
  readonly name = "InvalidNode";

  constructor(readonly logs?: string[]) {
    super("6003: ");
  }
}

export class InsufficientQueue extends Error {
  static readonly code = 6004;
  readonly code = 6004;
  readonly name = "InsufficientQueue";

  constructor(readonly logs?: string[]) {
    super("6004: ");
  }
}

export class QueueFull extends Error {
  static readonly code = 6005;
  readonly code = 6005;
  readonly name = "QueueFull";
  readonly msg = "The provided queue is full and cannot support new verifiers";

  constructor(readonly logs?: string[]) {
    super("6005: The provided queue is full and cannot support new verifiers");
  }
}

export class InvalidEnclaveSigner extends Error {
  static readonly code = 6006;
  readonly code = 6006;
  readonly name = "InvalidEnclaveSigner";
  readonly msg =
    "The provided enclave_signer does not match the expected enclave_signer on the EnclaveAccount";

  constructor(readonly logs?: string[]) {
    super(
      "6006: The provided enclave_signer does not match the expected enclave_signer on the EnclaveAccount"
    );
  }
}

export class InvalidSigner extends Error {
  static readonly code = 6007;
  readonly code = 6007;
  readonly name = "InvalidSigner";

  constructor(readonly logs?: string[]) {
    super("6007: ");
  }
}

export class MrEnclavesEmpty extends Error {
  static readonly code = 6008;
  readonly code = 6008;
  readonly name = "MrEnclavesEmpty";
  readonly msg = "This account has zero mr_enclaves defined";

  constructor(readonly logs?: string[]) {
    super("6008: This account has zero mr_enclaves defined");
  }
}

export class MrEnclaveAlreadyExists extends Error {
  static readonly code = 6009;
  readonly code = 6009;
  readonly name = "MrEnclaveAlreadyExists";
  readonly msg = "The MrEnclave value already exists in the array";

  constructor(readonly logs?: string[]) {
    super("6009: The MrEnclave value already exists in the array");
  }
}

export class MrEnclaveDoesntExist extends Error {
  static readonly code = 6010;
  readonly code = 6010;
  readonly name = "MrEnclaveDoesntExist";
  readonly msg = "The MrEnclave value was not found in the whitelist";

  constructor(readonly logs?: string[]) {
    super("6010: The MrEnclave value was not found in the whitelist");
  }
}

export class MrEnclaveAtCapacity extends Error {
  static readonly code = 6011;
  readonly code = 6011;
  readonly name = "MrEnclaveAtCapacity";
  readonly msg =
    "This account has a full mr_enclaves array. Remove some measurements to make room for new ones";

  constructor(readonly logs?: string[]) {
    super(
      "6011: This account has a full mr_enclaves array. Remove some measurements to make room for new ones"
    );
  }
}

export class PermissionDenied extends Error {
  static readonly code = 6012;
  readonly code = 6012;
  readonly name = "PermissionDenied";
  readonly msg =
    "The PermissionAccount is missing the required flags for this action. Check the queues config to see which permissions are required";

  constructor(readonly logs?: string[]) {
    super(
      "6012: The PermissionAccount is missing the required flags for this action. Check the queues config to see which permissions are required"
    );
  }
}

export class InvalidConstraint extends Error {
  static readonly code = 6013;
  readonly code = 6013;
  readonly name = "InvalidConstraint";

  constructor(readonly logs?: string[]) {
    super("6013: ");
  }
}

export class InvalidTimestamp extends Error {
  static readonly code = 6014;
  readonly code = 6014;
  readonly name = "InvalidTimestamp";

  constructor(readonly logs?: string[]) {
    super("6014: ");
  }
}

export class InvalidMrEnclave extends Error {
  static readonly code = 6015;
  readonly code = 6015;
  readonly name = "InvalidMrEnclave";

  constructor(readonly logs?: string[]) {
    super("6015: ");
  }
}

export class InvalidReportData extends Error {
  static readonly code = 6016;
  readonly code = 6016;
  readonly name = "InvalidReportData";

  constructor(readonly logs?: string[]) {
    super("6016: ");
  }
}

export class InsufficientLoadAmount extends Error {
  static readonly code = 6017;
  readonly code = 6017;
  readonly name = "InsufficientLoadAmount";

  constructor(readonly logs?: string[]) {
    super("6017: ");
  }
}

export class IncorrectObservedTime extends Error {
  static readonly code = 6018;
  readonly code = 6018;
  readonly name = "IncorrectObservedTime";

  constructor(readonly logs?: string[]) {
    super("6018: ");
  }
}

export class InvalidQuoteMode extends Error {
  static readonly code = 6019;
  readonly code = 6019;
  readonly name = "InvalidQuoteMode";

  constructor(readonly logs?: string[]) {
    super("6019: ");
  }
}

export class InvalidVerifierIdx extends Error {
  static readonly code = 6020;
  readonly code = 6020;
  readonly name = "InvalidVerifierIdx";

  constructor(readonly logs?: string[]) {
    super("6020: ");
  }
}

export class InvalidSelfVerifyRequest extends Error {
  static readonly code = 6021;
  readonly code = 6021;
  readonly name = "InvalidSelfVerifyRequest";

  constructor(readonly logs?: string[]) {
    super("6021: ");
  }
}

export class IncorrectMrEnclave extends Error {
  static readonly code = 6022;
  readonly code = 6022;
  readonly name = "IncorrectMrEnclave";

  constructor(readonly logs?: string[]) {
    super("6022: ");
  }
}

export class InvalidResponder extends Error {
  static readonly code = 6023;
  readonly code = 6023;
  readonly name = "InvalidResponder";

  constructor(readonly logs?: string[]) {
    super("6023: ");
  }
}

export class InvalidAddressLookupAddress extends Error {
  static readonly code = 6024;
  readonly code = 6024;
  readonly name = "InvalidAddressLookupAddress";
  readonly msg =
    "The provided address_lookup_address did not match the expected address on-chain";

  constructor(readonly logs?: string[]) {
    super(
      "6024: The provided address_lookup_address did not match the expected address on-chain"
    );
  }
}

export class InvalidQueue extends Error {
  static readonly code = 6025;
  readonly code = 6025;
  readonly name = "InvalidQueue";
  readonly msg =
    "The provided attestation queue address did not match the expected address on-chain";

  constructor(readonly logs?: string[]) {
    super(
      "6025: The provided attestation queue address did not match the expected address on-chain"
    );
  }
}

export class IllegalVerifier extends Error {
  static readonly code = 6026;
  readonly code = 6026;
  readonly name = "IllegalVerifier";

  constructor(readonly logs?: string[]) {
    super("6026: ");
  }
}

export class InvalidEscrow extends Error {
  static readonly code = 6027;
  readonly code = 6027;
  readonly name = "InvalidEscrow";

  constructor(readonly logs?: string[]) {
    super("6027: ");
  }
}

export class InvalidAuthority extends Error {
  static readonly code = 6028;
  readonly code = 6028;
  readonly name = "InvalidAuthority";
  readonly msg =
    "The provided authority account does not match the expected value on-chain";

  constructor(readonly logs?: string[]) {
    super(
      "6028: The provided authority account does not match the expected value on-chain"
    );
  }
}

export class IllegalExecuteAttempt extends Error {
  static readonly code = 6029;
  readonly code = 6029;
  readonly name = "IllegalExecuteAttempt";

  constructor(readonly logs?: string[]) {
    super("6029: ");
  }
}

export class RequestExpired extends Error {
  static readonly code = 6030;
  readonly code = 6030;
  readonly name = "RequestExpired";
  readonly msg = "The requests expirationSlot has expired";

  constructor(readonly logs?: string[]) {
    super("6030: The requests expirationSlot has expired");
  }
}

export class InsufficientFunds extends Error {
  static readonly code = 6031;
  readonly code = 6031;
  readonly name = "InsufficientFunds";
  readonly msg = "The escrow has insufficient funds for this action";

  constructor(readonly logs?: string[]) {
    super("6031: The escrow has insufficient funds for this action");
  }
}

export class MissingFunctionEscrow extends Error {
  static readonly code = 6032;
  readonly code = 6032;
  readonly name = "MissingFunctionEscrow";
  readonly msg =
    "The FunctionAccount escrow is required if function.requests_request_fee is greater than zero";

  constructor(readonly logs?: string[]) {
    super(
      "6032: The FunctionAccount escrow is required if function.requests_request_fee is greater than zero"
    );
  }
}

export class InvalidRequest extends Error {
  static readonly code = 6033;
  readonly code = 6033;
  readonly name = "InvalidRequest";
  readonly msg =
    "The provided requestSlot did not match the expected requestSlot on-chain. The request may have already been processed";

  constructor(readonly logs?: string[]) {
    super(
      "6033: The provided requestSlot did not match the expected requestSlot on-chain. The request may have already been processed"
    );
  }
}

export class FunctionNotReady extends Error {
  static readonly code = 6034;
  readonly code = 6034;
  readonly name = "FunctionNotReady";
  readonly msg = "The FunctionAccount status is not active (1)";

  constructor(readonly logs?: string[]) {
    super("6034: The FunctionAccount status is not active (1)");
  }
}

export class UserRequestsDisabled extends Error {
  static readonly code = 6035;
  readonly code = 6035;
  readonly name = "UserRequestsDisabled";
  readonly msg =
    "The FunctionAccount has set requests_disabled to true and disabled this action";

  constructor(readonly logs?: string[]) {
    super(
      "6035: The FunctionAccount has set requests_disabled to true and disabled this action"
    );
  }
}

export class MissingFunctionAuthority extends Error {
  static readonly code = 6036;
  readonly code = 6036;
  readonly name = "MissingFunctionAuthority";
  readonly msg =
    "The FunctionAccount authority is required to sign if function.requests_require_authorization is enabled";

  constructor(readonly logs?: string[]) {
    super(
      "6036: The FunctionAccount authority is required to sign if function.requests_require_authorization is enabled"
    );
  }
}

export class FunctionCloseNotReady extends Error {
  static readonly code = 6037;
  readonly code = 6037;
  readonly name = "FunctionCloseNotReady";
  readonly msg =
    "The FunctionAccount must have no requests before it can be closed";

  constructor(readonly logs?: string[]) {
    super(
      "6037: The FunctionAccount must have no requests before it can be closed"
    );
  }
}

export class RequestAlreadyInitialized extends Error {
  static readonly code = 6038;
  readonly code = 6038;
  readonly name = "RequestAlreadyInitialized";
  readonly msg =
    "Attempting to initialize an already created FunctionRequestAccount";

  constructor(readonly logs?: string[]) {
    super(
      "6038: Attempting to initialize an already created FunctionRequestAccount"
    );
  }
}

export class AccountCloseNotPermitted extends Error {
  static readonly code = 6039;
  readonly code = 6039;
  readonly name = "AccountCloseNotPermitted";

  constructor(readonly logs?: string[]) {
    super("6039: ");
  }
}

export class AccountCloseNotReady extends Error {
  static readonly code = 6040;
  readonly code = 6040;
  readonly name = "AccountCloseNotReady";

  constructor(readonly logs?: string[]) {
    super("6040: ");
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new GenericError(logs);
    case 6001:
      return new InvalidQuote(logs);
    case 6002:
      return new QuoteExpired(logs);
    case 6003:
      return new InvalidNode(logs);
    case 6004:
      return new InsufficientQueue(logs);
    case 6005:
      return new QueueFull(logs);
    case 6006:
      return new InvalidEnclaveSigner(logs);
    case 6007:
      return new InvalidSigner(logs);
    case 6008:
      return new MrEnclavesEmpty(logs);
    case 6009:
      return new MrEnclaveAlreadyExists(logs);
    case 6010:
      return new MrEnclaveDoesntExist(logs);
    case 6011:
      return new MrEnclaveAtCapacity(logs);
    case 6012:
      return new PermissionDenied(logs);
    case 6013:
      return new InvalidConstraint(logs);
    case 6014:
      return new InvalidTimestamp(logs);
    case 6015:
      return new InvalidMrEnclave(logs);
    case 6016:
      return new InvalidReportData(logs);
    case 6017:
      return new InsufficientLoadAmount(logs);
    case 6018:
      return new IncorrectObservedTime(logs);
    case 6019:
      return new InvalidQuoteMode(logs);
    case 6020:
      return new InvalidVerifierIdx(logs);
    case 6021:
      return new InvalidSelfVerifyRequest(logs);
    case 6022:
      return new IncorrectMrEnclave(logs);
    case 6023:
      return new InvalidResponder(logs);
    case 6024:
      return new InvalidAddressLookupAddress(logs);
    case 6025:
      return new InvalidQueue(logs);
    case 6026:
      return new IllegalVerifier(logs);
    case 6027:
      return new InvalidEscrow(logs);
    case 6028:
      return new InvalidAuthority(logs);
    case 6029:
      return new IllegalExecuteAttempt(logs);
    case 6030:
      return new RequestExpired(logs);
    case 6031:
      return new InsufficientFunds(logs);
    case 6032:
      return new MissingFunctionEscrow(logs);
    case 6033:
      return new InvalidRequest(logs);
    case 6034:
      return new FunctionNotReady(logs);
    case 6035:
      return new UserRequestsDisabled(logs);
    case 6036:
      return new MissingFunctionAuthority(logs);
    case 6037:
      return new FunctionCloseNotReady(logs);
    case 6038:
      return new RequestAlreadyInitialized(logs);
    case 6039:
      return new AccountCloseNotPermitted(logs);
    case 6040:
      return new AccountCloseNotReady(logs);
  }

  return null;
}
