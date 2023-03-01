import { OracleJob } from "@switchboard-xyz/common";
import fs from "fs";
import path from "path";

export const myOracleJob = OracleJob.fromObject(
  fs.readFileSync(path.join(path.dirname(__filename), "oracle-job.json"))
);
