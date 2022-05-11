import { OracleJob } from "@switchboard-xyz/switchboard-v2";
import AbstractJobTemplate from "./template";

export class FtxUs extends AbstractJobTemplate {
  url(): string {
    return `https://ftx.us/api/markets/${this.id}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: this.url(),
        }),
      }),
      OracleJob.Task.create({
        jsonParseTask: OracleJob.JsonParseTask.create({
          path: "$.result.price",
        }),
      }),
    ];
    return tasks;
  }
}
