export class NoPayerKeypairProvided extends Error {
  constructor() {
    super(`need to provide --keypair flag to pay for any onchain accounts`);
    Object.setPrototypeOf(this, NoPayerKeypairProvided.prototype);
  }
}

export class AuthorityMismatch extends Error {
  constructor(message = "authority keypair does not match expected authority") {
    super(message);
    Object.setPrototypeOf(this, AuthorityMismatch.prototype);
  }
}

export class InvalidKeypairProvided extends Error {
  constructor(keypairPath: string) {
    super(`failed to load keypair resource ${keypairPath}`);
    Object.setPrototypeOf(this, InvalidKeypairProvided.prototype);
  }
}

export class InvalidKeypairFsPathProvided extends Error {
  constructor(keypairPath: string) {
    super(`no file found at ${keypairPath}`);
    Object.setPrototypeOf(this, InvalidKeypairFsPathProvided.prototype);
  }
}

export class OutputFileExistsNoForce extends Error {
  constructor(fsPath: string) {
    super(
      `output file exists. Run the command with '--force' to overwrite it (${fsPath})`
    );
    Object.setPrototypeOf(this, OutputFileExistsNoForce.prototype);
  }
}

export class InputFileNotFound extends Error {
  constructor(fsPath: string) {
    super(`failed to find input file (${fsPath})`);
    Object.setPrototypeOf(this, InputFileNotFound.prototype);
  }
}

export class AggregatorIllegalRoundOpenCall extends Error {
  constructor(message = "") {
    super(`aggregator update round called too early: ${message}`);
    Object.setPrototypeOf(this, AggregatorIllegalRoundOpenCall.prototype);
  }
}
