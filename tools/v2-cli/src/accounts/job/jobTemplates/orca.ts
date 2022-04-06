import { OracleJob } from "@switchboard-xyz/switchboard-api";
import AbstractJobTemplate from "./template";

export class Orca extends AbstractJobTemplate {
  url(): string {
    return `https://api.orca.so/pools`;
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
          path: `$[?(@.name == '${this.id}[aquafarm]')].price`,
        }),
      }),
    ];
    return tasks;
  }
}
