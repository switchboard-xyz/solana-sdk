import { OracleJob } from "@switchboard-xyz/v2-task-library";
import AbstractJobTemplate from "./template";

export class Raydium extends AbstractJobTemplate {
  url(): string {
    return `https://api.raydium.io/coin/price?coins`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: this.url(),
        }),
      }),
      OracleJob.Task.create({
        jsonParseTask: OracleJob.JsonParseTask.create({ path: `$.${this.id}` }),
      }),
    ];
    return tasks;
  }
}
