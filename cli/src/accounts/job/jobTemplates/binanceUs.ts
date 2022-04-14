import { OracleJob } from "@switchboard-xyz/v2-task-library";
import AbstractJobTemplate from "./template";

export class BinanceUs extends AbstractJobTemplate {
  url(): string {
    return `https://www.binance.us/api/v3/ticker/price?symbol=${this.id}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: this.url(),
        }),
      }),
      OracleJob.Task.create({
        jsonParseTask: OracleJob.JsonParseTask.create({ path: "$.price" }),
      }),
    ];
    return tasks;
  }
}
