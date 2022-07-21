/* eslint-disable @typescript-eslint/no-var-requires */
/*eslint-disable import/extensions */
export * from "./protos/index.js";
export * from "./sbv2.js";

import protobuf from "protobufjs/minimal.js";

// prevent enums from being converted to strings
protobuf.util.toJSONOptions = {
  longs: String,
  enums: Number,
  bytes: String,
  json: true,
};
