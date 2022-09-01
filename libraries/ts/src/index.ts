/* eslint-disable @typescript-eslint/no-var-requires */
/*eslint-disable import/extensions */
export * from "./protos/index.js";
export * from "./sbv2.js";

import protobuf from "protobufjs/minimal.js";

protobuf.util.toJSONOptions = {
  longs: String,
  enums: String,
  bytes: String,
  json: true,
};

// protobuf.util.toObject.
