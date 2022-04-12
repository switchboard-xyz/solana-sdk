export class NoPayerKeypairProvided extends Error {
  constructor(message = "no payer keypair provided") {
    super(message);
    Object.setPrototypeOf(this, NoPayerKeypairProvided.prototype);
  }
}
