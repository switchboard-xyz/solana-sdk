import { SwitchboardProgram } from '../../SwitchboardProgram';
export type CustomError =
  | GenericError
  | InvalidQuoteError
  | QuoteExpiredError
  | InvalidNodeError
  | InsufficientQueueError
  | QueueFullError
  | InvalidSignerError
  | MrEnclaveAlreadyExists
  | MrEnclaveDoesntExist
  | MrEnclaveAtCapacity
  | PermissionDenied
  | InvalidConstraint
  | InvalidTimestamp
  | InvalidMrEnclave
  | InvalidReportData
  | InsufficientLoadAmountError
  | IncorrectObservedTimeError
  | InvalidQuoteMode;

export class GenericError extends Error {
  static readonly code = 6000;
  readonly code = 6000;
  readonly name = 'GenericError';

  constructor(readonly logs?: string[]) {
    super('6000: ');
  }
}

export class InvalidQuoteError extends Error {
  static readonly code = 6001;
  readonly code = 6001;
  readonly name = 'InvalidQuoteError';

  constructor(readonly logs?: string[]) {
    super('6001: ');
  }
}

export class QuoteExpiredError extends Error {
  static readonly code = 6002;
  readonly code = 6002;
  readonly name = 'QuoteExpiredError';

  constructor(readonly logs?: string[]) {
    super('6002: ');
  }
}

export class InvalidNodeError extends Error {
  static readonly code = 6003;
  readonly code = 6003;
  readonly name = 'InvalidNodeError';

  constructor(readonly logs?: string[]) {
    super('6003: ');
  }
}

export class InsufficientQueueError extends Error {
  static readonly code = 6004;
  readonly code = 6004;
  readonly name = 'InsufficientQueueError';

  constructor(readonly logs?: string[]) {
    super('6004: ');
  }
}

export class QueueFullError extends Error {
  static readonly code = 6005;
  readonly code = 6005;
  readonly name = 'QueueFullError';

  constructor(readonly logs?: string[]) {
    super('6005: ');
  }
}

export class InvalidSignerError extends Error {
  static readonly code = 6006;
  readonly code = 6006;
  readonly name = 'InvalidSignerError';

  constructor(readonly logs?: string[]) {
    super('6006: ');
  }
}

export class MrEnclaveAlreadyExists extends Error {
  static readonly code = 6007;
  readonly code = 6007;
  readonly name = 'MrEnclaveAlreadyExists';

  constructor(readonly logs?: string[]) {
    super('6007: ');
  }
}

export class MrEnclaveDoesntExist extends Error {
  static readonly code = 6008;
  readonly code = 6008;
  readonly name = 'MrEnclaveDoesntExist';

  constructor(readonly logs?: string[]) {
    super('6008: ');
  }
}

export class MrEnclaveAtCapacity extends Error {
  static readonly code = 6009;
  readonly code = 6009;
  readonly name = 'MrEnclaveAtCapacity';

  constructor(readonly logs?: string[]) {
    super('6009: ');
  }
}

export class PermissionDenied extends Error {
  static readonly code = 6010;
  readonly code = 6010;
  readonly name = 'PermissionDenied';

  constructor(readonly logs?: string[]) {
    super('6010: ');
  }
}

export class InvalidConstraint extends Error {
  static readonly code = 6011;
  readonly code = 6011;
  readonly name = 'InvalidConstraint';

  constructor(readonly logs?: string[]) {
    super('6011: ');
  }
}

export class InvalidTimestamp extends Error {
  static readonly code = 6012;
  readonly code = 6012;
  readonly name = 'InvalidTimestamp';

  constructor(readonly logs?: string[]) {
    super('6012: ');
  }
}

export class InvalidMrEnclave extends Error {
  static readonly code = 6013;
  readonly code = 6013;
  readonly name = 'InvalidMrEnclave';

  constructor(readonly logs?: string[]) {
    super('6013: ');
  }
}

export class InvalidReportData extends Error {
  static readonly code = 6014;
  readonly code = 6014;
  readonly name = 'InvalidReportData';

  constructor(readonly logs?: string[]) {
    super('6014: ');
  }
}

export class InsufficientLoadAmountError extends Error {
  static readonly code = 6015;
  readonly code = 6015;
  readonly name = 'InsufficientLoadAmountError';

  constructor(readonly logs?: string[]) {
    super('6015: ');
  }
}

export class IncorrectObservedTimeError extends Error {
  static readonly code = 6016;
  readonly code = 6016;
  readonly name = 'IncorrectObservedTimeError';

  constructor(readonly logs?: string[]) {
    super('6016: ');
  }
}

export class InvalidQuoteMode extends Error {
  static readonly code = 6017;
  readonly code = 6017;
  readonly name = 'InvalidQuoteMode';

  constructor(readonly logs?: string[]) {
    super('6017: ');
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new GenericError(logs);
    case 6001:
      return new InvalidQuoteError(logs);
    case 6002:
      return new QuoteExpiredError(logs);
    case 6003:
      return new InvalidNodeError(logs);
    case 6004:
      return new InsufficientQueueError(logs);
    case 6005:
      return new QueueFullError(logs);
    case 6006:
      return new InvalidSignerError(logs);
    case 6007:
      return new MrEnclaveAlreadyExists(logs);
    case 6008:
      return new MrEnclaveDoesntExist(logs);
    case 6009:
      return new MrEnclaveAtCapacity(logs);
    case 6010:
      return new PermissionDenied(logs);
    case 6011:
      return new InvalidConstraint(logs);
    case 6012:
      return new InvalidTimestamp(logs);
    case 6013:
      return new InvalidMrEnclave(logs);
    case 6014:
      return new InvalidReportData(logs);
    case 6015:
      return new InsufficientLoadAmountError(logs);
    case 6016:
      return new IncorrectObservedTimeError(logs);
    case 6017:
      return new InvalidQuoteMode(logs);
  }

  return null;
}
