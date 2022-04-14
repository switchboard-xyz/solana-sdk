import { OracleJob } from "@switchboard-xyz/v2-task-library";
import AbstractJobTemplate from "./template";

export class Bitstamp extends AbstractJobTemplate {
  public id: string;

  url(): string {
    return `https://www.bitstamp.net/api/v2/ticker/${this.id.toLowerCase()}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: this.url(),
        }),
      }),
      OracleJob.Task.create({
        medianTask: OracleJob.MedianTask.create({
          tasks: [
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({ path: "$.ask" }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({ path: "$.bid" }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({ path: "$.last" }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
